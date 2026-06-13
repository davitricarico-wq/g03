-- Seed common priority groups and expose them through the active pessoa view.
-- The live Supabase schema uses grupo_prioritario as the priority lookup table.

ALTER TABLE public.grupo_prioritario
    DROP CONSTRAINT IF EXISTS grupo_prioritario_tipo_check;

ALTER TABLE public.grupo_prioritario
    ADD CONSTRAINT grupo_prioritario_tipo_check
    CHECK (
        tipo::text = ANY (
            ARRAY[
                'deficiencia_fisica',
                'deficiencia_visual',
                'idoso',
                'acamado',
                'gravida',
                'lactante',
                'crianca',
                'semivida',
                'mobilidade_reduzida',
                'doenca_cronica',
                'medicacao_continua',
                'pcd'
            ]::text[]
        )
    );

INSERT INTO public.grupo_prioritario (nome, tipo)
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
SET nome = EXCLUDED.nome;

CREATE TABLE IF NOT EXISTS public.pessoa_grupo_prioritario (
    id_pessoa bigint NOT NULL REFERENCES public.pessoa(id) ON DELETE CASCADE,
    id_grupo_prioritario integer NOT NULL REFERENCES public.grupo_prioritario(id_grupo_prioritario) ON DELETE CASCADE,
    PRIMARY KEY (id_pessoa, id_grupo_prioritario)
);

ALTER TABLE public.pessoa_grupo_prioritario ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polrelid = 'public.pessoa_grupo_prioritario'::regclass
          AND polname = 'pessoa_grupo_prioritario_select'
    ) THEN
        CREATE POLICY pessoa_grupo_prioritario_select
            ON public.pessoa_grupo_prioritario
            FOR SELECT
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_policy
        WHERE polrelid = 'public.pessoa'::regclass
          AND polname = 'pessoa_ativa_select'
    ) THEN
        CREATE POLICY pessoa_ativa_select
            ON public.pessoa
            FOR SELECT
            USING (
                deleted_at IS NULL
                AND status::text = ANY (ARRAY['Ativo', 'ATIVO']::text[])
            );
    END IF;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pessoa_grupo_prioritario TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pessoa_grupo_prioritario TO authenticated;
GRANT ALL ON public.pessoa_grupo_prioritario TO service_role;

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
    COALESCE(prioridade_data.prioridade_nomes, ARRAY[]::text[]) AS prioridade_nomes
FROM public.pessoa p
LEFT JOIN LATERAL (
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'id', gp.id_grupo_prioritario,
                'nome', gp.nome,
                'tipo', gp.tipo
            )
            ORDER BY gp.nome
        ) AS prioridades,
        array_agg(gp.tipo::text ORDER BY gp.tipo) AS prioridade_tipos,
        array_agg(gp.nome::text ORDER BY gp.nome) AS prioridade_nomes
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
    nome,
    tipo
FROM public.grupo_prioritario;

GRANT SELECT ON public.prioridades TO anon;
GRANT SELECT ON public.prioridades TO authenticated;
GRANT SELECT ON public.prioridades TO service_role;
