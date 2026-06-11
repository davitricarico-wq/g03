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

Tambem e aceito `nome_social` no lugar de `nomeSocial`, `data_de_nascimento` no lugar de `dataDeNascimento` e `situacao_ocupacional` no lugar de `situacaoOcupacional`.

Campos obrigatorios na criacao:

| Campo | Tipo |
|---|---|
| `nome` | string |
| `dataDeNascimento` | data |
| `parentesco` | string |
| `situacaoOcupacional` | string |
| `escolaridade` | string |
| `cronico` | boolean |
| `medicacao` | boolean |

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

Tambem sao aceitos aliases em snake_case para alguns campos:

| Camel case | Snake case aceito |
|---|---|
| `estadoCivil` | `estado_civil` |
| `programaSocial` | `programa_social` |
| `nomeDoPai` | `nome_do_pai` |
| `nomeDaMae` | `nome_da_mae` |
| `localDeNascimento` | `local_de_nascimento` |
| `dataResidenciaEstado` | `data_residencia_estado` |
| `dataResidenciaMoradia` | `data_residencia_moradia` |

Campos obrigatorios na criacao de responsavel:

| Campo | Tipo |
|---|---|
| Campos obrigatorios de pessoa | conforme secao Pessoas |
| `sexo` | string |
| `raca` | string |
| `estadoCivil` | string |

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

| Grupo | Campos |
|---|---|
| `localizacao` | `cidade`, `estado`, `latitude`, `longitude` |
| `moradia` | `tipoConstrucao`, `usoImovel`, `situacaoDeOcupacao` |

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

Cria uma familia.

O backend atual ignora o corpo da requisicao.

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

| Campo | Tipo |
|---|---|
| `idFamilia` | number, exceto em `POST /api/familias/:id/pets` |
| `tipo` | string |
| `nome` | string |
| `porte` | string |
| `raca` | string |
| `cor` | string |
| `status` | string |

Tipos de pet aceitos pelo modelo:

```txt
cachorro, gato, reptil, ave, roedor, outros
```

Status aceitos:

```txt
Ativo, Inativo, Desaparecido, Falecido
```

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

Tambem sao aceitos `file_name` e `content_type`.

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

Os endpoints abaixo apareciam em versoes anteriores da documentacao, mas nao existem nas rotas atuais do backend:

| Metodo | Endpoint |
|---|---|
| `POST` | `/api/cadastros-completos` |
| `GET` | `/api/moradias/mapa` |
| `GET` | `/api/moradias/:id_moradia/consulta-integrada` |
| `GET` | `/api/moradias/exportar` |
| `GET` | `/api/familias/:id_familia/cadastro-completo` |
| `PUT` | `/api/familias/:id_familia/cadastro-completo` |
| `PUT` | `/api/familias/:id_familia/responsavel` |
| `GET` | `/api/indicadores/mapa-calor` |
| `GET` | `/api/indicadores/recadastro` |
| `PATCH` | `/api/moradias/:id_moradia/status` |
| `POST` | `/api/familias/:id_familia/realocacoes` |
| `PATCH` | `/api/cidadaos/:id_cidadao/arquivar` |
