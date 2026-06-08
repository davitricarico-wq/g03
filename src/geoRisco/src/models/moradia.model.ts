import type { Localizacao } from './localizacao.model';

export const STATUS_MORADIA = ['Ativa', 'Interditada', 'Demolida', 'Em Risco', 'Excluída'] as const;
export const TIPOS_CONSTRUCAO = ['Alvenaria', 'Madeira', 'Mista', 'Taipa', 'Lona/Improvisada', 'Outro'] as const;
export const USOS_IMOVEL = ['Residencial', 'Comercial', 'Misto', 'Institucional', 'Abandonado'] as const;
export const SITUACOES_OCUPACAO_MORADIA = [
    'Própria Quitada',
    'Própria Financiada',
    'Alugada',
    'Cedida',
    'Invasão',
    'Outro'
] as const;

export type StatusMoradia = (typeof STATUS_MORADIA)[number];
export type TipoConstrucao = (typeof TIPOS_CONSTRUCAO)[number];
export type UsoImovel = (typeof USOS_IMOVEL)[number];
export type SituacaoOcupacaoMoradia = (typeof SITUACOES_OCUPACAO_MORADIA)[number];

export interface Moradia {
    id: number;
    idLocalizacao: number;
    tipoConstrucao: TipoConstrucao;
    dataRegistro: Date | null;
    status: StatusMoradia;
    usoImovel: UsoImovel;
    pavimentos: number;
    situacaoDeOcupacao: SituacaoOcupacaoMoradia;
    descricao: string | null;
    deletedAt: Date | null;
}

export interface MoradiaComLocalizacao extends Moradia {
    localizacao: Localizacao;
}
