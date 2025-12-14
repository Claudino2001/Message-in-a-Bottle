from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.infra.sqlalchemy.config.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(255))
    language = Column(String(10), default='pt-BR')
    created_at = Column(DateTime, default=datetime.now)

    # Relacionamentos
    sent_bottles = relationship(
        "Bottle", foreign_keys="[Bottle.sender_id]", back_populates="sender")
    received_bottles = relationship(
        "Bottle", foreign_keys="[Bottle.recipient_id]", back_populates="recipient")


class Bottle(Base):
    __tablename__ = "bottles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    is_distributed = Column(Boolean, default=False)
    distribution_date = Column(Date, nullable=True)

    sender_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    sender = relationship("User", foreign_keys=[
                          sender_id], back_populates="sent_bottles")
    recipient = relationship("User", foreign_keys=[
                             recipient_id], back_populates="received_bottles")
