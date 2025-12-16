from sqlalchemy.orm import Session
from app.infra.sqlalchemy.repositorios.bottle_repository import BottleRepository
import random
from datetime import date
from fastapi import BackgroundTasks
from app.utils.email_utils import send_tide_notification
from app.infra.sqlalchemy.models.models import User


class GameController:
    def __init__(self, db: Session):
        self.db = db
        self.repo = BottleRepository(db)

    def distribute_daily_bottles(self, bg_tasks: BackgroundTasks = None):
        bottles = self.repo.get_pending_bottles()
        n = len(bottles)

        if n < 2:
            return {"message": "Garrafas insuficientes...", "count": n}

        random.shuffle(bottles)

        recipients_emails = []

        for i in range(n):
            current_bottle = bottles[i]
            next_index = (i + 1) % n
            target_bottle = bottles[next_index]

            current_bottle.recipient_id = target_bottle.sender_id
            current_bottle.is_distributed = True
            current_bottle.distribution_date = date.today()

            recipient_user = self.db.query(User).filter(
                User.id == target_bottle.sender_id).first()

            if recipient_user and recipient_user.email:
                recipients_emails.append(recipient_user.email)

        self.repo.save_distribution(bottles)

        if bg_tasks and recipients_emails:
            bg_tasks.add_task(send_tide_notification, recipients_emails)

        return {"message": "Distribuição realizada...", "pairs_created": n}
