import type { Queryable } from '../../db/queryable';
import type {
    BuscarFamiliaDto,
    FamiliaBuscaResultadoDto,
    FamiliaMoradiaHistoricoDto,
    MoradiaFamiliaHistoricoDto,
    PessoaFamiliaHistoricoDto
} from '../../dtos/familia.dto';
import type { Familia, FamiliaMoradia, PessoaFamilia } from '../../models/familia.model';
import type { Moradia } from '../../models/moradia.model';
import type { Pessoa } from '../../models/pessoa.model';
import type { Pet } from '../../models/pet.model';

export interface IFamiliaRepository {
    getAll(db?: Queryable): Promise<Familia[]>;
    search(filtros: BuscarFamiliaDto, db?: Queryable): Promise<FamiliaBuscaResultadoDto[]>;
    getById(id: number, db?: Queryable): Promise<Familia | null>;
    create(db?: Queryable): Promise<Familia>;
    delete(id: number, db?: Queryable): Promise<void>;
    vincularPessoa(idFamilia: number, idPessoa: number, dataEntrada?: Date | null, db?: Queryable): Promise<PessoaFamilia>;
    removerPessoa(idFamilia: number, idPessoa: number, dataSaida?: Date | null, db?: Queryable): Promise<PessoaFamilia | null>;
    getPessoas(idFamilia: number, db?: Queryable): Promise<Pessoa[]>;
    getHistoricoPessoas(idFamilia: number, db?: Queryable): Promise<PessoaFamiliaHistoricoDto[]>;
    getResponsavelAtivo(idFamilia: number, db?: Queryable): Promise<Pessoa | null>;
    vincularMoradia(idFamilia: number, idMoradia: number, dataEntrada?: Date | null, status?: string | null, db?: Queryable): Promise<FamiliaMoradia>;
    removerMoradia(idFamilia: number, idMoradia: number, dataSaida?: Date | null, db?: Queryable): Promise<FamiliaMoradia | null>;
    getMoradias(idFamilia: number, db?: Queryable): Promise<Moradia[]>;
    getHistoricoMoradias(idFamilia: number, db?: Queryable): Promise<FamiliaMoradiaHistoricoDto[]>;
    getFamiliasByMoradia(idMoradia: number, db?: Queryable): Promise<Familia[]>;
    getHistoricoFamiliasByMoradia(idMoradia: number, db?: Queryable): Promise<MoradiaFamiliaHistoricoDto[]>;
    getPets(idFamilia: number, db?: Queryable): Promise<Pet[]>;
}
