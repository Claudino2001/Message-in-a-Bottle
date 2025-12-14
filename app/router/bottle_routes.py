from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.infra.sqlalchemy.config.database import get_db
from app.schemas.bottle_schema import BottleCreate, BottleResponse
from app.infra.sqlalchemy.repositorios.bottle_repository import BottleRepository
from app.controllers.game_controller import GameController  # <--- IMPORTAR ISTO
from app.router.deps import get_current_user, verify_distribution_key
from app.infra.sqlalchemy.models.models import User

router = APIRouter(
    prefix="/bottles",
    tags=["bottles"],
    dependencies=[Depends(get_current_user)]
)


@router.post("/", response_model=BottleResponse)
def throw_bottle(
    bottle: BottleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = BottleRepository(db)
    return repo.create(bottle, sender_id=current_user.id)


@router.get("/received", response_model=List[BottleResponse])
def get_my_bottles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = BottleRepository(db)
    return repo.get_received_by_user(current_user.id)


@router.post("/distribute", dependencies=[Depends(verify_distribution_key)])
def trigger_distribution(
    db: Session = Depends(get_db)
):
    """
    Dispara o sorteio das garrafas.
    """
    controller = GameController(db)
    return controller.distribute_daily_bottles()