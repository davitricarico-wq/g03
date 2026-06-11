import type {
    CreateMoradiaComLocalizacaoDto,
    MoradiaDetalhadaDto,
    UpdateMoradiaComLocalizacaoDto
} from '../../dtos/moradia.dto';
import type { MoradiaFamiliaHistoricoDto } from '../../dtos/familia.dto';
import type { MoradiaComLocalizacao } from '../../models/moradia.model';

export interface MoradorRiscoCritico {
    mobilidadeReduzida?: boolean;
    acamado?: boolean;
    gruposPrioritarios?: string[];
}

export interface AvaliarRiscoCriticoDto {
    possuiHistoricoOcorrencia: boolean;
    moradores: MoradorRiscoCritico[];
}

export interface IMoradiaService {
    getAll(): Promise<MoradiaComLocalizacao[]>;
    getById(id: number): Promise<MoradiaComLocalizacao>;
    getDetalhes(id: number): Promise<MoradiaDetalhadaDto>;
    getHistoricoFamilias(id: number): Promise<MoradiaFamiliaHistoricoDto[]>;
    deveAlertarRecadastro(ultimaAtualizacao: Date, referencia?: Date): boolean;
    avaliarRiscoCritico(data: AvaliarRiscoCriticoDto): boolean;
    cadastrar(data: CreateMoradiaComLocalizacaoDto): Promise<MoradiaComLocalizacao>;
    atualizar(id: number, data: UpdateMoradiaComLocalizacaoDto): Promise<MoradiaComLocalizacao>;
    remover(id: number): Promise<void>;
}
