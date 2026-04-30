<img src="../assets/logointeli.png" alt="Logo Inteli" width="300">


# WAD - Web Application Document - Módulo 2 - Inteli


## Nome do Grupo

#### Nomes dos integrantes do grupo

Ali Abdallah  
Arthur Davi  
Davi Tricarico  
Eduardo Totti  
Enzo Kojian  
Gabriel Andreott  
Julio Quevedo  
Lucas Bianchezzi





## Sumário

[1. Introdução](#c1)

[2. Visão Geral da Aplicação Web](#c2)

[3. Projeto Técnico da Aplicação Web](#c3)

[4. Desenvolvimento da Aplicação Web](#c4)

[5. Testes da Aplicação Web](#c5)

[6. Estudo de Mercado e Plano de Marketing](#c6)

[7. Conclusões e trabalhos futuros](#c7)

[8. Referências](#c8)

[Anexos](#c9)

<br>


# 1. Introdução (sprints 1 a 5)

O município de Santo André enfrenta desafios críticos na gestão de populações em áreas de risco. Com mapa de risco estratificado em zonas amarelas (monitoramento), laranja (área de risco) e vermelho (área de muito risco), o município identifica constantemente famílias vulneráveis que necessitam de proteção. Contudo, o processo de coleta de dados em campo é lento, descentralizado e sem registro geolocalizado integrado. Quando desastres ou eventos extremos ocorrem, agentes da Defesa Civil precisam evacuar famílias rapidamente, mas enfrentam dificuldades: não há rastreamento unificado de retiradas, entrada em abrigos ou quantidade de pessoas por território. Isso compromete a resposta ágil, gera perda de informação entre etapas e dificulta o suporte da sede em tempo real.

Como resposta, foi desenvolvido o GeoRisco Santo André: aplicação web offline-first focada no cadastro georreferenciado rápido de casas e pessoas em áreas de risco. O MVP permite que agentes em campo preencham formulários concisos via mobile, com sistema híbrido de geolocalização (CEP, coordenadas, referências e fotos de imóvel), funcionando mesmo sem GPS preciso. Dados sincronizam automaticamente quando conectado. O sistema registra retiradas de famílias e entrada em abrigos no momento do incidente, e um painel desktop oferece visualização geolocalizada para a sede monitorar densidade de pessoas por território.

Os aspectos essenciais para criação de valor incluem: redução do tempo crítico de coleta em cenários de desastre, eliminação de gaps operacionais entre retirada e abrigo, visão estratégica em tempo real para alocação de recursos, e arquivamento de cadastros para manter integridade da base. A solução substitui sistemas desatualizados e fortalece a capacidade de resposta e resiliência urbana de Santo André.

Este projeto será desenvolvido em parceria com a Defesa Civil de Santo André, incorporando sua experiência operacional e validação contínua das funcionalidades entregues.

*Observe a seção 2 e verifique que ali é possível trazer mais detalhes, portanto seja objetivo aqui. Atualize esta descrição até a entrega final, conforme desenvolvimento.*

# 2. Visão Geral da Aplicação Web (sprint 1)

## 2.1. Escopo do Projeto (sprints 1 e 4)

Esta seção apresenta o escopo do projeto, contemplando as análises estratégicas e conceituais realizadas ao longo das sprints iniciais. São abordados o Modelo das 5 Forças de Porter, a análise SWOT da instituição parceira, a definição da solução proposta, bem como ferramentas de apoio à tomada de decisão, como o Value Proposition Canvas e a matriz de riscos. Além disso, há as personas e as user stories que servem para entendermos melhor sobre o usuário real. O objetivo é contextualizar o problema, compreender o ambiente de atuação e orientar o desenvolvimento da solução.

### 2.1.1. Modelo de 5 Forças de Porter (sprint 1)

O modelo das 5 Forças de Porter foi utilizado para analisar o ambiente competitivo e estratégico no qual a instituição está inserida. A partir dessa abordagem, são avaliadas forças como rivalidade, poder de barganha, ameaça de novos entrantes e de substitutos, permitindo compreender fatores externos que podem impactar a atuação da Defesa Civil e orientar o desenvolvimento da solução proposta.

<img src="outros/porter.png">

#### Rivalidade Entre Concorrentes

Existem órgãos que atuam em cenários semelhantes aos da Defesa Civil, como Corpo de Bombeiros, SAMU, Forças Armadas, Polícia Militar e defesas civis de outros municípios. No entanto, a rivalidade é considerada baixa pois cada instituição possui atribuições legais e mandatos distintos, com atuação geralmente complementar e protocolos de cooperação estabelecidos.

#### Poder de Barganha: Fornecedores

Na Defesa Civil de Santo André, o poder de barganha dos fornecedores varia conforme o recurso e o contexto. Em situações normais, é baixo para insumos básicos, como lonas, colchões e água, devido à ampla oferta e compras públicas. Em emergências, esse poder aumenta, pois rapidez e disponibilidade se tornam mais importantes que o preço, favorecendo fornecedores com pronta entrega. Já serviços especializados, como tecnologia, georreferenciamento e análises técnicas, apresentam maior poder, pela escassez de alternativas e dependência de expertise. Assim, o poder dos fornecedores é médio: baixo para itens comuns, mas elevado em emergências e serviços técnicos.

#### Poder de Barganha: Clientes

O Poder de Barganha dos Clientes, no modelo das Cinco Forças de Porter, avalia a influência dos consumidores sobre preços, qualidade e condições. Quanto mais alternativas, maior o poder de negociação. No contexto apresentado, os moradores de Santo André exercem poder moderado a alto sobre a Defesa Civil, mesmo sem relação comercial direta. Esse poder é limitado pela dependência dos serviços em situações de risco, sem alternativas viáveis. Porém, se fortalece pela pressão social e política, via reclamações e mobilização. Além disso, a eficácia do sistema depende da colaboração dos moradores na coleta de dados, o que amplia sua influência, podendo impactar diretamente a qualidade e o sucesso da solução.

#### Ameaça de Novos Entrantes

A ameaça de novos entrantes para a Defesa Civil de Santo André é baixa, pois não se trata de um mercado competitivo. Trata-se de um órgão público ligado à Prefeitura, responsável por prevenção, resposta e recuperação em desastres. Sua atuação exige conhecimento técnico, autorização institucional, integração com outras áreas e experiência prática. Embora empresas privadas possam oferecer tecnologias e consultorias, não substituem a autoridade da Defesa Civil em ações como evacuações e vistorias. Assim, a entrada de concorrentes diretos é difícil, sendo a principal ameaça limitada a soluções externas que atuam como apoio à gestão de riscos.

#### Ameaça de Substitutos

No contexto da Proteção e Defesa Civil, a análise da ameaça de produtos substitutos, conforme o modelo de Michael Porter, deve ser adaptada, pois se trata de um serviço público de competência estatal exclusiva, sem concorrentes diretos. Ainda assim, existem alternativas que atendem à mesma necessidade da população por segurança e resposta a emergências, como aplicativos de monitoramento climático, redes comunitárias, ONGs e seguros privados. 

Esses substitutos apresentam alta acessibilidade e baixo custo, podendo ser acionados de forma mais imediata, o que confere à força uma intensidade baixa a moderada. Estratégicamente, isso exige que a Defesa Civil mantenha eficiência operacional e comunicação ágil, a fim de preservar a confiança da população e a relevância municipal e reduzir a dependência dessas alternativas.


### 2.1.2. Análise SWOT da Instituição Parceira (sprint 1)

A análise SWOT foi realizada com o objetivo de compreender o cenário interno e externo da instituição parceira, identificando suas forças, fraquezas, oportunidades e ameaças. Essa análise permite avaliar aspectos que impactam diretamente o desenvolvimento e a implementação da solução proposta, contribuindo para decisões mais estratégicas e alinhadas ao contexto da Defesa Civil.

<div align="center">
    <p>Figura 2: Análise Swot</p>
    <img src="outros/swot.png" width="800">
    <p>Feito pela própria equipe (2026)</p>
</div>

#### Strengths

A Defesa Civil de Santo André tem como uma de suas principais forças o fato de **atuar em uma área essencial** para a cidade: a **prevenção, preparação, resposta e recuperação diante de desastres naturais e tecnológicos.**

Por estar ligada à Prefeitura e à Secretaria de Meio Ambiente e Mudanças Climáticas, a organização possui **legitimidade institucional** e **capacidade de articulação com outras áreas públicas.**

Além disso, tem conhecimento técnico sobre **áreas de risco**, protocolos de evacuação, acolhimento emergencial e atendimento a populações vulneráveis, como idosos, crianças, gestantes e pessoas com deficiência.


#### Weaknesses

A Defesa Civil de Santo André possui alta **dependência de processos analógicos** e do **conhecimento de agentes veteranos**. A falta de um repositório digital centralizado fragmenta as informações e compromete a memória técnica da instituição.

Além disso, a **comunicação fragmentada** entre setores impede o fluxo ágil de informações com as pastas de Saúde e Assistência Social. Essa lacuna inviabiliza o acesso a um perfil socioeconômico atualizado das populações em áreas de risco.


O uso de ferramentas como planilhas físicas gera **barreiras operacionais críticas**. Essa limitação reduz a velocidade de resposta e a eficiência na gestão de abrigos e logística durante crises severas.

#### Opportunities

Entre as oportunidades, destaca-se o uso de **tecnologia para modernizar a gestão pública de riscos e desastres.** Ferramentas digitais podem ajudar a organizar dados, acelerar atendimentos, melhorar a comunicação entre secretarias e apoiar decisões mais rápidas. 

Além disso, o aumento da **preocupação com eventos climáticos extremos** torna o trabalho da Defesa Civil ainda mais relevante, abrindo espaço para investimentos, parcerias com instituições de ensino e soluções inovadoras. A **atuação preventiva** também pode fortalecer a confiança da população no serviço público.

#### Threats

**Eventos climáticos extremos e imprevisíveis** desafiam a capacidade instalada de resposta do município. O aumento da intensidade das chuvas pode saturar os planos de contingência atuais, superando os limites operacionais da instituição.


Além disso, a **expansão urbana desordenada** e a **concentração em áreas de encosta** tornam o mapeamento de riscos rapidamente obsoleto. A dinâmica social dessas ocupações dificulta a manutenção de dados precisos para ações preventivas.


**Instabilidades orçamentárias** e a **baixa adesão comunitária aos protocolos de evacuação** também representam riscos. Tais fatores comprometem a continuidade de investimentos e a eficácia das salvaguardas em momentos de desastre.


### 2.1.3. Solução (sprints 1 a 5)

Nesta seção, apresenta-se a solução proposta para o problema identificado, detalhando suas principais funcionalidades, forma de utilização, dados envolvidos e benefícios esperados. O objetivo é demonstrar como a aplicação web contribuirá para a centralização das informações, melhoria dos processos operacionais e apoio à tomada de decisão no contexto da Defesa Civil.

1. Problema a ser resolvido

A Defesa Civil de Santo André enfrenta desafios na gestão ágil de populações em áreas de risco. Coleta de dados em campo é lenta e descentralizada. Não há registro geolocalizado integrado de evacuações, retiradas de famílias ou entrada em abrigos. Agentes precisam identificar imóveis com segurança em cenários de risco, e a Defesa Civil necessita visualizar geograficamente onde as pessoas foram realocadas.

2. Dados disponíveis (mencionar fonte e conteúdo; se não houver, indicar “não se aplica”)

| Documento | Fonte / Órgão Responsável | Acesso | Link / Explicação |
| :--- | :--- | :--- | :--- |
| **Ficha SDUH** | Secretaria de Desenvolvimento Urbano e Habitação (SP) | **Privada** | Portal SDUH (Acesso restrito via login Gov.br/Senha) |
| **Formulário SUAS** | Ministério da Cidadania / Rede SUAS | **Pública** | [Blog Rede SUAS (Modelos)](http://blog.mds.gov.br/redesuas/) |
| **Fichas de Resgate de Animais** | Polícia Ambiental / Secretarias de Meio Ambiente | **Privada** | Sistema Interno de Ocorrências (Documento Administrativo) |
| **Formulário de Bens sob Guarda** | Defesa Civil Municipal / Estadual | **Privada** | [Sistema S2ID](https://s2id.mi.gov.br/) (Exige cadastro de gestor público) |
| **Mapas de Risco Municipal** | SIGA (Sistema Integrado de Gestão Ambiental) | **Pública** | [Portal SIGA - Infraestrutura e Meio Ambiente](https://sigamapa.santoandre.sp.gov.br/) |
| **Referências Geográficas** | IBGE / IGC-SP (DataGEO) | **Pública** | [IBGE Mapas](https://mapas.ibge.gov.br/) ou [DataGEO SP](http://datageo.ambiente.sp.gov.br/) |
| **Estudos de Vulnerabilidade** | CEMADEN / Defesa Civil Nacional | **Pública** | [Painel de Monitoramento CEMADEN](http://www.cemaden.gov.br/) |


(Dados fictícios coerentes serão utilizados para testes, garantindo conformidade com LGPD e Termo de Confidencialidade.)

3. Solução proposta

GeoRisco Santo André: aplicação web offline-first com geolocalização multimodal usando CEP, coordenadas, referências geográficas e fotos de imóvel. A solução MVP gira em torno do cadastro rápido de pessoas assistidas por casa, podendo haver múltiplas pessoas no registro daquela residência. Englobando a captura de dados como: nome, CPF, idade e vulnerabilidade. Além de funcionalidades como: sincronização automática com a internet (para uso do cadastro em regiões sem sinal); painel geolocalizado para visualizar densidade de pessoas por território; localização de assistidos e residências. Para além do MVP, tem-se: gráficos ou KPIs sobre as áreas de maior risco e áreas de priorização baseado nas necessidades das pessoas.

4. Forma de utilização da solução

Agentes preenchem formulário mobile conciso em campo com funcionalidade offline. Sistema salva localmente e sincroniza quando conectado. Registram: localização por CEP, coordenadas, referências e fotos de imóvel, composição da casa, vulnerabilidades, retirada e abrigo. Painel desktop exibe mapa geolocalizado com cadastros, filtros por setor de risco, densidade de pessoas e gera relatórios georreferenciados para análise de contingência.

5. Benefícios esperados

Reduz tempo crítico de coleta permitindo cadastro rápido em campo. Geolocalização multimodal funciona sem GPS preciso. Registro integrado de retirada e abrigo elimina gaps operacionais. Painel geolocalizado oferece visão estratégica em tempo real à Defesa Civil e sede. Arquivamento de cadastros mantém base íntegra. Substitui sistemas desatualizados, fortalecendo resiliência urbana.

6. Critério de sucesso e como será avaliado

Sucesso medido por KPIs nas sprints iniciais: tempo de preenchimento inferior a cinco minutos por casa, sincronização offline e online, precisão de localização, taxa de conclusão sem erros, usabilidade com agentes de tecnologia média. Validação com operadores em campo, testes de visualização de sede, exportação de relatórios. Métricas finalizadas com parceiro durante o projeto.


### 2.1.4. Value Proposition Canvas (sprint 1): 
*Sem limite de palavras – usar template do curso*

*Elaborar o Value Proposition Canvas com base na proposta de solução definida.*

### 2.1.5. Matriz de Riscos do Projeto (sprint 1)

*Sem limite de palavras – usar template do curso*

*Registre na matriz os riscos identificados no projeto.*

## 2.2. Personas (sprint 1)

As personas apresentadas abaixo caracterizam-se como proto-personas, construídas a partir de inferências sobre o contexto institucional e os fluxos operacionais da Defesa Civil, visando representar os principais perfis de usuários e orientar o desenvolvimento da solução.

<img src="../assets/persona2.png" width="520" height="520"> <img src="../assets/persona1.png" width="520" height="520"> 

Identificamos dois tipos de proto-personas possíveis para o âmbito em questão: agente de campo e diretor da Defesa Civil. Primeiro, o agente de campo, que no caso é o indivíduo que se responsabiliza pelas conduções das operações nos atendimentos emergencial, como apontado acima com o João, em que dados demográficos, comportamentos e solução para o perfil de João representam um quadro hipotético que nos evidencia um jeito de humanizar o público-alvo para adotar estratégias mais assertivas e centradas no usuário real. 

Além disso, tem-se o diretor da Defesa Civil, que atua no nível estratégico da operação, sendo responsável pela análise de dados consolidados, definição de prioridades e tomada de decisões em cenários de risco. Nesse contexto, observa-se que a persona atribuída a esse perfil, representada de forma hipotética, permite compreender suas principais necessidades, como acesso rápido a informações confiáveis, visualização de indicadores e geração de relatórios. Dessa forma, assim como no caso do agente de campo, a construção dessa proto-persona contribui para orientar o desenvolvimento de funcionalidades alinhadas às demandas reais do usuário, promovendo uma solução mais eficiente, integrada e centrada no processo decisório.

*Observação: Fotos extraídas de um site produtor de imagens de pessoas inexistentes*: [This Person Does Not Exist](https://thispersondoesnotexist.com/)

## 2.3. User Stories (sprints 1 a 5)

Apresenta-se a seguir a lista de User Stories levantadas para o projeto GeoRisco Santo André. Dividimos os User Stories no baseados no seu nível de prioridade, logo quanto mais no topo estiver a User Stories, mais prioritária será. As 5 primeiras User Stories são prioritárias, e User Stories de prioridade mais baixa seguirão na sequência desta lista, com códigos como US06, US07, e assim por diante.

---

| Identificação | US01 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "como agente de campo, posso cadastrar moradores e dados socioestruturais, para manter informações organizadas e disponíveis no sistema" |
| Critério de aceite 1 | CR1: Dado que o agente está em campo, quando um novo cadastro é realizado, então os dados devem ser armazenados corretamente no sistema |
| Critério de aceite 2 | CR2: Dado que um cadastro foi concluído, quando acessado posteriormente, então as informações devem estar disponíveis para consulta |
| Critérios INVEST | Independente: Pode ser implementada isoladamente; Negociável: Os campos do cadastro podem variar; Valiosa: Permite a organização das informações; Estimável: Baseada em operações CRUD; Pequena: Escopo bem definido; Testável: Cadastro pode ser validado por registro e consulta |

---

| Identificação | US02 |
|---|---|
| Persona | Wesley Souza (Diretor) |
| User Story | "como diretor, posso visualizar ocorrências em um mapa georreferenciado, para obter uma visão geral da situação" |
| Critério de aceite 1 | CR1: Dado que existem ocorrências cadastradas, quando o mapa for acessado, então os pontos devem ser exibidos corretamente |
| Critério de aceite 2 | CR2: Dado que uma ocorrência possui localização, quando selecionada, então suas informações devem ser apresentadas |
| Critérios INVEST | Independente: Pode ser implementada separadamente da criação de ocorrências; Negociável: O nível de detalhamento do mapa pode variar; Valiosa: Facilita a tomada de decisão; Estimável: Baseia-se em integração com APIs de mapas; Pequena: Escopo restrito à visualização; Testável: A exibição pode ser validada visualmente |

---

| Identificação | US03 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "como agente de campo, posso consultar áreas de risco, para atuar com maior segurança" |
| Critério de aceite 1 | CR1: Dado que existem áreas cadastradas, quando o agente consulta o sistema, então os dados devem ser exibidos |
| Critério de aceite 2 | CR2: Dado que uma área é selecionada, quando visualizada, então seu nível de risco deve ser apresentado |
| Critérios INVEST | Independente: Não depende do registro de ocorrências; Negociável: Tipos de dados podem ser ajustados; Valiosa: Reduz riscos operacionais; Estimável: Baseado em consultas ao banco de dados; Pequena: Função direta; Testável: Resultado verificável |

---

| Identificação | US04 |
|---|---|
| Persona | Wesley Souza (Diretor) |
| User Story | "como diretor, posso gerenciar abrigos, para organizar o atendimento à população" |
| Critério de aceite 1 | CR1: Dado que existem abrigos cadastrados, quando acessados, então devem ser exibidos com capacidade e ocupação |
| Critério de aceite 2 | CR2: Dado que um abrigo é atualizado, quando salvo, então os dados devem ser refletidos no sistema |
| Critérios INVEST | Independente: Funcionalidade isolada; Negociável: Campos podem ser ajustados; Valiosa: Melhora a gestão de crises; Estimável: CRUD simples; Pequena: Escopo limitado; Testável: Atualizações verificáveis |

---

| Identificação | US05 |
|---|---|
| Persona | Wesley Souza (Diretor) |
| User Story | "como diretor, posso gerar relatórios consolidados, para apoiar decisões estratégicas" |
| Critério de aceite 1 | CR1: Dado que existem dados registrados, quando solicitado, então o relatório deve ser gerado automaticamente |
| Critério de aceite 2 | CR2: Dado que o relatório foi gerado, quando acessado, então deve apresentar dados consolidados |
| Critérios INVEST | Independente: Pode ser implementado separadamente; Negociável: Formato pode variar; Valiosa: Suporte estratégico; Estimável: Agregação de dados conhecida; Pequena: Escopo delimitado; Testável: Resultado validável |

---

| Identificação | US06 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "como agente de campo, posso atualizar ocorrências, para manter as informações corretas" |
| Critério de aceite 1 | CR1: Dado que uma ocorrência já está registrada, quando editada, então os dados devem ser atualizados no sistema |
| Critério de aceite 2 | CR2: Dado que a atualização foi realizada, quando a ocorrência for acessada, então as novas informações devem ser exibidas |
| Critérios INVEST | Independente: Pode ser implementada separadamente; Negociável: Os campos de edição podem variar; Valiosa: Garante a atualização dos dados; Estimável: Baseada em operações CRUD; Pequena: Escopo específico; Testável: Alterações podem ser verificadas |

---

| Identificação | US07 |
|---|---|
| Persona | Wesley Souza (Diretor) |
| User Story | "como diretor, posso filtrar ocorrências, para priorizar atendimentos" |
| Critério de aceite 1 | CR1: Dado que existem ocorrências registradas, quando filtros são aplicados, então apenas os resultados correspondentes devem ser exibidos |
| Critério de aceite 2 | CR2: Dado que os filtros são removidos, quando o sistema é atualizado, então todas as ocorrências devem ser exibidas novamente |
| Critérios INVEST | Independente: Funciona de forma isolada; Negociável: Os filtros podem variar; Valiosa: Facilita a priorização de ações; Estimável: Baseada em consultas ao sistema; Pequena: Escopo limitado; Testável: Resultados podem ser validados |

---

| Identificação | US08 |
|---|---|
| Persona | Wesley Souza (Diretor) |
| User Story | "como diretor, posso visualizar indicadores, para análise estratégica" |
| Critério de aceite 1 | CR1: Dado que existem dados no sistema, quando o painel é acessado, então os indicadores devem ser exibidos |
| Critério de aceite 2 | CR2: Dado que novos dados são inseridos, quando o sistema é atualizado, então os indicadores devem refletir essas mudanças |
| Critérios INVEST | Independente: Pode ser desenvolvida separadamente; Negociável: Os indicadores podem variar; Valiosa: Apoia decisões estratégicas; Estimável: Baseada em agregação de dados; Pequena: Escopo definido; Testável: Dados exibidos podem ser verificados |

---

| Identificação | US09 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "como agente de campo, posso acessar o sistema via dispositivo móvel, para atuar em campo" |
| Critério de aceite 1 | CR1: Dado que o sistema é acessado por dispositivo móvel, quando carregado, então a interface deve ser responsiva |
| Critério de aceite 2 | CR2: Dado que o agente utiliza o sistema em campo, quando acessa funcionalidades principais, então elas devem funcionar corretamente |
| Critérios INVEST | Independente: Não depende de outras histórias; Negociável: Nível de adaptação pode variar; Valiosa: Permite uso em campo; Estimável: Baseada em responsividade; Pequena: Escopo técnico definido; Testável: Interface pode ser validada |

---

| Identificação | US10 |
|---|---|
| Persona | Wesley Souza (Diretor) |
| User Story | "como diretor, posso cadastrar equipes, para organizar operações" |
| Critério de aceite 1 | CR1: Dado que uma equipe é cadastrada, quando salva, então os dados devem ser armazenados no sistema |
| Critério de aceite 2 | CR2: Dado que existem equipes cadastradas, quando acessadas, então devem ser exibidas corretamente |
| Critérios INVEST | Independente: Pode ser implementada isoladamente; Negociável: Os dados da equipe podem variar; Valiosa: Melhora a organização operacional; Estimável: Baseada em cadastro simples; Pequena: Escopo limitado; Testável: Cadastro pode ser validado |



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
| RF017 | Visualização de utilização pelos atores do sistema        | Lista de logs referenciados pelo respectivo ator sobre a utilização dentro do sistema.          | 2       | 3          | A03     | Planejado |

*Legenda* 
Tipo: 1 - cadastro (entrada), 2 - relatório (saída), 3 - consulta (leitura), 4 - atualização (edição), 5 - exclusão (remoção), 6 - outros.
Prioridade: 1 - muito importante, 2 - importante, 3 - descartável.

### 3.1.3. Regras de Negócio (sprint 1, refinar até sprint 5)

*Numere e redija as RN de forma implementável e testável. Toda RN deve ter pelo menos um teste automatizado associado a partir da sprint 3.*

| ID | Descrição | RF associado | 
|------|-----------|--------------| 
| RN01 | A priorização de evacuação deve considerar critérios de vulnerabilidade, com base em classificação hierárquica. No nível mais alto estão indivíduos com mobilidade reduzida, acamados, deficiência severa ou dependência total. Em seguida, gestantes, idosos e pessoas com deficiência moderada. Por fim, os demais indivíduos. | RF008, RF003, RF004| 
| RN02 | O sistema deve emitir alertas para o recadastro (ou atualização) de assistidos a cada 12 meses(1 ano) desde o cadastro. | RF002, RF003, RF004, RF007, RF016 | 
| RN03 | As moradias cujos moradores faleceram, devem ter seu registro arquivado. Não participando de operações ativas, mas preservando os dados para fins históricos, auditoria e rastreabilidade, estando também conforme a LGPD. | RF001, RF006, RF007 |

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

O diagrama de casos de uso é uma ilustração visual que representa as funcionalidades de um sistema sob a perspectiva de seus usuários, mapeando quais atores interagem com quais casos de uso. Nele, é possível visualizar como os requisitos funcionais se relacionam por meio de dois tipos de relação: `<<include>>`, que indica uma etapa obrigatória dentro de um fluxo, assim, sempre que o caso de uso base for executado, o caso de uso incluído também será; e `<<extend>>`, que indica uma etapa condicional, presente no fluxo apenas em situações específicas, sem ser obrigatória.


<img src="outros/diagrama_de_casos_de_uso.png">

O diagrama mapeia dois atores e três perfis de uso distintos. O **Agente de Campo** representa o perfil **cadastrador**, sendo responsável por registrar e gerenciar dados em campo, interagindo com os casos de uso de cadastro (RF001 a RF004) e gerenciamento (RF006 a RF009). O **Diretor da Defesa Civil** acumula os perfis de **visualizador** e **administrador**: como visualizador, acompanha informações estratégicas por meio dos mapas de calor (RF013); como administrador, é o único ator com acesso à geração de relatórios (RF014) e à exportação de dados (RF015). No fluxo de cadastro, as relações `<<include>>` evidenciam a obrigatoriedade em cadeia, como por exemplo: cadastrar uma moradia (RF001) sempre exige cadastrar o chefe de família (RF002), que por sua vez inclui o cadastro dos membros (RF003). Já o `<<extend>>` aparece nos dois pontos condicionais do diagrama: o cadastro de membros pode, opcionalmente, registrar necessidades especiais (RF004), e a exportação de dados (RF015) estende a geração de relatórios (RF014), ocorrendo apenas quando necessário.

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

## 3.5. Protótipo de alta fidelidade (sprint 3)

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

## 6.1. Resumo Executivo

*Preencher com até 300 palavras, sem necessidade de fonte*

*Apresente de forma clara e objetiva os principais destaques do projeto: oportunidades de mercado, diferenciais competitivos da aplicação web e os objetivos estratégicos pretendidos.*

## 6.2. Análise de Mercado

*a) Visão Geral do Setor (até 250 palavras)*
*Contextualize o setor no qual a aplicação está inserida, considerando aspectos econômicos, tecnológicos e regulatórios. Utilize fontes confiáveis.*

*b) Tamanho e Crescimento do Mercado (até 250 palavras)*
*Apresente dados quantitativos sobre o tamanho atual e projeções de crescimento do mercado. Utilize fontes confiáveis.*

*c) Tendências de Mercado (até 300 palavras)*
*Identifique e analise tendências relevantes (tecnológicas, comportamentais e mercadológicas) que influenciam o setor. Utilize fontes confiáveis.*

## 6.3. Análise da Concorrência

*a) Principais Concorrentes (até 250 palavras)*
*Liste os concorrentes diretos e indiretos, destacando suas principais características e posicionamento no mercado.*

*b) Vantagens Competitivas da Aplicação Web (até 250 palavras)*
*Descreva os diferenciais da sua aplicação em relação aos concorrentes, sem necessidade de citação de fontes.*


## 6.4. Público-Alvo

*a) Segmentação de Mercado (até 250 palavras)*
Descreva os principais segmentos de mercado a serem atendidos pela aplicação. Utilize bases de dados e fontes confiáveis.*

*b) Perfil do Público-Alvo (até 250 palavras)*
*Caracterize o público-alvo com dados demográficos, psicográficos e comportamentais, incluindo necessidades específicas. Utilize fontes obrigatórias.*


## 6.5. Posicionamento

*a) Proposta de Valor Única (até 250 palavras)*
*Defina de maneira clara o que torna a sua aplicação única e valiosa para o mercado.*

*b) Estratégia de Diferenciação (até 250 palavras)*
*Explique como sua aplicação se destacará da concorrência, evidenciando a lógica por trás do posicionamento.*

## 6.6. Estratégia de Marketing 

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

PORTER, Michael E. *Estratégia Competitiva: Técnicas para Análise de Indústrias e da Concorrência*. 2. ed. Rio de Janeiro: Campus, 2004.

JOHNSON, G.; SCHOLES, K.; WHITTINGTON, R. *Exploring Corporate Strategy*. Harlow: Pearson Education, 2008.

PREFEITURA DE SANTO ANDRÉ. Departamento de Proteção e Defesa Civil: Ações e Programas. Disponível em: <https://portais.santoandre.sp.gov.br/defesacivil/>. Acesso em: 27 abr. 2026.

BRASIL. Lei nº 12.608, de 10 de abril de 2012. Institui a Política Nacional de Proteção e Defesa Civil (PNPDEC). *Diário Oficial da União*, Brasília, DF, 11 abr. 2012.

# <a name="c9"></a>Anexos

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tópicos utilizando headings menores (use ## ou ### para isso)*
