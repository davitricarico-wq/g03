export const STATUS_PET = ['Ativo', 'Inativo', 'Desaparecido', 'Falecido'] as const;
export const TIPOS_PET = ['cachorro', 'gato', 'reptil', 'ave', 'roedor', 'outros'] as const;

export type StatusPet = (typeof STATUS_PET)[number];
export type TipoPet = (typeof TIPOS_PET)[number];

export interface Pet {
    id: number;
    idFamilia: number;
    tipo: TipoPet;
    nome: string;
    porte: string;
    raca: string;
    cor: string;
    status: StatusPet;
    observacao: string | null;
}
