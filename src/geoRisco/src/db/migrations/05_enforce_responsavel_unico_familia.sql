DO $$
BEGIN
    IF to_regclass('public.familia') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS familia_validar_responsavel_trg ON familia;
    END IF;

    IF to_regclass('public.pessoa_familia') IS NOT NULL THEN
        DROP TRIGGER IF EXISTS pessoa_familia_sincronizar_responsavel_trg ON pessoa_familia;
    END IF;
END $$;

DROP FUNCTION IF EXISTS validar_responsavel_familia();
DROP FUNCTION IF EXISTS sincronizar_responsavel_familia();

DROP VIEW IF EXISTS vw_familia_ativa;

ALTER TABLE IF EXISTS familia
    DROP CONSTRAINT IF EXISTS familia_id_responsavel_fk;

ALTER TABLE IF EXISTS familia
    DROP CONSTRAINT IF EXISTS familia_id_responsavel_unique;

ALTER TABLE IF EXISTS familia
    DROP COLUMN IF EXISTS id_responsavel;

DO $$
BEGIN
    IF to_regclass('public.familia') IS NOT NULL THEN
        EXECUTE '
            CREATE OR REPLACE VIEW vw_familia_ativa AS
            SELECT *
            FROM familia
            WHERE deleted_at IS NULL
        ';
    END IF;
END $$;

CREATE OR REPLACE FUNCTION validar_responsavel_unico_familia()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.data_saida IS NOT NULL THEN
        RETURN NEW;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM pessoa p
        INNER JOIN responsavel r ON r.id_pessoa = p.id
        WHERE p.id = NEW.id_pessoa
          AND p.parentesco::text IN ('Responsável', 'RESPONSAVEL')
    )
    AND EXISTS (
        SELECT 1
        FROM pessoa_familia pf
        INNER JOIN pessoa p ON p.id = pf.id_pessoa
        INNER JOIN responsavel r ON r.id_pessoa = pf.id_pessoa
        WHERE pf.id_familia = NEW.id_familia
          AND pf.id_pessoa <> NEW.id_pessoa
          AND pf.data_saida IS NULL
          AND p.parentesco::text IN ('Responsável', 'RESPONSAVEL')
    ) THEN
        RAISE EXCEPTION 'Familia % ja possui responsavel ativo', NEW.id_familia;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF to_regclass('public.pessoa_familia') IS NOT NULL
       AND to_regclass('public.pessoa') IS NOT NULL
       AND to_regclass('public.responsavel') IS NOT NULL
    THEN
        DROP TRIGGER IF EXISTS pessoa_familia_responsavel_unico_trg ON pessoa_familia;
        CREATE TRIGGER pessoa_familia_responsavel_unico_trg
            BEFORE INSERT OR UPDATE OF data_saida, id_pessoa, id_familia ON pessoa_familia
            FOR EACH ROW
            EXECUTE FUNCTION validar_responsavel_unico_familia();
    END IF;
END $$;
