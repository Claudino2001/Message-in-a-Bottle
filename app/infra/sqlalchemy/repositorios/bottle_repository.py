from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date  # <--- Importe isso
from app.infra.sqlalchemy.models.models import Bottle
from app.schemas.bottle_schema import BottleCreate
from datetime import date


class BottleRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, bottle: BottleCreate, sender_id: int):
        # A verificação será feita na rota (controller/router) para lançar o erro HTTP correto
        db_bottle = Bottle(
            title=bottle.title,
            content=bottle.content,
            sender_id=sender_id,
            is_distributed=False
        )
        self.db.add(db_bottle)
        self.db.commit()
        self.db.refresh(db_bottle)
        return db_bottle

    def has_sent_today(self, user_id: int) -> bool:
        """Verifica se o usuário já enviou uma garrafa na data de hoje"""
        today = date.today()

        exists = self.db.query(Bottle).filter(
            Bottle.sender_id == user_id,
            cast(Bottle.created_at, Date) == today
        ).first()

        return exists is not None

    def get_pending_bottles(self):
        return self.db.query(Bottle).filter(Bottle.is_distributed == False).all()

    def get_received_by_user(self, user_id: int):
        return self.db.query(Bottle).filter(Bottle.recipient_id == user_id).all()

    def count_floating(self):
        return self.db.query(Bottle).filter(Bottle.is_distributed == False).count()

    def save_distribution(self, bottles_list):
        self.db.add_all(bottles_list)
        self.db.commit()
