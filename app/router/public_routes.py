from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infra.sqlalchemy.config.database import get_db
from app.infra.sqlalchemy.repositorios.bottle_repository import BottleRepository

# Sem dependências de segurança (Depends(get_current_user))
router = APIRouter(
    prefix="/public",
    tags=["Public"]
)

@router.get("/ocean-stats")
def get_ocean_stats(db: Session = Depends(get_db)):
    """
    Retorna o total de garrafas que ainda estão 'boiando' no oceano
    (ou seja, ainda não foram distribuídas).
    """
    repo = BottleRepository(db)
    count = repo.count_floating()
    
    return {
        "bottles_in_ocean": count,
        "message": f"Existem {count} garrafas esperando por um destino."
    }