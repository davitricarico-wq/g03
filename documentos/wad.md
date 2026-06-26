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

[7. Registro de Atualizações](#c7)

[8. Conclusões e trabalhos futuros](#c8)

[9. Referências](#c9)

[Anexos](#c10)

<br>


# <a name="c1"></a>1. Introdução (sprints 1 a 5)

O município de Santo André enfrenta desafios críticos na gestão de populações em áreas de risco. Com mapa de risco estratificado em zonas amarelas (monitoramento), laranja (área de risco) e vermelho (área de muito risco), o município identifica constantemente famílias vulneráveis que necessitam de proteção. Contudo, o processo de coleta de dados em campo é lento, descentralizado e sem registro geolocalizado integrado. Quando desastres ou eventos extremos ocorrem, agentes da Defesa Civil precisam cadastrar e localizar famílias rapidamente, mas enfrentam dificuldades: não há sistema unificado para registrar a quantidade de pessoas por território de forma georreferenciada. Isso compromete a resposta ágil, gera perda de informação entre etapas e dificulta o suporte da sede em tempo real.

Como resposta, foi desenvolvido o GeoRisco Santo André: aplicação web focada no cadastro georreferenciado rápido de moradias e famílias em áreas de risco. O MVP permite que agentes em campo preencham formulários concisos via dispositivo mobile, com captura de coordenadas GPS no momento do cadastro e campos complementares de localização (logradouro, referência geográfica e fotos opcionais do imóvel). O sistema oferece uma interface responsiva que atende tanto ao uso mobile pelos agentes de campo quanto à visualização, busca e edição pelos gestores operacionais.

Os aspectos essenciais para criação de valor incluem: redução do tempo crítico de coleta em cenários de desastre, visão estratégica geolocalizada em tempo real para alocação de recursos, arquivamento de cadastros para manter integridade da base e alertas automáticos de recadastro para garantir dados sempre atualizados. A solução substitui processos analógicos desatualizados e fortalece a capacidade de resposta e resiliência urbana de Santo André.

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

Fontes (seção 9): (REF.1, REF.2, REF.3, REF.4, REF.5).


### 2.1.2. Análise SWOT da Instituição Parceira (sprint 1)

A análise SWOT foi realizada com o objetivo de compreender o cenário interno e externo da instituição parceira, identificando suas forças, fraquezas, oportunidades e ameaças. Essa análise permite avaliar aspectos que impactam diretamente o desenvolvimento e a implementação da solução proposta, contribuindo para decisões mais estratégicas e alinhadas ao contexto da Defesa Civil.

<div align="center">
    <p>Figura 1: Análise SWOT</p>
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
</div>

<div align="center">
    <img src="outros/legenda-matriz-risco.jpg" width="800">
    <p>Feito pela própria equipe (2026)</p>
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

<div align="center">
    <p>Figura 4: Persona 1</p>
    <img src="../assets/persona1.png" width="520" height="520">
    <p>Feito pela própria equipe (2026)</p> 
</div>


<div align="center">
    <p>Figura 5: Persona 2</p>
    <img src="../assets/persona2.png" width="520" height="520"> 
    <p>Feito pela própria equipe (2026)</p>
</div>

Identificamos dois tipos de proto-personas possíveis para o âmbito em questão: agente de campo e gestor operacional da Defesa Civil. Primeiro, o agente de campo, que no caso é o indivíduo que se responsabiliza pelas conduções das operações nos atendimentos emergenciais, como apontado acima com o João, em que dados demográficos, comportamentos e solução para o perfil de João representam um quadro hipotético que nos evidencia um jeito de humanizar o público-alvo para adotar estratégias mais assertivas e centradas no usuário real. 

Além disso, tem-se o gestor operacional da Defesa Civil, o Wesley, que atua no nível estratégico da operação, sendo responsável pela análise de dados consolidados, definição de prioridades e tomada de decisões em cenários de risco. Nesse contexto, observa-se que a persona atribuída a esse perfil, representada de forma hipotética, permite compreender suas principais necessidades, como acesso centralizado a dados de diferentes plataformas, conhecimento sobre as informações das pessoas e suas localidades em áreas de risco e aumentar a eficiência dos agentes de campo no cadastro de casas e moradores. Dessa forma, assim como no caso do agente de campo, a construção dessa proto-persona contribui para orientar o desenvolvimento de funcionalidades alinhadas às demandas reais do usuário, promovendo uma solução mais eficiente, integrada e centrada no processo decisório.

*Observação: Fotos extraídas de um site produtor de imagens de pessoas inexistentes*: [This Person Does Not Exist](https://thispersondoesnotexist.com/)

## 2.3. User Stories (sprints 1 a 5)

Apresenta-se a seguir a lista de User Stories levantadas para o projeto GeoRisco Santo André. Dividimos as User Stories com base no seu nível de prioridade, logo quanto mais no topo estiver a User Story, mais prioritária será. As 5 primeiras User Stories são prioritárias, e User Stories de prioridade mais baixa seguirão na sequência desta lista, com códigos como US06, US07, e assim por diante.

> **Responsável (definição):** morador designado como referência do núcleo familiar. É obrigatoriamente um dos cidadãos cadastrados, **único por família**, e concentra os dados de contato e burocráticos do núcleo (ex.: CPF, NIS, renda, programas sociais). Toda família ativa deve ter um responsável definido.

---

### Cadastro - Cidadãos

| Identificação | US01 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "Como agente de campo, quero cadastrar os dados sociodemográficos dos cidadãos para que eu possa vinculá-los às suas moradias e permitir que a gestão conheça o perfil e localização da população atendida." |
| Critério de aceite 1 | CR1: Dado que o agente de campo inicia o cadastro do núcleo familiar, quando preenche os dados obrigatórios referentes à família, então o sistema deve cadastrar a família mesmo sem moradia vinculada, sinalizando-a com o indicador de "cadastro incompleto" (motivo: sem moradia). |
| Critério de aceite 2 | CR2: Dado que um agente realiza o cadastro de um cidadão, quando pressiona o botão de enviar, então o sistema deve exigir que todas as informações definidas como obrigatórias sejam preenchidas antes de concluir o cadastro. |
| Critério de aceite 3 | CR3: Dado que o agente cadastra os moradores de um núcleo familiar, quando finaliza o cadastro, então o sistema deve exigir que um dos moradores seja marcado como responsável pela família, bloqueando a conclusão enquanto não houver um responsável definido. |
| Critério de aceite 4 | CR4: Dado que o agente cadastra um cidadão, quando a pessoa se enquadra em um ou mais grupos de prioridade (ex.: idoso, gestante/lactante, PCD), então o sistema deve permitir classificá-la no(s) grupo(s) de vulnerabilidade correspondente(s). |
| Critério de aceite 5 | CR5: Dado que o agente informa o CPF de um cidadão, quando o CPF já estiver cadastrado no sistema, então o sistema deve bloquear o cadastro duplicado e sinalizar que a pessoa já existe. |
| Critérios INVEST | Independente: O módulo de cadastro pessoal não depende da implementação da funcionalidade de mapas.; Negociável: Os campos sociodemográficos e de vulnerabilidade, bem como as regras de marcação do responsável, podem ser ajustados.; Valiosa: Fornece a base de dados central para que a Defesa Civil identifique e proteja vidas humanas.; Estimável: É um formulário CRUD tradicional, com validações previsíveis de campos obrigatórios, responsável, grupos de vulnerabilidade e unicidade de CPF.; Pequena: Foca no cadastro dos dados da família/moradores, na designação do responsável e na classificação de vulnerabilidade, sem abranger mapa ou edição posterior.; Testável: O testador pode inserir dados simulados e validar a gravação, o aviso de "cadastro incompleto" quando não há moradia, o bloqueio do envio sem responsável, a classificação nos grupos de vulnerabilidade e o bloqueio de CPF já cadastrado. |

### Cadastro - Moradias

| Identificação | US02 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "Como agente de campo, quero cadastrar as informações sócioestruturais das moradias para que possamos mapear a infraestrutura da região e identificar possíveis vulnerabilidades." |
| Critério de aceite 1 | CR1: Dado que o agente está em campo em um núcleo de risco, quando estiver cadastrando uma moradia, então o sistema deve permitir o registro dos dados estruturais do imóvel (ex.: tipo de construção, número de pavimentos e condição de ocupação). |
| Critério de aceite 2 | CR2: Dado que o agente está cadastrando a moradia, quando desejar registrar evidências visuais do imóvel, então o sistema deve permitir anexar fotos da moradia (ex.: fachada e entorno) ao cadastro. |
| Critérios INVEST | Independente: A gestão de infraestrutura pode ser tratada de forma modular no banco de dados.; Negociável: A quantidade máxima de fotos por moradia pode ser discutida tecnicamente.; Valiosa: Essencial para calcular o risco de desabamento ou alagamento de uma edificação específica.; Estimável: Os atributos presentes na ficha física delimitam o escopo exato do front-end.; Pequena: O escopo limita-se à estrutura da edificação, separando-se da localização por GPS.; Testável: O sistema deve ser capaz de receber os uploads de imagem e retornar os atributos estruturais salvos em um GET. |

### Mapa

| Identificação | US03 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero visualizar moradias em um mapa georreferenciado, para obter uma visão geral das ocupações, facilitar tomadas de decisões estratégicas e identificar áreas de vulnerabilidades socioestruturais na região." |
| Critério de aceite 1 | CR1: Dado que o gestor acessa o painel de georreferenciamento, quando o mapa renderizar na tela, então o sistema deve plotar automaticamente "pins" (marcadores) correspondentes às coordenadas GPS de todas as moradias cadastradas. |
| Critério de aceite 2 | CR2: Dado que o gestor está visualizando o mapa, quando ele clica sobre o marcador de um imóvel, então um card informativo deve ser exibido com os dados basicos da moradia. |
| Critérios INVEST | Independente: Consome os dados de geolocalização existentes sem interferir em como são cadastrados.; Negociável: O tipo de mapa (Satelite, Terreno) pode ser alterado conforme a biblioteca utilizada.; Valiosa: Entrega alto valor estratégico ao permitir a visualização espacial das zonas de perigo.; Estimável: A integração com APIs de mapas possui documentação robusta.; Pequena: Foca apenas na plotagem básica dos marcadores.; Testável: É possível criar coordenadas *mockadas* e verificar a correta plotagem na interface. |

### Busca

| Identificação | US04 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero poder buscar os dados das familias e moradias, para que eu possa consultar dados relacionados à familias com informações especificas." |
| Critério de aceite 1 | CR1: Dado que o gestor acessa o módulo de consultas, quando utiliza um dos parametros de pesquisa, então a tela deve mostrar os dados basicos sobre o responsável, moradia, moradores e pets relacionados à(s) família(s) encontradas. |
| Critério de aceite 2 | CR2: Dado que o gestor visualiza os dados de uma família, quando a família estiver sem moradia vinculada, então o sistema deve exibir a flag visual de "cadastro incompleto" no cabeçalho da consulta. |
| Critérios INVEST | Independente: Utiliza joins de dados já populados pelas US01 e US02.; Negociável: O layout de exibição e os níveis de alerta crítico podem ser ajustados.; Valiosa: Facilita o trabalho do gestor que não precisará cruzar tabelas manualmente em planilhas.; Estimável: A consulta a dados relacionados tem esforço facilmente mensurável.; Pequena: Trata-se de uma view (Visualização de dados) de leitura integrada.; Testável: O teste garante que as informações da ficha física batam com o que está sendo exibido digitalmente. |

### Edição

| Identificação | US05 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero, caso necessário, poder atualizar os dados das famílias para manter a integridade e acertividade dos dados cadastrados no sistema." |
| Critério de aceite 1 | CR1: Dado que seja necessário atualizar os dados após o cadastro inicial do núcleo familiar, quando o gestor encontra a família desejada na busca ou no mapa, então o modal deve possuir um botão de atualização/edição que encaminhe o usuário para a página de cadastro com os dados do núcleo familiar já preenchidos. |
| Critério de aceite 2 | CR2: Dado que o gestor revisa e re-salva os dados de um núcleo familiar com cadastro incompleto, quando o formulário é enviado com sucesso e os dados obrigatórios passam a estar completos, então o indicador de "cadastro incompleto" no painel de pesquisa deve desaparecer. |
| Critério de aceite 3 | CR3: Dado que o gestor edita uma moradia já cadastrada, quando a tela de edição da moradia carregar, então o mini-mapa deve exibir o pin já posicionado nas coordenadas salvas, permitindo confirmá-lo ou reposicioná-lo (tocando no mapa ou arrastando o pin), sendo obrigatório manter coordenadas válidas para concluir o salvamento. |
| Critérios INVEST | Independente: Atua apenas sobre registros já existentes fechando o ciclo de vida do dado.; Negociável: A necessidade de manter versionamento de histórico pode ser discutida.; Valiosa: Garante que o banco da Defesa Civil reflita sempre a realidade do ano vigente.; Estimável: É um reaproveitamento do formulário de criação adaptado para Update.; Pequena: Foca unicamente na ação de editar e limpar os alertas.; Testável: Atestar que salvar a edição atualiza os dados no banco e remove o indicador de "cadastro incompleto" quando os dados obrigatórios passam a estar completos. |

### Cadastro - Localização

| Identificação | US06 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "Como agente de campo, quero registrar a localização exata da moradia confirmando minha posição em um mini-mapa no momento do cadastro, para garantir o local correto da residência." |
| Critério de aceite 1 | CR1: Dado que o agente está cadastrando uma nova moradia, quando clica no botão "cadastrar localização", então o sistema deve exibir um mini-mapa de confirmação centralizado na posição obtida automaticamente do dispositivo em segundo plano, com um pin reposicionável; a localização só é registrada após o agente confirmar o pin. |
| Critério de aceite 2 | CR2: Dado que o agente está em local diferente da moradia real ou precisa corrigir o ponto, quando interage com o mini-mapa, então o sistema deve permitir reposicionar o pin (por toque ou arrasto) e refazer o registro (apagar e re-registrar com a posição atual), sem digitação manual de coordenadas. |
| Critérios INVEST | Independente: A captura de geolocalização e o mini-mapa de confirmação são independentes dos demais campos do formulário de moradia.; Negociável: A precisão exigida (ex.: margem de 5 a 10 metros) e o mapa-base utilizado podem ser acordados com o time.; Valiosa: Garante coordenadas confiáveis ao permitir confirmar e ajustar visualmente o pin, eliminando o erro humano na localização da casa.; Estimável: Reutiliza a biblioteca de mapas e a API nativa de geolocalização, com esforço previsível.; Pequena: Cobre a captura automática da posição e a confirmação/reposicionamento do pin no mini-mapa.; Testável: Simular coordenadas em emulador e validar a exibição do mini-mapa, o reposicionamento do pin e o registro somente após a confirmação. |

### Cadastro - Pets

| Identificação | US07 |
|---|---|
| Persona | João Silva (Agente de Campo) |
| User Story | "Como agente de campo, quero cadastrar os pets (se houver) da familia para tê-los na base de dados e ter conhecimento da população animal das áreas de risco." |
| Critério de aceite 1 | CR1: Dado que o agente está cadastrando um núcleo familiar, quando a familia possui um pet, então o formulário deve permitir a inserção do(s) animal(is) com suas informações. |
| Critério de aceite 2 | CR2: Dado que o agente precisa cadastrar o pet da familia, quando houver mais de um pet no núcleo, então o sistema deve permitir o cadastro de multiplos pets de maneira organizada. |
| Critérios INVEST | Independente: O cadastro de animais não afeta os dados vitais dos seres humanos.; Negociável: A lista de categorias pode ser estendida para animais de grande porte dependendo da região.; Valiosa: Reduz a recusa de moradores em abandonar áreas de risco por causa de seus animais.; Estimável: É uma adição simples de atributos numéricos à entidade Domicílio.; Pequena: Pode ser finalizada em um ou dois dias de desenvolvimento.; Testável: Verificação da persistência e retorno no JSON do perfil do assistido. |

### Arquivo - Moradia

| Identificação | US08 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero ter a opção de arquivar moradias cadastradas, para ocultá-las das buscas mantendo o histórico de moradias que não estão mais ativas." |
| Critério de aceite 1 | CR1: Dado que um desastre natural ou tecnológico destruiu/evacuou uma moradia, quando acessada a área de edição dos dados e clicado em "Arquivar moradia" na seção de moradia, então o sistema deve definir aquela moradia como inativa no banco de dados e ocultá-la do sistema de busca e visualização por mapa normal, disponibilizando sua visualização apenas quando o filtro de "moradias inativas" estiver ativo nas telas. |
| Critério de aceite 2 | CR2: Dado que uma moradia foi arquivada, quando o gestor acessa o painel de visualização dessa moradia (com o filtro de "moradias inativas" ativo), então deve estar disponível um botão de "Desarquivar" que retorna a moradia ao estado ativo, voltando a exibi-la nas buscas e no mapa. |
| Critério de aceite 3 | CR3: Dado que uma moradia com moradores vinculados é arquivada, quando o arquivamento é confirmado, então os moradores permanecem ativos e passam a ser sinalizados com o indicador de "cadastro incompleto" (motivo: sem moradia). |
| Critérios INVEST | Independente: A inativação lógica (soft delete) e o desarquivamento não dependem de novos registros.; Negociável: Os motivos do arquivamento podem ser populados a partir de um domínio expansível.; Valiosa: Mantém a integridade do banco de dados enquanto limpa a visão operacional.; Estimável: Requer flags de status, atualização das queries e a propagação do aviso aos moradores vinculados.; Pequena: Funcionalidade contida — arquivar, desarquivar e sinalizar os moradores — e de rápida implementação.; Testável: Garantir que moradias arquivadas não retornem em chamadas ativas, que o botão de desarquivar as reative e que os moradores vinculados fiquem com "cadastro incompleto". |

### Arquivo - Morador

| Identificação | US09 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero ter a opção de arquivar moradores cadastrados, para ocultá-los das buscas mantendo o histórico de cidadãos que não estão mais ativos." |
| Critério de aceite 1 | CR1: Dado que por alguma circunstância um morador seja considerado inativo (morte, desaparecimento, mudança), quando acessada a área de edição dos dados e clicado em "Arquivar morador", na seção de cidadão, em um dos moradores, então o sistema deve definir aquele morador como inativo no banco de dados e ocultá-lo do sistema de busca e estatísticas normal, disponibilizando sua visualização apenas quando o filtro de "moradores inativos" estiver ativo nas telas. |
| Critério de aceite 2 | CR2: Dado que um morador foi arquivado, quando o gestor acessa o painel de visualização desse morador (com o filtro de "moradores inativos" ativo), então deve estar disponível um botão de "Desarquivar" que retorna o morador ao estado ativo. |
| Critério de aceite 3 | CR3: Dado que o morador a ser arquivado é o responsável pela família, quando o gestor confirma o arquivamento, então o sistema deve exigir a definição de um novo responsável entre os demais moradores ativos antes de concluir a operação. |
| Critérios INVEST | Independente: O arquivamento lógico do morador pode ser implementado sem impactar o cadastro ativo.; Negociável: Os campos e motivos relacionados à inativação (morte, desaparecimento, mudança) podem ser ajustados conforme as regras do sistema.; Valiosa: Mantém o histórico populacional preservado sem interferir nas operações correntes.; Estimável: Requer status lógico, filtros de consulta, desarquivamento e a regra de substituição do responsável.; Pequena: Escopo restrito a arquivar/desarquivar o morador e tratar a substituição quando ele for o responsável.; Testável: Garantir que moradores arquivados não retornem em consultas ativas, que o desarquivamento os reative e que o sistema exija um novo responsável ao arquivar o chefe da família. |

### Aviso 1 ano

| Identificação | US10 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero saber quais cadastros do sistema foram feitos a mais de 1 ano, para que eu possa guiar os agentes de campo para atualizar os dados de cadastro que tenham possívelmente mudado e manter a integridade das informações ." |
| Critério de aceite 1 | CR1: Dado que um cadastro existe no sistema, quando a data da última modificação ultrapassar 365 dias, então o sistema deve sinalizá-lo com o indicador de "cadastro desatualizado". |
| Critério de aceite 2 | CR2: Dado que o agente revisa e re-salva os dados de um núcleo familiar com alerta de desatualização, quando o formulário é enviado com sucesso, então a data de última modificação é renovada e o indicador de "cadastro desatualizado" no painel do Gestor Operacional deve desaparecer. |
| Critérios INVEST | Independente: A rotina roda em background e não interfere no fluxo de cadastro diário.; Negociável: O prazo de aviso pode ser parametrizável.; Valiosa: Evita o sucateamento dos dados em áreas de risco dinâmico.; Estimável: Configuração de uma job e um painel de notificações são tarefas comuns.; Pequena: Apenas identifica e lista pendências.; Testável: Alterar a data de modificação de um teste no banco para "Data Atual - 366 dias" e validar se o alerta dispara. |

### Obrigatoriedade - Responsavel na familia 

| Identificação | US11 |
|---|---|
| Persona | Wesley Souza (Gestor Operacional) |
| User Story | "Como gestor operacional, quero que toda moradia ativa possua obrigatoriamente um responsável e uma família vinculada, para garantir a integridade cadastral e facilitar a gestão operacional e social das famílias atendidas." |
| Critério de aceite 1 | CR1: Dado que uma moradia esteja ativa no sistema, quando não houver um morador definido como chefe de família, então o sistema deve exibir um alerta de inconsistência cadastral e impedir a finalização ou permanência do cadastro como ativo. |
| Critério de aceite 2 | CR2: Dado que um chefe de família seja arquivado, inativado ou removido da moradia, quando a alteração for confirmada, então o sistema deve exigir a definição de um novo chefe de família antes de concluir a operação. |
| Critérios INVEST | Independente: A validação do chefe de família pode ser implementada sem impactar os demais módulos do sistema.; Negociável: As regras de definição e substituição do chefe de família podem ser ajustadas conforme as políticas da Defesa Civil.; Valiosa: Garante consistência nos registros familiares e melhora a rastreabilidade das informações sociais.; Estimável: A implementação exige apenas validações de vínculo e regras de negócio simples.; Pequena: O escopo está restrito à obrigatoriedade e substituição do chefe de família.; Testável: O QA pode tentar manter uma moradia ativa sem chefe de família e validar se o sistema bloqueia a operação corretamente. |


# <a name="c3"></a>3. Projeto da Aplicação Web (sprints 1 a 5)

## 3.1. Requisitos do Sistema (sprints 1 a 5)

Este documento formaliza o que o sistema deve fazer, sob quais regras e com quais qualidades, com base nas User Stories levantadas para o projeto. O sistema tem como propósito central permitir a compreensão precisa da quantidade de pessoas em territórios de risco, operando de forma georreferenciada para identificar residências mesmo em locais sem endereçamento oficial — como barracos ou vielas —, utilizando coordenadas GPS capturadas no momento do cadastro.

O sistema atende primordialmente ao Agente de Campo (A01) no que tange à operatividade e à coleta de dados in loco, e ao Gestor Operacional (A02) na tomada de decisão estratégica. As funcionalidades de cadastro, visualização em mapa, filtros avançados e alertas de recadastro derivam diretamente das necessidades mapeadas nas US01 a US12.

---

### 3.1.1 Lista de Atores

| ID  | Nome do Ator                           | Descrição                                                                                                                                                                                      | Frequência de Uso | Proficiência Tecnológica |
|---|---|---|---|---|
| A01 | Agente de campo da Defesa Civil         | Coleta dados georreferenciados in loco, realiza vistorias em áreas de risco e alimenta o sistema com informações de interdições ou rotas obstruídas.                                           | Diária            | Média / Baixa            |
| A02 | Gestor operacional | Gerencia os parâmetros de monitoramento e extrai relatórios, análises e mapas de calor. Subsidia a tomada de decisão e o planejamento de contingência da prefeitura. | Diária            | Média             |

---

### 3.1.2 Requisitos Funcionais

| ID | Nome | Descrição | Tipo | Prioridade | Atores | US Origem | Status |
|---|---|---|---|---|---|---|---|
| RF001 | Cadastro de Dados Sociodemográficos e Vínculos | O sistema deve registrar os dados sociodemográficos dos cidadãos (nome, CPF único e válido, data de nascimento, escolaridade, situação ocupacional, indicador de doença crônica e de uso de medicação contínua) e resolver a classificação de vulnerabilidade de cada pessoa: associação a um ou mais grupos (N:N), com 'idoso' e 'criança 0–12 anos' derivados automaticamente da data de nascimento e os demais (gestante/lactante, PCD, mobilidade reduzida/acamado) marcados manualmente, recebendo 'nenhuma' quando nenhum se aplica. Cada cidadão é vinculado a uma família, que deve possuir exatamente um responsável (com NIS e renda informados); CPF duplicado bloqueia o cadastro. O vínculo da família a uma moradia é opcional — quando ausente, a família permanece ativa e recebe o indicador 'cadastro incompleto' (motivo: sem moradia). | Cadastro | Alta | A01, A02 | US01 | Parcial |
| RF002 | Cadastro Estrutural de Moradias | O sistema deve registrar as características físicas do imóvel — tipo de construção, número de pavimentos e condição de ocupação (valores conforme os enums definidos no modelo físico, seção 3.6) — e o endereço textual da moradia (logradouro, número, bairro, núcleo, complemento, referência e CEP; opcional, complementando as coordenadas capturadas no RF003) — além de um campo livre de observações, com upload opcional de até 2 fotos da fachada e do entorno (proibida foto de pessoas, RN07). | Cadastro | Alta | A01, A02 | US02 | Implementado |
| RF003 | Georreferenciamento de Moradias via GPS | O sistema deve obter automaticamente, em segundo plano, a posição do dispositivo do agente para pré-centralizar um mini-mapa de confirmação. O registro das coordenadas (latitude e longitude) é uma ação explícita: o sistema exibe um pin reposicionável (toque ou arrasto) e salva a localização somente após a confirmação, sem digitação manual; o registro pode ser refeito/reposicionado depois, inclusive na edição (pin exibido na posição salva). As coordenadas confirmadas são persistidas com a moradia. | Cadastro | Alta | A01, A02 | US06 | Parcial |
| RF004 | Visualização de Moradias em Mapa Georreferenciado | O sistema deve exibir no mapa marcadores (pins) correspondentes às coordenadas de todas as moradias ativas, lendo os dados persistidos no banco (RN11). Ao clicar em um marcador, o sistema abre um card resumido com os dados da moradia (incluindo a situação definida manualmente pelo gestor, RN08) e da família vinculada; o card contém um botão que redireciona para a aba de busca com a família aberta, onde estão as informações completas e o acesso à área de edição. O sistema não infere risco automaticamente. | Relatório / Consulta | Alta | A02 | US03 | Planejado |
| RF005 | Consulta Integrada de Moradia e Moradores | O sistema deve consolidar, em uma única tela, os dados estruturais do imóvel (incluindo a situação da moradia marcada manualmente pelo gestor, RN08) e os dados sociodemográficos de todos os ocupantes vinculados (responsável, moradores, indicadores de vulnerabilidade e pets), refletindo sempre o estado atual do banco (RN11). Quando a família não tiver moradia vinculada, exibir a flag 'cadastro incompleto'. | Consulta | Alta | A02 | US04 | Parcial |
| RF006 | Filtros Avançados de Moradias e Assistidos | O sistema deve permitir consultar e filtrar a lista de moradias e moradores a partir dos dados persistidos no banco (fonte oficial, RN11). Filtros previstos: atributos de vulnerabilidade (grupos prioritários) e características estruturais do imóvel (tipo de construção, pavimentos, condição de ocupação, situação). _(os filtros exatos serão definidos durante a implementação; exportação de lista está fora do escopo desta entrega)_ | Consulta | Média | A02 | US04 | **A validar** |
| RF007 | Cadastro de Animais de Estimação | O sistema deve permitir o cadastro individual dos animais de estimação de cada família (tipo — cachorro, gato, réptil, ave, roedor ou outros —, nome, porte, raça e cor), com upload opcional de foto por animal. O pet é vinculado à família (não à moradia), acompanhando-a em caso de mudança de domicílio (RN12). As informações ficam acessíveis na consulta da família/moradia para conhecer a população animal das áreas de risco. | Cadastro | Baixa | A01 | US07 | Implementado |
| RF008 | Visualização de Mapa de Calor | O sistema deve gerar uma camada (layer) de mapa de calor sobre o mapa georreferenciado, cruzada com filtros de grupos de vulnerabilidade selecionáveis (ex.: idosos, PCDs), agrupando as coordenadas das moradias ativas por intensidade e recalculando os clusters ao realizar zoom in/out. Os dados vêm do banco oficial (RN11) e respeitam a classificação de vulnerabilidade (RN04), sem inferir prioridade automática. | Relatório | Média | A02 | — | **Futuro** |
| RF009 | Arquivamento e Desarquivamento de Moradias | O sistema deve inativar logicamente (soft delete) moradias (ex.: destruídas, evacuadas ou desapropriadas), sem exigir motivo nem confirmação adicional (RN06), ocultando-as automaticamente da busca e do mapa de operações ativas e mantendo-as visíveis apenas no Histórico Inativo (filtro 'moradias inativas'). Deve permitir desarquivar uma moradia inativa, retornando-a ao estado ativo. Ao arquivar uma moradia com moradores vinculados, estes permanecem ativos e passam a exibir o indicador 'cadastro incompleto' (motivo: sem moradia). | Atualização | Média | A02 | US08 | Parcial |
| RF010 | Arquivamento e Desarquivamento de Moradores | O sistema deve inativar logicamente (soft delete) moradores que deixem de pertencer à área (ex.: falecimento, desaparecimento ou mudança), sem exigir motivo, data ou confirmação adicional (RN06), removendo-os das listagens, buscas e estatísticas ativas e preservando o registro no Histórico de Moradores (filtro 'moradores inativos'). Quando o morador inativado for o responsável pela família, o sistema deve exigir a definição de um novo responsável entre os moradores ativos antes de concluir; se não restar nenhum morador, a família é arquivada. Deve permitir desarquivar um morador inativo, retornando-o ao estado ativo. | Atualização | Média | A02 | US09 | Parcial |
| RF011 | Alerta Automático de Recadastro (12 meses) | O sistema deve detectar automaticamente fichas sem modificação há mais de 365 dias e sinalizar a necessidade de recadastro, exibindo no painel de visualização/mapa o total de cadastros desatualizados versus atualizados. _(o mecanismo de notificação ao gestor será definido durante a implementação)_ | Outro | Média | A01, A02 | US10 | Planejado |
| RF012 | Atualização Anual de Dados pelo Agente de Campo | O sistema deve permitir a reedição dos dados estruturais e sociodemográficos de domicílios com alerta de desatualização ativo, removendo automaticamente o indicador "desatualizado" do painel do gestor após o salvamento. | Atualização | Média | A01 | US05, US10 | Parcial |
| RF013 | Cadastro Completo da Família (Transacional) | O sistema deve permitir ao Agente de Defesa Civil (A01) registrar, em uma única ação transacional, a moradia com sua localização, a família, o responsável, os dependentes e os pets — garantindo que nenhum dado parcial seja persistido caso a operação falhe (tudo-ou-nada). | Cadastro | Alta | A01 | US01, US02, US06, US07 | Implementado |
| RF014 | Gestão de Família e Vínculos | O sistema deve tratar a família como entidade própria, vinculando pessoas a famílias e famílias a moradias em relação N:N, e preservando o histórico de entrada e saída desses vínculos (registrando data de saída em vez de apagar o registro). A inativação de uma família é lógica (soft delete), conforme RN06; uma família que fique sem nenhuma pessoa ativa é arquivada (RN01). | Cadastro / Atualização | Alta | A01, A02 | US01 | Parcial |
| RF015 | Marcação Manual da Situação da Moradia | O sistema deve permitir ao agente de campo e ao gestor (A01, A02) definir e atualizar manualmente a situação da moradia entre Ativa, Interditada, Em Risco e Demolida, registrando apenas a marcação informada — o sistema não infere risco automaticamente (RN08). A situação é refletida no card do mapa e na consulta da moradia. | Atualização | Média | A01, A02 | — | Parcial |
| RF016 | Busca de Pessoas / Responsáveis | O sistema deve permitir buscar pessoas por nome, CPF, e-mail ou telefone (normalizando dígitos quando aplicável), com escopo configurável (ativas, inativas/arquivadas ou todas), retornando os dados básicos das pessoas encontradas a partir do banco oficial (RN11). | Consulta | Média | A02 | US04 | Implementado |
| RF017 | Indicador de Cadastro Incompleto | O sistema deve sinalizar automaticamente como "cadastro incompleto" as famílias sem moradia vinculada — único motivo possível, já que toda família ativa tem responsável (RN01). O indicador é exibido na busca/consulta e removido automaticamente quando a família passa a ter uma moradia vinculada (RN03, RN10). | Outro | Média | A01, A02 | US01, US04 | Planejado |
| RF018 | Armazenamento Seguro de Fotos | O sistema deve armazenar as fotos de moradias e de pets em bucket privado, gerando URLs de upload e de leitura assinadas e temporárias, validando tipo (jpeg/png/webp) e tamanho máximo do arquivo. Não há armazenamento de foto de pessoas (RN07). | Outro | Média | A01, A02 | US02, US07 | Implementado |
| RF019 | Edição de Cadastro | O sistema deve permitir, a partir da busca ou do mapa, editar os dados de qualquer família, morador ou moradia, abrindo o formulário de cadastro já pré-preenchido (independentemente de existir indicador de desatualização). Inclui a reedição dos dados sociodemográficos e estruturais e, na moradia, o reposicionamento da localização no mini-mapa (RF003). Ao salvar com os dados obrigatórios completos, o indicador 'cadastro incompleto' é removido quando aplicável (RN10). | Atualização | Alta | A01, A02 | US05 | Parcial |

---

### 3.1.3 Regras de Negócio

| ID | Nome | Descrição | Pré-condição | Consequência do Descumprimento | Atores | RFs Associados |
|---|---|---|---|---|---|---|
| RN01 | Família Ativa Deve Possuir Responsável | Toda família ativa deve ter um cidadão definido manualmente como responsável, e esse responsável deve ter seus dados obrigatórios preenchidos (conforme as VC do cidadão e do responsável). O cadastro da família só é concluído com um responsável vinculado e completo, mesmo sem moradia associada. Uma família que fique sem nenhuma pessoa deve ser arquivada (não pode permanecer ativa). | Família ativa em criação ou edição. | Família sem responsável (ou com responsável incompleto) prejudica contato, recadastro e evacuação. | A01, A02 | RF001 |
| RN02 | Responsável Único por Família | Cada família ativa tem exatamente um responsável; o sistema não permite dois responsáveis ativos simultâneos na mesma família. Ao tentar trocar o responsável, o sistema exige uma confirmação antes de aplicar a mudança — confirmada, o responsável anterior deixa de sê-lo e o novo assume. | Família ativa, com um cidadão sendo definido ou trocado como responsável. | Duplicidade de responsabilidade gera conflito de contato e leitura errada dos núcleos familiares. | A01, A02 | RF001 |
| RN03 | Família Pode Ser Cadastrada Sem Moradia (Cadastro Incompleto) | É permitido cadastrar uma família sem moradia vinculada; nesse caso ela permanece ativa, porém sinalizada com o indicador "cadastro incompleto" (motivo: sem moradia) até ser vinculada a uma moradia ou situação de abrigo/realocação. | Dados obrigatórios da família e do responsável preenchidos (ver RN01). | Famílias vulneráveis sem residência definida deixariam de ser registradas, prejudicando o acompanhamento social e a resposta emergencial. | A01, A02 | RF001 |
| RN04 | Registro Obrigatório de Indicadores de Vulnerabilidade | Toda pessoa cadastrada deve ter sua classificação de vulnerabilidade resolvida: pode estar associada a um ou mais grupos de vulnerabilidade (relação N:N) e, quando nenhum se aplica, recebe "nenhuma". Os grupos "idoso" e "criança (0–12 anos)" são atribuídos automaticamente pela data de nascimento; os demais (gestante/lactante, PCD, mobilidade reduzida/acamado) são marcados manualmente. A priorização de atendimento em evacuações é responsabilidade operacional dos agentes com base nesses dados; o sistema não exibe hierarquia automática de priorização. | Existência de registro de pessoa vinculada a uma família. | Classificação de vulnerabilidade ausente ou incorreta compromete o planejamento de evacuação pelos agentes de campo. | A01, A02 | RF001 |
| RN05 | Captura e Confirmação de Geolocalização da Moradia | A obtenção da posição do dispositivo é feita automaticamente pelo sistema em segundo plano (chamada ao serviço de localização, sem interação visível), para agilizar o preenchimento — especialmente na edição. O registro da localização é uma ação explícita do agente: ao clicar em "cadastrar localização", o sistema exibe um mini-mapa de confirmação com pin reposicionável (toque ou arrasto); a localização só é salva após a confirmação, podendo ser refeita/reposicionada posteriormente. | Cadastro ou edição de moradia em andamento (assume-se conexão e GPS disponíveis). | Sem localização confirmada, a moradia não aparece no mapa nem pode ser localizada em resgates. | A01 | RF002, RF003 |
| RN06 | Arquivamento Lógico (Soft Delete) e Conformidade LGPD | Moradores, famílias e moradias nunca são excluídos fisicamente do banco: são inativados logicamente (soft delete), com o status alterado para inativo e o registro preservado para histórico, auditoria e rastreabilidade, em conformidade com a LGPD. Não é exigido motivo nem confirmação adicional para a inativação. | Existência de um registro ativo (morador, família ou moradia) selecionado para inativação. | Deleção física viola a LGPD e elimina o histórico necessário para relatórios e auditorias. | A01, A02 | RF009, RF010 |
| RN07 | Proibição de Foto de Pessoas (LGPD) | É estritamente proibido o registro fotográfico de pessoas cadastradas. Apenas fotos da fachada e do entorno do imóvel são permitidas, limitadas a no máximo 2 por moradia. | Upload de foto vinculada a uma moradia. | Foto de pessoas viola a LGPD e os direitos de imagem dos cidadãos. | A01 | RF002 |
| RN08 | Marcação Manual da Situação da Moradia | A situação operacional da moradia (Ativa, Interditada, Em Risco, Demolida) é definida manualmente pelo agente de campo ou pelo gestor; o sistema apenas registra a marcação, não infere risco automaticamente. | Moradia ativa cadastrada. | Sem a situação marcada, perde-se a visão operacional do estado físico e de risco do imóvel. | A01, A02 | RF002, RF004, RF015 |
| RN09 | Recadastro Obrigatório a cada 12 Meses | O sistema deve detectar automaticamente fichas de moradores e moradias cuja data de última modificação ultrapasse 365 dias e sinalizá-las com o indicador "cadastro desatualizado". O alerta persiste até que os dados sejam revisados e re-salvos (recadastro). | Ficha com data de última modificação superior a 365 dias. | Dados desatualizados podem comprometer planos de evacuação e a distribuição de recursos humanitários. | A01 | RF011, RF012 |
| RN10 | Limpeza Automática dos Indicadores | Os indicadores "cadastro incompleto" e "cadastro desatualizado" são removidos automaticamente quando a condição que os gerou deixa de existir (dados obrigatórios completados; ficha revisada e re-salva). | Registro com indicador ativo sendo editado/completado. | Indicadores que não somem geram ruído e mascaram as pendências reais. | A01, A02 | RF005, RF011, RF012 |
| RN11 | Fonte Oficial dos Dados Operacionais | Consultas, filtros, busca textual e mapa devem usar os dados persistidos no banco (Supabase) como fonte oficial — nunca dados fixos/mockados na interface. As telas devem refletir sempre o estado atual do banco (registros ativos e suas coordenadas). | Dados cadastrados no banco e consulta feita pela aplicação. | Gestores veriam informação divergente da base real, comprometendo decisões. | A02 | RF004, RF005, RF006 |
| RN12 | Pet Vinculado à Família (Não à Moradia) | Pets são vinculados à família, e não diretamente à moradia; quando a família muda de moradia, os pets a acompanham automaticamente. | Família cadastrada; cadastro de pet. | Vincular o pet à moradia faria o animal "sumir" quando a família se mudasse, perdendo o controle da população animal das áreas de risco. | A01 | RF007 |

---

### 3.1.4 Validações de Campo (VC)

As Validações de Campo (VC) definem as restrições de preenchimento obrigatório, unicidade e domínio aplicadas a cada campo no momento do cadastro/edição, antes da persistência. Elas se distinguem das Regras de Negócio (3.1.3): a VC atua sobre um único campo/registro, enquanto a RN expressa políticas e relações entre entidades.

| ID | Campo / Validação | Entidade | Tipo | Observação |
|---|---|---|---|---|
| VC01 | Nome completo preenchido | Cidadão | Obrigatório | — |
| VC02 | Data de nascimento preenchida | Cidadão | Obrigatório | Base para derivar automaticamente "idoso" e "criança (0–12 anos)" |
| VC03 | CPF preenchido, único e válido | Cidadão | Obrigatório + Único | Vale para todos os cidadãos; bloqueia cadastro duplicado; precisa ser válido |
| VC04 | Vínculo a uma família | Cidadão | Obrigatório | Todo cidadão pertence a uma família |
| VC05 | Classificação de vulnerabilidade (≥ 1 grupo) | Cidadão | Obrigatório | Relação N:N (cidadão ↔ vulnerabilidade); recebe "nenhuma" quando nenhum grupo se aplica; "idoso"/"criança" derivados da data de nascimento |
| VC06 | Grau de parentesco com o responsável | Cidadão | Obrigatório | — |
| VC07 | NIS único; renda ≥ 0 | Responsável | Único + Range | O responsável é um cidadão marcado manualmente; o CPF é validado na VC03 (Cidadão) |
| VC08 | Tipo de construção, nº de pavimentos e condição de ocupação | Moradia | Obrigatório | — |
| VC09 | Coordenadas (latitude e longitude) | Moradia | Obrigatório | Endereço textual (rua, número) é opcional |
| VC10 | Limite de fotos da moradia | Moradia | Máx. 2 | Apenas fachada/entorno; proibida foto de pessoa (ver RN de geolocalização/LGPD) |
| VC11 | Escolaridade preenchida | Cidadão | Obrigatório (enum) | — |
| VC12 | Situação ocupacional preenchida | Cidadão | Obrigatório (enum) | — |
| VC13 | Indicador de doença crônica | Cidadão | Obrigatório (booleano) | Default "não"; nunca nulo |
| VC14 | Indicador de uso de medicação contínua | Cidadão | Obrigatório (booleano) | Default "não"; nunca nulo |

---

### 3.1.5 Requisitos Não Funcionais — ISO/IEC 25010:2011
| ID | Eixo | Descrição | Derivação e Contexto do Parceiro | Evolução do conceitual para técnico | Métrica Objetiva / Critério de Aceite | Evidência de Implementação | Conexão com RFs | Como Verificar |
|---|---|---|---|---|---|---|---|---|
| RNF001 | **Usabilidade** | O sistema deve facilitar o preenchimento e a consulta de cadastros por meio de payloads padronizados, validações de entrada e respostas de erro compreensíveis. Evitando assim, a escrita de dados errados, inconsistentes e dados não padronizados.  | Derivado da US01 e US02: agentes atuam em áreas de risco sob pressão e precisam registrar dados de pessoas, moradias e famílias com o menor número possível de inconsistências. | O requisito evoluiu para decisões técnicas como uso de DTOs, funções de normalização em `request-utils.ts` e validações específicas em `validations/`, reduzindo erros de entrada antes que os dados cheguem aos services. | 100% das requisições com payload inválido retornam `400` com campo de erro descritivo; cobertura de branches em `validations/` ≥ 67% (medido: 67,07% — seção 5.1.4.2). | Relatório de cobertura — seção 5.1.4.2: `validations/` com 67,07% branches e 61,30% statements; funções de normalização em `request-utils.ts` ativas; CT06, CT34, CT96 validam respostas de erro descritivas. | RF001, RF002, RF005, RF012 | Testar chamadas da API com dados válidos e inválidos, verificando se os erros retornados orientam a correção do preenchimento. |
| RNF002 | **Confiabilidade** | O backend deve preservar a integridade dos dados em operações compostas, evitando cadastros parciais quando uma etapa do processo falha. | Derivado da necessidade de manter cadastros familiares, moradias, responsáveis e vínculos consistentes, já que dados incompletos podem prejudicar consultas e ações da Defesa Civil. | O requisito evoluiu para o uso de transações nos services, com `BEGIN`, `COMMIT` e `ROLLBACK` em operações que envolvem múltiplas tabelas, como cadastro de responsável, moradia com localização e núcleo familiar. | 0 registros parciais persistidos em operações compostas com falha simulada; atomicidade validada pelo CT94 — `POST /api/familias/nucleo`. | Transações `BEGIN/COMMIT/ROLLBACK` implementadas nos services de família, moradia e responsável; CT94 — falha em etapa obrigatória não persiste dados parciais (seção 5.1.4.2). | RF001, RF002, RF003, RF012 | Simular falhas durante cadastros compostos e verificar se nenhum registro parcial permanece persistido no banco. |
| RNF003 | **Eficiência de desempenho** | O sistema deve manter uma organização que permita consultas e operações de cadastro com baixo acoplamento e possibilidade de otimização futura. | Derivado da necessidade de consulta rápida a pessoas, moradias, famílias, pets e fotos, especialmente em cenários de uso operacional. | O requisito evoluiu para a separação entre controllers, services e repositories. O acesso ao banco foi isolado em repositories, permitindo otimizar queries SQL sem alterar a lógica dos controllers ou services. | Endpoints de consulta (`GET /api/moradias`, `GET /api/pessoas`) com objetivo de resposta < 1s; 0 dependências diretas entre controller e repository (acoplamento zero via service). | Separação controller → service → repository documentada na seção 3.2.1; queries SQL isoladas em `repositories/` sem lógica de negócio; cobertura de services: 72,26% statements (seção 5.1.4.2). | RF004, RF005, RF006, RF011 | Medir tempo de resposta dos endpoints principais e revisar queries em repositories para identificar pontos de otimização. |
| RNF004 | **Adequação funcional** | A API deve oferecer endpoints coerentes com os fluxos centrais do sistema, cobrindo cadastro, consulta, atualização e remoção de pessoas, moradias, famílias, pets e fotos. Com todos estes seguindo o protocólo HTTP correto. | Derivado da necessidade de transformar os fluxos definidos no WAD em operações concretas no backend. | O requisito evoluiu para rotas REST organizadas por domínio em `routes/`, com controllers e services específicos para cada módulo funcional da aplicação. | 56 de 64 endpoints planejados implementados (88%); cobertura de branches em `controllers/` de 64,01% (seção 5.1.4.2). | 56 endpoints documentados em `documentos/endpoints.md` e `documentos/webapi-docs.html`; cobertura de controllers: 87,81% statements (seção 5.1.4.2). | Todos os RFs | Conferir a documentação da WebAPI e testar se os endpoints existentes cobrem os fluxos previstos nos requisitos funcionais. |
| RNF005 | **Interoperabilidade** | A aplicação deve ser acessível por tecnologias web amplamente compatíveis e permitir consumo dos mesmos endpoints por diferentes interfaces. | Derivado da necessidade de uso em diferentes dispositivos e contextos, incluindo telas de cadastro, consulta e uso futuro em mobile/PWA. | O requisito evoluiu para uma API REST em Express com contratos JSON sob o prefixo `/api`, consumida por um frontend SPA (React/Vite) e por clientes HTTP genéricos (curl/Postman). | Os mesmos endpoints JSON são consumidos pelo frontend SPA e por clientes HTTP genéricos sem adaptação; acessíveis em Chrome, Firefox e Edge sem configuração adicional. | Frontend implantado em `georisco-frontend.vercel.app` consome a API em `georisco.vercel.app/api`; o frontend e o `curl` consomem exatamente os mesmos endpoints (seções 3.2.6 e 3.7). | RF001, RF002, RF003, RF004 | Testar a aplicação em navegadores e resoluções diferentes, verificando se os endpoints continuam acessíveis e consistentes. |
| RNF006 | **Segurança** | O sistema deve reduzir exposição de dados sensíveis e arquivos, validando entradas, controlando erros e evitando acesso direto a detalhes internos da aplicação. Importante explicitar que deve-se garantir que logs de erros ou informacionais do sistema não exponham dados sensíveis. | Derivado da LGPD e do tratamento de dados sensíveis de cidadãos vulneráveis, além da necessidade de proteger fotos e informações cadastrais. | O requisito evoluiu para validações de payload, uso de `HttpError`, tratamento padronizado com `handleControllerError` e integração com Supabase Storage por URLs assinadas. | 0 stack traces ou dados de infraestrutura expostos em respostas de erro; todas as respostas de erro no formato `{ "error": "..." }` sem campos internos do banco. | `handleControllerError` centraliza tratamento de erros em todos os controllers; CT06, CT34, CT96 — requisições inválidas retornam `400` sem dados internos ou caminhos sensíveis de storage. | RF001, RF002, RF009, RF010 | Enviar requisições inválidas e verificar se as respostas de erro são controladas e não expõem informações internas. |
| RNF007 | **Compatibilidade** | O sistema deve separar o armazenamento de metadados do armazenamento de arquivos, permitindo integração entre PostgreSQL e serviço externo de storage. | Derivado da necessidade de registrar fotos de moradias e pets sem sobrecarregar o banco relacional com arquivos binários. | O requisito evoluiu para endpoints próprios de fotos e upload mediado por Supabase Storage. O banco mantém vínculos e metadados, enquanto o storage externo armazena os arquivos. | URL assinada gerada com sucesso em 100% dos casos testados (CT42, CT89); banco armazena apenas metadados e URL; arquivo físico isolado no bucket `georisco-fotos`. | CT42 e CT89 validados; `foto-storage.service.ts` com 93,93% cobertura (seção 5.1.4.2); banco mantém URL e metadados; arquivo físico no Supabase Storage. | RF002, RF007 | Testar criação de URL assinada, cadastro de foto e vínculo com moradia ou pet, verificando integração entre API, banco e storage. |
| RNF008 | **Manutenibilidade** | O projeto deve manter uma estrutura organizada, auditável e segura para evolução, testes e uso de dados fictícios durante o desenvolvimento. | Derivado da necessidade de evolução contínua do projeto em sprints, com separação clara de responsabilidades e redução do risco de uso indevido de dados reais. | O requisito evoluiu para a organização do backend em `controllers`, `services`, `repositories`, `dtos`, `models`, `validations`, `errors`, `db` e `storage`, além do uso de variáveis de ambiente para configurações sensíveis. | 9 módulos separados por responsabilidade; cobertura geral de 72,67% statements (seção 5.1.4.2); 0 dados reais utilizados nos testes. | Estrutura de 9 módulos documentada na seção 3.2.1; variáveis de ambiente em `dotenv` isolam configurações sensíveis; dados fictícios em todos os testes unitários e de integração. | Todos os RFs | Revisar estrutura de pastas, testes e dados utilizados em desenvolvimento, garantindo que a evolução do sistema não dependa de dados reais. |

## 3.1.6. Matriz RF → RN → Endpoint (sprints 3 a 5)
 
Matriz de cobertura que demonstra quais RN (Regras de Negócio) e endpoints implementam cada RF (Requisito Funcional). A matriz reflete a numeração atual de requisitos (RF001–RF019, seção 3.1.2) e de regras de negócio (RN01–RN12, seção 3.1.3), e os endpoints estão alinhados com a implementação real do backend (`src/geoRisco/src/routes/`) e com a relação detalhada da seção 3.7, também formalizada em `documentos/webapi-docs.html` e `documentos/endpoints.md`. Cada linha associa um endpoint a um RF; endpoints que atendem a mais de um RF aparecem em mais de uma linha.
 

#### Referência Rápida — Regras de Negócio
| RN | Nome resumido | Regra em uma linha |
|---|---|---|
| RN01 | Responsável obrigatório | Toda família ativa precisa de exatamente um responsável com dados completos |
| RN02 | Responsável único | Não há dois responsáveis simultâneos na mesma família; troca exige confirmação |
| RN03 | Família sem moradia | Família pode ser cadastrada sem moradia; recebe flag "cadastro incompleto" |
| RN04 | Vulnerabilidade obrigatória | Toda pessoa tem grupo(s) de vulnerabilidade; "idoso"/"criança" são automáticos |
| RN05 | GPS confirmado | Localização da moradia é salva somente após confirmação explícita do pin |
| RN06 | Soft delete | Moradores, famílias e moradias nunca são deletados fisicamente — histórico preservado |
| RN07 | Sem foto de pessoas | Fotos permitidas apenas para fachada/entorno de moradias e para pets |
| RN08 | Situação manual | Status da moradia é marcado manualmente; sem inferência automática de risco |
| RN09 | Recadastro anual | Fichas sem atualização há > 365 dias recebem flag "cadastro desatualizado" |
| RN10 | Limpeza automática | Flags "incompleto" e "desatualizado" somem quando a condição que as gerou é resolvida |
| RN11 | Fonte oficial | Consultas usam dados do banco — nunca dados fixos ou mockados na interface |
| RN12 | Pet segue família | Pet é vinculado à família; ao mudar de moradia, os pets a acompanham |

#### Status de Implementação por RF
| RF | Status | Observação |
|---|---|---|
| RF001 | ✅ Implementado | Endpoints de pessoas, responsáveis e famílias ativos; grupos prioritários pendentes |
| RF002 | ✅ Implementado | Moradia e fotos via Supabase Storage |
| RF003 | ⚠️ Parcial | Coordenadas persistidas; UI de mini-mapa de confirmação planejada para o frontend |
| RF004 | ⚠️ Parcial | Dados retornados pelo endpoint; renderização de marcadores no mapa depende do frontend |
| RF005 | ⚠️ Parcial | Detalhes e histórico implementados; `/consulta-integrada` não entregue |
| RF006 | ⚠️ Parcial | Listagem com filtros básicos; filtros avançados por vulnerabilidade planejados |
| RF007 | ✅ Implementado | Pets e fotos de pets com CRUD completo |
| RF008 | 🚧 Planejado | Sem endpoint implementado nesta entrega |
| RF009 | ⚠️ Parcial | Soft delete via `DELETE` implementado; `PATCH` de status com restrição de enum planejado |
| RF010 | ⚠️ Parcial | Soft delete de pessoas e responsáveis implementado; substituição de responsável a validar |
| RF011 | 🚧 Planejado | Sem endpoint implementado nesta entrega |
| RF012 | ⚠️ Parcial | `PUT` de pessoa, responsável e moradia ativos; limpeza de alerta vinculada ao RF011 |
| RF013 | ✅ Implementado | `POST /api/familias/nucleo` transacional e completo |
| RF014 | ✅ Implementado | Vínculos família-pessoa e família-moradia com histórico |
| RF015 | ⚠️ Parcial | `PUT` de moradia ativo; restrição `STATUS_MORADIA_CLIENTE` planejada |
| RF016 | ✅ Implementado | Busca por nome, CPF, e-mail e telefone com escopo configurável |
| RF017 | ⚠️ Parcial | Indicador existe no modelo; exibição automática ainda em validação |
| RF018 | ✅ Implementado | URLs assinadas para upload e leitura; bucket `georisco-fotos` |
| RF019 | ⚠️ Parcial | `PUT` de cadastros ativo; formulário pré-preenchido depende do frontend |
| RF | RN associadas | Endpoint | Método |
|----|---------------|----------|--------|
| RF001 | RN01, RN02, RN03, RN04 | `/api/pessoas` | POST |
| RF001 | RN01, RN02, RN03, RN04 | `/api/pessoas` | GET |
| RF001 | RN01, RN02, RN03, RN04 | `/api/pessoas/{id}` | GET |
| RF001 | RN01, RN02, RN03, RN04 | `/api/responsaveis` | POST |
| RF001 | RN01, RN02, RN03, RN04 | `/api/responsaveis` | GET |
| RF001 | RN01, RN02, RN03, RN04 | `/api/responsaveis/{id}` | GET |
| RF001 | RN01, RN02, RN03, RN04 | `/api/familias` | POST |
| RF002 | RN05, RN07, RN08 | `/api/moradias` | POST |
| RF002 | RN05, RN07, RN08 | `/api/moradias/{id}/fotos` | POST |
| RF002 | RN05, RN07, RN08 | `/api/moradias/{id}/fotos` | GET |
| RF003 | RN05 | `/api/moradias` | POST |
| RF004 | RN08, RN11 | `/api/moradias` | GET |
| RF005 | RN08, RN10, RN11 | `/api/moradias/{id}` | GET |
| RF005 | RN08, RN10, RN11 | `/api/moradias/{id}/detalhes` | GET |
| RF006 | RN11 | `/api/moradias` | GET |
| RF007 | RN12 | `/api/pets` | GET |
| RF007 | RN12 | `/api/pets/{id}` | GET |
| RF007 | RN12 | `/api/pets` | POST |
| RF007 | RN12 | `/api/pets/{id}` | PUT |
| RF007 | RN12 | `/api/pets/{id}` | DELETE |
| RF007 | RN12 | `/api/familias/{id}/pets` | GET |
| RF007 | RN12 | `/api/familias/{id}/pets` | POST |
| RF007 | RN12 | `/api/pets/{id}/fotos` | GET |
| RF007 | RN12 | `/api/pets/{id}/fotos` | POST |
| RF009 | RN06 | `/api/moradias/{id}` | DELETE |
| RF010 | RN06 | `/api/pessoas/inativas` | GET |
| RF010 | RN06 | `/api/pessoas/{id}` | DELETE |
| RF010 | RN06 | `/api/responsaveis/{id}` | DELETE |
| RF012 | RN09, RN10 | `/api/pessoas/{id}` | PUT |
| RF012 | RN09, RN10 | `/api/responsaveis/{id}` | PUT |
| RF012 | RN09, RN10 | `/api/moradias/{id}` | PUT |
| RF013 | — | `/api/familias/nucleo` | POST |
| RF014 | RN01, RN06 | `/api/familias` | GET |
| RF014 | RN01, RN06 | `/api/familias/{id}` | GET |
| RF014 | RN01, RN06 | `/api/familias` | POST |
| RF014 | RN01, RN06 | `/api/familias/{id}` | DELETE |
| RF014 | RN01, RN06 | `/api/familias/{id}/pessoas` | GET |
| RF014 | RN01, RN06 | `/api/familias/{id}/pessoas/historico` | GET |
| RF014 | RN01, RN06 | `/api/familias/{id}/pessoas` | POST |
| RF014 | RN01, RN06 | `/api/familias/{id}/pessoas/{pessoaId}` | DELETE |
| RF014 | RN01, RN06 | `/api/familias/{id}/moradias` | GET |
| RF014 | RN01, RN06 | `/api/familias/{id}/moradias/historico` | GET |
| RF014 | RN01, RN06 | `/api/familias/{id}/moradias` | POST |
| RF014 | RN01, RN06 | `/api/familias/{id}/moradias/{moradiaId}` | DELETE |
| RF014 | RN01, RN06 | `/api/familias/{id}/pets` | GET |
| RF014 | RN01, RN06 | `/api/familias/{id}/pets` | POST |
| RF014 | RN01, RN06 | `/api/moradias/{id}/familias/historico` | GET |
| RF014 | RN01, RN06 | `/api/responsaveis` | GET |
| RF014 | RN01, RN06 | `/api/responsaveis/{id}` | GET |
| RF014 | RN01, RN06 | `/api/responsaveis` | POST |
| RF014 | RN01, RN06 | `/api/responsaveis/{id}` | PUT |
| RF015 | RN08 | `/api/moradias/{id}` | PUT |
| RF016 | RN11 | `/api/pessoas` | GET |
| RF016 | RN11 | `/api/pessoas/busca` | GET |
| RF017 | RN01, RN03, RN10 | `/api/familias` | POST |
| RF017 | RN01, RN03, RN10 | `/api/familias/{id}/moradias` | POST |
| RF018 | RN07 | `/api/fotos` | GET |
| RF018 | RN07 | `/api/fotos/{id}` | GET |
| RF018 | RN07 | `/api/fotos/{id}/signed-url` | GET |
| RF018 | RN07 | `/api/fotos/{id}` | PUT |
| RF018 | RN07 | `/api/fotos/{id}` | DELETE |
| RF018 | RN07 | `/api/moradias/{id}/fotos` | GET |
| RF018 | RN07 | `/api/moradias/{id}/fotos/upload-url` | POST |
| RF018 | RN07 | `/api/moradias/{id}/fotos` | POST |
| RF018 | RN07 | `/api/moradias/{id}/fotos/{fotoId}` | DELETE |
| RF018 | RN07 | `/api/pets/{id}/fotos` | GET |
| RF018 | RN07 | `/api/pets/{id}/fotos/upload-url` | POST |
| RF018 | RN07 | `/api/pets/{id}/fotos` | POST |
| RF018 | RN07 | `/api/pets/{id}/fotos/{fotoId}` | DELETE |
| RF019 | RN10 | `/api/pessoas/{id}` | PUT |
| RF019 | RN10 | `/api/responsaveis/{id}` | PUT |
| RF019 | RN10 | `/api/moradias/{id}` | PUT |
| RF019 | RN10 | `/api/pets/{id}` | PUT |

> **RFs sem endpoint nesta entrega:** RF008 (Visualização de Mapa de Calor — *Futuro*) e RF011 (Alerta Automático de Recadastro — *Planejado*) ainda não possuem endpoints no backend e serão incluídos quando implementados. O status de cada RF (Implementado, Parcial, Planejado, Futuro, A validar) consta na seção 3.1.2.
 
---

## 3.2. Arquitetura (sprints 1 a 5)

A arquitetura projetada para o sistema é, em suma, baseada na Arquitetura de Camadas (Layered Architecture), porém com a aplicação de: Arquitetura de Seis Camadas (6-Tier Architecture) com base em princípios SOLID e de separação de conceitos (Separation of Concerns). Dividindo a aplicação em componentes especializados e com responsabilidades muito bem definidas.
Assim, fornece um código testável, escalável e de alta manutenibilidade, permitindo que as regras de negócio fiquem isoladas de detalhes de infraestrutura (como o banco de dados) e da interface do usuário.

### 3.2.1. Diagrama de Arquitetura (sprints 3 e 4)

O diagrama abaixo apresenta uma visão simplificada da estrutura de pastas do backend. Ele mostra como o código está organizado por responsabilidade, separando inicialização da aplicação, rotas, controllers, services, repositories, DTOs, models, validações, banco de dados e storage.

```
src/
├── app.ts – configuração do Express, middlewares nativos e registro de rotas (API JSON pura; sem EJS ou arquivos estáticos)
├── server.ts – inicialização do servidor
├── controllers/ – borda HTTP e tratamento das requisições
├── routes/ – rotas/endpoints da aplicação
├── services/ – regras de negócio e orquestração entre repositórios
├── repositories/ – acesso ao banco de dados PostgreSQL
├── interfaces/ – contratos das camadas
│   ├── services/ – contratos dos services
│   └── repositories/ – contratos dos repositories
├── dtos/ – Data Transfer Objects e contratos de entrada/saída
├── models/ – tipos e interfaces de domínio
├── validations/ – validação dos payloads e regras de entrada
├── db/ – conexão, abstrações e migrações do banco de dados
│   └── migrations/ – versionamento do esquema do banco
├── storage/ – integração com Supabase Storage
├── public/ – arquivos estáticos
├── errors/ – erros customizados da aplicação
└── tests/ – testes automatizados

```

> **Modulo de Prioridades:** alem dos seis modulos principais (pessoas, responsaveis, familias, moradias, pets, fotos), o modulo `prioridade` contem `prioridade.controller.ts`, `prioridade.repository.ts` e `prioridade.routes.ts`. Nao possui service nem interface propria - o controller acessa o repository diretamente - e expoe `GET /api/prioridades`, `GET /api/pessoas/:id/prioridades` e `PUT /api/pessoas/:id/prioridades`.

O diagrama de classe arquitetural detalha a organização interna da aplicação a partir das principais camadas do backend. Ele apresenta a inicialização da aplicação em `server.ts` e `app.ts`, a camada de rotas responsável por expor os endpoints HTTP, os controllers que recebem e tratam as requisições, os DTOs e validações que padronizam os dados de entrada e saída, os services que concentram as regras de negócio, os repositories que acessam o banco de dados e os models que representam as entidades de domínio.

O fluxo principal do sistema segue a ordem: `server.ts` inicializa a aplicação, `app.ts` configura o Express e registra as rotas, as rotas encaminham as requisições para os controllers, os controllers normalizam e validam os dados antes de chamar os services, os services executam as regras de negócio e orquestram os repositories, e os repositories realizam as operações de persistência no PostgreSQL. Elementos como `Infrastructure`, `Validations`, `Errors`, `Storage`, `Views`, `Public` e `Tests` aparecem no diagrama como apoios transversais à aplicação.

<div align="center">
    <p>Figura 6: Diagrama de Classe Arquitetural - Ampliado</p>
    <img src="outros/diagramas_arquitetura/diagramaArquitetura-Ampliado.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Esta imagem apresenta a visão macro e completa da arquitetura do backend. Ela ilustra o fluxo de ponta a ponta, demonstrando como todas as camadas do sistema se interconectam. O fluxo começa na inicialização da aplicação, passa pela recepção das requisições HTTP, segue pela validação de dados, orquestração das regras de negócio e, finalmente, chega à persistência dos dados no banco. Essa visão é fundamental para entender a separação de responsabilidades (Separation of Concerns) e a modularidade da aplicação.

<div align="center">
    <p>Figura 7: Diagrama de Classe Arquitetural - Bootstrap e Express</p>
    <img src="outros/diagramas_arquitetura/diagramaArquitetura-Btstrp&Expr.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Este recorte foca na porta de entrada da aplicação. A camada de Bootstrap (geralmente arquivos como server.ts e app.ts) é responsável por configurar o servidor, aplicar os middlewares essenciais (como tratamento de JSON e CORS) e levantar o serviço. Em conjunto, a camada do Express (Rotas e Controllers) atua interceptando as requisições HTTP recebidas do cliente (frontend), extraindo os parâmetros e o corpo da requisição, e repassando o fluxo para as camadas internas de processamento, sem carregar lógica de negócio.

<div align="center">
    <p>Figura 8: Diagrama de Classe Arquitetural - Bootstrap e Express</p>
    <img src="outros/diagramas_arquitetura/diagramaArquitetura-Btstrp&Expr.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Este diagrama destaca a camada de Modelos (Models), que representa as entidades fundamentais do domínio da aplicação (como Pessoa, Moradia, Família, etc.). No contexto do projeto, os models atuam definindo os tipos, interfaces e a estrutura dos dados (contratos de dados) que circulam pelo sistema. Eles garantem que todas as outras camadas saibam exatamente qual é o formato correto dos objetos com os quais estão lidando, garantindo a consistência das informações.

<div align="center">
    <p>Figura 9: Diagrama de Classe Arquitetural - Models</p>
    <img src="outros/diagramas_arquitetura/diagramaArquitetura-Models.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Este diagrama destaca a camada de Modelos (Models), que representa as entidades fundamentais do domínio da aplicação (como Pessoa, Moradia, Família, etc.). No contexto do projeto, os models atuam definindo os tipos, interfaces e a estrutura dos dados (contratos de dados) que circulam pelo sistema. Eles garantem que todas as outras camadas saibam exatamente qual é o formato correto dos objetos com os quais estão lidando, garantindo a consistência das informações.

<div align="center">
    <p>Figura 10: Diagrama de Classe Arquitetural - Validations</p>
    <img src="outros/diagramas_arquitetura/diagramaArquitetura-Validations.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

A seção de Validations (Validações) e DTOs (Data Transfer Objects) é a barreira de segurança e consistência dos dados. Antes que a requisição chegue ao núcleo da aplicação (os Services), esta camada verifica se as informações enviadas pelo usuário seguem as regras esperadas (por exemplo, se campos obrigatórios foram preenchidos, se o CPF tem o formato correto, etc.). Se os dados forem inválidos, a requisição é barrada aqui e um erro claro é retornado, poupando processamento e evitando inconsistências no banco de dados.

<div align="center">
    <p>Figura 11: Diagrama de Classe Arquitetural - Repositories e Service</p>
    <img src="outros/diagramas_arquitetura/diagramaArquitetura-Repo&Serv.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Este recorte exibe o coração da aplicação, onde a lógica e o armazenamento operam em conjunto. A camada de Services é responsável por centralizar as regras de negócio: ela orquestra validações complexas, regras de vinculação (ex: atrelar uma pessoa a uma moradia) e transações. Para buscar ou salvar essas informações, os Services não acessam o banco diretamente; eles delegam essa tarefa para os Repositories. A camada de Repositórios abstrai a comunicação direta com o banco de dados (PostgreSQL/Supabase), contendo as queries e isolando a infraestrutura de dados da lógica central.

Documento disponível do diagrama para navegação e aprofundamento do entendimento: [diagramaArquitetura.md](diagramaArquitetura.md)

> **Versão em Mermaid (fonte da verdade: código).** Os diagramas abaixo são renderizados a partir do texto e servem de base fiel para regerar os PNGs acima. Refletem o backend atual (sem `views`/EJS) extraído de `src/geoRisco/src/`.

**Arquitetura em camadas — fluxo de uma requisição:**

```mermaid
flowchart TD
    Client["Frontend Web (SPA React/Vite) / Cliente HTTP"] --> Routes["routes/ (Express Routers, prefixo /api)"]
    Routes --> Controllers["controllers/ (borda HTTP + request-utils)"]
    Controllers --> Validations["validations/ + dtos/ (normalização e validação)"]
    Controllers --> Services["services/ (regras de negócio + transações BEGIN/COMMIT/ROLLBACK)"]
    Services --> Repositories["repositories/ (SQL)"]
    Repositories --> DB[("PostgreSQL / Supabase")]
    Services --> Storage["storage/ (supabase-storage.client)"]
    Storage --> Bucket[("bucket georisco-fotos")]
    Errors["errors/ (HttpError + handleControllerError)"] -.-> Controllers
    subgraph Prioridade["Módulo prioridade (exceção ao padrão)"]
        PController["prioridade.controller"] --> PRepo["prioridade.repository"]
    end
    PController --> Routes
    PRepo --> DB
```

**Diagrama de classes (camadas + interfaces):**

```mermaid
classDiagram
    class IPessoaService { <<interface>> }
    class IPessoaRepository { <<interface>> }
    class PessoaController
    class PessoaService
    class PessoaRepository
    class HttpError

    PessoaController --> IPessoaService : usa
    PessoaService ..|> IPessoaService : implementa
    PessoaService --> IPessoaRepository : usa
    PessoaRepository ..|> IPessoaRepository : implementa
    PessoaController ..> HttpError : lança

    class PrioridadeController
    class PrioridadeRepository
    PrioridadeController --> PrioridadeRepository : acesso direto (sem service/interface)

    class FotoStorageService
    class SupabaseStorageClient
    FotoStorageService --> SupabaseStorageClient : adapter
```

> O mesmo trio **Controller → Service → Repository** (com interfaces `I*Service`/`I*Repository`) repete-se para os módulos `pessoa`, `familia`, `moradia`, `pet` e `foto`. Os endpoints `/api/responsaveis` são atendidos pelo módulo `pessoa` (após a migration `09`, "responsável" deixou de ser tabela/módulo próprio e passou a ser uma pessoa com atributos específicos). O módulo `prioridade` é a única exceção ao padrão: o controller acessa o repository diretamente, sem service nem interface.

### 3.2.1.1. Mapeamento Endpoint → Componentes

A tabela abaixo mapeia cada grupo de endpoints ao controller, service e repository responsável, evidenciando a separação de responsabilidades da arquitetura em camadas e a relação direta com a API documentada em `documentos/endpoints.md`.

| Grupo de Endpoints | Controller | Service | Repository | Arquivo de Rotas |
|---|---|---|---|---|
| `/api/pessoas` e `/api/pessoas/:id` | `PessoaController` | `PessoaService` | `PessoaRepository` | `pessoa.routes.ts` |
| `/api/responsaveis` e `/api/responsaveis/:id` | `ResponsavelController` | `ResponsavelService` | `ResponsavelRepository` | `responsavel.routes.ts` |
| `/api/familias` e `/api/familias/:id/*` | `FamiliaController` | `FamiliaService` | `FamiliaRepository` | `familia.routes.ts` |
| `/api/moradias` e `/api/moradias/:id/*` | `MoradiaController` | `MoradiaService` | `MoradiaRepository` | `moradia.routes.ts` |
| `/api/pets` e `/api/pets/:id/*` | `PetController` | `PetService` | `PetRepository` | `pet.routes.ts` |
| `/api/fotos` e `/api/fotos/:id/*` | `FotoController` | `FotoStorageService` | `FotoRepository` | `foto.routes.ts` |

**Fluxo de uma requisição HTTP (exemplo: `GET /api/moradias/:id/detalhes`):**

```
Cliente HTTP
  → MoradiaRouter (moradia.routes.ts)
  → MoradiaController.getDetalhes()
      → validação do parâmetro :id (validations/)
  → MoradiaService.buscarDetalhes(id)
      → MoradiaRepository.findDetalhesById(id)  ← SQL PostgreSQL (Supabase)
  ← MoradiaService retorna DTO consolidado
← MoradiaController responde com JSON 200 ou HttpError 404
```

### 3.2.2. Diagrama de Casos de Uso (sprint 1)

O diagrama de casos de uso é uma ilustração visual que representa as funcionalidades de um sistema sob a perspectiva de seus usuários, mapeando quais atores interagem com quais casos de uso. Nele, é possível visualizar como os requisitos funcionais se relacionam por meio de dois tipos de relação: `<<include>>`, que indica uma etapa obrigatória dentro de um fluxo, assim, sempre que o caso de uso base for executado, o caso de uso incluído também será; e `<<extend>>`, que indica uma etapa condicional, presente no fluxo apenas em situações específicas, sem ser obrigatória.


<img src="outros/diagrama_de_casos_de_uso.png">

O diagrama mapeia dois atores e três perfis de uso distintos. O **Agente de Campo** representa o perfil **cadastrador**, sendo responsável por registrar e gerenciar dados em campo, interagindo com os casos de uso de cadastro (RF001 a RF004) e gerenciamento (RF006 a RF009). O **Gestor Operacional** acumula os perfis de **visualizador** e **administrador**: como visualizador, acompanha informações estratégicas por meio dos mapas de calor (RF013); como administrador, é o único ator com acesso à geração de relatórios (RF014) e à exportação de dados (RF015). No fluxo de cadastro, as relações `<<include>>` evidenciam a obrigatoriedade em cadeia, como por exemplo: cadastrar uma moradia (RF001) sempre exige cadastrar o chefe de família (RF002), que por sua vez inclui o cadastro dos membros (RF003). Já o `<<extend>>` aparece nos dois pontos condicionais do diagrama: o cadastro de membros pode, opcionalmente, registrar necessidades especiais (RF004), e a exportação de dados (RF015) estende a geração de relatórios (RF014), ocorrendo apenas quando necessário.

### 3.2.3. Diagrama de Classes do Domínio (sprint 2)

O Diagrama de Classes de Domínio representa visualmente as principais entidades do negócio, com seus atributos e relacionamentos entre elas. Não se preocupando com detalhes técnicos como métodos, chaves estrangeiras ou tecnologias específicas, focando somente em capturar o que existe no mundo real dentro do contexto do sistema.

Link do diagrama (realizado por meio do site draw.io): https://drive.google.com/file/d/1YfjTRYovyfGQ29EKa9RM1ScGjfUeJIIK/view?usp=sharing


<div align="center">
    <p>Figura 12: Diagrama de Classes de Domínio</p>
    <img src="outros/diagrama-classes-dominio.drawio.png" width="800">
    <p>Feito pela própria equipe (2026)</p>
</div>


### 3.2.4. Diagrama de Sequência UML (sprint 3)

Os diagramas de sequência UML desta seção documentam os fluxos de interação entre as camadas da arquitetura do sistema deste projeto, evidenciando como as requisições originadas na interface do usuário percorrem a cadeia **Frontend → Controller → Service → Repository → Banco de Dados** até a geração da resposta. Cada linha de vida vertical representa um participante ativo no processamento, com ativações indicando o período em que cada componente mantém controle da execução. Mensagens síncronas (chamadas diretas) são representadas por setas sólidas, enquanto retornos são indicados por setas tracejadas. Caminhos alternativos e de exceção são delimitados por blocos `alt`/`opt`, refletindo as ramificações de negócio documentadas nos fluxos de interação.

Os doze fluxos documentados nesta seção cobrem o ciclo principal de uso do sistema, desde o cadastro em campo até as operações de consulta, filtros, mapa de calor, recadastro, arquivamento e validações transversais de integridade. A modelagem foi atualizada conforme o WAD atual, considerando a arquitetura de dados centrada em **família**, **moradia**, **histórico de ocupação**, **pessoa**, **responsável**, **pet**, **foto de moradia** e **grupo prioritário**.
Os doze fluxos documentados nesta seção cobrem o ciclo principal de uso do sistema, desde o cadastro em campo até as operações de consulta, filtros, mapa de calor, recadastro, arquivamento e validações transversais de integridade. A modelagem foi atualizada conforme o WAD atual, considerando a arquitetura de dados centrada em **família**, **moradia**, **histórico de ocupação**, **pessoa**, **responsável**, **pet**, **foto de moradia** e **grupo prioritário**.

---

### FL01 — Cadastro completo de família, moradia e ocupação

```mermaid
sequenceDiagram
    actor Agente as Agente de Campo (A01)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant Controller as FamiliaController
    participant Service as FamiliaService
    participant Repository as FamiliaRepository/MoradiaRepository/PessoaRepository/PetRepository/FotoRepository
    participant DB as Banco de Dados

    Note over Agente,DB: Preenchimento em campo

    Agente->>Frontend: Inicia novo cadastro
    Frontend-->>Agente: Exibe seções de moradia, localização, família,<br/>responsável, moradores, grupos prioritários, pets e fotos

    Agente->>Frontend: Preenche dados estruturais da moradia
    Frontend->>Frontend: Captura GPS do dispositivo (RN05)

    alt GPS permitido e disponível
        Frontend->>Frontend: Preenche latitude e longitude
    else GPS indisponível ou negado
        Frontend-->>Agente: Solicita CEP, logradouro, bairro,<br/>número, cidade, UF e ponto de referência
        Agente->>Frontend: Informa localização manual
    end

    Agente->>Frontend: Anexa até 2 fotos (fachada e entorno)
    Frontend->>Frontend: Valida RN07: foto não pode conter pessoas
    Agente->>Frontend: Informa responsável, demais dependentes,<br/>vulnerabilidades (grupos prioritários) e pets

    Note over Agente,DB: Envio ou persistência local

    Agente->>Frontend: Confirma cadastro

    alt Dispositivo online
        Frontend->>Controller: POST /api/familias/nucleo<br/>{localizacao, moradia, responsavel, dependentes, pets, fotos}
        Controller->>Service: Validar payload, RN07 (fotos de pessoas)
        Service->>Service: Validar integridade:<br/>Família ativa exige moradia ativa e responsável ativo (US13, US14)
        Service->>Repository: Iniciar transação (BEGIN)

        Repository->>DB: INSERT localização
        DB-->>Repository: id_localizacao
        Repository->>DB: INSERT moradia {id_localizacao, status='Ativa'}
        DB-->>Repository: id_moradia
        Repository->>DB: INSERT família {status='Ativo'}
        DB-->>Repository: id_familia
        Repository->>DB: INSERT familia_moradia<br/>{id_familia, id_moradia, data_entrada=hoje,<br/>data_saida=NULL, status='Regular'}
        DB-->>Repository: OK
        Repository->>DB: INSERT pessoa do responsável<br/>{parentesco='Responsável', status='Ativo'}
        DB-->>Repository: id_pessoa_responsavel
        Repository->>DB: INSERT responsavel<br/>{id_pessoa, cpf, renda, NIS, sexo, raca, estado_civil}
        DB-->>Repository: OK
        Repository->>DB: INSERT pessoa_familia<br/>{id_pessoa_responsavel, id_familia, data_entrada=hoje}
        DB-->>Repository: OK

        loop Para cada morador dependente
            Repository->>DB: INSERT pessoa {parentesco, status='Ativo'}
            DB-->>Repository: id_pessoa
            Repository->>DB: INSERT pessoa_familia {id_pessoa, id_familia, data_entrada=hoje}
            DB-->>Repository: OK
            opt Pertence a grupos prioritários
                Repository->>DB: INSERT pessoa_grupo_prioritario {id_pessoa, id_grupo_prioritario}
                DB-->>Repository: OK
            end
        end

        loop Para cada pet informado
            Repository->>DB: INSERT pet {id_familia, tipo, nome, porte, raca, cor}
            DB-->>Repository: id_pet
            loop Para cada foto do pet
                Repository->>DB: INSERT foto {id_pet, url}
                DB-->>Repository: OK
            end
        end

        loop Para cada foto de moradia
            Repository->>DB: INSERT foto {id_moradia, url}
            DB-->>Repository: OK
        end

        Repository-->>Service: Commit da transação (COMMIT)
        Service-->>Controller: DTO do núcleo criado
        Controller-->>Frontend: HTTP 201 Created
        Frontend-->>Agente: Exibe confirmação do cadastro

    else Dispositivo offline
        Frontend->>Cache: Salva cadastro completo com UUID local e estado PENDENTE
        Cache-->>Frontend: Persistido localmente
        Frontend-->>Agente: Exibe "Salvo localmente, aguardando sincronização"
        Cache->>Frontend: Ao reconectar, aciona sync
        Frontend->>Controller: POST /api/familias/nucleo {uuid_local, payload}
    end

    Note over Agente,DB: Falhas principais

    alt CPF, email ou telefone duplicado
        Service-->>Controller: HTTP 409 Conflict
        Controller-->>Frontend: HTTP 409 Conflict
        Frontend-->>Agente: Exibe mensagem de erro (Cadastro Duplicado)
    else Campos obrigatórios inválidos / Foto com pessoas (RN07)
        Service-->>Controller: HTTP 400 Bad Request
        Controller-->>Frontend: Lista de erros de validação
        Frontend-->>Agente: Destaca campos para correção
    end
```


Este fluxo descreve a jornada de cadastro conduzida pelo **Agente de Campo (A01)** a partir do aplicativo mobile. O processo é estruturado em cinco sessões sequenciais: Moradia, Localização, Chefe de Família, Composição Familiar e Pets. Cada uma liberada somente após a confirmação da anterior, garantindo a integridade referencial dos dados antes do envio. Ao submeter o formulário completo, o Frontend dispara uma sequência ordenada de requisições `POST` que cria os registros em cascata (`LOCALIZACAO → MORADIA → PESSOA → RESPONSAVEL → PET → FORMULARIO`), enquanto o Service aplica as regras de negócio RN01 (classificação de risco) e RN04 (restrição de fotos). O **caminho de exceção** de duplicidade de cadastro, que oferece ao agente as opções de busca, atualização ou cancelamento.

### FL02 — Visualização de moradias em mapa georreferenciado

```mermaid
sequenceDiagram
    actor Gestor as Gestor Operacional (A02/A03)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant Controller as MoradiaController
    participant Service as MoradiaService
    participant Repository as MoradiaRepository/FamiliaRepository/FotoRepository
    participant DB as Banco de Dados

    Gestor->>Frontend: Acessa módulo de mapa
    Frontend->>Controller: GET /api/moradias
    Controller->>Service: Solicitar moradias ativas
    Service->>Repository: Consultar moradias da view ativa
    Repository->>DB: SELECT id, status, lat, lng FROM vw_moradia_ativa m JOIN localizacao l ON l.id = m.id_localizacao
    DB-->>Repository: Lista de moradias com localização
    Repository-->>Service: Lista de moradias
    Service-->>Controller: DTO de moradias
    Controller-->>Frontend: HTTP 200 OK [{id, status, localizacao: {latitude, longitude}}]

    alt Existem moradias georreferenciadas
        Frontend->>Frontend: Renderiza pins no mapa
    else Nenhum registro encontrado
        Frontend-->>Gestor: Exibe mapa vazio e mensagem "Nenhuma moradia ativa encontrada"
    end

    Gestor->>Frontend: Clica em um marcador
    Frontend->>Controller: GET /api/moradias/{id}/detalhes
    Controller->>Service: Carregar moradia, famílias, moradores, pets, fotos e grupos prioritários
    Service->>Repository: Buscar dados integrados (vw_moradia_ativa, vw_familia_ativa, vw_pessoa_ativa, pet, foto, pessoa_grupo_prioritario)
    Repository->>DB: SELECT moradia, familia, pessoa, responsavel, pet, foto, grupo_prioritario
    DB-->>Repository: Dados integrados
    Repository-->>Service: Dados integrados
    Service->>Service: Aplicar RN05: Risco Crítico<br/>(moradia.status = 'Em Risco' E morador com grupo prioritário acamado/cadeirante)
    Service-->>Controller: Objeto de consulta detalhada
    Controller-->>Frontend: HTTP 200 OK {moradia, familias: [{familia, pessoas, pets}], fotos, risco_critico}
    Frontend-->>Gestor: Exibe card com detalhes e flag de risco se aplicável
```
Este fluxo descreve a consulta de informações espaciais executada pelo **Gestor Operacional (A02/A03)** a partir do painel administrativo desktop. O Frontend solicita a listagem de registros georreferenciados para renderização no mapa da região. O Service, por meio do Repository, realiza a busca lendo diretamente da view de leitura **`vw_moradia_ativa`** em conjunto com a tabela **`localizacao`** para obter as coordenadas de latitude e longitude dos imóveis que não sofreram exclusão lógica. Ao receber o conjunto de dados, o Frontend renderiza pins interativos na interface geográfica. Quando o gestor clica sobre um marcador específico, o sistema dispara a requisição de consulta consolidada (`GET /api/moradias/{id}/detalhes`), carregando os dados do imóvel, moradores ativos, pets e fotos, ao mesmo tempo em que calcula e exibe a flag visual de Risco Crítico (RN05) em um card sobreposto no próprio mapa.

### FL03 — Consulta integrada de moradia e moradores

```mermaid
sequenceDiagram
    actor Gestor as Gestor Operacional (A02/A03)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant Controller as MoradiaController
    participant Service as MoradiaService
    participant Repository as MoradiaRepository/FamiliaRepository/FotoRepository
    participant DB as Banco de Dados

    Gestor->>Frontend: Acessa módulo de consulta
    Frontend->>Controller: GET /api/moradias?busca={termo}
    Controller->>Service: Buscar moradias por termo
    Service->>Repository: Consultar moradias ativas correspondentes
    Repository->>DB: SELECT * FROM vw_moradia_ativa WHERE nome_responsavel ILIKE termo OR logradouro ILIKE termo
    DB-->>Repository: Lista resumida
    Repository-->>Service: Lista resumida
    Service-->>Controller: DTO de busca
    Controller-->>Frontend: HTTP 200 OK [{id, status, localizacao, responsavel}]
    Frontend-->>Gestor: Exibe lista de moradias encontradas

    Gestor->>Frontend: Seleciona uma moradia
    Frontend->>Controller: GET /api/moradias/{id}/detalhes
    Controller->>Service: Montar ficha integrada da moradia
    Service->>Repository: Consultar moradia, famílias, pessoas, responsáveis, pets, fotos e grupos prioritários
    Repository->>DB: SELECT * FROM vw_moradia_ativa WHERE id = :id;<br/>SELECT * FROM familia_moradia JOIN vw_familia_ativa JOIN vw_pessoa_ativa JOIN pessoa_grupo_prioritario JOIN pet JOIN foto
    DB-->>Repository: Dados da moradia e moradores ativos
    Repository-->>Service: Dados consolidados

    alt Moradia sem ocupação ativa
        Service-->>Controller: HTTP 200 OK {moradia, familias=[], fotos}
        Controller-->>Frontend: Exibe moradia sem família residente
        Frontend-->>Gestor: Exibe dados físicos do imóvel sem moradores
    else Ocupação ativa encontrada
        Service->>Service: Classificar prioridade (RN01)
        Service->>Service: Avaliar RN05: Risco Crítico<br/>(status 'Em Risco' + grupo acamado/cadeirante)
        Service-->>Controller: Ficha detalhada
        Controller-->>Frontend: HTTP 200 OK {moradia, familias: [{familia, pessoas, pets}], fotos, prioridade, risco_critico}
        Frontend-->>Gestor: Exibe ficha de consulta consolidada
    end
```

Este fluxo detalha a consulta integrada executada pelo **Gestor Operacional (A02/A03)** ao pesquisar ou selecionar uma ficha. O Frontend solicita uma listagem resumida de moradias e, após a seleção de um registro, carrega os dados completos da moradia, localização, ocupação ativa, família, responsável, moradores, gestantes, grupos prioritários, pets e fotos. A consulta utiliza o `historico_ocupacao` para identificar a família atualmente vinculada à moradia, considerando apenas ocupações com `data_saida` nula. Caso não exista ocupação ativa, o sistema retorna a ficha do imóvel sem moradores ativos. Quando há ocupação ativa, o Service calcula a prioridade de evacuação (RN01) e avalia a flag de Risco Crítico (RN05).
---

### FL04 — Filtros avançados de moradias e assistidos (Backlog)
```mermaid
sequenceDiagram
    actor Gestor as Gestor Operacional (A02/A03)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant Controller as MoradiaController
    participant Service as MoradiaService
    participant Repository as MoradiaRepository
    participant DB as Banco de Dados

    Gestor->>Frontend: Acessa tela de filtros e relatórios
    Frontend-->>Gestor: Exibe filtros de moradia e vulnerabilidade (FL04 - Backlog)
    Gestor->>Frontend: Aplica filtros combinados

    Note over Frontend,DB: O backend atual não processa filtros avançados nem exportação (Backlog de Sprint Futura)

    Frontend->>Controller: GET /api/moradias (sem filtros dinâmicos de vulnerabilidade)
    Controller->>Service: Solicitar listagem de moradias
    Service->>Repository: Buscar moradias da view ativa
    Repository->>DB: SELECT * FROM vw_moradia_ativa
    DB-->>Repository: Lista de moradias
    Repository-->>Service: Lista de moradias
    Service-->>Controller: DTO de moradias
    Controller-->>Frontend: HTTP 200 OK
    Frontend-->>Gestor: Exibe lista completa de moradias ativas

    opt Gestor tenta exportar (Futura Sprint)
        Gestor->>Frontend: Clica em Exportar CSV/PDF
        Frontend-->>Gestor: Alerta "Exportação será implementada em sprints futuras"
    end
```

Este fluxo representa o uso de filtros avançados pelo **Gestor Operacional (A02/A03)** na tela de gerenciamento de dados. O usuário pode combinar critérios como status da moradia, condição de ocupação, grupos prioritários, vulnerabilidades, destino em caso de evacuação e situação de recadastro. O Frontend envia os filtros ao Controller, que delega ao Service a validação dos parâmetros e a montagem da consulta. O Repository cruza as tabelas `moradia`, `localizacao`, `historico_ocupacao`, `familia`, `pessoa`, `pessoa_grupo_prioritario` e `grupo_prioritario`, retornando uma lista filtrada. Quando não há resultados, o painel exibe uma mensagem orientativa. Quando há registros, o gestor pode exportar a listagem em formato CSV ou PDF.

---

### FL05 — Atualização anual de dados pelo agente de campo (Endpoints Separados)
```mermaid
sequenceDiagram
    actor Agente as Agente de Campo (A01)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant Controller as MoradiaController/PessoaController
    participant Service as MoradiaService/PessoaService
    participant Repository as MoradiaRepository/PessoaRepository/FamiliaRepository
    participant DB as Banco de Dados

    Agente->>Frontend: Abre formulário de recadastro da família
    Frontend->>Controller: GET /api/moradias/{id_moradia}/detalhes
    Controller->>Service: Carregar dados completos
    Service->>Repository: Consultar moradia, famílias, pessoas, responsáveis, pets e fotos
    Repository->>DB: SELECT dados integrados de vw_moradia_ativa, vw_familia_ativa, vw_pessoa_ativa
    DB-->>Repository: Dados da moradia e moradores
    Repository-->>Service: Dados integrados
    Service-->>Controller: DTO detalhado da moradia
    Controller-->>Frontend: HTTP 200 OK
    Frontend-->>Agente: Exibe formulário pré-preenchido

    Agente->>Frontend: Revisa e edita dados
    Frontend->>Frontend: Valida campos obrigatórios e fotos (RN07)
    Agente->>Frontend: Confirma e salva atualização

    Note over Frontend,DB: Como os endpoints NÃO foram unificados, o Frontend realiza chamadas CRUD separadas:

    alt Online
        par Atualizar dados físicos e de localização da moradia
            Frontend->>Controller: PUT /api/moradias/{id_moradia} {moradia, localizacao}
            Controller->>Service: Atualizar moradia/localização
            Service->>Repository: Iniciar transação (BEGIN)
            Repository->>DB: UPDATE localizacao SET ...; UPDATE moradia SET data_modificacao=now() ...
            Repository-->>Service: Commit (COMMIT)
            Service-->>Controller: Moradia atualizada
            Controller-->>Frontend: HTTP 200 OK

        and Atualizar dados pessoais de cada dependente
            loop Para cada morador dependente atualizado
                Frontend->>Controller: PUT /api/pessoas/{id_pessoa} {dados_morador}
                Controller->>Service: Atualizar pessoa
                Service->>Repository: UPDATE pessoa SET status='Ativo', data_modificacao=now() ...
                Repository-->>Service: Pessoa atualizada
                Service-->>Controller: Pessoa atualizada
                Controller-->>Frontend: HTTP 200 OK
            end

        and Atualizar dados específicos do Responsável
            Frontend->>Controller: PUT /api/responsaveis/{id_pessoa} {dados_financeiros_sociais}
            Controller->>Service: Atualizar responsável
            Service->>Repository: Iniciar transação (BEGIN)
            Repository->>DB: UPDATE pessoa ... (inclui campos de responsável)
            Repository-->>Service: Commit (COMMIT)
            Service-->>Controller: Responsável atualizado
            Controller-->>Frontend: HTTP 200 OK
        end

        opt Mudança de moradia detectada
            Frontend->>Controller: DELETE /api/familias/{id_familia}/moradias/{id_moradia_antiga}
            Controller->>Service: Desvincular moradia antiga
            Service->>Repository: UPDATE familia_moradia SET data_saida=now() WHERE data_saida IS NULL
            DB-->>Repository: OK
            Service-->>Controller: Desvinculado
            Controller-->>Frontend: HTTP 200 OK

            Frontend->>Controller: POST /api/familias/{id_familia}/moradias {idMoradia: nova_moradia}
            Controller->>Service: Vincular nova moradia
            Service->>Repository: INSERT INTO familia_moradia (id_familia, id_moradia, data_entrada) VALUES (...)
            DB-->>Repository: OK
            Service-->>Controller: Vinculado
            Controller-->>Frontend: HTTP 201 Created
        end

        Frontend-->>Agente: Exibe "Cadastro anual atualizado com sucesso" (Tag de recadastro renovada)

    else Offline
        Note over Frontend, Agente: Enfileira as requisições no cache local (IndexedDB) para sincronizar ao reconectar
    end
```

Este fluxo descreve a revisão anual de uma família marcada para recadastro, conduzida pelo **Agente de Campo (A01)**. O Frontend carrega o cadastro completo da família, incluindo ocupação ativa, moradia, localização, responsável, moradores, gestantes, pets e fotos. O agente revisa os dados em campo e envia as alterações para o backend, que valida as regras RN01, RN02 e RN07 antes de persistir as atualizações. Caso a família tenha mudado de moradia, o Service encerra o vínculo atual em `historico_ocupacao` com `data_saida` e cria uma nova ocupação ativa. Em modo offline, a alteração é enfileirada no cache local com UUID próprio e sincronizada posteriormente.

---

### FL06 — Cadastro e manutenção de pets vinculados à família
```mermaid
sequenceDiagram
    actor Agente as Agente de Campo (A01)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant Controller as PetController
    participant Service as PetService
    participant Repository as PetRepository
    participant DB as Banco de Dados

    Agente->>Frontend: Acessa seção Animais de Estimação
    Frontend->>Controller: GET /api/familias/{id_familia}/pets
    Controller->>Service: Listar pets da família
    Service->>Repository: Consultar pets vinculados
    Repository->>DB: SELECT * FROM pet WHERE id_familia = :id_familia
    DB-->>Repository: Lista de pets
    Repository-->>Service: Lista de pets
    Service-->>Controller: Lista de pets
    Controller-->>Frontend: HTTP 200 OK
    Frontend-->>Agente: Exibe pets cadastrados

    Agente->>Frontend: Cadastra novo pet ou atualiza existente
    alt Novo Pet
        Frontend->>Controller: POST /api/familias/{id_familia}/pets {nome, tipo, porte, raca, cor}
        Controller->>Service: Validar dados do pet
        Service->>Repository: Salvar pet na família
        Repository->>DB: INSERT INTO pet (id_familia, nome, tipo, porte, raca, cor) VALUES (...)
        DB-->>Repository: Pet criado
        Repository-->>Service: Pet criado
        Service-->>Controller: Pet criado
        Controller-->>Frontend: HTTP 201 Created
    else Editar Pet
        Frontend->>Controller: PUT /api/pets/{id_pet} {nome, tipo, porte, raca, cor}
        Controller->>Service: Validar dados do pet
        Service->>Repository: Atualizar pet
        Repository->>DB: UPDATE pet SET ... WHERE id = :id_pet
        DB-->>Repository: Pet atualizado
        Repository-->>Service: Pet atualizado
        Service-->>Controller: Pet atualizado
        Controller-->>Frontend: HTTP 200 OK
    end
    Frontend-->>Agente: Atualiza tela de pets da família
```

Este fluxo detalha a manutenção dos animais de estimação informados pelo **Agente de Campo (A01)**. O Frontend consulta os pets já vinculados à família e permite adicionar ou editar registros, sempre associando o animal ao `id_familia`, e não diretamente à moradia. Essa decisão acompanha o modelo de dados atual: se a família for realocada, os pets permanecem associados ao mesmo núcleo familiar, enquanto o histórico de ocupação registra a mudança de moradia. O Service valida os campos obrigatórios, como `tipo_pet`, e o Repository persiste os dados na tabela `pet`.

---

### FL07 — Mapa de calor e indicadores de vulnerabilidade (Backlog)
```mermaid
sequenceDiagram
    actor Gestor as Gestor Operacional (A02/A03)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant Controller as IndicadorController
    participant Service as IndicadorService

    Gestor->>Frontend: Ativa camada de mapa de calor / indicadores (FL07 - Backlog)

    Note over Frontend, Service: Funcionalidade de Mapa de Calor (FL07) está programada para a próxima sprint.

    Frontend-->>Gestor: Exibe aviso "Funcionalidade de mapa de calor em desenvolvimento para a próxima sprint"
```

Este fluxo descreve a geração do mapa de calor utilizado pelo **Gestor Operacional (A02/A03)** para visualizar concentrações de vulnerabilidade no território. O usuário ativa a camada de calor e seleciona filtros como idosos, PCDs, acamados, gestantes ou crianças. O backend consulta moradias ativas, ocupações atuais e moradores vinculados aos grupos prioritários, agrupando coordenadas por intensidade. O Frontend renderiza a camada sobre o mapa e recalcula os clusters quando o usuário altera zoom ou filtro. Em paralelo, o painel pode consultar os indicadores de recadastro, exibindo o total de registros atualizados e desatualizados.

---

### FL08 — Arquivamento lógico de moradia (Endpoints Separados)
```mermaid
sequenceDiagram
    actor Gestor as Gestor Operacional (A03)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant MoradiaController as MoradiaController
    participant FamiliaController as FamiliaController
    participant Service as MoradiaService/FamiliaService
    participant Repository as MoradiaRepository/FamiliaRepository
    participant DB as Banco de Dados

    Gestor->>Frontend: Localiza moradia ativa
    Gestor->>Frontend: Clica em "Arquivar Imóvel" (Soft Delete)

    Note over Frontend, DB: Não há justificativa de motivo. A data de arquivamento será a data da requisição (salva em deleted_at).

    Frontend->>MoradiaController: DELETE /api/moradias/{id_moradia}
    MoradiaController->>Service: Validar ocupação da moradia antes de excluir
    Service->>Repository: Verificar se há família com data_saida IS NULL vinculada
    Repository->>DB: SELECT * FROM familia_moradia WHERE id_moradia = :id AND data_saida IS NULL
    DB-->>Repository: Ocupação atual (família ativa encontrada)
    Repository-->>Service: Ocupação encontrada

    alt Existe família ativa morando no imóvel
        Service->>Service: Validar integridade US14 (família ativa exige moradia ativa)
        Service-->>MoradiaController: Bloquear exclusão (HTTP 409 Conflict)
        MoradiaController-->>Frontend: HTTP 409 Conflict {error: 'moradia_ocupada'}
        Frontend-->>Gestor: Bloqueia arquivamento e solicita realocação manual da família

        opt Gestor realiza realocação manual da família (Split Endpoints)
            Frontend->>FamiliaController: DELETE /api/familias/{id_familia}/moradias/{id_moradia}
            FamiliaController->>Service: Desvincular moradia antiga
            Service->>Repository: UPDATE familia_moradia SET data_saida=now() WHERE id_familia=:id_familia AND id_moradia=:id_moradia AND data_saida IS NULL
            DB-->>Repository: OK
            Service-->>FamiliaController: Desvinculado
            FamiliaController-->>Frontend: HTTP 200 OK

            Frontend->>FamiliaController: POST /api/familias/{id_familia}/moradias {idMoradia: nova_moradia}
            FamiliaController->>Service: Vincular nova moradia
            Service->>Repository: INSERT INTO familia_moradia (id_familia, id_moradia, data_entrada) VALUES (...)
            DB-->>Repository: OK
            Service-->>FamiliaController: Vinculado
            FamiliaController-->>Frontend: HTTP 201 Created

            Note over Frontend, MoradiaController: Com a família realocada, a moradia está livre para arquivamento:
            Frontend->>MoradiaController: DELETE /api/moradias/{id_moradia}
            MoradiaController->>Service: Validar ocupação (agora livre)
            Service->>Repository: Executar exclusão lógica
            Repository->>DB: DELETE FROM moradia WHERE id = :id_moradia<br/>(PostgreSQL rule altera para UPDATE status='Excluída', deleted_at=now())
            DB-->>Repository: OK
            Service-->>MoradiaController: OK
            MoradiaController-->>Frontend: HTTP 200 OK
            Frontend-->>Gestor: Imóvel arquivado com sucesso
        end
    else Moradia está vazia
        Service->>Repository: Executar exclusão lógica
        Repository->>DB: DELETE FROM moradia WHERE id = :id_moradia<br/>(PostgreSQL rule altera para UPDATE status='Excluída', deleted_at=now())
        DB-->>Repository: OK
        Repository-->>Service: OK
        Service-->>MoradiaController: OK
        MoradiaController-->>Frontend: HTTP 200 OK
        Frontend-->>Gestor: Imóvel arquivado com sucesso (status='Excluída')
    end
```

Este fluxo representa o arquivamento lógico de uma moradia pelo **Gestor Operacional (A03)**. O gestor seleciona uma moradia ativa, informa o motivo do arquivamento e envia a solicitação de alteração de status. O Service verifica se existe uma ocupação ativa vinculada à moradia por meio de `historico_ocupacao`. Se houver família ativa residindo no local, a operação é bloqueada com conflito, pois a US14 exige que toda família ativa possua uma moradia ativa vinculada. Nesse caso, o sistema solicita realocação ou inativação da família antes de concluir o arquivamento. Se não houver ocupação ativa, o status da moradia é atualizado sem exclusão física, preservando a rastreabilidade histórica conforme RN03.

---

### FL09 — Arquivamento lógico de morador falecido (Endpoints Separados)
```mermaid
sequenceDiagram
    actor Gestor as Gestor Operacional (A02/A03)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant PessoaController as PessoaController
    participant Service as PessoaService
    participant Repository as PessoaRepository/FamiliaRepository
    participant DB as Banco de Dados

    Gestor->>Frontend: Acessa ficha do morador
    Gestor->>Frontend: Clica em "Arquivar Morador" (Soft Delete por Óbito)

    Note over Frontend, DB: A data do óbito será a data da requisição (salva em deleted_at).

    Frontend->>PessoaController: DELETE /api/pessoas/{id_pessoa}
    PessoaController->>Service: Validar exclusão do morador
    Service->>Repository: Verificar se o morador é o responsável ativo da família
    Repository->>DB: SELECT * FROM vw_pessoa_ativa p WHERE p.id=:id AND p.parentesco='Responsável'
    DB-->>Repository: Registro de responsável ativo encontrado
    Repository-->>Service: Confirmado (morador é o responsável atual)

    alt Morador é o responsável ativo da família
        Service->>Repository: Buscar outros moradores ativos da mesma família
        Repository->>DB: SELECT * FROM pessoa_familia pf INNER JOIN vw_pessoa_ativa p ON p.id=pf.id_pessoa WHERE pf.id_familia=:id_familia AND p.id <> :id
        DB-->>Repository: Lista de membros ativos
        Repository-->>Service: Lista de candidatos

        alt Não há outros moradores ativos
            Service-->>PessoaController: Bloquear exclusão (HTTP 409 Conflict)
            PessoaController-->>Frontend: HTTP 409 Conflict {error: 'ultimo_membro_familia'}
            Frontend-->>Gestor: Exibe alerta: Família ficará sem membros ativos. Solicita inativar família inteira.
        else Existem outros membros ativos (Exige definição manual de novo responsável)
            Service-->>PessoaController: Bloquear exclusão (HTTP 409 Conflict)
            PessoaController-->>Frontend: HTTP 409 Conflict {error: 'requer_novo_responsavel', candidatos}
            Frontend-->>Gestor: Solicita definir o novo responsável entre os membros ativos

            opt Gestor promove novo responsável (Split Endpoints)
                Gestor->>Frontend: Seleciona candidato e informa dados sociais/financeiros

                Frontend->>PessoaController: PUT /api/pessoas/{id_novo_responsavel} {parentesco: 'Responsável'}
                PessoaController->>Service: Alterar parentesco para Responsável
                Service->>Repository: UPDATE pessoa SET parentesco='Responsável' WHERE id=:id
                DB-->>Repository: OK
                Service-->>PessoaController: OK
                PessoaController-->>Frontend: HTTP 200 OK

                Frontend->>PessoaController: POST /api/responsaveis {idPessoa: id_novo, cpf, renda, NIS, sexo, raca, estado_civil}
                PessoaController->>Service: Criar registro de responsável financeiro/social
                Service->>Repository: INSERT INTO responsavel (...) VALUES (...)
                DB-->>Repository: OK
                Service-->>PessoaController: OK
                PessoaController-->>Frontend: HTTP 201 Created

                Note over Frontend, PessoaController: Agora o morador antigo pode ser arquivado por óbito:
                Frontend->>PessoaController: DELETE /api/pessoas/{id_pessoa}
                PessoaController->>Service: Validar exclusão (agora com novo responsável ativo já definido)
                Service->>Repository: Executar exclusão lógica
                Repository->>DB: DELETE FROM pessoa WHERE id = :id_pessoa<br/>(PostgreSQL rule altera para UPDATE status='Inativo', deleted_at=now())
                DB-->>Repository: OK
                Service-->>PessoaController: OK
                PessoaController-->>Frontend: HTTP 200 OK
                Frontend-->>Gestor: Morador arquivado com sucesso
            end
        end
    else Morador comum (dependente)
        Service->>Repository: Executar exclusão lógica
        Repository->>DB: DELETE FROM pessoa WHERE id = :id_pessoa<br/>(PostgreSQL rule altera para UPDATE status='Inativo', deleted_at=now())
        DB-->>Repository: OK
        Repository-->>Service: OK
        Service-->>PessoaController: OK
        PessoaController-->>Frontend: HTTP 200 OK
        Frontend-->>Gestor: Morador arquivado com sucesso
    end
```

Este fluxo descreve o arquivamento lógico de um morador falecido realizado pelo **Gestor Operacional (A02)**. O gestor informa a data de falecimento e confirma a operação. O Service verifica se o cidadão é o responsável da família. Caso seja, o sistema exige a escolha de um novo responsável ativo antes de concluir o arquivamento, preservando a integridade definida pela US13. Quando a substituição é resolvida, o cadastro do cidadão é inativado por meio de `status_cadastro=false`, sem deleção física. Após a atualização, o Service reavalia a prioridade da família e a regra de Risco Crítico, garantindo que consultas e relatórios ativos não exibam moradores arquivados.

---

### FL10 — Alerta automático de recadastro (Tag de 12 meses)
```mermaid
sequenceDiagram
    actor Gestor as Gestor Operacional (A02/A03)
    participant Frontend as Frontend Web (SPA React/Vite)
    participant Controller as MoradiaController
    participant Service as MoradiaService
    participant Repository as MoradiaRepository
    participant DB as Banco de Dados

    Note over Gestor, DB: O alerta de recadastro (FL10) é calculado sob demanda pelas listagens e endpoints de detalhes. Não há job cron ou scheduler implementado.

    Gestor->>Frontend: Acessa o Painel de Gestão
    Frontend->>Controller: GET /api/moradias (ou listagem com flag desatualizado)
    Controller->>Service: Solicitar moradias ativas e calcular flags de recadastro
    Service->>Repository: Consultar moradias da view ativa
    Repository->>DB: SELECT * FROM vw_moradia_ativa
    DB-->>Repository: Lista de moradias com data_modificacao e data_registro
    Repository-->>Service: Lista de moradias

    Service->>Service: Calcular para cada moradia:<br/>Se (data_modificacao OU data_registro) < (hoje - 365 dias) -> marcar flag 'desatualizado=true'

    Service-->>Controller: Lista de moradias com tags de recadastro
    Controller-->>Frontend: HTTP 200 OK [{id, status, desatualizado: true/false}]
    Frontend-->>Gestor: Exibe lista com tags visuais de alerta (Tag de Recadastro) nas moradias vencidas
```

Este fluxo documenta a rotina de recadastro obrigatório prevista pela RN02. O calculo de recadastro e feito sob demanda: cada consulta avalia moradias ativas cuja `ultima_atualizacao` tenha ultrapassado 365 dias. A consulta considera moradias com ocupação ativa e família ativa, evitando alertas sobre registros apenas históricos. No painel, o **Gestor Operacional (A02/A03)** consulta os indicadores de recadastro e visualiza o total de cadastros atualizados e desatualizados. Ao clicar no indicador, o Frontend redireciona para a listagem de moradias com o filtro `desatualizado=true`, permitindo organizar as revisitas de campo.

---

### FL11 — Regra transversal de Risco Crítico (RN05)
```mermaid
sequenceDiagram
    participant Chamador as Fluxo Chamador (FL02/FL03/FL05/FL09)
    participant Service as MoradiaService/PessoaService
    participant Repository as MoradiaRepository/FamiliaRepository
    participant DB as Banco de Dados
    participant Frontend as Frontend
    actor Usuario as Usuário

    Note over Chamador, Service: RN05 não é um fluxo independente. É aplicada automaticamente ao consultar os detalhes de uma moradia ativa.

    Chamador->>Service: Solicita avaliação de Risco Crítico {id_moradia}
    Service->>Repository: Buscar status da moradia e grupos prioritários dos moradores ativos
    Repository->>DB: SELECT m.status, gp.condicao FROM vw_moradia_ativa m JOIN familia_moradia fm JOIN pessoa_familia pf JOIN vw_pessoa_ativa p JOIN pessoa_grupo_prioritario pgp JOIN grupo_prioritario gp WHERE m.id = :id AND fm.data_saida IS NULL AND pf.data_saida IS NULL
    DB-->>Repository: Status do imóvel e condições dos moradores
    Repository-->>Service: Dados estruturados

    Service->>Service: Verificar condição:<br/>(moradia.status = 'Em Risco' OR 'Interditada')<br/>E algum morador associado a grupo ('Cadeirante', 'Acamado' ou 'Mobilidade Reduzida')

    alt Condição RN05 satisfeita
        Service-->>Chamador: risco_critico=true
        Chamador-->>Frontend: Retorna objeto com flag risco_critico=true
        Frontend-->>Usuario: Exibe alerta visual vermelho "Risco Crítico" no card/ficha
    else Condição RN05 não satisfeita
        Service-->>Chamador: risco_critico=false
        Chamador-->>Frontend: Retorna objeto com flag risco_critico=false
        Frontend-->>Usuario: Exibe ficha de consulta sem alerta crítico
    end
```

Este fluxo representa uma regra transversal, acionada por outros fluxos sempre que uma moradia e seus moradores ativos são carregados para exibição. O Service consulta a moradia, a ocupação ativa, a família residente e os cidadãos vinculados aos grupos prioritários. A condição RN05 é satisfeito quando a moradia possui histórico de ocorrência e existe ao menos um morador ativo classificado com mobilidade reduzida ou acamado. Quando a condição é verdadeira, a resposta recebe `risco_critico=true`, permitindo que o Frontend destaque a flag \"Risco Crítico\" em cards, fichas e consultas integradas. Quando a condição não é satisfeita, a ficha é exibida sem o alerta.

---

### FL12 — Validação transversal de integridade cadastral
```mermaid
sequenceDiagram
    participant Chamador as Fluxo Chamador (Cadastro, Atualização, Desvinculo, Realocação)
    participant Service as FamiliaService
    participant Repository as FamiliaRepository/MoradiaRepository
    participant DB as Banco de Dados
    participant Frontend as Frontend
    actor Usuario as Usuário

    Note over Service: Regras derivadas das US13 e US14:<br/>Família ativa exige responsável ativo e moradia ativa vinculada.

    Chamador->>Service: Executa validação de integridade cadastral {id_familia}
    Service->>Repository: Consultar família
    Repository->>DB: SELECT * FROM vw_familia_ativa WHERE id = :id
    DB-->>Repository: Registro da família
    Repository-->>Service: Dados da família

    alt Família inativa (deletada)
        Service-->>Chamador: Validação ignorada (histórico)
    else Família ativa
        Service->>Repository: Verificar se há responsável ativo na família
        Repository->>DB: SELECT * FROM pessoa_familia pf JOIN vw_pessoa_ativa p ON p.id=pf.id_pessoa WHERE pf.id_familia=:id AND pf.data_saida IS NULL AND p.parentesco='Responsável'
        DB-->>Repository: Responsável ativo ou vazio
        Repository-->>Service: Resultado

        Service->>Repository: Verificar se há moradia ativa vinculada à família
        Repository->>DB: SELECT * FROM familia_moradia fm JOIN vw_moradia_ativa m ON m.id=fm.id_moradia WHERE fm.id_familia=:id AND fm.data_saida IS NULL
        DB-->>Repository: Moradia ativa ou vazio
        Repository-->>Service: Resultado

        alt Sem responsável ativo (Violação US13)
            Service-->>Chamador: Falha de Validação (HTTP 409 Conflict)
            Chamador-->>Frontend: Bloqueia a operação
            Frontend-->>Usuario: Solicita definir um responsável ativo para a família
        else Sem moradia ativa vinculada (Violação US14)
            Service-->>Chamador: Falha de Validação (HTTP 409 Conflict)
            Chamador-->>Frontend: Bloqueia a operação
            Frontend-->>Usuario: Solicita vincular a família a uma moradia ativa válida
        else Integridade preservada
            Service-->>Chamador: Validação Aprovada (OK)
        end
    end
```

Este fluxo consolida as validações derivadas das US13 e US14. Ele não representa uma tela isolada, mas uma regra transversal chamada por operações de cadastro, atualização, arquivamento e realocação. Sempre que uma família ativa é alterada, o Service verifica se existe responsável ativo vinculado e se há uma ocupação ativa em moradia válida. Se a família ficar sem responsável, a operação é bloqueada e o usuário deve definir um novo responsável. Se a família ficar sem moradia ativa, o sistema exige a criação de uma nova ocupação ou a inativação da família. Essa validação impede inconsistências cadastrais e preserva a coerência entre `familia`, `responsavel`, `moradia` e `historico_ocupacao`.


### 3.2.5. Diagrama de Atividades ou Estados (sprint 3)

*Ao menos um fluxo relevante em UML ou BPMN. Use a notação da ferramenta escolhida de forma consistente (sem misturar convenções).*

### 3.2.6. Diagrama de Implantação (sprints 4 e 5)

O diagrama de implantação descreve como os componentes do GeoRisco são distribuídos nos ambientes de execução reais. Em produção, a aplicação é publicada na **Vercel** — frontend e backend em projetos separados — com persistência no **Supabase** (PostgreSQL + Storage). O passo a passo completo e replicável do deploy está documentado em [`documentos/outros/tutorial-deploy.md`](outros/tutorial-deploy.md).

```mermaid
graph TD
    User["Navegador do usuário<br/>(Chrome / Firefox / Edge)"]
    FE["Vercel — projeto georisco-frontend<br/>SPA React/Vite (estática)"]
    BE["Vercel — projeto georisco<br/>API Express serverless (@vercel/node)"]
    DB[("Supabase — PostgreSQL<br/>(Transaction Pooler :6543, SSL)")]
    ST["Supabase — Storage<br/>bucket georisco-fotos"]

    User -->|HTTPS: carrega a SPA| FE
    User -->|HTTPS /api · JSON| BE
    FE -. URL embutida no build via VITE_API_BASE_URL .-> BE
    BE -->|cliente pg · DATABASE_URL| DB
    BE -->|@supabase/supabase-js · URL assinada| ST
```

| Nó | Tecnologia | Artefatos hospedados |
|---|---|---|
| **Navegador do usuário** | Chrome / Firefox / Edge | SPA React/Vite carregada de `georisco-frontend.vercel.app` |
| **Vercel — Frontend** (`georisco-frontend`) | Hospedagem estática + fallback de SPA | Build estático de `src/frontend` (HTML/CSS/JS); `vercel.json` com rewrite de todas as rotas para `index.html` |
| **Vercel — Backend** (`georisco`) | Função serverless `@vercel/node` | App Express exportado em `src/geoRisco/api/index.ts` (sem `app.listen`); rotas sob o prefixo `/api` |
| **Supabase — PostgreSQL** | PostgreSQL gerenciado (Transaction Pooler, porta 6543) | Schema das migrations em `src/geoRisco/src/db/migrations/`; tabelas `pessoa` (inclui os atributos de responsável), `familia`, `moradia`, `localizacao`, `pet`, `foto`, `grupo_prioritario` e tabelas associativas |
| **Supabase — Storage** | Supabase Storage | Bucket `georisco-fotos` — arquivos físicos de fotos de moradias e pets; acesso via URL assinada |

**Comunicação entre nós:**

- O navegador baixa a SPA do projeto frontend na Vercel e faz chamadas HTTP/JSON para `https://georisco.vercel.app/api/...`; a URL do backend é embutida no build do frontend pela variável `VITE_API_BASE_URL`, e o CORS é liberado pelo backend (`cors` no `app.ts`).
- A função serverless do backend conecta ao PostgreSQL via `DATABASE_URL` (pooler do Supabase, com SSL em produção) usando o cliente `pg`, e ao Supabase Storage via `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` usando `@supabase/supabase-js`.
- Em **desenvolvimento local**, o backend roda como processo tradicional (`src/server.ts` com `app.listen` na porta 3000) e o frontend usa o proxy do Vite (`/api` → `http://localhost:3000`).

> **Observação (serverless ≠ servidor tradicional):** na Vercel não há processo permanente — cada requisição aciona uma função efêmera. Por isso o backend exporta o app Express em `api/index.ts` em vez de chamar `app.listen`, e usa o Transaction Pooler do Supabase para não esgotar conexões.

### 3.2.7. Padrões de Projeto Aplicados (sprints 3 a 5)

Durante o desenvolvimento do backend do GeoRisco, foram aplicados padrões arquiteturais voltados à separação de responsabilidades, testabilidade, segurança e manutenção das regras de negócio. A aplicação foi consolidada em camadas com TypeScript, Express, PostgreSQL/Supabase e Supabase Storage, cobrindo CRUDs, núcleo familiar transacional, histórico de vínculos, consulta detalhada de moradias, pets e fotos.

| Padrão / Conceito Arquitetural | Aplicação no GeoRisco | Justificativa |
| :--- | :--- | :--- |
| **Arquitetura em Camadas** | O backend está organizado em `routes`, `controllers`, `services`, `repositories`, `dtos`, `models`, `validations`, `errors`, `db` e `storage`. | Essa divisão separa entrada HTTP, regras de negócio, persistência e infraestrutura, facilitando evolução dos módulos de pessoas, moradias, famílias, pets, fotos e vínculos históricos. |
| **Controller** | Os controllers recebem requisições, extraem parâmetros, normalizam payloads, chamam services e retornam respostas JSON. | Evita que regras de negócio e SQL fiquem misturados com detalhes de rota, status code e contratos HTTP. |
| **Service Layer** | Os services (`familia.service.ts`, `moradia.service.ts`, `pessoa.service.ts`, `pet.service.ts`, `foto.service.ts`) concentram validações de negócio, orquestração entre repositories, transações e composição de respostas agregadas, como núcleo familiar e detalhes da moradia. | Necessário para fluxos compostos, como cadastro de responsável, criação de moradia com localização, vínculo família-moradia, pets, fotos e consulta detalhada. |
| **Repository Pattern** | Os repositories (pasta `repositories/`) encapsulam SQL, acesso ao PostgreSQL/Supabase e mapeamento entre colunas do banco e objetos TypeScript. | Isola a persistência da lógica de negócio, permitindo alterar queries, views ou estratégia de banco sem impactar diretamente controllers e services. |
| **DTO (Data Transfer Object)** | Os DTOs definem formatos de entrada e saída para pessoas, responsáveis, moradias, localização, famílias, pets, fotos e URLs assinadas. | Padroniza os dados trafegados entre frontend e backend, reduz exposição de campos sensíveis e torna os contratos da API mais claros. |
| **Dependency Injection por Construtor** | Controllers recebem services, services recebem repositories e alguns repositories aceitam um `Queryable` para uso com `pool` ou cliente transacional. | Reduz acoplamento entre classes, facilita testes com mocks e permite reutilizar a mesma operação dentro ou fora de transações. |
| **Interface Segregation / Contratos** | Existem interfaces específicas para services e repositories, como `IPessoaService`, `IFamiliaRepository`, `IMoradiaService`, `IPetRepository` e equivalentes. | Os contratos deixam claro o que cada camada pode consumir, evitando dependência direta de implementações concretas. |
| **Validação e Normalização Centralizadas** | Arquivos em `validations/` e funções em `request-utils.ts` validam payloads, IDs, datas, números, booleanos, campos obrigatórios e aliases de campos. | Garante consistência antes da persistência, reduz duplicação nos controllers e melhora a qualidade dos dados coletados em campo. |
| **Custom Exception e Erro Padronizado** | A classe `HttpError` representa erros de negócio com status HTTP, e `handleControllerError` padroniza as respostas de erro. | Diferencia erros esperados, como ID inválido, registro inexistente ou conflito de responsável, de falhas internas, sem expor detalhes técnicos. |
| **Transação / Unit of Work** | Operações que afetam múltiplas tabelas usam `BEGIN`, `COMMIT` e `ROLLBACK` nos services com o mesmo cliente de banco (ex.: `familia.service.ts` no cadastro de núcleo via `POST /api/familias/nucleo`). | Mantém integridade em fluxos críticos, como criação de responsável, moradia com localização, atualização conjunta e cadastro completo de núcleo familiar. |
| **Soft Delete e Views Ativas** | O banco usa `deleted_at`, status e views como `vw_pessoa_ativa`, `vw_moradia_ativa` e `vw_familia_ativa` para consultas operacionais. | Preserva histórico e conformidade com LGPD, enquanto evita que registros arquivados apareçam nas listagens e vínculos ativos. |
| **Regras de Integridade no Banco** | Migrações adicionam restrições como foto com exatamente um dono (`moradia` ou `pet`) e trigger de responsável único por família ativa. | Reforça regras críticas mesmo se uma chamada futura contornar a camada de serviço, protegendo consistência entre família, moradia, pessoa, pet e foto. |
| **Adapter / Facade para Serviço Externo** | O acesso ao Supabase Storage fica isolado em `storage/supabase-storage.client.ts` e no `FotoStorageService`, com URLs assinadas para upload e leitura. | Centraliza a integração externa de fotos, separa metadados relacionais dos arquivos e evita que controllers e repositories dependam diretamente da API do Supabase. |

## 3.3. Wireframes (sprint 2)

Esta seção é destinada para apresentar os primeiros esboços do sistema: os wireframes. Além de ser a representação das telas de menor fidelidade com o resultado final, esses esboços orientam a estruturação inicial da interface antes do desenvolvimento.

Um wireframe é um quadro (frame) com a estrutura do sistema desenhada em fios (wire) ou blocos de maneira bastante simples.

Vale ressaltar que todas as informações presentes nos wireframes são apenas para facilitar a visualização futura de uma aplicação funcional. Caso alguma informação precise ser adicionada ou excluída, isso será possível futuramente.

### **1. Página Inicial**

<div align="center">
    <p>Figura 13: Wireframe Tela Inicial</p>
    <img src="outros/paginaInicial.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Num primeiro momento, a ideia desse wireframe é a simplicidade e a intuitividade. O layout escolhido, com três grandes botões centralizados, e um cabeçalho, importante mas não principal, posicionado na parte de cima, tem como objetivo trazer poucas informações na tela, servindo apenas para uma recepção amigável e uma navegação intuitiva entre outras páginas.

Além disso, na parte superior, existem duas logos: Defesa Civil de Santo André (círculo maior) e Prefeitura de Santo André (círculo menor). Junto dessas logos, respectivamente, há um texto generalizado (como "Olá Agente!") e um texto de cabeçalho simples. Por fim, a engrenagem no canto superior esquerdo significa uma possível aba de configurações.

Por fim, mas não menos importante, o menu de navegação presente na parte inferior inteira da tela, contém ícones referentes aos três grandes botões. Isso foi implementado como um "rodapé" fixo para a aplicação, presente em todo o restante das telas, a fim de facilitar a navegação entre telas, deixando o usuário mais livre para transitar entre tarefas.

---

### **2. Páginas de Cadastro**

Ao clicar no botão "Novo Cadastro", o usuário será redirecionado para a tela de cadastro, para inserir novos dados de pessoas e moradias no banco de dados.

A ideia inicial é seguir uma ordem, separando cada seção por tela e guiando o usuário com setas indicando "próximo" e "voltar". No entanto, com o objetivo de deixar a navegação o mais livre possível, foi pensada uma barra na parte superior da tela, abaixo do cabeçalho, contendo quatro botões clicáveis que redirecionam para cada seção.

Quanto ao menu de navegação, ele será mantido na parte inferior da tela, da mesma forma que foi inserido na tela inicial.

Para concluir o cadastro, um botão "Concluir Cadastro" deve ser exibido assim que todos os campos obrigatórios forem preenchidos. (Obs: os campos obrigatórios ainda não foram definidos completamente na sprint 3, por isso os wireframes não os abordam)

---

<div align="center">
    <p>Figura 14: Wireframe Tela Cadastro - Moradias</p>
    <img src="outros/cadastro1.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Esta seção engloba todas as informações necessárias para completar o cadastro das moradias. 

Uma funcionalidade adicional que vale a pena ressaltar, é a de inclusão de imagens. No bloco de "Referência Geográfica", será possível adicionar uma imagem tanto por foto quanto por upload, além de ser possível excluí-la.

Outra funcionalidade interessante é a de seleção de múltipla escolha em um bloco, representada por uma seta para baixo que, ao clicar, são exibidos todos os preenchimentos possíveis para aquele campo.

Neste wireframe, por conter uma tela bastante preenchida com informações pertinentes, os botões "Próximo" e "Voltar" não estão representados. Porém, é possível identificar uma barra na lateral direita, sinalizando que a página pode ser arrastada para baixo.

---

<div align="center">
    <p>Figura 15: Wireframe Tela Cadastro - Responsável</p>
    <img src="outros/cadastro2.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Esta seção engloba todas as informações necessárias para completar o cadastro do responsável.

A ideia desta tela se assemelha muito à anterior, contendo campos de informação preenchíveis, tanto por digitação quanto por múltipla escolha. No entanto, esta página não terá um campo que permita a adição de fotos ou arquivos.

Neste wireframe, por conter uma tela bastante preenchida com informações pertinentes, os botões "Próximo" e "Voltar" não estão representados. Porém, é possível identificar uma barra na lateral direita, sinalizando que a página pode ser arrastada para baixo.

---

<div align="center">
    <p>Figura 16: Wireframe Tela Cadastro - Moradores</p>
    <img src="outros/cadastro3.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Esta seção engloba todas as informações necessárias para completar o cadastro dos moradores restantes.

Nesse wireframe, algumas informações que estavam presentes na seção 2 serão preservadas, mas outras (como renda) serão removidas, com o intuito de deixar mais simples. 

Além disso, vale ressaltar que na imagem está representado apenas o preenchimento de um morador. No caso de existir mais moradores, o usuário deve clicar na área tracejada "+ Adicionar Morador". Assim, um novo bloco de campos preenchíveis, com as mesmas informações, deve surgir para registro e a área tracejada deve ser exibida logo abaixo o novo bloco de campos.

---

<div align="center">
    <p>Figura 17: Wireframe Tela Cadastro - Pets</p>
    <img src="outros/cadastro4.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Esta seção engloba todas as informações necessárias para concluir o cadastro de Pets (se houver).

Para o cadastro de Pets, será possível incluir algumas informações essenciais e uma foto do animal. No caso de existir mais de um animal, o usuário deve clicar na área tracejada "+ Adicionar Animal". Assim, um novo bloco de campos preenchíveis, com as mesmas informações, deve surgir para registro e a área tracejada deve ser exibida logo abaixo o novo bloco de campos.

---

### **3. Página de Mapa**

<div align="center">
    <p>Figura 18: Wireframe Tela Mapa</p>
    <img src="outros/mapa.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Esta seção permite a interação com um mapa georreferenciado e refinar a exibição de dados utilizando um menu lateral de Filtros com diversas caixas de seleção. Além disso, uma peculiaridade dessa seção é a possibilidade de recolher esse painel de filtros para maximizar a área visual do mapa, bem como a barra retrátil de navegação na parte inferior da tela, que permite ao usuário alternar agilmente entre os módulos de "Mapa", "Formulário" e "Consulta".

### **4. Página de Busca**

<div align="center">
    <p>Figura 19: Wireframe Tela Busca</p>
    <img src="outros/consulta1.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Esta seção permite a localização rápida de registros no sistema através de um campo de busca textual localizado no topo da tela. Para refinar a pesquisa e direcionar os resultados, o usuário conta com seletores sob o título "Tipo de pesquisa", permitindo alternar de forma simples entre a busca por dados de "Moradia" ou por "Responsável".

Os dados encontrados são apresentados na área de "Resultados" em formato de lista contínua com cartões (cards). Cada cartão é estruturado para exibir uma imagem ou foto de referência à esquerda, acompanhada de linhas detalhadas de informações textuais à direita. Além disso, a tela preserva a barra retrátil de navegação na área inferior, garantindo que o usuário possa expandi-la para alternar agilmente entre os demais módulos do sistema.

<div align="center">
    <p>Figura 20: Wireframe Tela Resultado da Busca</p>
    <img src="outros/consulta2.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

Esta seção apresenta o detalhamento de um registro específico, acessado após a etapa de pesquisa. No topo, a interface mantém a barra superior e um campo de busca em destaque (com um ícone de lupa), pois o detalhamento aparece como um pop-up sobre a tela de busca, permitindo que o usuário mantenha o contexto e a possibilidade de alternar rapidamente para outros registros. O layout do detalhamento é dividido em duas colunas: à esquerda, uma imagem ou foto de referência relacionada ao registro; à direita, um conjunto organizado de informações textuais, estruturadas em linhas para facilitar a leitura e compreensão dos dados apresentados.


## 3.4. Guia de estilos (sprint 3)

Esta seção apresenta o guia de estilos utilizado no desenvolvimento da aplicação web. Aqui estão definidos os padrões visuais e componentes de interface adotados, como cores, tipografia, botões, ícones e demais elementos gráficos. O objetivo é garantir consistência visual, padronização e melhor experiência de uso durante o desenvolvimento e evolução da solução.

<div align="center">
    <p>Figura 21: Guia de estilos</p>
    <img src="outros/guia_de_estilos.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

### 3.4.1 Cores

A paleta de cores pensada para a prototipação foi inspirada na logo oficial da própria Defesa Civil de Santo André e do CREDEC-SA (Centro de Resiliência às Emergências de Defesa Civil de Santo André). Logos: 

<div align="center">
    <p>Figura 22: Logo da Defesa Civil de Santo André</p>
    <img src="outros/logoSantoAndre.png" width="200">
    <p>Defesa Civil de Santo André</p>
</div>

<div align="center">
    <p>Figura 23: Logo do CREDEC-SA</p>
    <img src="outros/logoCREDEC.png" width="200">
    <p>CREDEC-SA</p>
</div>

A equipe decidiu usar dois tons de azul, um de laranja e três cores neutras. A composição da paleta ficou assim: 

- Azul Escuro: #182C4C
- Azul Claro: #004ea1
- Laranja: #ff7500
- Cinza Escuro: #5e5e5e
- Cinza Claro: #9f9f9f
- Branco: #ffffff 


### 3.4.2 Tipografia

A família tipográfica utilizada na solução é a **DM Sans**, uma fonte geométrica sem serifa (sans-serif) de baixo contraste, projetada pela Colophon Foundry. É ideal para textos legíveis em tamanhos menores e apresenta formas geométricas claras que transmitem um tom neutro e objetivo.

| Estilo | Peso | Tamanho | Uso |
|---|---|---|---|
| Título | DM Sans Bold | 64px | Títulos principais de página |
| Header 1 | DM Sans Regular | 48px | Cabeçalhos de seção primária |
| Header 2 | DM Sans Regular | 40px | Cabeçalhos de seção secundária |
| Header 3 | DM Sans Regular | 36px | Cabeçalhos terciários |
| Header 4 | DM Sans Regular | 32px | Cabeçalhos quaternários |
| Header 5 | DM Sans Regular | 24px | Cabeçalhos de menor hierarquia |
| Corpo / Label | DM Sans Light | 16px | Textos descritivos, legendas e rótulos de componentes |

A cor de texto primária é `#1a1a2e`, utilizada em headers e corpo sobre fundo branco ou claro. Em fundos coloridos, aplica-se texto branco (`#ffffff`).

### 3.4.3 Iconografia e Imagens

A solução utiliza um conjunto de ícones de linha (outline) com estilo geométrico, coerente com a tipografia DM Sans.

**Atributos de aplicação:**

- **Cor padrão:** `#5e5e5e` — ícones em estado neutro
- **Cor ativa:** `#004ea1` — ícones em estado selecionado ou ação principal
- **Cor sobre fundo escuro:** `#ffffff` — sobre fundos `#182C4C` ou `#004ea1`
- **Tamanho padrão:** 24×24px

| Ícone | Função |
|---|---|
| Documento | Representar arquivos ou conteúdos |
| Casa | Navegação para a tela inicial |
| Lupa | Acionar campo de pesquisa |
| Copiar | Duplicar conteúdo ou elemento |
| Editar | Editar informações |
| Diamante | Indicar item especial ou favorito |
| Localização | Indicar endereço ou mapa |
| Upload | Enviar ou exportar conteúdo |
| Lixeira | Excluir item |
| Grade | Visualização em formato de tabela |
| Filtro | Filtrar listagens ou resultados |
| Seta | Navegar para o próximo passo ou página |

## 3.5. Protótipo de alta fidelidade (sprint 3)

### Protótipo Tela Inicial

A tela inicial apresenta o logotipo da Defesa Civil de Santo André centralizado
no topo, sobre um fundo azul gradiente, seguido da saudação **"Bem vindo, Agente."**
com destaque em laranja no nome do perfil.

O conteúdo principal exibe três opções de navegação em formato de cards:

- **Cadastro** — card destacado com fundo azul e borda laranja, indicando a ação
  primária da tela. Contém ícone de documento à esquerda e seta de navegação à direita.
- **Busca** — card secundário com fundo branco, ícone de lupa e seta de navegação.
- **Mapa** — card secundário com fundo branco, ícone de localização e seta de navegação.

Na parte inferior, uma barra de navegação fixa exibe os três atalhos principais:
**Cadastro**, **Mapa** (ativo) e **Busca**, com ícones e rótulos de texto.

---

<div align="center">
    <p>Figura 24: Mockup da Tela Inicial </p>
    <img src="outros/inicial v2.png" width="400">
    <p>Feito pela própria equipe (2026)</p>
</div>

### Protótipos da Tela de Mapa

A tela de mapa exibe um cabeçalho azul escuro com o logotipo da Defesa Civil à
esquerda, o título **"Visualização"** centralizado e um ícone de home à direita
para retornar à tela inicial.

O conteúdo principal é ocupado por um mapa interativo da região de Santo André,
sobre o qual é sobreposto um painel lateral de **Filtros** no canto esquerdo.
O painel possui borda laranja, fundo branco e lista categorias de ocorrências
selecionáveis via checkbox. Um botão com seta **"<"** permite recolher o painel,
expandindo a área visível do mapa.

A barra de navegação inferior mantém o padrão da aplicação com os atalhos
**Cadastro**, **Mapa** (ativo) e **Busca**.

 <div align="center">
    <p>Figura 25: Mockup Tela de Mapa </p>
    <img src="outros/mapa v2.png" width="400">
    <p>Feito pela própria equipe (2026)</p>
</div> 

### Protótipos da Tela de Busca

A tela de busca mantém o cabeçalho padrão com logotipo, título **"Busca"** e
ícone de home. Abaixo, um campo de texto com ícone de lupa permite inserir termos
de pesquisa, acompanhado de um botão de filtro à direita.

Os resultados são exibidos abaixo do label **"Resultados:"** em azul, com um
contador de registros encontrados ("4 encontrados") alinhado à direita.

Cada resultado é apresentado em um card com borda arredondada contendo:
- **Nome completo** em destaque e CPF como subtítulo
- **Localização** (bairro), **quantidade de pessoas** e **quantidade de pets**
  com ícones correspondentes
- **Tags coloridas** indicando vulnerabilidades do cadastro (ex.: Gestante,
  Criança, Idoso, Doença Crônica), cada uma com cor própria
- Botão **"Editar"** com ícone à direita e botão de **exclusão** (lixeira) abaixo

A barra de navegação inferior mantém o padrão com **Cadastro**, **Mapa** (ativo)
e **Busca**.

 <div align="center">
    <p>Figura 26: Mockup Tela de Busca </p>
    <img src="outros/busca v2.png" width="400">
    <p>Feito pela própria equipe (2026)</p>
</div> 

### Protótipos das telas de Cadastro

Estes protótipos apresentam grandes semelhanças entre eles, visto que possuem quase que a mesma funcionalidade. Entre elas estão, barra azul superior, barra de navegação entre seções, título indicando seção, menu de navegação inferior, botão "Próximo" (embora na seção 2 não seja possível ver), campos para preenchimento de informações, sinalização de obrigatoriedade (* vermelho) e barra lateral indicando possível arraste da página ("scroll up" e "scroll down")

Além disso, os protótipos apresentam funcionalidades em comum, sendo elas: a barra de navegação entre seções indica em qual seção o usuário está (deixando o bloco referente à seção atual azul); o botão "Concluir", apesar de ausente, é exibido assim que o usuário completar todos os campos obrigatórios em qualquer seção; campos preenchíveis por digitação, seleção múltipla, "sim ou não", seleção de data e adição de imagens. 

---

<div align="center">
    <p>Figura 27: Mockup da Seção 1 de Cadastro </p>
    <img src="outros/formularioMoradia.png" width="400">
    <p>Feito pela própria equipe (2026)</p>
</div>

A primeira tela ao clicar no botão "Cadastro" da tela inicial é a seção 1, referente à entrada dos dados da moradia. A partir daqui, o usuário fica livre para navegar entre as seções de cadastro conforme o contexto da entrevista com os moradores evolui. 

A primeira seção engloba todos os dados necessários para o cadastro da moradia visitada. 

Um detalhe bastante importante sobre a mudança dos wireframes para os mockups é a disposição da barra superior da tela. As mudanças citadas a seguir se aplicam à todas as telas de cadastro: exclusão do botão de configurações; exclusão da imagem de logo à esquerda; reposicionamento da logo da Defesa Civil de Santo André; exclusão do pequeno texto acompanhado da logo; adição do ícone de casa (redireciona para a tela inicial). 

Este protótipo já apresenta exemplos de informações a serem adicionadas nos campos e como ficaria com todos preenchidos, incluindo a imagem de referência minimizada.

---

<div align="center">
    <p>Figura 28: Mockup da Seção 2 de Cadastro </p>
    <img src="outros/formularioResponsavel.png" width="400">
    <p>Feito pela própria equipe (2026)</p>
</div>

A segunda seção engloba todos os dados necessários para o cadastro do responsável pela família/moradia. 

Este protótipo, diferente do anterior, mostra como são os campos de resposta "sim ou não" (boolean) e sinaliza exatamente como o menu inferior interage com o restante dos elementos na tela: opacidade parcial. Além disso, esta tela, por conter uma quantidade maior de informações, não mostra os campos de problema crônico, medicamento e prioridade que, por sua vez, estão ocultos juntos do botão de próximo. Todo o conteúdo poderá ser visualizado com um simples arraste na tela para baixo.

Este protótipo já apresenta exemplos de informações a serem adicionadas nos campos e como ficaria com todos preenchidos.

---

<div align="center">
    <p>Figura 29: Mockup da Seção 3 de Cadastro </p>
    <img src="outros/formularioMoradores.png" width="400">
    <p>Feito pela própria equipe (2026)</p>
</div>

A terceira seção engloba todos os dados necessários para o cadastro de todos os moradores da moradia visitada. 

Este protótipo, basicamente imita a estrutura dos dois anteriores e indica todas as informações obrigatórias ou não e o tipo de preenchimento. Por outro lado, esta seção e a próxima apresentam um novo grande botão tracejado. No caso dessa página, ao clicar, o usuário adicionará mais um morador. Além disso, os dados preenchidos do primeiro morador devem ser ocultos e compactados para uma longa barra horizontal que, se clicada, expandirá todos os dados do morador cadastrado. O botão "+Adicionar Morador" estará sempre visível abaixo do último formulário incompleto ou expandido. 

Vale a pena ressaltar que os dados de moradores, selecionados pela equipe, também estão presentes na seção 2 (Responsável), mas apenas os dados que foram julgados essenciais ficaram para a seção 3.

Este protótipo já apresenta exemplos de informações a serem adicionadas nos campos e como ficaria com todos preenchidos.

---

<div align="center">
    <p>Figura 30: Mockup da Seção 4 de Cadastro </p>
    <img src="outros/formularioPets.png" width="400">
    <p>Feito pela própria equipe (2026)</p>
</div>

A quarta seção engloba todos os dados necessários para o cadastro de todos os pets/animais vinculados à moradia visitada. 

Este protótipo é bastante semelhante ao anterior em termos de estrutura, porém apresenta informações diferentes a serem preenchidas, já que aqui o assunto é um animal, e não uma pessoa. 

A funcionalidade de adicionar mais de um cadastro também está presente aqui e, assim como na seção 1 (Moradia), existe a possibilidade de ser cadastrada uma imagem de referência do(s) animal(is), mas agora com um campo que indique o nome do arquivo inserido.

Por fim, é apenas nesse protótipo que o botão "Concluir" está representado porque entende-se que, mesmo com a liberdade de escolha para a ordem de preenchimento dos dados, a seção de pets muitas vezes será a última.

Este protótipo já apresenta exemplos de informações a serem adicionadas nos campos e como ficaria com todos preenchidos, incluindo com imagens.


---

[Link para visualização do protótipo](https://www.figma.com/design/9C6LICPO1RCl5y9UaVsCQo/Mockups?node-id=0-1&p=f&t=KbpgFnX3YR4LP3ui-0)

---

## 3.6. Modelagem do banco de dados (sprints 2 e 4)

### 3.6.1. Modelo Entidade-Relacionamento (MER)

O **Modelo Entidade-Relacionamento (MER)** é uma abordagem conceitual que representa a estrutura de dados de um sistema através da identificação de entidades (objetos do mundo real), seus atributos e os relacionamentos entre elas. Para este projeto, adotamos a **notação Chen**, que utiliza retângulos para entidades, losangos para relacionamentos, elipses para atributos e triângulos para especializações, oferecendo clareza visual e conformidade com padrões acadêmicos e profissionais.

<div align="center">
    <p>Figura 31: Modelo Entidade-Relacionamento</p>
    <img src="outros/MER.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

> **Versão em Mermaid (fonte da verdade: schema real em `src/geoRisco/src/`).** Base fiel para regerar o PNG. Cardinalidades conferidas contra os repositories e migrations.

```mermaid
erDiagram
    familia ||--o{ pessoa_familia : "tem (N:N temporal)"
    pessoa  ||--o{ pessoa_familia : "participa"
    familia ||--o{ familia_moradia : "ocupa (N:N temporal)"
    moradia ||--o{ familia_moradia : "ocupada por"
    localizacao ||--|| moradia : "localiza (1:1)"
    familia ||--o{ pet : "possui"
    moradia ||--o{ foto : "tem"
    pet     ||--o{ foto : "tem"
    pessoa  ||--o{ pessoa_grupo_prioritario : "classificada em"
    grupo_prioritario ||--o{ pessoa_grupo_prioritario : "agrupa"
```

> **Restrição não expressável em cardinalidade:** cada `foto` pertence a **exatamente um** dono — `id_moradia` XOR `id_pet` (`CHECK foto_um_dono_chk`). O **"responsável" não é mais uma entidade separada**: a tabela `responsavel` foi removida (migration `09_merge_responsavel_into_pessoa`) e seus atributos viraram colunas opcionais em `pessoa`. Uma pessoa é responsável quando tem `parentesco = 'Responsável'` e esses campos preenchidos; a regra de um responsável ativo por família é garantida por trigger (migration `05`).

O modelo de dados foi estruturado seguindo as melhores práticas de normalização, rastreabilidade e integridade referencial, com foco em sistemas governamentais. As principais decisões arquiteturais refletidas no diagrama são:

#### 1. Herança e Especialização (Pessoa e Responsável)
Para evitar redundância de dados e focar no Responsável da Família, adotamos o padrão de herança (representado pelo triângulo na notação Chen).
* **`Pessoa` (Superclasse):** Centraliza os atributos universais (Nome Social, Data de Nascimento, Escolaridade, Situação Ocupacional, Medicação, Status, CPF).
* **`Responsável` (Subclasse):** Herda atributos de Pessoa e agrega dados específicos de gestão familiar: NIS, Renda, Programas Sociais, dados de contato (Telefone, Email) e informações de residência.

#### 2. Agrupamento Lógico por `Família`
Em vez de vincular dezenas de indivíduos diretamente a uma moradia de forma solta, criamos a entidade agrupadora **`Família`**.
* Toda `Pessoa` está vinculada a uma `Família` (relacionamento *Pertence*) com cardinalidade (1, n).
* **Vantagem Técnica:** Essa decisão facilita o trânsito de dados. Se uma enchente desalojar 6 pessoas de uma casa, o sistema precisa atualizar apenas o registro da entidade `Família` na tabela associativa `familia_moradia` (presente no DER), e todos os membros herdam a mudança automaticamente.

#### 3. Rastreabilidade e Histórico (Relacionamento N:N "ocupa")
O maior desafio resolvido neste modelo foi a preservação do histórico de ocupação sem duplicar dados físicos. A estrutura da **`Moradia`** (localização geográfica, CEP, características construtivas) é imutável. O que muda é quem mora lá.
* Criamos o relacionamento **Muitos-para-Muitos (N:N)** chamado **`ocupa`** entre `Família` e `Moradia`, com cardinalidade (1, n) em ambas as extremidades.
* Este relacionamento gera uma tabela associativa contendo atributos temporais: **`Status`**, **`DataEntrada`** e **`DataSaida`**, permitindo rastrear períodos de ocupação.
* **Como funciona:** Quando uma família se muda ou é evacuada, preenchemos a `DataSaida` do vínculo atual e criamos um novo vínculo com a nova moradia. Assim, temos a linha do tempo exata de por quais imóveis a família passou e quais famílias já ocuparam determinadas moradias de risco, sem perder nenhum dado histórico.

#### 4. Exclusão Lógica (Soft Delete) e Estados Operacionais
Em conformidade com a LGPD e regras de auditoria pública, **nenhum dado é deletado fisicamente (DROP/DELETE)**.
* Inserimos o atributo **`Status`** nas entidades vitais (`Pessoa`, `Família` e `Moradia`).
* Se um morador sai do município, o status da `Pessoa` fica inativo. Se uma moradia é desapropriada ou demolida, o status é atualizado para o estado correspondente. O histórico permanece intacto para auditoria.

#### 5. Entidades Satélites Flexíveis
* **`Foto`:** Ligada em uma relação (0, n) com `Moradia` ou `Pet`, permitindo criar galerias de fotos para identificação e documentação visual.
* **`Pet`:** Relacionada a `Família` (0, n), registrando animais de estimação dependentes para logística humanitária em evacuações.
* **`GrupoPrioritario`:** Relacionada a `Pessoa` (0, n), permitindo associar cidadãos a listas de vulnerabilidade (ex: Acamados, Deficientes Visuais), agilizando a logística de resgates em emergências.

#### 6. Localização Geográfica e Referência Endereçal
A entidade **`localizacao`** centraliza dados geográficos e endereçais:
* Relacionada a `Moradia` (1, 1), garantindo que cada imóvel possui uma localização única e imutável.
* Armazena **Latitude**, **Longitude**, **CEP**, **Logradouro**, **Bairro**, **Cidade**, **Estado**, **Número**, **Referência** e **Complemento**, permitindo georreferenciamento preciso e retroação em mapas de risco.

### 3.6.2. Modelo Lógico

O modelo lógico traduz o modelo conceitual para a estrutura de um banco de dados relacional, definindo as tabelas, as chaves primárias (PK), as chaves estrangeiras (FK) e a multiplicidade dos relacionamentos. Esta versão está rigorosamente alinhada com as decisões arquiteturais adotadas para a plataforma Supabase, com ênfase na rastreabilidade temporal, na conformidade com as leis de proteção de dados (deleção lógica) e na especialização das entidades.

#### Diagrama de Entidade-Relacionamento (DER)

Abaixo é apresentado o esquema visual do banco de dados, ilustrando as tabelas físicas, os seus atributos e os relacionamentos implementados.

<div align="center">
    <p>Figura 32: Diagrama Entidade-Relacionamento Lógico</p>
    <img src="outros/DER.png">
    <p>Feito pela própria equipe (2026)</p>
</div>

> **Versão em Mermaid (modelo físico — colunas e tipos extraídos dos models e das queries dos repositories).** Base fiel para regerar o PNG.

```mermaid
erDiagram
    familia {
        bigserial id PK
        timestamptz deleted_at "soft delete (RULE soft_delete_familia)"
    }
    pessoa {
        bigserial id PK
        varchar nome
        varchar nome_social
        varchar cpf UK
        date data_de_nascimento
        parentesco_enum parentesco
        situacao_ocupacional_enum situacao_ocupacional
        escolaridade_enum escolaridade
        boolean cronico
        boolean medicacao
        status_pessoa_enum status "Ativo|Obito|Inativo"
        timestamptz deleted_at "RULE soft_delete_pessoa"
        varchar nis "ex-responsavel, nullable"
        numeric renda "nullable"
        sexo_enum sexo "nullable"
        raca_enum raca "nullable"
        estado_civil_enum estado_civil "nullable"
        boolean veiculo "nullable"
        int programas_sociais "nullable"
        varchar email UK "nullable"
        varchar telefone UK "nullable"
        varchar nome_da_mae "nullable"
        date data_residencia_moradia "nullable"
    }
    localizacao {
        bigserial id PK
        varchar logradouro
        varchar numero
        varchar bairro
        varchar cidade
        varchar estado
        varchar cep
        double latitude
        double longitude
        varchar referencia
        varchar complemento
    }
    moradia {
        bigserial id PK
        bigint id_localizacao FK "UK (1:1)"
        tipo_construcao_enum tipo_construcao
        date data_registro
        status_moradia_enum status "Ativa|Interditada|Demolida|Em Risco|Excluída"
        uso_imovel_enum uso_imovel
        int pavimentos
        situacao_ocupacao_moradia_enum situacao_de_ocupacao
        varchar descricao
        timestamptz deleted_at "RULE soft_delete_moradia"
    }
    pet {
        bigserial id PK
        bigint id_familia FK
        tipo_pet_enum tipo
        varchar nome
        varchar porte
        varchar raca
        varchar cor
        varchar status "default Ativo"
        varchar observacao
    }
    foto {
        bigserial id PK
        bigint id_moradia FK "nullable"
        bigint id_pet FK "nullable, ON DELETE CASCADE"
        varchar url
    }
    grupo_prioritario {
        bigserial id PK
        varchar condicao
        tipo_prioridade_enum tipo "Mental|Físico"
    }
    pessoa_familia {
        bigint id_pessoa PK_FK
        bigint id_familia PK_FK
        date data_entrada PK
        date data_saida "null = vínculo ativo"
    }
    familia_moradia {
        bigint id_familia PK_FK
        bigint id_moradia PK_FK
        date data_entrada PK
        date data_saida "null = ocupação ativa"
        varchar status
    }
    pessoa_grupo_prioritario {
        bigint id_pessoa PK_FK
        bigint id_grupo_prioritario PK_FK
    }

    familia ||--o{ pessoa_familia : ""
    pessoa  ||--o{ pessoa_familia : ""
    familia ||--o{ familia_moradia : ""
    moradia ||--o{ familia_moradia : ""
    localizacao ||--|| moradia : ""
    familia ||--o{ pet : ""
    moradia ||--o{ foto : ""
    pet     ||--o{ foto : ""
    pessoa  ||--o{ pessoa_grupo_prioritario : ""
    grupo_prioritario ||--o{ pessoa_grupo_prioritario : ""
```

> **Notas de fidelidade:** índice único parcial `familia_moradia (id_moradia) WHERE data_saida IS NULL` garante uma única ocupação ativa por moradia (migration `08`). O soft delete de `pessoa`, `familia` e `moradia` é feito por `RULES` do PostgreSQL que interceptam `DELETE` e gravam `deleted_at`; as views `vw_pessoa_ativa`, `vw_moradia_ativa` e `vw_familia_ativa` filtram `deleted_at IS NULL`. `pet` e `foto` usam exclusão física.
---

#### 1. Entidades Principais e Especializações

**Pessoa**
Entidade base que guarda os dados de qualquer morador ou cidadão assistido. Após a consolidação do responsável (migration `09`), também armazena os atributos de responsável como colunas **opcionais** na própria tabela.
* **Campos (núcleo):** `id` (PK), `cpf` (UK), `nome`, `nome_social`, `data_de_nascimento`, `parentesco`, `situacao_ocupacional`, `escolaridade`, `cronico`, `medicacao`, `status`, `deleted_at`.
* **Campos de responsável (opcionais, preenchidos quando `parentesco = 'Responsável'`):** `nis`, `renda`, `sexo`, `raca`, `estado_civil`, `veiculo`, `programas_sociais` (inteiro), `email` (UK), `telefone` (UK), `nome_da_mae`, `data_residencia_moradia`.

> **Nota:** o "Responsável" **não é mais uma entidade/tabela separada** — a tabela `responsavel` foi removida (`DROP TABLE responsavel CASCADE`, migration `09`) e seus campos foram absorvidos por `pessoa`.

**Família**
Atua como a entidade agregadora central do sistema (*hub*), permitindo agrupar os cidadãos e os respectivos animais de estimação independentemente da moradia física, o que facilita sobremaneira as transições e relocalizações em casos de desalojamento.
* **Campos:** `id` (PK), `status`, `deleted_at`.

**Localização**
Isola as coordenadas geográficas e o endereço do imóvel, viabilizando o processamento de dados espaciais e a geração de mapas de calor para a Defesa Civil.
* **Campos:** `id` (PK), `logradouro`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `latitude`, `longitude`, `referencia`, `complemento`.

**Moradia**
Representa a infraestrutura residencial ou comercial atrelada a uma localização espacial unívoca.
* **Campos:** `id` (PK), `id_localizacao` (FK para `localizacao`, UNIQUE), `tipo_construcao`, `data_registro`, `status`, `uso_imovel`, `pavimentos`, `situacao_de_ocupacao`, `descricao`, `deleted_at`.

**Pet**
Registo dos animais associados à família, cuja informação é fundamental para as logísticas de evacuação e de acolhimento em abrigos.
* **Campos:** `id` (PK), `id_familia` (FK para `familia`), `nome`, `porte`, `raca`, `cor`, `observacao`, `tipo`.

**Grupo Prioritário**
Cataloga as condições de vulnerabilidade ou necessidades especiais (físicas ou mentais), de modo a priorizar resgates ou assistências (ex: gestantes, acamados).
* **Campos:** `id` (PK), `condicao`, `tipo`.

**Foto**
Registos visuais para atestar a condição estrutural e a avaliação de risco no terreno.
* **Campos:** `id` (PK), `id_pet` (FK para `pet`), `id_moradia` (FK para `moradia`), `url`.

---

#### 2. Entidades Associativas e de Histórico (Relacionamentos N:N)

Para garantir a preservação do histórico de ocupações (auditoria pós-desastre e acompanhamento ao longo dos anos), foram modeladas tabelas associativas temporais cuja chave primária composta incorpora `data_entrada` - campo obrigatório. Já `data_saida` é opcional e não compõe a chave primária, mas também ajuda na organização dos dados das moradias em relação ao histórico de ocupação.

**Pessoa_Família**
Vincula os indivíduos aos núcleos familiares e regista o seu período de permanência.
* **Campos:** `id_pessoa` (PK, FK), `id_familia` (PK, FK), `data_entrada` (PK), `data_saida`.

**Família_Moradia**
Regista quando um agregado familiar entra ou desocupa uma residência, possibilitando a total rastreabilidade da habitação territorial no município.
* **Campos:** `id_familia` (PK, FK), `id_moradia` (PK, FK), `data_entrada` (PK), `data_saida`, `status`.

**Pessoa_Grupo_Prioritario**
Associação pura (sem temporalidade restrita) entre os indivíduos e os diversos grupos de prioridade a que podem simultaneamente pertencer.
* **Campos:** `id_pessoa` (PK, FK), `id_grupo_prioritario` (PK, FK).

---

#### 3. Domínios de Dados e Tipos Enumerados (ENUMs)

Por forma a padronizar as entradas de dados e evitar inconsistências nos formulários da aplicação (e também ao nível do banco de dados), as seguintes colunas foram restringidas a tipos de dados enumerados (*ENUMs*):

* **Controlo Lógico:** `status_familia_enum` (Ativo, Inativo), `status_pessoa_enum` (Ativo, Obito, Inativo), `status_moradia_enum` (Ativa, Interditada, Demolida, Em Risco, Excluída).
* **Identificação Demográfica:** `sexo_enum`, `raca_enum`, `estado_civil_enum`, `escolaridade_enum`, `situacao_ocupacional_enum`, `parentesco_enum`.
* **Infraestrutura e Ocupação:** `tipo_construcao_enum`, `uso_imovel_enum`, `situacao_ocupacao_moradia_enum`.
* **Classificações Especiais:** `tipo_pet_enum` (cachorro, gato, reptil, ave, roedor, outros), `tipo_prioridade_enum` (Mental, Físico).

---

#### 4. Regras e Restrições Estruturais

* **Integridade Referencial:** Todas as *Foreign Keys* estão acompanhadas da ação `ON DELETE CASCADE`. Deste modo, assegura-se que a base de dados não manterá registos órfãos quando entidades de nível superior (ex: localização ou moradia real) forem limpas.
* **Exclusão Lógica (*Soft Delete*):** A eliminação física de Famílias, Moradias e Pessoas não ocorre. Qualquer comando `DELETE` emitido pela aplicação é interceptado de modo transparente pelo PostgreSQL (através de `RULES`), passando apenas a atualizar as colunas de estado e preenchendo o campo `deleted_at`.
* **Unicidade Restrita (`UNIQUE`):** Implementada para impossibilitar redundâncias em documentos e contatos de alta criticidade (`pessoa.cpf`, `pessoa.email` e `pessoa.telefone` — estes dois últimos via índices únicos `pessoa_email_unique_idx` e `pessoa_telefone_unique_idx`, após a consolidação do responsável em `pessoa`) e para garantir o relacionamento um-para-um (1:1) rigoroso do campo `id_localizacao` alocado a cada `moradia`.

### 3.6.3. Modelo Físico

#### Diagrama Entidade-Relacionamento (DER) — Modelo Físico

O modelo físico apresentado implementa a arquitetura conceitual descrita em 3.6.1 e 3.6.2 utilizando PostgreSQL como SGBD. As principais decisões de implementação refletem os requisitos de rastreabilidade, integridade referencial, conformidade com a LGPD e otimização para mapeamento geográfico de áreas de risco, rodando em ambiente Supabase.

---

#### Decisões Arquiteturais do Modelo Físico

##### 1. Família como Entidade Agrupadeira Central
A entidade **`familia`** é o núcleo organizador e o hub de conectividade do sistema. Diferente de arquiteturas tradicionais, as pessoas e os animais de estimação vinculam-se a uma família, e não diretamente a uma moradia física. Isso viabiliza:
- Controle de ocupação histórica sem duplicação ou redundância de dados.
- Transição simplificada de moradias em cenários de evacuação emergencial.
- Atualizações cadastrais em massa (ex: o núcleo familiar inteiro mudou de endereço).

##### 2. Responsável como Atributos de Pessoa
O "responsável" **deixou de ser uma tabela/entidade separada** (migration `09_merge_responsavel_into_pessoa`, que executa `DROP TABLE responsavel CASCADE`). Seus atributos foram **consolidados como colunas opcionais na própria tabela `pessoa`** (`nis`, `renda`, `sexo`, `raca`, `estado_civil`, `veiculo`, `programas_sociais`, `email`, `telefone`, `nome_da_mae`, `data_residencia_moradia`):
- Uma pessoa é tratada como **responsável** quando tem `parentesco = 'Responsável'` e esses campos preenchidos.
- A regra de **um único responsável ativo por família** continua garantida por trigger no banco (migration `05`), agora avaliando `pessoa.parentesco` via `pessoa_familia` (sem depender de uma tabela `responsavel`).
- Os endpoints `/api/responsaveis` permanecem na API, atendidos pelo módulo `pessoa`.

##### 3. Relacionamento N:N com Histórico Temporal Desmembrado
Para garantir auditoria governamental completa, as relações associativas foram desmembradas em duas frentes com persistência temporal:
- **`pessoa_familia`**: Controla as transições de composição interna do núcleo familiar ao longo do tempo (entradas e saídas).
- **`familia_moradia`**: Preserva o histórico de habitação territorial, armazenando dados críticos como `data_entrada`, `data_saida` e o `status` da ocupação.

##### 4. Mecanismo de Soft Delete Integral via Rules
Em estrita conformidade com a LGPD e com as necessidades de auditoria da Defesa Civil, nenhum registro crucial de pessoa, família ou moradia é fisicamente removido do banco. Implementou-se um mecanismo baseado no campo `deleted_at (TIMESTAMP)` controlado por `RULES` do PostgreSQL. Um comando `DELETE` padrão é interceptado pelo banco, que realiza uma exclusão lógica, atualizando o timestamp de remoção e alterando o estado da entidade para `'Inativo'` ou `'Excluída'`.

##### 5. Pet Vinculado à Família
Os animais domésticos relacionam-se diretamente com a tabela `familia`. Em caso de evacuação de áreas de risco, o sistema garante que os pets não fiquem atrelados a um imóvel destruído, facilitando a logística de abrigo.

---

#### Tipos Enumerados (ENUMs)

```sql
CREATE TYPE escolaridade_enum AS ENUM (
    'Analfabeto', 'Fundamental Incompleto', 'Fundamental Completo', 'Médio Incompleto', 'Médio Completo', 'Superior Incompleto', 'Superior Completo', 'Pós-graduação'
);

CREATE TYPE estado_civil_enum AS ENUM (
    'Solteiro', 'Casado', 'Divorciado', 'Viúvo', 'União Estável'
);

CREATE TYPE parentesco_enum AS ENUM (
    'Responsável', 'Cônjuge', 'Filho(a)', 'Enteado(a)', 'Pai/Mãe', 'Outro'
);

CREATE TYPE raca_enum AS ENUM (
    'Branca', 'Preta', 'Parda', 'Amarela', 'Indígena', 'Não Declarado'
);

CREATE TYPE sexo_enum AS ENUM (
    'Masculino', 'Feminino', 'Outro', 'Não Declarado'
);

CREATE TYPE situacao_ocupacao_moradia_enum AS ENUM (
    'Própria Quitada', 'Própria Financiada', 'Alugada', 'Cedida', 'Invasão', 'Outro'
);

CREATE TYPE situacao_ocupacional_enum AS ENUM (
    'Empregado', 'Desempregado', 'Autônomo', 'Informal', 'Aposentado/Pensionista', 'Estudante', 'Do Lar', 'Outro'
);

CREATE TYPE status_familia_enum AS ENUM (
    'Ativo', 'Inativo'
);

CREATE TYPE status_moradia_enum AS ENUM (
    'Ativa', 'Interditada', 'Demolida', 'Em Risco', 'Excluída'
);

CREATE TYPE status_pessoa_enum AS ENUM (
    'Ativo', 'Obito', 'Inativo'
);

CREATE TYPE tipo_construcao_enum AS ENUM (
    'Alvenaria', 'Madeira', 'Mista', 'Taipa', 'Lona/Improvisada', 'Outro'
);

CREATE TYPE tipo_pet_enum AS ENUM (
    'cachorro', 'gato', 'reptil', 'ave', 'roedor', 'outros'
);

CREATE TYPE tipo_prioridade_enum AS ENUM (
    'Mental', 'Físico'
);

CREATE TYPE uso_imovel_enum AS ENUM (
    'Residencial', 'Comercial', 'Misto', 'Institucional', 'Abandonado'
);

```

## 3.6.4. Consultas SQL e lógica proposicional (sprint 2)

A lógica proposicional é um ramo da Matemática e da Computação utilizado para representar e analisar condições lógicas por meio de proposições. No contexto de bancos de dados relacionais, cada condição presente em uma cláusula `WHERE` pode ser interpretada como uma proposição lógica que assume apenas dois valores possíveis: verdadeiro (V) ou falso (F).

Os operadores utilizados em SQL possuem correspondência direta com os conectivos da lógica proposicional. O operador `AND` corresponde à conjunção lógica ($\land$), exigindo que todas as condições sejam verdadeiras. O operador `OR` corresponde à disjunção lógica ($\lor$), exigindo que pelo menos uma condição seja verdadeira. O operador `NOT` corresponde à negação lógica ($\neg$), invertendo o valor lógico de uma proposição.

Além disso, alguns operadores SQL possuem conectivos implícitos. Por exemplo, uma cláusula `IN ('A', 'B')` equivale logicamente a `(campo = 'A' OR campo = 'B')`, enquanto determinadas expressões compostas podem conter múltiplas conjunções internas. Portanto, para representar corretamente uma consulta SQL em lógica proposicional, cada predicado deve ser isolado em uma proposição simples independente.

As tabelas verdade apresentadas a seguir demonstram como as diferentes combinações de condições influenciam o resultado final das consultas executadas pela aplicação da Defesa Civil de Santo André.

Obs: as tabelas a seguir explicam de forma simples e direta o funcionamento das queries, não aprofundando e refletindo necessariamente o que está no código, mas a ideia por trás de cada consulta.


---

| #1                                 | SELECT                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Expressão SQL**                  | `SELECT m.id_moradia, c.nome_completo FROM moradia m JOIN historico_ocupacao ho ON m.id_moradia = ho.id_moradia JOIN familia f ON ho.id_familia = f.id_familia JOIN cidadao c ON f.id_familia = c.id_familia WHERE (m.status = 'Interditada' OR m.status = 'Área de Risco Evacuada') AND ho.data_saida IS NULL AND f.status_ativo = TRUE AND c.status_cadastro = TRUE;` |
| **Descrição da consulta**          | Localiza cidadãos vinculados a moradias em situação crítica. A consulta retorna apenas registros em que a moradia esteja interditada ou evacuada e, simultaneamente, possua ocupação ativa, família ativa e cadastro ativo.                                                                                                                                             |
| **Proposições lógicas**            | $A$: A moradia está interditada (`m.status = 'Interditada'`) <br> $B$: A moradia está em área de risco evacuada (`m.status = 'Área de Risco Evacuada'`) <br> $C$: A ocupação está ativa (`ho.data_saida IS NULL`) <br> $D$: A família está ativa (`f.status_ativo = TRUE`) <br> $E$: O cidadão possui cadastro ativo (`c.status_cadastro = TRUE`)                       |
| **Expressão lógica proposicional** | $(A \lor B) \land C \land D \land E$                                                                                                                                                                                                                                                                                                                                    |
| **Conectivos utilizados**          | Disjunção ($\lor$) e Conjunção ($\land$)                                                                                                                                                                                                                                                                                                                                |
| **Tabela Verdade (A ∨ B)**         | <table><thead><tr><th>A</th><th>B</th><th>A∨B</th></tr></thead><tbody><tr><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>V</td><td>V</td></tr><tr><td>V</td><td>F</td><td>V</td></tr><tr><td>V</td><td>V</td><td>V</td></tr></tbody></table>                                                                                                                      |

A consulta somente retorna registros quando a moradia estiver em uma das condições críticas previstas e todos os demais critérios de atividade forem satisfeitos simultaneamente.

---

| #2                                 | SELECT                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Expressão SQL**                  | `SELECT nome_completo FROM cidadao WHERE (nome_completo LIKE 'MARIA%' OR nome_completo LIKE 'JOÃO%') AND status = 'ATIVO';`                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Descrição da consulta**          | Recupera cidadãos cujo nome inicia com "MARIA" ou "JOÃO" e que possuem telefone cadastrado, permitindo localizar rapidamente grupos específicos de pessoas para contato direto em situações de emergência.                                                                                                                                                                                                                                                                                                                                                                                               |
| **Proposições lógicas**            | $A$: O nome inicia com "MARIA" (`nome_completo LIKE 'MARIA%'`) <br> $B$: O nome inicia com "JOÃO" (`nome_completo LIKE 'JOÃO%'`) <br> $C$: O status é 'ATIVO' (`status = 'ATIVO'`)                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Expressão lógica proposicional** | $(A \lor B) \land C$                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Conectivos utilizados**          | Disjunção ($\lor$), Conjunção ($\land$)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Tabela Verdade**                 | <table><thead><tr><th>A</th><th>B</th><th>C</th><th>A∨B</th><th>¬C</th><th>(A∨B)∧¬C</th></tr></thead><tbody><tr><td>F</td><td>F</td><td>F</td><td>F</td><td>V</td><td>F</td></tr><tr><td>F</td><td>F</td><td>V</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>V</td><td>F</td><td>V</td><td>V</td><td>V</td></tr><tr><td>F</td><td>V</td><td>V</td><td>V</td><td>F</td><td>F</td></tr><tr><td>V</td><td>F</td><td>F</td><td>V</td><td>V</td><td>V</td></tr><tr><td>V</td><td>F</td><td>V</td><td>V</td><td>F</td><td>F</td></tr><tr><td>V</td><td>V</td><td>F</td><td>V</td><td>V</td><td>V</td></tr><tr><td>V</td><td>V</td><td>V</td><td>V</td><td>F</td><td>F</td></tr></tbody></table> |

A consulta retorna resultados apenas quando pelo menos uma das condições de busca textual for satisfeita e o cidadão possuir telefone cadastrado, garantindo que os contatos retornados sejam efetivamente acessíveis para comunicação.

---

| #3                                 | UPDATE                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Expressão SQL**                  | `UPDATE moradia SET status = 'Ativa', ultima_atualizacao = CURRENT_DATE WHERE id_moradia = :id_moradia AND status IN ('Interditada', 'Área de Risco Evacuada');`                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Descrição da consulta**          | Reativa uma moradia específica quando ela estiver em um dos estados operacionais que permitem retorno ao funcionamento normal.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Expansão lógica do operador IN** | `status IN ('Interditada', 'Área de Risco Evacuada')` ≡ `(status = 'Interditada' OR status = 'Área de Risco Evacuada')`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Proposições lógicas**            | $A$: O identificador informado corresponde à moradia (`id_moradia = :id_moradia`) <br> $B$: A moradia está interditada (`status = 'Interditada'`) <br> $C$: A moradia está em área de risco evacuada (`status = 'Área de Risco Evacuada'`)                                                                                                                                                                                                                                                                                                                                                               |
| **Expressão lógica proposicional** | $A \land (B \lor C)$                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Conectivos utilizados**          | Conjunção ($\land$) e Disjunção ($\lor$)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Tabela Verdade**                 | <table><thead><tr><th>A</th><th>B</th><th>C</th><th>B∨C</th><th>A∧(B∨C)</th></tr></thead><tbody><tr><td>F</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>F</td><td>V</td><td>V</td><td>F</td></tr><tr><td>F</td><td>V</td><td>F</td><td>V</td><td>F</td></tr><tr><td>F</td><td>V</td><td>V</td><td>V</td><td>F</td></tr><tr><td>V</td><td>F</td><td>F</td><td>F</td><td>F</td></tr><tr><td>V</td><td>F</td><td>V</td><td>V</td><td>V</td></tr><tr><td>V</td><td>V</td><td>F</td><td>V</td><td>V</td></tr><tr><td>V</td><td>V</td><td>V</td><td>V</td><td>V</td></tr></tbody></table> |

A atualização somente ocorre quando o identificador informado corresponde ao registro desejado e a moradia se encontra em pelo menos um dos estados previstos pela regra de negócio.

---

| #4                                 | UPDATE                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Expressão SQL**                  | `UPDATE cidadao SET status_cadastro = FALSE WHERE NOT (telefone IS NULL);`                                                            |
| **Descrição da consulta**          | Atualiza registros de cidadãos que possuem telefone cadastrado, demonstrando a utilização explícita do operador de negação lógica.    |
| **Proposições lógicas**            | $A$: O telefone é nulo (`telefone IS NULL`)                                                                                           |
| **Expressão lógica proposicional** | $\neg A$                                                                                                                              |
| **Conectivos utilizados**          | Negação ($\neg$)                                                                                                                      |
| **Tabela Verdade**                 | <table><thead><tr><th>A</th><th>¬A</th></tr></thead><tbody><tr><td>V</td><td>F</td></tr><tr><td>F</td><td>V</td></tr></tbody></table> |

A atualização somente é executada quando a proposição "telefone é nulo" for falsa, isto é, quando existir um telefone cadastrado para o cidadão.

---

### Considerações finais

As consultas apresentadas exploram diferentes operadores e estruturas lógicas disponíveis em SQL, incluindo `AND`, `OR`, `NOT`, `LIKE` e `IN`. Em todos os casos, cada predicado foi representado por uma proposição simples independente, permitindo a construção correta das expressões proposicionais e a elaboração de tabelas verdade compatíveis com o comportamento real do SGBD.

Essa abordagem evidencia a relação entre lógica matemática e bancos de dados, demonstrando como a lógica proposicional pode ser utilizada para compreender, validar e documentar regras de negócio implementadas em consultas SQL.


## 3.7. WebAPI e endpoints (sprints 3 e 4)

A WebAPI do GeoRisco foi implementada em Express e expõe endpoints HTTP sob o prefixo `/api`, com contratos JSON para cadastro, consulta, atualização, remoção lógica, vínculos familiares, registro de pets e gerenciamento de metadados de fotos. A documentação de referência dos contratos está consolidada em [`documentos/endpoints.md`](endpoints.md), enquanto a versão navegável da documentação está em [`documentos/webapi-docs.html`](webapi-docs.html).

O levantamento atual foi conferido contra os arquivos de rotas e controllers do backend (`pessoa.routes.ts`, `moradia.routes.ts`, `familia.routes.ts`, `pet.routes.ts`, `foto.routes.ts` e `prioridade.routes.ts`). No estado atual do projeto, existem **56 endpoints implementados no prefixo `/api`**, distribuídos entre Pessoas, Responsáveis, Moradias, Famílias, Pets, Fotos e Prioridades. A contagem inclui os 3 endpoints do módulo `prioridade` (`GET /api/prioridades`, `GET /api/pessoas/:id/prioridades`, `PUT /api/pessoas/:id/prioridades`), documentados ao final desta seção.

### Padrões gerais da WebAPI

| Item | Padrão adotado |
|------|----------------|
| Base URL local | `http://localhost:3000/api` |
| Formato principal | JSON |
| Header esperado em requisições com corpo | `Content-Type: application/json` |
| Formato de erro atual | `{ "error": "Mensagem do erro" }` |
| Autenticação/autorização | Não há middleware de autenticação ou autorização nas rotas listadas nesta versão |
| Remoção de pessoas, moradias e famílias | Preferencialmente por soft delete, preservando histórico |
| Upload de fotos | Mediado por URL assinada do storage, mantendo no banco apenas vínculo e metadados |

### Status HTTP implementados

| Status | Uso na API atual |
|--------|------------------|
| `200 OK` | Consulta, atualização ou operação com retorno JSON ou HTML bem-sucedida |
| `201 Created` | Criação de recurso ou geração de URL assinada de upload |
| `204 No Content` | Remoção concluída sem corpo de resposta |
| `400 Bad Request` | ID inválido, payload inválido, campo obrigatório ausente ou validação de entrada falhou |
| `404 Not Found` | Recurso não encontrado |
| `409 Conflict` | Conflito de regra de negócio, como violação de vínculo ou integridade |
| `500 Internal Server Error` | Erro interno ou dependência obrigatória não configurada |
| `502 Bad Gateway` | Falha específica ao gerar URL assinada no serviço de storage |

> Observação: `401 Unauthorized` e `403 Forbidden` não fazem parte do contrato implementado nos controllers atuais, pois a autenticação e o controle de acesso ainda não estão presentes no backend desta entrega.

### Endpoints implementados por domínio

#### Pessoas e Responsáveis

| Método | Endpoint | Descrição | Resposta de sucesso | RF relacionado |
|--------|----------|-----------|---------------------|----------------|
| GET | `/api/pessoas` | Lista todas as pessoas cadastradas | `200` | RF001, RF016 |
| GET | `/api/pessoas/busca` | Busca pessoas por filtros como `nome`, `cpf`, `email`, `telefone` e `escopo` | `200` | RF016 |
| GET | `/api/pessoas/inativas` | Lista pessoas inativas | `200` | RF010 |
| GET | `/api/pessoas/{id}` | Retorna pessoa por ID | `200` | RF001 |
| POST | `/api/pessoas` | Cadastra nova pessoa | `201` | RF001 |
| PUT | `/api/pessoas/{id}` | Atualiza parcialmente uma pessoa | `200` | RF012, RF019 |
| DELETE | `/api/pessoas/{id}` | Remove pessoa por soft delete | `204` | RF010 |
| GET | `/api/responsaveis` | Lista todos os responsáveis | `200` | RF001, RF014 |
| GET | `/api/responsaveis/{id}` | Retorna responsável pelo ID da pessoa | `200` | RF001, RF014 |
| POST | `/api/responsaveis` | Cadastra pessoa responsável e seus dados adicionais | `201` | RF001, RF014 |
| PUT | `/api/responsaveis/{id}` | Atualiza parcialmente um responsável | `200` | RF012, RF014, RF019 |
| DELETE | `/api/responsaveis/{id}` | Remove responsável | `204` | RF010 |

Os endpoints de pessoa aceitam os campos `nome`, `nomeSocial`, `dataDeNascimento`, `parentesco`, `situacaoOcupacional`, `escolaridade`, `cronico`, `medicacao` e `status`, com aliases em `snake_case` para `nomeSocial`, `dataDeNascimento` e `situacaoOcupacional`. Responsáveis são tratados como pessoas com dados complementares: além dos campos de pessoa, aceitam `cpf`, `nis`, `renda`, `sexo`, `raca`, `estadoCivil`, `veiculo`, `programasSociais` (inteiro), `email`, `telefone`, `nomeDaMae` e `dataResidenciaMoradia`. Na criação, o backend força `parentesco` para `Responsável`.

> **Pendência — Grupos Prioritários (RF001):** O banco já possui as tabelas `grupo_prioritario` e `pessoa_grupo_prioritario`, e o model TypeScript correspondente existe em `models/grupo-prioritario.model.ts`. Porém, nenhum endpoint, service ou repository manipula esses dados atualmente — campos como `grupos` ou `idGrupoPrioritario` enviados no corpo serão silenciosamente ignorados. O suporte completo a grupos de vulnerabilidade (idoso, criança, gestante/lactante, PCD, mobilidade reduzida) está pendente de implementação.

#### Moradias

| Método | Endpoint | Descrição | Resposta de sucesso | RF relacionado |
|--------|----------|-----------|---------------------|----------------|
| GET | `/api/moradias` | Lista moradias | `200` | RF004, RF006 |
| GET | `/api/moradias/{id}` | Retorna moradia por ID | `200` | RF005 |
| GET | `/api/moradias/{id}/detalhes` | Retorna detalhes da moradia, incluindo famílias, pessoas, pets e fotos associados | `200` | RF005 |
| GET | `/api/moradias/{id}/familias/historico` | Lista o histórico de famílias vinculadas à moradia | `200` | RF014 |
| POST | `/api/moradias` | Cria moradia com localização | `201` | RF002, RF003 |
| PUT | `/api/moradias/{id}` | Atualiza parcialmente moradia e/ou localização | `200` | RF012, RF015, RF019 |
| DELETE | `/api/moradias/{id}` | Remove moradia por soft delete | `204` | RF009 |

A criação de moradia espera um corpo com os grupos `localizacao` e `moradia`. Em `localizacao`, os campos mínimos são `cidade`, `estado`, `latitude` e `longitude`. Em `moradia`, os campos mínimos são `tipoConstrucao`, `usoImovel` e `situacaoDeOcupacao`, com aliases em `snake_case` disponíveis para integração com clientes que adotem esse padrão.

O campo `status` do objeto `moradia` aceita os valores `Ativa`, `Interditada`, `Em Risco` e `Demolida`. O valor `Excluída` é reservado ao sistema: o banco o aplica automaticamente via `DELETE /api/moradias/{id}` e o backend rejeita com `400` qualquer requisição POST ou PUT que o envie explicitamente.

#### Famílias

| Método | Endpoint | Descrição | Resposta de sucesso | RF relacionado |
|--------|----------|-----------|---------------------|----------------|
| GET | `/api/familias` | Lista famílias | `200` | RF014 |
| GET | `/api/familias/{id}` | Retorna família por ID | `200` | RF014 |
| POST | `/api/familias` | Cria uma família vazia | `201` | RF001, RF014, RF017 |
| DELETE | `/api/familias/{id}` | Remove família por soft delete | `204` | RF014 |
| POST | `/api/familias/nucleo` | Cadastra núcleo familiar completo, incluindo localização, moradia, responsável, dependentes, pets e fotos | `201` | RF013 |
| GET | `/api/familias/{id}/pessoas` | Lista pessoas vinculadas à família | `200` | RF014 |
| GET | `/api/familias/{id}/pessoas/historico` | Lista histórico de pessoas vinculadas à família | `200` | RF014 |
| POST | `/api/familias/{id}/pessoas` | Vincula pessoa à família | `201` | RF014 |
| DELETE | `/api/familias/{id}/pessoas/{pessoaId}` | Remove vínculo ativo entre pessoa e família | `200` | RF014 |
| GET | `/api/familias/{id}/moradias` | Lista moradias vinculadas à família | `200` | RF014 |
| GET | `/api/familias/{id}/moradias/historico` | Lista histórico de moradias vinculadas à família | `200` | RF014 |
| POST | `/api/familias/{id}/moradias` | Vincula moradia à família | `201` | RF014, RF017 |
| DELETE | `/api/familias/{id}/moradias/{moradiaId}` | Remove vínculo ativo entre moradia e família | `200` | RF014 |

Família é uma entidade de agrupamento puro: seu único atributo próprio é o `id` gerado automaticamente. Qualquer campo enviado no corpo de `POST /api/familias` é descartado sem erro. Para cadastrar um núcleo familiar completo em uma única operação transacional, utiliza-se `POST /api/familias/nucleo`.

Os endpoints de vínculo preservam o histórico de composição familiar e ocupação da moradia por meio de datas de entrada e saída. Os endpoints `DELETE /api/familias/{id}/pessoas/{pessoaId}` e `DELETE /api/familias/{id}/moradias/{moradiaId}` são exceção entre os deletes: ambos retornam `200` com corpo JSON contendo o vínculo atualizado, em vez de `204 No Content`.

#### Pets

| Método | Endpoint | Descrição | Resposta de sucesso | RF relacionado |
|--------|----------|-----------|---------------------|----------------|
| GET | `/api/pets` | Lista todos os pets | `200` | RF007 |
| GET | `/api/pets/{id}` | Retorna pet por ID | `200` | RF007 |
| POST | `/api/pets` | Cria pet informando `idFamilia` no corpo | `201` | RF007 |
| PUT | `/api/pets/{id}` | Atualiza parcialmente um pet | `200` | RF007, RF019 |
| DELETE | `/api/pets/{id}` | Remove pet | `204` | RF007 |
| GET | `/api/familias/{id}/pets` | Lista pets de uma família | `200` | RF007, RF014 |
| POST | `/api/familias/{id}/pets` | Cria pet vinculado à família informada na URL | `201` | RF007, RF014 |

Os pets aceitam campos como `tipo`, `nome`, `porte`, `raca`, `cor`, `status` e `observacao`. Os tipos previstos no modelo são `cachorro`, `gato`, `reptil`, `ave`, `roedor` e `outros`; os status aceitos são `Ativo`, `Inativo`, `Desaparecido` e `Falecido`. O campo `porte` é texto livre sem enum validado — os valores convencionais são `Pequeno`, `Médio`, `Grande` e `Gigante`.

O campo `fotos` dentro do objeto de pet é processado somente em `POST /api/familias/nucleo`, onde o service itera o array e persiste cada foto vinculada ao pet criado. Em `POST /api/pets` e `POST /api/familias/{id}/pets`, o campo `fotos` é ignorado silenciosamente — o fluxo correto para associar fotos a um pet já existente é `POST /api/pets/{id}/fotos`.

#### Fotos

| Método | Endpoint | Descrição | Resposta de sucesso | RF relacionado |
|--------|----------|-----------|---------------------|----------------|
| GET | `/api/fotos` | Lista todas as fotos | `200` | RF018 |
| GET | `/api/fotos/{id}` | Retorna foto por ID | `200` | RF018 |
| GET | `/api/fotos/{id}/signed-url` | Gera URL assinada para acesso à foto | `200` | RF018 |
| PUT | `/api/fotos/{id}` | Atualiza a URL da foto | `200` | RF018 |
| DELETE | `/api/fotos/{id}` | Remove foto | `204` | RF018 |
| GET | `/api/moradias/{id}/fotos` | Lista fotos de uma moradia | `200` | RF002, RF018 |
| POST | `/api/moradias/{id}/fotos/upload-url` | Gera URL assinada de upload para foto de moradia | `201` | RF018 |
| POST | `/api/moradias/{id}/fotos` | Cria registro de foto vinculado à moradia | `201` | RF002, RF018 |
| DELETE | `/api/moradias/{id}/fotos/{fotoId}` | Remove foto vinculada à moradia | `204` | RF018 |
| GET | `/api/pets/{id}/fotos` | Lista fotos de um pet | `200` | RF007, RF018 |
| POST | `/api/pets/{id}/fotos/upload-url` | Gera URL assinada de upload para foto de pet | `201` | RF018 |
| POST | `/api/pets/{id}/fotos` | Cria registro de foto vinculado ao pet | `201` | RF007, RF018 |
| DELETE | `/api/pets/{id}/fotos/{fotoId}` | Remove foto vinculada ao pet | `204` | RF018 |

A API separa o arquivo físico da foto de seu metadado. Primeiro, o cliente solicita uma URL assinada de upload com `fileName`, `contentType` e, opcionalmente, `upsert`. Depois do envio ao storage, registra no backend apenas a `url` ou caminho do arquivo, associando o metadado à moradia ou ao pet correspondente. O endpoint `GET /api/fotos/{id}/signed-url` aceita o query param opcional `expiresIn` (entre 60 e 3600 segundos; padrão: 300) para controlar o tempo de validade da URL assinada de leitura.

> **Restrição LGPD (RN07):** O sistema aceita fotos **apenas de moradias e pets**. O registro fotográfico de pessoas é estritamente proibido. Os endpoints de upload existem somente sob `/api/moradias/{id}/fotos/upload-url` e `/api/pets/{id}/fotos/upload-url`.

> **Pendência — limite de fotos por moradia (RF002/RN07):** O WAD estabelece no máximo 2 fotos por moradia. O backend atual **não valida esse limite** — é possível cadastrar mais de 2 fotos via API sem erro. Essa restrição está pendente de implementação.

#### Prioridades (Grupos Prioritarios)

| Método | Endpoint | Descrição | Resposta de sucesso | RF relacionado |
|--------|----------|-----------|---------------------|----------------|
| GET | `/api/prioridades` | Lista todos os grupos prioritários cadastrados | `200` | RF001 |
| GET | `/api/pessoas/{id}/prioridades` | Lista grupos prioritários vinculados a uma pessoa | `200` | RF001 |
| PUT | `/api/pessoas/{id}/prioridades` | Atualiza os grupos prioritários de uma pessoa (substitui lista completa) | `200` | RF001 |

O endpoint `PUT /api/pessoas/{id}/prioridades` espera o campo `prioridadeIds` como array de IDs no corpo da requisição. O controller acessa o repository diretamente, sem camada de service.

### Rota raiz

| Método | Endpoint | Finalidade |
|--------|----------|------------|
| GET | `/` | Retorna JSON `{ "status": "ok", "service": "GeoRisco API" }` (health check) |

> **Nota:** não existem rotas HTML, EJS ou rotas fora do prefixo `/api` na versão atual. O servidor não possui engine de views configurada. Todas as operações ocorrem via API REST sob `/api`.

### Endpoints planejados e fora do contrato atual

Alguns endpoints apareceram em versões anteriores da documentação, mas ainda não existem nas rotas atuais do backend. Eles devem ser tratados como planejados, e não como contrato implementado.

| Método | Endpoint | RF associado | Status do RF |
|--------|----------|--------------|--------------|
| `POST` | `/api/cadastros-completos` | — | — |
| `GET` | `/api/moradias/mapa` | RF004 — Visualização de Moradias em Mapa Georreferenciado | Planejado |
| `GET` | `/api/moradias/{id_moradia}/consulta-integrada` | — | — |
| `GET` | `/api/moradias/exportar` | — | — |
| `GET` | `/api/familias/{id_familia}/cadastro-completo` | — | — |
| `PUT` | `/api/familias/{id_familia}/cadastro-completo` | — | — |
| `PUT` | `/api/familias/{id_familia}/responsavel` | — | — |
| `GET` | `/api/indicadores/mapa-calor` | RF008 — Visualização de Mapa de Calor | Futuro |
| `GET` | `/api/indicadores/recadastro` | RF011 — Alerta Automático de Recadastro (12 meses) | Planejado |
| `PATCH` | `/api/moradias/{id_moradia}/status` | RF015 | — |
| `POST` | `/api/familias/{id_familia}/realocacoes` | — | — |
| `PATCH` | `/api/cidadaos/{id_cidadao}/arquivar` | — | — |

> **Nota — RF015 e RF017:**
> - **RF015 (Marcação Manual da Situação da Moradia):** não requer endpoint próprio; é coberto pelo `PUT /api/moradias/{id}` via o campo `status` do objeto `moradia`. O endpoint `PATCH /api/moradias/{id_moradia}/status` listado acima era uma alternativa anterior que nunca chegou a ser implementada — o `PUT` atual é a forma correta de atualizar a situação.
> - **RF017 (Indicador de Cadastro Incompleto):** não possui endpoint próprio pois o indicador é derivado automaticamente da ausência de vínculo família-moradia; é exposto indiretamente por `GET /api/familias/{id}/moradias` (lista vazia = sem moradia) e `GET /api/moradias/{id}/detalhes`. Seu status no WAD é "Planejado", o que é consistente com a ausência de endpoint dedicado.

## 3.8. Autenticação, Autorização e Resiliência (sprint 5)

> **Escopo desta entrega:** o sistema não implementará autenticação nem controle de acesso por perfil (RBAC). O ambiente opera exclusivamente com dados fictícios. Esta seção será preenchida em sprint futura, caso a autenticação seja incluída no escopo.

### 3.8.1. Autenticação

*Descreva o fluxo de autenticação implementado: persistência de senha com hash bcrypt/argon2 (parâmetros de custo explícitos e justificados), validação de credenciais e criação de sessão. Senhas em texto plano no banco não são aceitas.*

### 3.8.2. Controle de sessão

*Descreva o controle de sessão baseado em `session id` persistido em tabela própria, com expiração. Se optar por JWT, justifique a escolha explicando os trade-offs (stateless, não revogável, payload exposto).*

### 3.8.3. Autorização

*Descreva as regras de autorização por rota e por operação, baseadas no perfil do usuário autenticado. A verificação deve ocorrer no backend — o frontend nunca é fonte de verdade para autorização.*

### 3.8.4. Estratégias de Resiliência

*Descreva as estratégias aplicadas no tratamento de falhas de rede: timeout, retry com backoff exponencial, circuit breaker e idempotência em operações críticas (`PUT`, `DELETE`, operações de pagamento etc.).*

## 3.9. Matriz de Rastreabilidade (RTM) (sprints 3 a 5)

A Matriz de Rastreabilidade (RTM - Requirements Traceability Matrix) consolida, em uma única visão, os elos entre cada Persona, Requisito Funcional (RF), Regra de Negócio (RN), endpoint de API, tela da interface e caso de teste correspondente. O objetivo é garantir que nenhum requisito fique sem implementação, sem teste e sem evidência de validação, em que qualquer lacuna nessa cadeia representa um risco direto à integridade e à confiabilidade do sistema.

| # | Persona | US | RF | RN | Endpoint | Método | Tela | Casos de Teste | Evidência | Status |
|---|---------|----|----|-----|----------|--------|------|----------------|-----------|--------|
| 1 | João Silva — A01 (Agente de Campo) | US01 | RF001 — Cadastro Sociodemográfico e Vínculos | RN01, RN02, RN03, RN04 | `/api/pessoas`<br>`/api/responsaveis`<br>`/api/familias`<br>`/api/familias/:id/pessoas` | `POST` | Cadastro → Responsável, Moradores, Família | CT01: Pessoa criada com sucesso em `/api/pessoas` (`201`)<br>CT02: Responsável criado com dados obrigatórios em `/api/responsaveis` (`201`)<br>CT03: Família criada em `/api/familias` (`201`)<br>CT04: Núcleo familiar cadastrado em `/api/familias/nucleo` com pessoas vinculadas (`201`)<br>CT05: Pessoa já vinculada à família retorna conflito (`409`)<br>CT06: Campos obrigatórios ausentes retornam `400` | Print da tela de cadastro — seção 4.2.1; log da resposta `201` do `POST /api/familias/nucleo`; relatório de cobertura de cadastro — seção 5.1.4.2 | ✅ Implementado |
| 2 | João Silva — A01 (Agente de Campo) | US02, US06 | RF002 — Cadastro Estrutural de Moradias<br>RF003 — Georreferenciamento via GPS | RN05, RN07, RN08 | `/api/moradias`<br>`/api/familias/:id/moradias`<br>`/api/moradias/:id/fotos/upload-url`<br>`/api/moradias/:id/fotos` | `POST` | Cadastro → Moradias | CT07: Moradia criada em `/api/moradias` com dados estruturais e localização (`201`)<br>CT08: Moradia vinculada à família em `/api/familias/:id/moradias` (`201`)<br>CT09: URL de upload de foto de moradia gerada com sucesso (`201`)<br>CT10: Registro de foto da moradia criado após upload (`201`)<br>CT11: Foto de pessoa bloqueada conforme RN07 (`400`) | Print do formulário de moradia — seção 4.2.1; log de vínculo família-moradia; CT10 — evidência da URL de upload e da foto cadastrada | ✅ Implementado |
| 3 | Wesley Souza — A02 (Gestor Operacional) | US03 | RF004 — Visualização em Mapa Georreferenciado | RN08, RN11 | `/api/moradias` | `GET` | Mapa | CT13: `/api/moradias` retorna moradias para alimentar a visão operacional do mapa (`200`)<br>CT14: Moradias com coordenadas válidas são renderizadas como marcadores na interface<br>CT15: Moradias arquivadas ou inativas não aparecem na visão operacional do mapa<br>CT16: Lista vazia retorna `200` sem erro | Print do mapa com marcadores — seção 4.2.1; payload da API com coordenadas (`lat`, `lng`); evidência de ausência de moradias inativas na resposta | ⚠️ Parcial — endpoint ativo; renderização no mapa depende do frontend |
| 4 | Wesley Souza — A02 (Gestor Operacional) | US04 | RF005 — Consulta Integrada de Moradia e Moradores | RN08, RN10, RN11 | `/api/moradias/:id`<br>`/api/moradias/:id/detalhes`<br>`/api/moradias/:id/familias/historico` | `GET` | Consulta → Resultado da Busca | CT17: Moradia retornada por ID com dados estruturais (`200`)<br>CT18: Detalhes da moradia retornam localização, famílias, pessoas, pets e fotos (`200`)<br>CT19: Histórico de famílias da moradia retorna ocupações com `data_entrada` e `data_saida` (`200`)<br>CT20: Consulta integrada exibe moradia, responsável, moradores e pets a partir dos endpoints implementados<br>CT21: Flag de cadastro incompleto aparece quando a família não possui moradia vinculada<br>CT22: Moradia inexistente retorna `404` | Print da ficha detalhada — seção 4.2.1; log da resposta de `GET /api/moradias/:id/detalhes` com código `200`; evidência da flag de cadastro incompleto quando aplicável | ✅ Implementado |
| 5 | Wesley Souza — A02 (Gestor Operacional) | US04 | RF006 — Filtros Avançados de Moradias | RN11 | `/api/moradias`<br>`/api/pessoas` | `GET` | Consulta / Mapa | CT23: Filtros disponíveis em `/api/moradias` retornam apenas moradias correspondentes (`200`)<br>CT24: Listagem de pessoas retorna registros para consulta gerencial (`200`)<br>CT25: Listagem de moradias retorna registros ativos para consulta gerencial (`200`)<br>CT26: Busca sem resultados retorna array vazio sem erro<br>CT27: Nenhum dado fora do filtro selecionado aparece na resposta | Print dos resultados filtrados — seção 4.2.1; payload dos endpoints de listagem confirmando ausência de registros fora do filtro | ⚠️ Parcial — filtros básicos ativos; filtros avançados por vulnerabilidade planejados |
| 6 | Wesley Souza — A02 (Gestor Operacional) | US04 | RF016 — Busca de Pessoas / Responsáveis | RN11 | `/api/pessoas/busca`<br>`/api/pessoas`<br>`/api/responsaveis` | `GET` | Consulta | CT28: Busca por nome em `/api/pessoas/busca?nome=Maria&escopo=ativas` retorna pessoas compatíveis (`200`)<br>CT29: Busca por CPF, e-mail ou telefone retorna pessoas compatíveis (`200`)<br>CT30: Requisição sem filtro obrigatório retorna `400`<br>CT31: Busca sem resultados retorna array vazio sem erro | Print dos resultados filtrados — seção 4.2.1; payload do endpoint de busca confirmando correspondência; log da resposta `200` | ✅ Implementado |
| 7 | João Silva — A01 (Agente de Campo) | US07 | RF007 — Cadastro de Animais de Estimação | RN12 | `/api/pets`<br>`/api/familias/:id/pets` | `POST` | Cadastro → Pets | CT32: Pet criado em `/api/pets` com `tipo` obrigatório (`201`)<br>CT33: Pet criado diretamente na família em `/api/familias/:id/pets` (`201`)<br>CT34: `tipo` ausente retorna `400`<br>CT35: Família inexistente retorna `404` | Print do cadastro de pet — seção 4.2.1; log de inserção no banco com `id` retornado; payload da resposta `201` | ✅ Implementado |
| 8 | João Silva (A01) e Wesley Souza (A02) | US07 | RF007 — Consulta e Atualização de Pets | RN12 | `/api/pets`<br>`/api/pets/:id`<br>`/api/familias/:id/pets` | `GET` / `PUT` | Consulta / Ficha de Emergência / Cadastro → Pets | CT36: Lista geral de pets retorna registros cadastrados (`200`)<br>CT37: Pet por ID retorna dados completos (`200`)<br>CT38: Pets da família aparecem na ficha de emergência (`200`)<br>CT39: Atualização de pet em `/api/pets/:id` retorna sucesso (`200`)<br>CT40: Pet inexistente retorna `404` | Print da ficha de emergência — seção 4.2.1; log de consulta e atualização; evidência do campo atualizado no payload | ✅ Implementado |
| 9 | João Silva (A01) e Wesley Souza (A02) | US07 | RF007 — Fotos de Pets<br>RF018 — Armazenamento Seguro de Fotos | RN12 | `/api/pets/:id/fotos`<br>`/api/pets/:id/fotos/upload-url`<br>`/api/pets/:id/fotos/:fotoId` | `GET` / `POST` / `DELETE` | Cadastro → Pets / Ficha de Emergência | CT41: Fotos do pet são listadas com sucesso (`200`)<br>CT42: URL de upload para foto do pet é gerada (`201`)<br>CT43: Registro de foto do pet é criado (`201`)<br>CT44: Remoção de foto do pet retorna sucesso (`204`)<br>CT45: Pet ou foto inexistente retorna `404` | Print da seção de fotos do pet — seção 4.2.1; CT42 — URL assinada gerada; `foto-storage.service.ts` com 93,93% cobertura — seção 5.1.4.2 | ✅ Implementado |
| 10 | Wesley Souza — A02 (Gestor Operacional) | — | RF008 — Mapa de Calor | RN04, RN11 | — (planejado — não executável na entrega atual) | — | Mapa | CT46: Planejado — não executável na entrega atual; endpoint de mapa de calor ainda não implementado<br>CT47: Filtro por grupo prioritário deve retornar intensidade coerente quando implementado<br>CT48: Agrupamentos de coordenadas próximas devem gerar maior intensidade visual quando implementado<br>CT49: Array vazio deve retornar `200` sem erro quando houver endpoint implementado | N/A — funcionalidade planejada; ver seção 4.2.2 para detalhamento | 🚧 Planejado — sem endpoint nesta entrega |
| 11 | Wesley Souza — A02 (Gestor Operacional) | US08 | RF009 — Arquivamento de Moradias | RN06 | `/api/moradias/:id` | `DELETE` | Consulta / Mapa | CT50: Remoção lógica de moradia implementada retorna sucesso (`204`)<br>CT51: Moradia arquivada deixa de aparecer na busca e no mapa operacional<br>CT52: Moradia inexistente retorna `404`<br>CT53: ID inválido retorna `400`<br>CT54: Histórico da moradia permanece preservado após o arquivamento | Log da resposta `204` do `DELETE /api/moradias/:id`; confirmação via `GET /api/moradias` de ausência da moradia arquivada — seção 4.2.1 | ⚠️ Parcial — soft delete ativo; desarquivamento e filtro de inativas planejados |
| 12 | Wesley Souza — A02 (Gestor Operacional) | US01 | RF014 — Gestão de Família e Vínculos | RN01, RN03, RN06 | `/api/familias/:id/moradias`<br>`/api/familias/:id/moradias/historico`<br>`/api/familias/:id/moradias/:moradiaId` | `GET` / `POST` / `DELETE` | Consulta | CT55: Moradias da família são listadas com sucesso (`200`)<br>CT56: Histórico de moradias da família exibe vínculos ativos e encerrados (`200`)<br>CT57: Nova moradia é vinculada à família com `data_entrada` (`201`)<br>CT58: Desvinculação de moradia retorna sucesso (`200`)<br>CT59: Vínculo encerrado preserva histórico de ocupação<br>CT60: Conflito de ocupação retorna `409` | Log do `historico_ocupacao` — seção 4.2.1; print de confirmação da realocação; payload de conflito `409` | ✅ Implementado |
| 13 | Wesley Souza — A02 (Gestor Operacional) | US09 | RF010 — Arquivamento de Moradores | RN06 | `/api/pessoas/:id`<br>`/api/pessoas/inativas`<br>`/api/responsaveis/:id`<br>`/api/familias/:id` | `DELETE` / `GET` | Consulta | CT61: Pessoa removida ou inativada retorna sucesso (`204`)<br>CT62: Pessoas inativas são listadas em `/api/pessoas/inativas` (`200`)<br>CT63: Responsável removido exige validação de integridade familiar conforme regra vigente<br>CT64: Família removida por gestor retorna sucesso quando permitido (`204`)<br>CT65: Arquivamento de cidadão preserva histórico sem exclusão física<br>CT66: Recurso inexistente retorna `404` | Print da listagem de pessoas inativas — seção 4.2.1; log do `DELETE /api/pessoas/:id` retornando `204`; evidência de histórico preservado via `GET /api/pessoas/inativas` | ⚠️ Parcial — soft delete ativo; substituição de responsável a validar |
| 14 | Wesley Souza — A02 (Gestor Operacional) | US10 | RF011 — Alerta Automático de Recadastro (12 meses) | RN09, RN10 | — (planejado — não executável na entrega atual) | — | Mapa / Painel | CT67: Planejado — não executável na entrega atual; endpoint de recadastro ainda não implementado<br>CT68: Ficha com mais de 365 dias sem atualização deve entrar no contador de desatualizados quando o mecanismo existir<br>CT69: Após atualização da ficha, contador de desatualizados deve ser reduzido na próxima consulta<br>CT70: Requisição inválida deve seguir o padrão de erro do backend atual (`400` ou `500`, conforme causa) | N/A — funcionalidade planejada; ver seção 4.2.2 para detalhamento | 🚧 Planejado — sem endpoint nesta entrega |
| 15 | João Silva — A01 (Agente de Campo) | US10 | RF012 — Atualização Anual de Dados | RN09, RN10 | `/api/pessoas/:id`<br>`/api/responsaveis/:id`<br>`/api/moradias/:id`<br>`/api/fotos/:id` | `PUT` | Cadastro (edição) | CT71: Pessoa atualizada com sucesso (`200`)<br>CT72: Responsável atualizado com sucesso (`200`)<br>CT73: Moradia atualizada com sucesso (`200`)<br>CT74: Foto da moradia atualizada sem violar RN07 (`200`)<br>CT75: Dados existentes são reabertos para revisão anual<br>CT76: Atualização do cadastro limpa alerta de recadastro quando a condição deixar de existir | Log das respostas `200` nos PUTs de pessoa, responsável e moradia — seção 4.2.1; evidência de alteração dos campos antes/depois | ⚠️ Parcial — PUTs ativos; limpeza de alerta depende do RF011 |
| 16 | João Silva (A01) e Wesley Souza (A02) | US05 | RF019 — Edição de Cadastro | RN05, RN10 | `/api/pessoas/:id`<br>`/api/responsaveis/:id`<br>`/api/moradias/:id` | `PUT` | Cadastro (edição) | CT77: Tela de edição abre cadastro já preenchido a partir da busca ou do mapa<br>CT78: Pessoa, responsável ou moradia são atualizados com sucesso (`200`)<br>CT79: Reposicionamento da localização da moradia é salvo conforme RN05<br>CT80: Indicador de cadastro incompleto é removido quando a condição deixa de existir | Print antes/depois da edição — seção 4.2.1; log de atualização (`200`) com campo alterado; evidência da limpeza do indicador quando aplicável | ✅ Implementado |
| 17 | Wesley Souza — A02 (Gestor Operacional) | US11 | RF001 — Cadastro Sociodemográfico e Vínculos<br>RF014 — Gestão de Família e Vínculos | RN01, RN02 | `/api/responsaveis`<br>`/api/responsaveis/:id`<br>`/api/familias/:id/pessoas`<br>`/api/familias/:id/pessoas/:pessoaId` | `GET` / `POST` / `PUT` / `DELETE` | Consulta | CT81: Responsáveis são listados para seleção (`200`)<br>CT82: Responsável por ID retorna dados cadastrais (`200`)<br>CT83: Novo responsável é criado quando necessário (`201`)<br>CT84: Dados do responsável são atualizados com sucesso (`200`)<br>CT85: Definição ou substituição de responsável familiar preserva a regra de responsável único<br>CT86: CPF ou email duplicado retorna `409` quando a validação estiver ativa | Log de atualização no banco — seção 4.2.1; print de confirmação do responsável; payload de conflito `409` quando aplicável | ✅ Implementado |
| 18 | Wesley Souza (A02) e João Silva (A01) | US02, US07 | RF018 — Armazenamento Seguro de Fotos | RN07, RN12 | `/api/fotos`<br>`/api/fotos/:id`<br>`/api/fotos/:id/signed-url`<br>`/api/moradias/:id/fotos`<br>`/api/moradias/:id/fotos/upload-url`<br>`/api/moradias/:id/fotos/:fotoId` | `GET` / `POST` / `PUT` / `DELETE` | Consulta / Mapa / Ficha da Moradia | CT87: Fotos cadastradas são listadas com sucesso (`200`)<br>CT88: Foto por ID retorna URL e metadados (`200`)<br>CT89: URL assinada é gerada para acesso seguro à foto (`200`)<br>CT90: Fotos da moradia são listadas na ficha (`200`)<br>CT91: Atualização de foto retorna sucesso (`200`)<br>CT92: Remoção de foto retorna sucesso sem remover a moradia (`204`) | Print da galeria da moradia — seção 4.2.1; CT89 — URL assinada gerada; `foto-storage.service.ts` 93,93% cobertura — seção 5.1.4.2 | ✅ Implementado |
| 19 | João Silva — A01 (Agente de Campo) | US01, US02, US06, US07 | RF013 — Cadastro Completo da Família (Transacional) | RN01, RN02, RN03, RN05, RN07, RN12 | `/api/familias/nucleo` | `POST` | Cadastro → Responsável, Moradores, Família, Moradias e Pets | CT93: Núcleo familiar completo é cadastrado em `/api/familias/nucleo` (`201`)<br>CT94: Falha em etapa obrigatória impede persistência parcial do cadastro<br>CT95: Moradia, responsável, dependentes, pets e fotos são vinculados ao núcleo criado<br>CT96: Campos obrigatórios ausentes retornam `400` | Print da tela de cadastro — seção 4.2.1; log da resposta `201` do `POST /api/familias/nucleo`; CT94 — evidência de rollback em falha | ✅ Implementado |
| 20 | João Silva (A01) e Wesley Souza (A02) | — (requisito de produto sem US vinculada) | RF015 — Marcação Manual da Situação da Moradia | RN08 | `/api/moradias/:id`<br>`/api/moradias/:id/detalhes` | `PUT` / `GET` | Cadastro (edição) / Consulta / Mapa | CT97: Situação da moradia é atualizada manualmente em `/api/moradias/:id` (`200`)<br>CT98: Situação atualizada aparece na consulta detalhada da moradia (`200`)<br>CT99: Sistema registra a situação informada sem inferir risco automaticamente<br>CT100: Moradia inexistente retorna `404` | Print antes/depois da situação da moradia — seção 4.2.1; log de atualização (`200`) com campo `situacaoDeOcupacao`; evidência da situação exibida na consulta | ⚠️ Parcial — PUT ativo; restrição `STATUS_MORADIA_CLIENTE` planejada |
| 21 | João Silva (A01) e Wesley Souza (A02) | US01, US04 | RF017 — Indicador de Cadastro Incompleto | RN01, RN03, RN10 | `/api/familias`<br>`/api/familias/:id`<br>`/api/moradias/:id/detalhes` | `GET` | Consulta → Resultado da Busca | CT101: Família sem moradia vinculada é exibida como cadastro incompleto<br>CT102: Consulta detalhada exibe a flag quando a família não possui moradia vinculada<br>CT103: Vincular moradia à família remove o indicador quando a condição deixa de existir<br>CT104: Família inexistente retorna `404` | Print da ficha detalhada — seção 4.2.1; log da resposta com flag de "cadastro incompleto"; evidência antes/depois do vínculo | ⚠️ Parcial — indicador no modelo; exibição automática em validação |
#### **Observações**

Vale ressaltar que nas linhas 10 e 14, que referenciam os requisitos funcionais RF008 e RF011, respectivamente, está indicado que são itens planejados — não executáveis na entrega atual. Isso acontece porque, na definição de requisitos do sistema na seção 3.1, os RF008 e RF011 apresentam funcionalidades importantes para o sistema, mas que ainda não foram implementadas plenamente.

Além disso, na linha 5 o requisito RF006 apresenta endpoints genéricos (`/api/moradias`
`/api/pessoas`) por que a definição dos filtros exatos ainda não foi implementadas.

---

# <a name="c4"></a>4. Desenvolvimento da Aplicação Web

## 4.1. Primeira versão da aplicação web (sprint 3)
Na primeira versão do sistema web, foi aplicado a estrutura de pastas juntamente com o desenvolvimento das funcionalidades CRUD base do sistema referente a moradia, moradores, responsáveis e pets, havendo já um protótipo de alta fidelidade com guia e identidade visual. Ademais, o código foi desenvolvido utilizando a metodologia TDD (Test Driven Development), onde o desenvolvimento é orientado a testes, garantindo um código já testado e comprovado.

Assim, ainda não foi inserido métodos complexos e mais específicos, priorizando a entrega de um MVC visualizável e testável.

### 4.1.1 O que foi implementado

#### **Arquitetura em 6 Camadas**
- **Controllers:** Recebem requisições HTTP, validam entrada, retornam respostas (suporte duplo a EJS e JSON)
- **Services:** Implementam regras de negócio (RN01-RN04), validações, transações
- **Repositories:** Encapsulam acesso ao PostgreSQL/Supabase, queries SQL otimizadas
- **DTOs:** Tipagem de dados trafegados entre camadas
- **Models:** Interfaces TypeScript para entidades
- **Validations:** Validação centralizada de payloads
- **Errors:** Classe `HttpError` para tratamento padronizado de erros

#### **Endpoints Implementados (RF001-RF007)**

**Pessoas (RF001):**
- `GET /api/pessoas` — Lista todas as pessoas ativas
- `GET /api/pessoas/busca` — Busca por nome, CPF, email, telefone
- `GET /api/pessoas/inativas` — Lista pessoas inativas (soft delete)
- `GET /api/pessoas/{id}` — Retorna pessoa por ID
- `POST /api/pessoas` — Cria nova pessoa com validação RN01 (nome e data obrigatórios)
- `PUT /api/pessoas/{id}` — Atualiza dados de pessoa
- `DELETE /api/pessoas/{id}` — Remove logicamente pessoa (LGPD soft delete)

**Responsáveis (RF001):**
- `GET /api/responsaveis` — Lista todos os responsáveis
- `GET /api/responsaveis/{id}` — Retorna responsável por ID
- `POST /api/responsaveis` — Cadastra responsável com CPF, NIS, renda, programas sociais
- `PUT /api/responsaveis/{id}` — Atualiza responsável
- `DELETE /api/responsaveis/{id}` — Remove responsável

**Moradias (RF002, RF003):**
- `GET /api/moradias` — Lista moradias com filtros (status, tipo construção)
- `GET /api/moradias/{id}` — Retorna moradia por ID
- `GET /api/moradias/{id}/detalhes` — Detalhes com localização e histórico
- `POST /api/moradias` — Cria moradia com tipo construção, pavimentos, localização
- `PUT /api/moradias/{id}` — Atualiza moradia
- `DELETE /api/moradias/{id}` — Remove moradia com soft delete

**Famílias (RF001):**
- `GET /api/familias` — Lista famílias
- `GET /api/familias/{id}` — Retorna família por ID
- `POST /api/familias` — Cria família
- `POST /api/familias/nucleo` — Cadastro transacional completo (responsável + membros + moradia)
- `GET /api/familias/{id}/pessoas` — Lista pessoas da família
- `POST /api/familias/{id}/pessoas` — Vincula pessoa à família
- `GET /api/familias/{id}/moradias` — Lista moradias da família
- `POST /api/familias/{id}/moradias` — Vincula moradia com histórico de ocupação
- `GET /api/familias/{id}/pets` — Lista pets da família
- `POST /api/familias/{id}/pets` — Cadastra pet

**Pets (RF007):**
- `GET /api/pets` — Lista todos os pets
- `GET /api/pets/{id}` — Retorna pet por ID
- `POST /api/pets` — Cria novo pet (tipo obrigatório)
- `PUT /api/pets/{id}` — Atualiza pet
- `DELETE /api/pets/{id}` — Remove pet

**Fotos (RF002, RF007):**
- `GET /api/moradias/{id}/fotos` — Lista fotos da moradia
- `POST /api/moradias/{id}/fotos/upload-url` — Gera URL pré-assinada Supabase Storage
- `POST /api/moradias/{id}/fotos` — Registra metadados da foto
- `GET /api/pets/{id}/fotos` — Lista fotos do pet
- `POST /api/pets/{id}/fotos/upload-url` — URL de upload para foto de pet

#### **Banco de Dados e Migrações**
- **7 migrações versionadas** implementadas:
  - `01_create_pessoas_sql.sql` — Criação tabela pessoas com ENUMs (parentesco, status, escolaridade, situação ocupacional)
  - `02_add_familias.sql` — Tabela família com relacionamento 1:N com pessoa
  - `03_allow_pet_photos.sql` — Adição suporte a fotos de pets
  - `04_add_pet_status.sql` — Status para pets
  - `05_enforce_responsavel_unico_familia.sql` — Constraint de responsável único por família
  - `06_add_tipo_pet.sql` — Enum de tipos de pets
  - `07_create_storage_bucket.sql` — Bucket Supabase para fotos

- **Tabelas criadas:** `pessoas`, `responsavel`, `familia`, `pet`, `localizacao`, `moradia`, `foto`, `pessoa_familia`, `familia_moradia`
- **ENUMs implementados:** tipo_parentesco, tipo_status, tipo_escolaridade, tipo_situacao_ocupacional, tipo_pet

#### **Validações e Regras de Negócio (RN01-RN04)**
- **RN01:** Nome e data de nascimento obrigatórios para Pessoa
- **RN02:** Escolaridade e situação ocupacional obrigatórias
- **RN03:** Parentesco obrigatório
- **RN04:** Medicação e doença crônica não podem ser nulas
- **RN - LGPD:** Soft delete com `deleted_at` e `status` para conformidade com LGPD

#### **Views EJS e Interface Web**
- `pessoa-novo.ejs` — Formulário de cadastro de pessoa com validação client-side
- `pessoa-lista.ejs` — Tabela de listagem de pessoas com ícones de editar/deletar
- `public/styles.css` — Estilos conforme guia (cores: Azul #182C4C, Laranja #ff7500, tipografia DM Sans)

#### **Testes Automatizados (Jest + Supertest)**
- `pessoa.persistence.spec.ts` — Testes de persistência DB validando RN01
- Controller tests para validação de payloads, status codes, renderização de views
- Cobertura básica de operações CRUD e fluxos de erro

#### **Integração Supabase**
- Classe `SupabaseStorageClient` implementada para upload de fotos
- Geração de URLs pré-assinadas para acesso seguro
- FotoStorageService como wrapper desacoplando detalhes de infraestrutura

#### Reajustes e atualizações da documentação
Foram realizadas as seguintes atualizações no WAD durante essa sprint de consolidação:

- Seção 4.1 (Primeira versão da aplicação web)
- Seção 3.4 (Guia de Estilos): criação do Guia de Estilos completa
- Seção 3.5 (Protótipos de Alta Fidelidade): desenhado os protótipo de Alta Fidelidade do sistema
- Seção 3.6 (Modelo Físico): reajustes conforme surgimento de necessidades de alterações do banco de dados
- Seção 3.6.4 (Consultas SQL com Lógica Proposicional): Escrita das consultas SQL juntamento com a documentação da lógica proposicional do sistema
- Documentação e aplicação geral da arquitetura utilizada (3.2)


### 4.1.2 O que não foi concluído

- **Mapa Georreferenciado (RF004):** Endpoints `/api/moradias/mapa` e visualização de marcadores não implementados
- **Mapa de Calor (RF008):** Endpoint `/api/indicadores/mapa-calor` planejado, não finalizado
- **Alerta de Recadastro (RF011):** Job agendado de detecção de fichas desatualizadas (>365 dias) não implementado
- **Consulta Integrada com Flag Risco Crítico (RF005, RN05):** Endpoint `/api/moradias/{id}/consulta-integrada` com flag de risco crítico não finalizado
- **Exportação de Relatórios (RF006):** Endpoints `/api/moradias/exportar` em CSV/PDF não implementados
- **Realocação de Famílias Avançada (RF009):** Fluxo complexo de realocação com validação de integridade incompleto
- **Frontend Mobile/Responsivo:** Apenas telas EJS básicas. Sem interface desktop.
- **Geolocalização Multimodal (RF003):** Captura automática de GPS, CEP digital e referências visuais não totalmente testada
- **Endpoints GET com agregação:** Endpoints de totalização por grupo prioritário, contadores de vulnerabilidade não implementados


### 4.1.3 Dificuldades encontradas
Dentre as dificuldades, encontramos problemas diversos considerando o prazo de entrega apertadíssimo, dificultando na possibilidade de aplicações de funcionalidades secundárias, porém úteis, como o alerta de atualização do cadastro de Gestantes após um prazo estimado de gravidez; diferenciação de pets para animais com fins funcionais (comerciais e reprodutivos). Sendo todas estas, inseridas como escopo extra que desejaríamos de implementar se fosse possível.


### 4.1.4 Próximos passos
**Sprint 4 (Consolidação e Features Críticas):**
1. **Completar RF005:** Consulta integrada + flag RN05 de risco crítico
2. **Implementar RF004/RF008:** Mapa com marcadores e heatmap de vulnerabilidades
3. **Job de recadastro (RF011):** Scheduler para detectar fichas desatualizadas
4. **Exportação (RF006):** CSV/PDF com filtros
5. **Melhorar testes:** Aumentar cobertura para 80%+; testes e2e com Supertest
6. **Frontend básico:** Começar interface React/Next.js para cadastro
7. **Geolocalização:** Testar captura GPS completa em diferentes contextos

### 4.1.5 Demonstrações visuais

<!-- <p>Arquitetura de pastas e classes</p> -->
<div align="center">
    <p>Arquitetura de pastas e classes</p>
    <img src="outros/arquitetura-pastas.png" height="800">
    <p>Feito pela própria equipe (2026)</p>
</div>

## 4.2. Segunda versão da aplicação web (sprint 4)

### 4.2.1 O que foi implementado

Esta sprint foi dedicada à consolidação e refatoração da API, corrigindo inconsistências de contrato, alinhando nomes de campos ao padrão camelCase e entregando funcionalidades que estavam planejadas mas incompletas na sprint anterior. Nesta refatoração, as views EJS e as rotas HTML da primeira versão (seção 4.1) foram **removidas**: o backend passou a ser uma API REST pura sob o prefixo `/api`, e a interface migrou para um frontend SPA independente em React/Vite (`src/frontend`), implantado separadamente na Vercel (seção 3.2.6).
#### Status das Funcionalidades — Sprint 4

| Funcionalidade | Status | Observação |
|---|---|---|
| Padronização camelCase de campos | ✅ Concluído | Aliases snake_case mantidos para compatibilidade retroativa |
| Endpoints de Pessoas (`/api/pessoas`) | ✅ Concluído | CRUD completo; busca por nome/CPF/e-mail/telefone |
| Endpoints de Responsáveis (`/api/responsaveis`) | ✅ Concluído | CRUD completo com validação de campos obrigatórios |
| Endpoints de Famílias (`/api/familias`) | ✅ Concluído | CRUD; histórico de vínculos; cadastro de núcleo transacional |
| Endpoints de Moradias (`/api/moradias`) | ✅ Concluído | CRUD; georreferenciamento; detalhes integrados; histórico de famílias |
| Endpoints de Pets (`/api/pets`) | ✅ Concluído | CRUD; fotos de pets; URL assinada de upload |
| Endpoints de Fotos (`/api/fotos`) | ✅ Concluído | CRUD; URL assinada de acesso; integração Supabase Storage |
| Cadastro transacional de núcleo familiar | ✅ Concluído | `POST /api/familias/nucleo` com rollback em falha |
| Soft delete (pessoas, famílias, moradias) | ✅ Concluído | Registros nunca são deletados fisicamente; histórico preservado |
| Cobertura de testes unitários | ✅ Concluído | 72,67% statements gerais; controllers 87,81%; seção 5.1.4.2 |
| Validações de payload | ✅ Concluído | `validations/` com 67,07% branches; erros `400` descritivos |
| Mapa de calor (`RF008`) | 🚧 Planejado | Endpoint não implementado nesta sprint; previsto para sprint 5 |
| Alerta automático de recadastro (`RF011`) | 🚧 Planejado | Endpoint não implementado nesta sprint; previsto para sprint 5 |
| Autenticação e controle de acesso | 🚧 Fora do escopo | Não previsto no TAPI acadêmico; API pública no ambiente de desenvolvimento |

#### Refatoração do Contrato da API (Renomeação de Campos)

Todos os campos foram padronizados em camelCase, mantendo aliases snake_case para compatibilidade. As principais mudanças foram:

**Pessoas:**
| Campo antigo | Campo novo | Tipo alterado? |
|---|---|---|
| `id_cidadao` | `id` | — |
| `nome_completo` | `nome` | — |
| `data_nascimento` | `dataDeNascimento` | — |
| `doencas_cronicas` | `cronico` | ✅ string → boolean |
| `medicamentos` | `medicacao` | ✅ string → boolean |
| `grau_parentesco_responsavel` | `parentesco` | — |
| `status_cadastro` | `status` | ✅ boolean → string (`"Ativo"`) |

**Responsáveis:**
- `celular` → `telefone`
- `programas_sociais` → `programaSocial`
- `local_nascimento` → `localDeNascimento`
- Novos campos: `nomeDoPai`, `nomeDaMae`, `dataResidenciaEstado`, `dataResidenciaMoradia`
- O `id_responsavel` foi eliminado — responsável agora compartilha o `id` da pessoa

**Moradias:**
- `condicao_ocupacao` → `situacaoDeOcupacao`
- `tipo_uso_imovel` → `usoImovel`
- `observacoes` → `descricao`
- `data_cadastro` → `dataRegistro`
- Campo `telefone` **removido** do modelo de moradia
- Campo `pavimentos` **adicionado**

**Pets:**
- `tipo_pet` → `tipo` (agora enum: `cachorro`, `gato`, `reptil`, `ave`, `roedor`, `outros`)
- `porte_pet` → `porte`
- `observacoes` → `observacao`
- `id_familia` → `idFamilia`
- Novos campos obrigatórios: `raca` e `status` (`Ativo`, `Inativo`, `Desaparecido`, `Falecido`)

**Fotos:**
- Campo `tipo_foto` **removido** — backend usa apenas `url`
- Upload: `nome_arquivo` → `fileName`; novos campos `contentType` e `upsert`
- Resposta de upload reformulada: `{ bucket, path, signedUrl, token, expiresIn }`

#### Reformulação do `POST /api/moradias`

O endpoint de criação de moradia passou a exigir dois sub-objetos obrigatórios no corpo da requisição:

```json
{
  "localizacao": { "cidade", "estado", "latitude", "longitude", ... },
  "moradia": { "tipoConstrucao", "usoImovel", "situacaoDeOcupacao", ... }
}
```

Antes, os campos eram enviados de forma plana sem separação de contexto.

#### Cadastro Completo via `POST /api/familias/nucleo` (RF001)

O endpoint `/api/familias/nucleo` foi completamente reformulado. Na versão anterior, servia apenas para agrupar IDs de pessoas já existentes em uma família. Agora, é o endpoint de **cadastro completo transacional**, criando em uma única operação:
- Localização + Moradia
- Família e vínculo família-moradia
- Responsável (pessoa + dados extras)
- Dependentes (array)
- Pets com fotos

Isso substitui o endpoint `/api/cadastros-completos` que estava listado como planejado na sprint anterior.

#### Padronização dos Endpoints DELETE (Soft Delete)

Todos os DELETEs de recursos principais passaram de `200 OK` com corpo JSON para `204 No Content` sem corpo, implementando soft delete via `deleted_at`:

| Endpoint | Sprint 3 | Sprint 4 |
|---|---|---|
| `DELETE /api/pessoas/:id` | `200` + JSON | `204` sem corpo |
| `DELETE /api/responsaveis/:id` | `200` + JSON | `204` sem corpo |
| `DELETE /api/moradias/:id` | `200` + JSON | `204` sem corpo |
| `DELETE /api/familias/:id` | `200` + JSON | `204` sem corpo |
| `DELETE /api/pets/:id` | `200` + JSON | `204` sem corpo |
| `DELETE /api/fotos/:id` | `200` + JSON | `204` sem corpo |

Exceção mantida: `DELETE /api/familias/:id/pessoas/:pessoaId` e `DELETE /api/familias/:id/moradias/:moradiaId` continuam retornando `200` com o vínculo atualizado.

#### Expansão da Busca de Pessoas

O endpoint `GET /api/pessoas/busca` passou de um parâmetro genérico `q` para filtros específicos: `nome`, `cpf`, `email`, `telefone` e `escopo` (`ativas`, `inativas`, `todas`).

#### Autenticação (Estado Atual)

O middleware de autenticação **ainda não foi implementado**. Os status `401` e `403`, previstos na documentação inicial, não fazem parte do contrato atual. Os endpoints estão abertos sem controle de acesso.

---

### 4.2.2 O que não foi concluído

- **Mapa Georreferenciado (RF004):** `GET /api/moradias/mapa` ainda não implementado
- **Mapa de Calor (RF008):** `GET /api/indicadores/mapa-calor` planejado, não entregue
- **Alerta de Recadastro (RF011):** Job agendado de fichas desatualizadas não implementado
- **Consulta Integrada (RF005):** `GET /api/moradias/:id/consulta-integrada` ausente
- **Exportação de Relatórios (RF006):** `GET /api/moradias/exportar` em CSV/PDF não implementado
- **Grupos Prioritários:** As tabelas `grupo_prioritario` e `pessoa_grupo_prioritario` existem no banco mas o código as ignora — nenhuma rota, repositório ou service implementado para essa funcionalidade
- **CPF de Pessoa:** O CPF ainda está restrito à tabela `responsavel`, impossibilitando o registro de CPF para cidadãos não-responsáveis
- **Validação de vínculo família-moradia:** O sistema permite vincular uma família ativa a uma moradia interditada ou inativa sem retornar erro (US14 não implementada)

---

### 4.2.3 Dificuldades técnicas encontradas

**Inconsistência status vs. deleted_at em Moradias:** Identificou-se um bug de estado zumbi: o endpoint `PUT /api/moradias/:id` aceita `{ "status": "Excluída" }` e retorna `200 OK`, mas grava apenas o campo `status` sem atualizar `deleted_at`. Como as views de listagem (`vw_moradia_ativa`) filtram por `deleted_at IS NULL` e não pelo campo `status`, a moradia aparece nas listagens como ativa com status mentiroso de "Excluída". A rule de soft delete do banco (`soft_delete_moradia`) corrige ambos os campos ao mesmo tempo, mas só é acionada via `DELETE`, não via `PUT`. A correção planejada é restringir os valores aceitos pela API a `STATUS_MORADIA_CLIENTE = ['Ativa', 'Interditada', 'Demolida', 'Em Risco']`, impedindo que "Excluída" seja enviado via `PUT`.
- **Causa raiz:** A rule de soft delete do banco (`soft_delete_moradia`) corrige `status` e `deleted_at` ao mesmo tempo, mas é acionada apenas via `DELETE`. O endpoint `PUT /api/moradias/:id` não invoca essa rule, gravando somente o campo `status` e deixando `deleted_at` como `NULL`.
- **Impacto:** A view `vw_moradia_ativa` filtra por `deleted_at IS NULL`, não pelo campo `status`. Uma moradia com `status = "Excluída"` e `deleted_at = NULL` continuava aparecendo em todas as listagens como ativa, criando um registro inconsistente que a Defesa Civil não conseguiria arquivar pela interface.
- **Solução adotada:** Restrição do conjunto de valores aceitos no `PUT` à constante `STATUS_MORADIA_CLIENTE = ["Ativa", "Interditada", "Demolida", "Em Risco"]`, impedindo que `"Excluída"` seja enviado via `PUT`. O arquivamento real passa a exigir o uso do endpoint `DELETE /api/moradias/:id`, que aciona a rule correta.
- **Estado atual:** Correção planejada para sprint 5 — seção 4.2.4, item 1.

**Divergência entre model TypeScript e banco de dados:** O model `grupo-prioritario.model.ts` declara o campo `dataPrevistaParto: Date | null`, mas a tabela `grupo_prioritario` no banco não possui essa coluna. Isso precisa ser resolvido antes de ativar a funcionalidade de grupos prioritários — seja adicionando a coluna via migration, seja removendo o campo do model.
- **Causa raiz:** O model TypeScript foi criado antecipando um campo planejado (`dataPrevistaParto`) que nunca chegou a ser incluído na migration do banco. A divergência passou despercebida porque o módulo de grupos prioritários ainda não estava integrado às rotas.
- **Impacto:** Qualquer endpoint que utilize o model `grupo-prioritario.model.ts` em produção retornaria um campo que não existe no banco, gerando inconsistência de schema em tempo de execução e potencial falha silenciosa no TypeScript.
- **Solução adotada:** Decisão pendente entre adicionar `dataPrevistaParto` via migration ou remover o campo do model. A funcionalidade está bloqueada até a resolução.
- **Estado atual:** Pendente — resolução necessária antes da ativação dos grupos prioritários (seção 4.2.4, item 3).

**Eliminação do `id_responsavel`:** A unificação do responsável como uma extensão de pessoa exigiu revisão de todas as queries e repositórios que antes referenciavam `id_responsavel` como chave separada. Todos os endpoints de responsável passaram a usar o `id` da pessoa.
- **Causa raiz:** A decisão de arquitetura de tornar o responsável uma extensão de pessoa (com o mesmo `id`) foi tomada após as queries e repositórios iniciais já referenciarem `id_responsavel` como chave separada.
- **Impacto:** Todas as queries de JOIN entre `pessoa` e `responsavel`, e todos os DTOs que expunham `id_responsavel` como campo separado, precisaram ser revisados. A refatoração afetou `ResponsavelRepository`, `FamiliaRepository`, `MoradiaRepository` e os respectivos services e controllers.
- **Solução adotada:** Remoção completa do campo `id_responsavel` das queries e DTOs; todos os endpoints de responsável passaram a usar o `id` da tabela `pessoa` como identificador único.
- **Estado atual:** ✅ Concluído — refatoração validada nos testes de integração da sprint 4; seção 5.1.4.2.

---

### 4.2.4 Próximos passos (Sprint 5)

1. **Corrigir bug de estado zumbi em moradia:** Implementar `STATUS_MORADIA_CLIENTE` na validação do `PUT /api/moradias/:id`
2. **Migrar CPF para a tabela `pessoa`:** Remover coluna `cpf` de `responsavel`, adicionar em `pessoa` com constraint `UNIQUE`; atualizar model, DTO, repository e busca
3. **Implementar Grupos Prioritários:** Criar repositório, service e rotas para `grupo_prioritario`; adicionar campo `gruposPrioritarios: number[]` nos payloads de criação/atualização de pessoa
4. **Validação US14:** Impedir vínculo de família ativa com moradia interditada ou inativa no `FamiliaService.vincularMoradia`
5. **Autenticação:** Implementar middleware de autenticação JWT nas rotas da API
6. **Mapa e Indicadores:** Endpoints `/api/moradias/mapa` e `/api/indicadores/mapa-calor`


## 4.3. Versão final da aplicação web (sprint 5)

*Descreva e ilustre aqui o desenvolvimento da versão final do sistema web, com foco em refatorações, correções finais e na camada de autenticação/autorização entregue. Utilize prints de tela para ilustrar. Indique obrigatoriamente: (a) o que foi refinado ou adicionado desde a sprint 4, (b) pendências remanescentes, (c) dificuldades técnicas enfrentadas.*

# <a name="c5"></a>5. Testes

## 5.1. Relatório de testes de integração de endpoints automatizados (sprint 4)

### 5.1.1 Estratégias de Testes

#### 5.1.1.1 Separação por camada

A estratégia de testes automatizados do projeto segue a separação por camadas da arquitetura da aplicação, definindo abordagens diferentes para Service, Controller e Repository, conforme a responsabilidade de cada camada. Essa separação evita que um único tipo de teste tente validar todo o sistema ao mesmo tempo e torna mais claro o que cada evidência comprova.

Na camada de Service, os testes são tratados como testes unitários white-box, pois essa camada concentra regras de negócio, validações, tratamentos de exceção, transações e decisões internas da aplicação. Por isso, a suíte exercita os principais fluxos internos dos serviços, incluindo cenários de sucesso, dados inválidos, entidades inexistentes, conflitos de regra de negócio e falhas esperadas. As dependências externas da camada, como repositories, conexão com banco, storage e outros services, são substituídas por mocks, permitindo verificar tanto o resultado retornado quanto as interações esperadas com essas dependências. Para este artefato, a camada Service deve apresentar no mínimo 80% de cobertura no relatório gerado pelo Jest.

Na camada de Controller, a abordagem adotada é o teste black-box do contrato HTTP por meio do Supertest, com o uso do test runner Jest. Nesse caso, o foco não está na implementação interna dos controllers, mas no comportamento observável da API: código de status, corpo da resposta, mensagens de erro e tratamento de entradas válidas ou inválidas. Para manter o teste determinístico e isolado, os services são mockados. Assim, a suíte valida rotas e controllers sem depender de banco de dados, repositories ou integrações externas.

Na camada de Repository, os testes são opcionais e devem ser aplicados apenas quando houver lógica não trivial de consulta ou persistência. Isso inclui situações como montagem dinâmica de filtros, joins, consultas com múltiplas condições, soft delete, regras dependentes do banco de dados, views ou relacionamentos relevantes entre entidades. Quando necessários, esses testes devem utilizar banco controlado ou ambiente isolado, com transações e ROLLBACK, evitando dependência de dados externos ou residuais. Como a lógica prioritária deste artefato está concentrada em Service e Controller, a suíte atual prioriza essas duas camadas.

#### 5.1.1.2 Padrão AAA e Determinismo

A escrita dos testes deve seguir o padrão AAA (Arrange, Act, Assert), que organiza cada caso de teste em três etapas bem definidas: preparação, execução e verificação. Esse padrão melhora a legibilidade, facilita a manutenção e reduz ambiguidades sobre o comportamento que está sendo validado.

Na etapa Arrange, são preparados todos os dados, objetos, dependências e condições necessárias para o teste. Essa preparação deve ser explícita e isolada, evitando dependência de dados previamente existentes no ambiente. Na etapa Act, executa-se apenas a ação principal que se deseja testar, como a chamada de uma função, método, rota ou serviço. Por fim, na etapa Assert, são verificadas as saídas, alterações de estado ou efeitos esperados, garantindo que o resultado obtido corresponde ao comportamento especificado.

Além da organização pelo padrão AAA, os testes devem ser determinísticos, ou seja, devem produzir sempre o mesmo resultado quando executados nas mesmas condições. Um teste determinístico não pode depender da ordem de execução de outros testes, do relógio real do sistema, de chamadas a redes externas ou de dados residuais deixados por execuções anteriores.

Para garantir esse determinismo, cada teste deve criar seus próprios dados de entrada e limpar ou isolar qualquer estado necessário. Dependências externas, como APIs, serviços de terceiros ou banco de dados compartilhado, devem ser substituídas por mocks, stubs, fixtures ou ambientes controlados. Quando houver lógica dependente de data e hora, o tempo deve ser fixado ou simulado, evitando falhas causadas por diferenças de horário, fuso, virada de dia ou variações de execução.

Também é importante que os testes não compartilhem estado mutável entre si. Cada caso deve poder ser executado individualmente ou em conjunto com toda a suíte, em qualquer ordem, sem alterar seu resultado. Essa característica aumenta a confiabilidade da suíte de testes e reduz a ocorrência de falhas intermitentes, conhecidas como testes “flaky”.

Dessa forma, a adoção do padrão AAA combinada ao determinismo contribui para uma estratégia de testes mais clara, confiável e sustentável. Os testes passam a funcionar não apenas como mecanismos de verificação automática, mas também como documentação objetiva do comportamento esperado do sistema.

#### 5.1.1.3 Aplicação prática: determinismo com jest.setup.ts

O determinismo das suites de Service é garantido pelo arquivo `src/geoRisco/src/tests/jest.setup.ts`, que injeta valores fictícios para todas as variáveis de ambiente antes de qualquer teste ser carregado:

```ts
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://test:test@localhost:5432/georisco_test';
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key';
```

Essa configuração permite que os imports de infraestrutura (conexão com banco, cliente Supabase) sejam carregados sem acessar recursos reais. O Jest não realiza nenhuma chamada de rede durante a execução dos testes unitários.

#### 5.1.1.4 Aplicação prática: padrão AAA em CT01

O exemplo abaixo, extraído de `familia.service.test.ts`, ilustra as três etapas do padrão AAA aplicadas ao caso CT01 (RN02 — responsável único por família ativa):

```ts
it('CT01 - Deve lançar HttpError 409 se a família já possuir um responsável ativo diferente', async () => {
    // Arrange: família existente, pessoa com parentesco Responsável,
    // dados de responsável preenchidos em pessoa e outro responsável ativo na família
    familiaRepoMock.getById.mockResolvedValue({ id: 1 });
    pessoaRepoMock.getById.mockResolvedValue({ id: 2, parentesco: 'Responsável' });
    pessoaRepoMock.getResponsavelByPessoaId.mockResolvedValue({ id: 2 });
    familiaRepoMock.getResponsavelAtivo.mockResolvedValue({ id: 3 }); // id diferente

    // Act: tenta vincular a pessoa como novo responsável
    const act = service.vincularPessoa(1, { idPessoa: 2 });

    // Assert: service rejeita com conflito 409
    await expect(act).rejects.toThrow(new HttpError(409, 'Familia ja possui responsavel ativo'));
});
```

Todos os módulos (repositories, banco, Supabase) são substituídos por mocks Jest no `beforeEach`, garantindo que o teste seja completamente independente de infraestrutura externa.

### 5.1.2 Testes unitários de service

Os testes unitários da camada Service verificam, de forma isolada, as regras de negócio que ficam entre os controllers e os repositories. Essa camada concentra decisões importantes do sistema, como validação de dados obrigatórios, vínculo entre família, pessoa e moradia, controle de arquivamento lógico, restrições para responsáveis, operações transacionais, validação de fotos e integração controlada com storage.

Esses testes são feitos para garantir que as regras documentadas no WAD continuem funcionando mesmo quando a API, o banco de dados ou a interface mudarem. Para isso, repositories, transações e serviços externos são substituídos por mocks, permitindo validar apenas o comportamento do Service. Essa abordagem torna os testes mais rápidos, determinísticos e adequados para evidenciar cobertura de regra de negócio sem depender de infraestrutura externa.

O conjunto também serve como evidência de rastreabilidade entre casos de teste e regras de negócio. A suíte está centralizada em `src/geoRisco/src/tests`, separando os arquivos de teste dos arquivos que implementam a lógica do backend. Os casos prioritários são documentados no formato `CTxx -> RNxx`, indicando a regra associada, o arquivo em que a validação ocorre, o caminho feliz e o caminho de falha exercitado.

## Escopo e execução

Os testes unitários da camada Service ficam em `src/geoRisco/src/tests/*.service.test.ts`.

Comando de evidência:

```bash
npm test -- --coverage
```
Caso o comando acima não funcione por restrições do powershell, rode:

```bash
npm.cmd test -- --coverage
```

O Jest gera o relatório de cobertura a partir da configuração `src/geoRisco/jest.config.js`, e a camada Service é avaliada no agrupamento `src/services` do relatório.

A evidência visual da execução do comando `npm test -- --coverage`, ou `npm.cmd test -- --coverage` é apresentada abaixo:

![Evidência da cobertura dos testes unitários de Service](outros/porcentagemTesteService.png)

## Dependências necessárias

Para permitir a execução dos testes, foram adicionadas as seguintes dependências:

| Dependência | Tipo | Justificativa |
|---|---|---|
| `typescript` | devDependency | Necessária para compilar o projeto TypeScript antes da execução do Jest. |
| `dotenv` | dependency | Necessária porque o projeto importa `dotenv/config` em arquivos de infraestrutura. |
| `@supabase/supabase-js` | dependency | Necessária porque `foto-storage.service.ts` depende do cliente Supabase Storage. |

Essas dependências já estão registradas no `package.json` e no `package-lock.json`. Portanto, em outro computador, não é necessário instalar cada pacote manualmente: basta executar `npm install` na raiz do projeto para que o npm baixe as versões corretas.

Os testes unitários não dependem do `.env` real do projeto. Durante a execução do Jest, o arquivo `src/geoRisco/src/tests/jest.setup.ts` define valores fictícios para `DATABASE_URL`, `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`, permitindo que os imports de infraestrutura funcionem sem acessar banco de dados ou Supabase reais. As chamadas externas usadas nos Services são substituídas por mocks.

Após clonar o projeto, basta executar:

```bash
npm install
npm test -- --coverage
```

## Casos prioritários

| Caso | RN | Arquivo | Objetivo |
|---|---|---|---|
| CT01 | RN02 | `familia.service.test.ts` | Validar que uma família ativa não recebe outro responsável ativo diferente. |
| CT02 | RN01 | `familia.service.test.ts` | Validar que pessoa com parentesco de responsável precisa existir também como responsável. |
| CT03 | RN06 | `familia.service.test.ts` e `pessoa.service.test.ts` | Validar arquivamento lógico e bloqueios para remoções que violem integridade familiar. |
| CT04 | RN05 | `moradia.service.test.ts` | Validar cadastro transacional de moradia com localização controlada. |
| CT05 | RN05 | `moradia.service.test.ts` | Validar montagem da consulta detalhada de moradia com família, pessoas, pets e fotos. |

## Explicação dos 5 prioritários

**CT01 -> RN02**
- AAA: arrange cria família existente, pessoa com parentesco de responsável e responsável ativo diferente; act chama `FamiliaService.vincularPessoa`; assert verifica rejeição com conflito.
- Determinismo: usa repositories mockados e dados fixos.
- RN coberta: RN02 exige responsável único por família ativa.
- Caminho de falha: tentativa de vincular outro responsável retorna `HttpError 409`.

**CT02 -> RN01**
- AAA: arrange cria família existente e pessoa marcada como responsável, mas sem registro correspondente na tabela de responsáveis; act chama `FamiliaService.vincularPessoa`; assert verifica erro controlado.
- Determinismo: usa mocks de família e pessoa, sem banco real.
- RN coberta: RN01 exige que a família ativa possua responsável válido e completo.
- Caminho de falha: responsável incompleto retorna `HttpError 400`.

**CT03 -> RN06**
- AAA: arrange configura família existente (`getById` retorna objeto válido), moradia existente (`getById` retorna objeto válido) e repositories mockados; act chama `FamiliaService.remover`, `MoradiaService.remover`, `PessoaService.remover` e métodos de vínculo; assert verifica que o método `delete` do repository foi chamado com o ID correto.
- Determinismo: todos os repositories são mocks Jest inicializados no `beforeEach`; nenhuma chamada de banco real ocorre.
- RN coberta: RN06 exige arquivamento lógico (soft delete via RULE PostgreSQL) preservando histórico de vínculos.
- Caminho de falha: quando `getById` retorna `null`, o service lança `HttpError 404` antes de chamar `delete`; quando a remoção violaria integridade familiar, retorna `HttpError 404` (vínculo não encontrado).

**CT04 -> RN05**
- AAA: arrange prepara payload de moradia com localização e client transacional mockado; act chama `MoradiaService.cadastrar`; assert verifica criação da localização, criação da moradia e conclusão da transação.
- Determinismo: coordenadas, payloads e transação são fixos e mockados.
- RN coberta: RN05 exige captura e confirmação de geolocalização da moradia.
- Caminho de falha: se a moradia criada não puder ser recuperada na confirmação, o service executa ROLLBACK e retorna erro controlado.

**CT05 -> RN05**
- AAA: arrange configura `moradiaRepoMock.getById` retornando moradia válida (`{ id: 1 }`), `familiaRepoMock.getFamiliasByMoradia` retornando `[{ id: 10 }]`, `familiaRepoMock.getPessoas` retornando `[{ id: 20 }]`, `familiaRepoMock.getPets` retornando `[{ id: 30 }]` e `fotoRepoMock.getByMoradia` retornando `[{ id: 100 }]`; act chama `MoradiaService.getDetalhes(1)`; assert verifica que `detalhes.familias[0].pessoas` e `detalhes.fotos` contêm os dados mockados.
- Determinismo: todos os dados são fixtures em memória; `jest.clearAllMocks()` no `beforeEach` garante isolação entre execuções.
- RN coberta: RN05 sustenta a consulta georreferenciada e detalhada da moradia, consolidando família, moradores, pets e fotos em uma única resposta para uso operacional.
- Caminho de falha: quando o `MoradiaService` é instanciado sem as dependências opcionais (`familiaRepo`, `fotoRepo`), lança `HttpError 500 'Dependencias de detalhe de moradia nao configuradas'` em vez de retornar dados incompletos.

### 5.1.3 Testes de Integração de Endpoints

Os testes de integração de endpoints têm como objetivo validar o comportamento observável da API por meio de requisições HTTP executadas em ambiente controlado. Diferentemente dos testes unitários da seção 5.1.2, que verificam a camada de Service com mocks, os testes desta seção devem exercitar a aplicação a partir das rotas HTTP, verificando a integração entre rotas, controllers, services, tratamento de erros e contratos de resposta.

Conforme definido nos critérios do projeto, cada endpoint principal deve contemplar, sempre que aplicável, os quatro cenários-chave:

* **Sucesso**: resposta `200`, `201` ou `204`, conforme o contrato do endpoint;
* **Falha de validação**: resposta `400`, quando o payload, parâmetro ou identificador for inválido;
* **Regra de negócio violada**: resposta `409` quando houver conflito explícito, ou status equivalente já implementado pelo backend, como `400` para regra rejeitada por validação de domínio ou `502` para falha controlada de serviço externo;
* **Recurso não encontrado**: resposta `404`, quando a entidade consultada ou vinculada não existir.

Essa abordagem garante que os fluxos críticos sejam avaliados tanto no caminho feliz quanto em situações de erro previsíveis, mantendo coerência com os status HTTP efetivamente usados pelo backend atual.

#### 5.1.3.1 Cobertura Obrigatória dos Endpoints Principais

A cobertura dos testes de integração foi definida a partir dos requisitos funcionais prioritários da aplicação, garantindo rastreabilidade entre os fluxos de negócio, os contratos HTTP da API e as regras de negócio descritas na Seção 3.1.3. Para cada endpoint principal são contemplados os cenários de sucesso, falha de validação, violação de regra de negócio e recurso não encontrado.

| Endpoint                                     | RF Relacionados            | RN Relacionadas        | Sucesso (200/201/204)                            | Falha de Validação (400/422)                      | Regra de Negócio Violada / Falha Externa (409 ou equivalente)      | Não Encontrado (404)                      |
| -------------------------------------------- | -------------------------- | ---------------------- | ------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| `POST /api/pessoas`                          | RF001                      | RN04                   | Pessoa cadastrada com sucesso (`201`)            | Campos obrigatórios ausentes ou inválidos (`400`) | Classificação de vulnerabilidade inconsistente (`400`)             | Entidade vinculada inexistente (`404`)    |
| `GET /api/pessoas/:id`                       | RF001, RF005               | RN11                   | Pessoa encontrada (`200`)                        | ID inválido (`400`)                               | —                                                                  | Pessoa inexistente (`404`)                |
| `PUT /api/pessoas/:id`                       | RF012, RF019               | RN04, RN09, RN10       | Atualização realizada (`200`)                    | Payload inválido (`400`)                          | Violação das regras de recadastro ou atualização cadastral (`400`) | Pessoa inexistente (`404`)                |
| `SOFT DELETE /api/pessoas/:id`                    | RF010                      | RN01, RN06             | Morador arquivado (`204`)                        | ID inválido (`400`)                               | Tentativa de arquivar responsável sem substituição prévia (`409`)  | Pessoa inexistente (`404`)                |
| `GET /api/pessoas/busca`                     | RF016                      | RN11                   | Busca executada com sucesso (`200`)              | Nenhum filtro informado (`400`)                   | Escopo incompatível com regras de consulta (`400`)                 | Lista vazia retorna `200`                 |
| `POST /api/responsaveis`                     | RF001, RF014               | RN01, RN02             | Responsável cadastrado (`201`)                   | Dados obrigatórios ausentes (`400`)               | Família já possui responsável ativo (`409`)                        | Pessoa inexistente (`404`)                |
| `PUT /api/responsaveis/:id`                  | RF014                      | RN01, RN02             | Responsável atualizado (`200`)                   | Payload inválido (`400`)                          | Tentativa de manter dois responsáveis ativos (`409`)               | Responsável inexistente (`404`)           |
| `POST /api/familias`                         | RF001, RF014               | RN01, RN02, RN03       | Família criada (`201`)                           | Dados obrigatórios ausentes (`400`)               | Família sem responsável válido (`400`)                             | —                                         |
| `POST /api/familias/nucleo`                  | RF013                      | RN01, RN02, RN03, RN12 | Cadastro transacional completo realizado (`201`) | Dados obrigatórios ausentes (`400`)               | Violação das regras de composição familiar (`409`)                 | Entidades vinculadas inexistentes (`404`) |
| `POST /api/familias/:id/pessoas`             | RF014                      | RN01, RN02             | Pessoa vinculada à família (`201`)               | ID inválido (`400`)                               | Família já possui responsável ativo (`409`)                        | Pessoa ou família inexistente (`404`)     |
| `SOFT DELETE /api/familias/:id/pessoas/:pessoaId` | RF014                      | RN01, RN06             | Vínculo removido (`200`)                         | IDs inválidos (`400`)                             | Família ativa ficaria sem responsável (`409`)                      | Vínculo inexistente (`404`)               |
| `POST /api/familias/:id/moradias`            | RF014, RF017               | RN03, RN10             | Moradia vinculada à família (`201`)              | ID inválido (`400`)                               | Associação incompatível (`409`)                                    | Moradia inexistente (`404`)               |
| `POST /api/moradias`                         | RF002, RF003               | RN05, RN08             | Moradia cadastrada (`201`)                       | Dados estruturais inválidos (`400`)               | Localização não confirmada ou situação inválida (`400`)            | —                                         |
| `GET /api/moradias/:id`                      | RF002, RF005               | RN11                   | Moradia encontrada (`200`)                       | ID inválido (`400`)                               | —                                                                  | Moradia inexistente (`404`)               |
| `PUT /api/moradias/:id`                      | RF003, RF012, RF015, RF019 | RN05, RN08, RN09, RN10 | Moradia atualizada (`200`)                       | Payload inválido (`400`)                          | Situação operacional inválida ou atualização incompatível (`400`)  | Moradia inexistente (`404`)               |
| `SOFT DELETE /api/moradias/:id`                   | RF009                      | RN06                   | Moradia arquivada (`204`)                        | ID inválido (`400`)                               | Violação das regras de arquivamento lógico (`409`)                 | Moradia inexistente (`404`)               |
| `GET /api/moradias/:id/detalhes`             | RF005                      | RN11                   | Dados consolidados retornados (`200`)            | ID inválido (`400`)                               | Inconsistência de dados agregados (`500` controlado)               | Moradia inexistente (`404`)               |
| `GET /api/mapa/moradias`                     | RF004                      | RN08, RN11             | Marcadores carregados (`200`)                    | Parâmetros inválidos (`400`)                      | Dados inconsistentes com base oficial (`400`)                      | —                                         |
| `GET /api/mapa/calor`                        | RF008                      | RN04, RN11             | Heatmap gerado (`200`)                           | Filtro inválido (`400`)                           | Grupo de vulnerabilidade inexistente (`400`)                       | —                                         |
| `POST /api/pets`                             | RF007                      | RN12                   | Pet cadastrado (`201`)                           | Dados obrigatórios inválidos (`400`)              | Vínculo incompatível com família (`400`)                           | Família inexistente (`404`)               |
| `PUT /api/pets/:id`                          | RF007, RF019               | RN12                   | Pet atualizado (`200`)                           | Payload inválido (`400`)                          | Violação do vínculo familiar (`400`)                               | Pet inexistente (`404`)                   |
| `SOFT DELETE /api/pets/:id`                       | RF007                      | RN12                   | Pet removido (`204`)                             | ID inválido (`400`)                               | Restrição de remoção (`409`)                                       | Pet inexistente (`404`)                   |
| `POST /api/moradias/:id/fotos`               | RF002, RF018               | RN07                   | Foto vinculada à moradia (`201`)                 | Tipo ou tamanho inválido (`400`)                  | Tentativa de cadastro de foto proibida pela LGPD (`400`)           | Moradia inexistente (`404`)               |
| `POST /api/pets/:id/fotos`                   | RF007, RF018               | RN12                   | Foto vinculada ao pet (`201`)                    | Tipo ou tamanho inválido (`400`)                  | Violação das regras de associação (`400`)                          | Pet inexistente (`404`)                   |
| `POST /api/moradias/:id/fotos/upload-url`    | RF018                      | RN07                   | URL de upload gerada (`201`)                     | Arquivo inválido (`400`)                          | Falha controlada de armazenamento (`502`)                          | Moradia inexistente (`404`)               |
| `POST /api/pets/:id/fotos/upload-url`        | RF018                      | RN12                   | URL de upload gerada (`201`)                     | Arquivo inválido (`400`)                          | Falha controlada de armazenamento (`502`)                          | Pet inexistente (`404`)                   |
| `GET /api/fotos/:id/signed-url`              | RF018                      | RN07                   | URL assinada gerada (`200`)                      | Identificador inválido (`400`)                    | Falha controlada de armazenamento (`502`)                          | Foto inexistente (`404`)                  |

- **OBS:** alguns endpoints terão aplicações das validações, requisitos e funções somente na próxima Sprint: GET /api/mapa/moradias ; GET /api/mapa/calor ; (validações): PUT /api/pessoas/:id ; PUT /api/pessoas/:id.

#### 5.1.3.2 Critérios de Implementação dos Testes

Os testes de integração devem ser implementados exercitando a aplicação Express a partir de requisições HTTP, preferencialmente com Supertest. A suíte deve validar:

* código de status retornado;
* formato padrão de erro `{ "error": "mensagem" }`;
* presença dos campos principais no corpo de resposta;
* comportamento com payload válido;
* comportamento com payload inválido;
* comportamento com IDs inexistentes;
* comportamento diante de conflitos ou regras de negócio rejeitadas.

Como os testes de integração dependem da API montada, recomenda-se criar uma suíte separada, por exemplo:

```txt
src/geoRisco/src/tests/endpoints.integration.test.ts

```

Também será necessário adicionar as dependências de teste HTTP, caso ainda não estejam instaladas:

```
npm install --save-dev supertest @types/supertest
```

#### 5.1.3.3 Resultado Esperado

A execução da suíte de testes de integração deve demonstrar que todos os endpoints principais da API possuem cobertura para os cenários de sucesso, validação, conflito de negócio e recurso inexistente, garantindo rastreabilidade entre RFs, RNs, endpoints e casos de teste. Dessa forma, os contratos HTTP documentados permanecem alinhados ao comportamento real da aplicação, reduzindo riscos de regressão e aumentando a confiabilidade da solução.


### 5.1.4 Evidências de Execução

As evidências abaixo foram obtidas a partir da execução da suíte automatizada da WebAPI com Jest, TypeScript e Supertest. Os testes estão versionados no repositório na pasta `src/geoRisco/src/tests`, seguindo a nomenclatura `*.service.test.ts` para testes unitários de Service e `api.controller.test.ts` para os testes de integração dos endpoints.

#### 5.1.4.1 Execução da suíte automatizada

Comando executado:

```bash
npm test -- --no-cache
```

Resultado observado:

```txt
Test Suites: 7 passed, 7 total
Tests:       65 passed, 65 total
Snapshots:   0 total
```

Arquivos de teste executados:

| Arquivo | Camada | Tipo |
|---|---|---|
| `src/geoRisco/src/tests/pessoa.service.test.ts` | Service | Unitário white-box |
| `src/geoRisco/src/tests/familia.service.test.ts` | Service | Unitário white-box |
| `src/geoRisco/src/tests/moradia.service.test.ts` | Service | Unitário white-box |
| `src/geoRisco/src/tests/pet.service.test.ts` | Service | Unitário white-box |
| `src/geoRisco/src/tests/foto.service.test.ts` | Service | Unitário white-box |
| `src/geoRisco/src/tests/foto-storage.service.test.ts` | Service | Unitário white-box |
| `src/geoRisco/src/tests/api.controller.test.ts` | Controller/Endpoint | Integração black-box via Supertest |

#### 5.1.4.2 Relatório de cobertura

Comando executado:

```bash
npm test -- --coverage
```

Resultado observado:

```txt
Test Suites: 7 passed, 7 total
Tests:       65 passed, 65 total
Snapshots:   0 total
```

Resumo de cobertura por camada:

| Camada | % Statements | % Branch | % Functions | % Lines |
|---|---:|---:|---:|---:|
| Controllers | 87.81 | 64.01 | 96.70 | 87.81 |
| Services | 93.16 | 82.65 | 95.23 | 93.16 |
| Validations | 61.30 | 67.07 | 74.07 | 61.67 |
| Models | 92.85 | 100.00 | 100.00 | 92.85 |
| Projeto completo | 55.57 | 48.52 | 66.01 | 57.78 |

Cobertura individual dos Services:

| Arquivo | % Statements | % Branch | % Functions | % Lines |
|---|---:|---:|---:|---:|
| `familia.service.ts` | 96.62 | 79.31 | 100.00 | 96.62 |
| `foto-storage.service.ts` | 93.93 | 82.35 | 100.00 | 93.93 |
| `foto.service.ts` | 88.46 | 80.00 | 92.30 | 88.46 |
| `moradia.service.ts` | 100.00 | 90.00 | 100.00 | 100.00 |
| `pessoa.service.ts` | 81.35 | 80.55 | 84.61 | 81.35 |
| `pet.service.ts` | 100.00 | 100.00 | 100.00 | 100.00 |

Assim, a camada Service atende ao critério mínimo de 80% de cobertura, tanto no agregado da camada quanto nos arquivos individuais de Service.

#### 5.1.4.3 Mapeamento CT -> RN -> RF

| Caso | RN | RF relacionado | Evidência automatizada |
|---|---|---|---|
| CT01 | RN02 | RF014 | `familia.service.test.ts` — `it('CT01')` valida que a família já possui responsável ativo; `vincularPessoa` lança `HttpError 409`. |
| CT02 | RN01 | RF014 | `familia.service.test.ts` — `it('CT02')` valida que a pessoa com parentesco Responsável deve ter os dados de responsável preenchidos em `pessoa`; lança `HttpError 400`. |
| CT03 | RN06 | RF009 / RF010 | `familia.service.test.ts` e `moradia.service.test.ts` validam soft delete: `delete` chamado para entidade existente, `HttpError 404` para entidade inexistente. |
| CT04 | RN05 | RF002 / RF003 | `moradia.service.test.ts` — cadastro transacional com localização: `COMMIT` no caminho feliz e `ROLLBACK` quando moradia não é encontrada após criação. |
| CT05 | RN05 | RF005 | `moradia.service.test.ts` — `it('CT05')` valida árvore consolidada de `getDetalhes`: verifica `familias[0].pessoas` e `fotos`; `HttpError 500` quando dependências não estão configuradas. |





#### 5.1.4.4 Evidência dos testes de endpoints

A suíte `api.controller.test.ts` executa requisições HTTP com Supertest contra uma aplicação Express montada em ambiente controlado, usando controllers reais e services mockados. A suíte cobre os principais contratos HTTP implementados para:

| Grupo de endpoints | Exemplos cobertos | Cenários verificados |
|---|---|---|
| Pessoas e responsáveis | `/api/pessoas`, `/api/pessoas/:id`, `/api/pessoas/busca`, `/api/responsaveis` | Sucesso, validação `400`, conflito/regra de negócio e `404` |
| Famílias e vínculos | `/api/familias`, `/api/familias/nucleo`, `/api/familias/:id/pessoas`, `/api/familias/:id/moradias` | Sucesso, validação `400`, conflito `409` e `404` |
| Moradias | `/api/moradias`, `/api/moradias/:id`, `/api/moradias/:id/detalhes` | Sucesso, validação `400`, erro controlado e `404` |
| Pets | `/api/pets`, `/api/pets/:id`, `/api/familias/:id/pets` | Sucesso, validação `400`, conflito/regra de negócio e `404` |
| Fotos e storage | `/api/fotos`, `/api/moradias/:id/fotos`, `/api/pets/:id/fotos`, `/upload-url`, `/signed-url` | Sucesso, validação `400`, falha externa controlada `502` e `404` |

Os endpoints planejados que ainda não existem no backend atual, como `/api/mapa/moradias` e `/api/mapa/calor`, permanecem registrados na matriz como cobertura futura.

##### Validação de payload e efeitos observáveis

Além dos códigos de status, a suíte verifica campos específicos do corpo da resposta e efeitos observáveis. Exemplos representativos:

| Endpoint | Cenário | O que é verificado além do status |
|---|---|---|
| `POST /api/pessoas` | Sucesso | Corpo retorna `{ id, nome }`; `service.cadastrar` foi chamado exatamente uma vez com o payload correto |
| `POST /api/pessoas` | Validação | `nome` vazio não chega ao service (`cadastrar` não é chamado) |
| `POST /api/pessoas` | Regra violada | Corpo retorna `{ error: 'CPF já cadastrado' }` com status `409` |
| `GET /api/pessoas/:id` | Sucesso | Corpo retorna exatamente `{ id: 1, nome: 'Ana' }` — estrutura completa validada |
| `GET /api/pessoas/:id` | ID inválido | Corpo retorna `{ error: 'ID inválido' }` — formato padrão de erro validado |
| `GET /api/pessoas` | Sucesso | Corpo retorna array `[{ id: 1, nome: 'Ana' }]` — estrutura de lista validada |
| `GET /api/pessoas/busca` | Sucesso | Corpo retorna `[{ id: 2, nome: 'Bia' }]` — busca retorna somente correspondentes |
| `DELETE /api/pessoas/:id` | Sucesso | Status `204` sem corpo; `service.remover` foi chamado |
| `GET /api/responsaveis` | Sucesso | Corpo retorna `[{ id, idPessoa }]` — estrutura de responsável validada |

Para efeitos observáveis, a suíte verifica que o método mockado do service foi chamado com os argumentos corretos (`toHaveBeenCalledWith`), confirmando que o controller passou o payload adiante sem corrupção, e que chamadas inválidas não chegam ao service (`toHaveBeenCalledTimes(0)` após validação rejeitada).


## 5.2. Testes de usabilidade

### 5.2.1. Relatório de testes de guerrilha

#### 1. O que foi feito

Foram realizados testes de usabilidade no formato **guerrilla testing** (testes rápidos, informais, com participantes recrutados no momento, fora de um laboratório controlado) com o protótipo do sistema **GeoRisco Santo André**, voltado ao cadastro e à visualização de moradias, famílias e riscos em campo.

- **Data:** 17/06/2026
- **Participantes:** 8 pessoas (codificadas como P01 a P08)
- **Moderadores:** 5 pessoas diferentes (Daniel Hamoui, Luiza Cardoso, Lucas, Vitor Goia e Arthur), cada uma conduzindo sessões com parte da amostra
- **Perfis simulados:** a maioria dos participantes assumiu o perfil de **agente de campo (João)**, da Defesa Civil, com alta familiaridade com sistemas digitais; em alguns formulários esse perfil não foi registrado explicitamente
- **Tarefas testadas:** 5 tarefas centrais do fluxo do sistema (cadastro de moradia, cadastro de responsável e morador, inclusão de novos moradores, busca de família e visualização no mapa georreferenciado)

Cada participante executou as tarefas enquanto um moderador observava e registrava, etapa por etapa, se houve sucesso, dificuldade ou abandono — e, ao final, todos os moderadores preencheram um formulário padronizado com essas observações.

#### 2. O que é cada planilha

Duas planilhas dão suporte a este relatório, e ambas estão linkadas como evidência bruta do processo:

##### 2.1 Respostas do formulário de testes
🔗 [Acessar planilha](https://docs.google.com/spreadsheets/d/1_YkkN8Hb35cVR4VDSEwGBEdQtqU57sx7I-pnvt_9EFY/edit?usp=sharing)

É a planilha **gerada automaticamente pelas respostas do formulário** que cada moderador preencheu durante/após cada sessão. Contém o registro primário e não tratado: uma linha por sessão, com campos como participante, tarefa, tempo de execução, sucesso/fracasso por etapa e comentários livres do moderador. É a fonte de dados original — qualquer divergência de interpretação deve ser checada aqui.

##### 2.2 Planilha de testes de usabilidade preenchida
🔗 [Acessar planilha](https://docs.google.com/spreadsheets/d/116teBzb_B4RqFABgO4sRbahugusNzhGRSA7o4lAzssI/edit?usp=sharing)

É a **tabulação/consolidação** desses dados brutos no template de relatório do grupo, organizada para leitura humana. Tem duas abas:

- **"Registro dos testes"**: uma tabela por tarefa, com o enunciado do cenário, a expectativa de fluxo ideal, as 4 etapas avaliadas, a(s) heurística(s) de Nielsen relacionadas, e uma linha por participante mostrando o resultado geral (concluiu / não concluiu, com tempo) e o que ocorreu em cada etapa.
- **"Ocorrências"**: a lista de problemas e oportunidades de melhoria extraídos das observações, **priorizada por severidade** (cosmética, baixa, alta, catástrofe — escala adaptada de Nielsen), indicando em quais tarefas ocorreram, quais participantes relataram cada problema e a ação recomendada para corrigir.

Em resumo: a planilha de **respostas do formulário** é o dado cru; a planilha **preenchida/tabulada** é a análise organizada a partir desse dado, que serve de base para as conclusões do relatório.

#### 3. Principais achados (resumo)

- **Problema mais crítico (severidade catastrófica):** falha na captura automática de coordenadas GPS a partir do endereço digitado e falta de clareza na confirmação da posição no mini-mapa — relatado por 4 dos 8 participantes (P02, P05, P06, P07) e responsável pela única tarefa não concluída por erro de sistema.
- **Mensagens de erro genéricas:** ao menos um cadastro falhou ao salvar sem indicar qual campo causou o problema, impedindo a conclusão da tarefa.
- **Padrões recorrentes de severidade alta:** campos obrigatórios sem sinalização visual, autocomplete de CEP pouco confiável, identificação genérica de registros nas listas (ex. "moradia #1" em vez do nome do responsável), e dificuldade de orientação dentro do mapa georreferenciado.
- **Pontos positivos:** tarefas de busca e visualização no mapa foram, em geral, bem avaliadas e consideradas intuitivas pela maioria dos participantes.

#### 4. Limitações do protocolo de teste

- Nenhum participante simulou explicitamente o perfil de **gestor operacional**, previsto no enunciado das Tarefas 4 e 5 — todos testaram a partir da perspectiva de agente de campo ou sem perfil declarado. Recomenda-se uma rodada futura cobrindo esse perfil.
- Por se tratar de guerrilla testing, as sessões ocorreram em ambientes não controlados, o que pode ter introduzido variação nos tempos registrados.
- A Tarefa 3 teve um caso de abandono (P03) sem detalhamento da etapa exata da interrupção, registrado como ponto de atenção para nova observação direcionada.

#### 5. Como navegar os links

1. **Respostas do formulário de testes** ([link](https://docs.google.com/spreadsheets/d/1_YkkN8Hb35cVR4VDSEwGBEdQtqU57sx7I-pnvt_9EFY/edit?usp=sharing)) → consulte se quiser verificar a fonte primária de uma observação específica ou auditar um dado da tabulação.
2. **Planilha de testes preenchida** ([link](https://docs.google.com/spreadsheets/d/116teBzb_B4RqFABgO4sRbahugusNzhGRSA7o4lAzssI/edit?usp=sharing)) → use como referência principal de leitura: aba "Registro dos testes" para o detalhe por tarefa/participante, e aba "Ocorrências" para a lista priorizada de melhorias que deve orientar o backlog de correções.

### 5.2.2. Relatório de Testes SUS (System Usability Scale)

A avaliação da experiência do usuário foi complementada pela aplicação da metodologia **SUS (System Usability Scale)**, instrumento padronizado de 10 itens, respondidos em escala Likert de 1 a 5, que mensura a percepção subjetiva de usabilidade de um sistema. A aplicação do questionário teve como objetivo validar, de forma quantitativa, se a interface atende aos requisitos de intuitividade, eficiência e confiabilidade esperados pelos agentes de campo da Defesa Civil de Santo André durante o uso em condições operacionais reais.

#### 5.2.2.1. Tabela de Respostas e Cálculo

A tabela a seguir consolida as respostas individuais coletadas nas sessões de teste realizadas em 17/06/2026. O cálculo da pontuação SUS (0 a 100) seguiu o procedimento padrão de Brooke (1986): para os itens de numeração ímpar, subtrai-se 1 do valor respondido; para os itens de numeração par, subtrai-se o valor respondido de 5. A soma das dez contribuições é então multiplicada por 2,5, gerando a pontuação final do participante.

| Participante    | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10 | Pontuação SUS |
| --------------- | -- | -- | -- | -- | -- | -- | -- | -- | -- | --- | ------------- |
| P01             | 5  | 4  | 4  | 2  | 5  | 1  | 4  | 1  | 5  | 1   | **85,0**      |
| P03             | 4  | 2  | 5  | 3  | 4  | 2  | 5  | 1  | 5  | 2   | **82,5**      |
| P06             | 5  | 2  | 4  | 2  | 5  | 2  | 5  | 2  | 4  | 2   | **82,5**      |
| P08             | 5  | 2  | 5  | 2  | 5  | 1  | 5  | 1  | 5  | 1   | **95,0**      |
| **Média Geral** | -  | -  | -  | -  | -  | -  | -  | -  | -  | -   | **86,25**     |

> **Nota:** Os participantes P02, P04, P05 e P07 foram excluídos da amostra quantitativa por apresentarem questionários SUS incompletos (um ou mais itens não respondidos), o que impede o cálculo correto da pontuação conforme o instrumento original. A exclusão seguiu um critério único e aplicado de forma consistente a toda a amostra, preservando a validade estatística do resultado consolidado. Os relatos qualitativos desses participantes, no entanto, foram preservados e incorporados à síntese da seção 5.2.2.2, uma vez que agregam informação relevante mesmo na ausência de pontuação numérica.

#### 5.2.2.2. Síntese Qualitativa

As percepções qualitativas coletadas durante e após a aplicação do questionário SUS reforçam e contextualizam os dados quantitativos obtidos.

#### 5.2.2.3. Pontos Fortes

O preenchimento automático de endereço via CEP e a captura automática de geolocalização foram os recursos mais citados como geradores de satisfação, sendo descritos pelos participantes como facilitadores diretos da agilidade de cadastro em campo. O mapa de calor e a sinalização visual de moradias de risco também receberam destaque espontâneo como diferenciais da interface.

#### 5.2.2.4. Oportunidades de Melhoria

A crítica mais recorrente recai sobre a transparência do sistema diante de erros de validação, como o caso de e-mail duplicado, em que a mensagem retornada não especifica a causa da falha, e sobre a ausência de sinalização clara de campos obrigatórios em formulários mais extensos, como o de cadastro de pets.

Houve convergência entre participantes distintos quanto à necessidade de tornar o responsável legal mais visível diretamente nos resultados de busca por moradia, reduzindo a quantidade de cliques necessários para essa identificação.

#### 5.2.2.5. Conclusão da Avaliação

Com uma média consolidada de **86,25 pontos** entre os participantes com questionários válidos, a solução posiciona-se no nível **"Bom"** da escala de usabilidade SUS, superando com margem confortável o benchmark de referência de **80,3** e aproximando-se do limiar de **90,9** associado à classificação **"Excelente"**.

O resultado indica uma alta taxa de aceitação da interface e uma curva de aprendizado favorável junto ao público-alvo, mesmo entre participantes com diferentes graus de familiaridade prévia com sistemas digitais. As dificuldades pontuais observadas, sobretudo as relacionadas a mensagens de erro pouco descritivas e à ausência de indicação de campos obrigatórios, não comprometeram a percepção geral de usabilidade, mas representam oportunidades concretas de refinamento.

A correção desses pontos específicos tende a elevar a pontuação média para a faixa **"Excelente"**, consolidando o padrão de confiabilidade exigido para uma ferramenta utilizada em contexto de operações de risco pela Defesa Civil.



# <a name="c6"></a>6. Estudo de Mercado e Plano de Marketing (sprint 4)

## 6.1. Resumo Executivo

O GeoRisco Santo André é uma aplicação web desenvolvida em parceria com a Defesa Civil do município para apoiar a gestão georreferenciada de populações em áreas de risco. A solução substitui processos analógicos, fragmentados e baseados em planilhas físicas por uma plataforma digital integrada, que permite ao agente de campo cadastrar moradias, núcleos familiares, vulnerabilidades e animais de estimação, e oferece à sede um painel geolocalizado para tomada de decisão estratégica em tempo real.

O projeto está inserido no setor GovTech, segmento em expansão no Brasil, onde o setor público responde por cerca de 12% do PIB e enfrenta forte demanda por modernização. Marcos regulatórios como a Lei nº 12.608/2012, que institui a Política Nacional de Proteção e Defesa Civil, e a LGPD (Lei nº 13.709/2018) reforçam a necessidade de cadastros atualizados, rastreáveis e seguros. Santo André concentra 28 áreas de risco e 3.803 edificações classificadas como risco alto e muito alto (R3/R4), cenário identificado como replicável em centenas de municípios brasileiros monitorados pelo CEMADEN, com potencial inicial de expansão para o ABC Paulista e demais coordenadorias municipais de Defesa Civil.

A aplicação combina geolocalização multimodal — CEP, coordenadas GPS, referências geográficas e fotos do imóvel — com visualização em mapa e filtros por vulnerabilidade e densidade populacional. O modelo B2G adotado prioriza impacto social, conformidade com a LGPD e adequação ao contexto operacional real do agente de campo.

São identificados como objetivos estratégicos: reduzir o tempo crítico de coleta para menos de cinco minutos por moradia; eliminar lacunas operacionais entre evacuação e abrigo; oferecer visão estratégica em tempo real para alocação de recursos; e consolidar uma base íntegra que fortaleça a resiliência urbana de Santo André e sirva de referência para replicação em outros municípios.

## 6.2. Análise de Mercado

### 6.2.1 Visão Geral do Setor 

O GeoRisco Santo André está inserido no setor de GovTech, que corresponde a um conjunto de soluções tecnológicas desenvolvidas por empresas privadas para modernizar a gestão pública e aprimorar a prestação de serviços à população.

O setor surge da convergência entre a aceleração digital da sociedade e a defasagem histórica dos sistemas públicos, que ainda operam em grande parte com processos analógicos, fragmentados e pouco escaláveis (REF.9). À medida que governos enfrentam demandas crescentes por eficiência, transparência e sustentabilidade, o GovTech se consolida como resposta estrutural, oferecendo ferramentas que automatizam processos, reduzem custos operacionais e reconstroem a confiança pública.

No Brasil, o contexto é especialmente favorável. O setor público é o maior comprador de produtos e serviços do país, respondendo por cerca de 12% do PIB brasileiro (REF.4), o que cria uma demanda estrutural contínua por soluções tecnológicas. Do ponto de vista regulatório, dois marcos legais moldam diretamente o segmento de GovTech voltado à gestão de riscos: a Lei nº 12.608/2012, que institui a Política Nacional de Proteção e Defesa Civil e exige cadastros atualizados de populações vulneráveis, e a LGPD (Lei nº 13.709/2018), que impõe requisitos de rastreabilidade e proteção de dados sensíveis coletados em campo (REF.10).

É nesse cenário que soluções como o GeoRisco encontram espaço: endereçando lacunas operacionais reais em municípios que carecem de sistemas digitais integrados para gestão de risco.

Fontes (seção 9): (REF.4, REF.9, REF.10).

### 6.2.2 Tamanho e Crescimento de Mercado

O mercado relacionado ao GeoRisco Santo André está inserido no segmento de softwares de gestão de emergências, segurança pública e gerenciamento de crises, que apresenta forte expansão impulsionada pela digitalização dos serviços públicos, aumento da frequência de eventos climáticos extremos e necessidade de respostas mais rápidas e integradas.

O mercado global de **Emergency Management Software (software de gestão de emergências)** foi estimado entre US$ 420 milhões e US$ 450 milhões em 2025/2026, com projeções de alcançar aproximadamente US$ 1,1 bilhão até 2035, representando uma taxa média de crescimento anual (CAGR) de 11,3% (REF.6). Esse crescimento é impulsionado pela adoção de soluções baseadas em nuvem, integração de dados geoespaciais e uso de inteligência artificial para monitoramento e resposta a desastres.

Em uma visão mais ampla, o mercado global de **software para segurança pública**, que engloba plataformas de gestão de incidentes, monitoramento em tempo real e coordenação de emergências, movimentou cerca de US$ 11,48 bilhões em 2025 e possui previsão de atingir US$ 24,23 bilhões até 2034, com crescimento anual médio de 9,2% (REF.7).

Além disso, o mercado de softwares de gestão de emergências está diretamente relacionado à continuidade operacional e resposta a eventos críticos, foi avaliado em US$ 143,97 bilhões em 2025 e deverá alcançar US$ 310,12 bilhões em 2034, mantendo CAGR de 8,9% (REF.8).

No contexto nacional, o Brasil conta com 1.295 municípios monitorados pelo CEMADEN em situação de risco geológico e hidrológico, dos quais a maioria carece de sistemas digitais de cadastro e georreferenciamento adequados. Segundo dados da Confederação Nacional de Municípios (CNM), mais de 60% dos municípios brasileiros que registraram decretações de situação de emergência entre 2013 e 2023 não dispõem de plataformas integradas de gestão de risco, operando com registros físicos ou planilhas descentralizadas. Esse cenário configura uma demanda reprimida expressiva no mercado nacional, particularmente em municípios de porte médio como Santo André, onde a digitalização da Defesa Civil representa tanto uma exigência regulatória quanto uma necessidade operacional imediata.

Esses indicadores demonstram um **mercado em expansão consistente**, favorecido pelo aumento dos investimentos governamentais em resiliência urbana, proteção civil e gestão inteligente de riscos.

Fontes (seção 9): (REF.6, REF.7, REF.8).

### 6.2.3 Tendências de Mercado
Três eixos de tendências convergem para ampliar a relevância e a adoção do GeoRisco Santo André nos próximos anos.

**Tendências Tecnológicas**
A consolidação das plataformas de Government as a Service (GaaS) e a adoção crescente de infraestrutura em nuvem pelo setor público brasileiro criam condições favoráveis para soluções SaaS B2G de baixo custo de implantação (REF.11). O avanço das APIs de geolocalização, como Google Maps Platform e OpenStreetMap, e a popularização de bibliotecas de mapas interativos (Leaflet, Mapbox) reduzem significativamente a barreira técnica para desenvolvimento de sistemas georreferenciados. Paralelamente, o crescimento do uso de dispositivos móveis por servidores públicos em campo impulsiona a demanda por aplicações mobile-first, exatamente o modelo adotado pelo GeoRisco. Essas condições tecnológicas tornam viável a implantação do GeoRisco sem infraestrutura própria de TI pelo município, com acesso imediato via navegador e dados centralizados em nuvem.

**Tendências Comportamentais**
A digitalização acelerada dos processos públicos pós-pandemia gerou maior receptividade de gestores municipais a ferramentas digitais integradas (REF.12). Há também uma mudança de postura institucional: municípios deixam de reagir a desastres e passam a investir em prevenção e mapeamento contínuo de risco, o que aumenta a demanda por cadastros georreferenciados permanentes, e não apenas emergenciais. Essa inversão de modelo — do reativo para o preventivo — é exatamente o cenário para o qual o GeoRisco foi projetado: permitir que a Defesa Civil mantenha bases cadastrais atualizadas continuamente, e não apenas durante crises.

**Tendências Mercadológicas**
O mercado GovTech brasileiro está em expansão. Segundo o relatório GovTech Brasil 2023, elaborado pela Abstartups em parceria com o Sebrae, o ecossistema conta com mais de 800 startups ativas no setor público (REF.9). O volume de contratações públicas de tecnologia cresce em função da Lei nº 14.133/2021 (Nova Lei de Licitações), que simplifica processos para soluções inovadoras (REF.13). Além disso, o CEMADEN monitora atualmente 1.295 municípios brasileiros em situação de risco, configurando um mercado endereçável expressivo para replicação da solução além de Santo André. Para o GeoRisco, esse contexto representa uma janela de expansão: uma solução validada em Santo André pode ser adotada por outros municípios monitorados pelo CEMADEN com necessidades operacionais equivalentes, aproveitando o arcabouço da Nova Lei de Licitações para simplificar a contratação.

Fontes (seção 9): (REF.9, REF.10, REF.11, REF.12, REF.13).
A segmentação de mercado da aplicação foi definida a partir do setor público de proteção e defesa civil, com foco em instituições responsáveis pela prevenção, preparação, resposta e recuperação em situações de risco e desastre. O segmento prioritário é composto pela Defesa Civil de Santo André, especialmente pelos agentes de campo e gestores operacionais que atuam no cadastramento, monitoramento e atendimento de famílias residentes em áreas suscetíveis a deslizamentos, enchentes e outros eventos adversos associados a desastres geo-hidrológicos.

Também foi identificado como segmento relevante o conjunto de prefeituras e coordenadorias municipais de Defesa Civil que enfrentam desafios semelhantes, principalmente em municípios com áreas de risco, ocupações vulneráveis e necessidade de atualização constante de dados territoriais e sociodemográficos. Nesses contextos, a aplicação pode ser utilizada como ferramenta de apoio à digitalização de cadastros, ao georreferenciamento de moradias e à priorização de atendimentos em situações emergenciais.

Além disso, a solução pode atender secretarias municipais que atuam de forma integrada com a Defesa Civil, como Habitação, Assistência Social, Saúde, Meio Ambiente e Desenvolvimento Urbano. Esses órgãos dependem de informações confiáveis sobre famílias, moradias, vulnerabilidades, localização e histórico de ocupação para planejar políticas públicas, definir prioridades e coordenar ações preventivas.

Dessa forma, concluiu-se que a aplicação está direcionada principalmente ao mercado institucional govtech, com foco em gestão pública de riscos, resiliência urbana e proteção de populações vulneráveis. Seu potencial de uso concentra-se em órgãos públicos municipais que necessitam substituir processos manuais e descentralizados por uma solução digital, integrada e adaptada ao trabalho em campo.

Fontes (seção 9): (REF.14, REF.15, REF.16, REF.17, REF.18).

### 6.3.2. Perfil do Público-Alvo

O público-alvo do GeoRisco é composto pelos profissionais da Defesa Civil de Santo André responsáveis pela coleta, gestão e análise de informações sobre moradores e áreas de risco do município.

Os Agentes de Defesa Civil, que atuam em campo, são predominantemente adultos entre 25 e 50 anos, com escolaridade mínima de ensino médio completo e formação técnica ou em áreas afins à proteção e defesa civil. Apresentam níveis de familiaridade com tecnologias digitais que variam de baixa a média, com uso habitual de smartphones para comunicação e registro fotográfico. Sua rotina envolve visitas domiciliares, vistorias e coleta de dados em locais muitas vezes de difícil acesso e com limitações de conectividade. Seu comportamento é marcado pela necessidade de mobilidade, agilidade e adaptação a diferentes cenários. Entre suas principais necessidades estão o registro rápido e confiável das informações e a consulta e atualização de dados em campo. Suas principais dores incluem retrabalho, perda de informações, duplicidade de registros e dificuldades de localização de moradias.

Os Gestores Operacionais, por sua vez, são predominantemente adultos entre 35 e 55 anos, com nível superior em áreas como administração pública, engenharia civil, geografia ou áreas correlatas, e atuação em cargos de coordenação ou chefia dentro da Defesa Civil municipal. Utilizam computadores para monitorar informações, analisar riscos e apoiar a tomada de decisões. Necessitam de dados consolidados, atualizados e confiáveis para planejar evacuações, direcionar recursos e acompanhar populações vulneráveis. Suas principais dores estão relacionadas à falta de informações integradas e à dificuldade de obter uma visão abrangente dos riscos do município.

Como expectativa comum, ambos os perfis buscam maior precisão, integridade e segurança dos dados, além de processos mais eficientes que apoiem respostas rápidas e assertivas em situações de risco.

Fontes (seção 9): (REF.3, REF.4, REF.16, REF.17, REF.18, REF.19).
### 6.4.1 Proposta de Valor

O GeoRisco Santo André entrega valor ao permitir que a Defesa Civil registre, organize e consulte informações de famílias e moradias em áreas de risco de forma centralizada, georreferenciada e rastreável. A aplicação foi concebida para substituir formulários físicos, planilhas dispersas e registros fragmentados por uma base digital integrada, facilitando o trabalho dos agentes de campo e apoiando decisões operacionais da sede.

Identificou-se que o principal ganho da solução está na transformação de dados territoriais e socioestruturais em informações acionáveis. Por meio do cadastro de moradores, responsáveis familiares, vulnerabilidades, pets, fotos e localização, torna-se possível visualizar onde estão as famílias expostas ao risco, quais grupos demandam prioridade e quais áreas exigem maior atenção em ações preventivas ou emergenciais.

Dessa forma, a aplicação contribui para reduzir retrabalho, minimizar perda de informações, acelerar consultas e melhorar a alocação de recursos em situações críticas. Concluiu-se que o valor central do GeoRisco está em fortalecer a capacidade de resposta e planejamento da Defesa Civil, oferecendo uma ferramenta adequada à rotina pública municipal e orientada à proteção de populações vulneráveis.

### 6.4.2 Posicionamento e Diferenciação

A diferenciação do GeoRisco Santo André está em sua adaptação direta à rotina da Defesa Civil municipal, e não na digitalização genérica de cadastros. As alternativas disponíveis atendem partes do processo, mas nenhuma oferece a integração completa exigida pelo trabalho de campo: o S2iD (Sistema Integrado de Informações sobre Desastres), plataforma federal de declaração de emergências, é voltado ao registro oficial de eventos e não ao cadastramento contínuo de famílias e moradias em campo; o QGIS e demais ferramentas de geoprocessamento oferecem visualização territorial avançada, mas exigem expertise técnica de SIG e não têm interface adaptada ao agente em campo sem formação técnica; planilhas e formulários físicos, ainda amplamente utilizados em municípios de porte médio, carecem de integração, rastreabilidade e centralização. O GeoRisco, ao contrário, foi projetado a partir das necessidades reais da Defesa Civil de Santo André: integra em uma única aplicação o cadastro de moradias, famílias, moradores, responsáveis, pets, fotos, coordenadas geográficas, histórico de ocupação e consulta territorial, com linguagem institucional, interface objetiva e conformidade com a LGPD.

Essa integração posiciona a solução como uma ferramenta operacional de gestão pública de risco, capaz de apoiar tanto o agente em campo quanto o gestor na sede. Em vez de competir por apelo comercial, o GeoRisco se destaca pela legitimidade pública, pela aderência ao serviço essencial prestado e pela capacidade de transformar dados territoriais em decisões rápidas, seguras e justificáveis.
## 6.5. Business Model Canvas
O Business Model Canvas do GeoRisco Santo André reflete o posicionamento estratégico de uma solução sem fins lucrativos orientada ao impacto social e à eficiência operacional pública. O segmento de clientes concentra-se em dois perfis internos da Defesa Civil — agente de campo e gestor operacional —, atendidos por uma proposta de valor centrada na rastreabilidade territorial, no apoio à tomada de decisão em emergências e na interface adaptada ao trabalho em campo. As atividades-chave do projeto envolvem o gerenciamento integrado de cadastros de pessoas, famílias e moradias, com sincronização de dados georreferenciados. Os recursos-chave são a base de dados íntegra hospedada em nuvem, o repositório de código-fonte no GitLab e a equipe multidisciplinar composta por desenvolvedores, analistas de negócios e especialistas da Defesa Civil parceira. A estrutura de custos é restrita à infraestrutura de hospedagem e banco de dados, sem receita comercial — o valor gerado é social e operacional, mensurado pela redução do tempo de coleta em campo e pela qualidade das informações disponíveis para decisão.

Link do arquivo: https://miro.com/app/board/uXjVHLRyshY=/?share_link_id=86927684222

<table width="100%" border="1" cellspacing="0" cellpadding="10" style="border-collapse: collapse; text-align: left; vertical-align: top; font-family: sans-serif;">
<table width="100%" border="1" cellspacing="0" cellpadding="10" style="border-collapse: collapse; text-align: left; vertical-align: top; font-family: sans-serif;">
  <!-- Linha Superior do Canvas -->
  <tr>
    <td rowspan="2" colspan="2" width="20%">
      <strong>🔗 Parcerias Chave</strong><br><br>
      • SIGA<br>
      • IPT (Instituto de Pesquisas Tecnológicas)<br>
      • Órgãos de ajuda humanitária e doações<br>
      • Donos dos abrigos
    </td>
    <td colspan="2" width="20%">
      <strong>⚡ Atividades Chave</strong><br><br>
      • Gerenciamento de dados de pessoas e moradias<br>
      • Controle de moradores e assistidos<br>
      • Sincronização automática de dados
    </td>
    <td rowspan="2" colspan="2" width="20%">
      <strong>💎 Proposta de Valor</strong><br><br>
      • Rastreabilidade atualizada de áreas de maior risco ou vulneráveis<br>
      • Apoio à tomada de decisões estratégicas em situações de emergência<br>
      • Relatórios automáticos e quantificados<br>
      • UI simples<br>
      • Valor social
    </td>
    <td colspan="2" width="20%">
      <strong>❤️ Relacionamento</strong><br><br>
      • Contato contínuo até a entrega do projeto<br>
      • Validações constantes por meio de reuniões<br>
      • Reuniões de validação ao fim de cada Sprint
    </td>
    <td rowspan="2" colspan="2" width="20%">
      <strong>👥 Segmentos de Clientes</strong><br><br>
      • Agente Operacional<br>
      • Gerenciador do Sistema e dos Dados
    </td>
  </tr>
  <!-- Linha Intermediária (Recursos e Canais) -->
  <tr>
    <td colspan="2">
      <strong>🛠️ Recursos Chave</strong><br><br>
      • Base de dados georreferenciada íntegra<br>
      • Servidores em nuvem para armazenamento dos dados<br>
      • Equipe DEV, Negócios e Especialistas da Defesa Civil<br>
      • Repositório com código-fonte no GitLab
    </td>
    <td colspan="2">
      <strong>🚚 Canais</strong><br><br>
      • WebApp responsivo<br>
      • Projeto deployado na Vercel (frontend e backend) com banco/Storage no Supabase<br>
      • Documentação completa no arquivo wad.md no repositório
    </td>
  </tr>
  <!-- Linha Inferior (Financeiro dividido perfeitamente ao meio) -->
  <tr>
    <td colspan="5" width="50%">
      <strong>💰 Estrutura de Custos</strong><br><br>
      • Servidor de deploy do sistema<br>
      • Servidor de base de dados com suporte georreferenciado
    </td>
    <td colspan="5" width="50%">
      <strong>💳 Fontes de Receita</strong><br><br>
      • Valor social (projeto sem fins lucrativos, voltado à Defesa Civil)
    </td>
  </tr>
</table>

## 6.6. Estratégia de Marketing

A estratégia de marketing do GeoRisco Santo André foi estruturada com base no modelo dos 4Ps: Produto/Serviço, Preço, Praça e Promoção. Essa abordagem permite organizar a forma como a aplicação gera valor, como pode ser financiada, por quais canais será disponibilizada e quais estratégias serão usadas para divulgar sua adoção. Como se trata de uma solução GovTech voltada à gestão pública e à Defesa Civil, os 4Ps foram adaptados ao contexto B2G, priorizando impacto social, eficiência operacional e relacionamento institucional.

Em **Produto/Serviço**, são descritas as funcionalidades, benefícios e diferenciais da aplicação. Em **Preço**, apresenta-se o modelo de monetização mais adequado para órgãos públicos e sua justificativa. Em **Praça**, explica-se como a solução será distribuída e entregue aos usuários. Por fim, em **Promoção**, são definidas as estratégias digitais e institucionais para divulgação, aquisição de parceiros e expansão da aplicação para novos contextos municipais.

### 6.6.1. Produto/Serviço

O GeoRisco Santo André é uma aplicação web voltada à gestão de populações em áreas de risco, desenvolvida para apoiar agentes de campo e gestores operacionais da Defesa Civil. A solução permite o cadastro georreferenciado de moradias, famílias, moradores e pets, reunindo informações como endereço, coordenadas, fotos do imóvel, composição familiar, vulnerabilidades e histórico de ocupação. Também oferece consulta integrada de registros, visualização em mapa, filtros por território e apoio à identificação de situações críticas.

O principal benefício da aplicação é centralizar dados antes dispersos em processos manuais, planilhas ou registros fragmentados, aumentando a agilidade, a confiabilidade e a rastreabilidade das informações. Seu diferencial está na adequação ao contexto real da Defesa Civil de Santo André, com foco em tomada de decisão rápida, priorização de grupos vulneráveis, apoio à evacuação e melhoria da gestão de abrigos. Assim, o GeoRisco fortalece a capacidade preventiva e operacional do município diante de eventos climáticos extremos.

### 6.6.2. Preço 

O modelo de precificação proposto é B2G (Business to Government), voltado à contratação por órgãos públicos municipais, sem cobrança direta dos cidadãos ou dos agentes que utilizam a aplicação. A solução pode ser implantada por meio de contratação institucional, contemplando custos relacionados à hospedagem, manutenção, suporte técnico e treinamento dos usuários.

Esse modelo é adequado porque a Defesa Civil presta um serviço público essencial, sem finalidade comercial voltada ao consumidor final. O valor da aplicação está na centralização das informações, na redução de processos manuais, no aumento da eficiência operacional e no apoio à tomada de decisão em situações de risco e emergência.

Por se tratar de uma solução destinada ao setor público, não são definidos valores comerciais específicos nesta etapa. A precificação depende de fatores como porte do município, número de usuários, requisitos técnicos, disponibilidade orçamentária e processos de contratação pública. Dessa forma, a proposta prioriza a definição de um modelo de contratação sustentável e compatível com a realidade da administração pública.

### 6.6.3. Praça

A distribuição do GeoRisco ocorrerá por canais digitais institucionais, com acesso seguro por navegador em celulares, tablets e computadores. A aplicação poderá ser disponibilizada em domínio oficial da Prefeitura ou da Defesa Civil, com perfis de permissão adequados às funções de agentes de campo, gestores e administradores. Dessa forma, o sistema atende tanto ao uso operacional em campo quanto à análise estratégica em ambiente de sede.

A entrega da aplicação pode ser feita por infraestrutura em nuvem ou em ambiente tecnológico definido pelo município, garantindo disponibilidade, armazenamento centralizado e padronização dos dados. Para expansão, os canais de distribuição incluem parcerias com prefeituras, Defesa Civil estadual, consórcios intermunicipais, secretarias de meio ambiente, assistência social e tecnologia. Documentação técnica, manuais digitais, treinamentos online e APIs de integração podem apoiar a implantação em novos contextos, permitindo que a solução seja replicada para outros municípios com necessidades semelhantes.

### 6.6.4. Promoção

A estratégia de promoção do GeoRisco prioriza credibilidade institucional, impacto social e demonstração de resultados, considerando que o público-alvo é composto por órgãos públicos e gestores municipais. Uma página institucional otimizada para SEO poderá divulgar a solução por meio de termos como “gestão de áreas de risco”, “Defesa Civil municipal”, “cadastro georreferenciado” e “gestão de desastres”, facilitando sua descoberta por potenciais interessados.

A divulgação também poderá ocorrer por canais institucionais da Prefeitura, da Defesa Civil e por redes profissionais como o LinkedIn, destacando benefícios como centralização de dados, apoio à evacuação e proteção de populações vulneráveis. O marketing de conteúdo incluirá estudos de caso, vídeos demonstrativos, relatórios de impacto, infográficos e artigos sobre prevenção de desastres e gestão territorial. Além disso, a promoção poderá ser fortalecida por apresentações para prefeituras, participação em eventos de inovação pública, parcerias acadêmicas e divulgação em redes de Defesa Civil. Essas ações contribuem para ampliar a visibilidade da solução, fortalecer sua legitimidade institucional e incentivar sua adoção por outros municípios.

---

# <a name="c7"></a>7. Registro de atualizações (sprint 5)

Início na sprint 2 pois não é possível realizar atualizações na sprint que foi iniciado o projeto;

### Sprint 2
Tivemos alterações nas Personas (ambas), User Stories (todas), RF, RNF e RN. Dado que o escopo do projeto estava confuso para a equipe, para melhor seguimento do projeto foi necessária essa reformulação na documentação.

### Sprint 3

1. 19/05/2026 - Davi Viana Tricarico - Seção 3.3 Wireframes: Ajuste na documentação e nos próprios wireframes de cadastro, com direito à adição de um menu de navegação entre as seções; alteração da barra de navegação entre telas (barra retrátil substituída por uma barra parcialmente opaca e estática); adição de uma opção que permite adicionar novos moradores e animais.

2. *Sem data específica* - `início` - Eduardo Totti Thomé - Seção 2.3 User Stories: Início do alinhamento de escopo através da reformulação de US mais precisamente definidos; Seção 3.1 Requisitos Funcionais (RF's) e Regras de Negócio (RN's): Alinhamento de escopo através da reformulação de alguns RF's e RN's, exclusão de outros ou adição de novos. (obs: vale ressaltar que a equipe não teve uma boa estimativa do tempo desta tarefa. Por isso esta atualização está registrada com a tag: `início`)

### Sprint 4

1. 17/06/2026 - Davi Viana Tricarico e Lucas Bianchezzi - Seção 3.5 Protótipo de Alta Fidelidade: Conversão de três telas de *.png exportado* para um *design figma*, dentro do próprio documento de edição figma; adição de navegabilidade entre as telas, aprensentando apenas os principais fluxos de telas. (Obs: as maiores alterações foram feitas apenas no documento figma. Na seção 3.5 não foi alterado nada, mas vale ressaltar que link do documento figma, lá presente, está atualizado).

2. *Sem data específica* - `final` - Eduardo Totti Thomé - Seção 2.3 User Stories: Finalização do alinhamento de escopo, apresentando a reformulação das existentes e adição de novas US; Seção 3.1 Requisitos Funcionais (RF's) e Regras de Negócio (RN's): Finalização do alinhamento de escopo, apresentando ajuste ou exclusão de RF's e RN's existentes e adição de novos RF's e RN's. (obs: vale ressaltar que a equipe não teve uma boa estimativa do tempo desta tarefa. Por isso esta atualização está registrada com a tag: `final`)

3. 12/06/2026 - Davi Viana Tricarico - Seção 3.9 Matriz de Rastrabilidade RTM: Atualização da matriz de acordo com os novos endpoints, user stories, requisitos funcionais e regras de negócio.

4. 15/06/2026 - Davi Viana Tricarico - Seção 3.6.1 e 3.6.2 Modelo Entidade-Relacionamento e Diagrama Entidade-Relacionamento (MER e DER): Algumas alterações foram necessárias para o aprimoramento da modelagem do banco de dados, tanto nos diagramas, quanto nas documentações. Alterações feitas: CPF excluído de responsável e adicionado em pessoa; Exclusão do atributo DataPrevistaParto em GrupoPrioritário; Adição do atributo deleted_at  às entidades Pessoa, Família e Moradia; Adição do atributo Tipo à entidade Pet; Adição do atributo status à tabela associativa “ocupa” (familia_moradia); Documentação mais explicativa quanto às tabelas associativas.

5. 15/06/2026 - Gabriel Andreott - Seção 3.2.1 - Atualizações no diagrama de arquitetura (visão simplificada): ajustes necessários na estrutura de pastas do projeto

6. 16/06/2026 - Davi Viana Tricarico - Seção 3.2.1 - Atualizações no diagrama de arquitetura (diagrama de classes arquitetural): troca de plataforma/formato do diagrama (agora em arquivo .md usando linguagem mermaid) para facilitar os ajustes de fluxo e classes, de acordo com a refatoração do banco de dados, feita também na sprint 4.

### Sprint 5

1. 25/06/2026 - Gabriel Andreott - Atualizações no README: Na sprint 4, foi feito uma primeira versão do que seria o documento final do readme.md. No entando, para estar completamente finalizado, é necessário ter o projeto 100% terminado. Por isso, nessa sprint 5, o readme teve alterações pontuais, como a adição dos links dos "linkedins" do grupo e professores, a exclusão de descrições ou partes desnecessárias e a adição de um vídeo com a aplicação funcionando ao final do projeto. 

2. 26/06/2026 - Todo o Grupo - Alterações gerais e finais: após a última validação (12/06 - sprint 4) foi feito um levantamento de pequenas alterações generalizadas, tanto no front-end, quanto no back-end. Elas incluem, por exemplo, trocar o nome do campo "Logradouro" para "Logradouro(rua)" ou adicionar o atributo "renda" à entidade Pessoas e excluir de Responsável (passa a pertencer a todos os moradores cadastrados), e assim por diante.


# <a name="c8"></a>8. Conclusões e trabalhos futuros (sprint 5)

### 8.1 Conclusões


O desenvolvimento do GeoRisco Santo André atingiu, de maneira geral, os principais objetivos definidos na seção 2 deste documento. A proposta inicial era criar uma aplicação web capaz de apoiar a Defesa Civil na gestão de populações em áreas de risco, substituindo processos analógicos e descentralizados por uma solução digital integrada, com foco em cadastro rápido, organização das informações, visualização territorial e apoio à tomada de decisão. Ao final do projeto, a aplicação consolidou esses objetivos ao reunir, em um mesmo sistema, dados de famílias, moradores, responsáveis, moradias, pets, fotos, vínculos familiares, status cadastrais e informações de localização.

Um dos principais resultados alcançados foi a centralização das informações operacionais da Defesa Civil. A solução permite registrar e consultar dados que antes tenderiam a ficar dispersos em planilhas, fichas físicas ou registros isolados, fortalecendo a rastreabilidade e reduzindo o risco de perda de informações entre etapas do atendimento. O cadastro de cidadãos, famílias e responsáveis atende à necessidade de conhecer o perfil da população assistida, exigindo dados obrigatórios, responsável familiar e vínculos entre moradores e núcleo familiar. Além disso, a sinalização de cadastros incompletos contribui para manter a base de dados mais íntegra e útil para a operação.

Também foram contemplados os objetivos relacionados ao cadastro socioestrutural das moradias e ao registro de evidências visuais. A aplicação permite armazenar informações como características do imóvel, condição de ocupação, pavimentos e fotos, criando uma base mais completa para análise das condições de moradia em áreas de risco. O cadastro de pets também foi entregue, permitindo que a Defesa Civil considere a presença de animais nas famílias atendidas, aspecto relevante em situações de evacuação e acolhimento.

A solução alcançou ainda as promessas ligadas à consulta, busca e edição de dados. O gestor operacional pode localizar informações de famílias, moradias, moradores e pets de forma integrada, reduzindo a necessidade de cruzamento manual de dados. A edição de registros permite corrigir e atualizar informações existentes, mantendo a base mais próxima da realidade observada em campo. O arquivamento de moradias e moradores também atende ao objetivo de preservar histórico sem poluir a visualização operacional dos registros ativos, favorecendo a integridade dos dados ao longo do tempo.

Outro ponto forte foi a entrega de recursos voltados à visualização territorial e ao apoio à decisão. A aplicação apresenta moradias em mapa georreferenciado por meio de pins, permitindo ao gestor visualizar a distribuição espacial dos cadastros e compreender melhor a concentração de famílias em áreas de risco. Esse recurso se conecta diretamente ao objetivo descrito na seção 2 de oferecer uma visão estratégica para a sede da Defesa Civil e apoiar decisões sobre priorização, atendimento e planejamento operacional.

O objetivo de registrar localização georreferenciada foi atingido parcialmente. As coordenadas das moradias são representadas no mapa por pins, o que permite a visualização territorial dos registros. Entretanto, no mapa georreferenciado principal, esses pins não podem ser reposicionados diretamente. A correção da posição é possível na área de edição de moradias e famílias já existentes, onde o pin pode ser arrastado para uma nova coordenada. Dessa forma, a aplicação contempla a representação e a atualização da localização, mas ainda pode evoluir para permitir maior flexibilidade de ajuste no próprio fluxo de visualização georreferenciada.

Por fim, a aplicação também atende ao objetivo de manter os cadastros atualizados por meio de avisos de recadastro, sinalizando registros com mais de um ano e apoiando a rotina de revisão das informações.

Por outro lado, os testes de usabilidade (SUS) realizados também evidenciaram pontos a melhorar de forma geral, como a percepção de complexidade em determinados fluxos e momentos de inconsistência no comportamento do sistema, aspectos detalhados na seção 8.2.1 juntamente com os respectivos planos de ação. Em conjunto, essas entregas demonstram que o GeoRisco Santo André cumpriu a proposta central da seção 2: oferecer uma ferramenta digital integrada, mais ágil e mais confiável para apoiar agentes de campo e gestores operacionais na proteção de populações vulneráveis em áreas de risco.


### 8.2 Melhorias e Trabalhos Futuros


Apesar de a aplicação ter atendido à maior parte dos objetivos definidos para a entrega final, os testes realizados e a análise do uso da solução evidenciaram oportunidades de melhoria. Esses pontos não invalidam as entregas realizadas, mas indicam caminhos para amadurecer a experiência do usuário, aumentar a estabilidade percebida e ampliar a capacidade operacional do sistema em versões futuras.


#### 8.2.1 Pontos evidenciados nos testes e planos de ação


- **Otimização do mapa georreferenciado:** conforme indicado na conclusão, os pins do mapa representam as coordenadas das moradias, mas só podem ser movidos manualmente quando o usuário está editando uma moradia já existente. Como plano de ação, recomenda-se implementar um modo de edição diretamente na tela do mapa, permitindo arrastar o pin, confirmar a alteração e salvar a nova coordenada sem precisar acessar todo o fluxo de cadastro ou edição da família.


- **Ajuste do design e da organização dos elementos na tela:** nos testes SUS, foi relatado que o sistema ainda pode parecer complexo e exigir aprendizado inicial para uso pleno. Para reduzir essa dificuldade, o plano de ação é revisar a hierarquia visual das telas, simplificar fluxos com muitas etapas, destacar campos obrigatórios, padronizar botões e mensagens de feedback e validar as alterações em uma nova rodada de testes de usabilidade.


- **Melhoria da estabilidade e consistência do sistema:** os testes SUS também apontaram percepção de inconsistências durante o uso. Como plano de ação, recomenda-se mapear os erros e comportamentos inesperados mais recorrentes, revisar validações de formulário, mensagens de erro, respostas da API e fluxos críticos entre front-end, back-end e banco de dados. Essa revisão deve ser acompanhada por testes automatizados e testes manuais nos principais cenários de uso.


#### 8.2.2 Outras ideias para melhorias futuras


- **Integração de abrigos temporários:** uma possibilidade de evolução é cadastrar e gerenciar abrigos temporários, vinculando famílias realocadas aos locais de acolhimento. Essa funcionalidade ampliaria o apoio da aplicação em situações de evacuação e resposta emergencial.


- **Registro de bens perdidos ou sob guarda:** outra melhoria possível é incluir um módulo para registrar bens perdidos, recolhidos ou mantidos sob guarda após desastres. Esse recurso poderia funcionar de maneira semelhante ao cadastro de moradias e pessoas, aumentando a rastreabilidade dos atendimentos realizados pela Defesa Civil.


- **Exportação de dados e relatórios:** também é recomendável adicionar a extração de fichas de moradores, moradias e famílias em formatos como PDF ou CSV. Essa melhoria facilitaria a comunicação entre agentes, gestores e demais atores envolvidos nas ações da Defesa Civil de Santo André, além de apoiar prestações de contas, relatórios operacionais e análises posteriores.


Dessa forma, as melhorias propostas funcionam como continuidade natural do projeto. A aplicação já cumpre seu papel central de organizar e georreferenciar informações críticas, enquanto os trabalhos futuros apontam para uma solução ainda mais intuitiva, estável e preparada para apoiar diferentes etapas da gestão de risco e resposta a desastres.


# <a name="c9"></a>9. Referências (sprints 1 a 5)

1. PORTER, Michael E. *Estratégia Competitiva: Técnicas para Análise de Indústrias e da Concorrência*. 2. ed. Rio de Janeiro: Campus, 2004.

2. JOHNSON, G.; SCHOLES, K.; WHITTINGTON, R. *Exploring Corporate Strategy*. Harlow: Pearson Education, 2008.

3. PREFEITURA DE SANTO ANDRÉ. Departamento de Proteção e Defesa Civil: Ações e Programas. Disponível em: <https://portais.santoandre.sp.gov.br/defesacivil/>. Acesso em: 27 abr. 2026.

4. BRASIL. Lei nº 12.608, de 10 de abril de 2012. Institui a Política Nacional de Proteção e Defesa Civil (PNPDEC). *Diário Oficial da União*, Brasília, DF, 11 abr. 2012.

5. PEDROSO, Luiz Guilherme Lourenço Becker. [Título do trabalho]. 2017. Trabalho de Conclusão de Curso (Graduação) – Universidade de São Paulo, São Paulo, 2017. Disponível em: https://bdta.abcd.usp.br/directbitstream/05356078-01cb-4989-856d-4cf4dcb8b4cc/LuizGuilhermeLourencoBeckerPedroso%20TCCPRO17.pdf
. Acesso em: 30 abr. 2026.

6. FORTUNE BUSINESS INSIGHTS. Crisis Management Software Market Size, Share & Industry Analysis. Pune, 2026. Disponível em: https://www.fortunebusinessinsights.com/pt/crisis-management-software-market-110370. Acesso em: 2 jun. 2026.

7. GLOBAL GROWTH INSIGHTS. Emergency Management Software Market Report. 2026. Disponível em: https://www.globalgrowthinsights.com/market-reports/emergency-management-software-market-105680. Acesso em: 2 jun. 2026.

8. VERIFIED MARKET REPORTS. Public Safety Software Market Size, Share, Trends and Forecast. 2026. Disponível em: https://www.verifiedmarketreports.com/product/public-safety-software-market/. Acesso em: 2 jun. 2026.

9. ABSTARTUPS; SEBRAE. GovTech Brasil 2023: mapeamento do ecossistema de tecnologia para o setor público. São Paulo: Abstartups, 2023. Disponível em: https://abstartups.com.br/govtech-brasil. Acesso em: 09 jun. 2026.

10. BRASIL. Lei nº 14.133, de 1º de abril de 2021. Lei de Licitações e Contratos Administrativos. Diário Oficial da União, Brasília, DF, 1 abr. 2021. Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm. Acesso em: 09 jun. 2026.

11. CENTRO NACIONAL DE MONITORAMENTO E ALERTAS DE DESASTRES NATURAIS (CEMADEN). CEMADEN expande rede de monitoramento e passa a monitorar 1.295 municípios. Brasília: CEMADEN, 2024. Disponível em: https://www.gov.br/cemaden/pt-br/assuntos/noticias-cemaden/cemaden-expande-rede-de-monitoramento-e-passa-a-monitorar-1-295-municipios. Acesso em: 09 jun. 2026.

12. GOOGLE. Google Maps Platform documentation. Mountain View: Google LLC, 2024. Disponível em: https://developers.google.com/maps/documentation. Acesso em: 09 jun. 2026.

13. OPENSTREETMAP FOUNDATION. OpenStreetMap. 2024. Disponível em: https://www.openstreetmap.org. Acesso em: 09 jun. 2026.

14. CENTRO NACIONAL DE MONITORAMENTO E ALERTAS DE DESASTRES NATURAIS (CEMADEN). Cemaden expande rede de monitoramento e passa a monitorar 1.295 municípios. São José dos Campos, 2026. Disponível em: <https://www.gov.br/cemaden/pt-br/assuntos/noticias-cemaden/cemaden-expande-rede-de-monitoramento-e-passa-a-monitorar-1-295-municipios>. Acesso em: 9 jun. 2026.

15. BRASIL. Secretaria de Comunicação Social da Presidência da República (SECOM). Mais 162 cidades brasileiras são incluídas na rede de alertas do Cemaden. Brasília, 2026. Disponível em: <https://www.gov.br/secom/pt-br/acompanhe-a-secom/noticias/2026/05/mais-162-cidades-brasileiras-sao-incluidas-na-rede-de-alertas-do-cemaden/>. Acesso em: 9 jun. 2026.

16. BRASIL. Casa Civil. Cadastro de municípios suscetíveis a eventos de enxurradas e inundações: Nota Técnica 2. Brasília, [s.d.]. Disponível em: <https://www.gov.br/casacivil/pt-br/assuntos/cadastro-de-municipios-suscetiveis-a-eventos-de-enxurradas-e-inundacoes/Nota_Tecnica_2.pdf>. Acesso em: 9 jun. 2026.

17. INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA (IBGE). Estudo inédito mostra moradores sujeitos a enchentes e deslizamentos. Rio de Janeiro, 2018. Disponível em: <https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/21566-estudo-inedito-mostra-moradores-sujeitos-a-enchentes-e-deslizamentos>. Acesso em: 9 jun. 2026.

18. INSTITUTO DE PESQUISAS TECNOLÓGICAS (IPT). Mapeamento e gerenciamento de áreas de risco de deslizamento e solapamento de margem no município de Santo André-SP. São Paulo, 27 mar. 2023. Disponível em: <https://ipt.br/2023/03/27/mapeamento-e-gerenciamento-de-areas-de-risco-de-deslizamento-e-solapamento-de-margem-no-municipio-de-santo-andre-sp/>. Acesso em: 9 jun. 2026.

19. INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA (IBGE). População em áreas de risco no Brasil. Rio de Janeiro: IBGE, 2018. Disponível em: https://www.ibge.gov.br/geociencias/informacoes-ambientais/estudos-ambientais/21538-populacao-em-areas-de-risco-no-brasil.html. Acesso em: 12 jun. 2026.

# <a name="c10"></a>Anexos

*Inclua aqui quaisquer complementos para seu projeto, como diagramas, imagens, tabelas etc. Organize em sub-tópicos utilizando headings menores (use ## ou ### para isso)*
