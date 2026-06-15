-- ===========================================================
-- Alinha a tabela `foto` ao código da aplicação:
-- uma foto pode pertencer a uma MORADIA ou a um PET.
-- Estado anterior (remote_schema): foto(id, id_moradia NOT NULL, url).
-- O código (FotoRepository) já seleciona/insere `id_pet` e permite
-- fotos sem moradia. Esta migração torna o banco coerente com isso.
-- Idempotente: pode ser reaplicada com segurança.
-- ===========================================================

-- 1) id_moradia passa a aceitar NULL (foto pode ser só de pet)
alter table "public"."foto"
    alter column "id_moradia" drop not null;

-- 2) nova coluna id_pet
alter table "public"."foto"
    add column if not exists "id_pet" integer;

-- 3) FK de id_pet -> pet(id) (com guarda de idempotência)
do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'foto_id_pet_fkey'
    ) then
        alter table "public"."foto"
            add constraint "foto_id_pet_fkey"
            foreign key ("id_pet") references "public"."pet"("id") on delete cascade;
    end if;
end $$;

-- 4) exatamente um vínculo deve estar preenchido (moradia XOR pet)
do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'foto_alvo_unico'
    ) then
        alter table "public"."foto"
            add constraint "foto_alvo_unico"
            check (("id_moradia" is not null) <> ("id_pet" is not null));
    end if;
end $$;

-- 5) índice para buscar fotos de um pet
create index if not exists "foto_id_pet_idx" on "public"."foto" ("id_pet");
