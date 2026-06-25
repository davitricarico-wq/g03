// Fila offline (outbox) de cadastros de núcleo familiar.
//
// Estratégia (decisões A1 + B1 + B3 + C1):
//  - C1: offline só enfileira o CADASTRO NOVO via payload do endpoint
//    transacional POST /api/familias/nucleo. Assim não há IDs do servidor
//    a remapear: uma única chamada cria família, moradia, pessoas e pets.
//  - B3: as fotos viram Blobs guardados junto do item; sobem na sincronização,
//    quando os IDs reais de moradia/pets já existem (reaproveita enviarFoto).
//  - A1: a sincronização roda no app (evento 'online' / abertura), não em
//    segundo plano.

import { atualizarPrioridadesPessoa, cadastrarNucleoFamiliar, enviarFoto } from '../api.ts';
import type { CreateNucleoFamiliarPayload } from '../types.ts';
import { estaOnline } from './connectivity.ts';
import { idbAdicionar, idbContar, idbListar, idbRemover } from './idb.ts';

interface FotoPendente {
    alvo: 'moradias' | 'pets';
    petIndice?: number; // posição do pet no payload.pets (mapeia para nucleo.pets[i])
    blob: Blob;
    nome: string;
    tipo: string;
}

export interface CadastroPendente {
    id: string;
    criadoEm: number;
    tentativas: number;
    ultimoErro?: string;
    payload: CreateNucleoFamiliarPayload;
    responsavelPrioridadeIds: number[];
    dependentesPrioridadeIds: number[][]; // por índice de dependente no payload
    fotos: FotoPendente[];
}

export interface NovoCadastroOffline {
    payload: CreateNucleoFamiliarPayload;
    responsavelPrioridadeIds: number[];
    dependentesPrioridadeIds: number[][];
    fotosMoradia: File[];
    fotosPets: File[][]; // por índice de pet
}

// Após este número de tentativas falhas, o cadastro deixa de ser reenviado
// automaticamente (mensagem-veneno: ex.: CPF que já existe no servidor falharia
// para sempre). Ele continua salvo no aparelho e é sinalizado ao usuário.
export const MAX_TENTATIVAS = 5;

/** Resumo da fila para o indicador: total na fila e quantos travaram com erro. */
export interface ResumoFila {
    total: number;
    bloqueados: number;
}

type Ouvinte = (resumo: ResumoFila) => void;
const ouvintes = new Set<Ouvinte>();

function gerarId(): string {
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function calcularResumo(): Promise<ResumoFila> {
    try {
        const itens = await idbListar<CadastroPendente>();
        const bloqueados = itens.filter((i) => i.tentativas >= MAX_TENTATIVAS).length;
        return { total: itens.length, bloqueados };
    } catch {
        return { total: 0, bloqueados: 0 };
    }
}

async function notificar(): Promise<void> {
    const resumo = await calcularResumo();
    ouvintes.forEach((cb) => cb(resumo));
}

/** Assina mudanças na fila de cadastros pendentes (para o indicador de UI). */
export function aoMudarPendencias(cb: Ouvinte): () => void {
    ouvintes.add(cb);
    calcularResumo()
        .then(cb)
        .catch(() => cb({ total: 0, bloqueados: 0 }));
    return () => {
        ouvintes.delete(cb);
    };
}

export function contarPendencias(): Promise<number> {
    return idbContar();
}

export function resumoFila(): Promise<ResumoFila> {
    return calcularResumo();
}

/** Salva um cadastro novo na fila local para envio posterior. */
export async function enfileirarCadastro(dados: NovoCadastroOffline): Promise<void> {
    const fotos: FotoPendente[] = [];
    for (const file of dados.fotosMoradia) {
        fotos.push({ alvo: 'moradias', blob: file, nome: file.name, tipo: file.type || 'application/octet-stream' });
    }
    dados.fotosPets.forEach((lista, petIndice) => {
        for (const file of lista) {
            fotos.push({ alvo: 'pets', petIndice, blob: file, nome: file.name, tipo: file.type || 'application/octet-stream' });
        }
    });

    const item: CadastroPendente = {
        id: gerarId(),
        criadoEm: Date.now(),
        tentativas: 0,
        payload: dados.payload,
        responsavelPrioridadeIds: dados.responsavelPrioridadeIds,
        dependentesPrioridadeIds: dados.dependentesPrioridadeIds,
        fotos
    };
    await idbAdicionar(item);
    await notificar();
}

async function enviarFotosDoItem(item: CadastroPendente, nucleo: Awaited<ReturnType<typeof cadastrarNucleoFamiliar>>): Promise<void> {
    for (const foto of item.fotos) {
        const arquivo = new File([foto.blob], foto.nome, { type: foto.tipo });
        if (foto.alvo === 'moradias') {
            if (nucleo.moradia) await enviarFoto('moradias', nucleo.moradia.id, arquivo);
        } else {
            const idPet = nucleo.pets[foto.petIndice ?? -1]?.id;
            if (idPet) await enviarFoto('pets', idPet, arquivo);
        }
    }
}

async function enviarPrioridades(item: CadastroPendente, nucleo: Awaited<ReturnType<typeof cadastrarNucleoFamiliar>>): Promise<void> {
    if (item.responsavelPrioridadeIds.length) {
        await atualizarPrioridadesPessoa(nucleo.responsavel.id, item.responsavelPrioridadeIds);
    }
    await Promise.all(
        item.dependentesPrioridadeIds.map((ids, i) => {
            const idPessoa = nucleo.dependentes[i]?.id;
            return idPessoa && ids.length ? atualizarPrioridadesPessoa(idPessoa, ids) : Promise.resolve();
        })
    );
}

let sincronizando = false;

/** Reenvia todos os cadastros pendentes na ordem em que foram criados. */
export async function sincronizar(): Promise<{ enviados: number; falhas: number; bloqueados: number }> {
    if (sincronizando || !estaOnline()) return { enviados: 0, falhas: 0, bloqueados: 0 };
    sincronizando = true;
    let enviados = 0;
    let falhas = 0;
    let bloqueados = 0;
    try {
        const pendentes = await idbListar<CadastroPendente>();
        pendentes.sort((a, b) => a.criadoEm - b.criadoEm);
        for (const item of pendentes) {
            // Mensagem-veneno: parou de tentar. Continua salvo, mas não reenvia.
            if (item.tentativas >= MAX_TENTATIVAS) {
                bloqueados++;
                continue;
            }

            let nucleo: Awaited<ReturnType<typeof cadastrarNucleoFamiliar>>;
            try {
                nucleo = await cadastrarNucleoFamiliar(item.payload);
            } catch (e) {
                falhas++;
                item.tentativas += 1;
                item.ultimoErro = e instanceof Error ? e.message : 'erro desconhecido';
                if (item.tentativas >= MAX_TENTATIVAS) bloqueados++;
                await idbAdicionar(item); // mantém na fila para nova tentativa
                continue;
            }

            // O núcleo foi criado no servidor: remove da fila AGORA para nunca
            // recriar uma família duplicada caso algo abaixo falhe. Prioridades e
            // fotos são complementares (podem ser refeitas via edição) e não
            // reenfileiram o cadastro.
            await idbRemover(item.id);
            enviados++;
            try {
                await enviarPrioridades(item, nucleo);
                await enviarFotosDoItem(item, nucleo);
            } catch {
                // dados complementares ficam para uma edição posterior; o núcleo já está salvo.
            }
        }
    } finally {
        sincronizando = false;
        await notificar();
    }
    return { enviados, falhas, bloqueados };
}
