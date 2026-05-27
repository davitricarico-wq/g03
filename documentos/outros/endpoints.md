# Documentacao de Endpoints - GeoRisco Santo Andre

Este documento descreve os endpoints propostos a partir dos fluxos de sequencia UML atualizados e do WAD do projeto GeoRisco Santo Andre. Ele foi separado do `wad.md` para facilitar revisao, manutencao e posterior incorporacao na secao 3.7 do WAD.

> Observacao: como a secao de WebAPI do WAD ainda nao formalizava todos os contratos, os endpoints abaixo representam uma proposta coerente com os fluxos, requisitos funcionais, regras de negocio e modelo de dados atual.

## Padroes Gerais

### Base URL

```txt
/api
```

Exemplo:

```txt
/api/cadastros-completos
```

### Headers Padrao

| Header | Obrigatorio | Descricao |
|---|---:|---|
| `Content-Type: application/json` | Sim | Indica envio de dados em JSON. |
| `Authorization: Bearer <token>` | Sim | Token de autenticacao do usuario logado. |

### Formato Padrao de Erro

```json
{
  "error": "Mensagem resumida do erro",
  "details": "Descricao complementar quando aplicavel"
}
```

### Status HTTP Comuns

| Status | Nome | Explicacao |
|---:|---|---|
| `200` | OK | Requisicao processada com sucesso. Usado em consultas e atualizacoes. |
| `201` | Created | Recurso criado com sucesso. Usado em cadastros. |
| `400` | Bad Request | A requisicao possui formato invalido, parametros incorretos ou JSON malformado. |
| `401` | Unauthorized | Usuario nao autenticado ou token ausente/invalido. |
| `403` | Forbidden | Usuario autenticado, mas sem permissao para executar a operacao. |
| `404` | Not Found | Recurso solicitado nao encontrado. |
| `409` | Conflict | A operacao viola uma regra de integridade ou conflito de negocio. |
| `422` | Unprocessable Entity | Dados sintaticamente validos, mas com campos obrigatorios ausentes ou valores invalidos. |
| `500` | Internal Server Error | Falha inesperada no servidor. |

---

## 1. Criar Cadastro Completo

Cria um cadastro completo em uma unica operacao transacional, incluindo `localizacao`, `moradia`, `familia`, `historico_ocupacao`, `responsavel`, `cidadaos`, `grupos_prioritarios`, `gestantes`, `pets` e `fotos`.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/cadastros-completos` |
| Atores | A01, A03 |
| RF/RN relacionados | RF001, RF002, RF003, RF007 / RN01, RN04 |

### Request

```json
{
  "uuid_local": "cadastro-local-uuid-001",
  "localizacao": {
    "coordenadas_latitude": -23.6632,
    "coordenadas_longitude": -46.5381,
    "cep": "09000000",
    "logradouro": "Rua Exemplo",
    "bairro": "Centro",
    "numero": 100,
    "cidade": "Santo Andre",
    "uf": "SP",
    "ponto_referencia": "Proximo a escola municipal"
  },
  "moradia": {
    "tipo_construcao": "Alvenaria",
    "condicao_ocupacao": "Cedida",
    "tipo_uso_imovel": "Residencial",
    "telefone": "11999999999",
    "observacoes": "Imovel em area com sinais de umidade"
  },
  "familia": {
    "status_ativo": true
  },
  "responsavel": {
    "cidadao": {
      "nome_completo": "Maria Silva",
      "nome_social": null,
      "data_nascimento": "1980-05-10",
      "situacao_ocupacional": "Empregado",
      "doencas_cronicas": "Hipertensao",
      "medicamentos": "Losartana",
      "grau_parentesco_responsavel": "Responsavel",
      "escolaridade": "Ensino Medio"
    },
    "cpf": "12345678901",
    "email": "maria@example.com",
    "celular": "11999999999",
    "renda": 1500.00,
    "raca": "Pardo",
    "sexo": "Feminino",
    "estado_civil": "Solteiro",
    "programas_sociais": true,
    "nis": "12345678900",
    "veiculo": false,
    "local_nascimento": "Santo Andre"
  },
  "moradores": [
    {
      "nome_completo": "Joao Silva",
      "nome_social": null,
      "data_nascimento": "2015-03-20",
      "situacao_ocupacional": null,
      "doencas_cronicas": null,
      "medicamentos": null,
      "grau_parentesco_responsavel": "Filho/Filha",
      "escolaridade": "Fundamental",
      "grupos_prioritarios": [1]
    }
  ],
  "gestantes": [
    {
      "indice_morador": 0,
      "data_prevista": "2026-10-15",
      "data_inicio": "2026-01-15"
    }
  ],
  "pets": [
    {
      "tipo_pet": "Cao",
      "porte_pet": "Pequeno",
      "nome": "Rex",
      "cor": "Caramelo",
      "observacoes": "Animal acompanha a familia em evacuacao"
    }
  ],
  "fotos": [
    {
      "tipo_foto": "Frente",
      "url": "https://storage.example.com/foto-frente.jpg"
    },
    {
      "tipo_foto": "Redor",
      "url": "https://storage.example.com/foto-redor.jpg"
    }
  ]
}
```

### Response `201 Created`

```json
{
  "message": "Cadastro completo criado com sucesso",
  "id_localizacao": 1,
  "id_moradia": 1,
  "id_familia": 1,
  "id_responsavel": 1,
  "id_historico_ocupacao": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Cadastro completo criado com sucesso. |
| `400` | JSON malformado ou estrutura principal ausente. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario nao possui permissao para cadastrar. |
| `409` | CPF, email, NIS ou `uuid_local` ja cadastrado. |
| `422` | Campos obrigatorios invalidos ou violacao da RN04 sobre fotos. |
| `500` | Falha inesperada ao gravar a transacao. |

---

## 2. Listar Marcadores de Moradias no Mapa

Retorna marcadores de moradias para plotagem no mapa georreferenciado.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/moradias/mapa` |
| Atores | A02, A03 |
| RF/RN relacionados | RF004 |

### Query Params

| Parametro | Obrigatorio | Exemplo | Descricao |
|---|---:|---|---|
| `status` | Nao | `Ativa` | Filtra moradias por status operacional. |

### Request

```txt
GET /api/moradias/mapa?status=Ativa
```

### Response `200 OK`

```json
[
  {
    "id_moradia": 1,
    "latitude": -23.6632,
    "longitude": -46.5381,
    "status": "Ativa"
  },
  {
    "id_moradia": 2,
    "latitude": -23.6641,
    "longitude": -46.5395,
    "status": "Ativa"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Marcadores retornados com sucesso. Pode retornar array vazio. |
| `400` | Parametro de status invalido. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para visualizar o mapa. |
| `500` | Falha ao consultar as moradias. |

---

## 3. Consultar Ficha Integrada da Moradia

Retorna a ficha integrada de uma moradia, incluindo localizacao, ocupacao ativa, familia, responsavel, moradores, grupos prioritarios, gestantes, pets, fotos e flag de risco critico.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/moradias/{id_moradia}/consulta-integrada` |
| Atores | A02, A03 |
| RF/RN relacionados | RF005 / RN01, RN05 |

### Request

```txt
GET /api/moradias/1/consulta-integrada
```

### Response `200 OK`

```json
{
  "moradia": {
    "id_moradia": 1,
    "tipo_construcao": "Alvenaria",
    "condicao_ocupacao": "Cedida",
    "tipo_uso_imovel": "Residencial",
    "telefone": "11999999999",
    "observacoes": "Imovel em area com sinais de umidade",
    "status": "Ativa",
    "data_cadastro": "2026-05-25",
    "ultima_atualizacao": "2026-05-25"
  },
  "localizacao": {
    "id_localizacao": 1,
    "coordenadas_latitude": -23.6632,
    "coordenadas_longitude": -46.5381,
    "cep": "09000000",
    "logradouro": "Rua Exemplo",
    "bairro": "Centro",
    "numero": 100,
    "cidade": "Santo Andre",
    "uf": "SP",
    "ponto_referencia": "Proximo a escola municipal"
  },
  "ocupacao_atual": {
    "id_historico_ocupacao": 1,
    "id_familia": 1,
    "data_entrada": "2026-05-25",
    "data_saida": null,
    "status": "Regular"
  },
  "familia": {
    "id_familia": 1,
    "status_ativo": true,
    "data_cadastro": "2026-05-25"
  },
  "responsavel": {
    "id_responsavel": 1,
    "id_cidadao": 1,
    "nome_completo": "Maria Silva",
    "cpf": "12345678901",
    "celular": "11999999999",
    "renda": 1500.00
  },
  "moradores": [
    {
      "id_cidadao": 2,
      "nome_completo": "Joao Silva",
      "data_nascimento": "2015-03-20",
      "status_cadastro": true,
      "grupos_prioritarios": [
        {
          "id_grupo_prioritario": 1,
          "nome": "Crianca"
        }
      ]
    }
  ],
  "pets": [
    {
      "id_pet": 1,
      "tipo_pet": "Cao",
      "porte_pet": "Pequeno",
      "nome": "Rex"
    }
  ],
  "fotos": [
    {
      "id_foto_moradia": 1,
      "tipo_foto": "Frente",
      "url": "https://storage.example.com/foto-frente.jpg"
    }
  ],
  "prioridade": "Alto",
  "risco_critico": false
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Ficha integrada retornada com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para consultar dados sensiveis. |
| `404` | Moradia nao encontrada. |
| `500` | Falha ao montar a consulta integrada. |

---

## 4. Listar Moradias com Busca e Filtros

Lista moradias, ocupacoes e assistidos a partir de filtros de busca, status, vulnerabilidade ou recadastro.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/moradias` |
| Atores | A02, A03 |
| RF/RN relacionados | RF006, RF011 / RN02 |

### Query Params

| Parametro | Obrigatorio | Exemplo | Descricao |
|---|---:|---|---|
| `busca` | Nao | `Centro` | Busca textual por localizacao, bairro ou identificador. |
| `status` | Nao | `Ativa` | Filtra pelo status da moradia. |
| `desatualizado` | Nao | `true` | Retorna cadastros sem atualizacao ha mais de 365 dias. |
| `grupo_prioritario` | Nao | `Acamado` | Filtra por grupo prioritario do morador. |
| `condicao_ocupacao` | Nao | `Cedida` | Filtra pela condicao de ocupacao. |

### Request

```txt
GET /api/moradias?status=Ativa&grupo_prioritario=Acamado
```

### Response `200 OK`

```json
[
  {
    "id_moradia": 1,
    "id_familia": 1,
    "bairro": "Centro",
    "status": "Ativa",
    "condicao_ocupacao": "Cedida",
    "ultima_atualizacao": "2025-04-10",
    "desatualizado": true,
    "risco_critico": true
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Lista retornada com sucesso. Pode retornar array vazio. |
| `400` | Filtro informado possui valor invalido. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para listar dados. |
| `500` | Falha ao executar consulta filtrada. |

---

## 5. Exportar Moradias Filtradas

Exporta os resultados filtrados em CSV ou PDF.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/moradias/exportar` |
| Atores | A02, A03 |
| RF/RN relacionados | RF006 |

### Query Params

| Parametro | Obrigatorio | Exemplo | Descricao |
|---|---:|---|---|
| `formato` | Nao | `csv` | Formato de exportacao. Valores: `csv` ou `pdf`. |
| `status` | Nao | `Ativa` | Mesmo filtro usado na listagem. |
| `grupo_prioritario` | Nao | `Idoso` | Mesmo filtro usado na listagem. |

### Request

```txt
GET /api/moradias/exportar?formato=csv&status=Ativa
```

### Response `200 OK`

Arquivo para download.

Headers esperados:

```txt
Content-Type: text/csv
Content-Disposition: attachment; filename="moradias.csv"
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Arquivo gerado com sucesso. |
| `400` | Formato de exportacao ou filtro invalido. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para exportar dados. |
| `500` | Falha ao gerar arquivo. |

---

## 6. Buscar Cadastro Completo da Familia

Retorna todos os dados de uma familia para revisao ou atualizacao anual.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/familias/{id_familia}/cadastro-completo` |
| Atores | A01, A03 |
| RF/RN relacionados | RF012 / RN02 |

### Request

```txt
GET /api/familias/1/cadastro-completo
```

### Response `200 OK`

```json
{
  "familia": {
    "id_familia": 1,
    "data_cadastro": "2026-05-25",
    "status_ativo": true
  },
  "moradia_atual": {
    "id_moradia": 1,
    "status": "Ativa",
    "ultima_atualizacao": "2025-04-10"
  },
  "historico_ocupacao": {
    "id_historico_ocupacao": 1,
    "data_entrada": "2026-05-25",
    "data_saida": null,
    "status": "Regular"
  },
  "responsavel": {
    "id_responsavel": 1,
    "id_cidadao": 1,
    "nome_completo": "Maria Silva"
  },
  "moradores": [],
  "pets": [],
  "fotos": []
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Cadastro completo retornado com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para consultar o cadastro. |
| `404` | Familia nao encontrada. |
| `500` | Falha ao carregar cadastro completo. |

---

## 7. Atualizar Cadastro Completo da Familia

Atualiza o cadastro completo de uma familia, incluindo dados sociais, estruturais e historico de ocupacao quando houver realocacao.

| Campo | Valor |
|---|---|
| Metodo | `PUT` |
| Endpoint | `/api/familias/{id_familia}/cadastro-completo` |
| Atores | A01, A03 |
| RF/RN relacionados | RF012 / RN01, RN02, RN04 |

### Request

```json
{
  "uuid_local": "atualizacao-local-uuid-001",
  "localizacao": {
    "id_localizacao": 1,
    "coordenadas_latitude": -23.6632,
    "coordenadas_longitude": -46.5381,
    "cep": "09000000",
    "logradouro": "Rua Exemplo",
    "bairro": "Centro",
    "numero": 100,
    "cidade": "Santo Andre",
    "uf": "SP",
    "ponto_referencia": "Proximo a escola municipal"
  },
  "moradia": {
    "id_moradia": 1,
    "tipo_construcao": "Alvenaria",
    "condicao_ocupacao": "Cedida",
    "tipo_uso_imovel": "Residencial",
    "telefone": "11999999999",
    "observacoes": "Cadastro revisado em campo"
  },
  "responsavel": {
    "id_responsavel": 1,
    "id_cidadao": 1,
    "celular": "11988888888",
    "renda": 1800.00
  },
  "moradores": [
    {
      "id_cidadao": 2,
      "nome_completo": "Joao Silva",
      "status_cadastro": true,
      "grupos_prioritarios": [1, 3]
    }
  ],
  "pets": [],
  "fotos": []
}
```

### Response `200 OK`

```json
{
  "message": "Cadastro atualizado com sucesso",
  "id_familia": 1,
  "id_moradia": 1,
  "ultima_atualizacao": "2026-05-25"
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Cadastro atualizado com sucesso. |
| `400` | JSON malformado ou estrutura invalida. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para atualizar. |
| `404` | Familia, moradia ou registro relacionado nao encontrado. |
| `409` | Atualizacao deixaria familia ativa sem responsavel ou sem moradia ativa. |
| `422` | Campo obrigatorio invalido ou foto em desacordo com RN04. |
| `500` | Falha inesperada durante a transacao. |

---

## 8. Listar Pets da Familia

Lista pets vinculados a uma familia.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/familias/{id_familia}/pets` |
| Atores | A01, A02, A03 |
| RF/RN relacionados | RF007 |

### Request

```txt
GET /api/familias/1/pets
```

### Response `200 OK`

```json
[
  {
    "id_pet": 1,
    "id_familia": 1,
    "tipo_pet": "Cao",
    "porte_pet": "Pequeno",
    "nome": "Rex",
    "cor": "Caramelo",
    "observacoes": "Animal acompanha a familia em evacuacao"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pets retornados com sucesso. Pode retornar array vazio. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para visualizar pets. |
| `404` | Familia nao encontrada. |
| `500` | Falha ao consultar pets. |

---

## 9. Cadastrar Pet

Cadastra um novo pet vinculado a uma familia.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/familias/{id_familia}/pets` |
| Atores | A01 |
| RF/RN relacionados | RF007 |

### Request

```json
{
  "tipo_pet": "Cao",
  "porte_pet": "Pequeno",
  "nome": "Rex",
  "cor": "Caramelo",
  "observacoes": "Animal acompanha a familia em evacuacao",
  "foto_url": "https://storage.example.com/pet-rex.jpg"
}
```

### Response `201 Created`

```json
{
  "message": "Pet cadastrado com sucesso",
  "id_pet": 1,
  "id_familia": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Pet criado com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para cadastrar pet. |
| `404` | Familia nao encontrada. |
| `422` | `tipo_pet` ausente ou valor invalido. |
| `500` | Falha ao criar pet. |

---

## 10. Atualizar Pet

Atualiza dados de um pet existente.

| Campo | Valor |
|---|---|
| Metodo | `PUT` |
| Endpoint | `/api/pets/{id_pet}` |
| Atores | A01, A03 |
| RF/RN relacionados | RF007 |

### Request

```json
{
  "tipo_pet": "Gato",
  "porte_pet": "Pequeno",
  "nome": "Mimi",
  "cor": "Preto",
  "observacoes": "Atualizacao cadastral"
}
```

### Response `200 OK`

```json
{
  "message": "Pet atualizado com sucesso",
  "id_pet": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pet atualizado com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para atualizar pet. |
| `404` | Pet nao encontrado. |
| `422` | Campos enviados possuem valores invalidos. |
| `500` | Falha ao atualizar pet. |

---

## 11. Consultar Dados do Mapa de Calor

Retorna dados agregados para renderizacao do mapa de calor.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/indicadores/mapa-calor` |
| Atores | A02, A03 |
| RF/RN relacionados | RF008 / RN01 |

### Query Params

| Parametro | Obrigatorio | Exemplo | Descricao |
|---|---:|---|---|
| `filtro` | Nao | `idosos` | Grupo ou criterio usado no mapa de calor. |
| `zoom` | Nao | `14` | Nivel de zoom usado para recalculo de clusters. |

### Request

```txt
GET /api/indicadores/mapa-calor?filtro=acamados&zoom=14
```

### Response `200 OK`

```json
[
  {
    "latitude": -23.6632,
    "longitude": -46.5381,
    "intensidade": 8
  },
  {
    "latitude": -23.6641,
    "longitude": -46.5395,
    "intensidade": 3
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Dataset do mapa de calor retornado com sucesso. Pode retornar array vazio. |
| `400` | Filtro ou zoom invalido. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para visualizar indicadores. |
| `500` | Falha ao calcular agregacoes. |

---

## 12. Consultar Indicadores de Recadastro

Retorna totais de cadastros atualizados e desatualizados, conforme RN02.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/indicadores/recadastro` |
| Atores | A02, A03 |
| RF/RN relacionados | RF011 / RN02 |

### Request

```txt
GET /api/indicadores/recadastro
```

### Response `200 OK`

```json
{
  "total": 120,
  "atualizados": 95,
  "desatualizados": 25
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Indicadores retornados com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para consultar indicadores. |
| `500` | Falha ao calcular indicadores. |

---

## 13. Atualizar Status da Moradia

Atualiza o status operacional da moradia. Pode representar arquivamento logico para moradias demolidas, interditadas ou evacuadas.

| Campo | Valor |
|---|---|
| Metodo | `PATCH` |
| Endpoint | `/api/moradias/{id_moradia}/status` |
| Atores | A03 |
| RF/RN relacionados | RF009 / RN03 |

### Request

```json
{
  "status": "Demolida",
  "motivo": "Imovel destruido por deslizamento"
}
```

### Response `200 OK`

```json
{
  "message": "Status da moradia atualizado com sucesso",
  "id_moradia": 1,
  "status": "Demolida"
}
```

### Response `409 Conflict`

```json
{
  "error": "Moradia possui ocupacao ativa",
  "details": "Realocar ou inativar a familia antes de arquivar a moradia",
  "requer_realocacao": true,
  "id_familia": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Status atualizado com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para arquivar moradia. |
| `404` | Moradia nao encontrada. |
| `409` | Moradia possui familia ativa vinculada e exige realocacao ou inativacao previa. |
| `422` | Status ou motivo ausente/invalido. |
| `500` | Falha ao atualizar status da moradia. |

---

## 14. Realocar Familia

Encerra a ocupacao atual de uma familia e cria novo registro em `historico_ocupacao` para a nova moradia.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/familias/{id_familia}/realocacoes` |
| Atores | A03 |
| RF/RN relacionados | RF009, RF012 / RN03 |

### Request

```json
{
  "id_nova_moradia": 2,
  "status_saida": "Evacuada por deslizamento",
  "data_entrada": "2026-05-25"
}
```

### Response `201 Created`

```json
{
  "message": "Familia realocada com sucesso",
  "id_familia": 1,
  "id_moradia_anterior": 1,
  "id_nova_moradia": 2,
  "id_historico_ocupacao": 10
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Realocacao criada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para realocar familia. |
| `404` | Familia ou nova moradia nao encontrada. |
| `409` | Familia nao possui ocupacao ativa ou nova moradia nao esta apta. |
| `422` | Data de entrada ou status de saida invalido. |
| `500` | Falha ao processar realocacao. |

---

## 15. Arquivar Morador Falecido

Inativa logicamente o cadastro de um cidadao falecido, preservando o historico para auditoria e relatorios historicos.

| Campo | Valor |
|---|---|
| Metodo | `PATCH` |
| Endpoint | `/api/cidadaos/{id_cidadao}/arquivar` |
| Atores | A02, A03 |
| RF/RN relacionados | RF010 / RN03 |

### Request

```json
{
  "motivo": "Falecimento",
  "data_falecimento": "2026-05-20",
  "confirmado": true
}
```

### Response `200 OK`

```json
{
  "message": "Cidadao arquivado com sucesso",
  "id_cidadao": 1,
  "status_cadastro": false
}
```

### Response `409 Conflict`

Quando o cidadao arquivado for o responsavel da familia:

```json
{
  "error": "Cidadao e responsavel da familia",
  "details": "E necessario definir novo responsavel antes de concluir o arquivamento",
  "requer_novo_responsavel": true,
  "candidatos": [
    {
      "id_cidadao": 2,
      "nome_completo": "Joao Silva"
    }
  ]
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Cidadao arquivado com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para arquivar cidadao. |
| `404` | Cidadao nao encontrado. |
| `409` | Cidadao e responsavel da familia e exige substituicao antes da conclusao. |
| `422` | Data de falecimento ausente/invalida ou motivo invalido. |
| `500` | Falha ao arquivar cidadao. |

---

## 16. Definir ou Substituir Responsavel da Familia

Define ou substitui o responsavel ativo de uma familia.

| Campo | Valor |
|---|---|
| Metodo | `PUT` |
| Endpoint | `/api/familias/{id_familia}/responsavel` |
| Atores | A02, A03 |
| RF/RN relacionados | US13 / RN03 |

### Request

```json
{
  "id_cidadao_novo": 2,
  "cpf": "12345678901",
  "email": "novo.responsavel@example.com",
  "celular": "11999999999",
  "renda": 1800.00,
  "nis": "12345678900",
  "programas_sociais": true,
  "veiculo": false
}
```

### Response `200 OK`

```json
{
  "message": "Responsavel atualizado com sucesso",
  "id_familia": 1,
  "id_cidadao_responsavel": 2,
  "id_responsavel": 3
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Responsavel definido ou substituido com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para alterar responsavel. |
| `404` | Familia ou cidadao informado nao encontrado. |
| `409` | Cidadao informado nao pertence a familia ou esta inativo. |
| `422` | CPF, email, NIS ou dados obrigatorios invalidos. |
| `500` | Falha ao atualizar responsavel. |

---

## 17. Resumo dos Endpoints

| Metodo | Endpoint | Finalidade |
|---|---|---|
| `POST` | `/api/cadastros-completos` | Criar cadastro completo de moradia, familia e ocupacao. |
| `GET` | `/api/moradias/mapa` | Listar marcadores para mapa georreferenciado. |
| `GET` | `/api/moradias/{id_moradia}/consulta-integrada` | Consultar ficha integrada da moradia. |
| `GET` | `/api/moradias` | Listar moradias com busca e filtros. |
| `GET` | `/api/moradias/exportar` | Exportar lista filtrada. |
| `GET` | `/api/familias/{id_familia}/cadastro-completo` | Buscar cadastro completo para revisao. |
| `PUT` | `/api/familias/{id_familia}/cadastro-completo` | Atualizar cadastro completo. |
| `GET` | `/api/familias/{id_familia}/pets` | Listar pets da familia. |
| `POST` | `/api/familias/{id_familia}/pets` | Cadastrar pet. |
| `PUT` | `/api/pets/{id_pet}` | Atualizar pet. |
| `GET` | `/api/indicadores/mapa-calor` | Consultar dados do mapa de calor. |
| `GET` | `/api/indicadores/recadastro` | Consultar indicadores de recadastro. |
| `PATCH` | `/api/moradias/{id_moradia}/status` | Atualizar status/arquivar moradia. |
| `POST` | `/api/familias/{id_familia}/realocacoes` | Realocar familia entre moradias. |
| `PATCH` | `/api/cidadaos/{id_cidadao}/arquivar` | Arquivar morador falecido. |
| `PUT` | `/api/familias/{id_familia}/responsavel` | Definir ou substituir responsavel familiar. |
