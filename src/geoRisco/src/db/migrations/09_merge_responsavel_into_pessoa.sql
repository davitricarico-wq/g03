BEGIN;

ALTER TABLE public.pessoa
    ADD COLUMN IF NOT EXISTS nis varchar(20),
    ADD COLUMN IF NOT EXISTS renda numeric(10,2),
    ADD COLUMN IF NOT EXISTS sexo public.sexo_enum,
    ADD COLUMN IF NOT EXISTS raca public.raca_enum,
    ADD COLUMN IF NOT EXISTS estado_civil public.estado_civil_enum,
    ADD COLUMN IF NOT EXISTS veiculo boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS programas_sociais integer NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS email varchar(150),
    ADD COLUMN IF NOT EXISTS telefone varchar(20),
    ADD COLUMN IF NOT EXISTS nome_da_mae varchar(150),
    ADD COLUMN IF NOT EXISTS data_residencia_estado date,
    ADD COLUMN IF NOT EXISTS data_residencia_moradia date;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'pessoa_programas_sociais_check'
          AND conrelid = 'public.pessoa'::regclass
    ) THEN
        ALTER TABLE public.pessoa
            ADD CONSTRAINT pessoa_programas_sociais_check
            CHECK (programas_sociais >= 0)
            NOT VALID;
    END IF;
END $$;

DO $$
BEGIN
    IF to_regclass('public.responsavel') IS NOT NULL THEN
        EXECUTE $copy_responsavel$
            UPDATE public.pessoa p
            SET
                nis = r.nis,
                renda = r.renda,
                sexo = r.sexo,
                raca = r.raca,
                estado_civil = r.estado_civil,
                veiculo = r.veiculo,
                programas_sociais = CASE WHEN r.programa_social THEN 1 ELSE 0 END,
                email = r.email,
                telefone = r.telefone,
                nome_da_mae = r.nome_da_mae,
                data_residencia_estado = r.data_residencia_estado,
                data_residencia_moradia = r.data_residencia_moradia
            FROM public.responsavel r
            WHERE r.id_pessoa = p.id
        $copy_responsavel$;
    END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS pessoa_email_unique_idx
    ON public.pessoa (email)
    WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS pessoa_telefone_unique_idx
    ON public.pessoa (telefone)
    WHERE telefone IS NOT NULL;

DROP VIEW IF EXISTS public.vw_pessoa_ativa;
CREATE OR REPLACE VIEW public.vw_pessoa_ativa AS
SELECT
    id,
    nome,
    nome_social,
    data_de_nascimento,
    parentesco,
    situacao_ocupacional,
    escolaridade,
    cronico,
    medicacao,
    status,
    deleted_at,
    cpf,
    nis,
    renda,
    sexo,
    raca,
    estado_civil,
    veiculo,
    programas_sociais,
    email,
    telefone,
    nome_da_mae,
    data_residencia_estado,
    data_residencia_moradia
FROM public.pessoa
WHERE deleted_at IS NULL
  AND status = 'Ativo'::public.status_pessoa_enum;

DROP TRIGGER IF EXISTS pessoa_familia_responsavel_unico_trg ON public.pessoa_familia;
DROP FUNCTION IF EXISTS public.validar_responsavel_unico_familia();

CREATE OR REPLACE FUNCTION public.validar_responsavel_unico_familia()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.data_saida IS NOT NULL THEN
        RETURN NEW;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.pessoa p
        WHERE p.id = NEW.id_pessoa
          AND p.parentesco::text IN ('Responsável', 'RESPONSAVEL')
          AND p.deleted_at IS NULL
          AND p.status::text IN ('Ativo', 'ATIVO')
    )
    AND EXISTS (
        SELECT 1
        FROM public.pessoa_familia pf
        INNER JOIN public.pessoa p ON p.id = pf.id_pessoa
        WHERE pf.id_familia = NEW.id_familia
          AND pf.id_pessoa <> NEW.id_pessoa
          AND pf.data_saida IS NULL
          AND p.parentesco::text IN ('Responsável', 'RESPONSAVEL')
          AND p.deleted_at IS NULL
          AND p.status::text IN ('Ativo', 'ATIVO')
    ) THEN
        RAISE EXCEPTION 'Familia % ja possui responsavel ativo', NEW.id_familia;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER pessoa_familia_responsavel_unico_trg
    BEFORE INSERT OR UPDATE OF data_saida, id_pessoa, id_familia ON public.pessoa_familia
    FOR EACH ROW
    EXECUTE FUNCTION public.validar_responsavel_unico_familia();

DROP TABLE IF EXISTS public.responsavel CASCADE;

GRANT ALL ON TABLE public.vw_pessoa_ativa TO anon;
GRANT ALL ON TABLE public.vw_pessoa_ativa TO authenticated;
GRANT ALL ON TABLE public.vw_pessoa_ativa TO service_role;

COMMIT;
