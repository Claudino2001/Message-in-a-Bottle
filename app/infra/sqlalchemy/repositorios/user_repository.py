from sqlalchemy.orm import Session
from app.infra.sqlalchemy.models.models import User
from app.schemas.auth_schema import UserCreate


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):
        """Busca um usuário pelo email (case insensitive se necessário)"""
        return self.db.query(User).filter(User.email == email).first()

    def get_by_username(self, username: str):
        """Busca um usuário pelo username"""
        return self.db.query(User).filter(User.username == username).first()

    def get_by_id(self, user_id: int):
        """Busca um usuário pelo ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def create(self, user: UserCreate, hashed_password: str):
        """Cria um novo usuário no banco de dados"""
        db_user = User(
            username=user.username,
            email=user.email,
            password_hash=hashed_password,
            language="pt-BR"  # Default, mas você pode expandir o schema para aceitar isso
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
