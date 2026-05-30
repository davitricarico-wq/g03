export interface CreateFotoDto {
    idMoradia?: number | null;
    idPet?: number | null;
    url: string;
}

export type CreateFotoSemDonoDto = Pick<CreateFotoDto, 'url'>;
export type CreateFotoSemMoradiaDto = CreateFotoSemDonoDto;
export type CreateFotoSemPetDto = CreateFotoSemDonoDto;

export type UpdateFotoDto = Partial<CreateFotoSemDonoDto>;
