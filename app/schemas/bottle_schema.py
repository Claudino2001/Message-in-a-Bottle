from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class BottleCreate(BaseModel):
    title: str = Field(..., max_length=100) 
    content: str = Field(..., max_length=3000)

class BottleResponse(BaseModel):
    id: int
    title: str
    content: str
    sender_id: int
    created_at: datetime

    class Config:
        from_attributes = True
