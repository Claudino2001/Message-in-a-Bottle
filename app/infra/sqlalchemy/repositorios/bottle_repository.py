from sqlalchemy.orm import Session
from sqlalchemy import func
from app.infra.sqlalchemy.models.models import Bottle
from app.schemas.bottle_schema import BottleCreate
from datetime import date


class BottleRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, bottle: BottleCreate, sender_id: int):
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

    def get_pending_bottles(self):
        ''' Pega garrafas que ainda não foram distribuídas '''
        return self.db.query(Bottle).filter(Bottle.is_distributed == False).all()

    def get_received_by_user(self, user_id: int):
        return self.db.query(Bottle).filter(Bottle.recipient_id == user_id).all()

    def count_floating(self):
        return self.db.query(Bottle).filter(Bottle.is_distributed == False).count()

    def save_distribution(self, bottles_list):
        # Commit em massa após alterar os recipientes
        self.db.add_all(bottles_list)
        self.db.commit()
