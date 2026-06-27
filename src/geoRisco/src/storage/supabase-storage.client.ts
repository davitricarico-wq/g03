import '../config/env';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { HttpError } from '../errors/http-error';

let client: SupabaseClient | null = null;

export function getSupabaseStorageBucket(): string {
    return process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'georisco-fotos';
}

export function getSupabaseStorageClient(): SupabaseClient {
    if (client) {
        return client;
    }

    const url = process.env.SUPABASE_URL?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!url || !serviceRoleKey) {
        throw new HttpError(500, 'Configuracao do Supabase Storage ausente');
    }

    client = createClient(url, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });

    return client;
}
