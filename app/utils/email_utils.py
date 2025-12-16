import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from typing import List
from app.infra.sqlalchemy.models.models import User

# Configurações obtidas do .env
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


async def send_verification_email(email: EmailStr, token: str):
    """Envia e-mail de boas-vindas com link de ativação"""

    base_url = os.getenv("FRONTEND_URL", "http://localhost")
    verify_link = f"{base_url}/verify-email?token={token}"

    html = f"""
    <h1>Bem-vindo à Ilha! 🏝️</h1>
    <p>Obrigado por se juntar aos naúfragos digitais.</p>
    <p>Para ativar sua conta e começar a lançar garrafas, clique no link abaixo:</p>
    <a href="{verify_link}" style="padding: 10px 20px; background-color: #F4A460; color: white; text-decoration: none; border-radius: 5px;">ATIVAR CONTA</a>
    <p>Se você não criou esta conta, ignore este e-mail.</p>
    """

    message = MessageSchema(
        subject="Ative sua conta! 🌴🥥",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)


async def send_reset_password_email(email: EmailStr, token: str):
    """Envia link para recuperar senha"""
    base_url = os.getenv("FRONTEND_URL", "http://localhost")
    reset_link = f"{base_url}/reset-password?token={token}"

    html = f"""
    <h1>Recuperação de Senha 🔐</h1>
    <p>Recebemos um pedido para resetar sua senha.</p>
    <p>Clique no botão abaixo para criar uma nova senha:</p>
    <a href="{reset_link}" style="padding: 10px 20px; background-color: #00BFFF; color: white; text-decoration: none; border-radius: 5px;">RESETAR SENHA</a>
    <p>Link válido por 1 hora.</p>
    """

    message = MessageSchema(
        subject="Recuperação de Senha - Message in a Bottle 🙈",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)


async def send_tide_notification(emails: List[EmailStr]):
    """
    Envia e-mail em massa avisando que a maré trouxe garrafas.
    Usado pelo Cron Job das 22h.
    """
    if not emails:
        return

    base_url = os.getenv("FRONTEND_URL", "http://localhost")
    
    html = f"""
    <h1>A Maré Subiu! 🌊🌕</h1>
    <p>Olá, Náufrago!</p>
    <p>A distribuição diária ocorreu e a maré pode ter trazido algo para você.</p>
    <p>Acesse o site agora para ver se você recebeu uma nova garrafa.</p>
    <br>
    <a href="{base_url}" style="color: #F4A460; font-weight: bold;">Ir para a Praia</a>
    """

    message = MessageSchema(
        subject="🌊 Uma garrafa chegou na sua praia!",
        # O FastMail envia como Bcc (cópia oculta) por padrão em listas grandes se configurado, ou um por um.
        recipients=emails,
        body=html,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)
