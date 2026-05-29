-- Permite que uma foto pertença a uma moradia ou a um pet.
-- Regra: exatamente um dono deve ser preenchido.

ALTER TABLE IF EXISTS foto
    ADD COLUMN IF NOT EXISTS id_pet INT REFERENCES pet(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS foto
    ALTER COLUMN id_moradia DROP NOT NULL;

DO $$
BEGIN
    IF to_regclass('public.foto') IS NOT NULL
       AND NOT EXISTS (
           SELECT 1
           FROM pg_constraint
           WHERE conname = 'foto_um_dono_chk'
       )
    THEN
        ALTER TABLE foto
            ADD CONSTRAINT foto_um_dono_chk
            CHECK (
                (id_moradia IS NOT NULL AND id_pet IS NULL)
                OR
                (id_moradia IS NULL AND id_pet IS NOT NULL)
            );
    END IF;
END $$;
