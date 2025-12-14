from sqlalchemy.orm import Session
from app.schemas.auth_schema import LoginRequest, UserCreate
from app.infra.sqlalchemy.repositorios.user_repository import UserRepository
from app.utils.security import verify_password, create_access_token, get_password_hash
from fastapi import HTTPException, status
from datetime import timedelta


class AuthController:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, user_data: UserCreate):
        if self.repo.get_by_email(user_data.email):
            raise HTTPException(status_code=400, detail="Email já cadastrado")

        # Hash da senha antes de salvar
        hashed_pw = get_password_hash(user_data.password)

        # Criação (Adapte para o seu modelo de repositório)
        new_user = self.repo.create(user_data, hashed_password=hashed_pw)
        return new_user

    def login(self, login_data: LoginRequest):
        user = self.repo.get_by_email(login_data.email)

        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Gera o token
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}
