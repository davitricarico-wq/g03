import { FotoStorageService } from '../services/foto-storage.service';
import { HttpError } from '../errors/http-error';

// Mock estrito do Supabase Storage para isolamento absoluto do ambiente/SaaS externo
const mockCreateSignedUrl = jest.fn();
const mockCreateSignedUploadUrl = jest.fn();

jest.mock('../storage/supabase-storage.client', () => ({
    getSupabaseStorageBucket: () => 'test-bucket',
    getSupabaseStorageClient: () => ({
        storage: {
            from: () => ({
                createSignedUrl: mockCreateSignedUrl,
                createSignedUploadUrl: mockCreateSignedUploadUrl
            })
        }
    })
}));

describe('FotoStorageService - Suíte Completa', () => {
    let service: FotoStorageService;
    let fotoRepoMock: any;
    let moradiaRepoMock: any;
    let petRepoMock: any;

    beforeEach(() => {
        jest.clearAllMocks();
        fotoRepoMock = { getById: jest.fn() };
        moradiaRepoMock = { getById: jest.fn() };
        petRepoMock = { getById: jest.fn() };
        service = new FotoStorageService(fotoRepoMock, moradiaRepoMock, petRepoMock);
    });

    it('Deve validar existência dos donos antes de emitir links de Upload', async () => {
        moradiaRepoMock.getById.mockResolvedValue(null);
        await expect(service.criarUploadParaMoradia(1, {} as any)).rejects.toThrow(new HttpError(404, 'Moradia nao encontrada'));

        petRepoMock.getById.mockResolvedValue(null);
        await expect(service.criarUploadParaPet(1, {} as any)).rejects.toThrow(new HttpError(404, 'Pet nao encontrado'));
    });

    it('Deve emitir URL assinada de Upload caso a entidade exista', async () => {
        moradiaRepoMock.getById.mockResolvedValue({ id: 1 });
        mockCreateSignedUploadUrl.mockResolvedValue({ data: { path: 'path/f.png', signedUrl: 'http://signed', token: 'tk' }, error: null });

        const res = await service.criarUploadParaMoradia(1, { fileName: 'imagem1', contentType: 'image/png' });
        expect(res.signedUrl).toBe('http://signed');
    });

    it('Deve disparar 502 se o provedor Cloud de Storage falhar', async () => {
        moradiaRepoMock.getById.mockResolvedValue({ id: 1 });
        mockCreateSignedUploadUrl.mockResolvedValue({ data: null, error: new Error('SaaS Down') });

        await expect(service.criarUploadParaMoradia(1, { fileName: 'imagem2', contentType: 'image/png' })).rejects.toThrow(new HttpError(502, 'Erro ao gerar URL assinada de upload'));
    });

    it('Deve gerar URL assinada de visualização de foto existente', async () => {
        fotoRepoMock.getById.mockResolvedValue({ id: 10, url: 'folder/foto.jpg' });
        mockCreateSignedUrl.mockResolvedValue({ data: { signedUrl: 'http://view-link' }, error: null });

        const res = await service.criarUrlAssinadaDaFoto(10);
        expect(res.signedUrl).toBe('http://view-link');

        fotoRepoMock.getById.mockResolvedValue(null);
        await expect(service.criarUrlAssinadaDaFoto(11)).rejects.toThrow(new HttpError(404, 'Foto nao encontrada'));
    });
});