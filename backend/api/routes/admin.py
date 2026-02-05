from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any
import logging

from core.database import get_db
from core.security import get_current_admin_user
from models.user import User
from models.api_usage import APIUsage

logger = logging.getLogger(__name__)
router = APIRouter()

class SystemConfig(BaseModel):
    feature_flags: Dict[str, bool]
    default_model: str
    rate_limits: Dict[str, int]
    maintenance_mode: bool

class ContentUpdate(BaseModel):
    page: str
    section: str
    content: Dict[str, Any]

@router.get("/stats")
async def get_system_stats(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """Get system statistics"""
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    total_api_calls = db.query(APIUsage).count()
    
    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "admins": db.query(User).filter(User.is_admin == True).count()
        },
        "api": {
            "total_calls": total_api_calls,
            "calls_today": 0,  # Implement date filter
            "total_tokens": db.query(APIUsage).with_entities(
                db.func.sum(APIUsage.tokens_used)
            ).scalar() or 0
        },
        "models": {
            "active": 4,
            "total_requests": total_api_calls
        }
    }

@router.get("/config", response_model=SystemConfig)
async def get_config(current_admin: User = Depends(get_current_admin_user)):
    """Get system configuration"""
    # This would be stored in database/Redis in production
    return SystemConfig(
        feature_flags={
            "chat_enabled": True,
            "api_enabled": True,
            "streaming_enabled": True,
            "file_upload_enabled": True
        },
        default_model="llama-3.1-70b",
        rate_limits={
            "requests_per_minute": 60,
            "tokens_per_day": 100000
        },
        maintenance_mode=False
    )

@router.post("/config")
async def update_config(
    config: SystemConfig,
    current_admin: User = Depends(get_current_admin_user)
):
    """Update system configuration"""
    # Store in database/Redis
    logger.info(f"Config updated by admin {current_admin.username}")
    return {"status": "success", "message": "Configuration updated"}

@router.post("/content")
async def update_content(
    update: ContentUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Update page content (CMS functionality)"""
    # Store content updates in database
    logger.info(f"Content updated: {update.page}/{update.section} by {current_admin.username}")
    return {"status": "success", "message": "Content updated"}

@router.post("/deploy")
async def trigger_deployment(
    strategy: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Trigger deployment (blue-green or canary)"""
    if strategy not in ["blue-green", "canary"]:
        raise HTTPException(status_code=400, detail="Invalid deployment strategy")
    
    logger.info(f"Deployment triggered: {strategy} by {current_admin.username}")
    
    # In production, this would trigger AWS CodeDeploy or ECS deployment
    return {
        "status": "success",
        "message": f"{strategy} deployment initiated",
        "deployment_id": "deploy-123456"
    }

@router.get("/users")
async def list_all_users(
    current_admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    """List all users (admin only)"""
    users = db.query(User).all()
    return users