from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class BottleCreate(BaseModel):
    title: str
    content: str


class BottleResponse(BaseModel):
    id: int
    title: str
    content: str
    sender_id: int
    created_at: datetime

    class Config:
        from_attributes = True
