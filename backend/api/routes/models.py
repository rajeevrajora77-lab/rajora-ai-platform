from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging

from core.security import get_current_user
from models.user import User
from services.model_registry import ModelRegistry

logger = logging.getLogger(__name__)
router = APIRouter()

class ModelInfo(BaseModel):
    id: str
    name: str
    description: str
    context_length: int
    cost_per_1k_tokens: float
    latency_p50_ms: int
    latency_p99_ms: int
    available: bool
    provider: str

@router.get("/list", response_model=List[ModelInfo])
async def list_models(current_user: User = Depends(get_current_user)):
    """List all available models"""
    registry = ModelRegistry()
    models = registry.get_all_models()
    return models

@router.get("/{model_id}", response_model=ModelInfo)
async def get_model_info(
    model_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get detailed model information"""
    registry = ModelRegistry()
    model = registry.get_model(model_id)
    
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    return model

@router.get("/{model_id}/benchmarks")
async def get_model_benchmarks(
    model_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get model benchmark data"""
    # Mock benchmark data - replace with real metrics
    return {
        "model_id": model_id,
        "benchmarks": {
            "mmlu": 0.87,
            "hellaswag": 0.92,
            "truthfulqa": 0.78,
            "humaneval": 0.65
        },
        "performance": {
            "avg_latency_ms": 45,
            "p50_latency_ms": 38,
            "p95_latency_ms": 89,
            "p99_latency_ms": 156,
            "tokens_per_second": 120
        }
    }

@router.post("/switch")
async def switch_default_model(
    model_id: str,
    current_user: User = Depends(get_current_user)
):
    """Switch user's default model"""
    # This would update user preferences
    return {
        "status": "success",
        "message": f"Default model switched to {model_id}"
    }