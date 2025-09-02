# ADR-0001: Stack & Hosting

**Status:** Accepted (2025-09-02)  
**Context:** MVP in ≤ 35 hours using only free tiers. Must demonstrate LLM reasoning/planning/acting, secure persistence (RLS), simple hosting, and fast developer experience. Keys must remain server-side.

## Decision
Use **Next.js (App Router)** + **Tailwind + shadcn/ui** on **Vercel**, with **Supabase** (Postgres + Auth + Row-Level Security) as the backend, and **OpenRouter** as the LLM provider using the free model:
- `mistral/mistral-small-24b-instruct-2501:free`

### Rationale
- **DX & speed:** Next.js + Vercel = minimal setup, instant deploy previews, serverless API routes.
- **Security:** Supabase RLS for multi-tenant isolation; server-only secrets via Vercel env vars.
- **Cost:** All components have usable free tiers for a week-long MVP.
- **LLM contract:** OpenAI-compatible API, large context, reliable free variant. Enforce JSON-only outputs.

## Scope Affected
- Frontend, serverless APIs, auth flows, database schema, and the agent’s Reason→Plan→Act loop.

## Alternatives Considered
- **Remix / SvelteKit:** Great frameworks; chose Next.js for ecosystem/docs and easy Vercel integration.
- **Firebase (Auth/Firestore):** Good free tier; Supabase chosen for SQL + RLS and simple Postgres queries.
- **Clerk/Auth0 for auth:** Nice UIs; Supabase Auth keeps footprint and vendor count smaller.
- **Direct OpenAI/Together-only:** Chosen OpenRouter for model diversity and a stable free `:free` variant.
- **Self-hosted DB:** Overkill for week-1 MVP; free Postgres via Supabase is adequate.

## Consequences
- **Pros:** Fast to build and deploy; secure-by-default tenancy via RLS; minimal ops.
- **Cons:** Vendor rate limits (LLM) and Supabase/Vercel free-tier constraints; need JSON-validation and request throttling.
- **Mitigations:** Per-user rate limits; one-shot JSON repair; cache last successful plan; smoke-test RLS; 404 for unpublished pages.

## Operational Notes
- **Env vars:** `OPENROUTER_API_KEY`, `LLM_MODEL_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- **Headers (optional):** `HTTP-Referer` and `X-Title` for OpenRouter attribution.
- **Token budgets:** Keep responses ≤ 1200 tokens; total context ≪ 32k.

## Links
- `/docs/security-checklist.md` — controls and RLS
- `/specs/api-contracts.md` — API shapes
- `/prompts/system.txt` — JSON-only system prompt
