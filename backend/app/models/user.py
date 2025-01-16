from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.db.database import Base
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, Dict

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    dietary_preferences = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# Pydantic models for request/response
class UserBase(BaseModel):
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    dietary_preferences: Optional[Dict] = None

class UserResponse(UserBase):
    id: int
    dietary_preferences: Dict
    created_at: datetime
    
    model_config = ConfigDict(
        from_attributes=True,
        arbitrary_types_allowed=True
    ) 