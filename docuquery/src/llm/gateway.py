"""LLM Gateway with fallback support and circuit breaker."""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Any

from src.core.exceptions import LLMException, LLMProviderError, LLMRateLimitError
from src.llm.providers.anthropic import AnthropicProvider
from src.llm.providers.base import BaseLLMProvider
from src.llm.providers.openai import OpenAIProvider

logger = logging.getLogger(__name__)


class CircuitBreaker:
    """Simple circuit breaker implementation."""

    def __init__(self, failure_threshold: int = 3, recovery_time: int = 60):
        self.failure_threshold = failure_threshold
        self.recovery_time = recovery_time
        self.failures = 0
        self.last_failure: datetime | None = None
        self.state = "closed"

    def record_failure(self):
        self.failures += 1
        self.last_failure = datetime.utcnow()
        if self.failures >= self.failure_threshold:
            self.state = "open"

    def record_success(self):
        self.failures = 0
        self.state = "closed"

    def can_execute(self) -> bool:
        if self.state == "closed":
            return True
        if self.state == "open" and self.last_failure:
            if datetime.utcnow() - self.last_failure > timedelta(
                seconds=self.recovery_time
            ):
                self.state = "half-open"
                return True
        return self.state == "half-open"


class LLMGateway:
    """
    Gateway for LLM requests with fallback support.

    Primary provider: OpenAI (GPT-4o)
    Fallback provider: Anthropic (Claude) - optional
    """

    def __init__(self):
        self.providers: dict[str, BaseLLMProvider] = {}
        self.circuit_breakers: dict[str, CircuitBreaker] = {}

        # Primary provider is always OpenAI
        self.providers["openai"] = OpenAIProvider()
        self.circuit_breakers["openai"] = CircuitBreaker()
        self.provider_order = ["openai"]

        # Add Anthropic as fallback if available
        anthropic_provider = AnthropicProvider()
        if anthropic_provider.is_available:
            self.providers["anthropic"] = anthropic_provider
            self.circuit_breakers["anthropic"] = CircuitBreaker()
            self.provider_order.append("anthropic")
            logger.info("Anthropic provider configured as fallback")
        else:
            logger.info("Running with OpenAI only (no fallback)")

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = None,
        max_tokens: int = None,
        max_retries: int = 2,
        **kwargs,
    ) -> dict[str, Any]:
        """Generate completion with automatic fallback."""
        last_error = None

        for provider_name in self.provider_order:
            provider = self.providers[provider_name]
            circuit_breaker = self.circuit_breakers[provider_name]

            if not circuit_breaker.can_execute():
                logger.warning(f"Circuit breaker open for {provider_name}, skipping")
                continue

            for attempt in range(max_retries):
                try:
                    logger.info(
                        f"Attempting completion with {provider_name} (attempt {attempt + 1})"
                    )
                    result = await provider.complete(
                        system_prompt=system_prompt,
                        user_prompt=user_prompt,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        **kwargs,
                    )
                    circuit_breaker.record_success()
                    return result

                except LLMRateLimitError as e:
                    last_error = e
                    logger.warning(f"Rate limit hit on {provider_name}, retrying...")
                    await asyncio.sleep(2**attempt)

                except LLMProviderError as e:
                    last_error = e
                    logger.error(f"Provider error from {provider_name}: {e}")
                    circuit_breaker.record_failure()
                    break

                except Exception as e:
                    last_error = e
                    logger.error(f"Unexpected error from {provider_name}: {e}")
                    circuit_breaker.record_failure()
                    break

        raise LLMException(f"All LLM providers failed. Last error: {last_error}")

    async def health_check(self) -> dict[str, bool]:
        """Check health of all providers."""
        results = {}
        for name, provider in self.providers.items():
            results[name] = await provider.health_check()
        return results
