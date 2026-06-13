import { pool } from '../db/connection.ts';
import type { Queryable } from '../db/queryable';
import { getSupabaseDbClient, isDatabaseHostResolutionError } from '../db/supabase';
import type {
    BuscarFamiliaDto,
    FamiliaBuscaResultadoDto,
    FamiliaMoradiaHistoricoDto,
    MoradiaFamiliaHistoricoDto,
    PessoaFamiliaHistoricoDto
} from '../dtos/familia.dto';
import type { IFamiliaRepository } from '../interfaces/repositories/familia.repository.interface';
import type { Familia, FamiliaMoradia, PessoaFamilia } from '../models/familia.model';
import type { Moradia } from '../models/moradia.model';
import type { Pessoa } from '../models/pessoa.model';
import type { Pet } from '../models/pet.model';

type FamiliaApiRow = {
    id: number;
    deleted_at: Date | string | null;
};

type PessoaApiRow = {
    id: number;
    nome: string;
    nome_social: string | null;
    cpf: string | null;
    data_de_nascimento: Date | string;
    parentesco: Pessoa['parentesco'];
    situacao_ocupacional: Pessoa['situacaoOcupacional'];
    escolaridade: Pessoa['escolaridade'];
    cronico: boolean;
    medicacao: boolean;
    status: Pessoa['status'];
    deleted_at: Date | string | null;
};

type PessoaFamiliaApiRow = {
    id_pessoa: number;
    id_familia: number;
    data_entrada: Date | string;
    data_saida: Date | string | null;
};

type FamiliaMoradiaApiRow = {
    id_familia: number;
    id_moradia: number;
    data_entrada: Date | string;
    data_saida: Date | string | null;
    status: string | null;
};

type MoradiaApiRow = {
    id: number;
    id_localizacao: number;
    tipo_construcao: Moradia['tipoConstrucao'];
    data_registro: Date | string | null;
    status: Moradia['status'];
    uso_imovel: Moradia['usoImovel'];
    pavimentos: number;
    situacao_de_ocupacao: Moradia['situacaoDeOcupacao'];
    descricao: string | null;
    deleted_at: Date | string | null;
};

type LocalizacaoApiRow = {
    id: number;
    bairro: string | null;
};

type PetApiRow = {
    id: number;
    id_familia: number;
    tipo: Pet['tipo'];
    nome: string;
    porte: string;
    raca: string;
    cor: string;
    status?: Pet['status'];
    observacao: string | null;
};

type PessoaGrupoPrioritarioApiRow = {
    id_pessoa: number;
    id_grupo_prioritario: number;
};

type GrupoPrioritarioApiRow = {
    id: number;
    condicao: string;
    tipo: string;
};

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
    p.cpf,
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

interface FamiliaBuscaRow {
    id: number;
    responsavelId: number | null;
    responsavelNome: string | null;
    responsavelCpf: string | null;
    bairro: string | null;
    totalPessoas: number;
    totalPets: number;
    prioridadeTipos: string[];
    prioridadeCondicoes: string[];
    idoso: boolean;
    crianca: boolean;
    gestante: boolean;
    doencaCronica: boolean;
}

function mapFamiliaBusca(row: FamiliaBuscaRow): FamiliaBuscaResultadoDto {
    return {
        id: row.id,
        responsavel: row.responsavelId === null
            ? null
            : {
                id: row.responsavelId,
                nome: row.responsavelNome ?? '',
                cpf: row.responsavelCpf
            },
        bairro: row.bairro,
        totalPessoas: row.totalPessoas,
        totalPets: row.totalPets,
        prioridadeTipos: row.prioridadeTipos,
        prioridadeCondicoes: row.prioridadeCondicoes,
        grupos: {
            idoso: row.idoso,
            crianca: row.crianca,
            gestante: row.gestante,
            doencaCronica: row.doencaCronica
        }
    };
}

function mapPessoaApiRow(row: PessoaApiRow): Pessoa {
    return {
        id: row.id,
        nome: row.nome,
        nomeSocial: row.nome_social,
        cpf: row.cpf,
        dataDeNascimento: row.data_de_nascimento as Date,
        parentesco: row.parentesco,
        situacaoOcupacional: row.situacao_ocupacional,
        escolaridade: row.escolaridade,
        cronico: row.cronico,
        medicacao: row.medicacao,
        status: row.status,
        deletedAt: row.deleted_at as Date | null
    };
}

function mapMoradiaApiRow(row: MoradiaApiRow): Moradia {
    return {
        id: row.id,
        idLocalizacao: row.id_localizacao,
        tipoConstrucao: row.tipo_construcao,
        dataRegistro: row.data_registro as Date | null,
        status: row.status,
        usoImovel: row.uso_imovel,
        pavimentos: row.pavimentos,
        situacaoDeOcupacao: row.situacao_de_ocupacao,
        descricao: row.descricao,
        deletedAt: row.deleted_at as Date | null
    };
}

function mapPetApiRow(row: PetApiRow): Pet {
    return {
        id: row.id,
        idFamilia: row.id_familia,
        tipo: row.tipo,
        nome: row.nome,
        porte: row.porte,
        raca: row.raca,
        cor: row.cor,
        status: row.status ?? 'Ativo',
        observacao: row.observacao
    };
}

function idade(data: Date | string | null | undefined): number | null {
    if (!data) return null;
    const nascimento = data instanceof Date ? data : new Date(data);
    if (Number.isNaN(nascimento.getTime())) return null;
    const hoje = new Date();
    let anos = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) anos--;
    return anos;
}

function inclui(texto: string | null | undefined, termo: string): boolean {
    return (texto ?? '').toLocaleLowerCase('pt-BR').includes(termo.toLocaleLowerCase('pt-BR'));
}

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
            cpf: row.cpf,
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

    async search(filtros: BuscarFamiliaDto, db: Queryable = this.db): Promise<FamiliaBuscaResultadoDto[]> {
        const termo = filtros.termo?.trim() ? filtros.termo.trim() : null;
        const bairro = filtros.bairro?.trim() ? filtros.bairro.trim() : null;

        try {
            const res = await db.query<FamiliaBuscaRow>(
                `
            SELECT
                f.id,
                resp.id AS "responsavelId",
                resp.nome AS "responsavelNome",
                resp.cpf AS "responsavelCpf",
                loc.bairro AS "bairro",
                (
                    SELECT COUNT(*)::int
                    FROM pessoa_familia pf
                    INNER JOIN vw_pessoa_ativa p ON p.id = pf.id_pessoa
                    WHERE pf.id_familia = f.id AND pf.data_saida IS NULL
                ) AS "totalPessoas",
                (
                    SELECT COUNT(*)::int FROM pet WHERE id_familia = f.id
                ) AS "totalPets",
                COALESCE(prioridades.tipos, ARRAY[]::text[]) AS "prioridadeTipos",
                COALESCE(prioridades.condicoes, ARRAY[]::text[]) AS "prioridadeCondicoes",
                EXISTS (
                    SELECT 1
                    FROM pessoa_familia pf
                    INNER JOIN vw_pessoa_ativa p ON p.id = pf.id_pessoa
                    WHERE pf.id_familia = f.id AND pf.data_saida IS NULL
                      AND date_part('year', age(p.data_de_nascimento)) >= 60
                ) AS "idoso",
                EXISTS (
                    SELECT 1
                    FROM pessoa_familia pf
                    INNER JOIN vw_pessoa_ativa p ON p.id = pf.id_pessoa
                    WHERE pf.id_familia = f.id AND pf.data_saida IS NULL
                      AND date_part('year', age(p.data_de_nascimento)) < 12
                ) AS "crianca",
                EXISTS (
                    SELECT 1
                    FROM pessoa_familia pf
                    INNER JOIN vw_pessoa_ativa p ON p.id = pf.id_pessoa
                    WHERE pf.id_familia = f.id AND pf.data_saida IS NULL
                      AND p.cronico = true
                ) AS "doencaCronica",
                EXISTS (
                    SELECT 1
                    FROM pessoa_familia pf
                    INNER JOIN pessoa_grupo_prioritario pgp ON pgp.id_pessoa = pf.id_pessoa
                    INNER JOIN grupo_prioritario gp ON gp.id = pgp.id_grupo_prioritario
                    WHERE pf.id_familia = f.id AND pf.data_saida IS NULL
                      AND (
                          gp.condicao ILIKE '%gestante%'
                          OR gp.condicao ILIKE '%grávida%'
                          OR gp.condicao ILIKE '%gravida%'
                      )
                ) AS "gestante"
            FROM vw_familia_ativa f
            LEFT JOIN LATERAL (
                SELECT
                    array_agg(DISTINCT gp.tipo::text ORDER BY gp.tipo::text) AS tipos,
                    array_agg(DISTINCT gp.condicao::text ORDER BY gp.condicao::text) AS condicoes
                FROM pessoa_familia pf
                INNER JOIN pessoa_grupo_prioritario pgp ON pgp.id_pessoa = pf.id_pessoa
                INNER JOIN grupo_prioritario gp ON gp.id = pgp.id_grupo_prioritario
                WHERE pf.id_familia = f.id
                  AND pf.data_saida IS NULL
            ) prioridades ON true
            LEFT JOIN LATERAL (
                SELECT p.id, p.nome, p.cpf
                FROM pessoa_familia pf
                INNER JOIN vw_pessoa_ativa p ON p.id = pf.id_pessoa
                INNER JOIN responsavel r ON r.id_pessoa = pf.id_pessoa
                WHERE pf.id_familia = f.id
                  AND pf.data_saida IS NULL
                  AND p.parentesco::text IN ('Responsável', 'RESPONSAVEL')
                ORDER BY pf.data_entrada
                LIMIT 1
            ) resp ON true
            LEFT JOIN LATERAL (
                SELECT m.id_localizacao
                FROM familia_moradia fm
                INNER JOIN moradia m ON m.id = fm.id_moradia
                WHERE fm.id_familia = f.id
                  AND fm.data_saida IS NULL
                  AND m.deleted_at IS NULL
                ORDER BY fm.data_entrada
                LIMIT 1
            ) mor ON true
            LEFT JOIN localizacao loc ON loc.id = mor.id_localizacao
            WHERE ($1::text IS NULL OR resp.nome ILIKE '%' || $1 || '%' OR resp.cpf ILIKE '%' || $1 || '%')
              AND ($2::text IS NULL OR loc.bairro ILIKE '%' || $2 || '%')
            ORDER BY resp.nome NULLS LAST, f.id
            `,
                [termo, bairro]
            );
            return res.rows.map(mapFamiliaBusca);
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) {
                throw err;
            }
            return this.searchViaSupabase(termo, bairro);
        }
    }

    private async searchViaSupabase(termo: string | null, bairro: string | null): Promise<FamiliaBuscaResultadoDto[]> {
        const supabase = getSupabaseDbClient();
        const { data: familias, error: familiasError } = await supabase
            .from('vw_familia_ativa')
            .select('id, deleted_at')
            .order('id')
            .range(0, 9999);
        if (familiasError) throw familiasError;

        const familiaIds = (familias ?? []).map((familia) => familia.id);
        if (!familiaIds.length) return [];

        const [
            pessoaFamiliaResult,
            familiaMoradiaResult,
            petsResult,
            gruposResult
        ] = await Promise.all([
            supabase.from('pessoa_familia').select('id_pessoa, id_familia, data_entrada, data_saida').in('id_familia', familiaIds).is('data_saida', null).range(0, 9999),
            supabase.from('familia_moradia').select('id_familia, id_moradia, data_entrada, data_saida, status').in('id_familia', familiaIds).is('data_saida', null).range(0, 9999),
            supabase.from('pet').select('id, id_familia, tipo, nome, porte, raca, cor, observacao').in('id_familia', familiaIds).range(0, 9999),
            supabase.from('grupo_prioritario').select('id, condicao, tipo').range(0, 9999)
        ]);
        if (pessoaFamiliaResult.error) throw pessoaFamiliaResult.error;
        if (familiaMoradiaResult.error) throw familiaMoradiaResult.error;
        if (petsResult.error) throw petsResult.error;
        if (gruposResult.error) throw gruposResult.error;

        const pessoaFamilia = (pessoaFamiliaResult.data ?? []) as PessoaFamiliaApiRow[];
        const pessoaIds = [...new Set(pessoaFamilia.map((vinculo) => vinculo.id_pessoa))];
        const moradiaIds = [...new Set(((familiaMoradiaResult.data ?? []) as FamiliaMoradiaApiRow[]).map((vinculo) => vinculo.id_moradia))];

        const [pessoasResult, responsaveisResult, moradiasResult, pessoaGruposResult] = await Promise.all([
            pessoaIds.length
                ? supabase.from('vw_pessoa_ativa').select('id, nome, nome_social, cpf, data_de_nascimento, parentesco, situacao_ocupacional, escolaridade, cronico, medicacao, status, deleted_at').in('id', pessoaIds).range(0, 9999)
                : Promise.resolve({ data: [], error: null }),
            pessoaIds.length
                ? supabase.from('responsavel').select('id_pessoa').in('id_pessoa', pessoaIds).range(0, 9999)
                : Promise.resolve({ data: [], error: null }),
            moradiaIds.length
                ? supabase.from('moradia').select('id, id_localizacao, tipo_construcao, data_registro, status, uso_imovel, pavimentos, situacao_de_ocupacao, descricao, deleted_at').in('id', moradiaIds).is('deleted_at', null).range(0, 9999)
                : Promise.resolve({ data: [], error: null }),
            pessoaIds.length
                ? supabase.from('pessoa_grupo_prioritario').select('id_pessoa, id_grupo_prioritario').in('id_pessoa', pessoaIds).range(0, 9999)
                : Promise.resolve({ data: [], error: null })
        ]);
        if (pessoasResult.error) throw pessoasResult.error;
        if (responsaveisResult.error) throw responsaveisResult.error;
        if (moradiasResult.error) throw moradiasResult.error;
        if (pessoaGruposResult.error) throw pessoaGruposResult.error;

        const moradias = (moradiasResult.data ?? []) as MoradiaApiRow[];
        const localizacaoIds = [...new Set(moradias.map((moradia) => moradia.id_localizacao))];
        const localizacoesResult = localizacaoIds.length
            ? await supabase.from('localizacao').select('id, bairro').in('id', localizacaoIds).range(0, 9999)
            : { data: [], error: null };
        if (localizacoesResult.error) throw localizacoesResult.error;

        const pessoaById = new Map(((pessoasResult.data ?? []) as PessoaApiRow[]).map((pessoa) => [pessoa.id, pessoa]));
        const responsavelIds = new Set((responsaveisResult.data ?? []).map((row) => row.id_pessoa));
        const petsByFamilia = new Map<number, PetApiRow[]>();
        for (const pet of (petsResult.data ?? []) as PetApiRow[]) {
            petsByFamilia.set(pet.id_familia, [...(petsByFamilia.get(pet.id_familia) ?? []), pet]);
        }
        const moradiaById = new Map(moradias.map((moradia) => [moradia.id, moradia]));
        const localizacaoById = new Map(((localizacoesResult.data ?? []) as LocalizacaoApiRow[]).map((localizacao) => [localizacao.id, localizacao]));
        const grupoById = new Map(((gruposResult.data ?? []) as GrupoPrioritarioApiRow[]).map((grupo) => [grupo.id, grupo]));
        const pessoaGrupos = (pessoaGruposResult.data ?? []) as PessoaGrupoPrioritarioApiRow[];

        return ((familias ?? []) as FamiliaApiRow[])
            .map((familia) => {
                const vinculosPessoa = pessoaFamilia.filter((vinculo) => vinculo.id_familia === familia.id);
                const pessoasDaFamilia = vinculosPessoa
                    .map((vinculo) => pessoaById.get(vinculo.id_pessoa))
                    .filter((pessoa): pessoa is PessoaApiRow => Boolean(pessoa));
                const responsavel = pessoasDaFamilia.find((pessoa) => responsavelIds.has(pessoa.id) && pessoa.parentesco === 'Responsável') ?? null;
                const primeiroVinculoMoradia = ((familiaMoradiaResult.data ?? []) as FamiliaMoradiaApiRow[]).find((vinculo) => vinculo.id_familia === familia.id);
                const moradia = primeiroVinculoMoradia ? moradiaById.get(primeiroVinculoMoradia.id_moradia) : undefined;
                const localizacao = moradia ? localizacaoById.get(moradia.id_localizacao) : undefined;
                const prioridades = pessoaGrupos
                    .filter((vinculo) => vinculosPessoa.some((pessoa) => pessoa.id_pessoa === vinculo.id_pessoa))
                    .map((vinculo) => grupoById.get(vinculo.id_grupo_prioritario))
                    .filter((grupo): grupo is GrupoPrioritarioApiRow => Boolean(grupo));
                const condicoes = [...new Set(prioridades.map((prioridade) => prioridade.condicao))].sort();
                const tipos = [...new Set(prioridades.map((prioridade) => prioridade.tipo))].sort();
                const row: FamiliaBuscaRow = {
                    id: familia.id,
                    responsavelId: responsavel?.id ?? null,
                    responsavelNome: responsavel?.nome ?? null,
                    responsavelCpf: responsavel?.cpf ?? null,
                    bairro: localizacao?.bairro ?? null,
                    totalPessoas: pessoasDaFamilia.length,
                    totalPets: petsByFamilia.get(familia.id)?.length ?? 0,
                    prioridadeTipos: tipos,
                    prioridadeCondicoes: condicoes,
                    idoso: pessoasDaFamilia.some((pessoa) => (idade(pessoa.data_de_nascimento) ?? 0) >= 60) || condicoes.some((condicao) => inclui(condicao, 'idoso')),
                    crianca: pessoasDaFamilia.some((pessoa) => {
                        const anos = idade(pessoa.data_de_nascimento);
                        return anos !== null && anos < 12;
                    }) || condicoes.some((condicao) => inclui(condicao, 'criança') || inclui(condicao, 'crianca')),
                    gestante: condicoes.some((condicao) => inclui(condicao, 'grávida') || inclui(condicao, 'gravida') || inclui(condicao, 'gestante')),
                    doencaCronica: pessoasDaFamilia.some((pessoa) => pessoa.cronico) || condicoes.some((condicao) => inclui(condicao, 'crônica') || inclui(condicao, 'cronica'))
                };
                return row;
            })
            .filter((familia) => {
                if (termo && !inclui(familia.responsavelNome, termo) && !inclui(familia.responsavelCpf, termo)) return false;
                if (bairro && !inclui(familia.bairro, bairro)) return false;
                return true;
            })
            .map(mapFamiliaBusca);
    }

    async getById(id: number, db: Queryable = this.db): Promise<Familia | null> {
        try {
            const res = await db.query<Familia>(
                `
                SELECT ${familiaSelect}
                FROM vw_familia_ativa
                WHERE id = $1
                `,
                [id]
            );
            return res.rows[0] ?? null;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { data, error } = await getSupabaseDbClient()
                .from('vw_familia_ativa')
                .select('id, deleted_at')
                .eq('id', id)
                .maybeSingle();
            if (error) throw error;
            return data ? { id: data.id, deletedAt: data.deleted_at as Date | null } : null;
        }
    }

    async create(db: Queryable = this.db): Promise<Familia> {
        const res = await db.query<Familia>(`
            INSERT INTO familia DEFAULT VALUES
            RETURNING ${familiaSelect}
        `);
        return res.rows[0];
    }

    async delete(id: number, db: Queryable = this.db): Promise<void> {
        try {
            await db.query(
                `
                UPDATE familia
                SET deleted_at = COALESCE(deleted_at, NOW())
                WHERE id = $1
                  AND deleted_at IS NULL
                `,
                [id]
            );
            await db.query(
                `
                UPDATE pessoa_familia
                SET data_saida = CURRENT_DATE
                WHERE id_familia = $1
                  AND data_saida IS NULL
                `,
                [id]
            );
            await db.query(
                `
                UPDATE familia_moradia
                SET data_saida = CURRENT_DATE
                WHERE id_familia = $1
                  AND data_saida IS NULL
                `,
                [id]
            );
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const supabase = getSupabaseDbClient();
            const today = new Date().toISOString().slice(0, 10);
            const { error: familiaError } = await supabase
                .from('familia')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', id)
                .is('deleted_at', null);
            if (familiaError) throw familiaError;

            const { error: pessoasError } = await supabase
                .from('pessoa_familia')
                .update({ data_saida: today })
                .eq('id_familia', id)
                .is('data_saida', null);
            if (pessoasError) throw pessoasError;

            const { error: moradiasError } = await supabase
                .from('familia_moradia')
                .update({ data_saida: today })
                .eq('id_familia', id)
                .is('data_saida', null);
            if (moradiasError) throw moradiasError;
        }
    }

    async vincularPessoa(
        idFamilia: number,
        idPessoa: number,
        dataEntrada: Date | null = null,
        db: Queryable = this.db
    ): Promise<PessoaFamilia> {
        try {
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
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { data, error } = await getSupabaseDbClient()
                .from('pessoa_familia')
                .insert({
                    id_pessoa: idPessoa,
                    id_familia: idFamilia,
                    data_entrada: dataEntrada ?? new Date()
                })
                .select('id_pessoa, id_familia, data_entrada, data_saida')
                .single();
            if (error) throw error;
            return {
                idPessoa: data.id_pessoa,
                idFamilia: data.id_familia,
                dataEntrada: data.data_entrada as Date,
                dataSaida: data.data_saida as Date | null
            };
        }
    }

    async removerPessoa(
        idFamilia: number,
        idPessoa: number,
        dataSaida: Date | null = null,
        db: Queryable = this.db
    ): Promise<PessoaFamilia | null> {
        try {
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
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { data, error } = await getSupabaseDbClient()
                .from('pessoa_familia')
                .update({ data_saida: dataSaida ?? new Date() })
                .eq('id_familia', idFamilia)
                .eq('id_pessoa', idPessoa)
                .is('data_saida', null)
                .select('id_pessoa, id_familia, data_entrada, data_saida')
                .maybeSingle();
            if (error) throw error;
            return data ? {
                idPessoa: data.id_pessoa,
                idFamilia: data.id_familia,
                dataEntrada: data.data_entrada as Date,
                dataSaida: data.data_saida as Date | null
            } : null;
        }
    }

    async getPessoas(idFamilia: number, db: Queryable = this.db): Promise<Pessoa[]> {
        try {
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
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            return this.getPessoasViaSupabase(idFamilia);
        }
    }

    private async getPessoasViaSupabase(idFamilia: number): Promise<Pessoa[]> {
        const supabase = getSupabaseDbClient();
        const { data: vinculos, error: vinculosError } = await supabase
            .from('pessoa_familia')
            .select('id_pessoa')
            .eq('id_familia', idFamilia)
            .is('data_saida', null);
        if (vinculosError) throw vinculosError;

        const pessoaIds = (vinculos ?? []).map((vinculo) => vinculo.id_pessoa);
        if (!pessoaIds.length) return [];

        const { data, error } = await supabase
            .from('vw_pessoa_ativa')
            .select('id, nome, nome_social, cpf, data_de_nascimento, parentesco, situacao_ocupacional, escolaridade, cronico, medicacao, status, deleted_at')
            .in('id', pessoaIds)
            .order('nome');
        if (error) throw error;

        return ((data ?? []) as PessoaApiRow[]).map(mapPessoaApiRow);
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
        try {
            const res = await db.query<Moradia>(
                `
                SELECT ${moradiaSelect}
                FROM familia_moradia fm
                INNER JOIN moradia m ON m.id = fm.id_moradia
                WHERE fm.id_familia = $1
                  AND fm.data_saida IS NULL
                  AND m.deleted_at IS NULL
                ORDER BY m.id
                `,
                [idFamilia]
            );
            return res.rows;
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            return this.getMoradiasViaSupabase(idFamilia);
        }
    }

    private async getMoradiasViaSupabase(idFamilia: number): Promise<Moradia[]> {
        const supabase = getSupabaseDbClient();
        const { data: vinculos, error: vinculosError } = await supabase
            .from('familia_moradia')
            .select('id_moradia')
            .eq('id_familia', idFamilia)
            .is('data_saida', null);
        if (vinculosError) throw vinculosError;

        const moradiaIds = (vinculos ?? []).map((vinculo) => vinculo.id_moradia);
        if (!moradiaIds.length) return [];

        const { data, error } = await supabase
            .from('moradia')
            .select('id, id_localizacao, tipo_construcao, data_registro, status, uso_imovel, pavimentos, situacao_de_ocupacao, descricao, deleted_at')
            .in('id', moradiaIds)
            .is('deleted_at', null)
            .order('id');
        if (error) throw error;

        return ((data ?? []) as MoradiaApiRow[]).map(mapMoradiaApiRow);
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
        try {
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
        } catch (err) {
            if (!isDatabaseHostResolutionError(err)) throw err;
            const { data, error } = await getSupabaseDbClient()
                .from('pet')
                .select('id, id_familia, tipo, nome, porte, raca, cor, observacao')
                .eq('id_familia', idFamilia)
                .order('nome');
            if (error) throw error;
            return ((data ?? []) as PetApiRow[]).map(mapPetApiRow);
        }
    }
}
