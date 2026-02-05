from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class ModelRegistry:
    """Central registry for available LLM models"""
    
    MODELS = {
        "llama-3.1-70b": {
            "id": "llama-3.1-70b",
            "name": "Llama 3.1 70B",
            "description": "Meta's flagship open-source model with 70B parameters",
            "context_length": 128000,
            "cost_per_1k_tokens": 0.0008,
            "latency_p50_ms": 45,
            "latency_p99_ms": 156,
            "available": True,
            "provider": "vllm"
        },
        "llama-3.1-8b": {
            "id": "llama-3.1-8b",
            "name": "Llama 3.1 8B",
            "description": "Compact and fast Llama model",
            "context_length": 128000,
            "cost_per_1k_tokens": 0.0001,
            "latency_p50_ms": 12,
            "latency_p99_ms": 45,
            "available": True,
            "provider": "vllm"
        },
        "mistral-7b": {
            "id": "mistral-7b",
            "name": "Mistral 7B",
            "description": "Efficient and powerful 7B parameter model",
            "context_length": 32768,
            "cost_per_1k_tokens": 0.0002,
            "latency_p50_ms": 18,
            "latency_p99_ms": 67,
            "available": True,
            "provider": "vllm"
        },
        "qwen-2.5-72b": {
            "id": "qwen-2.5-72b",
            "name": "Qwen 2.5 72B",
            "description": "Alibaba's powerful multilingual model",
            "context_length": 131072,
            "cost_per_1k_tokens": 0.0009,
            "latency_p50_ms": 52,
            "latency_p99_ms": 178,
            "available": True,
            "provider": "vllm"
        }
    }
    
    def get_all_models(self) -> List[Dict]:
        """Get all registered models"""
        return list(self.MODELS.values())
    
    def get_model(self, model_id: str) -> Optional[Dict]:
        """Get specific model by ID"""
        return self.MODELS.get(model_id)
    
    def is_model_available(self, model_id: str) -> bool:
        """Check if model is available"""
        model = self.get_model(model_id)
        return model and model.get("available", False)