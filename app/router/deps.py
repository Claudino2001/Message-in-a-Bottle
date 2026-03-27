from fastapi import Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.infra.sqlalchemy.config.database import get_db
from app.infra.sqlalchemy.repositorios.user_repository import UserRepository
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
import os
from app.utils.security import SECRET_KEY, ALGORITHM

# O tokenUrl aponta para onde o cliente pega o token (para documentação Swagger)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Busca o usuário no banco
    # Obs: Você precisará implementar um método simples 'get_by_email' no seu UserRepository
    user_repo = UserRepository(db)
    user = user_repo.get_by_email(email)

    if user is None:
        raise credentials_exception
    return user

# --- NOVA DEPENDÊNCIA DE VERIFICAÇÃO DE CHAVE DE DISTRIBUIÇÃO ---
API_KEY_NAME = "X-Distribution-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def verify_distribution_key(api_key: str = Security(api_key_header)):
    """
    Verifica se a requisição possui a chave mestra de distribuição.
    Protege a rota contra acesso não autorizado (mesmo de usuários logados).
    """
    server_secret = os.getenv("DISTRIBUTION_SECRET")
    
    if not server_secret:
        # Segurança por padrão: se não configurou a senha, ninguém entra.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro de configuração: DISTRIBUTION_SECRET não definido no servidor."
        )

    if api_key != server_secret:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado: Chave de distribuição inválida ou ausente."
        )
    
    return api_key
