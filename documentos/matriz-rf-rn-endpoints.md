# Matriz RF - RN - Endpoint

Esta matriz conecta os Requisitos Funcionais (RF), as User Stories de origem, as Regras de Negocio (RN) associadas e os endpoints propostos para a WebAPI do GeoRisco Santo Andre.

> Status: matriz proposta a partir do WAD e dos fluxos UML atualizados.

| RF | US Origem | RN associadas | Endpoint(s) | Metodo(s) | Atores | Objetivo | Status |
|---|---|---|---|---|---|---|---|
| RF001 | US01 | RN01 | `/api/cadastros-completos`<br>`/api/familias/{id_familia}/cadastro-completo` | POST<br>GET, PUT | A01, A03 | Cadastrar e consultar dados sociodemograficos de cidadaos vinculados a familia e a ocupacao atual da moradia. | Proposto |
| RF002 | US02 | RN04 | `/api/cadastros-completos`<br>`/api/familias/{id_familia}/cadastro-completo` | POST<br>GET, PUT | A01, A03 | Cadastrar e atualizar caracteristicas estruturais da moradia, localizacao e fotos permitidas do imovel. | Proposto |
| RF003 | US05 | RN04 | `/api/cadastros-completos`<br>`/api/familias/{id_familia}/cadastro-completo` | POST<br>PUT | A01 | Persistir coordenadas capturadas por GPS ou preenchidas manualmente, inclusive apos sincronizacao offline. | Proposto |
| RF004 | US03 | - | `/api/moradias/mapa`<br>`/api/moradias/{id_moradia}/consulta-integrada` | GET<br>GET | A02, A03 | Retornar marcadores georreferenciados e dados resumidos/completos para exibicao no mapa. | Proposto |
| RF005 | US04 | RN01, RN05 | `/api/moradias/{id_moradia}/consulta-integrada` | GET | A02, A03 | Consolidar moradia, localizacao, familia, responsavel, moradores, pets, fotos, prioridade e flag de risco critico. | Proposto |
| RF006 | US06 | - | `/api/moradias`<br>`/api/moradias/exportar` | GET<br>GET | A02, A03 | Filtrar moradias e assistidos por status, vulnerabilidades, ocupacao, recadastro e demais criterios operacionais. | Proposto |
| RF007 | US07 | - | `/api/cadastros-completos`<br>`/api/familias/{id_familia}/pets`<br>`/api/pets/{id_pet}` | POST<br>GET, POST<br>PUT | A01, A02, A03 | Cadastrar, consultar e atualizar animais de estimacao vinculados a familia. | Proposto |
| RF008 | US08 | RN01 | `/api/indicadores/mapa-calor` | GET | A02, A03 | Retornar dados agregados por localizacao e vulnerabilidade para renderizacao do mapa de calor. | Proposto |
| RF009 | US09 | RN03 | `/api/moradias/{id_moradia}/status`<br>`/api/familias/{id_familia}/realocacoes` | PATCH<br>POST | A03 | Inativar logicamente moradias e, quando houver ocupacao ativa, exigir realocacao ou encerramento do vinculo atual. | Proposto |
| RF010 | US10 | RN03 | `/api/cidadaos/{id_cidadao}/arquivar`<br>`/api/familias/{id_familia}/responsavel` | PATCH<br>PUT | A02, A03 | Arquivar logicamente morador falecido e substituir responsavel familiar quando necessario. | Proposto |
| RF011 | US11 | RN02 | `/api/indicadores/recadastro`<br>`/api/moradias?desatualizado=true` | GET<br>GET | A02, A03 | Identificar cadastros sem atualizacao ha mais de 365 dias e exibir total/lista de pendencias. | Proposto |
| RF012 | US12 | RN02, RN04 | `/api/familias/{id_familia}/cadastro-completo`<br>`/api/indicadores/recadastro` | GET, PUT<br>GET | A01, A02, A03 | Permitir revisao anual do cadastro e atualizar indicadores apos salvamento e sincronizacao. | Proposto |

## Observacoes

- As US13 e US14 definem regras de integridade cadastral, mas ainda nao aparecem como RFs formais na tabela de requisitos.
- Essas regras tratam de dois pontos: familia ativa deve possuir responsavel ativo; familia ativa deve possuir moradia ativa vinculada.
- Elas sao atendidas de forma transversal pelos endpoints `/api/familias/{id_familia}/responsavel`, `/api/familias/{id_familia}/realocacoes`, `/api/moradias/{id_moradia}/status` e `/api/familias/{id_familia}/cadastro-completo`.
- Os endpoints estao marcados como `Proposto` porque a documentacao de WebAPI ainda precisa ser validada contra a implementacao real do backend.
