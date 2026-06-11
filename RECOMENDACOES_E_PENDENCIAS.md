# Recomendações, Pendências e Auditoria do Backend

Este documento apresenta uma auditoria detalhada do backend da aplicação `geoRisco`. O objetivo é confrontar os problemas apontados nas análises anteriores com a realidade do código-fonte (controllers, services, repositories) e do banco de dados (Supabase/PostgreSQL) para separar os **Problemas Reais** dos **Falsos Gaps (Mapeados por Falta de Informação)**.

---

## 📊 Matriz de Auditoria: Problemas Reais vs. Falsos Gaps

| Fluxo / Recurso | Problema Apontado Anteriormente | Status Real no Backend / Banco | Classificação | Racional / Impacto |
| :--- | :--- | :--- | :--- | :--- |
| **Filtro de Inativos por Padrão** | Repositories não filtram registros ativos por padrão. | Os repositórios consultam as views `vw_moradia_ativa`, `vw_pessoa_ativa` e `vw_familia_ativa`. | 🔴 **FALSO GAP** *(Falta de Informação)* | O filtro já ocorre na camada de banco via views. O repository está correto e limpo. |
| **Soft Delete e Data de Inativação/Óbito** | Repositories fazem DELETE físico; falta campo de justificativa/motivo e data_falecimento. | O banco possui regras (`CREATE RULE`) que reescrevem `DELETE` para `UPDATE deleted_at = now()`. Não há requisito de capturar motivos; `deleted_at` assume a data da requisição como data de inativação/óbito. | 🔴 **FALSO GAP** *(Falta de Informação)* | O soft delete básico via regras de banco (`CREATE RULE` interceptando `DELETE`) atende 100% ao requisito de inativação e data de óbito sem necessidade de colunas extras ou alteração de rotas. |
| **Histórico de Ocupação** | Não há data de saída (`data_saida`) ou histórico de ocupação funcional no backend. | Os repositories mapeiam e os endpoints `/historico` retornam `data_entrada` e `data_saida` corretamente. | 🔴 **FALSO GAP** *(Falta de Informação)* | O histórico de moradias e moradores está 100% implementado e exposto em endpoints específicos. |
| **Grupos Prioritários** | Tabela no banco existe mas não é usada no código. | Não há nenhuma menção a `grupo_prioritario` ou `pessoa_grupo_prioritario` no código da aplicação. | 🟢 **PROBLEMA REAL** | As vulnerabilidades dos assistidos não estão sendo salvas ou associadas no cadastro do núcleo. |
| **Atualização Unificada (FL05)** | Falta endpoint unificado para atualização anual. | Existem apenas PUTs granulares e separados para moradias, pessoas e responsáveis. | 🟢 **PROBLEMA REAL** | Risco de inconsistência de dados no PWA Mobile. É necessário unificar a rota para sincronização. |
| **Validação de Vínculos (FL12)** | Família ativa associada a moradia inativa/deletada. | `FamiliaService.vincularMoradia` não valida se o status da moradia é ativo. | 🟢 **PROBLEMA REAL** | Permite violação da regra US14 (família ativa exige moradia ativa). |
| **Filtros Avançados (FL04) e Mapa de Calor (FL07)** | Endpoints de filtros complexos e de mapa de calor inexistentes. | Não existem rotas, controllers ou lógicas para estas funcionalidades. | 🟢 **PROBLEMA REAL** | Funcionalidades de BI e gestão georreferenciada ausentes; devem ir para o backlog futuro. |

---

## 🔴 Mudanças Não Recomendadas

1. **Reutilizar `DataRegistro` para rastrear a última atualização:** Desaconselhado, pois causaria perda do histórico de quando o imóvel foi inicialmente mapeado.
2. **Utilizar "ocupa" (`familia_moradia`) para representar ocorrências (FL11):** Desaconselhado devido à inconsistência conceitual de dados (ocupação $\neq$ incidentes/riscos ambientais).
3. **Substituir as rotas HTTP `DELETE` por `PATCH/UPDATE` para inativação:** Desaconselhado diante da simplificação dos requisitos. Como não é necessário armazenar motivos/justificativas e a data de inativação/óbito equivale ao exato momento do request (salvo automaticamente em `deleted_at`), manter as rotas como `DELETE` com o interceptor de banco reescrevendo para `UPDATE` é a solução mais simples, limpa e recomendada.

---

## 🔍 Detalhamento dos Falsos Gaps (Recursos Já Existentes)

### 1. Filtro de Registros Ativos por Padrão
* **O que foi dito:** Que a lógica de filtros de registros ativos deveria ser implementada nos repositórios.
* **A Realidade:** A lógica já está centralizada no banco de dados através de Views PostgreSQL (`vw_pessoa_ativa`, `vw_moradia_ativa`, `vw_familia_ativa`). Os arquivos como `pessoa.repository.ts` e `moradia.repository.ts` chamam estas views nas consultas de leitura comum:
  ```typescript
  // Trecho de moradia.repository.ts
  async getAll(): Promise<MoradiaComLocalizacao[]> {
      const res = await db.query(`SELECT ... FROM vw_moradia_ativa m ...`);
  }
  ```
* **Veredito:** O design atual é excelente pois evita a repetição de cláusulas `WHERE deleted_at IS NULL` em todas as queries SQL do backend, delegando ao banco a responsabilidade de omitir registros excluídos por padrão.

### 2. Mecanismo de Soft Delete e Rastreamento de Datas
* **O que foi dito:** Que as operações de remoção no backend executavam deleções físicas e faltavam campos de justificativa e data do falecimento.
* **A Realidade:** A migração de banco de dados `20260530012620_remote_schema.sql` define regras PostgreSQL que reescrevem o comando SQL `DELETE` padrão:
  ```sql
  CREATE RULE "soft_delete_pessoa" AS
      ON DELETE TO "public"."pessoa" DO INSTEAD  
      UPDATE "public"."pessoa" SET "status" = 'Inativo', "deleted_at" = now()
      WHERE ("pessoa"."id" = "old"."id");
  ```
  O banco intercepta o `DELETE` do repositório de forma transparente e executa o `UPDATE` lógico, gravando o timestamp exato do request em `deleted_at`. 
* **Veredito:** Uma vez que **não há requisito para armazenar motivos específicos** e que a data de inativação/óbito equivale ao momento do request, a coluna `deleted_at` assume perfeitamente o papel de "data de falecimento" ou "data de inativação" no momento do recadastro. Nenhuma tabela, coluna ou rota extra precisa ser criada.

### 3. Histórico de Ocupação e `data_saida`
* **O que foi dito:** Que o relacionamento de histórico de moradia/pessoas não retornava a data de encerramento do vínculo.
* **A Realidade:** Os endpoints de histórico (`/api/familias/{id}/pessoas/historico` e `/api/familias/{id}/moradias/historico`) utilizam o mapeamento dos repositories que inclui explicitamente o campo `data_saida`.
* **Veredito:** O rastreamento de entrada e saída de famílias nos imóveis e de pessoas nas famílias está completo e funcional.

---

## ⚠️ Detalhamento dos Problemas Reais (Gargalos Arquiteturais)

### 1. Omissão dos Grupos Prioritários no Código
* **O Gargalo:** O Supabase possui as tabelas `grupo_prioritario` e `pessoa_grupo_prioritario`. Contudo, o backend ignora completamente esses dados. O DTO de cadastro de dependentes e responsáveis não possui campos para grupos, inviabilizando o preenchimento de marcadores como "Idoso", "PCD", etc.
* **Solução:** Alterar os DTOs de cadastro de pessoa e reescrever a transação do `FamiliaService.cadastrarNucleoFamiliar` para inserir os vínculos na tabela `pessoa_grupo_prioritario`.

### 2. Validações de Negócio Ausentes no Fluxo de Desvínculo
* **O Gargalo:** Ao deletar uma pessoa (`DELETE /api/pessoas/{id}`), o sistema inativa o registro mas não verifica se o indivíduo é o **responsável ativo** de uma família ativa. Se for, a família ficará órfã de responsável, violando as regras do WAD.
* **Solução:** Inserir checagens de integridade no `PessoaService.remover` e `FamiliaService.removerMoradia` antes de executar a exclusão lógica.

---

## 🔄 Recomendações de Ação Imediata

### 1. Manter o Fluxo de Soft Delete via DELETE SQL
- Como não há metadados de justificativa a serem coletados, a rota genérica `DELETE` enviada pelo Frontend e processada por regras de banco (triggers/rewrites) é **altamente recomendada** por ser simples, elegante e seguir o padrão RESTful.

### 2. Implementar Endpoint Unificado `PUT /api/familias/{id}/cadastro-completo`
- Em vez de forçar o Frontend a rodar três chamadas sequenciais para atualizar o cadastro anual (expondo o fluxo a falhas de rede), crie uma rota transacionada única semelhante à de criação (`cadastrarNucleoFamiliar`).

### 3. Integrar Grupos Prioritários nas Transações
- Adicionar um array de `gruposPrioritarios` (contendo os IDs do banco) na criação de pessoas e implementar a inserção em lote na tabela `pessoa_grupo_prioritario`.
