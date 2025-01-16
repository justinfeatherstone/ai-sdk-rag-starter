from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
from ..db.database import Base

class NutritionDocument(Base):
    __tablename__ = "nutrition_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    source = Column(String)
    embedding = Column(ARRAY(Float))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<NutritionDocument(id={self.id}, title='{self.title}')>"

class NutritionQuery(Base):
    __tablename__ = "nutrition_queries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    query = Column(Text)
    embedding = Column(ARRAY(Float))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="queries")

    def __repr__(self):
        return f"<NutritionQuery(id={self.id}, query='{self.query[:50]}...')" 