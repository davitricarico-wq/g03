


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."escolaridade_enum" AS ENUM (
    'Analfabeto',
    'Fundamental Incompleto',
    'Fundamental Completo',
    'Médio Incompleto',
    'Médio Completo',
    'Superior Incompleto',
    'Superior Completo',
    'Pós-graduação'
);


ALTER TYPE "public"."escolaridade_enum" OWNER TO "postgres";


CREATE TYPE "public"."estado_civil_enum" AS ENUM (
    'Solteiro',
    'Casado',
    'Divorciado',
    'Viúvo',
    'União Estável'
);


ALTER TYPE "public"."estado_civil_enum" OWNER TO "postgres";


CREATE TYPE "public"."parentesco_enum" AS ENUM (
    'Responsável',
    'Cônjuge',
    'Filho(a)',
    'Enteado(a)',
    'Pai/Mãe',
    'Outro'
);


ALTER TYPE "public"."parentesco_enum" OWNER TO "postgres";


CREATE TYPE "public"."raca_enum" AS ENUM (
    'Branca',
    'Preta',
    'Parda',
    'Amarela',
    'Indígena',
    'Não Declarado'
);


ALTER TYPE "public"."raca_enum" OWNER TO "postgres";


CREATE TYPE "public"."sexo_enum" AS ENUM (
    'Masculino',
    'Feminino',
    'Outro',
    'Não Declarado'
);


ALTER TYPE "public"."sexo_enum" OWNER TO "postgres";


CREATE TYPE "public"."situacao_ocupacao_moradia_enum" AS ENUM (
    'Própria Quitada',
    'Própria Financiada',
    'Alugada',
    'Cedida',
    'Invasão',
    'Outro'
);


ALTER TYPE "public"."situacao_ocupacao_moradia_enum" OWNER TO "postgres";


CREATE TYPE "public"."situacao_ocupacional_enum" AS ENUM (
    'Empregado',
    'Desempregado',
    'Autônomo',
    'Informal',
    'Aposentado/Pensionista',
    'Estudante',
    'Do Lar',
    'Outro'
);


ALTER TYPE "public"."situacao_ocupacional_enum" OWNER TO "postgres";


CREATE TYPE "public"."status_familia_enum" AS ENUM (
    'Ativo',
    'Inativo'
);


ALTER TYPE "public"."status_familia_enum" OWNER TO "postgres";


CREATE TYPE "public"."status_moradia_enum" AS ENUM (
    'Ativa',
    'Interditada',
    'Demolida',
    'Em Risco',
    'Excluída'
);


ALTER TYPE "public"."status_moradia_enum" OWNER TO "postgres";


CREATE TYPE "public"."status_pessoa_enum" AS ENUM (
    'Ativo',
    'Obito',
    'Inativo'
);


ALTER TYPE "public"."status_pessoa_enum" OWNER TO "postgres";


CREATE TYPE "public"."tipo_construcao_enum" AS ENUM (
    'Alvenaria',
    'Madeira',
    'Mista',
    'Taipa',
    'Lona/Improvisada',
    'Outro'
);


ALTER TYPE "public"."tipo_construcao_enum" OWNER TO "postgres";


CREATE TYPE "public"."tipo_pet_enum" AS ENUM (
    'cachorro',
    'gato',
    'reptil',
    'ave',
    'roedor',
    'outros'
);


ALTER TYPE "public"."tipo_pet_enum" OWNER TO "postgres";


CREATE TYPE "public"."tipo_prioridade_enum" AS ENUM (
    'Mental',
    'Físico'
);


ALTER TYPE "public"."tipo_prioridade_enum" OWNER TO "postgres";


CREATE TYPE "public"."uso_imovel_enum" AS ENUM (
    'Residencial',
    'Comercial',
    'Misto',
    'Institucional',
    'Abandonado'
);


ALTER TYPE "public"."uso_imovel_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."familia" (
    "id" integer NOT NULL,
    "deleted_at" timestamp with time zone,
    "status" "public"."status_familia_enum" DEFAULT 'Ativo'::"public"."status_familia_enum" NOT NULL
);


ALTER TABLE "public"."familia" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."familia_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."familia_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."familia_id_seq" OWNED BY "public"."familia"."id";



CREATE TABLE IF NOT EXISTS "public"."familia_moradia" (
    "id_familia" integer NOT NULL,
    "id_moradia" integer NOT NULL,
    "data_entrada" "date" NOT NULL,
    "data_saida" "date",
    "status" character varying(50)
);


ALTER TABLE "public"."familia_moradia" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."foto" (
    "id" integer NOT NULL,
    "id_moradia" integer NOT NULL,
    "url" character varying(255) NOT NULL
);


ALTER TABLE "public"."foto" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."foto_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."foto_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."foto_id_seq" OWNED BY "public"."foto"."id";



CREATE TABLE IF NOT EXISTS "public"."grupo_prioritario" (
    "id" integer NOT NULL,
    "condicao" character varying(100) NOT NULL,
    "tipo" "public"."tipo_prioridade_enum" NOT NULL
);


ALTER TABLE "public"."grupo_prioritario" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."grupo_prioritario_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."grupo_prioritario_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."grupo_prioritario_id_seq" OWNED BY "public"."grupo_prioritario"."id";



CREATE TABLE IF NOT EXISTS "public"."localizacao" (
    "id" integer NOT NULL,
    "logradouro" character varying(150),
    "numero" character varying(20),
    "bairro" character varying(100),
    "cidade" character varying(100) NOT NULL,
    "estado" character(2) NOT NULL,
    "cep" character(8),
    "latitude" numeric(12,9) NOT NULL,
    "longitude" numeric(12,9) NOT NULL,
    "referencia" "text",
    "complemento" character varying(100)
);


ALTER TABLE "public"."localizacao" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."localizacao_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."localizacao_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."localizacao_id_seq" OWNED BY "public"."localizacao"."id";



CREATE TABLE IF NOT EXISTS "public"."moradia" (
    "id" integer NOT NULL,
    "id_localizacao" integer NOT NULL,
    "tipo_construcao" "public"."tipo_construcao_enum" NOT NULL,
    "data_registro" "date" DEFAULT CURRENT_DATE,
    "status" "public"."status_moradia_enum" DEFAULT 'Ativa'::"public"."status_moradia_enum" NOT NULL,
    "uso_imovel" "public"."uso_imovel_enum" NOT NULL,
    "pavimentos" integer DEFAULT 1 NOT NULL,
    "situacao_de_ocupacao" "public"."situacao_ocupacao_moradia_enum" NOT NULL,
    "descricao" "text",
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."moradia" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."moradia_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."moradia_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."moradia_id_seq" OWNED BY "public"."moradia"."id";



CREATE TABLE IF NOT EXISTS "public"."pessoa" (
    "id" integer NOT NULL,
    "nome" character varying(150) NOT NULL,
    "nome_social" character varying(150),
    "data_de_nascimento" "date" NOT NULL,
    "parentesco" "public"."parentesco_enum" NOT NULL,
    "situacao_ocupacional" "public"."situacao_ocupacional_enum" NOT NULL,
    "escolaridade" "public"."escolaridade_enum" NOT NULL,
    "cronico" boolean DEFAULT false NOT NULL,
    "medicacao" boolean DEFAULT false NOT NULL,
    "status" "public"."status_pessoa_enum" DEFAULT 'Ativo'::"public"."status_pessoa_enum" NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."pessoa" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pessoa_familia" (
    "id_pessoa" integer NOT NULL,
    "id_familia" integer NOT NULL,
    "data_entrada" "date" NOT NULL,
    "data_saida" "date"
);


ALTER TABLE "public"."pessoa_familia" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pessoa_grupo_prioritario" (
    "id_pessoa" integer NOT NULL,
    "id_grupo_prioritario" integer NOT NULL
);


ALTER TABLE "public"."pessoa_grupo_prioritario" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pessoa_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pessoa_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pessoa_id_seq" OWNED BY "public"."pessoa"."id";



CREATE TABLE IF NOT EXISTS "public"."pet" (
    "id" integer NOT NULL,
    "id_familia" integer NOT NULL,
    "nome" character varying(100) NOT NULL,
    "porte" character varying(50) NOT NULL,
    "raca" character varying(50) NOT NULL,
    "cor" character varying(50) NOT NULL,
    "observacao" "text",
    "tipo" "public"."tipo_pet_enum" NOT NULL
);


ALTER TABLE "public"."pet" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."pet_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."pet_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."pet_id_seq" OWNED BY "public"."pet"."id";



CREATE TABLE IF NOT EXISTS "public"."responsavel" (
    "id_pessoa" integer NOT NULL,
    "cpf" character(11),
    "nis" character varying(20),
    "renda" numeric(10,2),
    "sexo" "public"."sexo_enum" NOT NULL,
    "raca" "public"."raca_enum" NOT NULL,
    "estado_civil" "public"."estado_civil_enum" NOT NULL,
    "veiculo" boolean DEFAULT false NOT NULL,
    "programa_social" boolean DEFAULT false NOT NULL,
    "email" character varying(150),
    "telefone" character varying(20),
    "nome_do_pai" character varying(150),
    "nome_da_mae" character varying(150),
    "local_de_nascimento" character varying(100),
    "data_residencia_estado" "date",
    "data_residencia_moradia" "date"
);


ALTER TABLE "public"."responsavel" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_familia_ativa" AS
 SELECT "id",
    "deleted_at"
   FROM "public"."familia"
  WHERE ("deleted_at" IS NULL);


ALTER VIEW "public"."vw_familia_ativa" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vw_moradia_ativa" AS
 SELECT "id",
    "id_localizacao",
    "tipo_construcao",
    "data_registro",
    "status",
    "uso_imovel",
    "pavimentos",
    "situacao_de_ocupacao",
    "descricao",
    "deleted_at"
   FROM "public"."moradia"
  WHERE ("deleted_at" IS NULL);


ALTER VIEW "public"."vw_moradia_ativa" OWNER TO "postgres";


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
    "deleted_at"
   FROM "public"."pessoa"
  WHERE (("deleted_at" IS NULL) AND ("status" = 'Ativo'::"public"."status_pessoa_enum"));


ALTER VIEW "public"."vw_pessoa_ativa" OWNER TO "postgres";


ALTER TABLE ONLY "public"."familia" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."familia_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."foto" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."foto_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."grupo_prioritario" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."grupo_prioritario_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."localizacao" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."localizacao_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."moradia" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."moradia_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pessoa" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pessoa_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."pet" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."pet_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."familia_moradia"
    ADD CONSTRAINT "familia_moradia_pkey" PRIMARY KEY ("id_familia", "id_moradia", "data_entrada");



ALTER TABLE ONLY "public"."familia"
    ADD CONSTRAINT "familia_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."foto"
    ADD CONSTRAINT "foto_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."grupo_prioritario"
    ADD CONSTRAINT "grupo_prioritario_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."localizacao"
    ADD CONSTRAINT "localizacao_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."moradia"
    ADD CONSTRAINT "moradia_id_localizacao_key" UNIQUE ("id_localizacao");



ALTER TABLE ONLY "public"."moradia"
    ADD CONSTRAINT "moradia_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pessoa_familia"
    ADD CONSTRAINT "pessoa_familia_pkey" PRIMARY KEY ("id_pessoa", "id_familia", "data_entrada");



ALTER TABLE ONLY "public"."pessoa_grupo_prioritario"
    ADD CONSTRAINT "pessoa_grupo_prioritario_pkey" PRIMARY KEY ("id_pessoa", "id_grupo_prioritario");



ALTER TABLE ONLY "public"."pessoa"
    ADD CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pet"
    ADD CONSTRAINT "pet_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."responsavel"
    ADD CONSTRAINT "responsavel_cpf_key" UNIQUE ("cpf");



ALTER TABLE ONLY "public"."responsavel"
    ADD CONSTRAINT "responsavel_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."responsavel"
    ADD CONSTRAINT "responsavel_pkey" PRIMARY KEY ("id_pessoa");



ALTER TABLE ONLY "public"."responsavel"
    ADD CONSTRAINT "responsavel_telefone_key" UNIQUE ("telefone");



CREATE RULE "soft_delete_familia" AS
    ON DELETE TO "public"."familia" DO INSTEAD  UPDATE "public"."familia" SET "deleted_at" = "now"()
  WHERE ("familia"."id" = "old"."id");



CREATE RULE "soft_delete_moradia" AS
    ON DELETE TO "public"."moradia" DO INSTEAD  UPDATE "public"."moradia" SET "status" = 'Excluída'::"public"."status_moradia_enum", "deleted_at" = "now"()
  WHERE ("moradia"."id" = "old"."id");



CREATE RULE "soft_delete_pessoa" AS
    ON DELETE TO "public"."pessoa" DO INSTEAD  UPDATE "public"."pessoa" SET "status" = 'Inativo'::"public"."status_pessoa_enum", "deleted_at" = "now"()
  WHERE ("pessoa"."id" = "old"."id");



ALTER TABLE ONLY "public"."familia_moradia"
    ADD CONSTRAINT "familia_moradia_id_familia_fkey" FOREIGN KEY ("id_familia") REFERENCES "public"."familia"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."familia_moradia"
    ADD CONSTRAINT "familia_moradia_id_moradia_fkey" FOREIGN KEY ("id_moradia") REFERENCES "public"."moradia"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."foto"
    ADD CONSTRAINT "foto_id_moradia_fkey" FOREIGN KEY ("id_moradia") REFERENCES "public"."moradia"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."moradia"
    ADD CONSTRAINT "moradia_id_localizacao_fkey" FOREIGN KEY ("id_localizacao") REFERENCES "public"."localizacao"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pessoa_familia"
    ADD CONSTRAINT "pessoa_familia_id_familia_fkey" FOREIGN KEY ("id_familia") REFERENCES "public"."familia"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pessoa_familia"
    ADD CONSTRAINT "pessoa_familia_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "public"."pessoa"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pessoa_grupo_prioritario"
    ADD CONSTRAINT "pessoa_grupo_prioritario_id_grupo_prioritario_fkey" FOREIGN KEY ("id_grupo_prioritario") REFERENCES "public"."grupo_prioritario"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pessoa_grupo_prioritario"
    ADD CONSTRAINT "pessoa_grupo_prioritario_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "public"."pessoa"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pet"
    ADD CONSTRAINT "pet_id_familia_fkey" FOREIGN KEY ("id_familia") REFERENCES "public"."familia"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."responsavel"
    ADD CONSTRAINT "responsavel_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "public"."pessoa"("id") ON DELETE CASCADE;



ALTER TABLE "public"."familia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."familia_moradia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."foto" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."grupo_prioritario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."localizacao" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."moradia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pessoa" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pessoa_familia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pessoa_grupo_prioritario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pet" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."responsavel" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";


















GRANT ALL ON TABLE "public"."familia" TO "anon";
GRANT ALL ON TABLE "public"."familia" TO "authenticated";
GRANT ALL ON TABLE "public"."familia" TO "service_role";



GRANT ALL ON SEQUENCE "public"."familia_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."familia_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."familia_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."familia_moradia" TO "anon";
GRANT ALL ON TABLE "public"."familia_moradia" TO "authenticated";
GRANT ALL ON TABLE "public"."familia_moradia" TO "service_role";



GRANT ALL ON TABLE "public"."foto" TO "anon";
GRANT ALL ON TABLE "public"."foto" TO "authenticated";
GRANT ALL ON TABLE "public"."foto" TO "service_role";



GRANT ALL ON SEQUENCE "public"."foto_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."foto_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."foto_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."grupo_prioritario" TO "anon";
GRANT ALL ON TABLE "public"."grupo_prioritario" TO "authenticated";
GRANT ALL ON TABLE "public"."grupo_prioritario" TO "service_role";



GRANT ALL ON SEQUENCE "public"."grupo_prioritario_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."grupo_prioritario_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."grupo_prioritario_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."localizacao" TO "anon";
GRANT ALL ON TABLE "public"."localizacao" TO "authenticated";
GRANT ALL ON TABLE "public"."localizacao" TO "service_role";



GRANT ALL ON SEQUENCE "public"."localizacao_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."localizacao_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."localizacao_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."moradia" TO "anon";
GRANT ALL ON TABLE "public"."moradia" TO "authenticated";
GRANT ALL ON TABLE "public"."moradia" TO "service_role";



GRANT ALL ON SEQUENCE "public"."moradia_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."moradia_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."moradia_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pessoa" TO "anon";
GRANT ALL ON TABLE "public"."pessoa" TO "authenticated";
GRANT ALL ON TABLE "public"."pessoa" TO "service_role";



GRANT ALL ON TABLE "public"."pessoa_familia" TO "anon";
GRANT ALL ON TABLE "public"."pessoa_familia" TO "authenticated";
GRANT ALL ON TABLE "public"."pessoa_familia" TO "service_role";



GRANT ALL ON TABLE "public"."pessoa_grupo_prioritario" TO "anon";
GRANT ALL ON TABLE "public"."pessoa_grupo_prioritario" TO "authenticated";
GRANT ALL ON TABLE "public"."pessoa_grupo_prioritario" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pessoa_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pessoa_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pessoa_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pet" TO "anon";
GRANT ALL ON TABLE "public"."pet" TO "authenticated";
GRANT ALL ON TABLE "public"."pet" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pet_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pet_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pet_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."responsavel" TO "anon";
GRANT ALL ON TABLE "public"."responsavel" TO "authenticated";
GRANT ALL ON TABLE "public"."responsavel" TO "service_role";



GRANT ALL ON TABLE "public"."vw_familia_ativa" TO "anon";
GRANT ALL ON TABLE "public"."vw_familia_ativa" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_familia_ativa" TO "service_role";



GRANT ALL ON TABLE "public"."vw_moradia_ativa" TO "anon";
GRANT ALL ON TABLE "public"."vw_moradia_ativa" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_moradia_ativa" TO "service_role";



GRANT ALL ON TABLE "public"."vw_pessoa_ativa" TO "anon";
GRANT ALL ON TABLE "public"."vw_pessoa_ativa" TO "authenticated";
GRANT ALL ON TABLE "public"."vw_pessoa_ativa" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































drop extension if exists "pg_net";


