DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'tipo_pet_enum'
    ) THEN
        CREATE TYPE tipo_pet_enum AS ENUM (
            'cachorro',
            'gato',
            'reptil',
            'ave',
            'roedor',
            'outros'
        );
    END IF;
END $$;

ALTER TABLE IF EXISTS pet
    ADD COLUMN IF NOT EXISTS tipo tipo_pet_enum;

UPDATE pet
SET tipo = 'outros'
WHERE tipo IS NULL;

ALTER TABLE IF EXISTS pet
    ALTER COLUMN tipo SET NOT NULL;
