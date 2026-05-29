-- Cria a tabela de familias e relaciona pessoas a uma familia
CREATE TABLE IF NOT EXISTS familias (
    id BIGSERIAL PRIMARY KEY
);

ALTER TABLE pessoas
    ADD COLUMN IF NOT EXISTS familia_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM familias) THEN
        INSERT INTO familias DEFAULT VALUES;
    END IF;
END $$;

UPDATE pessoas
SET familia_id = (SELECT id FROM familias ORDER BY id LIMIT 1)
WHERE familia_id IS NULL;

ALTER TABLE pessoas
    ALTER COLUMN familia_id SET NOT NULL;

ALTER TABLE pessoas
    ADD CONSTRAINT pessoas_familia_fk FOREIGN KEY (familia_id) REFERENCES familias(id);

