import '../config/env';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { HttpError } from '../errors/http-error';

let client: SupabaseClient | null = null;

export function getSupabaseDbClient(): SupabaseClient {
    if (client) {
        return client;
    }

    const url = process.env.SUPABASE_URL?.trim();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!url || !serviceRoleKey) {
        throw new HttpError(500, 'Configuracao do Supabase ausente');
    }

    client = createClient(url, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });

    return client;
}

export function isDatabaseHostResolutionError(err: unknown): boolean {
    return Boolean(
        err
        && typeof err === 'object'
        && 'code' in err
        && (err as { code?: unknown }).code === 'ENOTFOUND'
    );
}
