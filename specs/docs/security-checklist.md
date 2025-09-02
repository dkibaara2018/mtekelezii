# Security Checklist (v1)

## Secrets & Config
- [ ] All API keys live in server-side env vars (Vercel). Nothing in client bundles.
- [ ] `.env.local` not committed; `.env.example` provided.

## Auth & RLS
- [ ] Supabase Auth required for all `/api/*` except public page & static assets.
- [ ] Row Level Security enabled on `profiles`, `ideas`, `tasks`, `pages`.
- [ ] Owner-only policies for CRUD; public SELECT allowed only when `pages.is_public = true`.

## Input Validation
- [ ] Zod (or Valibot) validates every API payload; unknown fields stripped.
- [ ] Rate-limit `/api/agent/run` (e.g., 5/hour/user). Return HTTP 429 with friendly message.

## LLM Safety & Contracts
- [ ] JSON-only contract enforced; parse + schema-validate; one repair retry.
- [ ] No tool execution decided by the LLM; server chooses from allow-list only.

## Output Sanitization
- [ ] Render markdown via safe renderer; disallow raw HTML.
- [ ] No user-provided HTML or scripts rendered.

## Public Pages
- [ ] Unpublished pages return 404.
- [ ] Slugs are generated server-side; unique; no information leakage.

## Audits & Logs
- [ ] Log agent runs (user_id, idea_id, status) without storing PII beyond email.
- [ ] Monitor 4xx/5xx error rates in Vercel/Supabase dashboards.

