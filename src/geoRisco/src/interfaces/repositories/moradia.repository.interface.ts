import type { Queryable } from '../../db/queryable';
import type { CreateLocalizacaoDto, UpdateLocalizacaoDto } from '../../dtos/localizacao.dto';
import type { CreateMoradiaDto, UpdateMoradiaDto } from '../../dtos/moradia.dto';
import type { Localizacao } from '../../models/localizacao.model';
import type { Moradia, MoradiaComLocalizacao } from '../../models/moradia.model';

export interface IMoradiaRepository {
    getAll(db?: Queryable): Promise<MoradiaComLocalizacao[]>;
    getById(id: number, db?: Queryable): Promise<MoradiaComLocalizacao | null>;
    createLocalizacao(data: CreateLocalizacaoDto, db?: Queryable): Promise<Localizacao>;
    updateLocalizacao(id: number, data: UpdateLocalizacaoDto, db?: Queryable): Promise<Localizacao | null>;
    create(data: CreateMoradiaDto & { idLocalizacao: number }, db?: Queryable): Promise<Moradia>;
    update(id: number, data: UpdateMoradiaDto, db?: Queryable): Promise<Moradia | null>;
    delete(id: number, db?: Queryable): Promise<void>;
}
