"""LLM provider interface contract.

Every provider implementation (Anthropic direct, AWS Bedrock) must
implement `LLMClient` and return `LLMResponse`. Agent code depends only
on this interface.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from typing import AsyncIterator

from pydantic import BaseModel, ConfigDict


class LLMResponse(BaseModel):
    """Structured LLM response. Keep this stable across providers."""

    model_config = ConfigDict(protected_namespaces=())

    text: str
    input_tokens: int
    output_tokens: int
    stop_reason: str
    model_id: str
    guardrail_action: dict | None = None


class LLMClient(ABC):
    """Abstract LLM client. Implementations: AnthropicClient, BedrockClient."""

    @abstractmethod
    async def complete(
        self,
        *,
        system: str,
        user: str,
        max_tokens: int = 4096,
        temperature: float = 0.0,
        model_id: str | None = None,
    ) -> LLMResponse:
        """Synchronous (single-shot) completion. Returns full response when done."""

    @abstractmethod
    async def stream(
        self,
        *,
        system: str,
        user: str,
        max_tokens: int = 4096,
        temperature: float = 0.0,
        model_id: str | None = None,
    ) -> AsyncIterator[str]:
        """Streaming completion. Yields text deltas as they arrive."""
        if False:
            yield ""  # pragma: no cover (typing hint for AsyncIterator)
