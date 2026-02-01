"""Anthropic (Claude) LLM provider - Optional fallback."""

import logging
from typing import Any

from config.settings import settings
from src.core.exceptions import LLMProviderError, LLMRateLimitError, LLMTimeoutError
from src.llm.providers.base import BaseLLMProvider

logger = logging.getLogger(__name__)


class AnthropicProvider(BaseLLMProvider):
    """Anthropic Claude provider - Optional fallback provider."""

    def __init__(self):
        self.client: Any | None = None
        self.model = "claude-3-5-sonnet-20241022"
        self.timeout = settings.llm_timeout
        self._initialized = False

        # Only initialize if API key is provided
        if settings.anthropic_api_key:
            try:
                from anthropic import AsyncAnthropic

                self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)
                self._initialized = True
            except ImportError:
                logger.warning(
                    "anthropic package not installed, Anthropic provider disabled"
                )

    @property
    def name(self) -> str:
        return "anthropic"

    @property
    def is_available(self) -> bool:
        """Check if Anthropic provider is available."""
        return self._initialized and self.client is not None

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = None,
        max_tokens: int = None,
        **kwargs,
    ) -> dict[str, Any]:
        """Generate completion using Claude."""
        if not self.is_available:
            raise LLMProviderError("Anthropic provider not configured")

        temperature = (
            temperature if temperature is not None else settings.llm_temperature
        )
        max_tokens = max_tokens or settings.llm_max_tokens

        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )

            content = response.content[0].text
            tokens_used = response.usage.input_tokens + response.usage.output_tokens

            return {
                "content": content,
                "tokens_used": tokens_used,
                "model": self.model,
                "provider": self.name,
            }

        except Exception as e:
            error_msg = str(e).lower()

            if "timeout" in error_msg:
                raise LLMTimeoutError(f"Request timed out: {e}")
            elif "rate" in error_msg and "limit" in error_msg:
                raise LLMRateLimitError(f"Rate limit exceeded: {e}")
            else:
                raise LLMProviderError(f"Anthropic API error: {e}")

    async def health_check(self) -> bool:
        """Check if Anthropic is accessible."""
        if not self.is_available:
            return False

        try:
            await self.client.messages.create(
                model=self.model,
                max_tokens=10,
                messages=[{"role": "user", "content": "hi"}],
            )
            return True
        except Exception:
            return False
