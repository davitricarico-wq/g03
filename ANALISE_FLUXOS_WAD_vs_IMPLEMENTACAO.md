# Análise: Fluxos do WAD (3.2.4) vs. Implementação do Backend

**Data:** 2026-06-10  
**Objetivo:** Validar se os fluxos descritos na seção 3.2.4 do WAD correspondem à implementação real do backend

---

## 📊 Resumo Executivo

| Status | Fluxo | Correspondência |
|--------|-------|-----------------|
| ✅ | FL01 - Cadastro Completo | **Parcialmente implementado** |
| ✅ | FL02 - Mapa Georreferenciado | **Implementado** |
| ✅ | FL03 - Consulta Integrada | **Implementado** |
| ⚠️ | FL04 - Filtros Avançados | **Não implementado** |
| ⚠️ | FL05 - Atualização Anual | **Parcialmente implementado** |
| ✅ | FL06 - Pets | **Implementado** |
| ❌ | FL07 - Mapa de Calor | **Não implementado** |
| ⚠️ | FL08 - Arquivamento Moradia | **Parcialmente implementado** |
| ⚠️ | FL09 - Arquivamento Morador | **Parcialmente implementado** |
| ❌ | FL10 - Alerta Automático Recadastro | **Não implementado** |
| ❌ | FL11 - Risco Crítico (RN05) | **Não implementado** |
| ⚠️ | FL12 - Integridade Cadastral | **Parcialmente implementado** |

---

## 🔍 Análise Detalhada por Fluxo

### ✅ FL01 - Cadastro Completo de Família, Moradia e Ocupação

**O que o WAD descreve:**
- POST `/api/familias/nucleo` com payload contendo:
  - Localização (CEP, logradouro, coordenadas GPS)
  - Moradia (tipo de construção, pavimentos, fotos)
  - Família (cadastro incompleto/completo)
  - Responsável (CPF, renda, NIS, contato)
  - **Dependentes/Moradores** com vulnerabilidades
  - **Grupos prioritários** (idoso, criança, gestante, PCD)
  - **Gestantes** com data prevista
  - Pets com fotos
  - Fotos de moradia (máx. 2)
- Transação ACID (BEGIN/COMMIT/ROLLBACK)
- Validação RN01 (priorização) e RN04 (proibição de fotos de pessoas)

**O que está implementado:**
```
✅ POST /api/familias/nucleo existe
✅ Controller.cadastrarNucleoFamiliar implementado
✅ FamiliaService.cadastrarNucleoFamiliar com transação
✅ Localização criada
✅ Moradia criada
✅ Família criada
✅ Responsável criado
✅ Dependentes criados
✅ Pets criados com fotos
✅ Fotos de moradia criadas

❌ FALTA: Grupos prioritários (tabela pessoa_grupo_prioritario existe no banco, mas NÃO é usada no code)
❌ FALTA: Gestantes (não há tabela nem implementação)
❌ FALTA: Histórico_ocupacao (usa familia_moradia sem data_saida na resposta)
⚠️  PARCIAL: RN01 e RN04 não aparecem no validate() do payload
```

**Problemas encontrados:**

1. **Grupos Prioritários Não Utilizados**
   - Tabela `pessoa_grupo_prioritario` existe no Supabase
   - Controllers/Services **não criam vínculos** com grupos prioritários
   - CreatePessoaDto **não tem campo** para grupos
   - O payload esperado pelo frontend pode enviar groups, mas serão ignorados

2. **Gestantes Não Implementadas**
   - Não há tabela `gestante` no banco
   - WAD menciona "INSERT gestante {id_pessoa, data_prevista, data_inicio}"
   - CreatePessoaDto não tem campos para gestação

3. **Validação Incompleta**
   - `validateNucleoFamiliarPayload()` não valida RN01 ou RN04
   - Arquivo de validação não menciona "foto não pode conter pessoas"

**Endpoint real:**
```typescript
POST /api/familias/nucleo
{
  "localizacao": { ... },
  "moradia": { ... },
  "responsavel": { ... },
  "dependentes": [ { ... } ],
  "pets": [ { ... } ],
  "fotos": [ { ... } ]
}
```

**Discrepância com WAD:** ⚠️ **CRÍTICA** - Grupos prioritários e gestantes não são processados

---

### ✅ FL02 - Visualização de Moradias em Mapa Georreferenciado

**O que o WAD descreve:**
- GET `/api/moradias?status=Ativa` → lista de pins com {id, lat, lng, status}
- GET `/api/moradias/{id}/detalhes` → dados completos da moradia com ocupação ativa
- Renderiza pins no mapa
- Clica em marcador → exibe card com informações

**O que está implementado:**
```
✅ GET /api/moradias → retorna moradias ativas
✅ GET /api/moradias/{id}/detalhes → retorna dados completos
✅ Inclui localização (latitude, longitude)
✅ Inclui status da moradia
✅ Retorna família ativa e moradores
```

**Status:** ✅ **IMPLEMENTADO CORRETAMENTE**

---

### ✅ FL03 - Consulta Integrada de Moradia e Moradores

**O que o WAD descreve:**
- GET `/api/moradias?busca={termo}` → lista filtrada
- GET `/api/moradias/{id}/detalhes` → ficha integrada com:
  - Moradia + localização
  - Ocupação ativa (historico_ocupacao.data_saida IS NULL)
  - Família ativa
  - Responsável
  - Moradores ativos
  - Grupos prioritários
  - Pets
  - Fotos
  - **RN05: Flag "Risco Crítico"** se (histórico_ocorrência=true E mobilidade_reduzida/acamado)

**O que está implementado:**
```
✅ GET /api/moradias → busca com filtros
✅ GET /api/moradias/{id}/detalhes → retorna dados integrados
✅ Moradiacontroller.getDetalhes existe
✅ Retorna morada, localização, pets, fotos

❌ FALTA: Filtragem por grupos prioritários (não estão sendo retornados)
❌ FALTA: RN05 (Risco Crítico) - WAD menciona que "não está implementado"
⚠️  PARCIAL: Histórico de ocupação existe (familia_moradia), mas sem data_saida no retorno
```

**Status:** ⚠️ **PARCIALMENTE IMPLEMENTADO** - Falta RN05 e grupos prioritários

---

### ❌ FL04 - Filtros Avançados de Moradias e Assistidos

**O que o WAD descreve:**
- GET `/api/moradias?filtros=...` com filtros combinados:
  - Status da moradia
  - Condição de ocupação
  - Grupos prioritários
  - Vulnerabilidades
  - Destino de evacuação
  - Situação de recadastro (desatualizado)
- Ordenação por RN01 (prioridade)
- Exportação CSV/PDF

**O que está implementado:**
```
✅ GET /api/moradias → retorna moradias
❌ Sem query params para filtros avançados
❌ Sem lógica de filtro por vulnerabilidades
❌ Sem lógica de filtro por destino de evacuação
❌ Sem lógica de filtro por "desatualizado"
❌ Sem endpoint de exportação CSV/PDF
```

**Status:** ❌ **NÃO IMPLEMENTADO**

**Código atual:** 
```typescript
router.get('/api/moradias', controller.getAll);
// Sem suporte a query params de filtro
```

---

### ⚠️ FL05 - Atualização Anual de Dados pelo Agente

**O que o WAD descreve:**
- GET `/familias/{id_familia}/cadastro-completo` → pré-preenchido
- PUT `/familias/{id_familia}/cadastro-completo` → atualiza dados
- Online: Transação com UPDATE/INSERT
- Offline: Enfileira em cache com UUID local
- Remove indicador de "desatualizado" após sucesso
- Trata mudança de moradia (encerra ocupação anterior, cria nova)

**O que está implementado:**
```
❌ Não há GET /familias/{id_familia}/cadastro-completo
✅ Não há PUT /familias/{id_familia}/cadastro-completo
⚠️  Existe PUT /moradias/{id} para atualizar moradia
⚠️  Existe PUT /pessoas/{id} para atualizar pessoa
⚠️  Existe PUT /responsaveis/{id} para atualizar responsável

❌ FALTA: Endpoint "cadastro-completo" que carregue tudo junto
❌ FALTA: Indicador "desatualizado" (campo ultima_atualizacao não existe)
❌ FALTA: Suporte a mudança de moradia com histórico
```

**Status:** ❌ **NÃO IMPLEMENTADO COMO DESCRITO**

**Problema:** WAD descreve um endpoint único para atualizar o núcleo todo (cadastro-completo), mas a implementação fragmentou em 3 endpoints separados (moradias, pessoas, responsáveis)

---

### ✅ FL06 - Cadastro e Manutenção de Pets

**O que o WAD descreve:**
- GET `/familias/{id_familia}/pets` → lista pets da família
- POST/PUT `/api/pets` ou `/api/familias/{id_familia}/pets` → criar/editar
- Validação de tipo_pet obrigatório
- Suporte a múltiplos pets
- Fotos por pet

**O que está implementado:**
```
✅ GET /api/familias/{id_familia}/pets → lista
✅ POST /api/familias/{id_familia}/pets → cria pet na família
✅ GET /api/pets/{id} → retorna pet
✅ PUT /api/pets/{id} → atualiza pet
✅ POST /api/pets/{id}/fotos → upload de foto
```

**Status:** ✅ **IMPLEMENTADO CORRETAMENTE**

---

### ❌ FL07 - Mapa de Calor e Indicadores de Vulnerabilidade

**O que o WAD descreve:**
- GET `/indicadores/mapa-calor?filtro=...&zoom=...`
  - Filtros: idosos, PCD, acamados, gestantes, crianças
  - Retorna clusters térmicos {lat, lng, intensidade}
- GET `/indicadores/recadastro`
  - Retorna {total, atualizadas, desatualizadas}
- Recalcula dinamicamente ao alterar zoom/filtro

**O que está implementado:**
```
❌ Não há GET /indicadores/mapa-calor
❌ Não há GET /indicadores/recadastro
❌ Não há controller IndicadorController
❌ Não há lógica de clustering geográfico
```

**Status:** ❌ **NÃO IMPLEMENTADO**

---

### ⚠️ FL08 - Arquivamento Lógico de Moradia

**O que o WAD descreve:**
- PATCH `/moradias/{id_moradia}/status {status, motivo}`
  - Motivos: Demolida, Interditada, Área de Risco Evacuada
  - Valida ocupação ativa
  - Se há família ativa: requer realocação ou bloqueia (409)
  - Soft delete: status=inactive
- POST `/familias/{id_familia}/realocacoes` → realoca família

**O que está implementado:**
```
✅ DELETE /api/moradias/{id} → deleta moradia
⚠️  Usa soft delete (DELETE lógico)
❌ Não é PATCH, é DELETE
❌ Não há campo "motivo" sendo capturado
❌ Não há validação de "ocupação ativa requer realocação"
❌ Não há endpoint para realocação
```

**Status:** ⚠️ **PARCIALMENTE IMPLEMENTADO** - Lógica existe, mas não segue especificação de endpoints/motivos

---

### ⚠️ FL09 - Arquivamento Lógico de Morador Falecido

**O que o WAD descreve:**
- PATCH `/pessoas/{id_pessoa}/arquivar {motivo='Falecimento', data_falecimento}`
  - Se é responsável: exige novo responsável antes
  - Valida outros moradores ativos
  - Soft delete: status_cadastro=false
- Reavalia RN01 e RN05 após arquivamento

**O que está implementado:**
```
✅ DELETE /api/pessoas/{id} → deleta pessoa
⚠️  Usa soft delete (status_cadastro ou deleted_at)
❌ Não é PATCH, é DELETE
❌ Não há "motivo" ou "data_falecimento"
❌ Não há validação de "if responsável, exige novo"
❌ Não reavaliam RN01/RN05
```

**Status:** ⚠️ **PARCIALMENTE IMPLEMENTADO** - Soft delete existe, mas faltam validações

---

### ❌ FL10 - Alerta Automático de Recadastro (12 meses)

**O que o WAD descreve:**
- Job diário (Cron) que verifica moradias com `ultima_atualizacao < CURRENT_DATE - 365 days`
- Retorna lista de moradias desatualizadas
- GET `/indicadores/recadastro` exibe {total, atualizadas, desatualizadas}
- Alerta persiste até re-salvar dados

**O que está implementado:**
```
❌ Não há job agendado (Cron)
❌ Não há campo ultima_atualizacao no banco
❌ Não há GET /indicadores/recadastro
❌ Não há lógica de cálculo de recadastro
```

**Status:** ❌ **NÃO IMPLEMENTADO**

**Estrutura de banco ausente:**
```sql
-- Faltam campos na tabela moradia:
ALTER TABLE moradia ADD COLUMN ultima_atualizacao DATE DEFAULT CURRENT_DATE;
```

---

### ❌ FL11 - Regra Transversal de Risco Crítico (RN05)

**O que o WAD descreve:**
- Condição: `historico_ocorrencia=true` E (`mobilidade_reduzida` OU `acamado`)
- Aplicado em FL02, FL03, FL04, FL05, FL07, FL09
- Flag "Risco Crítico" no cabeçalho/card
- Critica executada no Service ao carregar moradia

**O que está implementado:**
```
❌ Não há tabela historico_ocorrencia
❌ Não há lógica RN05 no MoradiaService
❌ Não há campo para "mobilidade_reduzida" ou "acamado" em pessoa
❌ Não retorna flag risco_critico
```

**O próprio WAD menciona (seção 3.2.4):**
> "RN05 (Risco Crítico) não está implementado - falta tabela `historico_ocorrencia` no banco"

**Status:** ❌ **NÃO IMPLEMENTADO** (conforme nota do WAD)

---

### ⚠️ FL12 - Validação Transversal de Integridade Cadastral

**O que o WAD descreve:**
- Validação chamada em cadastro, atualização, arquivamento, realocação
- Regras (US13, US14):
  - Família ativa deve ter responsável ativo
  - Família ativa deve ter moradia ativa vinculada
- Retorna 409 Conflict se violado

**O que está implementado:**
```
⚠️  Existe validação de responsável em FamiliaService.vincularPessoa
⚠️  Existe check de responsável obrigatório
❌ Não há validação completa em todos os fluxos
❌ Não há validação de "família ativa precisa moradia ativa"
```

**Status:** ⚠️ **PARCIALMENTE IMPLEMENTADO** - Apenas responsável é validado

---

## 📋 Mapeamento de Rotas: O que WAD Descreve vs. O que Existe

| Fluxo | Rota do WAD | Rota Implementada | Status |
|-------|-------------|-------------------|--------|
| FL01 | POST `/api/familias/nucleo` | POST `/api/familias/nucleo` | ✅ |
| FL02 | GET `/api/moradias?status=Ativa` | GET `/api/moradias` | ⚠️ |
| FL02 | GET `/api/moradias/{id}/detalhes` | GET `/api/moradias/{id}/detalhes` | ✅ |
| FL03 | GET `/api/moradias?busca={termo}` | GET `/api/moradias` | ⚠️ |
| FL04 | GET `/api/moradias?filtros=...` | ❌ Não existe | ❌ |
| FL04 | GET `/moradias/exportar?filtros=...` | ❌ Não existe | ❌ |
| FL05 | GET `/familias/{id}/cadastro-completo` | ❌ Não existe | ❌ |
| FL05 | PUT `/familias/{id}/cadastro-completo` | ❌ Não existe | ❌ |
| FL06 | GET `/api/familias/{id}/pets` | GET `/api/familias/{id}/pets` | ✅ |
| FL06 | POST `/api/familias/{id}/pets` | POST `/api/familias/{id}/pets` | ✅ |
| FL07 | GET `/indicadores/mapa-calor?filtro=...` | ❌ Não existe | ❌ |
| FL07 | GET `/indicadores/recadastro` | ❌ Não existe | ❌ |
| FL08 | PATCH `/moradias/{id}/status` | DELETE `/api/moradias/{id}` | ⚠️ |
| FL08 | POST `/familias/{id}/realocacoes` | ❌ Não existe | ❌ |
| FL09 | PATCH `/pessoas/{id}/arquivar` | DELETE `/api/pessoas/{id}` | ⚠️ |
| FL11 | RN05 (transversal) | ❌ Não implementado | ❌ |
| FL12 | RN12 (transversal) | ⚠️ Parcial | ⚠️ |

---

## 🚨 Problemas Críticos

### 1. **Grupos Prioritários Ignorados** (Impacto: ALTO)
- Tabela existe no banco: `pessoa_grupo_prioritario`
- Não é usada no código
- FL01, FL03, FL07 não retornam grupos

### 2. **Gestantes Não Existem** (Impacto: ALTO)
- Não há tabela `gestante` 
- FL01 tenta criar "INSERT gestante" que falhará

### 3. **Risco Crítico (RN05) Não Implementado** (Impacto: MÉDIO)
- FL02, FL03 não retornam flag
- Falta tabela `historico_ocorrencia`

### 4. **Filtros Avançados (FL04) Não Existem** (Impacto: MÉDIO)
- Endpoint não suporta query params de filtro
- Exportação CSV/PDF não existe

### 5. **Alerta de Recadastro (FL10) Não Implementado** (Impacto: MÉDIO)
- Job Cron não existe
- Campo `ultima_atualizacao` não existe no banco

### 6. **Mapa de Calor (FL07) Não Implementado** (Impacto: BAIXO)
- Endpoint `/indicadores/` não existe
- Lógica de clustering não existe

### 7. **Atualização Completa (FL05) Fragmentada** (Impacto: MÉDIO)
- Não há endpoint único para "cadastro-completo"
- Frontend precisaria fazer 3 requisições em vez de 1

---

## ✅ O que Está Certo

1. **FL01** - Cadastro núcleo transacional existe
2. **FL02** - Mapa georreferenciado funciona
3. **FL03** - Consulta integrada funciona (exceto grupos/RN05)
4. **FL06** - Pets implementado corretamente

---

## 📝 Recomendações

### Prioridade 1 (Bloqueadores):
- [ ] Implementar suporte a grupos prioritários em FL01
- [ ] Criar tabela/lógica de gestantes
- [ ] Implementar RN05 (Risco Crítico)
- [ ] Adicionar campo `ultima_atualizacao` em moradia

### Prioridade 2 (Completude):
- [ ] Implementar FL04 (Filtros avançados)
- [ ] Implementar FL10 (Job de recadastro)
- [ ] Implementar FL07 (Mapa de calor)
- [ ] Unificar atualização em FL05

### Prioridade 3 (Polish):
- [ ] Implementar FL08 como PATCH com motivos
- [ ] Implementar FL09 com validações
- [ ] Adicionar exportação CSV/PDF
- [ ] Validações RN01 e RN04 em FL01

---

## 📞 Próximas Ações

1. **Alinhamento com time:** Discutir quais fluxos são prioritários para MVP
2. **Atualizar WAD:** Documentar o que realmente foi implementado
3. **Priorizar implementações:** Começar pelos bloqueadores (grupos, gestantes, RN05)
4. **Testes:** Adicionar testes para validar cada fluxo

