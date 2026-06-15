# Deploy — GeoRisco

Dois alvos, porque o backend não roda em hosting estático:

| Camada | Onde | O quê |
|---|---|---|
| Frontend (`src/frontend`) | **GitLab Pages** | SPA Vite/React (estático) |
| Backend (`src/geoRisco`) | **Vercel** (serverless) | API Express |
| Banco + Storage | **Supabase** | Postgres + bucket de fotos |

Frontend e backend ficam em domínios diferentes → o backend precisa de CORS liberado pra origem do Pages (já tratado pela variável `CORS_ORIGIN`).

---

## 1. Banco (Supabase) — primeiro

1. Crie um projeto em https://supabase.com.
2. **Settings → Database → Connection string → Transaction pooler (porta 6543)** → esse é o `DATABASE_URL` de produção. Use o pooler (não a conexão direta 5432): a Vercel é serverless e abriria conexões demais.
3. **Settings → API**: `Project URL` → `SUPABASE_URL`; `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY` (**nunca** no frontend).
4. Bucket de fotos `georisco-fotos` (Storage → New bucket, **private**) — ou deixe a migration `07_create_storage_bucket.sql` criar.

### Rodar as migrations (uma vez, da sua máquina)
Não rodam na Vercel (o runner usa `ts-node` + os `.sql` em `src/`). Rode local apontando pro banco de produção:

```powershell
cd src/geoRisco
$env:DATABASE_URL="<connection string do Supabase>"
npm run migrate
```

> ⚠️ O runner não controla versão de migration e o `01_*.sql` tem `CREATE TYPE` sem `IF NOT EXISTS`. Rode **uma vez** num banco limpo; reexecutar dá erro.

---

## 2. Backend → Vercel (via CLI)

A Vercel **não conecta no GitLab self-hosted** do Inteli, então o deploy é pela CLI:

```bash
npm i -g vercel
cd src/geoRisco
vercel          # 1ª vez: login + cria o projeto (aceite os defaults)
vercel --prod   # deploy de produção
```

Já existem `src/geoRisco/vercel.json` e `src/geoRisco/api/index.ts`, então a Vercel transpila o Express como função serverless e manda todas as rotas pra ela (rewrite `/(.*) → /api`).

### Variáveis na Vercel (Settings → Environment Variables, ou `vercel env add`)

| Variável | Valor | Obrigatória |
|---|---|---|
| `DATABASE_URL` | connection string **pooler 6543** | ✅ |
| `SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | service role (secreta) | ✅ |
| `CORS_ORIGIN` | URL do Pages | ✅ (senão o navegador bloqueia) |
| `SUPABASE_STORAGE_BUCKET` | `georisco-fotos` | opcional (já é o default) |
| `PG_POOL_MAX` | `2` | recomendado em serverless |

Após o deploy a Vercel dá uma URL (ex.: `https://georisco.vercel.app`). A **URL da API é essa + `/api`**. Teste: `GET https://<url>.vercel.app/` deve responder `{"status":"ok"}`.

---

## 3. Frontend → GitLab Pages

1. **Settings → CI/CD → Variables**: adicione `VITE_API_BASE_URL = https://<url>.vercel.app/api` (URL da Vercel + `/api`).
2. O job `pages` (no `.gitlab-ci.yml`) roda na **branch padrão**. Ele deriva o `base` do Vite de `$CI_PAGES_URL`, copia `index.html → 404.html` (fallback de SPA) e publica `public/`.
3. Pra publicar agora: **merge de `feat/deploy` na branch padrão** → o pipeline roda e a aba **Deploy → Pages** mostra a URL.

> ⚠️ Confirme que o **GitLab Pages está habilitado** na instância do Inteli (menu Deploy → Pages do projeto). Se não estiver, dá pra publicar o frontend na Vercel também — me avise que ajusto.

---

## 4. Checklist
- [ ] Supabase criado; migrations rodadas uma vez
- [ ] Backend na Vercel respondendo em `GET /`
- [ ] `CORS_ORIGIN` (Vercel) = URL do Pages
- [ ] `VITE_API_BASE_URL` (GitLab) = URL da Vercel + `/api`
- [ ] Merge na branch padrão → Pages publicado
- [ ] Abrir o app, testar um deep link (ex.: `/mapa`) e uma listagem (valida CORS + API)
