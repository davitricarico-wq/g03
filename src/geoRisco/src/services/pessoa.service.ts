import { pool } from '../db/connection.ts';
import type {
    BuscarPessoaDto,
    CreatePessoaDto,
    CreateResponsavelDto,
    PessoaBuscaResultadoDto,
    UpdatePessoaDto,
    UpdateResponsavelDto
} from '../dtos/pessoa.dto';
import { HttpError } from '../errors/http-error';
import type { IPessoaRepository } from '../interfaces/repositories/pessoa.repository.interface';
import type { IPessoaService } from '../interfaces/services/pessoa.service.interface';
import type { Pessoa, Responsavel } from '../models/pessoa.model';
import { validatePessoaPayload, validateResponsavelPayload } from '../validations/pessoa.validation';

export class PessoaService implements IPessoaService {
    constructor(private repo: IPessoaRepository) {}

    async getAll(): Promise<Pessoa[]> {
        return this.repo.getAll();
    }

    async getById(id: number): Promise<Pessoa> {
        const pessoa = await this.repo.getById(id);
        if (!pessoa) {
            throw new HttpError(404, 'Pessoa não encontrada');
        }
        return pessoa;
    }

    async getInativas(): Promise<PessoaBuscaResultadoDto[]> {
        return this.repo.getInativas();
    }

    async buscar(filters: BuscarPessoaDto): Promise<PessoaBuscaResultadoDto[]> {
        if (filters.escopo && !['ativas', 'inativas', 'todas'].includes(filters.escopo)) {
            throw new HttpError(400, 'Escopo de busca invalido');
        }

        const normalized = {
            nome: filters.nome?.trim(),
            cpf: filters.cpf?.replace(/\D/g, ''),
            email: filters.email?.trim(),
            telefone: filters.telefone?.replace(/\D/g, ''),
            escopo: filters.escopo ?? 'ativas'
        };

        if (!normalized.nome && !normalized.cpf && !normalized.email && !normalized.telefone) {
            throw new HttpError(400, 'Informe ao menos um filtro de busca');
        }

        return this.repo.search(normalized);
    }

    async cadastrar(data: CreatePessoaDto): Promise<Pessoa> {
        validatePessoaPayload(data);
        return this.repo.create({
            ...data,
            nome: data.nome.trim(),
            nomeSocial: data.nomeSocial ?? null,
            status: data.status ?? 'Ativo'
        });
    }

    async atualizar(id: number, data: UpdatePessoaDto): Promise<Pessoa> {
        validatePessoaPayload(data, true);
        const updated = await this.repo.update(id, data);
        if (!updated) {
            throw new HttpError(404, 'Pessoa não encontrada');
        }
        return updated;
    }

    async remover(id: number): Promise<void> {
        const pessoa = await this.getById(id);
        if (pessoa.parentesco === 'Responsável') {
            throw new HttpError(409, 'Tentativa de arquivar responsável sem substituição prévia');
        }
        await this.repo.delete(id);
    }

    async getAllResponsaveis(): Promise<Responsavel[]> {
        return this.repo.getAllResponsaveis();
    }

    async getResponsavelByPessoaId(idPessoa: number): Promise<Responsavel> {
        const responsavel = await this.repo.getResponsavelByPessoaId(idPessoa);
        if (!responsavel) {
            throw new HttpError(404, 'Responsável não encontrado');
        }
        return responsavel;
    }

    async cadastrarResponsavel(data: CreateResponsavelDto): Promise<Responsavel> {
        validateResponsavelPayload(data);
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            const pessoa = await this.repo.create(
                {
                    ...data,
                    nome: data.nome.trim(),
                    nomeSocial: data.nomeSocial ?? null,
                    parentesco: data.parentesco ?? 'Responsável',
                    status: data.status ?? 'Ativo'
                },
                client
            );
            const responsavel = await this.repo.createResponsavel(
                {
                    ...data,
                    idPessoa: pessoa.id,
                    veiculo: data.veiculo ?? false,
                    programaSocial: data.programaSocial ?? false
                },
                client
            );

            await client.query('COMMIT');
            return responsavel;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async atualizarResponsavel(idPessoa: number, data: UpdateResponsavelDto): Promise<Responsavel> {
        validateResponsavelPayload(data, true);
        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            await this.repo.update(idPessoa, data, client);
            const responsavel = await this.repo.updateResponsavel(idPessoa, data, client);
            if (!responsavel) {
                throw new HttpError(404, 'Responsável não encontrado');
            }
            await client.query('COMMIT');
            return responsavel;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    async removerResponsavel(idPessoa: number): Promise<void> {
        await this.getResponsavelByPessoaId(idPessoa);
        await this.repo.delete(idPessoa);
    }
}
