export const TIPOS_PRIORIDADE = ['Mental', 'Físico'] as const;

export type TipoPrioridade = (typeof TIPOS_PRIORIDADE)[number];

export interface GrupoPrioritario {
    id: number;
    condicao: string;
    tipo: TipoPrioridade;
    dataPrevistaParto: Date | null;
}

export interface PessoaGrupoPrioritario {
    idPessoa: number;
    idGrupoPrioritario: number;
}
