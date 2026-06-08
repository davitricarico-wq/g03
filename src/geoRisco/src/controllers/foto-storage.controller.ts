import type { Request, Response } from 'express';
import type { CreateFotoUploadUrlDto } from '../dtos/foto-storage.dto';
import type { IFotoStorageService } from '../interfaces/services/foto-storage.service.interface';
import { validateSignedUrlExpiration } from '../validations/foto-storage.validation';
import { asBody, handleControllerError, parseId } from './request-utils';

function normalizeCreateFotoUploadUrlDto(bodyValue: unknown): CreateFotoUploadUrlDto {
    const body = asBody(bodyValue);
    return {
        fileName: String(body.fileName ?? body.file_name ?? ''),
        contentType: String(body.contentType ?? body.content_type ?? ''),
        upsert: typeof body.upsert === 'boolean' ? body.upsert : undefined
    };
}

export class FotoStorageController {
    constructor(private service: IFotoStorageService) {
        this.criarUploadParaMoradia = this.criarUploadParaMoradia.bind(this);
        this.criarUploadParaPet = this.criarUploadParaPet.bind(this);
        this.criarUrlAssinadaDaFoto = this.criarUrlAssinadaDaFoto.bind(this);
    }

    async criarUploadParaMoradia(req: Request, res: Response) {
        try {
            const result = await this.service.criarUploadParaMoradia(
                parseId(req.params.id),
                normalizeCreateFotoUploadUrlDto(req.body)
            );
            res.status(201).json(result);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao gerar URL de upload para moradia');
        }
    }

    async criarUploadParaPet(req: Request, res: Response) {
        try {
            const result = await this.service.criarUploadParaPet(
                parseId(req.params.id),
                normalizeCreateFotoUploadUrlDto(req.body)
            );
            res.status(201).json(result);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao gerar URL de upload para pet');
        }
    }

    async criarUrlAssinadaDaFoto(req: Request, res: Response) {
        try {
            const result = await this.service.criarUrlAssinadaDaFoto(
                parseId(req.params.id),
                validateSignedUrlExpiration(req.query.expiresIn)
            );
            res.status(200).json(result);
        } catch (err) {
            return handleControllerError(res, err, 'Erro ao gerar URL assinada da foto');
        }
    }
}
