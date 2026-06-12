# Diagrama de Classe Arquitetural

```mermaid
flowchart TD

%% =========================================================
%% BOOTSTRAP / EXPRESS
%% =========================================================
subgraph BOOT["Bootstrap e Express"]
  direction LR
  ServerTs["server.ts<br/>---<br/>+carrega .env<br/>+inicia app.listen(port)"]
  AppTs["app.ts<br/>---<br/>+configura Express<br/>+configura EJS<br/>+middlewares nativos<br/>+arquivos estaticos<br/>+registra rotas"]
end

%% =========================================================
%% VIEWS / PUBLIC
%% =========================================================
subgraph PRESENTATION["Views e Public"]
  direction LR
  Views["views/<br/>---<br/>pessoa-novo.ejs<br/>pessoa-lista.ejs"]
  Public["public/<br/>---<br/>styles.css"]
end

%% =========================================================
%% ROUTES
%% =========================================================
subgraph ROUTES["Routes"]
  direction LR
  PessoaRoutes["pessoa.routes.ts<br/>---<br/>/pessoas<br/>/pessoas.json<br/>/api/pessoas<br/>/api/responsaveis"]
  MoradiaRoutes["moradia.routes.ts<br/>---<br/>/api/moradias<br/>/api/moradias/:id/detalhes<br/>/api/moradias/:id/familias/historico"]
  FamiliaRoutes["familia.routes.ts<br/>---<br/>/api/familias<br/>/api/familias/nucleo<br/>/api/familias/:id/pessoas<br/>/api/familias/:id/moradias"]
  PetRoutes["pet.routes.ts<br/>---<br/>/api/pets<br/>/api/familias/:id/pets"]
  FotoRoutes["foto.routes.ts<br/>---<br/>/api/fotos<br/>/api/fotos/:id/signed-url<br/>/api/moradias/:id/fotos<br/>/api/pets/:id/fotos"]
end

%% =========================================================
%% CONTROLLERS
%% =========================================================
subgraph CONTROLLERS["Controllers"]
  direction LR
  PessoaController["PessoaController<br/>---<br/>+getAll()<br/>+getAllJson()<br/>+getById()<br/>+getInativas()<br/>+buscar()<br/>+novoForm()<br/>+criar()<br/>+atualizar()<br/>+remover()<br/>+getAllResponsaveis()<br/>+getResponsavelById()<br/>+criarResponsavel()<br/>+atualizarResponsavel()<br/>+removerResponsavel()"]
  MoradiaController["MoradiaController<br/>---<br/>+getAll()<br/>+getById()<br/>+getDetalhes()<br/>+getHistoricoFamilias()<br/>+criar()<br/>+atualizar()<br/>+remover()"]
  FamiliaController["FamiliaController<br/>---<br/>+getAll()<br/>+getById()<br/>+criar()<br/>+remover()<br/>+getPessoas()<br/>+getHistoricoPessoas()<br/>+getMoradias()<br/>+getHistoricoMoradias()<br/>+vincularPessoa()<br/>+removerPessoa()<br/>+vincularMoradia()<br/>+removerMoradia()<br/>+cadastrarNucleoFamiliar()"]
  PetController["PetController<br/>---<br/>+getAll()<br/>+getById()<br/>+getByFamilia()<br/>+criar()<br/>+criarNaFamilia()<br/>+atualizar()<br/>+remover()"]
  FotoController["FotoController<br/>---<br/>+getAll()<br/>+getById()<br/>+getByMoradia()<br/>+getByPet()<br/>+criarNaMoradia()<br/>+criarNoPet()<br/>+atualizar()<br/>+remover()<br/>+removerDaMoradia()<br/>+removerDoPet()"]
  FotoStorageController["FotoStorageController<br/>---<br/>+criarUploadParaMoradia()<br/>+criarUploadParaPet()<br/>+criarUrlAssinadaDaFoto()"]
  RequestUtils["request-utils.ts<br/>---<br/>+handleControllerError()<br/>+parseId()<br/>+asBody()<br/>+normalizeCreatePessoaDto()<br/>+normalizeUpdatePessoaDto()<br/>+normalizeCreateResponsavelDto()<br/>+normalizeUpdateResponsavelDto()<br/>+normalizeLocalizacaoDto()<br/>+normalizeMoradiaDto()"]
end

%% =========================================================
%% VALIDATIONS
%% =========================================================
subgraph VALIDATIONS["Validations"]
  direction LR
  PessoaValidation["pessoa.validation.ts<br/>---<br/>+validatePessoaPayload()<br/>+validateResponsavelPayload()"]
  MoradiaValidation["moradia.validation.ts<br/>---<br/>+validateLocalizacaoPayload()<br/>+validateMoradiaPayload()"]
  FamiliaValidation["familia.validation.ts<br/>---<br/>+validateVincularPessoaFamiliaPayload()<br/>+validateVincularMoradiaFamiliaPayload()<br/>+validateNucleoFamiliarPayload()"]
  PetValidation["pet.validation.ts<br/>---<br/>+validateCreatePet()<br/>+validateUpdatePet()"]
  FotoValidation["foto.validation.ts<br/>---<br/>+validateFotoUrl()"]
  FotoStorageValidation["foto-storage.validation.ts<br/>---<br/>+validateCreateFotoUploadUrlPayload()<br/>+extensionFromContentType()<br/>+validateStoragePath()<br/>+validateSignedUrlExpiration()"]
end

%% =========================================================
%% DTOS
%% =========================================================
subgraph DTOS["DTOs"]
  direction LR
  PessoaDto["pessoa.dto.ts<br/>---<br/>CreatePessoaDto<br/>UpdatePessoaDto<br/>CreateResponsavelDto<br/>UpdateResponsavelDto<br/>BuscarPessoaDto<br/>PessoaBuscaResultadoDto"]
  MoradiaDto["moradia.dto.ts<br/>---<br/>CreateMoradiaDto<br/>UpdateMoradiaDto<br/>CreateMoradiaComLocalizacaoDto<br/>UpdateMoradiaComLocalizacaoDto<br/>FamiliaMoradiaDetalheDto<br/>MoradiaDetalhadaDto"]
  LocalizacaoDto["localizacao.dto.ts<br/>---<br/>CreateLocalizacaoDto<br/>UpdateLocalizacaoDto"]
  FamiliaDto["familia.dto.ts<br/>---<br/>CreateFamiliaDto<br/>VincularPessoaFamiliaDto<br/>VincularMoradiaFamiliaDto<br/>CreateNucleoFamiliarDto<br/>NucleoFamiliarCriado<br/>Historicos de vinculo"]
  PetDto["pet.dto.ts<br/>---<br/>CreatePetDto<br/>CreatePetSemFamiliaDto<br/>UpdatePetDto"]
  FotoDto["foto.dto.ts<br/>---<br/>CreateFotoDto<br/>CreateFotoSemDonoDto<br/>CreateFotoSemMoradiaDto<br/>CreateFotoSemPetDto<br/>UpdateFotoDto"]
  FotoStorageDto["foto-storage.dto.ts<br/>---<br/>CreateFotoUploadUrlDto<br/>FotoUploadUrlDto<br/>FotoSignedUrlDto"]
end

%% =========================================================
%% SERVICES
%% =========================================================
subgraph SERVICES["Services"]
  direction LR
  subgraph SVC_IMPL["Implementations"]
    direction LR
    PessoaService["PessoaService<br/>---<br/>-repo: IPessoaRepository<br/>---<br/>+getAll()<br/>+getById()<br/>+getInativas()<br/>+buscar()<br/>+cadastrar()<br/>+atualizar()<br/>+remover()<br/>+getAllResponsaveis()<br/>+getResponsavelByPessoaId()<br/>+cadastrarResponsavel()<br/>+atualizarResponsavel()<br/>+removerResponsavel()"]
    MoradiaService["MoradiaService<br/>---<br/>-repo: IMoradiaRepository<br/>-familiaRepo?: IFamiliaRepository<br/>-fotoRepo?: IFotoRepository<br/>---<br/>+getAll()<br/>+getById()<br/>+getDetalhes()<br/>+getHistoricoFamilias()<br/>+cadastrar()<br/>+atualizar()<br/>+remover()"]
    FamiliaService["FamiliaService<br/>---<br/>-familiaRepo: IFamiliaRepository<br/>-moradiaRepo: IMoradiaRepository<br/>-pessoaRepo: IPessoaRepository<br/>-petRepo: IPetRepository<br/>-fotoRepo: IFotoRepository<br/>---<br/>+getAll()<br/>+getById()<br/>+cadastrar()<br/>+remover()<br/>+vincularPessoa()<br/>+vincularMoradia()<br/>+cadastrarNucleoFamiliar()"]
    PetService["PetService<br/>---<br/>-petRepo: IPetRepository<br/>-familiaRepo: IFamiliaRepository<br/>---<br/>+getAll()<br/>+getById()<br/>+getByFamilia()<br/>+cadastrar()<br/>+cadastrarNaFamilia()<br/>+atualizar()<br/>+remover()"]
    FotoService["FotoService<br/>---<br/>-fotoRepo: IFotoRepository<br/>-moradiaRepo: IMoradiaRepository<br/>-petRepo: IPetRepository<br/>---<br/>+getAll()<br/>+getById()<br/>+getByMoradia()<br/>+getByPet()<br/>+cadastrarNaMoradia()<br/>+cadastrarNoPet()<br/>+atualizar()<br/>+remover()"]
    FotoStorageService["FotoStorageService<br/>---<br/>-fotoRepo: IFotoRepository<br/>-moradiaRepo: IMoradiaRepository<br/>-petRepo: IPetRepository<br/>---<br/>+criarUploadParaMoradia()<br/>+criarUploadParaPet()<br/>+criarUrlAssinadaDaFoto()"]
  end

  subgraph SVC_IFACE["Interfaces"]
    direction LR
    IPessoaService["<<Interface>><br/>IPessoaService"]
    IMoradiaService["<<Interface>><br/>IMoradiaService"]
    IFamiliaService["<<Interface>><br/>IFamiliaService"]
    IPetService["<<Interface>><br/>IPetService"]
    IFotoService["<<Interface>><br/>IFotoService"]
    IFotoStorageService["<<Interface>><br/>IFotoStorageService"]
  end
end

%% =========================================================
%% REPOSITORIES
%% =========================================================
subgraph REPOSITORIES["Repositories"]
  direction LR
  subgraph REPO_IMPL["Implementations"]
    direction LR
    PessoaRepository["PessoaRepository<br/>---<br/>-db: Queryable = pool<br/>---<br/>+getAll()<br/>+getById()<br/>+getInativas()<br/>+search()<br/>+create()<br/>+update()<br/>+delete()<br/>+getAllResponsaveis()<br/>+getResponsavelByPessoaId()<br/>+createResponsavel()<br/>+updateResponsavel()"]
    MoradiaRepository["MoradiaRepository<br/>---<br/>-db: Queryable = pool<br/>---<br/>+getAll()<br/>+getById()<br/>+createLocalizacao()<br/>+updateLocalizacao()<br/>+create()<br/>+update()<br/>+delete()"]
    FamiliaRepository["FamiliaRepository<br/>---<br/>-db: Queryable = pool<br/>---<br/>+getAll()<br/>+getById()<br/>+create()<br/>+delete()<br/>+vincularPessoa()<br/>+removerPessoa()<br/>+getPessoas()<br/>+getHistoricoPessoas()<br/>+getResponsavelAtivo()<br/>+vincularMoradia()<br/>+removerMoradia()<br/>+getMoradias()<br/>+getHistoricoMoradias()<br/>+getFamiliasByMoradia()<br/>+getHistoricoFamiliasByMoradia()<br/>+getPets()"]
    PetRepository["PetRepository<br/>---<br/>-db: Queryable = pool<br/>---<br/>+getAll()<br/>+getById()<br/>+getByFamilia()<br/>+create()<br/>+createForFamilia()<br/>+update()<br/>+delete()"]
    FotoRepository["FotoRepository<br/>---<br/>-db: Queryable = pool<br/>---<br/>+getAll()<br/>+getById()<br/>+getByMoradia()<br/>+getByPet()<br/>+create()<br/>+createForMoradia()<br/>+createForPet()<br/>+update()<br/>+delete()"]
  end

  subgraph REPO_IFACE["Interfaces"]
    direction LR
    IPessoaRepository["<<Interface>><br/>IPessoaRepository"]
    IMoradiaRepository["<<Interface>><br/>IMoradiaRepository"]
    IFamiliaRepository["<<Interface>><br/>IFamiliaRepository"]
    IPetRepository["<<Interface>><br/>IPetRepository"]
    IFotoRepository["<<Interface>><br/>IFotoRepository"]
  end
end

%% =========================================================
%% DB / STORAGE / ERRORS / TESTS
%% =========================================================
subgraph INFRA["Infrastructure"]
  direction LR
  DbConnection["db/connection.ts<br/>---<br/>pool: Pool<br/>DATABASE_URL"]
  Queryable["db/queryable.ts<br/>---<br/><<Interface>><br/>Queryable.query()"]
  Migrate["db/migrate.ts<br/>---<br/>executa migrations"]
  Migrations["db/migrations/<br/>---<br/>01_create_pessoas<br/>02_add_familias<br/>03_allow_pet_photos<br/>04_add_pet_status<br/>05_enforce_responsavel_unico<br/>06_add_tipo_pet<br/>07_create_storage_bucket"]
  SupabaseStorageClient["storage/supabase-storage.client.ts<br/>---<br/>+getSupabaseStorageBucket()<br/>+getSupabaseStorageClient()"]
  HttpError["errors/http-error.ts<br/>---<br/>HttpError<br/>+statusCode"]
  Tests["tests/<br/>---<br/>pessoa.persistence.spec.ts<br/>controllers/pessoa.controller.spec.ts"]
end

%% =========================================================
%% MODELS
%% =========================================================
subgraph MODELS["Models"]
  direction LR

  subgraph DOMAIN["Domain interfaces"]
    direction LR
    Pessoa["Pessoa<br/>---<br/>+id: number<br/>+nome: string<br/>+nomeSocial: string | null<br/>+dataDeNascimento: Date<br/>+parentesco: Parentesco<br/>+situacaoOcupacional: SituacaoOcupacional<br/>+escolaridade: Escolaridade<br/>+cronico: boolean<br/>+medicacao: boolean<br/>+status: StatusPessoa<br/>+deletedAt: Date | null"]
    Responsavel["Responsavel extends Pessoa<br/>---<br/>+cpf: string | null<br/>+nis: string | null<br/>+renda: number | null<br/>+sexo: Sexo<br/>+raca: Raca<br/>+estadoCivil: EstadoCivil<br/>+veiculo: boolean<br/>+programaSocial: boolean<br/>+email: string | null<br/>+telefone: string | null<br/>+nomeDoPai: string | null<br/>+nomeDaMae: string | null<br/>+localDeNascimento: string | null<br/>+dataResidenciaEstado: Date | null<br/>+dataResidenciaMoradia: Date | null"]
    Familia["Familia<br/>---<br/>+id: number<br/>+deletedAt: Date | null"]
    PessoaFamilia["PessoaFamilia<br/>---<br/>+idPessoa: number<br/>+idFamilia: number<br/>+dataEntrada: Date<br/>+dataSaida: Date | null"]
    FamiliaMoradia["FamiliaMoradia<br/>---<br/>+idFamilia: number<br/>+idMoradia: number<br/>+dataEntrada: Date<br/>+dataSaida: Date | null<br/>+status: string | null"]
    Moradia["Moradia<br/>---<br/>+id: number<br/>+idLocalizacao: number<br/>+tipoConstrucao: TipoConstrucao<br/>+dataRegistro: Date | null<br/>+status: StatusMoradia<br/>+usoImovel: UsoImovel<br/>+pavimentos: number<br/>+situacaoDeOcupacao: SituacaoOcupacaoMoradia<br/>+descricao: string | null<br/>+deletedAt: Date | null"]
    MoradiaComLocalizacao["MoradiaComLocalizacao extends Moradia<br/>---<br/>+localizacao: Localizacao"]
    Localizacao["Localizacao<br/>---<br/>+id: number<br/>+logradouro: string | null<br/>+numero: string | null<br/>+bairro: string | null<br/>+cidade: string<br/>+estado: string<br/>+cep: string | null<br/>+latitude: number<br/>+longitude: number<br/>+referencia: string | null<br/>+complemento: string | null"]
    Pet["Pet<br/>---<br/>+id: number<br/>+idFamilia: number<br/>+tipo: TipoPet<br/>+nome: string<br/>+porte: string<br/>+raca: string<br/>+cor: string<br/>+status: StatusPet<br/>+observacao: string | null"]
    Foto["Foto<br/>---<br/>+id: number<br/>+idMoradia: number | null<br/>+idPet: number | null<br/>+url: string"]
    GrupoPrioritario["GrupoPrioritario<br/>---<br/>+id: number<br/>+condicao: string<br/>+tipo: TipoPrioridade<br/>+dataPrevistaParto: Date | null"]
    PessoaGrupoPrioritario["PessoaGrupoPrioritario<br/>---<br/>+idPessoa: number<br/>+idGrupoPrioritario: number"]
  end

  subgraph DOMAIN_TYPES["Enums"]
    direction LR
    PessoaTypes["Pessoa types<br/>---<br/>STATUS_PESSOA<br/>PARENTESCOS<br/>ESCOLARIDADES<br/>SITUACOES_OCUPACIONAIS<br/>SEXOS<br/>RACAS<br/>ESTADOS_CIVIS"]
    MoradiaTypes["Moradia types<br/>---<br/>STATUS_MORADIA<br/>TIPOS_CONSTRUCAO<br/>USOS_IMOVEL<br/>SITUACOES_OCUPACAO_MORADIA"]
    PetTypes["Pet types<br/>---<br/>STATUS_PET<br/>TIPOS_PET"]
    PrioridadeTypes["GrupoPrioritario types<br/>---<br/>TIPOS_PRIORIDADE"]
  end
end

%% =========================================================
%% MAIN FLOW
%% =========================================================
ServerTs --> AppTs
AppTs --> Views
AppTs --> Public
AppTs --> PessoaRoutes
AppTs --> MoradiaRoutes
AppTs --> FamiliaRoutes
AppTs --> PetRoutes
AppTs --> FotoRoutes

PessoaRoutes --> PessoaController
MoradiaRoutes --> MoradiaController
FamiliaRoutes --> FamiliaController
PetRoutes --> PetController
FotoRoutes --> FotoController
FotoRoutes --> FotoStorageController

PessoaController --> RequestUtils
MoradiaController --> RequestUtils
FamiliaController --> RequestUtils
PetController --> RequestUtils
FotoController --> RequestUtils
FotoStorageController --> RequestUtils
FotoStorageController --> FotoStorageValidation

RequestUtils --> PessoaDto
RequestUtils --> MoradiaDto
RequestUtils --> LocalizacaoDto
PessoaController --> IPessoaService
MoradiaController --> IMoradiaService
FamiliaController --> IFamiliaService
PetController --> IPetService
FotoController --> IFotoService
FotoStorageController --> IFotoStorageService

PessoaService --> IPessoaService
MoradiaService --> IMoradiaService
FamiliaService --> IFamiliaService
PetService --> IPetService
FotoService --> IFotoService
FotoStorageService --> IFotoStorageService

PessoaService --> IPessoaRepository
MoradiaService --> IMoradiaRepository
MoradiaService --> IFamiliaRepository
MoradiaService --> IFotoRepository
FamiliaService --> IFamiliaRepository
FamiliaService --> IMoradiaRepository
FamiliaService --> IPessoaRepository
FamiliaService --> IPetRepository
FamiliaService --> IFotoRepository
PetService --> IPetRepository
PetService --> IFamiliaRepository
FotoService --> IFotoRepository
FotoService --> IMoradiaRepository
FotoService --> IPetRepository
FotoStorageService --> IFotoRepository
FotoStorageService --> IMoradiaRepository
FotoStorageService --> IPetRepository
FotoStorageService --> FotoStorageValidation

PessoaRepository --> IPessoaRepository
MoradiaRepository --> IMoradiaRepository
FamiliaRepository --> IFamiliaRepository
PetRepository --> IPetRepository
FotoRepository --> IFotoRepository

PessoaService --> PessoaValidation
MoradiaService --> MoradiaValidation
FamiliaService --> FamiliaValidation
PetService --> PetValidation
FotoService --> FotoValidation

PessoaDto --> Pessoa
PessoaDto --> Responsavel
MoradiaDto --> Moradia
MoradiaDto --> MoradiaComLocalizacao
MoradiaDto --> Localizacao
FamiliaDto --> Familia
FamiliaDto --> Pessoa
FamiliaDto --> Responsavel
FamiliaDto --> Moradia
FamiliaDto --> Pet
FamiliaDto --> Foto
PetDto --> Pet
FotoDto --> Foto
FotoStorageDto --> Foto
LocalizacaoDto --> Localizacao

%% =========================================================
%% MODEL RELATIONSHIPS
%% =========================================================
Responsavel --> Pessoa
PessoaFamilia --> Pessoa
PessoaFamilia --> Familia
FamiliaMoradia --> Familia
FamiliaMoradia --> Moradia
MoradiaComLocalizacao --> Moradia
MoradiaComLocalizacao --> Localizacao
Moradia --> Localizacao
Pet --> Familia
Foto --> Moradia
Foto --> Pet
PessoaGrupoPrioritario --> Pessoa
PessoaGrupoPrioritario --> GrupoPrioritario

```
