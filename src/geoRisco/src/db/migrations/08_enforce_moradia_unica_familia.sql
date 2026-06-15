CREATE UNIQUE INDEX IF NOT EXISTS familia_moradia_moradia_ativa_unique
    ON familia_moradia (id_moradia)
    WHERE data_saida IS NULL;
