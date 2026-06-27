BEGIN;

DROP VIEW IF EXISTS public.vw_pessoa_ativa;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'pessoa'
          AND column_name = 'nome_social'
    )
    AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'pessoa'
          AND column_name = 'apelido'
    ) THEN
        ALTER TABLE public.pessoa RENAME COLUMN nome_social TO apelido;
    ELSIF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'pessoa'
          AND column_name = 'nome_social'
    )
    AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'pessoa'
          AND column_name = 'apelido'
    ) THEN
        UPDATE public.pessoa
        SET apelido = COALESCE(apelido, nome_social)
        WHERE apelido IS NULL
          AND nome_social IS NOT NULL;

        ALTER TABLE public.pessoa DROP COLUMN nome_social;
    END IF;
END $$;

ALTER TABLE public.pessoa
    DROP COLUMN IF EXISTS data_residencia_estado;

UPDATE public.pessoa
SET sexo = NULL
WHERE sexo IS NOT NULL
  AND sexo::text NOT IN ('Masculino', 'Feminino');

ALTER TABLE public.pessoa
    DROP CONSTRAINT IF EXISTS pessoa_sexo_masculino_feminino_check;

ALTER TABLE public.pessoa
    ADD CONSTRAINT pessoa_sexo_masculino_feminino_check
    CHECK (sexo IS NULL OR sexo::text IN ('Masculino', 'Feminino'));

CREATE OR REPLACE VIEW public.vw_pessoa_ativa AS
SELECT
    id,
    nome,
    apelido,
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
    data_residencia_moradia
FROM public.pessoa
WHERE deleted_at IS NULL
  AND status = 'Ativo'::public.status_pessoa_enum;

COMMIT;
