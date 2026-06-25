import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateNucleoFamiliarPayload } from '../types.ts';
import { contarPendencias, enfileirarCadastro, sincronizar } from './outbox.ts';

// Teste headless da fila offline (A1 + B1 + B3 + C1):
//  - IndexedDB é simulado por fake-indexeddb;
//  - a rede é mockada (vi.stubGlobal('fetch')) — não precisa de backend nem Supabase.
// Verifica: persistência da fila, replay via /familias/nucleo, prioridades,
// upload de fotos mapeadas por índice, e que falhas mantêm o item na fila.

type Chamada = { url: string; metodo: string; corpo: unknown };
let chamadas: Chamada[] = [];

function resposta(dados: unknown, status = 200) {
    return { ok: status >= 200 && status < 300, status, json: async () => dados };
}

// Backend "feliz": núcleo retorna ids reais; demais rotas respondem ok.
function fetchFeliz(input: unknown, init?: { method?: string; body?: unknown }) {
    const url = String(input);
    const metodo = (init?.method ?? 'GET').toUpperCase();
    let corpo: unknown;
    if (typeof init?.body === 'string') {
        try { corpo = JSON.parse(init.body); } catch { corpo = init.body; }
    }
    chamadas.push({ url, metodo, corpo });

    if (url.startsWith('https://fake-signed/')) return Promise.resolve(resposta({}, 200)); // upload binário
    if (url.endsWith('/familias/nucleo') && metodo === 'POST') {
        return Promise.resolve(resposta({
            moradia: { id: 10 },
            familia: { id: 5 },
            responsavel: { id: 100 },
            dependentes: [{ id: 101 }],
            pets: [{ id: 200 }, { id: 201 }],
            fotos: []
        }));
    }
    if (url.includes('/prioridades') && metodo === 'PUT') return Promise.resolve(resposta([]));
    if (url.includes('/fotos/upload-url') && metodo === 'POST') {
        return Promise.resolve(resposta({ signedUrl: 'https://fake-signed/x', path: 'bucket/x.jpg' }));
    }
    if (/\/(moradias|pets)\/\d+\/fotos$/.test(url) && metodo === 'POST') {
        return Promise.resolve(resposta({ id: 1, idMoradia: null, idPet: null, url: 'bucket/x.jpg' }));
    }
    return Promise.resolve(resposta({}, 200));
}

function limparBanco(): Promise<void> {
    return new Promise((resolve) => {
        const req = indexedDB.deleteDatabase('georisco-offline');
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
        req.onblocked = () => resolve();
    });
}

function arquivo(nome: string): File {
    return new File([new Blob(['conteudo-da-foto'])], nome, { type: 'image/jpeg' });
}

function cadastroExemplo() {
    return {
        payload: { responsavel: { nome: 'Maria' }, dependentes: [{ nome: 'João' }], pets: [{ tipo: 'cachorro' }, { tipo: 'gato' }] } as unknown as CreateNucleoFamiliarPayload,
        responsavelPrioridadeIds: [1, 2],
        dependentesPrioridadeIds: [[3]],
        fotosMoradia: [arquivo('casa.jpg')],
        fotosPets: [[arquivo('pet0.jpg')], []] // pet índice 0 tem foto; pet índice 1 não
    };
}

beforeEach(async () => {
    chamadas = [];
    await limparBanco();
    // No Node do vitest navigator.onLine é undefined; no navegador real é true.
    vi.stubGlobal('navigator', { onLine: true });
    vi.stubGlobal('fetch', vi.fn(fetchFeliz));
});

describe('fila offline (outbox)', () => {
    it('enfileira um cadastro e persiste no IndexedDB', async () => {
        expect(await contarPendencias()).toBe(0);
        await enfileirarCadastro(cadastroExemplo());
        expect(await contarPendencias()).toBe(1);
    });

    it('sincroniza: cria núcleo, prioridades e fotos, e esvazia a fila', async () => {
        await enfileirarCadastro(cadastroExemplo());

        const r = await sincronizar();

        expect(r).toEqual({ enviados: 1, falhas: 0 });
        expect(await contarPendencias()).toBe(0);

        // 1 chamada ao endpoint transacional
        expect(chamadas.filter((c) => c.url.endsWith('/familias/nucleo') && c.metodo === 'POST')).toHaveLength(1);
        // prioridades aplicadas ao responsável (id 100) e ao dependente (id 101)
        expect(chamadas.some((c) => c.url.includes('/pessoas/100/prioridades') && c.metodo === 'PUT')).toBe(true);
        expect(chamadas.some((c) => c.url.includes('/pessoas/101/prioridades') && c.metodo === 'PUT')).toBe(true);
        // foto da moradia subiu para a moradia id 10
        expect(chamadas.some((c) => c.url.includes('/moradias/10/fotos/upload-url'))).toBe(true);
        expect(chamadas.some((c) => c.url.endsWith('/moradias/10/fotos') && c.metodo === 'POST')).toBe(true);
        // foto do pet de índice 0 subiu para o pet id 200 (e não para o 201)
        expect(chamadas.some((c) => c.url.includes('/pets/200/fotos/upload-url'))).toBe(true);
        expect(chamadas.some((c) => c.url.includes('/pets/201/'))).toBe(false);
    });

    it('mantém o item na fila quando a sincronização falha', async () => {
        await enfileirarCadastro(cadastroExemplo());

        // backend rejeita o núcleo
        vi.stubGlobal('fetch', vi.fn((input: unknown, init?: { method?: string }) => {
            const url = String(input);
            if (url.endsWith('/familias/nucleo') && (init?.method ?? '').toUpperCase() === 'POST') {
                return Promise.resolve(resposta({ error: 'erro de servidor' }, 500));
            }
            return Promise.resolve(resposta({}, 200));
        }));

        const r = await sincronizar();

        expect(r.falhas).toBe(1);
        expect(r.enviados).toBe(0);
        expect(await contarPendencias()).toBe(1); // continua na fila para nova tentativa
    });
});
