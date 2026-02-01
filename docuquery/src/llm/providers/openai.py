"""OpenAI LLM provider."""

import logging
from typing import Any

from openai import AsyncOpenAI

from config.settings import settings
from src.core.exceptions import LLMProviderError, LLMRateLimitError, LLMTimeoutError
from src.llm.providers.base import BaseLLMProvider

logger = logging.getLogger(__name__)


class OpenAIProvider(BaseLLMProvider):
    """OpenAI GPT provider - Primary LLM provider."""

    def __init__(self, model: str = None):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = model or settings.llm_model  # Defaults to gpt-4o

    @property
    def name(self) -> str:
        return "openai"

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = None,
        max_tokens: int = None,
        **kwargs,
    ) -> dict[str, Any]:
        """Generate completion using GPT."""
        temperature = (
            temperature if temperature is not None else settings.llm_temperature
        )
        max_tokens = max_tokens or settings.llm_max_tokens

        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                temperature=temperature,
                max_tokens=max_tokens,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
            )

            content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens

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
            elif "rate" in error_msg:
                raise LLMRateLimitError(f"Rate limit exceeded: {e}")
            else:
                raise LLMProviderError(f"OpenAI API error: {e}")

    async def health_check(self) -> bool:
        """Check if OpenAI is accessible."""
        try:
            await self.client.chat.completions.create(
                model=self.model,
                max_tokens=10,
                messages=[{"role": "user", "content": "hi"}],
            )
            return True
        except Exception:
            return False
