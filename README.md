# Inteli - Instituto de Tecnologia e Liderança

<p align="center">
  <img src="assets/inteli.png" alt="Inteli - Instituto de Tecnologia e Liderança" width="300"/>
</p>

# GeoRisco Santo André

**Grupo 03 - Froggy Tech**


## Integrantes

- [Ali Mustapha Abdallah](https://www.linkedin.com/in/ali-abdallah007/)
- [Arthur Davi da Silva Rodrigues](https://www.linkedin.com/in/arthur-davi-da-silva-rodrigues/)
- [Davi Viana Tricarico](https://www.linkedin.com/in/davi-tricarico-248b1a3b1/)
- [Eduardo Totti Thomé](https://www.linkedin.com/in/eduardototti/)
- [Enzo Kojian Guilhen](https://www.linkedin.com/in/enzo-kojian-guilhen-60690a3b0/)
- [Gabriel Andreott Salles Pereira](https://www.linkedin.com/in/gabriel-andreott-84037a330)
- [Julio Quevedo da Silva](https://www.linkedin.com/in/julioquevdo/?locale=en)
- [Lucas Bianchezzi Oliveira](https://www.linkedin.com/in/lucasb-oliveira/?locale=en)

## Professores

### Orientadora
- [Camila Naves Arantes](https://www.linkedin.com/in/camilanarantes/)

### Instrutores
- [Crishna Irion](https://www.linkedin.com/in/crishna-irion-phd-7b5aa311)
- [Bruna Mayer Costa](https://www.linkedin.com/in/bruna-mayer/)
- [Henrique Mohallem Paiva](https://br.linkedin.com/in/henrique-mohallem-paiva-6854b460)
- [Fábio Cássio de Souza](https://www.linkedin.com/in/fabiocassiosouza/)
- [Claudio Fernando André](https://www.linkedin.com/in/profclaudioandre/)
- [Andréa Zotovici](https://www.linkedin.com/in/zotovici/)

---

## Descrição

O **GeoRisco Santo André** é uma aplicação web desenvolvida pelo Grupo 03 do Inteli em parceria com a Coordenadoria de Defesa Civil e o CREDEC de Santo André. O sistema apoia agentes de campo e gestores na gestão de populações em situação de vulnerabilidade em áreas de risco geológico, hidrológico e estrutural do município.

A plataforma centraliza o cadastro de pessoas, famílias, moradias, animais de estimação e registros fotográficos, todos com dados georreferenciados (latitude e longitude). Isso permite o mapeamento espacial das ocorrências por meio de uma interface de mapa interativa, possibilitando visualizar a distribuição geográfica das famílias cadastradas e suas respectivas situações de risco.

O objetivo principal é substituir processos manuais e fragmentados — planilhas, papel e registros isolados — por uma plataforma digital integrada. Com ela, agentes de campo podem registrar e atualizar informações diretamente no navegador durante visitas a campo, enquanto coordenadores acompanham o histórico de vínculos entre famílias, moradores e moradias ao longo do tempo.

A arquitetura segue o padrão em camadas: o frontend em React consome uma API REST construída em Node.js/TypeScript com Express, que se conecta a um banco PostgreSQL gerenciado pelo Supabase. O armazenamento de fotos utiliza o Supabase Storage com URLs assinadas, garantindo acesso controlado às imagens. As regras de negócio estão centralizadas nos serviços do backend, com repositórios e interfaces bem definidos para facilitar a manutenção e a cobertura de testes.

Entre as funcionalidades entregues estão: criação transacional de núcleo familiar completo (responsável, dependentes, moradia, pets e fotos); busca de famílias e pessoas por nome, CPF ou bairro; histórico de vínculos entre famílias e moradias; sistema de priorização de atendimento por grupos vulneráveis; e registro fotográfico com upload direto para o Supabase Storage. O sistema opera corretamente sem dados iniciais e pode ser configurado em qualquer ambiente com Node.js 20+ e um projeto Supabase ativo.

---

## Link de Demonstração

> [Assista ao vídeo demonstrativo]([INSERIR LINK DO YOUTUBE]) — principais funcionalidades do GeoRisco Santo André (máx. 3 min, sem música de fundo).

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, Leaflet |
| Backend | Node.js 20+, TypeScript, Express 5 |
| Banco de dados | PostgreSQL (Supabase) |
| Storage | Supabase Storage (URLs assinadas) |
| ORM / cliente SQL | `pg`, `@supabase/supabase-js` |
| Testes | Jest, ts-jest, Supertest |
| Build / Dev | tsx, TypeScript compiler |
| Variáveis de ambiente | dotenv |
| Gerenciador de pacotes | npm |

---

## Pré-requisitos

Antes de executar o projeto, instale:

- [Git](https://git-scm.com/)
- [Node.js 20 ou superior](https://nodejs.org/) (testado com v24.13.1)
- npm 9+ (incluído com o Node.js; testado com 11.15.0)
- Um projeto [Supabase](https://supabase.com/) ativo com acesso ao banco PostgreSQL e ao Storage
- `psql` — cliente de linha de comando do PostgreSQL (necessário para aplicar as migrations manualmente)

> **Windows:** em alguns ambientes, o PowerShell bloqueia scripts npm por política de execução. Caso ocorra, substitua `npm` por `npm.cmd` nos comandos abaixo.

---

## Configuração para Desenvolvimento e Execução do Código

### 1. Clonar o repositório

```bash
git clone https://git.inteli.edu.br/graduacao/2026-1b/t25/g03.git
cd g03
```

---

### 2. Configurar variáveis de ambiente do backend

Crie o arquivo `.env` dentro de `src/geoRisco/`:

```bash
# No Linux/macOS:
cp src/geoRisco/.env.example src/geoRisco/.env   # se existir exemplo
# ou crie manualmente:
touch src/geoRisco/.env
```

```bash
# No Windows (PowerShell):
New-Item -Path src\geoRisco\.env -ItemType File
```

Preencha o arquivo `.env` com os valores do seu projeto Supabase:

```env
# Porta em que o servidor Express irá escutar
PORT=3000

# String de conexão do banco PostgreSQL (encontrada em Supabase → Settings → Database → Connection string → URI)
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:PORTA/BANCO

# URL pública do projeto Supabase (encontrada em Supabase → Settings → API → Project URL)
SUPABASE_URL=https://SEU-PROJETO.supabase.co

# Service Role Key do Supabase — NUNCA exponha em frontend ou repositório público
# (encontrada em Supabase → Settings → API → service_role)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Nome do bucket de armazenamento de fotos (crie em Supabase → Storage)
SUPABASE_STORAGE_BUCKET=georisco-fotos

# Habilita testes de integração com banco real (padrão: false)
RUN_DB_TESTS=false
```

> O frontend não exige arquivo `.env`. Ele roda via Vite e faz proxy automático de `/api` para `http://localhost:3000`.

---

### 3. Criar o bucket no Supabase Storage

No painel do Supabase, acesse **Storage → New bucket** e crie um bucket com o nome `georisco-fotos` (ou o valor definido em `SUPABASE_STORAGE_BUCKET`). Deixe-o como **privado**.

---

### 4. Aplicar as migrations do banco

As migrations estão em `supabase/migrations/`. Aplique-as em ordem com `psql`:

```bash
# Linux/macOS — substitua $DATABASE_URL pela string completa se não tiver a variável exportada
psql "$DATABASE_URL" -f supabase/migrations/20260612044010_remote_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/20260612051000_enforce_moradia_unica_familia.sql
```

```powershell
# Windows (PowerShell)
psql $env:DATABASE_URL -f supabase\migrations\20260612044010_remote_schema.sql
psql $env:DATABASE_URL -f supabase\migrations\20260612051000_enforce_moradia_unica_familia.sql
```

Alternativamente, use o script de migrate incremental do backend (aplica os arquivos em `src/geoRisco/src/db/migrations/`):

```bash
cd src/geoRisco
npm install
npm run migrate
```

> Se o schema já estava aplicado no projeto Supabase de produção, este passo pode ser pulado.

---

### 5. Instalar dependências e iniciar o backend

```bash
cd src/geoRisco
npm install
npm run dev
```

O servidor ficará disponível em: `http://localhost:3000`

Confirme que está rodando:

```bash
curl http://localhost:3000/
# Resposta esperada: {"status":"ok","service":"GeoRisco API"}
```

---

### 6. Instalar dependências e iniciar o frontend

Em outro terminal, a partir da raiz do repositório:

```bash
cd src/frontend
npm install
npm run dev
```

A interface ficará disponível em: `http://localhost:5173`

> O Vite faz proxy automático de todas as requisições `/api/*` para `http://localhost:3000`, portanto **backend e frontend devem estar rodando simultaneamente**.

---

### 7. Scripts disponíveis

#### Backend (`src/geoRisco/`)

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor em modo watch com tsx |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Executa o build compilado (`dist/server.js`) |
| `npm run migrate` | Aplica as migrations SQL incrementais em `src/db/migrations/` |
| `npm test` | Executa a suite de testes unitários com Jest |
| `npm run test:watch` | Testes unitários em modo watch |
| `npm run test:coverage` | Testes unitários com relatório de cobertura |
| `npm run test:integration` | Testes de integração com banco real (exige `RUN_DB_TESTS=true` e `.env` configurado) |
| `npm run test:coverage:integration` | Integração com cobertura |

#### Frontend (`src/frontend/`)

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento Vite (porta 5173) |
| `npm run build` | Gera build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |

---

### 8. Executar a suite de testes

#### Testes unitários (não exigem banco)

```bash
cd src/geoRisco
npm test
```

Os testes unitários cobrem os serviços de negócio (`pessoa`, `família`, `moradia`, `pet`, `foto`, `foto-storage`) e não dependem de conexão com banco de dados.

#### Testes de integração (exigem banco Supabase configurado)

```bash
cd src/geoRisco

# Linux/macOS: exporte as variáveis antes
export DATABASE_URL="postgresql://usuario:senha@host:porta/banco"
export SUPABASE_URL="https://seu-projeto.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
export RUN_DB_TESTS=true

# Windows (PowerShell)
$env:DATABASE_URL = "postgresql://usuario:senha@host:porta/banco"
$env:SUPABASE_URL = "https://seu-projeto.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "sua-service-role-key"
$env:RUN_DB_TESTS = "true"

npm run test:integration
```

> Os testes de integração executam dentro de transações que são revertidas com `ROLLBACK` ao final — nenhum dado persiste no banco após os testes.

---

### 9. Validar os fluxos de ponta a ponta

Com backend (`localhost:3000`) e frontend (`localhost:5173`) rodando, acesse `http://localhost:5173` e percorra os seguintes fluxos:

| Fluxo | Caminho na interface |
| --- | --- |
| Cadastrar núcleo familiar completo | Home → botão "Novo cadastro" |
| Buscar família por nome ou bairro | Menu "Busca" |
| Visualizar moradias no mapa | Menu "Mapa" |
| Listar e filtrar pessoas | Menu "Pessoas" |
| Consultar histórico de vínculos | Menu "Histórico" |

Para validar a API REST diretamente:

```bash
# Listar pessoas
curl http://localhost:3000/api/pessoas

# Listar famílias
curl http://localhost:3000/api/familias

# Listar moradias
curl http://localhost:3000/api/moradias

# Listar prioridades
curl http://localhost:3000/api/prioridades
```

> A aplicação opera corretamente sem dados iniciais — todos os endpoints retornam listas vazias em um banco recém-configurado.

---

## Estrutura de Pastas

```
g03/
├── assets/                          # Imagens e materiais visuais do README
├── documentos/                      # Documentação técnica e acadêmica
│   ├── wad.md                       # Web Application Document (WAD)
│   └── outros/                      # Documentos complementares, imagens e diagramas do WAD
│       ├── endpoints.md             # Documentação dos endpoints da API
│       ├── diagramaArquitetura.md   # Diagrama de arquitetura
│       ├── rtm.md                   # Matriz de rastreabilidade de requisitos
│       ├── tutorial-deploy.md       # Tutorial de deploy da aplicação
│       ├── webapi-docs.html         # Documentação HTML da Web API
│       ├── diagramas_arquitetura/   # Imagens detalhadas do diagrama de arquitetura
│       ├── diagramas_sequencia/     # Diagramas de sequência
│       └── *.png, *.jpg             # Diagramas, personas, wireframes e logos do WAD
├── src/
│   ├── frontend/                    # Aplicação React + Vite (interface do usuário)
│   │   ├── public/                  # Arquivos estáticos públicos
│   │   ├── src/
│   │   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── pages/               # Páginas (Home, Cadastro, Busca, Mapa, Pessoas, Histórico)
│   │   │   ├── utils/               # Funções utilitárias (forms, export, prioridade, anim)
│   │   │   ├── styles/              # CSS global e tema
│   │   │   ├── api.ts               # Funções de acesso à API REST
│   │   │   ├── types.ts             # Tipos TypeScript compartilhados
│   │   │   ├── App.tsx              # Componente raiz e roteamento
│   │   │   └── main.tsx             # Entry point React
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts           # Configuração Vite (proxy /api → localhost:3000)
│   └── geoRisco/                    # API REST Node.js + TypeScript
│       └── src/
│           ├── controllers/         # Handlers HTTP (pessoa, família, moradia, pet, foto, prioridade)
│           ├── db/                  # Conexão PostgreSQL e migrations incrementais
│           ├── dtos/                # Tipos de entrada e saída dos endpoints
│           ├── errors/              # Classes de erro HTTP
│           ├── interfaces/          # Contratos de repositórios e serviços
│           ├── models/              # Modelos e enums de domínio
│           ├── repositories/        # Acesso ao banco de dados (pg)
│           ├── routes/              # Definição das rotas Express
│           ├── services/            # Regras de negócio
│           ├── storage/             # Cliente Supabase Storage
│           ├── tests/               # Testes unitários e de integração (Jest)
│           ├── validations/         # Validações de payload de entrada
│           ├── app.ts               # Configuração Express e registro de rotas
│           └── server.ts            # Bootstrap HTTP
│       ├── jest.config.js           # Configuração Jest (testes unitários)
│       ├── jest.integration.config.js # Configuração Jest (integração)
│       ├── package.json
│       └── tsconfig.json
├── supabase/
│   ├── config.toml                  # Configuração Supabase CLI (local)
│   └── migrations/                  # Schema versionado do banco
├── coverage/                        # Relatórios de cobertura de testes
├── .gitignore
├── .gitattributes
└── README.md
```

---

## Histórico de Lançamentos

### 0.1.0 - 30/04/2026

### 0.2.0 - 15/05/2026

### 0.3.0 - 29/05/2026

### 0.4.0 — 12/06/2026

### 1.0.0 — 26/06/2026


---

## Licença

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/">
<a property="dct:title" rel="cc:attributionURL" href="https://git.inteli.edu.br/graduacao/2026-1b/t25/g03">GeoRisco Santo André — Grupo 03</a> by
<a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.inteli.edu.br">Inteli — Instituto de Tecnologia e Liderança</a>
is licensed under
<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="license noopener noreferrer">Creative Commons Attribution 4.0 International (CC BY 4.0)</a>.
</p>

Ali Mustapha Abdallah, Arthur Davi da Silva Rodrigues, Davi Viana Tricarico, Eduardo Totti Thomé, Enzo Kojian Guilhen, Gabriel Andreott Salles Pereira, Julio Quevedo da Silva, Lucas Bianchezzi Oliveira.
