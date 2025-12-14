from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infra.sqlalchemy.config.database import get_db
from app.controllers.game_controller import GameController
from app.router.deps import verify_distribution_key

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(verify_distribution_key)]
)


@router.post("/distribute")
def trigger_distribution(db: Session = Depends(get_db)):
    """
    Dispara o sorteio das garrafas.
    Requer o header 'X-Distribution-Key' configurado no .env
    """
    controller = GameController(db)
    return controller.distribute_daily_bottles()
