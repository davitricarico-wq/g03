<img src="../assets/logointeli.png">


# WAD - Web Application Document - Módulo 2 - Inteli

**_Os trechos em itálico servem apenas como guia para o preenchimento da seção. Por esse motivo, não devem fazer parte da documentação final_**

## Nome do Grupo

#### Nomes dos integrantes do grupo



## Sumário

[1. Introdução](#c1)

[2. Visão Geral da Aplicação Web](#c2)

[3. Projeto Técnico da Aplicação Web](#c3)

[4. Desenvolvimento da Aplicação Web](#c4)

[5. Testes da Aplicação Web](#c5)

[6. Estudo de Mercado e Plano de Marketing](#c6)

[7. Conclusões e trabalhos futuros](#c7)

[8. Referências](c#8)

[Anexos](#c9)

<br>


# <a name="c1"></a>1. Introdução (sprints 1 a 5)

O município de Santo André enfrenta desafios críticos na gestão de populações em áreas de risco. Com mapa de risco estratificado em zonas amarelas (monitoramento), laranja (área de risco) e vermelho (área de muito risco), o município identifica constantemente famílias vulneráveis que necessitam de proteção. Contudo, o processo de coleta de dados em campo é lento, descentralizado e sem registro geolocalizado integrado. Quando desastres ou eventos extremos ocorrem, agentes da Defesa Civil precisam evacuar famílias rapidamente, mas enfrentam dificuldades: não há rastreamento unificado de retiradas, entrada em abrigos ou quantidade de pessoas por território. Isso compromete a resposta ágil, gera perda de informação entre etapas e dificulta o suporte da sede em tempo real.

Como resposta, foi desenvolvido o GeoRisco Santo André: aplicação web offline-first focada no cadastro georreferenciado rápido de casas e pessoas em áreas de risco. O MVP permite que agentes em campo preencham formulários concisos via mobile, com sistema híbrido de geolocalização (CEP, coordenadas, referências e fotos de imóvel), funcionando mesmo sem GPS preciso. Dados sincronizam automaticamente quando conectado. O sistema registra retiradas de famílias e entrada em abrigos no momento do incidente, e um painel desktop oferece visualização geolocalizada para a sede monitorar densidade de pessoas por território.

Os aspectos essenciais para criação de valor incluem: redução do tempo crítico de coleta em cenários de desastre, eliminação de gaps operacionais entre retirada e abrigo, visão estratégica em tempo real para alocação de recursos, e arquivamento de cadastros para manter integridade da base. A solução substitui sistemas desatualizados e fortalece a capacidade de resposta e resiliência urbana de Santo André.

Este projeto será desenvolvido em parceria com a Defesa Civil de Santo André, incorporando sua experiência operacional e validação contínua das funcionalidades entregues.


### V1
O município de Santo André enfrenta desafios críticos na gestão de populações em áreas de risco. Com mapa de risco estratificado em zonas amarelas (monitoramento), laranja (área de risco) e vermelho (área de muito risco), o município identifica constantemente famílias vulneráveis que necessitam de proteção. Contudo, o processo de coleta de dados em campo é lento, descentralizado e sem registro geolocalizado integrado. Quando desastres ou eventos extremos ocorrem, agentes da Defesa Civil precisam evacuar famílias rapidamente, mas enfrentam dificuldades: não há rastreamento unificado de retiradas, entrada em abrigos ou quantidade de pessoas por território. Isso compromete a resposta ágil, gera perda de informação entre etapas e dificulta o suporte da sede em tempo real.

Como resposta, foi desenvolvido o GeoRisco Santo André: aplicação web offline-first focada no cadastro georreferenciado rápido de casas e pessoas em áreas de risco. O MVP permite que agentes em campo preencham formulários concisos via mobile, com sistema híbrido de geolocalização (CEP, coordenadas, referências e fotos de imóvel), funcionando mesmo sem GPS preciso. Dados sincronizam automaticamente quando conectado. O sistema registra retiradas de famílias e entrada em abrigos no momento do incidente, e um painel desktop oferece visualização geolocalizada para a sede monitorar densidade de pessoas por território.

Os aspectos essenciais para criação de valor incluem: redução do tempo crítico de coleta em cenários de desastre, eliminação de gaps operacionais entre retirada e abrigo, visão estratégica em tempo real para alocação de recursos, e arquivamento de cadastros para manter integridade da base. A solução substitui sistemas desatualizados e fortalece a capacidade de resposta e resiliência urbana de Santo André.

Este projeto será desenvolvido em parceria com a Defesa Civil de Santo André, incorporando sua experiência operacional e validação contínua das funcionalidades entregues.

### V2
Muitas famílias em Santo André vivem em áreas de risco geográfico—encostas, regiões sujeitas a alagamentos, áreas informais. Frequentemente, essas casas não têm formalização legal (invasões, ocupações), o que dificulta ainda mais o acesso a informações sobre quem mora onde. Quando chuvas intensas ou desastres ameaçam, a Defesa Civil precisa saber rapidamente: quantas pessoas estão em risco? Quem são os idosos, crianças, gestantes que precisam de prioridade? Onde exatamente as casas ficam? Atualmente, essas informações estão espalhadas em documentos de papel, planilhas desorganizadas ou sistemas antigos. O tempo é crítico em uma emergência, e essas falhas custam vidas.

Como resposta, foi desenvolvido o GeoRisco Santo André: uma aplicação web que permite à Defesa Civil coletar, organizar e visualizar dados de famílias em áreas de risco de forma rápida e geolocalizada. Agentes em campo preenchem formulários digitais completos (nome, CPF, vulnerabilidades, composição da família) diretamente no celular ou tablet. O sistema captura automaticamente a localização (latitude, longitude, referências) e registra fotos das casas. Todos esses dados aparecem no mapa da cidade, integrados com as áreas de risco conhecidas, permitindo à sede ver em tempo real onde estão as pessoas em perigo e quem precisa de ajuda prioritária.

Os principais ganhos são: (1) formulários digitais e estruturados substituem anotações em papel e inconsistências; (2) visualização geolocalizada permite entender exatamente quem está onde em relação às áreas de risco; (3) respostas rápidas em desastres porque a informação já está organizada; (4) registro automático de evacuações e abrigos integra todo o ciclo de emergência. A solução torna possível que a Defesa Civil realmente saiba quem precisa de proteção.

# <a name="c2"></a>2. Visão Geral da Aplicação Web (sprint 1)

## 2.1. Escopo do Projeto (sprints 1 e 4)

### 2.1.1. Modelo de 5 Forças de Porter (sprint 1)

<div align="center">
    <p>Figura 1: 5 Forças de Porter</p>
    <img src="outros/porter.png" width="500">
    <p>Feito pela própria equipe (2026)</p>
</div>

<h2 align="center" id="strengths">Rivalidade Entre Concorrentes</h2>



<h2 align="center" id="strengths">Poder de Barganha: Fornecedores</h2>



<h2 align="center" id="strengths">Poder de Barganha: Clientes</h2>

O Poder de Barganha dos Clientes, seguindo o modelo das Cinco Forças de Porter, analisa a influência que os consumidores possuem sobre as empresas do setor, especialmente em relação a preços, qualidade, variedade e condições de compra. Quanto maior a oferta de alternativas disponíveis no mercado, maior tende a ser o poder de negociação dos clientes. 

Aplicando a força de barganha dos clientes do modelo de Cinco Forças de Porter ao contexto apresentado, os moradores de Santo André exercem um poder de barganha moderado a alto sobre a Defesa Civil, mesmo sem uma relação comercial direta envolvendo valores.

Por um lado, esse poder é limitado, pois a população depende fortemente dos serviços prestados em situações de risco, como enchentes e deslizamentos, não havendo alternativas viáveis. Por outro lado, esse poder se fortalece devido à capacidade de pressão social e política que os cidadãos possuem, podendo cobrar melhorias por meio de reclamações, mídia ou mobilização junto ao poder público.

Além disso, o funcionamento eficaz do sistema proposto depende diretamente da colaboração dos moradores na coleta de dados, o que amplia ainda mais sua influência: caso haja resistência, desconfiança ou insatisfação com o uso das informações, a qualidade e a efetividade do sistema podem ser comprometidas. Dessa forma, mesmo sem poder econômico direto, os moradores exercem influência significativa sobre o sucesso da solução.


<h2 align="center" id="strengths">Ameaça de Novos Entrantes</h2>



<h2 align="center" id="strengths">Ameaça de Substitutos</h2>

### 2.1.2. Análise SWOT da Instituição Parceira (sprint 1)

<div align="center">
    <p>Figura 2: Análise Swot</p>
    <img src="outros/swot.png" width="500">
    <p>Feito pela própria equipe (2026)</p>
</div>

<h2 align="center" id="strengths">Strengths</h2>


<h2 align="center" id="weaknesses">Weaknesses</h2>

A **base histórica de dados** apresenta limitações importantes, pois pode conter informações incompletas, inconsistentes ou desatualizadas, especialmente quando oriunda de registros físicos ou sistemas legados. Isso compromete a confiabilidade inicial do georreferenciamento e pode impactar a qualidade das análises e decisões tomadas a partir desses dados.

Além disso, a **dependência de conectividade** é um fator crítico, já que a aplicação web pode ter seu desempenho reduzido em áreas com baixa cobertura de internet, comuns em regiões de risco. Soma-se a isso a **curva de aprendizado das equipes de campo**, que podem enfrentar dificuldades na adoção do sistema.

Por fim, há riscos relacionados à **manutenção e atualização contínua**. A ausência de processos estruturados pode levar à obsolescência dos dados, enquanto a **dependência de uma equipe técnica** reduzida pode gerar sobrecarga e atrasos em correções ou melhorias.

<h2 align="center" id="opportunities">Opportunities</h2>


<h2 align="center" id="threats">Threats</h2>

Entre as ameaças, destaca-se a **descontinuidade administrativa**, que pode comprometer o projeto em caso de mudanças políticas ou redução de investimentos e impactar diretamente a sustentabilidade e evolução da solução ao longo do tempo.

Outro ponto crítico envolve questões legais, especialmente no que se refere à **proteção de dados sensíveis**. A não conformidade com a Lei Geral de Proteção de Dados pode resultar em restrições operacionais ou até a interrupção do sistema, além de afetar a confiança dos usuários.

Riscos como a **baixa adesão da comunidade** também dificultam a coleta de dados, além da ocorrência de **eventos extremos**, comprometendo toda a infraestrutura. Por fim, **ameaças de cibersegurança** podem expor informações estratégicas, gerando impactos significativos.


### 2.1.3. Solução (sprints 1 a 5)

1. Problema a ser resolvido

A Defesa Civil de Santo André enfrenta desafios na gestão ágil de populações em áreas de risco. Coleta de dados em campo é lenta e descentralizada. Não há registro geolocalizado integrado de evacuações, retiradas de famílias ou entrada em abrigos. Agentes precisam identificar imóveis com segurança em cenários de risco, e a Defesa Civil necessita visualizar geograficamente onde as pessoas foram realocadas.

2. Dados disponíveis (mencionar fonte e conteúdo; se não houver, indicar “não se aplica”)

Ficha SDUH, Formulário SUAS, Fichas de Resgate de Animais e Aves, Formulário de Bens sob Guarda, mapas de risco municipal (amarelo, laranja ou vermelho conforme critérios de terreno, disponível no SIGA), referências geográficas e estudos de vulnerabilidade. Dados fictícios coerentes serão utilizados para testes, garantindo conformidade com LGPD e Termo de Confidencialidade.

3. Solução proposta

GeoRisco Santo André: aplicação web offline-first com geolocalização multimodal usando CEP, coordenadas, referências geográficas e fotos de imóvel. MVP focado em cadastro rápido por casa com múltiplas pessoas por registro. Inclui captura de nome, CPF, idade e vulnerabilidades; registro integrado de retirada e entrada em abrigos; sincronização automática; painel geolocalizado para visualizar densidade de pessoas por território.

4. Forma de utilização da solução

Agentes preenchem formulário mobile conciso em campo com funcionalidade offline. Sistema salva localmente e sincroniza quando conectado. Registram: localização por CEP, coordenadas, referências e fotos de imóvel, composição da casa, vulnerabilidades, retirada e abrigo. Painel desktop exibe mapa geolocalizado com cadastros, filtros por setor de risco, densidade de pessoas e gera relatórios georreferenciados para análise de contingência.

5. Benefícios esperados

Reduz tempo crítico de coleta permitindo cadastro rápido em campo. Geolocalização multimodal funciona sem GPS preciso. Registro integrado de retirada e abrigo elimina gaps operacionais. Painel geolocalizado oferece visão estratégica em tempo real à Defesa Civil e sede. Arquivamento de cadastros mantém base íntegra. Substitui sistemas desatualizados, fortalecendo resiliência urbana.

6. Critério de sucesso e como será avaliado

Sucesso medido por KPIs nas sprints iniciais: tempo de preenchimento inferior a cinco minutos por casa, sincronização offline e online, precisão de localização, taxa de conclusão sem erros, usabilidade com agentes de tecnologia média. Validação com operadores em campo, testes de visualização de sede, exportação de relatórios. Métricas finalizadas com parceiro durante o projeto.

<<<<<<< HEAD
=======

>>>>>>> c4152fd2f69304e8e2da823f0b4cfa4611fd8ec1
### 2.1.4. Value Proposition Canvas (sprint 1): 
*Sem limite de palavras – usar template do curso*

*Elaborar o Value Proposition Canvas com base na proposta de solução definida.*

### 2.1.5. Matriz de Riscos do Projeto (sprint 1)

*Sem limite de palavras – usar template do curso*

*Registre na matriz os riscos identificados no projeto.*

## 2.2. Personas (sprint 1)

*Posicione aqui suas Personas em forma de texto markdown com imagens, ou como imagem de template preenchido. Atualize esta seção ao longo do módulo se necessário.*

## 2.3. User Stories (sprints 1 a 5)

*Posicione aqui a lista de User Stories levantadas para o projeto. Siga o template de User Stories e utilize a mesma referência USXX no roadmap de seu quadro Kanban. Indique todas as User Stories mapeadas, mesmo aquelas que não forem implementadas ao longo do projeto. Não se esqueça de explicar o INVEST das 5 User Stories prioritárias*

*ATUALIZE ESTA SEÇÃO SEMPRE QUE ALGUMA DEMANDA MUDAR EM SEU PROJETO*

*Template de User Story*
Identificação | USXX (troque XX por numeração ordenada das User Stories)
--- | ---
Persona | nome da Persona
User Story | "como (papel/perfil), posso (ação/meta), para (benefício/razão)"
Critério de aceite 1 | CR1: descrever cenário + testes de aceite
Critério de aceite 2 | CR2: descrever cenário + testes de aceite
Critério de aceite ... | CR...
Critérios INVEST | *(Por que é Independente? Por que é Negociável? Por que é Valorosa? Por que é Estimável? Por que é Pequena? Por que é Testável?)*

# <a name="c3"></a>3. Projeto da Aplicação Web (sprints 1 a 5)

## 3.1. Requisitos do Sistema (sprints 1 a 5)

*Esta seção formaliza o que o sistema deve fazer, sob quais regras e com quais qualidades. Atualize a cada sprint conforme os requisitos evoluem.*

### 3.1.1 Lista de Atores

| ID  | Nome do Ator                           | Descrição                                                                                                                                                                                                                                                                                                          | Frequência de Uso | Proficiência Tecnológica |
|-----|----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|--------------------------|
| A01 | Agente de Defesa Civil (Campo)         | Responsável por coletar dados georreferenciados in loco, realizar vistorias em áreas de risco e alimentar o sistema com informações de interdições ou rotas obstruídas.                                                                                                                                            | Diária            | Média/Alta               |
| A02 | Agente de Defesa Civil (Visualização)  | Responsável por visualizar todas as informações coletadas e gerar relatórios a partir delas.                                                                                                                                                                                                                       | Diário            | Média/Alta               |
| A03 | Agente de Defesa Civil (Administração) | Responsável por gerenciar os parâmetros de monitoramento e extrair relatórios, análises e mapas de calor gerados automaticamente pela plataforma. Sua função é interpretar essas visões consolidadas de risco e vulnerabilidade para subsidiar a tomada de decisão e o planejamento de contingência da prefeitura. | Diária            | Média/Alta               |

### 3.1.2. Requisitos Funcionais (sprint 1, refinar até sprint 5)

*Liste os RF numerados de forma objetiva e verificável. Cada RF deve poder ser convertido em caso de teste.*

| ID    | Nome                                        | Descrição                                                                                             | Tipo    | Prioridade | Atores  | Status    |
|-------|---------------------------------------------|-------------------------------------------------------------------------------------------------------|---------|------------|---------|-----------|
| RF001 | Cadastro Georreferenciado de Moradias       | Registro de edificações com coordenadas geográficas e classificação de risco (R1 a R4).               | 1       | 1          | A01,A03 | Planejado |
| RF002 | Cadastro de chefe de família                | Registro do responsável principal pelo núcleo familiar para fins de contato e auxílio.                | 1       | 1          | A01,A03 | Planejado |
| RF003 | Cadastro de membros do núcleo familiar      | Registro de todos os residentes do imóvel para cálculo de densidade populacional por área.            | 1       | 1          | A01,A03 | Planejado |
| RF004 | Cadastro de necessidades especiais          | Identificação de perfis prioritários (idosos, PCDs, gestantes) para o plano de evacuação.             | 1       | 1          | A01,A03 | Planejado |
| RF005 | Cadastro de abrigos                         | Registro de unidades de acolhimento, incluindo endereço, infraestrutura e capacidade total de leitos. | 1       | 3          | A03     | Planejado |
| RF006 | Gerenciamento de moradias                   | Interface para edição, suspensão ou exclusão de registros de imóveis no sistema.                      | 4, 5    | 1          | A01,A03 | Planejado |
| RF007 | Gerenciamento de familias                   | Controle e histórico de vínculos familiares vinculados a uma ou mais moradias.                        | 4, 5    | 1          | A01,A03 | Planejado |
| RF008 | Gerenciamento de membros do núcleo familiar | Edição de dados individuais dos dependentes e histórico de saúde/vulnerabilidade.                     | 4, 5    | 1          | A01,A03 | Planejado |
| RF009 | Gerenciamento de chefe de família           | Atualização de dados de contato e substituição do responsável pelo núcleo familiar.                   | 4, 5    | 1          | A01,A03 | Planejado |
| RF010 | Gerenciamento de abrigos                    | Interface CRUD para edição de dados cadastrais, inativação ou atualização estrutural dos abrigos.     | 4, 5    | 3          | A02     | Planejado |
| RF011 | Controle de ocupação de abrigos             | Monitoramento em tempo real de vagas, leitos disponíveis e triagem de entrada (SUAS).                 | 4       | 3          | A02     | Planejado |
| RF012 | Gestão de estoque humanitário               | Registro e baixa de doações, cestas básicas e materiais de primeira necessidade.                      | 1, 4, 5 | 3          | A02     | Planejado |
| RF013 | Geração de mapas de calor                   | Processamento automático de densidade de riscos e vulnerabilidades sobre o mapa da cidade.            | 2       | 2          | A02,A03 | Planejado |
| RF014 | Geração de relatórios                       | Consolidação de dados estatísticos em documentos (PDF) para análise de gestão.                        | 2       | 2          | A02,A03 | Planejado |
| RF015 | Exportação dos dados                        | Extração de bases em formatos abertos (CSV/PDF) para integração com órgãos externos.                  | 2       | 3          | A02,A03 | Planejado |
| RF016 | Aviso anual de atualização dos dados        | Notificação automática via sistema/e-mail para revisão periódica das informações cadastrais.          | 6       | 3          | A02     | Planejado |

*Legenda* 
Tipo: 1 - cadastro (entrada), 2 - relatório (saída), 3 - consulta (leitura), 4 - atualização (edição), 5 - exclusão (remoção), 6 - outros.
Prioridade: 1 - muito importante, 2 - importante, 3 - descartável.

### 3.1.3. Regras de Negócio (sprint 1, refinar até sprint 5)

*Numere e redija as RN de forma implementável e testável. Toda RN deve ter pelo menos um teste automatizado associado a partir da sprint 3.*

| ID   | Descrição | RF associado |
|------|-----------|--------------|
| RN01 | ...       | RF001        |
| RN02 | ...       | RF001        |

### 3.1.4. Requisitos Não Funcionais — 8 Eixos ISO/IEC 25010 (sprints 1 a 5)

*Preencha os 8 eixos. Cada eixo deve ter ao menos um RNF verificável (com métrica, limite ou critério concreto) ou justificativa explícita de ausência. Evolua do conceitual (sprint 1) ao técnico mensurável (sprint 5).*

| Eixo                     | Requisito | Métrica / Critério | Como atendido |
|--------------------------|-----------|--------------------|---------------|
| USAB — Usabilidade       | ...       | ...                | ...           |
| CONF — Confiabilidade    | ...       | ...                | ...           |
| DES — Desempenho         | ...       | p95 < X ms         | ...           |
| SUP — Suportabilidade    | ...       | ...                | ...           |
| SEG — Segurança          | ...       | ...                | ...           |
| CAP — Capacidade         | ...       | ...                | ...           |
| REST — Restrições Design | ...       | ...                | ...           |
| ORG — Organizacionais    | ...       | ...                | ...           |

### 3.1.5. Matriz RF → RN → Endpoint (sprints 3 a 5)

*Matriz de cobertura mostrando quais RN e endpoints implementam cada RF.*

| RF    | RN associadas | Endpoint    | Método |
|-------|---------------|-------------|--------|
| RF001 | RN01, RN02    | `/usuarios` | POST   |

## 3.2. Arquitetura (sprints 1 a 5)

### 3.2.1. Diagrama de Arquitetura (sprints 3 e 4)

*Posicione aqui o diagrama de arquitetura da solução, indicando as camadas principais (Controller, Service, Repository, Model) e suas responsabilidades. Atualize sempre que necessário.*

### 3.2.2. Diagrama de Casos de Uso (sprint 1)

*Apresente o diagrama de casos de uso com atores (boneco), casos (elipse) e as relações `<<include>>` / `<<extend>>` com semântica correta. Consulte a notação de referência em `in02/suporte/use-case_3.0_v1.0.pdf`.*

### 3.2.3. Diagrama de Classes do Domínio (sprint 2)

*Diagrama UML de classes com entidades, atributos, relacionamentos e responsabilidades. Diferencie **associação**, **agregação** (losango vazio), **composição** (losango cheio) e **herança** (triângulo vazio). Multiplicidade explícita em toda associação.*

### 3.2.4. Diagrama de Sequência UML (sprint 3)

*Ao menos um fluxo prioritário, mostrando a interação entre as camadas Controller → Service → Repository → Banco. Linhas de vida verticais, ativação correta, mensagens síncronas e assíncronas diferenciadas, retornos tracejados.*

### 3.2.5. Diagrama de Atividades ou Estados (sprint 3)

*Ao menos um fluxo relevante em UML ou BPMN. Use a notação da ferramenta escolhida de forma consistente (sem misturar convenções).*

### 3.2.6. Diagrama de Implantação (sprints 4 e 5)

*Diagrama UML de deployment mostrando nós físicos, artefatos e canais de comunicação. Representa a visão Engineering + Technology do RM-ODP.*

### 3.2.7. Padrões de Projeto Aplicados (sprints 3 a 5)

*Documente os design patterns utilizados (Repository, Strategy, Factory, DTO etc.) e quais princípios SOLID se aplicam. Justifique a adoção de cada padrão com base em uma necessidade real do projeto.*

## 3.3. Wireframes (sprint 2)

*Posicione aqui as imagens do wireframe construído para sua solução e, opcionalmente, o link para acesso (mantenha o link sempre público para visualização)*

## 3.4. Guia de estilos (sprint 3)

*Descreva aqui orientações gerais para o leitor sobre como utilizar os componentes do guia de estilos de sua solução*

### 3.4.1 Cores

*Apresente aqui a paleta de cores, com seus códigos de aplicação e suas respectivas funções*

### 3.4.2 Tipografia

*Apresente aqui a tipografia da solução, com famílias de fontes e suas respectivas funções*

### 3.4.3 Iconografia e imagens 

*(esta subseção é opcional, caso não existam ícones e imagens, apague esta subseção)*

*posicione aqui imagens e textos contendo exemplos padronizados de ícones e imagens, com seus respectivos atributos de aplicação, utilizadas na solução*

## 3.5 Protótipo de alta fidelidade (sprint 3)

*posicione aqui algumas imagens demonstrativas de seu protótipo de alta fidelidade e o link para acesso ao protótipo completo (mantenha o link sempre público para visualização)*

## 3.6. Modelagem do banco de dados (sprints 2 e 4)

### 3.6.1. Modelo Entidade-Relacionamento (ER) (sprint 2)

*Apresente o modelo ER conceitual com entidades, atributos e relacionamentos. Use notação consistente (Chen ou Crow's Foot — não misture).*

### 3.6.2. Diagrama Entidade-Relacionamento (DER) (sprint 2)

*Posicione aqui o DER com cardinalidades explícitas em ambos os lados de cada relação e identificação de PK/FK. O DER deve ser coerente com o diagrama de classes (3.2.3).*

### 3.6.3. Modelo Relacional e Modelo Físico (sprints 2 e 4)

*Posicione aqui os diagramas de modelos relacionais do banco de dados, apresentando todos os esquemas de tabelas e suas relações. Inclua as migrations DDL numeradas e reproduzíveis (`CREATE TABLE`, `CREATE INDEX`, constraints `NOT NULL`, `UNIQUE`, `FOREIGN KEY`, `CHECK`). Utilize texto para complementar suas explicações quando necessário.*

### 3.6.4. Consultas SQL e lógica proposicional (sprint 2)

*posicione aqui uma lista de consultas SQL compostas, realizadas pelo back-end da aplicação web, com sua respectiva lógica proposicional, descrita conforme template abaixo. Lembre-se que para usar LaTeX em markdown, basta você colocar as expressões entre $ ou $$*

*Template de SQL + lógica proposicional*
#1 | ---
--- | ---
**Expressão SQL** | SELECT * FROM suppliers WHERE (state = 'California' AND supplier_id <> 900) OR (supplier_id = 100); 
**Proposições lógicas** | $A$: O estado é 'California' (state = 'California') <br> $B$: O ID do fornecedor não é 900 (supplier_id ≠ 900) <br> $C$: O ID do fornecedor é 100 (supplier_id = 100)
**Expressão lógica proposicional** | $(A \land B) \lor C$
**Tabela Verdade** | <table> <thead> <tr> <th>$A$</th> <th>$B$</th> <th>$C$</th> <th>$(A \land B)$</th> <th>$(A \land B) \lor C$</th> </tr> </thead> <tbody> <tr> <td>F</td> <td>F</td> <td>F</td> <td>F</td> <td>F</td> </tr> <tr> <td>F</td> <td>F</td> <td>V</td> <td>F</td> <td>V</td> </tr> <tr> <td>F</td> <td>V</td> <td>F</td> <td>F</td> <td>F</td> </tr> <tr> <td>F</td> <td>V</td> <td>V</td> <td>F</td> <td>V</td> </tr> <tr> <td>V</td> <td>F</td> <td>F</td> <td>F</td> <td>F</td> </tr> <tr> <td>V</td> <td>F</td> <td>V</td> <td>F</td> <td>V</td> </tr> <tr> <td>V</td> <td>V</td> <td>F</td> <td>V</td> <td>V</td> </tr> <tr> <td>V</td> <td>V</td> <td>V</td> <td>V</td> <td>V</td> </tr> </tbody> </table>

*Dica: edite a tabela verdade fora do markdown, para ter melhor controle*

## 3.7. WebAPI e endpoints (sprints 3 e 4)

*Utilize um link para outra página de documentação contendo a descrição completa de cada endpoint. Ou descreva aqui cada endpoint criado para seu sistema.* 

*Cada endpoint deve conter endereço, método (GET, POST, PUT, PATCH, DELETE), header, body, formatos de response e os status codes possíveis (200, 201, 204, 400, 401, 403, 404, 409, 422, 500).*

## 3.8. Autenticação, Autorização e Resiliência (sprint 5)

### 3.8.1. Autenticação

*Descreva o fluxo de autenticação implementado: persistência de senha com hash bcrypt/argon2 (parâmetros de custo explícitos e justificados), validação de credenciais e criação de sessão. Senhas em texto plano no banco não são aceitas.*

### 3.8.2. Controle de sessão

*Descreva o controle de sessão baseado em `session id` persistido em tabela própria, com expiração. Se optar por JWT, justifique a escolha explicando os trade-offs (stateless, não revogável, payload exposto).*

### 3.8.3. Autorização

*Descreva as regras de autorização por rota e por operação, baseadas no perfil do usuário autenticado. A verificação deve ocorrer no backend — o frontend nunca é fonte de verdade para autorização.*

### 3.8.4. Estratégias de Resiliência

*Descreva as estratégias aplicadas no tratamento de falhas de rede: timeout, retry com backoff exponencial, circuit breaker e idempotência em operações críticas (`PUT`, `DELETE`, operações de pagamento etc.).*

## 3.9. Matriz de Rastreabilidade (RTM) (sprints 3 a 5)

*A RTM consolida a rastreabilidade completa do sistema. Um elo quebrado invalida toda a cadeia — mantenha-a atualizada a cada sprint. A partir da sprint 3 não deve haver lacunas nos fluxos centrais.*

| Persona | RF    | RN   | Endpoint    | Tela     | Teste | Evidência        |
|---------|-------|------|-------------|----------|-------|------------------|
| ...     | RF001 | RN01 | `/usuarios` | Cadastro | CT02  | print, log, relatório de cobertura |

# <a name="c4"></a>4. Desenvolvimento da Aplicação Web

## 4.1. Primeira versão da aplicação web (sprint 3)

*Descreva e ilustre aqui o desenvolvimento da primeira versão do sistema web. Utilize prints de tela para ilustrar. Indique obrigatoriamente: (a) o que foi implementado, (b) o que não foi concluído, (c) dificuldades técnicas enfrentadas e próximos passos.*

## 4.2. Segunda versão da aplicação web (sprint 4)

*Descreva e ilustre aqui o desenvolvimento da segunda versão do sistema web, com foco no que foi consolidado entre a primeira versão funcional e o sistema operacional integrado. Utilize prints de tela para ilustrar. Indique obrigatoriamente: (a) o que foi implementado, (b) o que não foi concluído, (c) dificuldades técnicas enfrentadas e próximos passos.*

## 4.3. Versão final da aplicação web (sprint 5)

*Descreva e ilustre aqui o desenvolvimento da versão final do sistema web, com foco em refatorações, correções finais e na camada de autenticação/autorização entregue. Utilize prints de tela para ilustrar. Indique obrigatoriamente: (a) o que foi refinado ou adicionado desde a sprint 4, (b) pendências remanescentes, (c) dificuldades técnicas enfrentadas.*

# <a name="c5"></a>5. Testes

## 5.1. Relatório de testes de integração de endpoints automatizados (sprint 4)

*Liste e descreva os testes automatizados dos endpoints criados e planejados para sua solução, implementados com **Jest**. Cubra as duas abordagens:*

- ***White-box*** *— testes unitários de Service que exercitam ramos internos, exceções e regras de negócio (conhecimento da implementação).*
- ***Black-box*** *— testes de integração dos endpoints via Jest + Supertest, verificando apenas o contrato HTTP (status, body, efeito observável), sem depender da implementação interna.*

*Posicione aqui também o relatório de cobertura de testes Jest se houver (através de link ou transcrito para estrutura markdown).*

## 5.2. Testes de usabilidade (sprint 5)

### 5.2.1. Relatório de testes de guerrilha

*Posicione aqui as tabelas com enunciados de tarefas, etapas e resultados de testes de usabilidade. Ou utilize um link para seu relatório de testes (mantenha o link sempre público para visualização).*

### 5.2.2. Relatório de testes SUS (System Usability Scale)

*Posicione aqui o relatório dos testes SUS realizados.*

# <a name="c6"></a>6. Estudo de Mercado e Plano de Marketing (sprint 4)

## 6.1 Resumo Executivo

*Preencher com até 300 palavras, sem necessidade de fonte*

*Apresente de forma clara e objetiva os principais destaques do projeto: oportunidades de mercado, diferenciais competitivos da aplicação web e os objetivos estratégicos pretendidos.*

## 6.2 Análise de Mercado

*a) Visão Geral do Setor (até 250 palavras)*
*Contextualize o setor no qual a aplicação está inserida, considerando aspectos econômicos, tecnológicos e regulatórios. Utilize fontes confiáveis.*

*b) Tamanho e Crescimento do Mercado (até 250 palavras)*
*Apresente dados quantitativos sobre o tamanho atual e projeções de crescimento do mercado. Utilize fontes confiáveis.*

*c) Tendências de Mercado (até 300 palavras)*
*Identifique e analise tendências relevantes (tecnológicas, comportamentais e mercadológicas) que influenciam o setor. Utilize fontes confiáveis.*

## 6.3 Análise da Concorrência

*a) Principais Concorrentes (até 250 palavras)*
*Liste os concorrentes diretos e indiretos, destacando suas principais características e posicionamento no mercado.*

*b) Vantagens Competitivas da Aplicação Web (até 250 palavras)*
*Descreva os diferenciais da sua aplicação em relação aos concorrentes, sem necessidade de citação de fontes.*


## 6.4 Público-Alvo

*a) Segmentação de Mercado (até 250 palavras)*
Descreva os principais segmentos de mercado a serem atendidos pela aplicação. Utilize bases de dados e fontes confiáveis.*

*b) Perfil do Público-Alvo (até 250 palavras)*
*Caracterize o público-alvo com dados demográficos, psicográficos e comportamentais, incluindo necessidades específicas. Utilize fontes obrigatórias.*


## 6.5 Posicionamento

*a) Proposta de Valor Única (até 250 palavras)*
*Defina de maneira clara o que torna a sua aplicação única e valiosa para o mercado.*

*b) Estratégia de Diferenciação (até 250 palavras)*
*Explique como sua aplicação se destacará da concorrência, evidenciando a lógica por trás do posicionamento.*

## 6.6 Estratégia de Marketing 

*a) Produto/Serviço (até 200 palavras)*
*Descreva as funcionalidades, benefícios e diferenciais da aplicação*

*b) Preço (até 200 palavras)*
*Explique o modelo de precificação adotado e justifique com base nas análises anteriores.*

*c) Praça (Distribuição) (até 200 palavras)*
*Apresente os canais digitais utilizados para distribuir e entregar a aplicação ao público.*

*d) Promoção (até 200 palavras)*
*Descreva as estratégias digitais planejadas, como SEO, redes sociais, marketing de conteúdo e campanhas pagas.*

# <a name="c7"></a>7. Conclusões e trabalhos futuros (sprint 5)

*Escreva de que formas a solução da aplicação web atingiu os objetivos descritos na seção 2 deste documento. Indique pontos fortes e pontos a melhorar de maneira geral.*

*Relacione os pontos de melhorias evidenciados nos testes com planos de ações para serem implementadas. O grupo não precisa implementá-las, pode deixar registrado aqui o plano para ações futuras*

*Relacione também quaisquer outras ideias que o grupo tenha para melhorias futuras*

# <a name="c8"></a>8. Referências (sprints 1 a 5)

_Incluir as principais referências de seu projeto, para que seu parceiro possa consultar caso ele se interessar em aprofundar. Um exemplo de referência de livro e de site:_<br>

LUCK, Heloisa. Liderança em gestão escolar. 4. ed. Petrópolis: Vozes, 2010. <br>
SOBRENOME, Nome. Título do livro: subtítulo do livro. Edição. Cidade de publicação: Nome da editora, Ano de publicação. <br>

INTELI. Adalove. Disponível em: https://adalove.inteli.edu.br/feed. Acesso em: 1 out. 2023 <br>
SOBRENOME, Nome. Título do site. Disponível em: link do site. Acesso em: Dia Mês Ano

# <a name="c9"></a>Anexos

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tópicos utilizando headings menores (use ## ou ### para isso)*
