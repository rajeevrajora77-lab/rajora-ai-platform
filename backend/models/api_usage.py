from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from core.database import Base

class APIUsage(Base):
    __tablename__ = "api_usage"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    endpoint = Column(String(255), nullable=False)
    model_name = Column(String(100))
    tokens_used = Column(Integer, default=0)
    latency_ms = Column(Integer)
    status_code = Column(Integer)
    cost = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<APIUsage(id={self.id}, user_id={self.user_id}, endpoint={self.endpoint})>"