# Documentacao de Endpoints - GeoRisco Santo Andre

**Status**: atualizado conforme o backend em `src/geoRisco/src` em 2026-06-10.

Este documento descreve os endpoints HTTP implementados no backend atual do projeto GeoRisco. A lista foi conferida contra os arquivos de rotas e controllers:

- `src/routes/pessoa.routes.ts`
- `src/routes/moradia.routes.ts`
- `src/routes/familia.routes.ts`
- `src/routes/pet.routes.ts`
- `src/routes/foto.routes.ts`

## Padroes Gerais

### Base URL da API

```txt
http://localhost:1234/api
```

### Headers para JSON

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |

### Formato de erro atual

O handler centralizado retorna:

```json
{
  "error": "Mensagem do erro"
}
```

### Status HTTP usados pelo backend atual

| Status | Significado |
|---:|---|
| `200` | Requisicao bem-sucedida com resposta JSON ou HTML |
| `201` | Recurso criado com sucesso |
| `204` | Operacao concluida sem corpo de resposta |
| `400` | Requisicao invalida, payload invalido, campo obrigatorio ausente ou validacao falhou |
| `404` | Recurso nao encontrado |
| `409` | Conflito de regra de negocio |
| `500` | Erro interno ou dependencia nao configurada |
| `502` | Falha ao gerar URL assinada no storage |

> Observacao: o backend atual nao possui middleware de autenticacao/autorizacao nas rotas listadas. Por isso, `401` e `403` nao fazem parte do contrato implementado nestes controllers.

## Sumario

### Endpoints da API

**Total de endpoints `/api` implementados**: 52

| Modulo | Quantidade |
|---|---:|
| Pessoas | 7 |
| Responsaveis | 5 |
| Moradias | 7 |
| Familias | 13 |
| Pets | 7 |
| Fotos | 13 |

### Rotas HTML tambem implementadas

Estas rotas existem no backend, mas nao fazem parte da API JSON:

| Metodo | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/` | Redireciona para `/pessoas/novo` |
| `GET` | `/pessoas/novo` | Renderiza formulario de pessoa |
| `GET` | `/pessoas` | Renderiza lista de pessoas |
| `GET` | `/pessoas.json` | Lista pessoas em JSON fora do prefixo `/api` |
| `POST` | `/pessoas/` | Cria pessoa fora do prefixo `/api` |

## Pessoas

### Campos de pessoa

Campos aceitos para criacao:

```json
{
  "nome": "Maria Silva",
  "nomeSocial": null,
  "dataDeNascimento": "1980-05-10",
  "parentesco": "Responsável",
  "situacaoOcupacional": "Empregado",
  "escolaridade": "Médio Completo",
  "cronico": false,
  "medicacao": false,
  "status": "Ativo"
}
```

Aliases aceitos:

| Camel case | Snake case aceito |
|---|---|
| `nomeSocial` | `nome_social` |
| `dataDeNascimento` | `data_de_nascimento` |
| `situacaoOcupacional` | `situacao_ocupacional` |

Campos obrigatorios na criacao:

| Campo | Tipo | Valores aceitos |
|---|---|---|
| `nome` | string | texto livre |
| `dataDeNascimento` | string (data ISO 8601) | qualquer data valida |
| `parentesco` | string | `Responsável`, `Cônjuge`, `Filho(a)`, `Enteado(a)`, `Pai/Mãe`, `Outro` |
| `situacaoOcupacional` | string | `Empregado`, `Desempregado`, `Autônomo`, `Informal`, `Aposentado/Pensionista`, `Estudante`, `Do Lar`, `Outro` |
| `escolaridade` | string | `Analfabeto`, `Fundamental Incompleto`, `Fundamental Completo`, `Médio Incompleto`, `Médio Completo`, `Superior Incompleto`, `Superior Completo`, `Pós-graduação` |
| `cronico` | boolean | `true`, `false` |
| `medicacao` | boolean | `true`, `false` |

Campos opcionais na criacao:

| Campo | Tipo | Padrao | Valores aceitos |
|---|---|---|---|
| `nomeSocial` | string ou `null` | `null` | texto livre |
| `status` | string | `"Ativo"` | `Ativo`, `Obito`, `Inativo` |

> **Pendencia — Grupos Prioritarios (RF001):** O banco ja possui as tabelas `grupo_prioritario` e `pessoa_grupo_prioritario`, e o model TypeScript correspondente existe em `models/grupo-prioritario.model.ts`. Porem, nenhum endpoint, service ou repository manipula esses dados atualmente — campos como `grupos` ou `idGrupoPrioritario` passados no corpo serao silenciosamente ignorados. O suporte completo a grupos de vulnerabilidade (idoso, crianca, gestante/lactante, PCD, mobilidade reduzida) esta pendente de implementacao.

### `GET /api/pessoas`

Lista todas as pessoas.

**Resposta**: `200 OK`

```json
[
  {
    "id": 1,
    "nome": "Maria Silva",
    "nomeSocial": null,
    "dataDeNascimento": "1980-05-10T00:00:00.000Z",
    "parentesco": "Responsável",
    "situacaoOcupacional": "Empregado",
    "escolaridade": "Médio Completo",
    "cronico": false,
    "medicacao": false,
    "status": "Ativo",
    "deletedAt": null
  }
]
```

### `GET /api/pessoas/busca`

Busca pessoas por filtros.

Query params aceitos:

| Parametro | Obrigatorio | Valores |
|---|---:|---|
| `nome` | Nao | texto |
| `cpf` | Nao | texto |
| `email` | Nao | texto |
| `telefone` | Nao | texto |
| `escopo` | Nao | `ativas`, `inativas`, `todas` |

Pelo menos um filtro deve ser informado.

Exemplo:

```txt
GET /api/pessoas/busca?nome=Maria&escopo=ativas
```

**Resposta**: `200 OK`

### `GET /api/pessoas/inativas`

Lista pessoas inativas.

**Resposta**: `200 OK`

### `GET /api/pessoas/:id`

Obtem pessoa por ID.

**Resposta**: `200 OK`

**Erros comuns**: `400` para ID invalido, `404` se nao encontrar.

### `POST /api/pessoas`

Cria uma pessoa.

**Resposta**: `201 Created`

Retorna o objeto criado.

### `PUT /api/pessoas/:id`

Atualiza parcialmente uma pessoa.

Aceita os mesmos campos de pessoa, todos opcionais.

**Resposta**: `200 OK`

Retorna o objeto atualizado.

### `DELETE /api/pessoas/:id`

Remove pessoa via soft delete.

**Resposta**: `204 No Content`

Nao retorna corpo.

## Responsaveis

Responsavel e tratado no backend como uma pessoa com campos adicionais.

### Campos adicionais de responsavel

```json
{
  "cpf": "12345678901",
  "nis": null,
  "renda": 1500,
  "sexo": "Feminino",
  "raca": "Parda",
  "estadoCivil": "Solteiro",
  "veiculo": false,
  "programaSocial": true,
  "email": "maria@example.com",
  "telefone": "11999999999",
  "nomeDoPai": null,
  "nomeDaMae": "Ana Silva",
  "localDeNascimento": "Santo Andre",
  "dataResidenciaEstado": "2010-01-01",
  "dataResidenciaMoradia": "2020-01-01"
}
```

Aliases aceitos:

| Camel case | Snake case aceito |
|---|---|
| `estadoCivil` | `estado_civil` |
| `programaSocial` | `programa_social` |
| `nomeDoPai` | `nome_do_pai` |
| `nomeDaMae` | `nome_da_mae` |
| `localDeNascimento` | `local_de_nascimento` |
| `dataResidenciaEstado` | `data_residencia_estado` |
| `dataResidenciaMoradia` | `data_residencia_moradia` |

Campos obrigatorios adicionais na criacao de responsavel (alem dos campos obrigatorios de pessoa):

| Campo | Tipo | Valores aceitos |
|---|---|---|
| `sexo` | string | `Masculino`, `Feminino`, `Outro`, `Não Declarado` |
| `raca` | string | `Branca`, `Preta`, `Parda`, `Amarela`, `Indígena`, `Não Declarado` |
| `estadoCivil` | string | `Solteiro`, `Casado`, `Divorciado`, `Viúvo`, `União Estável` |

Campos opcionais adicionais de responsavel:

| Campo | Tipo | Padrao | Observacao |
|---|---|---|---|
| `cpf` | string (11 digitos) ou `null` | `null` | deve ser unico no banco |
| `nis` | string ou `null` | `null` | |
| `renda` | number ou `null` | `null` | |
| `veiculo` | boolean | `false` | |
| `programaSocial` | boolean | `false` | |
| `email` | string ou `null` | `null` | deve ser unico no banco |
| `telefone` | string ou `null` | `null` | deve ser unico no banco |
| `nomeDoPai` | string ou `null` | `null` | |
| `nomeDaMae` | string ou `null` | `null` | |
| `localDeNascimento` | string ou `null` | `null` | |
| `dataResidenciaEstado` | string (data ISO 8601) ou `null` | `null` | |
| `dataResidenciaMoradia` | string (data ISO 8601) ou `null` | `null` | |

Na criacao, o backend força `parentesco` para `Responsável`.

### `GET /api/responsaveis`

Lista todos os responsaveis.

**Resposta**: `200 OK`

### `GET /api/responsaveis/:id`

Obtem responsavel pelo ID da pessoa.

**Resposta**: `200 OK`

**Erros comuns**: `400` para ID invalido, `404` se nao encontrar.

### `POST /api/responsaveis`

Cria pessoa responsavel e seus dados adicionais.

**Resposta**: `201 Created`

Retorna o responsavel criado.

### `PUT /api/responsaveis/:id`

Atualiza parcialmente um responsavel pelo ID da pessoa.

**Resposta**: `200 OK`

Retorna o responsavel atualizado.

### `DELETE /api/responsaveis/:id`

Remove responsavel.

**Resposta**: `204 No Content`

Nao retorna corpo.

## Moradias

### Campos de moradia com localizacao

`POST /api/moradias` espera um objeto com `localizacao` e `moradia`.

```json
{
  "localizacao": {
    "logradouro": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "Santo Andre",
    "estado": "SP",
    "cep": "09010000",
    "latitude": -23.6639,
    "longitude": -46.5383,
    "referencia": "Proximo a escola",
    "complemento": null
  },
  "moradia": {
    "tipoConstrucao": "Alvenaria",
    "dataRegistro": "2026-06-10",
    "status": "Ativa",
    "usoImovel": "Residencial",
    "pavimentos": 1,
    "situacaoDeOcupacao": "Alugada",
    "descricao": "Casa em area monitorada"
  }
}
```

Aliases aceitos:

| Camel case | Snake case aceito |
|---|---|
| `tipoConstrucao` | `tipo_construcao` |
| `dataRegistro` | `data_registro` |
| `usoImovel` | `uso_imovel` |
| `situacaoDeOcupacao` | `situacao_de_ocupacao` |

Campos obrigatorios na criacao:

| Grupo | Campo | Tipo |
|---|---|---|
| `localizacao` | `cidade` | string |
| `localizacao` | `estado` | string (2 letras, convertido para maiusculo) |
| `localizacao` | `latitude` | number |
| `localizacao` | `longitude` | number |
| `moradia` | `tipoConstrucao` | string — ver valores aceitos abaixo |
| `moradia` | `usoImovel` | string — ver valores aceitos abaixo |
| `moradia` | `situacaoDeOcupacao` | string — ver valores aceitos abaixo |

Campos opcionais do objeto `moradia`:

| Campo | Tipo | Padrao | Valores aceitos |
|---|---|---|---|
| `dataRegistro` | string (data ISO 8601) ou `null` | `null` | qualquer data valida |
| `status` | string | `"Ativa"` | `Ativa`, `Interditada`, `Em Risco`, `Demolida` |
| `pavimentos` | number | `1` | inteiro positivo |
| `descricao` | string ou `null` | `null` | texto livre |

> **Nota — `Excluída` é reservado ao sistema:** O banco define `Excluída` no enum `status_moradia_enum`, mas ele **não deve ser enviado pelo cliente**. Quando `DELETE /api/moradias/:id` é chamado, o PostgreSQL define `status = 'Excluída'` automaticamente.
>
> **Implementação:** `moradia.model.ts` exporta dois arrays distintos: `STATUS_MORADIA_TODOS` (todos os valores do enum, usado apenas para tipagem de leitura) e `STATUS_MORADIA_CLIENTE` (apenas `Ativa`, `Interditada`, `Demolida` e `Em Risco`, usado na validação de entrada). A validação em `moradia.validation.ts` usa `STATUS_MORADIA_CLIENTE`, garantindo que o backend rejeite `"status": "Excluída"` via POST/PUT com `400 Bad Request`. O tipo `StatusMoradia` continua derivado de `STATUS_MORADIA_TODOS`, preservando a tipagem completa para leituras do banco.

Campos opcionais do objeto `localizacao`:

| Campo | Tipo | Padrao |
|---|---|---|
| `logradouro` | string ou `null` | `null` |
| `numero` | string ou `null` | `null` |
| `bairro` | string ou `null` | `null` |
| `cep` | string ou `null` | `null` |
| `referencia` | string ou `null` | `null` |
| `complemento` | string ou `null` | `null` |

Valores aceitos para `tipoConstrucao`:

```txt
Alvenaria, Madeira, Mista, Taipa, Lona/Improvisada, Outro
```

Valores aceitos para `usoImovel`:

```txt
Residencial, Comercial, Misto, Institucional, Abandonado
```

Valores aceitos para `situacaoDeOcupacao`:

```txt
Propria Quitada, Propria Financiada, Alugada, Cedida, Invasao, Outro
```

### `GET /api/moradias`

Lista moradias.

**Resposta**: `200 OK`

### `GET /api/moradias/:id`

Obtem moradia por ID.

**Resposta**: `200 OK`

### `GET /api/moradias/:id/detalhes`

Obtem detalhes da moradia, incluindo familias, pessoas, pets e fotos associados.

**Resposta**: `200 OK`

### `GET /api/moradias/:id/familias/historico`

Lista historico de familias vinculadas a moradia.

**Resposta**: `200 OK`

### `POST /api/moradias`

Cria moradia com localizacao.

**Resposta**: `201 Created`

Retorna a moradia criada com localizacao.

### `PUT /api/moradias/:id`

Atualiza parcialmente moradia e/ou localizacao.

O corpo pode conter apenas `moradia`, apenas `localizacao`, ou ambos.

O campo `status` do objeto `moradia` aceita os valores `Ativa`, `Interditada`, `Em Risco` e `Demolida`, permitindo a marcacao manual da situacao operacional do imovel (RF015 — Marcacao Manual da Situacao da Moradia, RN08). O sistema registra apenas a marcacao informada, sem inferir risco automaticamente.

**Resposta**: `200 OK`

Retorna a moradia atualizada.

### `DELETE /api/moradias/:id`

Remove moradia via soft delete.

**Resposta**: `204 No Content`

Nao retorna corpo.

## Familias

### `GET /api/familias`

Lista familias.

**Resposta**: `200 OK`

### `GET /api/familias/:id`

Obtem familia por ID.

**Resposta**: `200 OK`

### `POST /api/familias`

Cria uma familia vazia.

Familia e uma entidade de agrupamento puro: seu unico atributo proprio e o `id` gerado automaticamente. Todos os dados relevantes (responsavel, moradores, moradia) chegam por meio de vinculos criados em endpoints separados. Por isso, o corpo da requisicao e ignorado intencionalmente — qualquer campo enviado sera descartado sem erro.

Para cadastrar um nucleo familiar completo em uma unica operacao transacional, use `POST /api/familias/nucleo`.

**Resposta**: `201 Created`

Retorna a familia criada.

### `DELETE /api/familias/:id`

Remove familia via soft delete.

**Resposta**: `204 No Content`

Nao retorna corpo.

### `POST /api/familias/nucleo`

Cadastra um nucleo familiar completo, criando moradia, localizacao, responsavel, dependentes, pets e fotos em uma operacao de servico.

Exemplo:

```json
{
  "localizacao": {
    "cidade": "Santo Andre",
    "estado": "SP",
    "latitude": -23.6639,
    "longitude": -46.5383
  },
  "moradia": {
    "tipoConstrucao": "Alvenaria",
    "usoImovel": "Residencial",
    "situacaoDeOcupacao": "Alugada",
    "pavimentos": 1
  },
  "responsavel": {
    "nome": "Maria Silva",
    "dataDeNascimento": "1980-05-10",
    "situacaoOcupacional": "Empregado",
    "escolaridade": "Médio Completo",
    "cronico": false,
    "medicacao": false,
    "sexo": "Feminino",
    "raca": "Parda",
    "estadoCivil": "Solteiro"
  },
  "dependentes": [
    {
      "nome": "Joao Silva",
      "dataDeNascimento": "2012-03-20",
      "parentesco": "Filho(a)",
      "situacaoOcupacional": "Estudante",
      "escolaridade": "Fundamental Incompleto",
      "cronico": false,
      "medicacao": false
    }
  ],
  "pets": [
    {
      "tipo": "cachorro",
      "nome": "Rex",
      "porte": "Medio",
      "raca": "SRD",
      "cor": "Caramelo",
      "status": "Ativo",
      "observacao": null,
      "fotos": [
        { "url": "private/fotos/pets/rex.jpg" }
      ]
    }
  ],
  "fotos": [
    { "url": "private/fotos/moradias/fachada.jpg" }
  ],
  "dataEntrada": "2026-06-10",
  "statusMoradiaFamilia": "Atual"
}
```

**Resposta**: `201 Created`

Campos raiz do payload (alem dos objetos `localizacao`, `moradia`, `responsavel`, `dependentes`, `pets` e `fotos`):

| Campo | Obrigatorio | Tipo | Observacao |
|---|---:|---|---|
| `dataEntrada` | Nao | string (data ISO 8601) | Data de entrada da familia na moradia. Padrao: data atual do servidor. |
| `statusMoradiaFamilia` | Nao | string | Status do vinculo familia-moradia. Texto livre sem enum validado. Valor convencional: `Atual`. Padrao: `null`. |

### `GET /api/familias/:id/pessoas`

Lista pessoas vinculadas a familia.

**Resposta**: `200 OK`

### `GET /api/familias/:id/pessoas/historico`

Lista historico de pessoas vinculadas a familia.

**Resposta**: `200 OK`

### `POST /api/familias/:id/pessoas`

Vincula pessoa a familia.

```json
{
  "idPessoa": 3,
  "dataEntrada": "2026-06-10"
}
```

| Campo | Obrigatorio | Tipo | Observacao |
|---|---:|---|---|
| `idPessoa` | Sim | number | ID da pessoa a vincular |
| `dataEntrada` | Nao | string (data ISO 8601) | Padrao: `null`. Se a pessoa tiver parentesco `Responsavel`, o servico valida que a familia nao possui outro responsavel ativo. |

**Resposta**: `201 Created`

Retorna o vinculo criado.

### `DELETE /api/familias/:id/pessoas/:pessoaId`

Remove o vinculo ativo entre pessoa e familia.

**Resposta**: `200 OK`

Retorna o vinculo atualizado/removido. Este endpoint e excecao entre os deletes, pois retorna corpo JSON.

### `GET /api/familias/:id/moradias`

Lista moradias vinculadas a familia.

**Resposta**: `200 OK`

### `GET /api/familias/:id/moradias/historico`

Lista historico de moradias vinculadas a familia.

**Resposta**: `200 OK`

### `POST /api/familias/:id/moradias`

Vincula moradia a familia.

```json
{
  "idMoradia": 2,
  "dataEntrada": "2026-06-10",
  "status": "Atual"
}
```

| Campo | Obrigatorio | Tipo | Observacao |
|---|---:|---|---|
| `idMoradia` | Sim | number | ID da moradia a vincular |
| `dataEntrada` | Nao | string (data ISO 8601) | padrao: `null` |
| `status` | Nao | string | Status do **vinculo** (nao da moradia). Texto livre sem enum validado; valor convencional: `Atual` para vinculo ativo, `Anterior` para historico. |

**Resposta**: `201 Created`

Retorna o vinculo criado.

### `DELETE /api/familias/:id/moradias/:moradiaId`

Remove o vinculo ativo entre moradia e familia.

**Resposta**: `200 OK`

Retorna o vinculo atualizado/removido. Este endpoint e excecao entre os deletes, pois retorna corpo JSON.

## Pets

### Campos de pet

```json
{
  "idFamilia": 1,
  "tipo": "cachorro",
  "nome": "Rex",
  "porte": "Medio",
  "raca": "SRD",
  "cor": "Caramelo",
  "status": "Ativo",
  "observacao": "Animal acompanha a familia em evacuacao"
}
```

Campos obrigatorios na criacao:

| Campo | Tipo | Valores aceitos |
|---|---|---|
| `idFamilia` | number | inteiro positivo; nao necessario em `POST /api/familias/:id/pets` |
| `tipo` | string | `cachorro`, `gato`, `reptil`, `ave`, `roedor`, `outros` |
| `nome` | string | texto livre |
| `porte` | string | texto livre — nao ha enum validado; valores convencionais: `Pequeno`, `Medio`, `Grande`, `Gigante` |
| `raca` | string | texto livre |
| `cor` | string | texto livre |
| `status` | string | `Ativo`, `Inativo`, `Desaparecido`, `Falecido` |

Campos opcionais na criacao:

| Campo | Tipo | Padrao | Contexto |
|---|---|---|---|
| `observacao` | string ou `null` | `null` | todos os endpoints de criacao |
| `fotos` | array de `{ url: string }` | `[]` | **apenas `POST /api/familias/nucleo`** |

> **Nota sobre `fotos` em pet:** O campo `fotos` dentro do objeto de pet e processado somente em `POST /api/familias/nucleo`, onde o service itera o array e persiste cada foto vinculada ao pet criado. Em `POST /api/pets` e `POST /api/familias/:id/pets`, o campo `fotos` e ignorado silenciosamente — o fluxo correto para associar fotos a um pet ja existente e usar `POST /api/pets/:id/fotos`.

### `GET /api/pets`

Lista pets.

**Resposta**: `200 OK`

### `GET /api/pets/:id`

Obtem pet por ID.

**Resposta**: `200 OK`

### `POST /api/pets`

Cria pet informando `idFamilia` no corpo.

**Resposta**: `201 Created`

Retorna o pet criado.

### `PUT /api/pets/:id`

Atualiza parcialmente pet.

**Resposta**: `200 OK`

Retorna o pet atualizado.

### `DELETE /api/pets/:id`

Remove pet.

**Resposta**: `204 No Content`

Nao retorna corpo.

### `GET /api/familias/:id/pets`

Lista pets de uma familia.

**Resposta**: `200 OK`

### `POST /api/familias/:id/pets`

Cria pet vinculado a familia informada na URL. Neste endpoint, `idFamilia` do corpo nao e necessario.

```json
{
  "tipo": "gato",
  "nome": "Mimi",
  "porte": "Pequeno",
  "raca": "SRD",
  "cor": "Preto",
  "status": "Ativo",
  "observacao": null
}
```

**Resposta**: `201 Created`

Retorna o pet criado.

## Fotos

> **Restricao — RN07 (LGPD):** O sistema aceita fotos **apenas de moradias e pets**. O registro fotografico de pessoas e estritamente proibido. Os endpoints de upload existem somente sob `/api/moradias/:id/fotos/upload-url` e `/api/pets/:id/fotos/upload-url`.

> **Limite de fotos por moradia (RF002 / RN07):** O WAD estabelece no maximo 2 fotos por moradia. O backend atual **nao valida esse limite** — e possivel cadastrar mais de 2 fotos via API sem erro. Essa restricao esta pendente de implementacao.

### Campos de foto

Para criar ou atualizar registros de foto, o backend atual usa apenas o campo `url`.

```json
{
  "url": "private/fotos/moradias/fachada.jpg"
}
```

### Campos para gerar URL de upload

```json
{
  "fileName": "fachada.jpg",
  "contentType": "image/jpeg",
  "upsert": false
}
```

| Campo | Obrigatorio | Tipo | Valores aceitos |
|---|---:|---|---|
| `fileName` | Sim | string | nome do arquivo (sem caminho) |
| `contentType` | Sim | string | `image/jpeg`, `image/png`, `image/webp` |
| `upsert` | Nao | boolean | `true` para sobrescrever arquivo existente no mesmo path; padrao `false` |

Aliases aceitos: `file_name` no lugar de `fileName`, `content_type` no lugar de `contentType`.

> **Tamanho maximo de arquivo:** O backend nao valida tamanho de arquivo no momento da geracao da URL de upload \u2014 a restricao de tamanho e aplicada diretamente pelo Supabase Storage no momento do upload. Nenhum erro de tamanho sera retornado pela API do backend.

### `GET /api/fotos`

Lista fotos.

**Resposta**: `200 OK`

### `GET /api/fotos/:id`

Obtem foto por ID.

**Resposta**: `200 OK`

### `GET /api/fotos/:id/signed-url`

Gera URL assinada para acessar a foto.

Query params aceitos:

| Parametro | Obrigatorio | Regra |
|---|---:|---|
| `expiresIn` | Nao | entre 60 e 3600 segundos |

Exemplo:

```txt
GET /api/fotos/1/signed-url?expiresIn=600
```

**Resposta**: `200 OK`

```json
{
  "bucket": "fotos",
  "path": "private/fotos/moradias/fachada.jpg",
  "signedUrl": "https://...",
  "expiresIn": 600
}
```

### `PUT /api/fotos/:id`

Atualiza a URL da foto.

```json
{
  "url": "private/fotos/moradias/fachada-atualizada.jpg"
}
```

**Resposta**: `200 OK`

Retorna a foto atualizada.

### `DELETE /api/fotos/:id`

Remove foto.

**Resposta**: `204 No Content`

Nao retorna corpo.

### `GET /api/moradias/:id/fotos`

Lista fotos de uma moradia.

**Resposta**: `200 OK`

### `POST /api/moradias/:id/fotos/upload-url`

Gera URL assinada de upload para foto de moradia.

```json
{
  "fileName": "fachada.jpg",
  "contentType": "image/jpeg",
  "upsert": false
}
```

**Resposta**: `201 Created`

```json
{
  "bucket": "fotos",
  "path": "private/fotos/moradias/1/fachada.jpg",
  "signedUrl": "https://...",
  "token": "...",
  "expiresIn": 3600
}
```

### `POST /api/moradias/:id/fotos`

Cria registro de foto vinculado a moradia.

```json
{
  "url": "private/fotos/moradias/1/fachada.jpg"
}
```

**Resposta**: `201 Created`

Retorna a foto criada.

### `DELETE /api/moradias/:id/fotos/:fotoId`

Remove foto vinculada a moradia.

**Resposta**: `204 No Content`

Nao retorna corpo.

### `GET /api/pets/:id/fotos`

Lista fotos de um pet.

**Resposta**: `200 OK`

### `POST /api/pets/:id/fotos/upload-url`

Gera URL assinada de upload para foto de pet.

```json
{
  "fileName": "rex.jpg",
  "contentType": "image/jpeg",
  "upsert": false
}
```

**Resposta**: `201 Created`

```json
{
  "bucket": "fotos",
  "path": "private/fotos/pets/1/rex.jpg",
  "signedUrl": "https://...",
  "token": "...",
  "expiresIn": 3600
}
```

### `POST /api/pets/:id/fotos`

Cria registro de foto vinculado a pet.

```json
{
  "url": "private/fotos/pets/1/rex.jpg"
}
```

**Resposta**: `201 Created`

Retorna a foto criada.

### `DELETE /api/pets/:id/fotos/:fotoId`

Remove foto vinculada a pet.

**Resposta**: `204 No Content`

Nao retorna corpo.

## Resumo dos Endpoints da API

### Pessoas

| Metodo | Endpoint | Resposta de sucesso |
|---|---|---|
| `GET` | `/api/pessoas` | `200` |
| `GET` | `/api/pessoas/busca` | `200` |
| `GET` | `/api/pessoas/inativas` | `200` |
| `GET` | `/api/pessoas/:id` | `200` |
| `POST` | `/api/pessoas` | `201` |
| `PUT` | `/api/pessoas/:id` | `200` |
| `DELETE` | `/api/pessoas/:id` | `204` |

### Responsaveis

| Metodo | Endpoint | Resposta de sucesso |
|---|---|---|
| `GET` | `/api/responsaveis` | `200` |
| `GET` | `/api/responsaveis/:id` | `200` |
| `POST` | `/api/responsaveis` | `201` |
| `PUT` | `/api/responsaveis/:id` | `200` |
| `DELETE` | `/api/responsaveis/:id` | `204` |

### Moradias

| Metodo | Endpoint | Resposta de sucesso |
|---|---|---|
| `GET` | `/api/moradias` | `200` |
| `GET` | `/api/moradias/:id/detalhes` | `200` |
| `GET` | `/api/moradias/:id/familias/historico` | `200` |
| `GET` | `/api/moradias/:id` | `200` |
| `POST` | `/api/moradias` | `201` |
| `PUT` | `/api/moradias/:id` | `200` |
| `DELETE` | `/api/moradias/:id` | `204` |

### Familias

| Metodo | Endpoint | Resposta de sucesso |
|---|---|---|
| `GET` | `/api/familias` | `200` |
| `GET` | `/api/familias/:id` | `200` |
| `POST` | `/api/familias` | `201` |
| `DELETE` | `/api/familias/:id` | `204` |
| `POST` | `/api/familias/nucleo` | `201` |
| `GET` | `/api/familias/:id/pessoas/historico` | `200` |
| `GET` | `/api/familias/:id/pessoas` | `200` |
| `POST` | `/api/familias/:id/pessoas` | `201` |
| `DELETE` | `/api/familias/:id/pessoas/:pessoaId` | `200` |
| `GET` | `/api/familias/:id/moradias/historico` | `200` |
| `GET` | `/api/familias/:id/moradias` | `200` |
| `POST` | `/api/familias/:id/moradias` | `201` |
| `DELETE` | `/api/familias/:id/moradias/:moradiaId` | `200` |

### Pets

| Metodo | Endpoint | Resposta de sucesso |
|---|---|---|
| `GET` | `/api/pets` | `200` |
| `GET` | `/api/pets/:id` | `200` |
| `POST` | `/api/pets` | `201` |
| `PUT` | `/api/pets/:id` | `200` |
| `DELETE` | `/api/pets/:id` | `204` |
| `GET` | `/api/familias/:id/pets` | `200` |
| `POST` | `/api/familias/:id/pets` | `201` |

### Fotos

| Metodo | Endpoint | Resposta de sucesso |
|---|---|---|
| `GET` | `/api/fotos` | `200` |
| `GET` | `/api/fotos/:id` | `200` |
| `GET` | `/api/fotos/:id/signed-url` | `200` |
| `PUT` | `/api/fotos/:id` | `200` |
| `DELETE` | `/api/fotos/:id` | `204` |
| `GET` | `/api/moradias/:id/fotos` | `200` |
| `POST` | `/api/moradias/:id/fotos/upload-url` | `201` |
| `POST` | `/api/moradias/:id/fotos` | `201` |
| `DELETE` | `/api/moradias/:id/fotos/:fotoId` | `204` |
| `GET` | `/api/pets/:id/fotos` | `200` |
| `POST` | `/api/pets/:id/fotos/upload-url` | `201` |
| `POST` | `/api/pets/:id/fotos` | `201` |
| `DELETE` | `/api/pets/:id/fotos/:fotoId` | `204` |

## Endpoints planejados

Os endpoints abaixo nao existem nas rotas atuais do backend. Os RFs associados figuram no WAD com status "Planejado" ou "Futuro", o que e consistente com a ausencia de implementacao.

| Metodo | Endpoint | RF associado | Status do RF |
|---|---|---|---|
| `POST` | `/api/cadastros-completos` | — | — |
| `GET` | `/api/moradias/mapa` | RF004 — Visualizacao de Moradias em Mapa Georreferenciado | Planejado |
| `GET` | `/api/moradias/:id_moradia/consulta-integrada` | — | — |
| `GET` | `/api/moradias/exportar` | — | — |
| `GET` | `/api/familias/:id_familia/cadastro-completo` | — | — |
| `PUT` | `/api/familias/:id_familia/cadastro-completo` | — | — |
| `PUT` | `/api/familias/:id_familia/responsavel` | — | — |
| `GET` | `/api/indicadores/mapa-calor` | RF008 — Visualizacao de Mapa de Calor | Futuro |
| `GET` | `/api/indicadores/recadastro` | RF011 — Alerta Automatico de Recadastro (12 meses) | Planejado |
| `PATCH` | `/api/moradias/:id_moradia/status` | *(ver nota abaixo)* | — |
| `POST` | `/api/familias/:id_familia/realocacoes` | — | — |
| `PATCH` | `/api/cidadaos/:id_cidadao/arquivar` | — | — |

> **Nota — RF015 e RF017:**
> - **RF015 (Marcacao Manual da Situacao da Moradia):** nao requer endpoint proprio; e coberto pelo `PUT /api/moradias/:id` via o campo `status` do objeto `moradia`. O endpoint `PATCH /api/moradias/:id_moradia/status` listado acima era uma alternativa anterior que nunca chegou a ser implementada — o `PUT` atual e a forma correta de atualizar a situacao.
> - **RF017 (Indicador de Cadastro Incompleto):** nao possui endpoint proprio pois o indicador e derivado automaticamente da ausencia de vinculo familia-moradia; e exposto indiretamente por `GET /api/familias/:id/moradias` (lista vazia = sem moradia) e `GET /api/moradias/:id/detalhes`. Seu status no WAD e "Planejado", o que e consistente com a ausencia de endpoint dedicado.
