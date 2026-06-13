# Defesa Civil - Cadastro e Consulta de Pessoas

## Visao geral
Este projeto implementa o fluxo de **cadastramento de pessoas** e **listagem** para o sistema da Defesa Civil, com foco em integridade, padronizacao de dados e auditoria. O modelo segue a proposta de rastreabilidade total via relacionamento com o nucleo familiar e uso extensivo de enums para dados sociodemograficos.

### Relacao com a proposta da Defesa Civil
- A entidade central e a `Familia`, garantindo que pessoas e outros membros do nucleo sejam movidos logicamente em bloco.
- O cadastro prioriza campos obrigatorios para gerar estatisticas confiaveis do municipio.
- A listagem reforca a visibilidade de dados criticos para acao rapida em emergencias.

### Justificativa para a escolha do fluxo
> Pessoa, unida a familia e representante, compõe a base principal para o funcionamento do nosso sistema. Os agentes de campo vão primeiramente observar as pessoas. 
> Sendo assim, essa entidade se torna uma das mais importantes e por isso, o fluxo de cadastro e listagem de pessoas se torna a escolha mais lógica para o inicio da implementação.
> As regras de negócio apresentadas são essenciais para garantir a integridade dos dados e o preenchimento correto do formulário.
> Outro ponto que me motivou a escolher esse fluxo é o fato de não ser necessário adicionar muitas tabelas que se relacionam logo no primeiro momento,
> o que me permite fazer uma implementação ágil e focada (dentro do tempo da ponderada também). Para essa ponderada optei por uma implementação simplificada implementando apenas o essencial.
> Aproveitei que o professor apresentou a possibilidade de fazer uma view e já a criei, conectando com o BD. As prints de execução estão na pasta assets em documents.


## O que foi implementado
- Cadastro de pessoa com validacoes de regras de negocio (RN01, RN02, RN03, RN04, RN05).
- Listagem de pessoas via view (GET `/pessoas`) e endpoint JSON (GET `/pessoas.json`).
- Relacionamento com `Familia` por FK (`pessoas.familia_id`).
- Views simples para cadastro e listagem com CSS compartilhado.

## Regras de negocio cobertas
- **RN01:** Identificacao base obrigatoria (nome e data de nascimento).
- **RN02:** Escolaridade e situacao ocupacional obrigatorias.
- **RN03:** Parentesco obrigatorio.
- **RN04:** Medicacao e cronico obrigatorios (nao aceitam nulo).
- **RN05:** Nome social opcional.

## Testes
- **Unitarios (controller):** validacoes de payload, renderizacao de views e fluxo de cadastro.
- **Integracao (DB):** tentativa de cadastro invalido nao persiste dados (RN01).

### Teste de RN violada com payload invalido + persistencia
- Arquivo: `src/tests/pessoa.persistence.spec.ts`
- Regra: RN01
- Payload invalido: `nome` vazio e `dataDeNascimento` nulo
- Verificacao: contagem de registros permanece igual

## Matriz de requisitos
| Requisito funcional | Requisito nao funcional | Teste |
| --- | --- | --- |
| Cadastro de pessoa | Integridade e consistencia de dados | `src/controllers/pessoa.controller.spec.ts` (validacao e cadastro) |
| Cadastro de pessoa | Rastreabilidade e auditoria | `src/tests/pessoa.persistence.spec.ts` (nao persiste payload invalido) |
| Listagem de pessoas | Disponibilidade e clareza de informacao | `src/controllers/pessoa.controller.spec.ts` (renderizacao da view) |

## Comandos
### Migracoes
```zsh
npm run migrate
```

### Testes
```zsh
npm test
```

## Notas
- O teste de integracao exige `DATABASE_URL` configurada e as migracoes executadas.
- O `nomeSocial` foi ajustado para aceitar `NULL` conforme RN05.
- Estão incluidos alguns prints do funcionamento das diversas implementações aplicadas nessa ponderada na pasta "document/assets".

