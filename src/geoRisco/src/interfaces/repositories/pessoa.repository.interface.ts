import type { Queryable } from '../../db/queryable';
import type {
    BuscarPessoaDto,
    CreatePessoaDto,
    CreateResponsavelDto,
    PessoaBuscaResultadoDto,
    UpdatePessoaDto,
    UpdateResponsavelDto
} from '../../dtos/pessoa.dto';
import type { Pessoa, Responsavel } from '../../models/pessoa.model';

export type CreateResponsavelRepositoryRequest = CreateResponsavelDto & {
    idPessoa: number;
};

export interface IPessoaRepository {
    getAll(db?: Queryable): Promise<Pessoa[]>;
    getById(id: number, db?: Queryable): Promise<Pessoa | null>;
    getInativas(db?: Queryable): Promise<PessoaBuscaResultadoDto[]>;
    search(filters: BuscarPessoaDto, db?: Queryable): Promise<PessoaBuscaResultadoDto[]>;
    create(data: CreatePessoaDto, db?: Queryable): Promise<Pessoa>;
    update(id: number, data: UpdatePessoaDto, db?: Queryable): Promise<Pessoa | null>;
    delete(id: number, db?: Queryable): Promise<void>;
    getAllResponsaveis(db?: Queryable): Promise<Responsavel[]>;
    getResponsavelByPessoaId(idPessoa: number, db?: Queryable): Promise<Responsavel | null>;
    createResponsavel(data: CreateResponsavelRepositoryRequest, db?: Queryable): Promise<Responsavel>;
    updateResponsavel(idPessoa: number, data: UpdateResponsavelDto, db?: Queryable): Promise<Responsavel | null>;
}
