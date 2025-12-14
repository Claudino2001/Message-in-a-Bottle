from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.infra.sqlalchemy.config.database import get_db
from app.schemas.auth_schema import LoginRequest, Token, UserCreate, UserResponse
from app.controllers.auth_controller import AuthController

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    controller = AuthController(db)
    return controller.register(user)


@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    controller = AuthController(db)
    return controller.login(request)
