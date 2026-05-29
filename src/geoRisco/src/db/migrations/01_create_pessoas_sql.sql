-- 1. Criação dos tipos ENUM (Ajuste os valores conforme a sua regra de negócio)
CREATE TYPE tipo_parentesco AS ENUM ('PAI', 'MAE', 'FILHO(A)', 'CONJUGE', 'IRMAO(A)', 'OUTRO');
CREATE TYPE tipo_status AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO');
CREATE TYPE tipo_escolaridade AS ENUM ('ANALFABETO', 'ENSINO_FUNDAMENTAL', 'ENSINO_MEDIO', 'ENSINO_SUPERIOR', 'POS_GRADUACAO');
CREATE TYPE tipo_situacao_ocupacional AS ENUM ('EMPREGADO', 'DESEMPREGADO', 'AUTONOMO', 'APOSENTADO', 'ESTUDANTE');

-- 2. Criação da tabela usando os ENUMs
CREATE TABLE IF NOT EXISTS pessoas (
                                       id BIGSERIAL PRIMARY KEY,
                                       nome VARCHAR(255) NOT NULL,
    "nomeSocial" VARCHAR(255),
    parentesco tipo_parentesco NOT NULL,
    medicacao BOOLEAN NOT NULL DEFAULT FALSE,
    status tipo_status NOT NULL DEFAULT 'ATIVO',
    escolaridade tipo_escolaridade NOT NULL,
    cronico BOOLEAN NOT NULL DEFAULT FALSE,
    "situacaoOcupacional" tipo_situacao_ocupacional NOT NULL,
    "dataDeNascimento" DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );