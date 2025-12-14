from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.infra.sqlalchemy.config.database import get_db
from app.infra.sqlalchemy.repositorios.user_repository import UserRepository
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
