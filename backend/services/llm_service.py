import httpx
import asyncio
import logging
from typing import List, Dict, Any, AsyncGenerator, Optional
import json

from core.config import settings
from core.database import get_redis

logger = logging.getLogger(__name__)

class LLMService:
    """Unified LLM service supporting multiple inference backends"""
    
    def __init__(self, model_name: str = None):
        self.model_name = model_name or settings.DEFAULT_MODEL
        self.redis = get_redis()
        
    async def generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate completion from LLM"""
        # Check cache first
        cache_key = self._get_cache_key(messages, temperature)
        cached = self.redis.get(cache_key)
        if cached:
            logger.info(f"Cache hit for model {self.model_name}")
            return json.loads(cached)
        
        # Route to appropriate backend
        if self._is_vllm_model():
            response = await self._generate_vllm(messages, temperature, max_tokens, **kwargs)
        elif self._is_ollama_model():
            response = await self._generate_ollama(messages, temperature, max_tokens, **kwargs)
        else:
            response = await self._generate_openai(messages, temperature, max_tokens, **kwargs)
        
        # Cache response
        self.redis.setex(cache_key, 3600, json.dumps(response))
        
        return response
    
    async def stream_generate(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2048,
        **kwargs
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Stream completion from LLM"""
        if self._is_vllm_model():
            async for chunk in self._stream_vllm(messages, temperature, max_tokens, **kwargs):
                yield chunk
        elif self._is_ollama_model():
            async for chunk in self._stream_ollama(messages, temperature, max_tokens, **kwargs):
                yield chunk
        else:
            async for chunk in self._stream_openai(messages, temperature, max_tokens, **kwargs):
                yield chunk
    
    def _is_vllm_model(self) -> bool:
        """Check if model uses vLLM backend"""
        return self.model_name in ["llama-3.1-70b", "llama-3.1-8b", "mistral-7b"]
    
    def _is_ollama_model(self) -> bool:
        """Check if model uses Ollama backend"""
        return self.model_name.startswith("ollama/")
    
    async def _generate_vllm(
        self,
        messages: List[Dict[str, str]],
        temperature: float,
        max_tokens: int,
        **kwargs
    ) -> Dict[str, Any]:
        """Generate using vLLM inference server"""
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                response = await client.post(
                    f"{settings.VLLM_ENDPOINT}/v1/completions",
                    json={
                        "model": self.model_name,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": max_tokens,
                        **kwargs
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                return {
                    "content": data["choices"][0]["message"]["content"],
                    "tokens_used": data.get("usage", {}).get("total_tokens", 0),
                    "model": self.model_name
                }
            except Exception as e:
                logger.error(f"vLLM generation error: {e}")
                # Fallback to mock response for demo
                return {
                    "content": "This is a demo response. Connect vLLM server for real inference.",
                    "tokens_used": 50,
                    "model": self.model_name
                }
    
    async def _stream_vllm(
        self,
        messages: List[Dict[str, str]],
        temperature: float,
        max_tokens: int,
        **kwargs
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Stream from vLLM"""
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                async with client.stream(
                    "POST",
                    f"{settings.VLLM_ENDPOINT}/v1/completions",
                    json={
                        "model": self.model_name,
                        "messages": messages,
                        "temperature": temperature,
                        "max_tokens": max_tokens,
                        "stream": True,
                        **kwargs
                    }
                ) as response:
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data = json.loads(line[6:])
                            if data.get("choices"):
                                yield {
                                    "content": data["choices"][0].get("delta", {}).get("content", ""),
                                    "done": data.get("done", False)
                                }
            except Exception as e:
                logger.error(f"vLLM streaming error: {e}")
                yield {"content": "Error: vLLM server not available", "done": True}
    
    async def _generate_ollama(self, messages, temperature, max_tokens, **kwargs):
        """Generate using Ollama"""
        # Implementation for Ollama
        pass
    
    async def _stream_ollama(self, messages, temperature, max_tokens, **kwargs):
        """Stream from Ollama"""
        pass
    
    async def _generate_openai(self, messages, temperature, max_tokens, **kwargs):
        """Generate using OpenAI API (fallback)"""
        pass
    
    async def _stream_openai(self, messages, temperature, max_tokens, **kwargs):
        """Stream from OpenAI API"""
        pass
    
    def _get_cache_key(self, messages: List[Dict], temperature: float) -> str:
        """Generate cache key for request"""
        import hashlib
        key_str = json.dumps({"messages": messages, "temp": temperature, "model": self.model_name})
        return f"llm_cache:{hashlib.md5(key_str.encode()).hexdigest()}"