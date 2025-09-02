# Security Checklist (v1.1) — with Light Threat Model

This file lists the **minimum security controls** for the Mtekelezi MVP and a light threat model mapping controls → threats → tests.

---

## 0) Quick Checklist (tick before release)
- [ ] **Input validation (Zod)** on every API, unknown fields stripped.
- [ ] **Server-only secrets** (Vercel env vars); no keys in client bundle.
- [ ] **RLS owner-only** policies on `profiles`, `ideas`, `tasks`, `pages`.
- [ ] **Public pages return 404** unless `pages.is_public = true` (and slug exists).
- [ ] **Rate limit `/api/agent/run`** (e.g., 5/hour/user) with friendly 429 UI.

---

## 1) System Model (what we protect)
- **Assets:** user email identity, idea/task/page data, API keys (OpenRouter, Supabase), deployment config.
- **Actors:** authenticated user, anonymous visitor (public page), external LLM API.
- **Entry points:** `/api/ideas/create`, `/api/agent/run`, `/api/pages/publish`, `/api/tasks/update`, `/api/ics/[id].ics`, `/idea/[slug]`.

## 2) Trust Boundaries
- **Client ↔ Server (Next.js API)** — do not trust client input.
- **Server ↔ Supabase** — enforce RLS and server-side `user_id` checks.
- **Server ↔ LLM Provider** — send minimal data; validate JSON on return; no secrets in prompts.

---

## 3) Light Threat Model (controls, threats, tests)

### A) Input Validation (Zod)
**Threats:** schema mismatch, injection payloads, oversize bodies → crashes/DoS.  
**Control:** Zod schemas per route; `strict()` or `strip()` unknown fields; cap lengths.  
**How to test:** send invalid enums, missing fields, and 10k‑char strings; expect 400 with safe error.

### B) Server‑Only Secrets
**Threats:** API key leakage via client bundle, logs, or public pages.  
**Control:** keys in server env only; never expose via `NEXT_PUBLIC_`; mask logs; rotate on incident.  
**How to test:** search client bundle for `OPENROUTER`/`SUPABASE` strings; verify none present.

### C) RLS Owner‑Only
**Threats:** cross‑tenant reads/writes (user A viewing B’s data).  
**Control:** enable RLS on all tables; owner‑only policies; server sets `user_id`.  
**How to test:** attempt to read/write another user’s `idea_id` — expect 403/0 rows.

### D) Public Pages 404 Unless `is_public = true`
**Threats:** private data exposure via predictable slugs or mistaken publish states.  
**Control:** public endpoint reads only when `is_public=true`; otherwise 404; generate non‑guessable slug.  
**How to test:** access unpublished slug → 404. Flip `is_public=true` → page loads with only safe fields.

### E) Rate Limit `/api/agent/run`
**Threats:** abuse/DoS and quota exhaustion at LLM provider.  
**Control:** IP+user rate limit (e.g., 5/hour/user) and short cooldown; return 429; log attempts.  
**How to test:** trigger >5 calls/hour; verify 429 and UI toast; logs contain event.

---

## 4) Extra Hardening (nice to have)
- **Sanitize markdown**; never render raw HTML from the model.
- **JSON‑only contract**; on parse failure, single repair retry then fail safely.
- **Error hygiene:** generic error messages; no stack traces in responses.
- **Observability:** count `/api/agent/run` 2xx/4xx/5xx; alert on spikes.

---

## 5) Snippets (documentation only)

**Zod example**
```ts
const IdeaCreate = z.object({
  title: z.string().min(3).max(120),
  raw_input: z.string().min(10).max(4000)
}).strict(); // or .strip()
```

**Rate limit idea (pseudocode)**
```ts
// 5/hour/user on /api/agent/run
if (calls_in_last_hour(userId) >= 5) return res.status(429).json({ error: "Rate limit" });
```

**Public page gate (SQL-ish)**
```sql
select * from pages where public_slug = $1 and is_public = true;
-- if no row: 404
```

---

## 6) Sign‑off
Before each deploy, confirm the **Quick Checklist** is fully ticked. File issues for any gaps and assign an owner/date.
