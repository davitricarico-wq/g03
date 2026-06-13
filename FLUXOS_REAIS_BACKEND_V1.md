# Fluxos Reais do Backend Atual - Primeira Versão (Narrativa)

**Data:** 2026-06-10  
**Versão:** 1.0 - Baseado em análise de código real  
**Formato:** Descrição narrativa para conversão posterior em Mermaid

---

## 🔄 FLUXO 1: Cadastro de Núcleo Familiar Completo

**Endpoint:** `POST /api/familias/nucleo`

**Atores Envolvidos:**
- Agente de Campo (A01)
- Frontend PWA Mobile
- FamiliaController
- FamiliaService
- FamiliaRepository, MoradiaRepository, PessoaRepository, PetRepository, FotoRepository
- Banco de Dados (PostgreSQL + Supabase)

**Descrição do Fluxo:**

1. Agente de campo preenche e submete formulário com todos os dados:
   - Dados de localização (logradouro, número, bairro, cidade, UF, latitude, longitude)
   - Dados da moradia (tipo de construção, uso do imóvel, pavimentos, situação de ocupação, descrição)
   - Dados do responsável (nome, nome social, data de nascimento, parentesco, CPF, NIS, renda, sexo, raça, estado civil, contato, email, telefone, dados de residência)
   - Lista de dependentes (nome, parentesco, idade, status ocupacional, escolaridade, doenças crônicas, medicação)
   - Lista de pets (tipo, nome, porte, raça, cor, status, observações, fotos)
   - Lista de fotos da moradia (até 2 fotos de fachada/entorno)

2. Controller recebe POST `/api/familias/nucleo` com payload contendo todos os dados acima

3. Service inicia transação no banco (BEGIN)

4. Sequência de INSERTs em cascata:
   - **Localização** é criada primeiro
   - **Moradia** é criada com idLocalizacao da localização
   - **Família** é criada (tabela simples, apenas com ID)
   - **Vinculação Família-Moradia** é criada em `familia_moradia` (data_entrada, status)
   - **Pessoa do Responsável** é criada em `pessoa`
   - **Responsável** é criado em `responsavel` com dados adicionais (CPF, renda, NIS, etc)
   - **Pessoa-Responsável** é vinculada em `pessoa_familia`
   
5. Para cada dependente:
   - **Pessoa** é criada
   - **Pessoa-Família** é vinculada em `pessoa_familia` (sem grupos prioritários)

6. Para cada pet:
   - **Pet** é criado em `pet`
   - Para cada foto do pet: **Foto** é criada em `foto`

7. Para cada foto de moradia:
   - **Foto** é criada em `foto`

8. Se tudo está ok: COMMIT
   - Se erro em qualquer ponto: ROLLBACK

9. Response HTTP 201 retorna:
   ```json
   {
     "localizacao": { id, logradouro, ... },
     "moradia": { id, idLocalizacao, status: "Ativa", ... },
     "familia": { id },
     "responsavel": { id, nome, cpf, ... },
     "dependentes": [ { id, nome, ... } ],
     "pets": [ { id, idFamilia, tipo, ... } ],
     "fotos": [ { id, url, ... } ]
   }
   ```

**Validações Não Implementadas (Esperadas no WAD):**
- ❌ Grupos prioritários NÃO são processados
- ❌ Gestantes NÃO são criadas
- ❌ RN01 (priorização) NÃO é validada
- ❌ RN04 (proibição foto pessoas) NÃO é validada

---

## 🔄 FLUXO 2: Cadastro Isolado de Pessoa

**Endpoints:** 
- `POST /api/pessoas` - Criar pessoa comum
- `GET /api/pessoas` - Listar todas as pessoas
- `GET /api/pessoas/{id}` - Buscar pessoa por ID
- `PUT /api/pessoas/{id}` - Atualizar pessoa
- `DELETE /api/pessoas/{id}` - Remover pessoa (soft delete)

**Descrição do Fluxo:**

1. **Criar Pessoa:**
   - POST `/api/pessoas` com payload: { nome, dataDeNascimento, parentesco, situacaoOcupacional, escolaridade, cronico, medicacao, status }
   - Service valida campos obrigatórios
   - Repository insere em tabela `pessoa`
   - Response HTTP 201 com dados criados

2. **Listar Pessoas:**
   - GET `/api/pessoas` retorna todas as pessoas
   - View `vw_pessoa_ativa` filtra apenas ativas

3. **Buscar por ID:**
   - GET `/api/pessoas/{id}` retorna pessoa específica

4. **Atualizar:**
   - PUT `/api/pessoas/{id}` com dados parciais
   - Service valida
   - Repository faz UPDATE em `pessoa`

5. **Remover:**
   - DELETE `/api/pessoas/{id}` marca como deletada (`deleted_at` NOT NULL)
   - Soft delete lógico

---

## 🔄 FLUXO 3: Cadastro e Gestão de Responsável

**Endpoints:**
- `POST /api/responsaveis` - Criar responsável (cria pessoa + responsável em transação)
- `GET /api/responsaveis` - Listar todos responsáveis
- `GET /api/responsaveis/{id}` - Buscar responsável por ID
- `PUT /api/responsaveis/{id}` - Atualizar responsável (atualiza pessoa + responsável)
- `DELETE /api/responsaveis/{id}` - Remover responsável

**Descrição do Fluxo:**

1. **Criar Responsável (Transacionado):**
   - POST `/api/responsaveis` com payload estendido
   - Inicia transação (BEGIN)
   
   a) Cria **Pessoa** com parentesco "Responsável"
   b) Cria **Responsável** vinculado à pessoa (dados adicionais: CPF, NIS, renda, sexo, raça, estado civil, contato)
   
   - Faz COMMIT se sucesso, ROLLBACK se erro

2. **Listar Responsáveis:**
   - GET `/api/responsaveis` retorna todos

3. **Buscar por ID:**
   - GET `/api/responsaveis/{id}` busca responsável pelo ID da pessoa

4. **Atualizar (Transacionado):**
   - PUT `/api/responsaveis/{id}` com dados parciais
   - Inicia transação
   - Atualiza dados em `pessoa`
   - Atualiza dados em `responsavel`
   - COMMIT ou ROLLBACK

5. **Remover:**
   - DELETE `/api/responsaveis/{id}` marca pessoa como deletada

---

## 🔄 FLUXO 4: Gestão de Famílias e Vínculos

**Endpoints:**
- `POST /api/familias` - Criar família vazia
- `GET /api/familias` - Listar famílias
- `GET /api/familias/{id}` - Detalhes da família
- `POST /api/familias/{id}/pessoas` - Vincular pessoa à família
- `GET /api/familias/{id}/pessoas` - Listar pessoas vinculadas
- `GET /api/familias/{id}/pessoas/historico` - Histórico de pessoas (com data_saida)
- `DELETE /api/familias/{id}/pessoas/{pessoaId}` - Desvincular pessoa
- `POST /api/familias/{id}/moradias` - Vincular moradia à família
- `GET /api/familias/{id}/moradias` - Listar moradias vinculadas
- `GET /api/familias/{id}/moradias/historico` - Histórico de moradias (com data_saida)
- `DELETE /api/familias/{id}/moradias/{moradiaId}` - Desvincular moradia
- `DELETE /api/familias/{id}` - Remover família

**Descrição do Fluxo:**

1. **Criar Família Vazia:**
   - POST `/api/familias` (sem payload)
   - Repository insere em `familia` (tabela só tem ID)
   - Response HTTP 201 com `{ id }`

2. **Vincular Pessoa à Família:**
   - POST `/api/familias/{id_familia}/pessoas` com payload: { idPessoa, dataEntrada? }
   - Service valida se pessoa existe
   - Se pessoa tem parentesco "Responsável": verifica se há responsável ativo já
   - Insere em `pessoa_familia` (id_pessoa, id_familia, data_entrada, data_saida=NULL)
   - Response HTTP 201

3. **Listar Pessoas da Família:**
   - GET `/api/familias/{id_familia}/pessoas`
   - Retorna pessoas ativas (data_saida IS NULL)

4. **Listar Histórico de Pessoas:**
   - GET `/api/familias/{id_familia}/pessoas/historico`
   - Retorna todas as pessoas (ativas e inativas) com datas de entrada/saída

5. **Desvincular Pessoa:**
   - DELETE `/api/familias/{id_familia}/pessoas/{id_pessoa}`
   - Atualiza `pessoa_familia` com data_saida = hoje

6. **Vincular Moradia à Família:**
   - POST `/api/familias/{id_familia}/moradias` com payload: { idMoradia, dataEntrada?, status? }
   - Insere em `familia_moradia` (id_familia, id_moradia, data_entrada, data_saida=NULL, status)

7. **Listar Moradias da Família:**
   - GET `/api/familias/{id_familia}/moradias`
   - Retorna moradias ativas

8. **Listar Histórico de Moradias:**
   - GET `/api/familias/{id_familia}/moradias/historico`
   - Retorna histórico com data_saida

9. **Desvincular Moradia:**
   - DELETE `/api/familias/{id_familia}/moradias/{id_moradia}`
   - Atualiza `familia_moradia` com data_saida = hoje

---

## 🔄 FLUXO 5: Cadastro e Atualização de Moradia

**Endpoints:**
- `POST /api/moradias` - Criar moradia com localização (transacionado)
- `GET /api/moradias` - Listar todas
- `GET /api/moradias/{id}` - Detalhes básicos
- `GET /api/moradias/{id}/detalhes` - Detalhes completos (moradia + famílias + pessoas + pets + fotos)
- `GET /api/moradias/{id}/familias/historico` - Histórico de famílias na moradia
- `PUT /api/moradias/{id}` - Atualizar moradia/localização (transacionado)
- `DELETE /api/moradias/{id}` - Remover moradia (soft delete)

**Descrição do Fluxo:**

1. **Criar Moradia com Localização (Transacionado):**
   - POST `/api/moradias` com payload: { localizacao: {...}, moradia: {...} }
   - BEGIN transação
   - Cria **Localização** em `localizacao`
   - Cria **Moradia** em `moradia` com idLocalizacao
   - COMMIT ou ROLLBACK

2. **Listar Moradias:**
   - GET `/api/moradias` retorna todas as moradias com localização

3. **Detalhes Básicos:**
   - GET `/api/moradias/{id}` retorna moradia + localização

4. **Detalhes Completos (Consulta Integrada):**
   - GET `/api/moradias/{id}/detalhes`
   - Retorna:
     ```json
     {
       "moradia": { ... },
       "familias": [
         {
           "familia": { id },
           "pessoas": [ { id, nome, ... } ],
           "pets": [ { id, tipo, ... } ]
         }
       ],
       "fotos": [ { id, url } ]
     }
     ```
   - **Nota:** Não retorna grupos prioritários (não implementado)
   - **Nota:** Não retorna flag de "Risco Crítico" (não implementado)

5. **Histórico de Famílias:**
   - GET `/api/moradias/{id}/familias/historico`
   - Retorna todas as famílias (ativas e inativas) que moraram no imóvel
   - Inclui datas de entrada/saída

6. **Atualizar Moradia (Transacionado):**
   - PUT `/api/moradias/{id}` com payload parcial
   - BEGIN transação
   - Se localização enviada: UPDATE em `localizacao`
   - Se moradia enviada: UPDATE em `moradia`
   - COMMIT ou ROLLBACK

7. **Remover Moradia:**
   - DELETE `/api/moradias/{id}` marca como deletada

---

## 🔄 FLUXO 6: Gestão de Pets

**Endpoints:**
- `GET /api/pets` - Listar todos pets
- `GET /api/pets/{id}` - Detalhes do pet
- `POST /api/pets` - Criar pet
- `GET /api/familias/{id}/pets` - Listar pets da família
- `POST /api/familias/{id}/pets` - Criar pet na família (vinculado)
- `PUT /api/pets/{id}` - Atualizar pet
- `DELETE /api/pets/{id}` - Remover pet

**Descrição do Fluxo:**

1. **Listar Todos Pets:**
   - GET `/api/pets` retorna todos

2. **Detalhes do Pet:**
   - GET `/api/pets/{id}` retorna pet

3. **Criar Pet Genérico:**
   - POST `/api/pets` com payload: { idFamilia, tipo, nome, porte, raca, cor, status, observacao }
   - Insere em `pet`

4. **Listar Pets da Família:**
   - GET `/api/familias/{id_familia}/pets`
   - Retorna pets vinculados

5. **Criar Pet na Família:**
   - POST `/api/familias/{id_familia}/pets` com payload sem idFamilia (é inferido da URL)
   - Insere pet com idFamilia da URL

6. **Atualizar Pet:**
   - PUT `/api/pets/{id}` com dados parciais

7. **Remover Pet:**
   - DELETE `/api/pets/{id}` soft delete

---

## 🔄 FLUXO 7: Gestão de Fotos (Moradia e Pet)

**Endpoints:**
- `GET /api/moradias/{id}/fotos` - Fotos da moradia
- `POST /api/moradias/{id}/fotos` - Adicionar foto à moradia
- `DELETE /api/moradias/{id}/fotos/{fotoId}` - Remover foto da moradia
- `GET /api/pets/{id}/fotos` - Fotos do pet
- `POST /api/pets/{id}/fotos` - Adicionar foto ao pet
- `DELETE /api/pets/{id}/fotos/{fotoId}` - Remover foto do pet

**Descrição do Fluxo:**

1. **Fotos de Moradia:**
   - GET `/api/moradias/{id}/fotos` retorna todas as fotos
   - POST `/api/moradias/{id}/fotos` cria nova foto com URL
   - DELETE `/api/moradias/{id}/fotos/{fotoId}` remove foto

2. **Fotos de Pet:**
   - GET `/api/pets/{id}/fotos` retorna todas as fotos
   - POST `/api/pets/{id}/fotos` cria nova foto
   - DELETE `/api/pets/{id}/fotos/{fotoId}` remove foto

**Observação:** Fotos são apenas URLs na tabela `foto`. Não há upload real para Supabase Storage neste fluxo (mencionado no WAD como futuro).

---

## 🔄 FLUXO 8: Busca de Pessoas (Filtrada)

**Endpoints:**
- `GET /pessoas/novo` - Renderiza form de nova pessoa (EJS)
- `GET /pessoas` - Lista HTML de pessoas (renderizado)
- `GET /pessoas.json` - Lista JSON de pessoas
- `POST /pessoas` - Criar pessoa (form submission)
- `GET /api/pessoas` - API JSON de todas as pessoas
- `GET /api/pessoas/busca` - Busca com filtros (nome, CPF, email, telefone, escopo)
- `GET /api/pessoas/inativas` - Listar pessoas inativas

**Descrição do Fluxo:**

1. **Formulário Web:**
   - GET `/pessoas/novo` retorna HTML com form

2. **Criar via Form:**
   - POST `/pessoas` com form data
   - Redireciona para lista

3. **Listar People (Web):**
   - GET `/pessoas` retorna HTML renderizado com EJS

4. **Listar (JSON):**
   - GET `/api/pessoas` ou GET `/pessoas.json` retorna JSON

5. **Buscar com Filtros:**
   - GET `/api/pessoas/busca?nome=...&cpf=...&email=...&telefone=...&escopo=ativas|inativas|todas`
   - Service normaliza e busca no banco
   - Retorna pessoa + dados de responsável se existir
   - Requer ao menos um filtro

6. **Listar Inativas:**
   - GET `/api/pessoas/inativas` retorna pessoas deletadas

---

## 📊 Comparação: O que Mudou do WAD para Implementação

### 🔴 REMOVIDO / NÃO IMPLEMENTADO

| Fluxo WAD | Motivo | Impacto |
|-----------|--------|--------|
| **FL04** - Filtros Avançados | Endpoint não suporta query params | Alto - Impossível filtrar por grupos, vulnerabilidades |
| **FL07** - Mapa de Calor | Endpoints `/indicadores/` não existem | Médio - Visualização de clusters perdida |
| **FL10** - Alerta Recadastro | Campo `ultima_atualizacao` não existe | Médio - Impossível detectar cadastros desatualizados |
| **FL11** - Risco Crítico (RN05) | Tabela `historico_ocorrencia` não existe | Médio - Flag de risco crítico não é retornada |
| Grupos Prioritários | Tabela existe, mas não é usada no código | Alto - Categorias de vulnerabilidade perdidas |
| Gestantes | Tabela não existe | Alto - Não há suporte a gestantes |

### 🟡 MODIFICADO / PARCIAL

| Fluxo WAD | Implementação Real | Diferença |
|-----------|-------------------|-----------|
| **FL01** - Cadastro Completo | POST `/api/familias/nucleo` | ✅ Existe, mas não processa grupos/gestantes |
| **FL02** - Mapa Georreferenciado | GET `/api/moradias` + GET `/api/moradias/{id}/detalhes` | ✅ Funciona, mas sem RN05 |
| **FL03** - Consulta Integrada | GET `/api/moradias/{id}/detalhes` | ✅ Funciona, faltam grupos prioritários |
| **FL05** - Atualização Anual | 3 endpoints separados (pessoas, moradia, responsável) | ⚠️ Fragmentado (WAD descreve cadastro-completo unificado) |
| **FL06** - Pets | POST/GET `/api/pets` + `/api/familias/{id}/pets` | ✅ Implementado normalmente |
| **FL08** - Arquivamento Moradia | DELETE `/api/moradias/{id}` | ⚠️ É DELETE, não PATCH; não captura motivo |
| **FL09** - Arquivamento Morador | DELETE `/api/pessoas/{id}` | ⚠️ É DELETE, não PATCH; não valida responsável |
| **FL12** - Integridade Cadastral | Validação parcial em vincularPessoa | ⚠️ Apenas responsável é validado |

### ✅ MANTIDO / CORRETO

| Fluxo WAD | Observação |
|-----------|-----------|
| **FL01** - Estrutura transacional | ✅ BEGIN/COMMIT/ROLLBACK implementados |
| **FL02** - GET `/api/moradias` | ✅ Retorna moradias com localização |
| **FL02** - GET `/api/moradias/{id}/detalhes` | ✅ Retorna dados integrados |
| **FL03** - Integração de dados | ✅ Família + pessoas + pets + fotos aparecem juntos |
| **FL06** - CRUD de pets | ✅ Completo e funcional |
| **Busca de pessoas** | ✅ Com múltiplos filtros |
| **Históricos** | ✅ pessoa_familia e familia_moradia com data_saida |

---

## 🏗️ Estrutura de Dados Real vs. Esperada

### Tabelas Criadas ✅
- `familia`
- `pessoa_familia` (historico_ocupacao esperado no WAD)
- `familia_moradia` (historico_ocupacao esperado no WAD)
- `pessoa`
- `responsavel`
- `moradia`
- `localizacao`
- `pet`
- `foto`
- `grupo_prioritario` (criada mas não usada)
- `pessoa_grupo_prioritario` (criada mas não usada)

### Tabelas Faltando ❌
- `gestante` (esperada em FL01)
- `historico_ocorrencia` (esperada em FL11, RN05)
- `notificacao` (esperada em FL10)

### Campos Faltando ❌
- `moradia.ultima_atualizacao` (esperado em FL10)
- `pessoa.mobilidade_reduzida` ou `pessoa.acamado` (esperado em FL11, RN05)

---

## 📝 Resumo de Fluxos Reais

**Total de Fluxos Documentados:** 8

1. ✅ FL1: Cadastro Núcleo Familiar (transacionado, mas incompleto)
2. ✅ FL2: CRUD Pessoa isolada
3. ✅ FL3: CRUD Responsável (transacionado)
4. ✅ FL4: Gestão Família + Vínculos (pessoa_familia, familia_moradia)
5. ✅ FL5: Cadastro e Atualização de Moradia (transacionado)
6. ✅ FL6: Gestão de Pets
7. ✅ FL7: Gestão de Fotos
8. ✅ FL8: Busca de Pessoas (com filtros)

**Fluxos WAD Não Implementados:** 4 (FL04, FL07, FL10, FL11)

**Fluxos WAD Parcialmente Implementados:** 4 (FL01, FL05, FL08, FL09, FL12)

---

## 🎯 Próximas Ações

1. **Converter esta narrativa em diagramas Mermaid** com formato padronizado
2. **Atualizar WAD** para refletir a implementação real
3. **Priorizar implementações faltantes** para alinhamento com especificação

