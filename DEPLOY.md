# Deploy — GeoRisco

Ambiente em produção (tudo na **Vercel** + **Supabase**):

| Camada | Onde | URL |
|---|---|---|
| Frontend (`src/frontend`) | Vercel (projeto `georisco-frontend`) | https://georisco-frontend.vercel.app |
| Backend (`src/geoRisco`) | Vercel (projeto `georisco`) | https://georisco.vercel.app |
| Banco + Storage | Supabase | projeto `howgfoyrigyjzfvsqdgi` |

> O frontend e o backend são **dois projetos Vercel separados**, deploy via **Vercel CLI** (a Vercel não conecta no GitLab self-hosted do Inteli, então não é deploy-on-push). O GitLab CI (`.gitlab-ci.yml`) só roda testes/build — não faz deploy.

---

## Como redeployar

### Backend
```bash
cd src/geoRisco
vercel --prod
```
Config em `src/geoRisco/vercel.json` (builds/routes explícitos → só `api/index.ts` vira função; `server.ts` é só pro dev local).

### Frontend
```bash
cd src/frontend
vercel --prod
```
Config em `src/frontend/vercel.json` (rewrite de SPA → `index.html`, pro BrowserRouter). A URL do backend é lida de `VITE_API_BASE_URL` no build.

---

## Variáveis de ambiente (Vercel → Settings → Environment Variables)

### Projeto `georisco` (backend)
| Variável | Valor |
|---|---|
| `DATABASE_URL` | Supabase **Transaction Pooler (porta 6543)** |
| `SUPABASE_URL` | `https://howgfoyrigyjzfvsqdgi.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service role (secreta) |
| `PG_POOL_MAX` | `2` |
| `SUPABASE_STORAGE_BUCKET` | `georisco-fotos` |
| `CORS_ORIGIN` *(opcional)* | `https://georisco-frontend.vercel.app` — se não setar, libera qualquer origem |

> `PGSSL` não precisa: liga sozinho porque a Vercel define `NODE_ENV=production`.

### Projeto `georisco-frontend`
| Variável | Valor |
|---|---|
| `VITE_API_BASE_URL` | `https://georisco.vercel.app/api` |

---

## Banco de dados (Supabase)

Migrations já aplicadas (8 arquivos + bucket `georisco-fotos`). Para reaplicar num banco limpo:
```powershell
cd src/geoRisco
$env:DATABASE_URL = "<connection string do Supabase>"
$env:PGSSL = "true"
npm run migrate
```
> Roda via `tsx`. **Não é idempotente** (o `01_*.sql` tem `CREATE TYPE` sem `IF NOT EXISTS`) — rode uma vez só.

---

## ⚠️ Segurança — rotacionar credenciais
A `SUPABASE_SERVICE_ROLE_KEY` e a senha do banco foram expostas durante o setup. Gire as duas (Supabase → Settings → API → roll key; e resetar senha do DB) e atualize:
1. `src/geoRisco/.env` (local, gitignored)
2. as env vars do projeto `georisco` na Vercel
3. redeploy do backend (`vercel --prod`)

---

## Endurecer depois (opcional)
- Setar `CORS_ORIGIN` no backend pra travar só na origem do frontend.
- Domínio custom na Vercel, se quiser uma URL mais bonita.
