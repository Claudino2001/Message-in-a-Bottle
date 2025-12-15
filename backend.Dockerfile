# Usa uma imagem leve do Python
FROM python:3.12-slim

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Instala dependências do sistema necessárias para compilar algumas libs
RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev pkg-config && rm -rf /var/lib/apt/lists/*

# Copia os requisitos e instala
# (Crie um arquivo requirements.txt com: fastapi, uvicorn, sqlalchemy, pymysql, python-jose, passlib, bcrypt, python-dotenv, python-multipart)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo o código da pasta app
COPY ./app ./app

# Comando para rodar a API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]