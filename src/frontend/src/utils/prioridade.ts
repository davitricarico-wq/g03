import type { FamiliaBuscaResultado } from '../types.ts';

/* ===========================================================
   Toda moradia cadastrada é, por definição, área de risco.
   Cor única usada nos pinos do mapa e nos destaques de risco.
   =========================================================== */
export const COR_RISCO = '#e53935';

/* ===========================================================
   Tags de vulnerabilidade de uma FAMÍLIA (a partir de grupos)
   =========================================================== */
export interface GrupoTag {
    chave: keyof FamiliaBuscaResultado['grupos'];
    label: string;
    cls: string;
}

export const GRUPOS: GrupoTag[] = [
    { chave: 'gestante', label: 'GESTANTE', cls: 'tag-gestante' },
    { chave: 'crianca', label: 'CRIANÇA', cls: 'tag-crianca' },
    { chave: 'idoso', label: 'IDOSO', cls: 'tag-idoso' },
    { chave: 'doencaCronica', label: 'DOENÇA CRÔNICA', cls: 'tag-cronica' }
];

export function tagsDaFamilia(f: FamiliaBuscaResultado): GrupoTag[] {
    return GRUPOS.filter((g) => f.grupos[g.chave]);
}
