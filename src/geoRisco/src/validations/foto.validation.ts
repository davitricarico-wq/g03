import { HttpError } from '../errors/http-error';

export function validateFotoUrl(value: unknown): string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new HttpError(400, 'URL da foto e obrigatoria');
    }
    return value.trim();
}
