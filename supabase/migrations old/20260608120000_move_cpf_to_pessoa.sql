-- Move CPF de responsavel para pessoa: qualquer pessoa pode ter CPF (opcional).

-- 1. Adiciona a coluna cpf em pessoa (opcional)
ALTER TABLE "public"."pessoa"
    ADD COLUMN IF NOT EXISTS "cpf" character(11);

-- 2. Migra os CPFs ja cadastrados em responsavel (apenas se a coluna ainda existir)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM "information_schema"."columns"
        WHERE "table_schema" = 'public'
          AND "table_name" = 'responsavel'
          AND "column_name" = 'cpf'
    ) THEN
        UPDATE "public"."pessoa" p
        SET "cpf" = r."cpf"
        FROM "public"."responsavel" r
        WHERE r."id_pessoa" = p."id"
          AND r."cpf" IS NOT NULL;
    END IF;
END $$;

-- 3. Remove o CPF de responsavel (agora vive em pessoa)
ALTER TABLE "public"."responsavel" DROP CONSTRAINT IF EXISTS "responsavel_cpf_key";
ALTER TABLE "public"."responsavel" DROP COLUMN IF EXISTS "cpf";

-- 4. Garante unicidade do CPF em pessoa (NULLs continuam permitidos -> CPF opcional)
ALTER TABLE "public"."pessoa" DROP CONSTRAINT IF EXISTS "pessoa_cpf_key";
ALTER TABLE "public"."pessoa" ADD CONSTRAINT "pessoa_cpf_key" UNIQUE ("cpf");

-- 5. Recria a view de pessoas ativas incluindo o cpf
CREATE OR REPLACE VIEW "public"."vw_pessoa_ativa" AS
 SELECT "id",
    "nome",
    "nome_social",
    "data_de_nascimento",
    "parentesco",
    "situacao_ocupacional",
    "escolaridade",
    "cronico",
    "medicacao",
    "status",
    "deleted_at",
    "cpf"
   FROM "public"."pessoa"
  WHERE (("deleted_at" IS NULL) AND ("status" = 'Ativo'::"public"."status_pessoa_enum"));
