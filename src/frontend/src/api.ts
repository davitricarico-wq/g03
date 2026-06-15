import type {
    CreateNucleoFamiliarPayload,
    EscopoPessoa,
    FamiliaDetalhe,
    FamiliaBuscaResultado,
    FamiliaMoradiaHistorico,
    Foto,
    FotoUploadUrl,
    MoradiaDetalhe,
    MoradiaFamiliaHistorico,
    MoradiaComLocalizacao,
    NucleoFamiliarCriado,
    Pessoa,
    PessoaBuscaResultado,
    Pet,
    Prioridade,
    CreatePessoaPayload,
    CreatePetPayload,
    UpdateMoradiaPayload,
    UpdatePessoaPayload
} from './types.ts';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    if (!res.ok) {
        let mensagem = `Erro ${res.status}`;
        try {
            const corpo = await res.json();
            if (corpo?.error) mensagem = corpo.error;
        } catch {
            // resposta sem corpo JSON
        }
        throw new Error(mensagem);
    }
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
}

export function buscarFamilias(filtros: { termo?: string; bairro?: string } = {}): Promise<FamiliaBuscaResultado[]> {
    const params = new URLSearchParams();
    if (filtros.termo) params.set('termo', filtros.termo);
    if (filtros.bairro) params.set('bairro', filtros.bairro);
    const query = params.toString();
    return request<FamiliaBuscaResultado[]>(`/familias/busca${query ? `?${query}` : ''}`);
}

export function listarPrioridades(): Promise<Prioridade[]> {
    return request<Prioridade[]>('/prioridades');
}

export function listarMoradias(): Promise<MoradiaComLocalizacao[]> {
    return request<MoradiaComLocalizacao[]>('/moradias');
}

export function obterMoradia(id: number): Promise<MoradiaComLocalizacao> {
    return request<MoradiaComLocalizacao>(`/moradias/${id}`);
}

export function detalharMoradia(id: number): Promise<MoradiaDetalhe> {
    return request<MoradiaDetalhe>(`/moradias/${id}/detalhes`);
}

export function atualizarMoradia(id: number, payload: UpdateMoradiaPayload): Promise<MoradiaComLocalizacao> {
    return request<MoradiaComLocalizacao>(`/moradias/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export function criarMoradia(payload: {
    localizacao: CreateNucleoFamiliarPayload['localizacao'];
    moradia: CreateNucleoFamiliarPayload['moradia'];
}): Promise<MoradiaComLocalizacao> {
    return request<MoradiaComLocalizacao>('/moradias', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export function criarFamilia(): Promise<{ id: number; deletedAt: string | null }> {
    return request<{ id: number; deletedAt: string | null }>('/familias', { method: 'POST' });
}

export function vincularPessoaFamilia(idFamilia: number, idPessoa: number): Promise<unknown> {
    return request(`/familias/${idFamilia}/pessoas`, {
        method: 'POST',
        body: JSON.stringify({ idPessoa })
    });
}

export function removerPessoaFamilia(idFamilia: number, idPessoa: number): Promise<unknown> {
    return request(`/familias/${idFamilia}/pessoas/${idPessoa}`, { method: 'DELETE' });
}

export function vincularMoradiaFamilia(idFamilia: number, idMoradia: number, status?: string | null): Promise<unknown> {
    return request(`/familias/${idFamilia}/moradias`, {
        method: 'POST',
        body: JSON.stringify({ idMoradia, status: status ?? null })
    });
}

export function removerMoradiaFamilia(idFamilia: number, idMoradia: number): Promise<unknown> {
    return request(`/familias/${idFamilia}/moradias/${idMoradia}`, { method: 'DELETE' });
}

export function historicoMoradiasFamilia(idFamilia: number): Promise<FamiliaMoradiaHistorico[]> {
    return request<FamiliaMoradiaHistorico[]>(`/familias/${idFamilia}/moradias/historico`);
}

export function historicoFamiliasMoradia(idMoradia: number): Promise<MoradiaFamiliaHistorico[]> {
    return request<MoradiaFamiliaHistorico[]>(`/moradias/${idMoradia}/familias/historico`);
}

export async function detalharFamilia(id: number): Promise<FamiliaDetalhe> {
    const [pessoas, moradiasBase, pets] = await Promise.all([
        request<Pessoa[]>(`/familias/${id}/pessoas`),
        request<MoradiaComLocalizacao[]>(`/familias/${id}/moradias`),
        request<Pet[]>(`/familias/${id}/pets`)
    ]);
    const moradias = await Promise.all(moradiasBase.map((moradia) => obterMoradia(moradia.id)));
    return { id, pessoas, moradias, pets };
}

export function cadastrarNucleoFamiliar(payload: CreateNucleoFamiliarPayload): Promise<NucleoFamiliarCriado> {
    return request<NucleoFamiliarCriado>('/familias/nucleo', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export function cadastrarPetFamilia(idFamilia: number, payload: CreatePetPayload): Promise<Pet> {
    return request<Pet>(`/familias/${idFamilia}/pets`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export function atualizarPet(idPet: number, payload: Partial<CreatePetPayload>): Promise<Pet> {
    return request<Pet>(`/pets/${idPet}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export function removerPet(idPet: number): Promise<unknown> {
    return request(`/pets/${idPet}`, { method: 'DELETE' });
}

export function removerFamilia(id: number): Promise<unknown> {
    return request(`/familias/${id}`, { method: 'DELETE' });
}

/* ===========================================================
   Pessoas — busca por escopo (ativas/inativas/todas) e status
   =========================================================== */
export function buscarPessoas(
    filtros: { nome?: string; cpf?: string; escopo?: EscopoPessoa } = {}
): Promise<PessoaBuscaResultado[]> {
    const params = new URLSearchParams();
    if (filtros.nome) params.set('nome', filtros.nome);
    if (filtros.cpf) params.set('cpf', filtros.cpf);
    if (filtros.escopo) params.set('escopo', filtros.escopo);
    const query = params.toString();
    return request<PessoaBuscaResultado[]>(`/pessoas/busca${query ? `?${query}` : ''}`);
}

export function atualizarStatusPessoa(id: number, status: string): Promise<PessoaBuscaResultado> {
    return request<PessoaBuscaResultado>(`/pessoas/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });
}

export function obterPessoa(id: number): Promise<Pessoa> {
    return request<Pessoa>(`/pessoas/${id}`);
}

export function criarPessoa(payload: CreatePessoaPayload): Promise<Pessoa> {
    return request<Pessoa>('/pessoas', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export function criarResponsavel(payload: Record<string, unknown>): Promise<Pessoa> {
    return request<Pessoa>('/responsaveis', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export function obterResponsavel(id: number): Promise<Pessoa> {
    return request<Pessoa>(`/responsaveis/${id}`);
}

export function atualizarPessoa(id: number, payload: UpdatePessoaPayload): Promise<PessoaBuscaResultado> {
    return request<PessoaBuscaResultado>(`/pessoas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export function atualizarResponsavel(id: number, payload: Record<string, unknown>): Promise<PessoaBuscaResultado> {
    return request<PessoaBuscaResultado>(`/responsaveis/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export function listarPrioridadesPessoa(id: number): Promise<Prioridade[]> {
    return request<Prioridade[]>(`/pessoas/${id}/prioridades`);
}

export function atualizarPrioridadesPessoa(id: number, prioridadeIds: number[]): Promise<Prioridade[]> {
    return request<Prioridade[]>(`/pessoas/${id}/prioridades`, {
        method: 'PUT',
        body: JSON.stringify({ prioridadeIds })
    });
}

/* ===========================================================
   Fotos — fluxo Supabase Storage (signed upload URL)
   1) pede URL assinada -> 2) PUT do arquivo -> 3) confirma no banco
   =========================================================== */
function criarUploadUrl(alvo: 'moradias' | 'pets', id: number, file: File): Promise<FotoUploadUrl> {
    return request<FotoUploadUrl>(`/${alvo}/${id}/fotos/upload-url`, {
        method: 'POST',
        body: JSON.stringify({ fileName: file.name, contentType: file.type || 'application/octet-stream' })
    });
}

async function enviarBinario(signedUrl: string, file: File): Promise<void> {
    const res = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'content-type': file.type || 'application/octet-stream', 'x-upsert': 'true' },
        body: file
    });
    if (!res.ok) throw new Error(`Falha no upload da imagem (${res.status})`);
}

function confirmarFoto(alvo: 'moradias' | 'pets', id: number, path: string): Promise<Foto> {
    return request<Foto>(`/${alvo}/${id}/fotos`, {
        method: 'POST',
        body: JSON.stringify({ url: path })
    });
}

/** Faz o ciclo completo de upload de uma imagem e devolve o registro de foto. */
export async function enviarFoto(alvo: 'moradias' | 'pets', id: number, file: File): Promise<Foto> {
    const { signedUrl, path } = await criarUploadUrl(alvo, id, file);
    await enviarBinario(signedUrl, file);
    return confirmarFoto(alvo, id, path);
}

/** URL assinada de leitura, para exibir uma foto privada do bucket. */
export function urlAssinadaFoto(idFoto: number, expiresIn = 3600): Promise<{ signedUrl: string }> {
    return request<{ signedUrl: string }>(`/fotos/${idFoto}/signed-url?expiresIn=${expiresIn}`);
}

export function listarFotosMoradia(idMoradia: number): Promise<Foto[]> {
    return request<Foto[]>(`/moradias/${idMoradia}/fotos`);
}

export function listarFotosPet(idPet: number): Promise<Foto[]> {
    return request<Foto[]>(`/pets/${idPet}/fotos`);
}
