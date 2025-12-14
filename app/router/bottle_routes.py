from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.infra.sqlalchemy.config.database import get_db
from app.schemas.bottle_schema import BottleCreate, BottleResponse
from app.infra.sqlalchemy.repositorios.bottle_repository import BottleRepository
from app.router.deps import get_current_user
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
    # Sobrescrevemos o sender_id com o ID do usuário logado (Segurança)
    bottle.sender_id = current_user.id
    return repo.create(bottle)


@router.get("/received", response_model=List[BottleResponse])
def get_my_bottles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = BottleRepository(db)
    return repo.get_received_by_user(current_user.id)
