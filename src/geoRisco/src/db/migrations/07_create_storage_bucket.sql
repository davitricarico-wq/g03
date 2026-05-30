DO $$
BEGIN
    IF to_regclass('storage.buckets') IS NOT NULL THEN
        EXECUTE $sql$
            INSERT INTO storage.buckets (
                id,
                name,
                public,
                file_size_limit,
                allowed_mime_types
            )
            VALUES (
                'georisco-fotos',
                'georisco-fotos',
                false,
                10485760,
                ARRAY['image/jpeg', 'image/png', 'image/webp']
            )
            ON CONFLICT (id) DO UPDATE
            SET
                public = EXCLUDED.public,
                file_size_limit = EXCLUDED.file_size_limit,
                allowed_mime_types = EXCLUDED.allowed_mime_types
        $sql$;
    END IF;
END $$;
