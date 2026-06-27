# Tutorial — Deploy do GeoRisco (Vercel + Supabase)

Guia completo e replicável de como colocar o GeoRisco no ar. Serve tanto pra entender
o que foi feito quanto pra refazer do zero.

---

## 0. Visão geral

O GeoRisco tem **duas partes que rodam de formas diferentes**, então o deploy tem **dois alvos**:

| Parte | O que é | Onde roda | Por quê |
|---|---|---|---|
| **Frontend** (`src/frontend`) | SPA React/Vite — só arquivos estáticos (HTML/CSS/JS) | Vercel (projeto `georisco-frontend`) | site estático |
| **Backend** (`src/geoRisco`) | API Express (processo que escuta requisições) | Vercel (projeto `georisco`) | precisa de servidor |
| **Banco + Storage** | PostgreSQL + bucket de fotos | Supabase | dado persistente |

URLs em produção:
- Frontend: https://georisco-frontend.vercel.app
- Backend:  https://georisco.vercel.app  (a API fica em `/api/...`)

### O conceito mais importante: **serverless ≠ servidor tradicional**
No seu PC, o backend roda com `app.listen(3000)` — um processo que fica ligado.
Na Vercel **não existe processo ligado**: cada requisição acorda uma "função" (serverless),
ela responde e morre. Isso muda duas coisas no código:
1. Em vez de `app.listen()`, a gente **exporta** o app Express pra Vercel chamar.
2. Conexões com o banco não podem ficar abertas pra sempre → usa-se o **pooler** do Supabase.

> **Por que não GitLab Pages?** Pages só serve arquivos estáticos (serviria o frontend),
> mas **não roda backend**. E a instância do Inteli (`git.inteli.edu.br`) é um GitLab
> self-hosted que pode não ter o Pages habilitado. Por isso colocamos tudo na Vercel.

> **Por que Vercel CLI e não deploy automático?** A Vercel só conecta automaticamente em
> `gitlab.com`, `github.com` e `bitbucket.org`. O GitLab do Inteli é self-hosted, então o
> deploy é feito pela **linha de comando** (`vercel`), enviando os arquivos locais. O GitLab
> CI (`.gitlab-ci.yml`) continua só rodando testes/build — não faz deploy.

---

## 1. Pré-requisitos
- Node 20+ e npm
- Conta na Vercel (https://vercel.com — pode logar com GitHub)
- Projeto no Supabase com o banco acessível (connection string, URL e service_role key)
- CLI da Vercel: `npm i -g vercel`

---

## 2. Mudanças no código (o que e por quê)

### 2.1 Backend (`src/geoRisco`)

**a) `api/index.ts` (novo) — ponto de entrada serverless**
```ts
import { app } from '../src/app';
export default app;
```
A Vercel procura funções na pasta `api/`. Aqui só exportamos o app Express (sem `listen`).
O `src/server.ts` (que faz `app.listen`) continua existindo só pro dev local.

**b) `vercel.json` (novo) — manda tudo pra essa função**
```json
{
  "version": 2,
  "builds": [{ "src": "api/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.ts" }]
}
```
- `builds` + `routes` **desligam a auto-detecção** da Vercel (ela detectava "Express" e tentava
  transformar o `server.ts` em função, que quebrava porque o `server.ts` não exporta nada).
- `routes` manda **todas** as URLs (inclusive `/`) pra nossa única função.

**c) `src/app.ts` — CORS**
```ts
import cors from 'cors';
// ...
const corsOrigins = (process.env.CORS_ORIGIN ?? '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: corsOrigins.length ? corsOrigins : true }));
```
Frontend e backend ficam em domínios diferentes → o navegador bloqueia a chamada sem CORS.
Sem `CORS_ORIGIN` definido, libera qualquer origem (cômodo). Em produção dá pra travar na
origem do frontend.

**d) `src/db/connection.ts` — pool serverless-friendly**
```ts
const useSsl = process.env.PGSSL === 'true'
  || (process.env.PGSSL !== 'false' && process.env.NODE_ENV === 'production');
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX ?? 10),
  ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {})
});
```
- `ssl`: Supabase exige SSL. Liga sozinho em produção (`NODE_ENV=production` na Vercel).
- `max`: pool pequeno em serverless (pra não estourar conexões).

**e) `package.json`**
- Adicionado `cors` (e `@types/cors`).
- `migrate` trocado de `ts-node` para `tsx`:
  ```
  "migrate": "node node_modules/tsx/dist/cli.cjs src/db/migrate.ts"
  ```
  O `ts-node` quebrava com o TypeScript 6 (a opção `rewriteRelativeImportExtensions` reescreve
  `./connection.ts` → `./connection.js`, e o `ts-node` só intercepta `.ts`). O `tsx` resolve isso.

**f) `.env` (local, **gitignored**)** — `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.
Nunca vai pro git (está no `.gitignore`).

### 2.2 Frontend (`src/frontend`)

**a) `src/api.ts` — URL do backend configurável**
```ts
const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';
```
No dev usa o proxy do Vite (`/api` → localhost:3000). Em produção, o build recebe
`VITE_API_BASE_URL` (ex.: `https://georisco.vercel.app/api`) e **embute** essa URL no bundle.
*(Pages não tem proxy, e mesmo na Vercel o frontend e o backend são domínios diferentes — então
a URL absoluta é obrigatória.)*

**b) `vite.config.ts` — base configurável**
```ts
base: process.env.VITE_BASE_PATH ?? '/',
```
Na Vercel o site fica na raiz do domínio → `base = '/'` (default). *(Era necessário pro Pages,
que serve em subcaminho; mantido por flexibilidade.)*

**c) `src/vite-env.d.ts` (novo) — tipos**
```ts
/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_API_BASE_URL?: string; }
interface ImportMeta { readonly env: ImportMetaEnv; }
```
Sem isso o `tsc -b` (parte do build) reclamaria que `import.meta.env` não existe.

**d) `vercel.json` (novo) — fallback de SPA**
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
O app usa `BrowserRouter`. Numa URL profunda (ex.: `/mapa`), sem isso a Vercel devolveria 404.
O rewrite serve o `index.html` e o React Router assume a rota. (Arquivos reais, como `/assets/...`,
são servidos antes do rewrite.)

### 2.3 Correções de bugs encontradas no caminho
- **`src/tests/integration/nucleo.integration.test.ts`**: usava `result.responsavel.idPessoa`
  (campo inexistente) → trocado por `result.responsavel.id`. Quebrava o `tsc`/CI.
- **`migrate` via tsx** (item 2.1.e) — também conserta o job `backend:integration` do CI.

---

## 3. Deploy passo a passo

### 3.1 Banco — rodar as migrations (uma vez)
```powershell
cd src/geoRisco
$env:DATABASE_URL = "<connection string do Supabase>"
$env:PGSSL = "true"
npm run migrate
```
> Não é idempotente (o `01_*.sql` tem `CREATE TYPE` sem `IF NOT EXISTS`) — rode **uma vez** num banco limpo.

### 3.2 Backend na Vercel
```bash
npm i -g vercel
cd src/geoRisco
vercel login                              # abre o navegador
vercel link --yes --project georisco      # cria/linka o projeto (nome minúsculo!)
```
Setar variáveis de produção (valor vem pelo stdin):
```bash
printf '%s' '<DATABASE_URL pooler :6543>'        | vercel env add DATABASE_URL production
printf '%s' 'https://<projeto>.supabase.co'      | vercel env add SUPABASE_URL production
printf '%s' '<service_role key>'                 | vercel env add SUPABASE_SERVICE_ROLE_KEY production
printf '%s' '2'                                  | vercel env add PG_POOL_MAX production
printf '%s' 'georisco-fotos'                     | vercel env add SUPABASE_STORAGE_BUCKET production
```
> Use o **Transaction Pooler (porta 6543)** do Supabase no `DATABASE_URL` de produção (serverless).
Deploy:
```bash
vercel --prod --yes
```
Anote a URL (ex.: `https://georisco.vercel.app`). Teste: `GET /` deve responder `{"status":"ok"}`.

### 3.3 Frontend na Vercel
```bash
cd src/frontend
vercel link --yes --project georisco-frontend
printf '%s' 'https://georisco.vercel.app/api' | vercel env add VITE_API_BASE_URL production
vercel --prod --yes
```
A Vercel detecta Vite, builda e serve. O `vercel.json` cuida do fallback de SPA.

### 3.4 CORS (opcional, pra endurecer)
No projeto `georisco`, setar `CORS_ORIGIN = https://georisco-frontend.vercel.app` e redeployar o backend.
(Sem isso, o backend já libera qualquer origem e funciona.)

---

## 4. Verificação
```bash
# backend
curl https://georisco.vercel.app/                      # {"status":"ok",...}
curl https://georisco.vercel.app/api/prioridades       # dados do banco

# frontend
curl -I https://georisco-frontend.vercel.app/          # 200 text/html
curl -I https://georisco-frontend.vercel.app/mapa      # 200 (fallback SPA)

# CORS (backend reflete a origem do frontend)
curl -i -H "Origin: https://georisco-frontend.vercel.app" \
  https://georisco.vercel.app/api/prioridades | grep -i access-control-allow-origin
```

---

## 5. Redeploy (depois de mudar código)
```bash
cd src/geoRisco   && vercel --prod   # backend
cd src/frontend   && vercel --prod   # frontend
```
As env vars já ficam salvas no projeto Vercel; não precisa setar de novo.

---

## 6. Segurança
- A `SUPABASE_SERVICE_ROLE_KEY` dá acesso total (ignora RLS) → **só no backend**, nunca no frontend.
- Se uma chave/senha vazar (ex.: foi colada em chat), **rotacione**:
  Supabase → Settings → API (roll key) e resetar senha do banco → atualizar `.env` local +
  env vars da Vercel → `vercel --prod`.

---

## 7. Problemas que enfrentamos (e a solução)
| Sintoma | Causa | Solução |
|---|---|---|
| `GET /` → 500 `Invalid export found` | Vercel detectou Express e tentou usar `server.ts` (sem export) | `builds`/`routes` explícitos no `vercel.json` |
| `No Output Directory "public" found` | `"framework": null` fez a Vercel achar que era site estático | Trocar por `builds`/`routes` |
| `migrate`: `Cannot find module './connection.js'` | `ts-node` + `rewriteRelativeImportExtensions` do TS6 | Rodar via `tsx` |
| Nome de projeto inválido na Vercel | nome derivado tinha maiúscula (`geoRisco`) | `--project georisco` (minúsculo) |
| `tsc`: `import.meta.env` não existe | faltava tipo do Vite | criar `src/vite-env.d.ts` |
| Chamadas da API bloqueadas no navegador | CORS ausente (domínios diferentes) | `cors` no `app.ts` |
