import { pool } from '../db/connection.ts';
import type { Queryable } from '../db/queryable';
import type {
    FamiliaMoradiaHistoricoDto,
    MoradiaFamiliaHistoricoDto,
    PessoaFamiliaHistoricoDto
} from '../dtos/familia.dto';
import type { IFamiliaRepository } from '../interfaces/repositories/familia.repository.interface';
import type { Familia, FamiliaMoradia, PessoaFamilia } from '../models/familia.model';
import type { Moradia } from '../models/moradia.model';
import type { Pessoa } from '../models/pessoa.model';
import type { Pet } from '../models/pet.model';

const familiaSelect = `
    id,
    deleted_at AS "deletedAt"
`;

const familiaAliasedSelect = `
    f.id,
    f.deleted_at AS "deletedAt"
`;

const pessoaSelect = `
    p.id,
    p.nome,
    p.nome_social AS "nomeSocial",
    p.data_de_nascimento AS "dataDeNascimento",
    p.parentesco,
    p.situacao_ocupacional AS "situacaoOcupacional",
    p.escolaridade,
    p.cronico,
    p.medicacao,
    p.status,
    p.deleted_at AS "deletedAt"
`;

const moradiaSelect = `
    m.id,
    m.id_localizacao AS "idLocalizacao",
    m.tipo_construcao AS "tipoConstrucao",
    m.data_registro AS "dataRegistro",
    m.status,
    m.uso_imovel AS "usoImovel",
    m.pavimentos,
    m.situacao_de_ocupacao AS "situacaoDeOcupacao",
    m.descricao,
    m.deleted_at AS "deletedAt"
`;

type PessoaFamiliaHistoricoRow = Pessoa & PessoaFamilia;
type FamiliaMoradiaHistoricoRow = Moradia & Omit<FamiliaMoradia, 'status'> & { statusVinculo: string | null };
type MoradiaFamiliaHistoricoRow = Familia & Omit<FamiliaMoradia, 'status'> & { statusVinculo: string | null };

function mapPessoaFamiliaHistorico(row: PessoaFamiliaHistoricoRow): PessoaFamiliaHistoricoDto {
    return {
        vinculo: {
            idPessoa: row.idPessoa,
            idFamilia: row.idFamilia,
            dataEntrada: row.dataEntrada,
            dataSaida: row.dataSaida
        },
        pessoa: {
            id: row.id,
            nome: row.nome,
            nomeSocial: row.nomeSocial,
            dataDeNascimento: row.dataDeNascimento,
            parentesco: row.parentesco,
            situacaoOcupacional: row.situacaoOcupacional,
            escolaridade: row.escolaridade,
            cronico: row.cronico,
            medicacao: row.medicacao,
            status: row.status,
            deletedAt: row.deletedAt
        },
        ativo: row.dataSaida === null
    };
}

function mapFamiliaMoradiaHistorico(row: FamiliaMoradiaHistoricoRow): FamiliaMoradiaHistoricoDto {
    return {
        vinculo: {
            idFamilia: row.idFamilia,
            idMoradia: row.idMoradia,
            dataEntrada: row.dataEntrada,
            dataSaida: row.dataSaida,
            status: row.statusVinculo
        },
        moradia: {
            id: row.id,
            idLocalizacao: row.idLocalizacao,
            tipoConstrucao: row.tipoConstrucao,
            dataRegistro: row.dataRegistro,
            status: row.status,
            usoImovel: row.usoImovel,
            pavimentos: row.pavimentos,
            situacaoDeOcupacao: row.situacaoDeOcupacao,
            descricao: row.descricao,
            deletedAt: row.deletedAt
        },
        ativo: row.dataSaida === null
    };
}

function mapMoradiaFamiliaHistorico(row: MoradiaFamiliaHistoricoRow): MoradiaFamiliaHistoricoDto {
    return {
        vinculo: {
            idFamilia: row.idFamilia,
            idMoradia: row.idMoradia,
            dataEntrada: row.dataEntrada,
            dataSaida: row.dataSaida,
            status: row.statusVinculo
        },
        familia: {
            id: row.id,
            deletedAt: row.deletedAt
        },
        ativo: row.dataSaida === null
    };
}

export class FamiliaRepository implements IFamiliaRepository {
    constructor(private db: Queryable = pool) {}

    async getAll(db: Queryable = this.db): Promise<Familia[]> {
        const res = await db.query<Familia>(`
            SELECT ${familiaSelect}
            FROM vw_familia_ativa
            ORDER BY id
        `);
        return res.rows;
    }

    async getById(id: number, db: Queryable = this.db): Promise<Familia | null> {
        const res = await db.query<Familia>(
            `
            SELECT ${familiaSelect}
            FROM vw_familia_ativa
            WHERE id = $1
            `,
            [id]
        );
        return res.rows[0] ?? null;
    }

    async create(db: Queryable = this.db): Promise<Familia> {
        const res = await db.query<Familia>(`
            INSERT INTO familia DEFAULT VALUES
            RETURNING ${familiaSelect}
        `);
        return res.rows[0];
    }

    async delete(id: number, db: Queryable = this.db): Promise<void> {
        await db.query('DELETE FROM familia WHERE id = $1', [id]);
    }

    async vincularPessoa(
        idFamilia: number,
        idPessoa: number,
        dataEntrada: Date | null = null,
        db: Queryable = this.db
    ): Promise<PessoaFamilia> {
        const res = await db.query<PessoaFamilia>(
            `
            INSERT INTO pessoa_familia (id_pessoa, id_familia, data_entrada)
            VALUES ($1, $2, COALESCE($3, CURRENT_DATE))
            RETURNING
                id_pessoa AS "idPessoa",
                id_familia AS "idFamilia",
                data_entrada AS "dataEntrada",
                data_saida AS "dataSaida"
            `,
            [idPessoa, idFamilia, dataEntrada]
        );
        return res.rows[0];
    }

    async removerPessoa(
        idFamilia: number,
        idPessoa: number,
        dataSaida: Date | null = null,
        db: Queryable = this.db
    ): Promise<PessoaFamilia | null> {
        const res = await db.query<PessoaFamilia>(
            `
            UPDATE pessoa_familia
            SET data_saida = COALESCE($3, CURRENT_DATE)
            WHERE id_familia = $1
              AND id_pessoa = $2
              AND data_saida IS NULL
            RETURNING
                id_pessoa AS "idPessoa",
                id_familia AS "idFamilia",
                data_entrada AS "dataEntrada",
                data_saida AS "dataSaida"
            `,
            [idFamilia, idPessoa, dataSaida]
        );
        return res.rows[0] ?? null;
    }

    async getPessoas(idFamilia: number, db: Queryable = this.db): Promise<Pessoa[]> {
        const res = await db.query<Pessoa>(
            `
            SELECT ${pessoaSelect}
            FROM pessoa_familia pf
            INNER JOIN vw_pessoa_ativa p ON p.id = pf.id_pessoa
            WHERE pf.id_familia = $1
              AND pf.data_saida IS NULL
            ORDER BY p.nome
            `,
            [idFamilia]
        );
        return res.rows;
    }

    async getHistoricoPessoas(idFamilia: number, db: Queryable = this.db): Promise<PessoaFamiliaHistoricoDto[]> {
        const res = await db.query<PessoaFamiliaHistoricoRow>(
            `
            SELECT
                pf.id_pessoa AS "idPessoa",
                pf.id_familia AS "idFamilia",
                pf.data_entrada AS "dataEntrada",
                pf.data_saida AS "dataSaida",
                ${pessoaSelect}
            FROM pessoa_familia pf
            INNER JOIN pessoa p ON p.id = pf.id_pessoa
            WHERE pf.id_familia = $1
            ORDER BY pf.data_entrada DESC, p.nome
            `,
            [idFamilia]
        );
        return res.rows.map(mapPessoaFamiliaHistorico);
    }

    async getResponsavelAtivo(idFamilia: number, db: Queryable = this.db): Promise<Pessoa | null> {
        const res = await db.query<Pessoa>(
            `
            SELECT ${pessoaSelect}
            FROM pessoa_familia pf
            INNER JOIN vw_pessoa_ativa p ON p.id = pf.id_pessoa
            INNER JOIN responsavel r ON r.id_pessoa = pf.id_pessoa
            WHERE pf.id_familia = $1
              AND pf.data_saida IS NULL
              AND p.parentesco::text IN ('Responsável', 'RESPONSAVEL')
            ORDER BY pf.data_entrada
            LIMIT 1
            `,
            [idFamilia]
        );
        return res.rows[0] ?? null;
    }

    async vincularMoradia(
        idFamilia: number,
        idMoradia: number,
        dataEntrada: Date | null = null,
        status: string | null = null,
        db: Queryable = this.db
    ): Promise<FamiliaMoradia> {
        const res = await db.query<FamiliaMoradia>(
            `
            INSERT INTO familia_moradia (id_familia, id_moradia, data_entrada, status)
            VALUES ($1, $2, COALESCE($3, CURRENT_DATE), $4)
            RETURNING
                id_familia AS "idFamilia",
                id_moradia AS "idMoradia",
                data_entrada AS "dataEntrada",
                data_saida AS "dataSaida",
                status
            `,
            [idFamilia, idMoradia, dataEntrada, status]
        );
        return res.rows[0];
    }

    async removerMoradia(
        idFamilia: number,
        idMoradia: number,
        dataSaida: Date | null = null,
        db: Queryable = this.db
    ): Promise<FamiliaMoradia | null> {
        const res = await db.query<FamiliaMoradia>(
            `
            UPDATE familia_moradia
            SET data_saida = COALESCE($3, CURRENT_DATE)
            WHERE id_familia = $1
              AND id_moradia = $2
              AND data_saida IS NULL
            RETURNING
                id_familia AS "idFamilia",
                id_moradia AS "idMoradia",
                data_entrada AS "dataEntrada",
                data_saida AS "dataSaida",
                status
            `,
            [idFamilia, idMoradia, dataSaida]
        );
        return res.rows[0] ?? null;
    }

    async getMoradias(idFamilia: number, db: Queryable = this.db): Promise<Moradia[]> {
        const res = await db.query<Moradia>(
            `
            SELECT ${moradiaSelect}
            FROM familia_moradia fm
            INNER JOIN vw_moradia_ativa m ON m.id = fm.id_moradia
            WHERE fm.id_familia = $1
              AND fm.data_saida IS NULL
            ORDER BY m.id
            `,
            [idFamilia]
        );
        return res.rows;
    }

    async getHistoricoMoradias(idFamilia: number, db: Queryable = this.db): Promise<FamiliaMoradiaHistoricoDto[]> {
        const res = await db.query<FamiliaMoradiaHistoricoRow>(
            `
            SELECT
                fm.id_familia AS "idFamilia",
                fm.id_moradia AS "idMoradia",
                fm.data_entrada AS "dataEntrada",
                fm.data_saida AS "dataSaida",
                fm.status AS "statusVinculo",
                ${moradiaSelect}
            FROM familia_moradia fm
            INNER JOIN moradia m ON m.id = fm.id_moradia
            WHERE fm.id_familia = $1
            ORDER BY fm.data_entrada DESC, m.id
            `,
            [idFamilia]
        );
        return res.rows.map(mapFamiliaMoradiaHistorico);
    }

    async getFamiliasByMoradia(idMoradia: number, db: Queryable = this.db): Promise<Familia[]> {
        const res = await db.query<Familia>(
            `
            SELECT ${familiaSelect}
            FROM familia_moradia fm
            INNER JOIN vw_familia_ativa f ON f.id = fm.id_familia
            WHERE fm.id_moradia = $1
              AND fm.data_saida IS NULL
            ORDER BY f.id
            `,
            [idMoradia]
        );
        return res.rows;
    }

    async getHistoricoFamiliasByMoradia(idMoradia: number, db: Queryable = this.db): Promise<MoradiaFamiliaHistoricoDto[]> {
        const res = await db.query<MoradiaFamiliaHistoricoRow>(
            `
            SELECT
                fm.id_familia AS "idFamilia",
                fm.id_moradia AS "idMoradia",
                fm.data_entrada AS "dataEntrada",
                fm.data_saida AS "dataSaida",
                fm.status AS "statusVinculo",
                ${familiaAliasedSelect}
            FROM familia_moradia fm
            INNER JOIN familia f ON f.id = fm.id_familia
            WHERE fm.id_moradia = $1
            ORDER BY fm.data_entrada DESC, f.id
            `,
            [idMoradia]
        );
        return res.rows.map(mapMoradiaFamiliaHistorico);
    }

    async getPets(idFamilia: number, db: Queryable = this.db): Promise<Pet[]> {
        const res = await db.query<Pet>(
            `
            SELECT
                id,
                id_familia AS "idFamilia",
                tipo,
                nome,
                porte,
                raca,
                cor,
                status,
                observacao
            FROM pet
            WHERE id_familia = $1
            ORDER BY nome
            `,
            [idFamilia]
        );
        return res.rows;
    }
}
