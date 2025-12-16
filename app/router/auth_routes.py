from fastapi import APIRouter, Depends, BackgroundTasks, Body, HTTPException, status
from sqlalchemy.orm import Session
from app.infra.sqlalchemy.config.database import get_db
from app.schemas.auth_schema import LoginRequest, Token, UserCreate, UserResponse
from app.controllers.auth_controller import AuthController
from pydantic import EmailStr

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=UserResponse)
async def register(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    controller = AuthController(db)
    return await controller.register(user, background_tasks)


@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    controller = AuthController(db)
    return controller.login(request)


@router.get("/verify-email")
async def verify_email(token: str, db: Session = Depends(get_db)):
    controller = AuthController(db)
    return controller.verify_email(token)


@router.post("/forgot-password")
async def forgot_password(
    background_tasks: BackgroundTasks,
    email: EmailStr = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    """Usuário pede o reset de senha"""
    controller = AuthController(db)
    await controller.request_password_reset(email, background_tasks)
    return {"message": "Se o e-mail existir, enviamos um link de recuperação."}


@router.post("/reset-password")
async def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db)
):
    """Usuário envia o token recebido no e-mail e a nova senha"""
    controller = AuthController(db)
    return controller.confirm_password_reset(token, new_password)
