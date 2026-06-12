# Análise de Cobertura de Fluxos UML - Seção 3.2.4 do WAD

## Resumo Executivo
✅ **RESULTADO: TODOS OS 12 FLUXOS ESTÃO REFERENCIADOS**

A seção 3.2.4 do WAD documenta 12 fluxos de interação do sistema, e o arquivo de diagramas de sequência UML (`fluxos_diagramas_de_sequencia_UML.txt`) contém todos os 12 fluxos em formato Mermaid/PlantUML.

---

## Matriz de Correspondência

| # | Fluxo no WAD | Diagrama no Arquivo UML | Status |
|---|---|---|---|
| 1 | FL01 - Cadastro de Pessoa e Vínculo à Moradia | FL01_Cadastro_Completo_Familia_Moradia | ✅ Presente |
| 2 | FL02 - Visualização de Moradias em Mapa Georreferenciado | FL02_Mapa_Georreferenciado_Gestor | ✅ Presente |
| 3 | FL03 - Consulta integrada de moradia e moradores | FL03_Consulta_Integrada_Moradia_Moradores | ✅ Presente |
| 4 | FL04 - Filtros avançados de moradias e assistidos | FL04_Filtros_Avancados_Exportacao | ✅ Presente |
| 5 | FL05 - Atualização anual de dados pelo agente de campo | FL05_Atualizacao_Anual_Dados | ✅ Presente |
| 6 | FL06 - Cadastro e manutenção de pets vinculados à família | FL06_Cadastro_Manutencao_Pets | ✅ Presente |
| 7 | FL07 - Mapa de calor e indicadores de vulnerabilidade | FL07_Mapa_Calor_Indicadores | ✅ Presente |
| 8 | FL08 - Arquivamento lógico de moradia | FL08_Arquivamento_Moradia | ✅ Presente |
| 9 | FL09 - Arquivamento lógico de morador falecido | FL09_Arquivamento_Morador_Falecido | ✅ Presente |
| 10 | FL10 - Alerta automático de recadastro a cada 12 meses | FL10_Alerta_Automatico_Recadastro | ✅ Presente |
| 11 | FL11 - Regra transversal de Risco Crítico (RN05) | FL11_Regra_Transversal_Risco_Critico | ✅ Presente |
| 12 | FL12 - Validação transversal de integridade cadastral | FL12_Integridade_Familia_Responsavel_Ocupacao | ✅ Presente |

---

## Detalhamento por Fluxo

### 1. **FL01 - Cadastro de Pessoa e Vínculo à Moradia**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL01_Cadastro_Completo_Familia_Moradia`
- **Descrição**: Jornada de cadastro do agente de campo com captura de GPS, validação de fotos e integridade familiar

### 2. **FL02 - Visualização de Moradias em Mapa Georreferenciado**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL02_Mapa_Georreferenciado_Gestor`
- **Descrição**: Consulta de moradias ativas no mapa com renderização de pins e cards informativos
- **Nota**: WAD menciona que RN05 (Risco Crítico) não está totalmente implementado

### 3. **FL03 - Consulta integrada de moradia e moradores**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL03_Consulta_Integrada_Moradia_Moradores`
- **Descrição**: Busca e exibição de dados integrados de moradias, ocupação, família e moradores

### 4. **FL04 - Filtros avançados de moradias e assistidos**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL04_Filtros_Avancados_Exportacao`
- **Descrição**: Aplicação de filtros combinados com suporte a exportação CSV/PDF

### 5. **FL05 - Atualização anual de dados pelo agente de campo**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL05_Atualizacao_Anual_Dados`
- **Descrição**: Recadastro anual com sincronização offline e tratamento de mudanças de moradia

### 6. **FL06 - Cadastro e manutenção de pets vinculados à família**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL06_Cadastro_Manutencao_Pets`
- **Descrição**: Operações CRUD de animais de estimação vinculados à família, não à moradia

### 7. **FL07 - Mapa de calor e indicadores de vulnerabilidade**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL07_Mapa_Calor_Indicadores`
- **Descrição**: Geração e visualização de clusters térmicos com filtros por grupos prioritários

### 8. **FL08 - Arquivamento lógico de moradia**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL08_Arquivamento_Moradia`
- **Descrição**: Soft delete de moradias com validação de ocupação ativa e realocação

### 9. **FL09 - Arquivamento lógico de morador falecido**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL09_Arquivamento_Morador_Falecido`
- **Descrição**: Inativação de pessoa com substituição obrigatória de responsável

### 10. **FL10 - Alerta automático de recadastro a cada 12 meses**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL10_Alerta_Automatico_Recadastro`
- **Descrição**: Job diário que detecta moradias com 365+ dias sem atualização (RN02)
- **Nota**: WAD menciona que modelo físico não define tabela NOTIFICACAO; alerta é indicador derivado

### 11. **FL11 - Regra transversal de Risco Crítico (RN05)**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL11_Regra_Transversal_Risco_Critico`
- **Descrição**: Regra transversal aplicada durante carregamento de moradias (FL02, FL03, FL04, FL05, FL07, FL09)
- **Condição**: `historico_ocorrencia=true` E (mobilidade reduzida OU acamado)

### 12. **FL12 - Validação transversal de integridade cadastral**
- **No WAD**: ✅ Documentado com descrição completa (seção 3.2.4)
- **Nos Diagramas UML**: ✅ Presente como `FL12_Integridade_Familia_Responsavel_Ocupacao`
- **Descrição**: Validação aplicada em operações de cadastro, atualização, arquivamento e realocação
- **Regras**: Família ativa deve ter responsável ativo e moradia ativa (US13, US14)

---

## Conclusões

### ✅ Pontos Positivos
1. **100% de cobertura**: Todos os 12 fluxos descritos no WAD possuem diagramas UML correspondentes
2. **Nomenclatura consistente**: Os IDs dos fluxos (FL01-FL12) são mantidos em ambos os documentos
3. **Documentação dupla**: Cada fluxo é descrito tanto em Mermaid (WAD) quanto em PlantUML (arquivo separado)
4. **Rastreabilidade clara**: Vinculação explícita entre regras de negócio (RN), user stories (US) e fluxos

### ⚠️ Observações do WAD
1. **RN05 não completamente implementado**: Falta tabela `historico_ocorrencia` no banco (FL02, FL11)
2. **Notificação sem tabela**: FL10 menciona que modelo físico não define tabela NOTIFICACAO
3. **Dois diagramas para alguns fluxos**: Alguns fluxos têm versão em Mermaid (WAD) e PlantUML (arquivo separado)

### 📋 Recomendações
1. Manter sincronismo entre atualizações do WAD e do arquivo de diagramas UML
2. Implementar tabela `historico_ocorrencia` para completar RN05
3. Considerar adicionar tabela NOTIFICACAO se sistema de alertas crescer
4. Documentar em um arquivo de rastreabilidade (traceability matrix) a vinculação RFs → RNs → Fluxos

---

## Artefatos Relacionados

- **WAD - Seção 3.2.4**: `/documentos/wad.md` (linhas 543+)
- **Diagramas UML**: `/documentos/outros/diagramas_sequencia/fluxos_diagramas_de_sequencia_UML.txt`
- **Requisitos Funcionais**: Documentados em seção 3.1.2 do WAD
- **Regras de Negócio**: Documentadas em seção 3.1.3 do WAD

---

**Documento gerado em**: 2026-06-10  
**Verificação realizada por**: GitHub Copilot
