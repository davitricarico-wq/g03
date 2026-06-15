# Inteli - Instituto de Tecnologia e Liderança 

<p align="center">
<img src="assets/inteli.png">
</p>

# Observação: 

O documento README.md do projeto ainda aguarda as últimas finalizações da sprint 5 para conclusão definitiva do documento.

# Integrantes: 

- Ali Mustapha Abdallah
- Arthur Davi da Silva Rodrigues
- Davi Viana Tricarico
- Eduardo Totti Thomé
- Enzo Kojian Guilhen 
- Gabriel Andreott Salles Pereira
- Julio Quevedo da Silva
- Lucas Bianchezzi Oliveira

# Professores:

## Orientadora: 
- Camila Naves Arantes

## Instrutores: 
- Crishna Irion 
- Bruna Mayer Costa
- Henrique Mohallem Paiva
- Fábio Cássio de Souza
- Claudio Fernando André
- Andréa Zotovici

# Descrição

O **GeoRisco Santo André** é uma aplicação web para apoiar a Defesa Civil de Santo André na gestão de populações em áreas de risco. O projeto centraliza cadastros de pessoas, famílias, moradias, pets e fotos, com dados georreferenciados, histórico de vínculos e endpoints REST para consulta e manutenção das informações.

O objetivo do MVP, conforme o TAPI e o WAD do projeto, é viabilizar o mapeamento socioestrutural georreferenciado em campo, reduzindo a fragmentação de dados e apoiando a identificação de prioridades em ações de prevenção, evacuação e acolhimento emergencial.

> Link para demonstração: !!!!!!!!!!!!(sprint 5)!!!!!!!!!!!!!!

## Funcionalidades Principais

- Cadastro e listagem de pessoas por interface EJS;
- API REST para pessoas, responsáveis, famílias, moradias, pets e fotos;
- Validação de regras de negócio para campos obrigatórios, enums e consistência dos cadastros;
- Cadastro de responsáveis familiares com dados socioeconômicos e de contato;
- Cadastro de moradias com localização, latitude, longitude, endereço, tipo de construção, uso do imóvel e situação de ocupação;
- Criação transacional de núcleo familiar com localização, moradia, responsável, dependentes, pets e fotos;
- Gestão de vínculos e histórico entre famílias, pessoas e moradias;
- Cadastro e manutenção de pets vinculados a famílias;
- Registro de fotos vinculadas a moradias ou pets;
- Geração de URLs assinadas de upload e acesso para fotos usando Supabase Storage;
- Documentação de apoio em `documentos/wad.md` e `documentos/endpoints.md`.

## Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Runtime:** Node.js
- **Framework web:** Express 5
- **Views:** EJS
- **Banco de dados:** PostgreSQL
- **BaaS/Storage:** Supabase e Supabase Storage
- **Cliente SQL:** `pg`
- **Cliente Supabase:** `@supabase/supabase-js`
- **Variáveis de ambiente:** `dotenv`
- **Testes:** Jest, ts-jest e Supertest
- **Build/dev:** TypeScript, TSX e ts-node
- **Gerenciador de pacotes:** npm

## Pré-requisitos

Antes de executar o projeto localmente, instale:

- VSCode
- Git
- Node.js 20 ou superior. O repositório não define `engines`; o ambiente local analisado usa Node.js `v24.13.1`.
- npm. O ambiente local analisado usa npm `11.15.0`.
- PostgreSQL ou um projeto Supabase com acesso ao banco.
- Cliente `psql`, caso você vá aplicar manualmente a migração SQL do Supabase.
- Supabase CLI, opcional, caso prefira subir uma stack Supabase local a partir de `supabase/config.toml`.

Também será necessário configurar variáveis de ambiente no backend:

```env
PORT=3000
DATABASE_URL=postgresql://USUARIO:SENHA@HOST:PORTA/BANCO

# Necessárias para endpoints de upload/acesso assinado de fotos
SUPABASE_URL=[INSERIR URL DO PROJETO SUPABASE]
SUPABASE_SERVICE_ROLE_KEY=[INSERIR SERVICE ROLE KEY]
SUPABASE_STORAGE_BUCKET=georisco-fotos

# Opcional: habilita teste de integração com banco
RUN_DB_TESTS=false
```

> Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` em frontend, repositório público ou logs.

## Instalação e Execução

Clone o repositório:

```bash
git clone https://git.inteli.edu.br/graduacao/2026-1b/t25/g03.git
cd g03
```

Entre na aplicação Node.js:

```bash
cd src/geoRisco
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` em `src/geoRisco` e preencha as variáveis listadas na seção de pré-requisitos.

Prepare o banco de dados. O schema principal versionado do projeto está em `supabase/migrations/20260530012620_remote_schema.sql`. A partir da raiz do repositório, aplique-o com:

```bash
psql "$DATABASE_URL" -f supabase/migrations/20260530012620_remote_schema.sql
```

No PowerShell, o comando equivalente é:

```powershell
psql $env:DATABASE_URL -f .\supabase\migrations\20260530012620_remote_schema.sql
```

Volte para a pasta da aplicação, se necessário:

```bash
cd src/geoRisco
```

Execute em modo desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em:

```txt
http://localhost:3000
```

Para gerar build de produção:

```bash
npm run build
```

Para executar o build:

```bash
npm start
```

Para rodar os testes:

```bash
npm test
```

Para habilitar o teste de persistência com banco, defina `RUN_DB_TESTS=true` e mantenha `DATABASE_URL` configurada antes de executar `npm test`.

> Em algumas instalações do Windows, `npm` pode ser bloqueado pela política de execução do PowerShell. Nesse caso, use `npm.cmd install`, `npm.cmd run dev` e `npm.cmd test`.

### Scripts Disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor com TSX em modo watch. |
| `npm run build` | Compila TypeScript para `dist/`. |
| `npm start` | Executa `dist/server.js`. |
| `npm run migrate` | Executa os arquivos SQL em `src/db/migrations` usando `DATABASE_URL`. |
| `npm test` | Compila o projeto e roda Jest. |
| `npm run test:watch` | Executa os testes em modo watch. |

## Uso

Depois de iniciar o servidor, acesse:

- `GET /` redireciona para o formulário de cadastro de pessoa.
- `GET /pessoas/novo` abre o formulário de cadastro.
- `POST /pessoas/` cria uma pessoa a partir do formulário.
- `GET /pessoas` renderiza a lista de pessoas.
- `GET /pessoas.json` retorna a lista de pessoas em JSON.

Principais grupos da API:

- `/api/pessoas`
- `/api/responsaveis`
- `/api/familias`
- `/api/moradias`
- `/api/pets`
- `/api/fotos`

Exemplo de requisição:

```bash
curl http://localhost:3000/api/pessoas
```

A documentação detalhada de endpoints está em `documentos/endpoints.md`.

> Observação: o TAPI informa que autenticação de usuários não faz parte do escopo acadêmico inicial, e o código atual não possui middleware de login/autorização.

## Estrutura de Pastas

```txt
g03/
├── assets/                         # Imagens e materiais visuais gerais
├── documentos/                     # WAD, documentação e técnica de endpoints
|   │── outros/                     # Imagens no WAD
│   │── wad.md                    
│   │── endpoints.md
|   └── webapi-docs.html
|   
├── src/
│   └── geoRisco/                   # Aplicação Node.js/TypeScript
│       ├── documents/              # Evidências e assets de apoio
│       ├── src/
│       │   ├── controllers/        # Controllers HTTP
│       │   ├── db/                 # Conexão e migrações SQL auxiliares
│       │   ├── dtos/               # Tipos de entrada/saída
│       │   ├── errors/             # Erros HTTP
│       │   ├── interfaces/         # Contratos de repositories/services
│       │   ├── models/             # Modelos e enums de domínio
│       │   ├── public/             # CSS estático
│       │   ├── repositories/       # Acesso ao PostgreSQL
│       │   ├── routes/             # Definição das rotas
│       │   ├── services/           # Regras de negócio
│       │   ├── storage/            # Cliente Supabase Storage
│       │   ├── tests/              # Testes de integração
│       │   ├── validations/        # Validações de payload
│       │   ├── views/              # Templates EJS
│       │   ├── app.ts              # Configuração Express
│       │   └── server.ts           # Bootstrap HTTP
│       ├── jest.config.js
│       ├── package.json
│       └── tsconfig.json
├── supabase/
│   ├── config.toml                 # Configuração Supabase local
│   └── migrations/                 # Schema versionado do banco Supabase
├── .gitattributes
├── .gitignore 
└── README.md
```

## Como Contribuir

1. Faça um fork do repositório.
2. Crie uma branch para sua alteração:

```bash
git checkout -b feature/minha-melhoria
```

3. Instale dependências e valide o projeto localmente:

```bash
cd src/geoRisco
npm install
npm test
```

4. Faça commits pequenos e descritivos:

```bash
git add .
git commit -m "feat: descreve a melhoria implementada"
```

5. Envie sua branch:

```bash
git push origin feature/minha-melhoria
```

6. Abra um Pull Request explicando o problema resolvido, a solução adotada e os testes executados.

## Histórico de Lançamentos

- 0.1.0 - 12/06/2026
- 0.2.0 - 26/06/2026

## Licença

Este projeto declara licença **ISC** no `src/geoRisco/package.json`.

