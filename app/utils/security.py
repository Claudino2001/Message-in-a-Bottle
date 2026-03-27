from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()

    br_timezone = ZoneInfo("America/Sao_Paulo")

    now = datetime.now(br_timezone)

    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_email_token(data: dict, expires_delta: timedelta = timedelta(hours=24)):
    """Cria um token JWT específico para ações de e-mail (validade longa)"""
    to_encode = data.copy()
    expire = datetime.now(ZoneInfo("America/Sao_Paulo")) + expires_delta
    to_encode.update({"exp": expire, "scope": "email_action"}
                     )
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_email_token(token: str):
    """Decodifica e valida o token de e-mail"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("scope") != "email_action":
            return None
        return payload.get("sub")  # Retorna o email
    except JWTError:
        return None
