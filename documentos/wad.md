<img src="assets/logointeli.png" alt="Logo Inteli" width="300">


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


# <a name="c1"></a>1. Introdução (sprints 1 a 5)

O município de Santo André enfrenta desafios críticos na gestão de populações em áreas de risco. Com mapa de risco estratificado em zonas amarelas (monitoramento), laranja (área de risco) e vermelho (área de muito risco), o município identifica constantemente famílias vulneráveis que necessitam de proteção. Contudo, o processo de coleta de dados em campo é lento, descentralizado e sem registro geolocalizado integrado. Quando desastres ou eventos extremos ocorrem, agentes da Defesa Civil precisam evacuar famílias rapidamente, mas enfrentam dificuldades: não há rastreamento unificado de retiradas, entrada em abrigos ou quantidade de pessoas por território. Isso compromete a resposta ágil, gera perda de informação entre etapas e dificulta o suporte da sede em tempo real.

Como resposta, foi desenvolvido o GeoRisco Santo André: aplicação web offline-first focada no cadastro georreferenciado rápido de casas e pessoas em áreas de risco. O MVP permite que agentes em campo preencham formulários concisos via mobile, com sistema híbrido de geolocalização (CEP, coordenadas, referências e fotos de imóvel), funcionando mesmo sem GPS preciso. Dados sincronizam automaticamente quando conectado. O sistema registra retiradas de famílias e entrada em abrigos no momento do incidente, e um painel desktop oferece visualização geolocalizada para a sede monitorar densidade de pessoas por território.

Os aspectos essenciais para criação de valor incluem: redução do tempo crítico de coleta em cenários de desastre, eliminação de gaps operacionais entre retirada e abrigo, visão estratégica em tempo real para alocação de recursos, e arquivamento de cadastros para manter integridade da base. A solução substitui sistemas desatualizados e fortalece a capacidade de resposta e resiliência urbana de Santo André.

Este projeto será desenvolvido em parceria com a Defesa Civil de Santo André, incorporando sua experiência operacional e validação contínua das funcionalidades entregues.

# <a name="c2"></a>2. Visão Geral da Aplicação Web (sprint 1)

## 2.1. Escopo do Projeto (sprints 1 e 4)

Esta seção apresenta o escopo do projeto, contemplando as análises estratégicas e conceituais realizadas ao longo das sprints iniciais. São abordados o Modelo das 5 Forças de Porter, a análise SWOT da instituição parceira, a definição da solução proposta, bem como ferramentas de apoio à tomada de decisão, como o Value Proposition Canvas e a matriz de riscos. Além disso, há as personas e as user stories que servem para entendermos melhor sobre o usuário real. O objetivo é contextualizar o problema, compreender o ambiente de atuação e orientar o desenvolvimento da solução.

### 2.1.1. Modelo de 5 Forças de Porter (sprint 1)

O modelo das 5 Forças de Porter foi utilizado para analisar o ambiente competitivo e estratégico no qual a instituição está inserida. A partir dessa abordagem, são avaliadas forças como rivalidade, poder de barganha, ameaça de novos entrantes e de substitutos, permitindo compreender fatores externos que podem impactar a atuação da Defesa Civil e orientar o desenvolvimento da solução proposta.

<img src="outros/porter.png">

#### Rivalidade Entre Concorrentes

Existem órgãos que atuam em cenários semelhantes aos da Defesa Civil, como Corpo de Bombeiros, SAMU, Forças Armadas, Polícia Militar e defesas civis de outros municípios. No entanto, a rivalidade é considerada baixa pois cada instituição possui atribuições legais e mandatos distintos, com atuação geralmente complementar e protocolos de cooperação estabelecidos.

#### Poder de Barganha: Fornecedores

O poder de barganha dos fornecedores varia conforme o recurso e o contexto. Em situações normais, é baixo para insumos básicos, como lonas, colchões e água, devido à ampla oferta e compras públicas. Em emergências, esse poder aumenta, pois rapidez e disponibilidade se tornam mais importantes que o preço, favorecendo fornecedores com pronta entrega. Já serviços especializados, como tecnologia, georreferenciamento e análises técnicas, apresentam maior poder, pela escassez de alternativas e dependência de expertise. Assim, o poder dos fornecedores é médio: baixo para itens comuns, mas elevado em emergências e serviços técnicos.

#### Poder de Barganha: Clientes

O poder de barganha dos clientes avalia a influência dos consumidores sobre preços, qualidade e condições. Quanto mais alternativas, maior o poder de negociação. Neste contexto, os moradores de Santo André exercem poder moderado a alto sobre a Defesa Civil, mesmo sem relação comercial direta. Esse poder é limitado pela dependência operacional em situações de risco, sem alternativas viáveis. Porém, se fortalece pela pressão social e política, via reclamações e mobilização. Além disso, a eficácia do sistema depende da colaboração da população na coleta de dados, ampliando sua influência e podendo impactar diretamente a qualidade e o sucesso da solução.

#### Ameaça de Novos Entrantes

A ameaça de novos entrantes é baixa, pois não se trata de um mercado competitivo. Trata-se de um órgão público ligado à Prefeitura, responsável por prevenção, resposta e recuperação em desastres. Sua atuação exige conhecimento técnico, autorização institucional, integração com outras áreas e experiência prática. Embora empresas privadas possam oferecer tecnologias e consultorias, não substituem a autoridade da Defesa Civil em ações como evacuações e vistorias. 

#### Ameaça de Substitutos

A análise da ameaça de substitutos deve ser adaptada, pois se trata de um serviço público exclusivo, sem concorrência direta. Ainda assim, existem alternativas como aplicativos climáticos, redes comunitárias, ONGs e seguros privados. Essas opções possuem alta acessibilidade e baixo custo, resultando em intensidade baixa a moderada. Assim, a Defesa Civil deve manter eficiência operacional e comunicação ágil para preservar a confiança da população e reduzir a dependência dessas alternativas.

Fontes (seção 8): (REF.1, REF.2, REF.3, REF.4, REF.5).


### 2.1.2. Análise SWOT da Instituição Parceira (sprint 1)

A análise SWOT foi realizada com o objetivo de compreender o cenário interno e externo da instituição parceira, identificando suas forças, fraquezas, oportunidades e ameaças. Essa análise permite avaliar aspectos que impactam diretamente o desenvolvimento e a implementação da solução proposta, contribuindo para decisões mais estratégicas e alinhadas ao contexto da Defesa Civil.

<div align="center">
    <p>Figura 1: Análise Swot</p>
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
O Value Proposition Canvas é uma ferramenta visual que auxilia na definição clara da proposta de valor de um produto ou serviço, alinhando as necessidades e desejos dos clientes com as soluções oferecidas. 
Nele estão identificados o perfil do cliente, suas dores, ganhos e tarefas, bem como a proposta de valor, com os produtos e serviços, aliviadores de dores e criadores de ganhos.
Dessa forma, o Canvas de Proposta de Valor traz de maneira sintetizada diferentes aspectos relacionados ao parceiro e à solução proposta, ajudando também no alinhamento das prioridades do projeto.

<div align="center">
    <p>Figura 2: Value Proposition Canvas</p>
    <img src="outros/value-proposition-canvas.png" width="800">
    <p>Feito pela própria equipe (2026)</p>
</div>



### 2.1.5. Matriz de Riscos do Projeto (sprint 1)

<div align="center">
    <p>Figura 3: Matriz de Riscos</p>
    <img src="outros/matriz-risco.jpg" width="800">
    <p>Feito pela própria equipe (2026)</p>
</div>

<div align="center">
    <img src="outros/legenda-matriz-risco.jpg" width="800">
    <p>Legenda da matriz de riscos.    Feito pela própria equipe (2026)</p>
</div>

A Matriz de Riscos, também conhecida como Matriz de Probabilidade e Impacto, é uma ferramenta fundamental para o gerenciamento de riscos no projeto, pois permite identificar, classificar e priorizar os eventos que podem impactar seu desenvolvimento. Essa ferramenta auxilia na tomada de decisões estratégicas, direcionando esforços para mitigação de ameaças e aproveitamento de oportunidades no contexto da gestão de áreas de risco, acolhimento emergencial e logística humanitária. O conceito de risco está diretamente relacionado à combinação entre a probabilidade de ocorrência de um evento e o impacto que ele pode causar ao projeto. Dessa forma, riscos com alta probabilidade e alto impacto demandam maior atenção da equipe e dos stakeholders da Secretaria de Meio Ambiente e Defesa Civil, enquanto aqueles com menor criticidade podem ser monitorados com menor prioridade. Para este projeto, os riscos foram classificados em duas categorias principais: Riscos (ameaças) e Oportunidades (eventos positivos). O nível de criticidade foi definido a partir do cruzamento entre probabilidade e impacto, conforme os critérios apresentados a seguir.

Escala de Probabilidade

A probabilidade de ocorrência é definida em cinco níveis: entre 1% a 10% o evento é considerado muito improvável de ocorrer; de 11% a 30% há uma baixa chance de ocorrência; de 31% a 50% o evento pode ocorrer ocasionalmente; de 51% a 70% trata-se de uma provável ocorrência; e de 71% a 90% indica uma alta probabilidade de ocorrência.

Escala de Impacto

O impacto é classificado conforme a gravidade das consequências: Baixo para consequências leves e facilmente reversíveis; Moderado para impacto perceptível com custos ou prazos controláveis; Alto para impacto significativo no cronograma ou qualidade do projeto; e Muito Alto para impacto crítico, inviabilizador ou que compromete a segurança física dos usuários.
Plano de Ação contra Ameaças

O risco R01 refere-se aos conflitos de sincronização de dados coletados offline, descrevendo a divergência de informações quando agentes sincronizam dados cadastrados simultaneamente sem conexão. Apresenta probabilidade de 71% a 90%, impacto alto e nível de risco alto. A mitigação consiste em implementar IDs únicos (UUID) e lógica de resolução de conflitos, com a resposta de realizar merge manual em registros críticos, sob responsabilidade do Líder Técnico.

O R02 trata do vazamento de dados sensíveis (LGPD), focado no acesso indevido a dados de pessoas vulneráveis. Com probabilidade de 11% a 30% e impacto muito alto, o nível de risco é alto. A mitigação envolve criptografia e controle de acesso (RBAC), enquanto a resposta prevê bloqueio de credenciais, auditoria e notificação ao DPO, sob responsabilidade da Segurança.

O R03 aborda a baixa adesão dos agentes de Defesa Civil por resistência na transição para a interface digital. Com probabilidade de 51% a 70% e impacto alto, o nível de risco é alto. A mitigação foca no envolvimento dos usuários no design (UX) e treinamentos, e a resposta é adaptar funcionalidades para reduzir a carga cognitiva, sob responsabilidade do UX Designer.

O R04 detalha o erro na precisão da geolocalização de vulneráveis, indicando locais incorretos para resgate. Tem probabilidade de 31% a 50% e impacto muito alto, resultando em risco alto. A mitigação ocorre via APIs precisas e validação visual, com resposta de cruzamento de dados históricos, sob responsabilidade da Geolocalização.

O R05 refere-se à indisponibilidade do sistema durante eventos climáticos, como queda de servidor ou lentidão. Com probabilidade de 11% a 30% e impacto muito alto, o nível de risco é alto. A mitigação utiliza infraestrutura escalável e cache local, com resposta de ativação automática de failover e priorização de funções de salvamento, sob responsabilidade do DevOps.
Interdependência dos Riscos

Durante a análise, foi possível identificar relações entre alguns riscos: o sucesso no tratamento da sincronização offline (R01) reduz diretamente o impacto da indisponibilidade do sistema (R05), pois permite que o trabalho continue sem rede. A baixa adesão dos usuários (R03) pode gerar falhas no mapeamento (R04), caso os dados sejam inseridos de forma apressada ou incorreta por falta de familiaridade. Além disso, a segurança contra vazamentos (R02) é o que garante a viabilidade jurídica para a replicação em outros municípios (Oportunidade R10).

Oportunidades Encontradas

A oportunidade R10 foca na replicação para outros municípios do ABC para expandir a solução para cidades vizinhas. Com probabilidade de 71% a 90% e impacto alto, o aproveitamento será feito estruturando o sistema como plataforma modular para facilitar a parametrização. O R11 prevê a integração com Corpo de Bombeiros e PM para compartilhamento de dados em tempo real. Possui probabilidade de 51% a 70% e impacto alto, visando o desenvolvimento de módulos de exportação e APIs de consulta rápida para forças de segurança. O R12 trata da melhoria contínua via feedback operacional para otimizar a logística humanitária. Com probabilidade de 71% a 90% e impacto moderado, será aproveitado através de ciclos curtos de feedback e atualizações após períodos de chuvas intensas. Por fim, o R13 visa a atração de investimentos e funding social de órgãos federais ou agências de inovação. Com probabilidade de 31% a 50% e impacto muito alto, o aproveitamento consiste na elaboração de relatórios de impacto social e eficiência na gestão de abrigos para editais.


## 2.2. Personas (sprint 1)

As personas apresentadas abaixo caracterizam-se como proto-personas, construídas a partir de inferências sobre o contexto institucional e os fluxos operacionais da Defesa Civil, visando representar os principais perfis de usuários e orientar o desenvolvimento da solução.

<img src="../assets/persona1.png" width="520" height="520"> <img src="../assets/persona2.png" width="520" height="520"> 

Identificamos dois tipos de proto-personas possíveis para o âmbito em questão: agente de campo e gestor operacional da Defesa Civil. Primeiro, o agente de campo, que no caso é o indivíduo que se responsabiliza pelas conduções das operações nos atendimentos emergenciais, como apontado acima com o João, em que dados demográficos, comportamentos e solução para o perfil de João representam um quadro hipotético que nos evidencia um jeito de humanizar o público-alvo para adotar estratégias mais assertivas e centradas no usuário real. 

Além disso, tem-se o gestor operacional da Defesa Civil, o Wesley, que atua no nível estratégico da operação, sendo responsável pela análise de dados consolidados, definição de prioridades e tomada de decisões em cenários de risco. Nesse contexto, observa-se que a persona atribuída a esse perfil, representada de forma hipotética, permite compreender suas principais necessidades, como acesso centralizado a dados de diferentes plataformas, conhecimento sobre as informações das pessoas e suas localidades em áreas de risco e aumentar a eficiência dos agentes de campo no cadastro de casas e moradores. Dessa forma, assim como no caso do agente de campo, a construção dessa proto-persona contribui para orientar o desenvolvimento de funcionalidades alinhadas às demandas reais do usuário, promovendo uma solução mais eficiente, integrada e centrada no processo decisório.

*Observação: Fotos extraídas de um site produtor de imagens de pessoas inexistentes*: [This Person Does Not Exist](https://thispersondoesnotexist.com/)

## 2.3. User Stories (sprints 1 a 5)

Apresenta-se a seguir a lista de User Stories levantadas para o projeto GeoRisco Santo André. Dividimos os User Stories no baseados no seu nível de prioridade, logo quanto mais no topo estiver a User Stories, mais prioritária será. As 5 primeiras User Stories são prioritárias, e User Stories de prioridade mais baixa seguirão na sequência desta lista, com códigos como US06, US07, e assim por diante.

---

| Identificação | US01 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "Como agente de campo, quero cadastrar os dados sociodemográficos dos cidadãos para que eu possa vinculá-los às suas moradias e permitir que a gestão conheça o perfil da população atendida." |
| Critério de aceite 1 | CR1: Dado que o agente de campo inicia o cadastro do núcleo familiar, quando preenche os dados obrigatórios e os indicadores de vulnerabilidade (Idosos, Crianças 0 a 12 anos, Gestantes/Lactantes, PCD), então o sistema deve vincular a pessoa à respectiva moradia. |
| Critério de aceite 2 | CR2: Dado que o assistido possui condições específicas de saúde, quando o agente sinalizar no sistema, então devem ser preenchidos os campos de "Doenças crônicas" e "Uso de medicamento contínuo" para gerar histórico no perfil. |
| Critérios INVEST | Independente: O desenvolvimento do módulo de cadastro pessoal não depende da implementação da funcionalidade de mapas.; Negociável: Os campos sociodemográficos e de vulnerabilidade podem ser ajustados.; Valiosa: Fornece a base de dados central para que a Defesa Civil identifique e proteja vidas humanas.; Estimável: É um formulário CRUD tradicional com complexidade previsível e bem delimitada.; Pequena: Foca exclusivamente nos dados demográficos e de saúde da pessoa.; Testável: O testador pode inserir dados simulados e validar a gravação e o vínculo no banco de dados. |

| Identificação | US02 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "Como agente de campo, quero cadastrar as características e a localização das moradias para que possamos mapear a infraestrutura da região e identificar possíveis vulnerabilidades." |
| Critério de aceite 1 | CR1: Dado que o agente avalia o domicílio, quando insere o tipo de construção (Madeira, Alvenaria, Misto), o número de pavimentos e a condição da ocupação (Própria, Alugada, Cedida), então o sistema deve registrar o nível estrutural do imóvel. |
| Critério de aceite 2 | CR2: Dado que o cadastro estrutural exige evidências visuais e de risco, quando o agente salvar o formulário, então o sistema deve exigir obrigatoriamente a inserção de Referência Geográfica, Sinais de alerta observados e permitir o upload de 2 fotos (fachada e entorno). |
| Critérios INVEST | Independente: A gestão de infraestrutura pode ser tratada de forma modular no banco de dados.; Negociável: A quantidade máxima de fotos por moradia pode ser discutida tecnicamente.; Valiosa: Essencial para calcular o risco de desabamento ou alagamento de uma edificação específica.; Estimável: Os atributos presentes na ficha física delimitam o escopo exato do front-end.; Pequena: O escopo limita-se à estrutura da edificação, separando-se da localização por GPS.; Testável: O sistema deve ser capaz de receber os uploads de imagem e retornar os atributos estruturais salvos em um GET. |

| Identificação | US03 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero visualizar moradias em um mapa georreferenciado, para obter uma visão geral das ocupações e facilitar tomadas de decisões estratégicas." |
| Critério de aceite 1 | CR1: Dado que o gestor acessa o painel de georreferenciamento, quando o mapa renderizar na tela, então o sistema deve plotar automaticamente "pins" (marcadores) correspondentes às coordenadas GPS de todas as moradias cadastradas. |
| Critério de aceite 2 | CR2: Dado que o gestor está visualizando o mapa de risco, quando ele clica sobre o marcador de um imóvel, então um card informativo deve ser exibido. |
| Critérios INVEST | Independente: Consome os dados de geolocalização existentes sem interferir em como são cadastrados.; Negociável: O tipo de mapa (Satelite, Terreno) pode ser alterado conforme a biblioteca utilizada.; Valiosa: Entrega alto valor estratégico ao permitir a visualização espacial das zonas de perigo.; Estimável: A integração com APIs de mapas possui documentação robusta.; Pequena: Foca apenas na plotagem básica dos marcadores.; Testável: É possível criar coordenadas *mockadas* e verificar a correta plotagem na interface. |

| Identificação | US04 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero consultar as moradias e o perfil dos moradores de forma integrada, para que eu possa interpretar esses dados e identificar áreas de vulnerabilidades socioestruturais na região." |
| Critério de aceite 1 | CR1: Dado que o gestor acessa o módulo integrado de consultas, quando seleciona o "Nº da Ficha" de uma moradia, então a tela deve consolidar os dados estruturais do imóvel e os dados sociodemográficos dos responsáveis (1º e 2º Responsável) e demais ocupantes. |
| Critério de aceite 2 | CR2: Dado que o gestor visualiza a ficha integrada, quando a moradia estiver classificada com "Histórico de ocorrência" e tiver moradores "Com mobilidade reduzida/acamada", então o sistema deve exibir uma flag visual de "Risco Crítico" no cabeçalho da consulta. |
| Critérios INVEST | Independente: Utiliza joins de dados já populados pelas US01 e US02.; Negociável: O layout de exibição e os níveis de alerta crítico podem ser ajustados.; Valiosa: Facilita o trabalho do gestor que não precisará cruzar tabelas manualmente em planilhas.; Estimável: A consulta a dados relacionados tem esforço facilmente mensurável.; Pequena: Trata-se de uma view (Visualização de dados) de leitura integrada.; Testável: O teste garante que as informações da ficha física batam com o que está sendo exibido digitalmente. |

| Identificação | US05 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "Como agente de campo, quero que a localização da moradia utilize minha posição no momento do cadastro como referência, para que eu tenha salvo o local exato mesmo em zonas remotas." |
| Critério de aceite 1 | CR1: Dado que o agente de campo está na tela de cadastro de nova moradia, quando concluir o cadastro, então o sistema deve solicitar permissão do dispositivo e preencher automaticamente a Latitude e Longitude. |
| Critério de aceite 2 | CR2: Dado que o agente está em uma área sem sinal de internet (offline), quando ele aciona a captura de GPS, então o sistema deve armazenar a coordenada localmente utilizando o sensor nativo do dispositivo para sincronização posterior. |
| Critérios INVEST | Independente: A funcionalidade de captura de hardware é independente dos campos de texto do formulário.; Negociável: A precisão exigida (ex: margem de 5 a 10 metros) pode ser acordada com o time.; Valiosa: Elimina o erro humano da digitação de coordenadas numéricas longas.; Estimável: Utilizar APIs nativas de geolocalização mobile é padrão na indústria.; Pequena: Cobre especificamente um único componente de auto-preenchimento.; Testável: Pode-se simular diferentes coordenadas GPS em emuladores para validar a captura. |

| Identificação | US06 |
|---|---|
| Persona | Wesley Silva (Gestor Operacional) |
| User Story | "Como gestor operacional, quero filtrar moradias por atributos específicos, para poder priorizar atendimentos e identificar as necessidades do público que estou lidando." |
| Critério de aceite 1 | CR1: Dado que o gerente está na tela de gerenciamento de dados, quando aplica os filtros de, por exemplo, "Possui PCD" ou "Uso de equipamento de uso contínuo", então a lista de domicílios deve ser filtrada retornando apenas as residências que preencham esses critérios. |
| Critério de aceite 2 | CR2: Dado que o gerente necessita planejar evacuações, quando ele cruzar os filtros de "Condição da ocupação" (ex: área de risco) com "Local de destino em caso de evacuação", então o sistema deve gerar uma lista exportável com os resultados. |
| Critérios INVEST | Independente: A engine de busca e filtro roda independentemente das rotinas de inserção.; Negociável: Quais filtros exatos estarão disponíveis na V1 pode ser repriorizado.; Valiosa: Essencial para triagem rápida em cenários pre-desastre.; Estimável: A construção de queries dinâmicas no banco é uma tarefa de esforço previsível.; Pequena: Foca unicamente na filtragem de listagens textuais/tabelas.; Testável: O QA deve garantir que ao selecionar um filtro específico, nenhum dado fora do escopo selecionado vaze para a tela. |

| Identificação | US07 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "Como agente de campo, quero cadastrar os pets (se houver) da moradia existente no sistema, para que, em casos de emergência, seja facilitada a evacuação e busca." |
| Critério de aceite 1 | CR1: Dado que o agente de campo revisa a seção de contingência do domicílio, quando questiona o morador, então o formulário deve permitir a inserção das quantidades divididas pelas categorias: Cães, Gatos, Aves, ou Outros. |
| Critério de aceite 2 | CR2: Dado que o resgate acessa a ficha de emergência do domicílio, quando visualiza a seção "Animais de estimação", então a quantidade exata informada deve estar em destaque para planejamento logístico de caixas de transporte. |
| Critérios INVEST | Independente: O cadastro de animais não afeta os dados vitais dos seres humanos.; Negociável: A lista de categorias pode ser estendida para animais de grande porte dependendo da região.; Valiosa: Reduz a recusa de moradores em abandonar áreas de risco por causa de seus animais.; Estimável: É uma adição simples de atributos numéricos à entidade Domicílio.; Pequena: Pode ser finalizada em um ou dois dias de desenvolvimento.; Testável: Verificação da persistência e retorno no JSON do perfil do assistido. |

| Identificação | US08 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero visualizar os dados dos filtros da moradia e/ou assistidos por meio de mapas de calor, para que eu possa ter um retorno mais visual para análise geral." |
| Critério de aceite 1 | CR1: Dado que o gestor acessa o mapa e seleciona o layer de "Mapa de Calor" cruzado, por exemplo, com o filtro de "Idosos", quando a renderização ocorre, então as áreas com maior adensamento deste público devem ficar em tons intensos/avermelhados. |
| Critério de aceite 2 | CR2: Dado que o mapa de calor é acionado, quando o usuário realizar "zoom in" ou "zoom out", então os clusters térmicos devem ser recalculados dinamicamente com base no novo nível de aproximação. |
| Critérios INVEST | Independente: Construído como uma camada (layer) adicional em cima do mapa principal.; Negociável: A paleta de cores e o raio de dispersão podem ser calibrados futuramente.; Valiosa: Transforma dados brutos em inteligência visual e geográfica.; Estimável: Ferramentas modernas de mapas já contam com plugins de heatmap nativos.; Pequena: Foca na visualização agregada térmica.; Testável: Validar se agrupamentos de dados na mesma coordenada geram as manchas esperadas. |

| Identificação | US09 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero arquivar moradias de assistidos, para manter o histórico de moradias que foram destruídas, evacuadas ou abandonadas." |
| Critério de aceite 1 | CR1: Dado que um evento climático destruiu/evacuou uma moradia, quando o gestor entra no cadastro e clica em "Arquivar Imóvel", então o sistema deve exigir a seleção de um motivo (Destruída, Evacuada, Desapropriada) antes de confirmar a ação. |
| Critério de aceite 2 | CR2: Dado que uma moradia foi arquivada, quando o gestor acessar os painéis e o mapa geral de operações ativas, então esta moradia NÃO deve ser exibida, mantendo-se apenas na seção de "Histórico Inativo". |
| Critérios INVEST | Independente: A funcionalidade de inativação lógica (soft delete) não depende de novos registros.; Negociável: Os motivos do arquivamento podem ser populados a partir de um domínio expansível.; Valiosa: Mantém a integridade do banco de dados enquanto limpa a visão operacional.; Estimável: Requer a adição de flags booleanas e atualização das queries.; Pequena: Funcionalidade contida e de rápida implementação.; Testável: Garantir que imóveis com status "Arquivado" não retornem em chamadas de API ativas. |

| Identificação | US10 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero arquivar moradores falecidos, para manter o histórico do indivíduo sem comprometer os dados operacionais ativos." |
| Critério de aceite 1 | CR1: Dado que um morador veio a óbito, quando o gestor acessar o cadastro do indivíduo e clicar em "Arquivar Morador", então o sistema deve exigir o preenchimento da data de falecimento e a confirmação da ação antes de concluir o arquivamento. |
| Critério de aceite 2 | CR2: Dado que um morador foi arquivado como falecido, quando o gestor acessar listagens, relatórios ou operações ativas, então este morador NÃO deve ser exibido nos registros ativos, permanecendo apenas na seção de "Histórico de Moradores". |
| Critérios INVEST | Independente: A funcionalidade de arquivamento lógico do morador pode ser implementada sem impactar o cadastro ativo.; Negociável: Os campos relacionados ao falecimento podem ser ajustados conforme as regras do sistema.; Valiosa: Mantém o histórico populacional preservado sem interferir nas operações correntes.; Estimável: Requer adição de status lógico, filtros de consulta e atualização das regras de exibição.; Pequena: Funcionalidade isolada e de baixa complexidade técnica.; Testável: Garantir que moradores arquivados não sejam retornados em consultas de moradores ativos e permaneçam acessíveis no histórico. |

| Identificação | US11 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero ser avisado a cada 12 meses de cadastro de cada usuário, para que surja um alerta para atualização das informações do mesmo." |
| Critério de aceite 1 | CR1: Dado que o sistema possui uma rotina de checagem automatizada, quando a "Data de Atualização" de uma ficha completar 365 dias sem modificações, então o sistema deve informar o gestor. |
| Critério de aceite 2 | CR2: Dado que o gestor acessa a aba "Visualização/Mapa", quando as informações extras forem desatualizadas, então o número de cadastros desatualizados e atualizados deve aparecer. |
| Critérios INVEST | Independente: A rotina roda em background e não interfere no fluxo de cadastro diário.; Negociável: O prazo de aviso pode ser parametrizável.; Valiosa: Evita o sucateamento dos dados em áreas de risco dinâmico.; Estimável: Configuração de uma job e um painel de notificações são tarefas comuns.; Pequena: Apenas identifica e lista pendências.; Testável: Alterar a data de modificação de um teste no banco para "Data Atual - 366 dias" e validar se o alerta dispara. |

| Identificação | US12 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "Como agente de campo, quero atualizar os dados anualmente para validação informacional do banco de dados da Defesa Civil." |
| Critério de aceite 1 | CR1: Dado que o agente revisita um domicílio marcado por alerta de desatualização, quando ele revisa e re-salva os dados estruturais e sociais, então o sistema deve sobrepor a data de atualização antiga com a atual. |
| Critério de aceite 2 | CR2: Dado que o agente assina e envia a atualização, quando os dados são sincronizados no servidor, então o indicador de "desatualizado" no painel do Gestor Operacional deve desaparecer instantaneamente. |
| Critérios INVEST | Independente: Atua apenas sobre registros já existentes fechando o ciclo de vida do dado.; Negociável: A necessidade de manter versionamento de histórico pode ser discutida.; Valiosa: Garante que o banco da Defesa Civil reflita sempre a realidade do ano vigente.; Estimável: É um reaproveitamento do formulário de criação adaptado para Update.; Pequena: Foca unicamente na ação de editar e limpar os alertas.; Testável: Atestar que a ação de salvar a edição atualiza a coluna correspondente no banco e zera a notificação. |


# <a name="c3"></a>3. Projeto da Aplicação Web (sprints 1 a 5)

## 3.1. Requisitos do Sistema (sprints 1 a 5)

Esta seção formaliza o que o sistema deve fazer, sob quais regras e com quais qualidades. O sistema tem como propósito central permitir a compreensão precisa da quantidade de pessoas em territórios de risco, operando de forma georreferenciada para identificar residências mesmo em locais sem endereçamento oficial (como barracos ou vielas), utilizando coordenadas ou CEP Digital.

O sistema atende primordialmente ao João Silva (Agente de Campo) no que tange à operatividade e coleta de dados em tempo real. Como João atua diretamente em áreas de risco e sob pressão, as funcionalidades de cadastro georreferenciado de edificações e a classificação de risco (R1 a R4) suprem sua necessidade de um sistema integrado e acessível em campo. O foco no registro de moradias, chefes de família e membros residentes permite que João cumpra seu objetivo de registrar informações com precisão, enquanto a identificação de perfis com necessidades especiais (idosos, PCDs, gestantes) resolve sua "dor" de comunicação falha entre equipes, garantindo que o plano de evacuação seja assertivo. Além disso, a gestão de unidades de acolhimento e estoque humanitário em tempo real reduz o retrabalho e a duplicidade de registros que ele atualmente enfrenta.

Para Wesley Souza (Diretor da Defesa Civil), o sistema atua como uma ferramenta estratégica de tomada de decisão. As funcionalidades de processamento automático de mapas de calor de riscos e a geração de relatórios estatísticos em PDF atendem diretamente ao seu objetivo de definir estratégias de mitigação e sua necessidade por indicadores estratégicos e visão macro. A capacidade de exportar dados em formatos abertos (CSV) e o monitoramento da ocupação de leitos resolvem sua principal "dor": a ausência de relatórios confiáveis e a dificuldade em prever riscos. Por fim, a emissão de notificações automáticas via e-mail para a revisão anual garante a integridade dos dados a longo prazo, permitindo que Wesley mantenha a transparência na gestão e o planejamento de ações preventivas de forma contínua e eficiente.

O funcionamento do sistema é regido, primeiramente, pela RN01 (Priorização de Evacuação), que estabelece os critérios de vulnerabilidade para o resgate: pessoas com mobilidade reduzida, acamados e com deficiência severa possuem prioridade absoluta, seguidos por gestantes, idosos e pessoas com deficiência moderada na escala hierárquica.

Para garantir a eficácia operacional, o cadastro deve ser mantido atualizado conforme a RN02 (Alertas para Recadastro), que determina a emissão de alertas para a atualização dos dados dos assistidos a cada 12 meses.

Por fim, o ciclo de vida dos dados é gerido pela RN03 (Arquivamento de Registros), que prevê o arquivamento de registros de moradores falecidos, removendo-os de operações ativas, mas preservando as informações para fins históricos, auditoria e conformidade com a LGPD.

Para garantir a eficiência em campo, o sistema deve possuir capacidade de operação offline, permitindo o salvamento local dos dados com sincronização automática assim que houver cobertura de rede. O tempo de resposta para operações de salvamento e carregamento de mapas deve ser de, no máximo, 3 segundos. A interface mobile deve ser concisa e intuitiva, otimizada para o preenchimento de um cadastro completo em menos de 5 minutos, sendo adaptada para o uso do agente de campo em situações de estresse. O sistema permite a captura de fotos das fachadas dos imóveis para facilitar a identificação visual pelas equipes, mas permanece estritamente proibido o registro fotográfico das pessoas cadastradas. Além disso, a solução deve oferecer suporte à geolocalização multimodal (CEP, coordenadas e referências) e, durante esta fase de desenvolvimento, operar exclusivamente com dados hipotéticos e mascarados, garantindo total conformidade com a LGPD e o Termo de Confidencialidade. 


### 3.1.1 Lista de Atores

| ID  | Nome do Ator                           | Descrição                                                                                                                                                                                                                                                                                               | Frequência de Uso | Proficiência Tecnológica |
|-----|----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|--------------------------|
| A01 | Agente de Defesa Civil (Campo)         | Pode realizar a coleta dados georreferenciados in loco, realizar vistorias em áreas de risco e alimentar o sistema com informações de interdições ou rotas obstruídas.                                                                                                                                  | Diária            | Média/baixo              |
| A02 | Agente de Defesa Civil (interno)       | Pode visualizar todas as informações coletadas e gerar relatórios a partir delas.                                                                                                                                                                                                                       | Diário            | Média/Alta               |
| A03 | Agente de Defesa Civil (Administração) | Pode gerenciar os parâmetros de monitoramento e extrair relatórios, análises e mapas de calor gerados automaticamente pela plataforma. Sua função é interpretar essas visões consolidadas de risco e vulnerabilidade para subsidiar a tomada de decisão e o planejamento de contingência da prefeitura. | Diária            | Média/Alta               |

### 3.1.2. Requisitos Funcionais (sprint 1, refinar até sprint 5)


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


| ID | Descrição | RF associado | 
|------|-----------|--------------| 
| RN01 | A priorização de evacuação deve considerar critérios de vulnerabilidade, com base em classificação hierárquica. No nível mais alto estão indivíduos com mobilidade reduzida, acamados, deficiência severa ou dependência total. Em seguida, gestantes, idosos e pessoas com deficiência moderada. Por fim, os demais indivíduos. | RF008, RF003, RF004| 
| RN02 | O sistema deve emitir alertas para o recadastro (ou atualização) de assistidos a cada 12 meses(1 ano) desde o cadastro. | RF002, RF003, RF004, RF007, RF016 | 
| RN03 | As moradias cujos moradores faleceram, devem ter seu registro arquivado. Não participando de operações ativas, mas preservando os dados para fins históricos, auditoria e rastreabilidade, estando também conforme a LGPD. | RF001, RF006, RF007 |

### 3.1.4. Requisitos Não Funcionais — 8 Eixos ISO/IEC 25010 (sprints 1 a 5)


| Eixo                     | Requisito | Métrica / Critério | Como atendido |
|--------------------------|-----------|--------------------|---------------|
| **USAB — Usabilidade** | Eficiência operacional da interface PWA em campo para os Agentes de Defesa Civil. | Tempo de preenchimento completo de um cadastro de moradia em **< 3 minutos**. | Testes de usabilidade (Time-on-Task) cronometrados com 5 Agentes de Campo reais. |
| **CONF — Confiabilidade** | Tolerância a falhas de rede (Offline-first) e retenção de dados durante vistorias em áreas de sombra. | **100% dos dados** inseridos offline salvos em cache local e **99,9% de Uptime** anual do servidor. | Simulação de perda de pacote/modo avião durante o preenchimento e monitoramento automatizado. |
| **DES — Desempenho** | Tempo de resposta do sistema sob condições normais de operação de rede (3G/4G/Wi-Fi). | Salvamento de dados locais em **< 500ms** e renderização do mapa de risco (p95) em **< 3 segundos**. | Testes de carga automatizados simulando acessos simultâneos (ex: JMeter ou k6). |
| **SUP — Suportabilidade** | Compatibilidade de hardware e sistema operacional dos dispositivos móveis utilizados pela prefeitura. | Operação sem quebra de layout em telas de **5.5 a 7 polegadas** e nas **3 últimas versões** de Android/iOS. | Matriz de testes em emuladores (BrowserStack) e nos aparelhos físicos da Defesa Civil. |
| **SEG — Segurança** | Proteção de dados sensíveis (LGPD) e integridade dos acessos ao sistema. | **100% dos dados pessoais** com criptografia AES-256, tráfego TLS 1.3 e bloqueio após 5 falhas de login. | Auditoria de código estático (SAST) e testes de intrusão (PenTest) no ambiente. |
| **CAP — Capacidade** | Escalabilidade do banco de dados para suportar os picos de acesso durante alertas climáticos severos. | Processamento de até **500 requisições simultâneas por minuto** sem degradação do p95. | Testes de stress focados em transações de banco de dados e monitoramento de I/O. |
| **REST — Restrições Design** | Limitações arquiteturais e de armazenamento do dispositivo e nuvem impostas ao produto. | Tamanho do bundle PWA (cache) **< 15MB** e compressão automática de fotos para no máximo **2MB** por imagem. | Análise de payload via DevTools do navegador e validação do tamanho no banco de arquivos. |
| **ORG — Organizacionais** | Restrições impostas aos processos de desenvolvimento, testes e infraestrutura do projeto. | **100% de dados fictícios** em homologação. | Auditoria de base de testes. |

### 3.1.5. Matriz RF → RN → Endpoint (sprints 3 a 5)

Matriz de cobertura que demonstra quais RN (Regras de Negócio) e endpoints implementam cada RF (Requisito Funcional).

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

1. PORTER, Michael E. *Estratégia Competitiva: Técnicas para Análise de Indústrias e da Concorrência*. 2. ed. Rio de Janeiro: Campus, 2004.

2. JOHNSON, G.; SCHOLES, K.; WHITTINGTON, R. *Exploring Corporate Strategy*. Harlow: Pearson Education, 2008.

3. PREFEITURA DE SANTO ANDRÉ. Departamento de Proteção e Defesa Civil: Ações e Programas. Disponível em: <https://portais.santoandre.sp.gov.br/defesacivil/>. Acesso em: 27 abr. 2026.

4. BRASIL. Lei nº 12.608, de 10 de abril de 2012. Institui a Política Nacional de Proteção e Defesa Civil (PNPDEC). *Diário Oficial da União*, Brasília, DF, 11 abr. 2012.

5. PEDROSO, Luiz Guilherme Lourenço Becker. [Título do trabalho]. 2017. Trabalho de Conclusão de Curso (Graduação) – Universidade de São Paulo, São Paulo, 2017. Disponível em: https://bdta.abcd.usp.br/directbitstream/05356078-01cb-4989-856d-4cf4dcb8b4cc/LuizGuilhermeLourencoBeckerPedroso%20TCCPRO17.pdf
. Acesso em: 30 abr. 2026.

# <a name="c9"></a>Anexos

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tópicos utilizando headings menores (use ## ou ### para isso)*
