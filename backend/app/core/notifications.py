import smtplib
from email.message import EmailMessage

from app.core.config import settings


def send_reset_email(email: str, reset_link: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = "Код восстановления пароля - BI Platform"
    msg["From"] = settings.SMTP_USER
    msg["To"] = email
    msg.set_content(f"Для смены пароля перейдите по ссылке (действует 15 минут):\n{reset_link}")
    with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)