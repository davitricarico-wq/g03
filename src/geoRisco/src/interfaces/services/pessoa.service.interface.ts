import type {
    BuscarPessoaDto,
    CreatePessoaDto,
    CreateResponsavelDto,
    PessoaBuscaResultadoDto,
    UpdatePessoaDto,
    UpdateResponsavelDto
} from '../../dtos/pessoa.dto';
import type { Pessoa, Responsavel } from '../../models/pessoa.model';

export interface IPessoaService {
    getAll(): Promise<Pessoa[]>;
    getById(id: number): Promise<Pessoa>;
    getInativas(): Promise<PessoaBuscaResultadoDto[]>;
    buscar(filters: BuscarPessoaDto): Promise<PessoaBuscaResultadoDto[]>;
    cadastrar(data: CreatePessoaDto): Promise<Pessoa>;
    atualizar(id: number, data: UpdatePessoaDto): Promise<Pessoa>;
    remover(id: number): Promise<void>;
    getAllResponsaveis(): Promise<Responsavel[]>;
    getResponsavelByPessoaId(idPessoa: number): Promise<Responsavel>;
    cadastrarResponsavel(data: CreateResponsavelDto): Promise<Responsavel>;
    atualizarResponsavel(idPessoa: number, data: UpdateResponsavelDto): Promise<Responsavel>;
    removerResponsavel(idPessoa: number): Promise<void>;
}
