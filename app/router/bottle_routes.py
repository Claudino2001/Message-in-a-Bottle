from fastapi import APIRouter, Depends, HTTPException, status
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


@router.get("/check-daily")
def check_daily_limit(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna True se o usuário já enviou hoje, False se não."""
    repo = BottleRepository(db)
    has_sent = repo.has_sent_today(current_user.id)
    return {"has_sent_today": has_sent}


@router.post("/", response_model=BottleResponse)
def throw_bottle(
    bottle: BottleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = BottleRepository(db)

    if repo.has_sent_today(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Você já lançou sua garrafa diária ao oceano."
        )

    return repo.create(bottle, sender_id=current_user.id)


@router.get("/received", response_model=List[BottleResponse])
def get_my_bottles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = BottleRepository(db)
    return repo.get_received_by_user(current_user.id)
