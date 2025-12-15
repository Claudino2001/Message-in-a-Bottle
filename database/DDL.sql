drop database if exists bottle_db;

create database bottle_db;

use bottle_db;

-- Tabela de Usuários (Ilhados)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    language VARCHAR(10) DEFAULT 'pt-BR', -- Para suportar múltiplos idiomas
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Garrafas (Mensagens)
CREATE TABLE bottles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    sender_id INTEGER REFERENCES users(id),
    recipient_id INTEGER REFERENCES users(id), -- Será preenchido às 22h
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_distributed BOOLEAN DEFAULT FALSE,
    distribution_date DATE -- Para controlar o envio diário
);

-- Índices para performance
CREATE INDEX idx_bottles_distribution ON bottles(is_distributed, created_at);