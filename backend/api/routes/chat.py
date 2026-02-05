from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, AsyncGenerator
import json
import time
import logging

from core.database import get_db, get_redis
from core.security import get_current_user
from models.user import User
from models.conversation import Conversation, Message
from services.llm_service import LLMService

logger = logging.getLogger(__name__)
router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = "llama-3.1-70b"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2048
    stream: Optional[bool] = False
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    content: str
    model: str
    tokens_used: int
    latency_ms: int
    conversation_id: int

@router.post("/completions", response_model=ChatResponse)
async def chat_completion(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate chat completion (non-streaming)"""
    start_time = time.time()
    
    # Get or create conversation
    if request.conversation_id:
        conversation = db.query(Conversation).filter(
            Conversation.id == request.conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conversation = Conversation(
            user_id=current_user.id,
            model_name=request.model
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    
    # Initialize LLM service
    llm_service = LLMService(model_name=request.model)
    
    try:
        # Generate response
        response = await llm_service.generate(
            messages=[msg.dict() for msg in request.messages],
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        
        # Save user message
        user_message = Message(
            conversation_id=conversation.id,
            role="user",
            content=request.messages[-1].content,
            tokens_used=response.get("tokens_used", 0),
            latency_ms=latency_ms
        )
        db.add(user_message)
        
        # Save assistant message
        assistant_message = Message(
            conversation_id=conversation.id,
            role="assistant",
            content=response["content"],
            tokens_used=response.get("tokens_used", 0),
            latency_ms=latency_ms
        )
        db.add(assistant_message)
        db.commit()
        
        return ChatResponse(
            content=response["content"],
            model=request.model,
            tokens_used=response.get("tokens_used", 0),
            latency_ms=latency_ms,
            conversation_id=conversation.id
        )
    
    except Exception as e:
        logger.error(f"Chat completion error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """Generate chat completion (streaming)"""
    async def generate() -> AsyncGenerator[str, None]:
        llm_service = LLMService(model_name=request.model)
        
        try:
            async for chunk in llm_service.stream_generate(
                messages=[msg.dict() for msg in request.messages],
                temperature=request.temperature,
                max_tokens=request.max_tokens
            ):
                yield f"data: {json.dumps(chunk)}\n\n"
        except Exception as e:
            logger.error(f"Streaming error: {e}")
            yield f"data: {{\"error\": \"{str(e)}\"}}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@router.get("/conversations")
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's conversations"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id,
        Conversation.is_deleted == False
    ).order_by(Conversation.updated_at.desc()).all()
    
    return conversations

@router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get messages for a conversation"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.asc()).all()
    
    return messages