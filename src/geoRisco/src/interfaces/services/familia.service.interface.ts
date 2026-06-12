import type {
    FamiliaMoradiaHistoricoDto,
    CreateNucleoFamiliarDto,
    NucleoFamiliarCriado,
    PessoaFamiliaHistoricoDto,
    VincularMoradiaFamiliaDto,
    VincularPessoaFamiliaDto
} from '../../dtos/familia.dto';
import type { Familia, FamiliaMoradia, PessoaFamilia, PessoaFamiliaRemovida } from '../../models/familia.model';
import type { Moradia } from '../../models/moradia.model';
import type { Pessoa } from '../../models/pessoa.model';

export interface IFamiliaService {
    getAll(): Promise<Familia[]>;
    getById(id: number): Promise<Familia>;
    cadastrar(): Promise<Familia>;
    remover(id: number): Promise<void>;
    getPessoas(idFamilia: number): Promise<Pessoa[]>;
    getHistoricoPessoas(idFamilia: number): Promise<PessoaFamiliaHistoricoDto[]>;
    getMoradias(idFamilia: number): Promise<Moradia[]>;
    getHistoricoMoradias(idFamilia: number): Promise<FamiliaMoradiaHistoricoDto[]>;
    vincularPessoa(idFamilia: number, data: VincularPessoaFamiliaDto): Promise<PessoaFamilia>;
    removerPessoa(idFamilia: number, idPessoa: number): Promise<PessoaFamiliaRemovida>;
    vincularMoradia(idFamilia: number, data: VincularMoradiaFamiliaDto): Promise<FamiliaMoradia>;
    removerMoradia(idFamilia: number, idMoradia: number): Promise<FamiliaMoradia>;
    cadastrarNucleoFamiliar(data: CreateNucleoFamiliarDto): Promise<NucleoFamiliarCriado>;
}
