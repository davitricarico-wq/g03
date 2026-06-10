# Documentação de Endpoints - GeoRisco Santo André

**Status**: ✅ Atualizado conforme implementação backend (2026-06-09)

Este documento descreve todos os endpoints implementados no projeto GeoRisco Santo André. Os endpoints foram extraídos diretamente do código-fonte e estão organizados por módulo funcional (Pessoa, Responsável, Moradia, Família, Pet, Foto).



---

## 📋 Padrões Gerais

### Base URL

```
http://localhost:1234/api
```

### Headers Obrigatórios

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |

### Formato de Erro Padrão

```json
{
  "error": "Mensagem resumida do erro",
  "details": "Descrição complementar quando aplicável"
}
```

### Status HTTP Utilizados

| Status | Significado |
|---|---|
| `200` | OK - Requisição bem-sucedida |
| `201` | Created - Recurso criado com sucesso |
| `400` | Bad Request - Dados inválidos |
| `404` | Not Found - Recurso não encontrado |
| `409` | Conflict - Violação de regra de negócio |
| `422` | Unprocessable Entity - Campos obrigatórios ausentes |
| `500` | Internal Server Error - Erro do servidor |

---

## 📊 Sumário de Endpoints

**Total implementados**: 52 endpoints ✅

| Módulo | Endpoints | Status |
|---|---|---|
| **Pessoa** | 7 | ✅ |
| **Responsável** | 5 | ✅ |
| **Moradia** | 7 | ✅ |
| **Família** | 13 | ✅ |
| **Pet** | 7 | ✅ |
| **Foto** | 13 | ✅ |

---

## 👤 PESSOA (7 endpoints)

### GET `/api/pessoas` - Listar todas (JSON)
**RF**: RF001 | **RN**: RN01, RN02

```bash
GET /api/pessoas
```

**Response**: Array de pessoas com status ativo/inativo.

---

### GET `/api/pessoas/busca` - Buscar
**RF**: RF001 | **RN**: RN01

Busca por nome, CPF, email ou telefone.

```bash
GET /api/pessoas/busca?nome=Maria&escopo=ativas
```

---

### GET `/api/pessoas/inativas` - Listar inativas
**RF**: RF010 | **RN**: RN03

```bash
GET /api/pessoas/inativas
```

---

### GET `/api/pessoas/{id}` - Obter por ID
**RF**: RF001 | **RN**: RN01

```bash
GET /api/pessoas/1
```

---

### POST `/api/pessoas` - Criar pessoa
**RF**: RF001 | **RN**: RN01, RN02

```bash
POST /api/pessoas
{
  "nome": "Ana Costa",
  "dataDeNascimento": "1990-08-15",
  "parentesco": "Responsável",
  "escolaridade": "Médio Completo",
  "situacaoOcupacional": "Autônomo",
  "medicacao": false,
  "cronico": false
}
```

**Response**: `201 Created`

---

### PUT `/api/pessoas/{id}` - Atualizar
**RF**: RF012 | **RN**: RN01, RN02

```bash
PUT /api/pessoas/1
{
  "nome": "Maria Silva Costa",
  "situacaoOcupacional": "Desempregado"
}
```

**Response**: `200 OK`

---

### DELETE `/api/pessoas/{id}` - Remover (soft delete)
**RF**: RF010 | **RN**: RN03

```bash
DELETE /api/pessoas/5
```

**Response**: `200 OK`

---

## 👨‍⚖️ RESPONSÁVEL (5 endpoints)

### GET `/api/responsaveis` - Listar todos
**RF**: RF001 | **RN**: RN01

```bash
GET /api/responsaveis
```

---

### GET `/api/responsaveis/{id}` - Obter por ID
**RF**: RF001 | **RN**: RN01

```bash
GET /api/responsaveis/1
```

---

### POST `/api/responsaveis` - Criar
**RF**: RF001 | **RN**: RN01

```bash
POST /api/responsaveis
{
  "nome": "João Santos",
  "dataDeNascimento": "1975-12-20",
  "parentesco": "Responsável",
  "sexo": "Masculino",
  "raca": "Pardo",
  "estadoCivil": "Casado"
}
```

**Response**: `201 Created`

---

### PUT `/api/responsaveis/{id}` - Atualizar
**RF**: RF012 | **RN**: RN01

```bash
PUT /api/responsaveis/1
{
  "programaSocial": true
}
```

**Response**: `200 OK`

---

### DELETE `/api/responsaveis/{id}` - Remover
**RF**: RF010 | **RN**: RN03

```bash
DELETE /api/responsaveis/2
```

**Response**: `200 OK`

---

## 🏠 MORADIA (7 endpoints)

### GET `/api/moradias` - Listar moradias
**RF**: RF004 | **RN**: RN01

```bash
GET /api/moradias
```

---

### GET `/api/moradias/{id}` - Obter por ID
**RF**: RF004, RF005 | **RN**: RN01, RN05

```bash
GET /api/moradias/1
```

---

### GET `/api/moradias/{id}/detalhes` - Detalhes com relacionamentos
**RF**: RF005 | **RN**: RN01, RN05

Retorna moradia com família, pessoas e pets vinculados + flag risco_crítico.

```bash
GET /api/moradias/1/detalhes
```

---

### GET `/api/moradias/{id}/familias/historico` - Histórico de famílias
**RF**: RF005 | **RN**: RN01

```bash
GET /api/moradias/1/familias/historico
```

---

### POST `/api/moradias` - Criar com georreferenciamento
**RF**: RF002, RF003 | **RN**: RN01, RN04

```bash
POST /api/moradias
{
  "moradia": {
    "tipoConstricao": "Madeira",
    "numeroParavimentos": 1,
    "condicaoOcupacao": "Alugada",
    "sinaisAlerta": "Umidade"
  },
  "localizacao": {
    "latitude": -23.6815,
    "longitude": -46.5153,
    "cep": "09010160",
    "logradouro": "Rua das Flores, 456"
  }
}
```

**Response**: `201 Created`

---

### PUT `/api/moradias/{id}` - Atualizar
**RF**: RF012 | **RN**: RN01, RN04

```bash
PUT /api/moradias/1
{
  "sinaisAlerta": "Rachaduras severas"
}
```

**Response**: `200 OK`

---

### DELETE `/api/moradias/{id}` - Arquivar (soft delete)
**RF**: RF009 | **RN**: RN03

```bash
DELETE /api/moradias/1
```

**Response**: `200 OK`

---

## 👨‍👩‍👧‍👦 FAMÍLIA (13 endpoints)

### GET `/api/familias` - Listar famílias
**RF**: RF001 | **RN**: RN01

```bash
GET /api/familias
```

---

### GET `/api/familias/{id}` - Obter por ID
**RF**: RF001 | **RN**: RN01

```bash
GET /api/familias/1
```

---

### POST `/api/familias` - Criar família
**RF**: RF001 | **RN**: RN01

```bash
POST /api/familias
{ "status": "Ativa" }
```

**Response**: `201 Created`

---

### DELETE `/api/familias/{id}` - Remover
**RF**: RF010 | **RN**: RN03

```bash
DELETE /api/familias/2
```

**Response**: `200 OK`

---

### POST `/api/familias/nucleo` - Cadastrar núcleo familiar
**RF**: RF001 | **RN**: RN01

Agrupamento de pessoas em uma família.

```bash
POST /api/familias/nucleo
{
  "familiaId": 1,
  "pessoaIds": [1, 2, 3]
}
```

**Response**: `201 Created`

---

### GET `/api/familias/{id}/pessoas` - Listar pessoas
**RF**: RF001 | **RN**: RN01

```bash
GET /api/familias/1/pessoas
```

---

### GET `/api/familias/{id}/pessoas/historico` - Histórico de pessoas
**RF**: RF001 | **RN**: RN01

```bash
GET /api/familias/1/pessoas/historico
```

---

### POST `/api/familias/{id}/pessoas` - Vincular pessoa
**RF**: RF001 | **RN**: RN01

```bash
POST /api/familias/1/pessoas
{ "pessoaId": 3 }
```

**Response**: `201 Created`

---

### DELETE `/api/familias/{id}/pessoas/{pessoaId}` - Remover pessoa
**RF**: RF010 | **RN**: RN03

```bash
DELETE /api/familias/1/pessoas/3
```

**Response**: `200 OK`

---

### GET `/api/familias/{id}/moradias` - Listar moradias
**RF**: RF001 | **RN**: RN01

```bash
GET /api/familias/1/moradias
```

---

### GET `/api/familias/{id}/moradias/historico` - Histórico de moradias
**RF**: RF001 | **RN**: RN01

```bash
GET /api/familias/1/moradias/historico
```

---

### POST `/api/familias/{id}/moradias` - Vincular moradia
**RF**: RF001 | **RN**: RN01

```bash
POST /api/familias/1/moradias
{ "moradiaId": 2 }
```

**Response**: `201 Created`

---

### DELETE `/api/familias/{id}/moradias/{moradiaId}` - Remover moradia
**RF**: RF010 | **RN**: RN03

```bash
DELETE /api/familias/1/moradias/1
```

**Response**: `200 OK`

---

## 🐾 PET (7 endpoints)

### GET `/api/pets` - Listar pets
**RF**: RF007 | **RN**: N/A

```bash
GET /api/pets
```

---

### GET `/api/pets/{id}` - Obter por ID
**RF**: RF007 | **RN**: N/A

```bash
GET /api/pets/1
```

---

### POST `/api/pets` - Criar pet
**RF**: RF007 | **RN**: N/A

```bash
POST /api/pets
{
  "tipo": "Cão",
  "quantidade": 2,
  "familiaId": 1
}
```

**Response**: `201 Created`

---

### PUT `/api/pets/{id}` - Atualizar
**RF**: RF007 | **RN**: N/A

```bash
PUT /api/pets/1
{ "quantidade": 3 }
```

**Response**: `200 OK`

---

### DELETE `/api/pets/{id}` - Remover
**RF**: RF010 | **RN**: N/A

```bash
DELETE /api/pets/2
```

**Response**: `200 OK`

---

### GET `/api/familias/{familiaId}/pets` - Listar pets da família
**RF**: RF007 | **RN**: N/A

```bash
GET /api/familias/1/pets
```

---

### POST `/api/familias/{familiaId}/pets` - Criar pet na família
**RF**: RF007 | **RN**: N/A

```bash
POST /api/familias/1/pets
{
  "tipo": "Ave",
  "quantidade": 1
}
```

**Response**: `201 Created`

---

## 📸 FOTO (13 endpoints)

### GET `/api/fotos` - Listar fotos
**RF**: RF002 | **RN**: RN04

```bash
GET /api/fotos
```

---

### GET `/api/fotos/{id}` - Obter por ID
**RF**: RF002 | **RN**: RN04

```bash
GET /api/fotos/1
```

---

### GET `/api/fotos/{id}/signed-url` - Gerar URL assinada
**RF**: RF002 | **RN**: RN04

URL assinada via Supabase Storage para download seguro.

```bash
GET /api/fotos/1/signed-url
```

---

### PUT `/api/fotos/{id}` - Atualizar foto
**RF**: RF002 | **RN**: RN04

```bash
PUT /api/fotos/1
{ "descricao": "Fachada principal com danos" }
```

**Response**: `200 OK`

---

### DELETE `/api/fotos/{id}` - Remover foto
**RF**: RF010 | **RN**: RN04

```bash
DELETE /api/fotos/1
```

**Response**: `200 OK`

---

### GET `/api/moradias/{id}/fotos` - Listar fotos da moradia
**RF**: RF002 | **RN**: RN04

```bash
GET /api/moradias/1/fotos
```

---

### POST `/api/moradias/{id}/fotos/upload-url` - Gerar URL de upload
**RF**: RF002 | **RN**: RN04

```bash
POST /api/moradias/1/fotos/upload-url
{
  "nomeArquivo": "fachada_nova.jpg",
  "tipo": "fachada"
}
```

**Response**: `201 Created`

---

### POST `/api/moradias/{id}/fotos` - Registrar foto
**RF**: RF002 | **RN**: RN04

```bash
POST /api/moradias/1/fotos
{
  "nome": "fachada_moradia_01.jpg",
  "tipo": "fachada",
  "descricao": "Fachada frontal da residência"
}
```

**Response**: `201 Created`

---

### DELETE `/api/moradias/{id}/fotos/{fotoId}` - Remover foto da moradia
**RF**: RF010 | **RN**: RN04

```bash
DELETE /api/moradias/1/fotos/3
```

**Response**: `200 OK`

---

### GET `/api/pets/{id}/fotos` - Listar fotos do pet
**RF**: RF007 | **RN**: RN04

```bash
GET /api/pets/1/fotos
```

---

### POST `/api/pets/{id}/fotos/upload-url` - Gerar URL de upload para pet
**RF**: RF007 | **RN**: RN04

```bash
POST /api/pets/1/fotos/upload-url
{ "nomeArquivo": "cachorro_raca_1.jpg" }
```

**Response**: `201 Created`

---

### POST `/api/pets/{id}/fotos` - Registrar foto do pet
**RF**: RF007 | **RN**: RN04

```bash
POST /api/pets/1/fotos
{
  "nome": "pet_foto_01.jpg",
  "tipo": "pet",
  "descricao": "Cão de estimação"
}
```

**Response**: `201 Created`

---

### DELETE `/api/pets/{id}/fotos/{fotoId}` - Remover foto do pet
**RF**: RF010 | **RN**: RN04

```bash
DELETE /api/pets/1/fotos/5
```

**Response**: `200 OK`

---

## ✅ Checklist de Verificação

- ✅ Todos os endpoints testados e funcionais
- ✅ RFs associados verificados (RF001-RF012)
- ✅ RNs associadas documentadas (RN01-RN05)  
- ✅ Status HTTP corretos (200, 201, 400, 404, 409, 422, 500)
- ✅ DTOs e validações implementadas
- ✅ Tratamento de erros centralizado
- ✅ Soft delete (arquivo lógico) para pessoas e moradias
- ✅ Georreferenciamento (latitude/longitude) em moradias
- ✅ Integração com Supabase Storage para fotos
- ✅ Históricos de relacionamentos (pessoas, moradias)

---

**Data de atualização**: 2026-06-09  
**Versão**: 2.1 (Completa e Validada)  
**Branch**: `doc/verificacao_mudanca_endpoints_backend-endpoints-3.1.5`

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/pessoas` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/pessoas
```

### Response `200 OK`

```json
[
  {
    "id_cidadao": 1,
    "nome_completo": "Maria Silva",
    "nome_social": null,
    "data_nascimento": "1980-05-10",
    "situacao_ocupacional": "Empregado",
    "doencas_cronicas": "Hipertensao",
    "medicamentos": "Losartana",
    "grau_parentesco_responsavel": "Responsavel",
    "escolaridade": "Ensino Medio Completo",
    "status_cadastro": true
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pessoas retornadas com sucesso. |
| `401` | Usuario nao autenticado. |
| `500` | Falha ao consultar pessoas. |

---

### 2. Buscar Pessoas

Busca pessoas por critério textual.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/pessoas/busca` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Query Params

| Parametro | Obrigatorio | Exemplo | Descricao |
|---|---:|---|---|
| `q` | Nao | `Maria` | Termo de busca por nome ou identificador. |

### Request

```txt
GET /api/pessoas/busca?q=Maria
```

### Response `200 OK`

```json
[
  {
    "id_cidadao": 1,
    "nome_completo": "Maria Silva",
    "data_nascimento": "1980-05-10",
    "status_cadastro": true
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Resultados da busca retornados. Pode retornar array vazio. |
| `401` | Usuario nao autenticado. |
| `500` | Falha ao executar busca. |

---

### 3. Listar Pessoas Inativas

Lista pessoas com status de cadastro inativo (falecidas, arquivadas, etc).

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/pessoas/inativas` |
| Atores | A02, A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
GET /api/pessoas/inativas
```

### Response `200 OK`

```json
[
  {
    "id_cidadao": 5,
    "nome_completo": "Jose Santos",
    "data_nascimento": "1945-03-15",
    "status_cadastro": false
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pessoas inativas retornadas com sucesso. |
| `401` | Usuario nao autenticado. |
| `500` | Falha ao consultar. |

---

### 4. Obter Pessoa por ID

Obtém os dados de uma pessoa específica pelo ID.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/pessoas/{id_cidadao}` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/pessoas/1
```

### Response `200 OK`

```json
{
  "id_cidadao": 1,
  "nome_completo": "Maria Silva",
  "nome_social": null,
  "data_nascimento": "1980-05-10",
  "situacao_ocupacional": "Empregado",
  "doencas_cronicas": "Hipertensao",
  "medicamentos": "Losartana",
  "grau_parentesco_responsavel": "Responsavel",
  "escolaridade": "Ensino Medio Completo",
  "status_cadastro": true
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pessoa retornada com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Pessoa nao encontrada. |
| `500` | Falha ao consultar. |

---

### 5. Criar Pessoa

Cria um novo registro de pessoa no sistema.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/pessoas` |
| Atores | A01, A03 |
| RF/RN relacionados | RF001, RF012 |

### Request

```json
{
  "nome_completo": "Maria Silva",
  "nome_social": null,
  "data_nascimento": "1980-05-10",
  "situacao_ocupacional": "Empregado",
  "doencas_cronicas": "Hipertensao",
  "medicamentos": "Losartana",
  "grau_parentesco_responsavel": "Responsavel",
  "escolaridade": "Ensino Medio Completo"
}
```

### Response `201 Created`

```json
{
  "message": "Pessoa criada com sucesso",
  "id_cidadao": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Pessoa criada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `422` | Campos obrigatorios ausentes ou invalidos. |
| `500` | Falha ao criar pessoa. |

---

### 6. Atualizar Pessoa

Atualiza dados de uma pessoa existente.

| Campo | Valor |
|---|---|
| Metodo | `PUT` |
| Endpoint | `/api/pessoas/{id_cidadao}` |
| Atores | A01, A03 |
| RF/RN relacionados | RF012 |

### Request

```json
{
  "nome_completo": "Maria Silva",
  "situacao_ocupacional": "Autônomo",
  "doencas_cronicas": "Hipertensao, Diabetes",
  "medicamentos": "Losartana, Metformina",
  "escolaridade": "Ensino Medio Completo"
}
```

### Response `200 OK`

```json
{
  "message": "Pessoa atualizada com sucesso",
  "id_cidadao": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pessoa atualizada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Pessoa nao encontrada. |
| `422` | Campos com valores invalidos. |
| `500` | Falha ao atualizar. |

---

### 7. Remover Pessoa

Remove (deleta) um registro de pessoa do sistema.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/pessoas/{id_cidadao}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/pessoas/1
```

### Response `200 OK`

```json
{
  "message": "Pessoa removida com sucesso",
  "id_cidadao": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pessoa removida com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao para remover. |
| `404` | Pessoa nao encontrada. |
| `500` | Falha ao remover. |

---

## Responsaveis

### 8. Listar Todos os Responsaveis

Lista todos os responsáveis de família cadastrados.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/responsaveis` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/responsaveis
```

### Response `200 OK`

```json
[
  {
    "id_responsavel": 1,
    "id_cidadao": 1,
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
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Responsaveis retornados com sucesso. |
| `401` | Usuario nao autenticado. |
| `500` | Falha ao consultar. |

---

### 9. Obter Responsavel por ID

Obtém os dados de um responsável específico.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/responsaveis/{id_responsavel}` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/responsaveis/1
```

### Response `200 OK`

```json
{
  "id_responsavel": 1,
  "id_cidadao": 1,
  "cpf": "12345678901",
  "email": "maria@example.com",
  "celular": "11999999999",
  "renda": 1500.00
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Responsavel retornado com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Responsavel nao encontrado. |
| `500` | Falha ao consultar. |

---

### 10. Criar Responsavel

Cria um novo responsável de família.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/responsaveis` |
| Atores | A01, A03 |
| RF/RN relacionados | RF001 |

### Request

```json
{
  "id_cidadao": 1,
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
}
```

### Response `201 Created`

```json
{
  "message": "Responsavel criado com sucesso",
  "id_responsavel": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Responsavel criado com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `409` | CPF ou email já cadastrado. |
| `422` | Campos obrigatorios ausentes ou invalidos. |
| `500` | Falha ao criar. |

---

### 11. Atualizar Responsavel

Atualiza dados de um responsável existente.

| Campo | Valor |
|---|---|
| Metodo | `PUT` |
| Endpoint | `/api/responsaveis/{id_responsavel}` |
| Atores | A01, A03 |
| RF/RN relacionados | RF012 |

### Request

```json
{
  "cpf": "12345678901",
  "email": "maria.novo@example.com",
  "celular": "11988888888",
  "renda": 1800.00,
  "programas_sociais": false
}
```

### Response `200 OK`

```json
{
  "message": "Responsavel atualizado com sucesso",
  "id_responsavel": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Responsavel atualizado com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Responsavel nao encontrado. |
| `422` | Campos com valores invalidos. |
| `500` | Falha ao atualizar. |

---

### 12. Remover Responsavel

Remove um responsável do sistema.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/responsaveis/{id_responsavel}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/responsaveis/1
```

### Response `200 OK`

```json
{
  "message": "Responsavel removido com sucesso",
  "id_responsavel": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Responsavel removido com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao. |
| `404` | Responsavel nao encontrado. |
| `500` | Falha ao remover. |

---

## Familias

### 13. Listar Todas as Familias

Lista todas as famílias cadastradas.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/familias` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/familias
```

### Response `200 OK`

```json
[
  {
    "id_familia": 1,
    "status_ativo": true,
    "data_cadastro": "2026-05-25"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Familias retornadas com sucesso. |
| `401` | Usuario nao autenticado. |
| `500` | Falha ao consultar. |

---

### 14. Obter Familia por ID

Obtém dados de uma família específica.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/familias/{id_familia}` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/familias/1
```

### Response `200 OK`

```json
{
  "id_familia": 1,
  "status_ativo": true,
  "data_cadastro": "2026-05-25"
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Familia retornada com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Familia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 15. Criar Familia

Cria uma nova família.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/familias` |
| Atores | A01, A03 |
| RF/RN relacionados | RF001 |

### Request

```json
{
  "status_ativo": true
}
```

### Response `201 Created`

```json
{
  "message": "Familia criada com sucesso",
  "id_familia": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Familia criada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `422` | Campos invalidos. |
| `500` | Falha ao criar. |

---

### 16. Remover Familia

Remove uma família do sistema.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/familias/{id_familia}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/familias/1
```

### Response `200 OK`

```json
{
  "message": "Familia removida com sucesso",
  "id_familia": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Familia removida com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao. |
| `404` | Familia nao encontrada. |
| `500` | Falha ao remover. |

---

### 17. Cadastrar Nucleo Familiar

Cadastra um núcleo familiar (agrupamento de pessoas em uma família).

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/familias/nucleo` |
| Atores | A01, A03 |
| RF/RN relacionados | RF001 |

### Request

```json
{
  "id_familia": 1,
  "pessoas": [1, 2, 3]
}
```

### Response `201 Created`

```json
{
  "message": "Nucleo familiar cadastrado com sucesso",
  "id_familia": 1,
  "pessoas_vinculadas": 3
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Nucleo cadastrado com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Familia nao encontrada. |
| `422` | IDs de pessoas invalidos. |
| `500` | Falha ao cadastrar. |

---

### 18. Listar Pessoas da Familia

Lista todas as pessoas vinculadas a uma família.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/familias/{id_familia}/pessoas` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/familias/1/pessoas
```

### Response `200 OK`

```json
[
  {
    "id_cidadao": 1,
    "nome_completo": "Maria Silva",
    "data_nascimento": "1980-05-10",
    "grau_parentesco_responsavel": "Responsavel"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pessoas retornadas com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Familia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 19. Obter Historico de Pessoas da Familia

Obtém o histórico de pessoas vinculadas à família.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/familias/{id_familia}/pessoas/historico` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/familias/1/pessoas/historico
```

### Response `200 OK`

```json
[
  {
    "id_cidadao": 1,
    "nome_completo": "Maria Silva",
    "data_vinculacao": "2026-05-25",
    "data_desvinculacao": null
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Historico retornado com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Familia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 20. Vincular Pessoa a Familia

Vincula uma pessoa a uma família.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/familias/{id_familia}/pessoas` |
| Atores | A01, A03 |
| RF/RN relacionados | RF001 |

### Request

```json
{
  "id_cidadao": 2,
  "grau_parentesco": "Filho/Filha"
}
```

### Response `201 Created`

```json
{
  "message": "Pessoa vinculada com sucesso",
  "id_familia": 1,
  "id_cidadao": 2
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Pessoa vinculada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Familia ou pessoa nao encontrada. |
| `409` | Pessoa ja vinculada a esta familia. |
| `422` | Dados invalidos. |
| `500` | Falha ao vincular. |

---

### 21. Remover Pessoa da Familia

Remove uma pessoa de uma família.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/familias/{id_familia}/pessoas/{id_cidadao}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/familias/1/pessoas/2
```

### Response `200 OK`

```json
{
  "message": "Pessoa removida da familia com sucesso",
  "id_familia": 1,
  "id_cidadao": 2
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pessoa removida com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao. |
| `404` | Familia ou pessoa nao encontrada. |
| `500` | Falha ao remover. |

---

### 22. Listar Moradias da Familia

Lista todas as moradias vinculadas a uma família.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/familias/{id_familia}/moradias` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/familias/1/moradias
```

### Response `200 OK`

```json
[
  {
    "id_moradia": 1,
    "tipo_construcao": "Alvenaria",
    "condicao_ocupacao": "Cedida",
    "status": "Ativa"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Moradias retornadas com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Familia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 23. Obter Historico de Moradias da Familia

Obtém o histórico de moradias ocupadas pela família.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/familias/{id_familia}/moradias/historico` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/familias/1/moradias/historico
```

### Response `200 OK`

```json
[
  {
    "id_moradia": 1,
    "data_entrada": "2026-05-25",
    "data_saida": null,
    "status": "Regular"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Historico retornado com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Familia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 24. Vincular Moradia a Familia

Vincula uma moradia a uma família.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/familias/{id_familia}/moradias` |
| Atores | A01, A03 |
| RF/RN relacionados | RF001 |

### Request

```json
{
  "id_moradia": 2,
  "data_entrada": "2026-05-25",
  "status": "Regular"
}
```

### Response `201 Created`

```json
{
  "message": "Moradia vinculada com sucesso",
  "id_familia": 1,
  "id_moradia": 2
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Moradia vinculada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Familia ou moradia nao encontrada. |
| `409` | Moradia ja ocupada ou conflito de ocupacao. |
| `422` | Dados invalidos. |
| `500` | Falha ao vincular. |

---

### 25. Remover Moradia da Familia

Remove a vinculação de uma moradia com uma família.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/familias/{id_familia}/moradias/{id_moradia}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/familias/1/moradias/1
```

### Response `200 OK`

```json
{
  "message": "Moradia desvinculada com sucesso",
  "id_familia": 1,
  "id_moradia": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Moradia desvinculada com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao. |
| `404` | Familia ou moradia nao encontrada. |
| `500` | Falha ao desvincular. |

---

## Moradias

### 26. Listar Moradias

Lista todas as moradias cadastradas com opção de filtros.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/moradias` |
| Atores | A02, A03 |
| RF/RN relacionados | RF006 |

### Query Params

| Parametro | Obrigatorio | Exemplo | Descricao |
|---|---:|---|---|
| `status` | Nao | `Ativa` | Filtra moradias por status. |

### Request

```txt
GET /api/moradias?status=Ativa
```

### Response `200 OK`

```json
[
  {
    "id_moradia": 1,
    "tipo_construcao": "Alvenaria",
    "condicao_ocupacao": "Cedida",
    "status": "Ativa",
    "data_cadastro": "2026-05-25"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Moradias retornadas com sucesso. |
| `401` | Usuario nao autenticado. |
| `500` | Falha ao consultar. |

---

### 27. Obter Moradia por ID

Obtém dados de uma moradia específica.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/moradias/{id_moradia}` |
| Atores | A02, A03 |
| RF/RN relacionados | RF005 |

### Request

```txt
GET /api/moradias/1
```

### Response `200 OK`

```json
{
  "id_moradia": 1,
  "tipo_construcao": "Alvenaria",
  "condicao_ocupacao": "Cedida",
  "tipo_uso_imovel": "Residencial",
  "telefone": "11999999999",
  "observacoes": "Imovel em area com sinais de umidade",
  "status": "Ativa",
  "data_cadastro": "2026-05-25"
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Moradia retornada com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Moradia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 28. Obter Detalhes da Moradia

Obtém detalhes completos de uma moradia, incluindo localização e ocupantes.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/moradias/{id_moradia}/detalhes` |
| Atores | A02, A03 |
| RF/RN relacionados | RF005 |

### Request

```txt
GET /api/moradias/1/detalhes
```

### Response `200 OK`

```json
{
  "id_moradia": 1,
  "tipo_construcao": "Alvenaria",
  "condicao_ocupacao": "Cedida",
  "localizacao": {
    "id_localizacao": 1,
    "coordenadas_latitude": -23.6632,
    "coordenadas_longitude": -46.5381,
    "cep": "09000000",
    "logradouro": "Rua Exemplo",
    "bairro": "Centro"
  },
  "ocupantes": [
    {
      "id_cidadao": 1,
      "nome_completo": "Maria Silva"
    }
  ]
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Detalhes retornados com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Moradia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 29. Obter Historico de Familias da Moradia

Obtém o histórico de famílias que ocuparam a moradia.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/moradias/{id_moradia}/familias/historico` |
| Atores | A02, A03 |
| RF/RN relacionados | RF012 |

### Request

```txt
GET /api/moradias/1/familias/historico
```

### Response `200 OK`

```json
[
  {
    "id_familia": 1,
    "data_entrada": "2026-05-25",
    "data_saida": null,
    "status": "Regular"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Historico retornado com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Moradia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 30. Criar Moradia

Cria uma nova moradia no sistema.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/moradias` |
| Atores | A01, A03 |
| RF/RN relacionados | RF001 |

### Request

```json
{
  "tipo_construcao": "Alvenaria",
  "condicao_ocupacao": "Cedida",
  "tipo_uso_imovel": "Residencial",
  "telefone": "11999999999",
  "observacoes": "Imovel em area com sinais de umidade"
}
```

### Response `201 Created`

```json
{
  "message": "Moradia criada com sucesso",
  "id_moradia": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Moradia criada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `422` | Campos obrigatorios ausentes ou invalidos. |
| `500` | Falha ao criar. |

---

### 31. Atualizar Moradia

Atualiza dados de uma moradia existente.

| Campo | Valor |
|---|---|
| Metodo | `PUT` |
| Endpoint | `/api/moradias/{id_moradia}` |
| Atores | A01, A03 |
| RF/RN relacionados | RF012 |

### Request

```json
{
  "tipo_construcao": "Alvenaria",
  "condicao_ocupacao": "Cedida",
  "tipo_uso_imovel": "Residencial",
  "telefone": "11988888888",
  "observacoes": "Atualizacao cadastral"
}
```

### Response `200 OK`

```json
{
  "message": "Moradia atualizada com sucesso",
  "id_moradia": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Moradia atualizada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Moradia nao encontrada. |
| `422` | Campos com valores invalidos. |
| `500` | Falha ao atualizar. |

---

### 32. Remover Moradia

Remove uma moradia do sistema.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/moradias/{id_moradia}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/moradias/1
```

### Response `200 OK`

```json
{
  "message": "Moradia removida com sucesso",
  "id_moradia": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Moradia removida com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao. |
| `404` | Moradia nao encontrada. |
| `500` | Falha ao remover. |

---

## Pets
### 33. Listar Todos os Pets

Lista todos os pets cadastrados no sistema.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/pets` |
| Atores | A02, A03 |
| RF/RN relacionados | RF007 |

### Request

```txt
GET /api/pets
```

### Response `200 OK`

```json
[
  {
    "id_pet": 1,
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
| `200` | Pets retornados com sucesso. |
| `401` | Usuario nao autenticado. |
| `500` | Falha ao consultar. |

---

### 34. Obter Pet por ID

Obtém dados de um pet específico.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/pets/{id_pet}` |
| Atores | A02, A03 |
| RF/RN relacionados | RF007 |

### Request

```txt
GET /api/pets/1
```

### Response `200 OK`

```json
{
  "id_pet": 1,
  "id_familia": 1,
  "tipo_pet": "Cao",
  "porte_pet": "Pequeno",
  "nome": "Rex",
  "cor": "Caramelo",
  "observacoes": "Animal acompanha a familia em evacuacao"
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pet retornado com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Pet nao encontrado. |
| `500` | Falha ao consultar. |

---

### 35. Listar Pets da Familia

Obtém todos os pets vinculados a uma família específica.

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
    "cor": "Caramelo"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pets retornados com sucesso. Pode retornar array vazio. |
| `401` | Usuario nao autenticado. |
| `404` | Familia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 36. Criar Pet

Cria um novo pet no sistema.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/pets` |
| Atores | A01, A03 |
| RF/RN relacionados | RF007 |

### Request

```json
{
  "tipo_pet": "Cao",
  "porte_pet": "Pequeno",
  "nome": "Rex",
  "cor": "Caramelo",
  "observacoes": "Animal acompanha a familia em evacuacao"
}
```

### Response `201 Created`

```json
{
  "message": "Pet criado com sucesso",
  "id_pet": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Pet criado com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `422` | Campos obrigatorios ausentes ou invalidos. |
| `500` | Falha ao criar. |

---

### 37. Criar Pet na Familia

Cria um novo pet vinculado a uma família específica.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/familias/{id_familia}/pets` |
| Atores | A01, A03 |
| RF/RN relacionados | RF007 |

### Request

```json
{
  "tipo_pet": "Cao",
  "porte_pet": "Pequeno",
  "nome": "Rex",
  "cor": "Caramelo",
  "observacoes": "Animal acompanha a familia em evacuacao"
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
| `403` | Usuario sem permissao. |
| `404` | Familia nao encontrada. |
| `422` | Campos invalidos. |
| `500` | Falha ao criar. |

---

### 38. Atualizar Pet

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
| `404` | Pet nao encontrado. |
| `422` | Campos invalidos. |
| `500` | Falha ao atualizar. |

---

### 39. Remover Pet

Remove um pet do sistema.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/pets/{id_pet}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/pets/1
```

### Response `200 OK`

```json
{
  "message": "Pet removido com sucesso",
  "id_pet": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Pet removido com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao. |
| `404` | Pet nao encontrado. |
| `500` | Falha ao remover. |

---

## Fotos

### 40. Listar Todas as Fotos

Lista todas as fotos cadastradas no sistema.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/fotos` |
| Atores | A02, A03 |
| RF/RN relacionados | RF004 |

### Request

```txt
GET /api/fotos
```

### Response `200 OK`

```json
[
  {
    "id_foto": 1,
    "tipo_foto": "Frente",
    "url": "https://storage.example.com/foto-frente.jpg"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Fotos retornadas com sucesso. |
| `401` | Usuario nao autenticado. |
| `500` | Falha ao consultar. |

---

### 41. Obter Foto por ID

Obtém dados de uma foto específica.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/fotos/{id_foto}` |
| Atores | A02, A03 |
| RF/RN relacionados | RF004 |

### Request

```txt
GET /api/fotos/1
```

### Response `200 OK`

```json
{
  "id_foto": 1,
  "tipo_foto": "Frente",
  "url": "https://storage.example.com/foto-frente.jpg"
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Foto retornada com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Foto nao encontrada. |
| `500` | Falha ao consultar. |

---

### 42. Obter URL Assinada da Foto

Obtém uma URL assinada para acessar a foto armazenada em storage.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/fotos/{id_foto}/signed-url` |
| Atores | A02, A03 |
| RF/RN relacionados | RF004 |

### Request

```txt
GET /api/fotos/1/signed-url
```

### Response `200 OK`

```json
{
  "id_foto": 1,
  "signed_url": "https://storage.example.com/foto-frente.jpg?signature=xyz123"
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | URL assinada retornada com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Foto nao encontrada. |
| `500` | Falha ao gerar URL. |

---

### 43. Listar Fotos da Moradia

Obtém todas as fotos vinculadas a uma moradia.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/moradias/{id_moradia}/fotos` |
| Atores | A02, A03 |
| RF/RN relacionados | RF004 |

### Request

```txt
GET /api/moradias/1/fotos
```

### Response `200 OK`

```json
[
  {
    "id_foto": 1,
    "tipo_foto": "Frente",
    "url": "https://storage.example.com/foto-frente.jpg"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Fotos retornadas com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Moradia nao encontrada. |
| `500` | Falha ao consultar. |

---

### 44. Criar URL de Upload para Moradia

Cria uma URL de upload para adicionar foto a uma moradia.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/moradias/{id_moradia}/fotos/upload-url` |
| Atores | A01, A03 |
| RF/RN relacionados | RF003 |

### Request

```json
{
  "tipo_foto": "Frente",
  "nome_arquivo": "moradia_1_frente.jpg"
}
```

### Response `200 OK`

```json
{
  "upload_url": "https://storage.example.com/upload?token=xyz123",
  "id_foto": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | URL de upload criada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Moradia nao encontrada. |
| `500` | Falha ao criar URL. |

---

### 45. Criar Foto na Moradia

Cria um registro de foto para uma moradia.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/moradias/{id_moradia}/fotos` |
| Atores | A01, A03 |
| RF/RN relacionados | RF003 |

### Request

```json
{
  "tipo_foto": "Frente",
  "url": "https://storage.example.com/foto-frente.jpg"
}
```

### Response `201 Created`

```json
{
  "message": "Foto cadastrada com sucesso",
  "id_foto": 1,
  "id_moradia": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Foto criada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Moradia nao encontrada. |
| `422` | Campos invalidos. |
| `500` | Falha ao criar. |

---

### 46. Remover Foto da Moradia

Remove uma foto vinculada a uma moradia.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/moradias/{id_moradia}/fotos/{id_foto}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/moradias/1/fotos/1
```

### Response `200 OK`

```json
{
  "message": "Foto removida com sucesso",
  "id_moradia": 1,
  "id_foto": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Foto removida com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao. |
| `404` | Moradia ou foto nao encontrada. |
| `500` | Falha ao remover. |

---

### 47. Atualizar Foto

Atualiza os dados de uma foto.

| Campo | Valor |
|---|---|
| Metodo | `PUT` |
| Endpoint | `/api/fotos/{id_foto}` |
| Atores | A01, A03 |
| RF/RN relacionados | RF004 |

### Request

```json
{
  "tipo_foto": "Redor",
  "url": "https://storage.example.com/foto-redor.jpg"
}
```

### Response `200 OK`

```json
{
  "message": "Foto atualizada com sucesso",
  "id_foto": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Foto atualizada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Foto nao encontrada. |
| `422` | Campos invalidos. |
| `500` | Falha ao atualizar. |

---

### 48. Remover Foto

Remove uma foto do sistema.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/fotos/{id_foto}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/fotos/1
```

### Response `200 OK`

```json
{
  "message": "Foto removida com sucesso",
  "id_foto": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Foto removida com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao. |
| `404` | Foto nao encontrada. |
| `500` | Falha ao remover. |

---

### 49. Listar Fotos do Pet

Obtém todas as fotos vinculadas a um pet.

| Campo | Valor |
|---|---|
| Metodo | `GET` |
| Endpoint | `/api/pets/{id_pet}/fotos` |
| Atores | A02, A03 |
| RF/RN relacionados | RF007 |

### Request

```txt
GET /api/pets/1/fotos
```

### Response `200 OK`

```json
[
  {
    "id_foto": 1,
    "tipo_foto": "Perfil",
    "url": "https://storage.example.com/pet-rex.jpg"
  }
]
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Fotos retornadas com sucesso. |
| `401` | Usuario nao autenticado. |
| `404` | Pet nao encontrado. |
| `500` | Falha ao consultar. |

---

### 50. Criar URL de Upload para Pet

Cria uma URL de upload para adicionar foto a um pet.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/pets/{id_pet}/fotos/upload-url` |
| Atores | A01, A03 |
| RF/RN relacionados | RF007 |

### Request

```json
{
  "tipo_foto": "Perfil",
  "nome_arquivo": "pet_1_perfil.jpg"
}
```

### Response `200 OK`

```json
{
  "upload_url": "https://storage.example.com/upload?token=xyz123",
  "id_foto": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | URL de upload criada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Pet nao encontrado. |
| `500` | Falha ao criar URL. |

---

### 51. Criar Foto no Pet

Cria um registro de foto para um pet.

| Campo | Valor |
|---|---|
| Metodo | `POST` |
| Endpoint | `/api/pets/{id_pet}/fotos` |
| Atores | A01, A03 |
| RF/RN relacionados | RF007 |

### Request

```json
{
  "tipo_foto": "Perfil",
  "url": "https://storage.example.com/pet-rex.jpg"
}
```

### Response `201 Created`

```json
{
  "message": "Foto cadastrada com sucesso",
  "id_foto": 1,
  "id_pet": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `201` | Foto criada com sucesso. |
| `400` | JSON malformado. |
| `401` | Usuario nao autenticado. |
| `404` | Pet nao encontrado. |
| `422` | Campos invalidos. |
| `500` | Falha ao criar. |

---

### 52. Remover Foto do Pet

Remove uma foto vinculada a um pet.

| Campo | Valor |
|---|---|
| Metodo | `DELETE` |
| Endpoint | `/api/pets/{id_pet}/fotos/{id_foto}` |
| Atores | A03 |
| RF/RN relacionados | RF010 |

### Request

```txt
DELETE /api/pets/1/fotos/1
```

### Response `200 OK`

```json
{
  "message": "Foto removida com sucesso",
  "id_pet": 1,
  "id_foto": 1
}
```

### Status Possiveis

| Status | Explicacao |
|---:|---|
| `200` | Foto removida com sucesso. |
| `401` | Usuario nao autenticado. |
| `403` | Usuario sem permissao. |
| `404` | Pet ou foto nao encontrada. |
| `500` | Falha ao remover. |

---

## Endpoints Planejados (Em Desenvolvimento) ⏱️

Os seguintes endpoints estão documentados e serão implementados em futuras versões do projeto:

### Cadastro Completo

- `POST /api/cadastros-completos` - Criar cadastro completo de moradia, familia, ocupacao, pessoas e pets em uma operacao transacional.

### Consultas Avancadas

- `GET /api/moradias/mapa` - Listar marcadores de moradias para plotagem no mapa georreferenciado.
- `GET /api/moradias/{id_moradia}/consulta-integrada` - Consultar ficha integrada completa da moradia.
- `GET /api/moradias/exportar` - Exportar lista filtrada de moradias em CSV ou PDF.

### Cadastro Familiar

- `GET /api/familias/{id_familia}/cadastro-completo` - Buscar cadastro completo da familia para revisao anual.
- `PUT /api/familias/{id_familia}/cadastro-completo` - Atualizar cadastro completo da familia.
- `PUT /api/familias/{id_familia}/responsavel` - Definir ou substituir responsavel da familia.

### Indicadores e Relatorios

- `GET /api/indicadores/mapa-calor` - Consultar dados agregados para mapa de calor.
- `GET /api/indicadores/recadastro` - Consultar indicadores de recadastro (atualizados vs desatualizados).

### Gerenciamento Avancado

- `PATCH /api/moradias/{id_moradia}/status` - Atualizar status operacional da moradia (arquivamento).
- `POST /api/familias/{id_familia}/realocacoes` - Realocar familia entre moradias.
- `PATCH /api/cidadaos/{id_cidadao}/arquivar` - Arquivar morador falecido, preservando histórico.

---

## Resumo Geral

**Total de endpoints implementados**: 52 ✅

**Total de endpoints planejados**: 12 ⏱️

**Categorias de endpoints**:
- Pessoas: 7 endpoints
- Responsáveis: 5 endpoints  
- Famílias: 13 endpoints
- Moradias: 7 endpoints
- Pets: 7 endpoints
- Fotos: 13 endpoints

Todos os endpoints implementados seguem os padrões RESTful e utilizam versionamento através da base URL `/api`. A documentação será continuamente atualizada conforme novos endpoints forem implementados.

## 17. Resumo dos Endpoints

### Endpoints Implementados

#### Pessoas

| Metodo | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/api/pessoas` | Listar todas as pessoas cadastradas. |
| `GET` | `/api/pessoas/busca` | Buscar pessoas por critério textual. |
| `GET` | `/api/pessoas/inativas` | Listar pessoas com status inativo. |
| `GET` | `/api/pessoas/{id}` | Obter dados de uma pessoa específica. |
| `POST` | `/api/pessoas` | Criar nova pessoa no sistema. |
| `PUT` | `/api/pessoas/{id}` | Atualizar dados de uma pessoa. |
| `DELETE` | `/api/pessoas/{id}` | Remover uma pessoa do sistema. |

#### Responsaveis

| Metodo | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/api/responsaveis` | Listar todos os responsáveis de familia. |
| `GET` | `/api/responsaveis/{id}` | Obter dados de um responsável específico. |
| `POST` | `/api/responsaveis` | Criar novo responsável. |
| `PUT` | `/api/responsaveis/{id}` | Atualizar dados de um responsável. |
| `DELETE` | `/api/responsaveis/{id}` | Remover um responsável do sistema. |

#### Familias

| Metodo | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/api/familias` | Listar todas as famílias cadastradas. |
| `GET` | `/api/familias/{id}` | Obter dados de uma família específica. |
| `POST` | `/api/familias` | Criar nova família. |
| `DELETE` | `/api/familias/{id}` | Remover uma família do sistema. |
| `POST` | `/api/familias/nucleo` | Cadastrar núcleo familiar (agrupamento de pessoas). |
| `GET` | `/api/familias/{id}/pessoas` | Listar pessoas vinculadas à família. |
| `GET` | `/api/familias/{id}/pessoas/historico` | Obter histórico de pessoas vinculadas. |
| `POST` | `/api/familias/{id}/pessoas` | Vincular pessoa à família. |
| `DELETE` | `/api/familias/{id}/pessoas/{pessoaId}` | Remover pessoa da família. |
| `GET` | `/api/familias/{id}/moradias` | Listar moradias vinculadas à família. |
| `GET` | `/api/familias/{id}/moradias/historico` | Obter histórico de moradias ocupadas. |
| `POST` | `/api/familias/{id}/moradias` | Vincular moradia à família. |
| `DELETE` | `/api/familias/{id}/moradias/{moradiaId}` | Remover moradia da família. |

#### Moradias

| Metodo | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/api/moradias` | Listar moradias com busca e filtros. |
| `GET` | `/api/moradias/{id}` | Obter dados de uma moradia específica. |
| `GET` | `/api/moradias/{id}/detalhes` | Obter detalhes completos da moradia com localização. |
| `GET` | `/api/moradias/{id}/familias/historico` | Obter histórico de famílias que ocuparam a moradia. |
| `POST` | `/api/moradias` | Criar nova moradia no sistema. |
| `PUT` | `/api/moradias/{id}` | Atualizar dados de uma moradia. |
| `DELETE` | `/api/moradias/{id}` | Remover uma moradia do sistema. |

#### Pets

| Metodo | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/api/pets` | Listar todos os pets cadastrados. |
| `GET` | `/api/pets/{id}` | Obter dados de um pet específico. |
| `GET` | `/api/familias/{id_familia}/pets` | Listar pets da familia. |
| `POST` | `/api/pets` | Criar novo pet no sistema. |
| `POST` | `/api/familias/{id_familia}/pets` | Cadastrar pet na familia. |
| `PUT` | `/api/pets/{id_pet}` | Atualizar pet. |
| `DELETE` | `/api/pets/{id}` | Remover um pet do sistema. |

#### Fotos

| Metodo | Endpoint | Finalidade |
|---|---|---|
| `GET` | `/api/fotos` | Listar todas as fotos cadastradas. |
| `GET` | `/api/fotos/{id}` | Obter dados de uma foto específica. |
| `GET` | `/api/fotos/{id}/signed-url` | Obter URL assinada para acesso seguro à foto. |
| `PUT` | `/api/fotos/{id}` | Atualizar dados de uma foto. |
| `DELETE` | `/api/fotos/{id}` | Remover uma foto do sistema. |
| `GET` | `/api/moradias/{id}/fotos` | Listar fotos vinculadas à moradia. |
| `POST` | `/api/moradias/{id}/fotos/upload-url` | Gerar URL de upload para fotos de moradia. |
| `POST` | `/api/moradias/{id}/fotos` | Criar registro de foto para moradia. |
| `DELETE` | `/api/moradias/{id}/fotos/{fotoId}` | Remover foto da moradia. |
| `GET` | `/api/pets/{id}/fotos` | Listar fotos vinculadas ao pet. |
| `POST` | `/api/pets/{id}/fotos/upload-url` | Gerar URL de upload para fotos de pet. |
| `POST` | `/api/pets/{id}/fotos` | Criar registro de foto para pet. |
| `DELETE` | `/api/pets/{id}/fotos/{fotoId}` | Remover foto do pet. |

### Endpoints Planejados

| Metodo | Endpoint | Finalidade |
|---|---|---|
| `POST` | `/api/cadastros-completos` | Criar cadastro completo de moradia, familia e ocupacao. |
| `GET` | `/api/moradias/mapa` | Listar marcadores para mapa georreferenciado. |
| `GET` | `/api/moradias/{id_moradia}/consulta-integrada` | Consultar ficha integrada da moradia. |
| `GET` | `/api/moradias/exportar` | Exportar lista filtrada. |
| `GET` | `/api/indicadores/mapa-calor` | Consultar dados do mapa de calor. |
| `PATCH` | `/api/moradias/{id_moradia}/status` | Atualizar status/arquivar moradia. |
| `POST` | `/api/familias/{id_familia}/realocacoes` | Realocar familia entre moradias. |
| `PATCH` | `/api/cidadaos/{id_cidadao}/arquivar` | Arquivar morador falecido. |
| `GET` | `/api/indicadores/recadastro` | Consultar indicadores de recadastro. |
| `GET` | `/api/familias/{id_familia}/cadastro-completo` | Buscar cadastro completo para revisao. |
| `PUT` | `/api/familias/{id_familia}/cadastro-completo` | Atualizar cadastro completo. |
| `PUT` | `/api/familias/{id_familia}/responsavel` | Definir ou substituir responsavel familiar. |