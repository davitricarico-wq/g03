import type { CreateFotoUploadUrlDto } from '../dtos/foto-storage.dto';
import { HttpError } from '../errors/http-error';

const CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

type ImageContentType = (typeof CONTENT_TYPES)[number];

const EXTENSIONS_BY_CONTENT_TYPE: Record<ImageContentType, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

function isImageContentType(value: string): value is ImageContentType {
    return CONTENT_TYPES.includes(value as ImageContentType);
}

export function validateCreateFotoUploadUrlPayload(data: CreateFotoUploadUrlDto): CreateFotoUploadUrlDto {
    if (typeof data.fileName !== 'string' || data.fileName.trim() === '') {
        throw new HttpError(400, 'Nome do arquivo e obrigatorio');
    }

    const contentType = typeof data.contentType === 'string' ? data.contentType.trim().toLowerCase() : '';
    if (!isImageContentType(contentType)) {
        throw new HttpError(400, 'Tipo de arquivo invalido');
    }

    return {
        fileName: data.fileName.trim(),
        contentType,
        upsert: data.upsert ?? false
    };
}

export function extensionFromContentType(contentType: string): string {
    if (!isImageContentType(contentType)) {
        throw new HttpError(400, 'Tipo de arquivo invalido');
    }
    return EXTENSIONS_BY_CONTENT_TYPE[contentType];
}

export function validateStoragePath(path: string): string {
    const normalized = path.trim();
    if (!normalized || normalized.startsWith('/') || normalized.includes('..') || /^https?:\/\//i.test(normalized)) {
        throw new HttpError(400, 'Path da foto invalido para storage privado');
    }
    return normalized;
}

export function validateSignedUrlExpiration(value: unknown, fallback = 300): number {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 60 || parsed > 3600) {
        throw new HttpError(400, 'Expiracao deve estar entre 60 e 3600 segundos');
    }
    return parsed;
}
