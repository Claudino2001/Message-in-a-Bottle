from sqlalchemy.orm import Session
from fastapi import HTTPException, status, BackgroundTasks
from app.schemas.auth_schema import LoginRequest, UserCreate
from app.infra.sqlalchemy.repositorios.user_repository import UserRepository
from app.utils.security import verify_password, create_access_token, get_password_hash, create_email_token, decode_email_token
from app.utils.email_utils import send_verification_email, send_reset_password_email
from datetime import timedelta


class AuthController:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    async def register(self, user_data: UserCreate, bg_tasks: BackgroundTasks):
        # 1. Verifica se o Nome de Usuário já existe
        if self.repo.get_by_username(user_data.username):
            raise HTTPException(
                status_code=400, 
                detail="Este nome de usuário já está em uso. Por favor, escolha outro."
            )

        # 2. Verifica se o E-mail já existe
        if self.repo.get_by_email(user_data.email):
            raise HTTPException(
                status_code=400, 
                detail="Este e-mail já está cadastrado. Tente fazer login ou recuperar sua senha."
            )

        # Se passou, cria o usuário
        hashed_pw = get_password_hash(user_data.password)
        new_user = self.repo.create(user_data, hashed_password=hashed_pw)

        token = create_email_token({"sub": new_user.email})
        bg_tasks.add_task(send_verification_email, new_user.email, token)

        return new_user

    def login(self, login_data: LoginRequest):
        user = self.repo.get_by_email(login_data.email)

        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email ou senha incorretos",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_verified:
            raise HTTPException(status_code=400, detail="Verifique seu e-mail antes de entrar.")

        access_token = create_access_token(
            data={"sub": user.email}
        )

        return {"access_token": access_token, "token_type": "bearer"}

    def verify_email(self, token: str):
        email = decode_email_token(token)
        if not email:
            raise HTTPException(
                status_code=400, detail="Token inválido ou expirado")

        user = self.repo.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=404, detail="Usuário não encontrado")

        user.is_verified = True
        self.repo.db.commit()  # Salva a verificação

        return {"message": "E-mail verificado com sucesso! Pode fechar esta janela."}

    async def request_password_reset(self, email: str, bg_tasks: BackgroundTasks):
        user = self.repo.get_by_email(email)
        if user:
            # Gera token e envia e-mail
            token = create_email_token(
                {"sub": user.email}, expires_delta=timedelta(hours=1))
            bg_tasks.add_task(send_reset_password_email, user.email, token)
        # Por segurança, sempre retornamos sucesso mesmo se o email não existir

    def confirm_password_reset(self, token: str, new_password: str):
        email = decode_email_token(token)
        if not email:
            raise HTTPException(
                status_code=400, detail="Link inválido ou expirado")

        user = self.repo.get_by_email(email)
        if not user:
            raise HTTPException(
                status_code=404, detail="Usuário não encontrado")

        # Validação extra de senha forte deveria ocorrer aqui ou no schema
        user.password_hash = get_password_hash(new_password)
        self.repo.db.commit()

        return {"message": "Senha alterada com sucesso!"}
