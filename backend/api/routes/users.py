from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from core.database import get_db
from core.security import get_current_user
from models.user import User
from models.api_usage import APIUsage

router = APIRouter()

@router.get("/usage")
async def get_usage_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's API usage statistics"""
    usage = db.query(APIUsage).filter(
        APIUsage.user_id == current_user.id
    ).all()
    
    total_tokens = sum(u.tokens_used for u in usage)
    total_cost = sum(u.cost for u in usage)
    
    return {
        "total_requests": len(usage),
        "total_tokens": total_tokens,
        "total_cost": total_cost,
        "recent_usage": usage[:10]
    }