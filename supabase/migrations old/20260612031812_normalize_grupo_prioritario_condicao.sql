-- Normalize grupo_prioritario to the project contract: the descriptive field is condicao.

DROP VIEW IF EXISTS public.prioridades;
DROP VIEW IF EXISTS public.vw_pessoa_ativa;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'grupo_prioritario'
          AND column_name = 'nome'
    ) AND NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'grupo_prioritario'
          AND column_name = 'condicao'
    ) THEN
        ALTER TABLE public.grupo_prioritario RENAME COLUMN nome TO condicao;
    ELSIF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'grupo_prioritario'
          AND column_name = 'nome'
    ) AND EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'grupo_prioritario'
          AND column_name = 'condicao'
    ) THEN
        UPDATE public.grupo_prioritario
        SET condicao = COALESCE(NULLIF(condicao, ''), nome)
        WHERE condicao IS NULL OR condicao = '';

        ALTER TABLE public.grupo_prioritario DROP COLUMN nome;
    END IF;
END $$;

ALTER TABLE public.grupo_prioritario
    ALTER COLUMN condicao SET NOT NULL;

ALTER TABLE public.grupo_prioritario
    DROP CONSTRAINT IF EXISTS grupo_prioritario_nome_key;

ALTER TABLE public.grupo_prioritario
    DROP CONSTRAINT IF EXISTS grupo_prioritario_condicao_key;

ALTER TABLE public.grupo_prioritario
    ADD CONSTRAINT grupo_prioritario_condicao_key UNIQUE (condicao);

INSERT INTO public.grupo_prioritario (condicao, tipo)
VALUES
    ('Deficiência física / dificuldade de locomoção', 'deficiencia_fisica'),
    ('Deficiência visual', 'deficiencia_visual'),
    ('Idoso', 'idoso'),
    ('Pessoa acamada', 'acamado'),
    ('Grávida', 'gravida'),
    ('Lactante', 'lactante'),
    ('Criança', 'crianca'),
    ('Semivida', 'semivida'),
    ('Mobilidade reduzida', 'mobilidade_reduzida'),
    ('Doença crônica', 'doenca_cronica'),
    ('Medicação contínua', 'medicacao_continua'),
    ('Pessoa com deficiência', 'pcd')
ON CONFLICT (tipo) DO UPDATE
SET condicao = EXCLUDED.condicao;

CREATE OR REPLACE VIEW public.vw_pessoa_ativa
WITH (security_invoker = true) AS
SELECT
    p.id,
    p.nome,
    p.nome_social,
    p.data_de_nascimento,
    p.parentesco,
    p.situacao_ocupacional,
    p.escolaridade,
    p.cronico,
    p.medicacao,
    p.status,
    p.deleted_at,
    p.created_at,
    p.updated_at,
    COALESCE(prioridade_data.prioridades, '[]'::jsonb) AS prioridades,
    COALESCE(prioridade_data.prioridade_tipos, ARRAY[]::text[]) AS prioridade_tipos,
    COALESCE(prioridade_data.prioridade_condicoes, ARRAY[]::text[]) AS prioridade_condicoes,
    COALESCE(prioridade_data.prioridade_condicoes, ARRAY[]::text[]) AS prioridade_nomes
FROM public.pessoa p
LEFT JOIN LATERAL (
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'id', gp.id_grupo_prioritario,
                'condicao', gp.condicao,
                'tipo', gp.tipo
            )
            ORDER BY gp.condicao
        ) AS prioridades,
        array_agg(gp.tipo::text ORDER BY gp.tipo) AS prioridade_tipos,
        array_agg(gp.condicao::text ORDER BY gp.condicao) AS prioridade_condicoes
    FROM public.pessoa_grupo_prioritario pgp
    INNER JOIN public.grupo_prioritario gp
        ON gp.id_grupo_prioritario = pgp.id_grupo_prioritario
    WHERE pgp.id_pessoa = p.id
) prioridade_data ON true
WHERE p.deleted_at IS NULL
  AND p.status::text = ANY (ARRAY['Ativo', 'ATIVO']::text[]);

GRANT SELECT ON public.vw_pessoa_ativa TO anon;
GRANT SELECT ON public.vw_pessoa_ativa TO authenticated;
GRANT SELECT ON public.vw_pessoa_ativa TO service_role;

CREATE OR REPLACE VIEW public.prioridades
WITH (security_invoker = true) AS
SELECT
    id_grupo_prioritario AS id,
    condicao,
    tipo
FROM public.grupo_prioritario;

GRANT SELECT ON public.prioridades TO anon;
GRANT SELECT ON public.prioridades TO authenticated;
GRANT SELECT ON public.prioridades TO service_role;
