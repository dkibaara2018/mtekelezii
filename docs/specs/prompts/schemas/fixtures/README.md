```markdown
# Mtekelezi — Turn any idea into a 7‑day action plan

> **Thesis:** Convert a raw idea into tasks + a 7‑day schedule, save it, publish a public one‑pager, and export an `.ics` calendar — in under a minute.

## 0. Live Links (fill after deploy)
- **App:** https://YOUR-SUBDOMAIN.vercel.app
- **Public Example Page:** https://YOUR-SUBDOMAIN.vercel.app/idea/YOUR-SLUG

## 1. Problem → Solution
- **Problem:** People stall after ideation; planning is slow and consistency is hard.
- **Solution (MVP):** A tiny agent turns a raw idea into a prioritized plan + 7‑day schedule, persists it, and generates a shareable one‑pager with a calendar export.

## 2. Tech Stack (Free)
- **Frontend:** Next.js (App Router) + Tailwind CSS + shadcn/ui + Lucide icons
- **Backend:** Next.js API routes (Vercel serverless)
- **Auth & DB:** Supabase (Postgres + Auth + RLS)
- **LLM API:** OpenRouter / Together / Hugging Face Inference (free tier/trial)
- **Hosting:** Vercel (free)
- **Domain:** Vercel subdomain; optional free domain later

## 3. Architecture Overview
```
[Browser]
  ├─ UI (Next.js / Tailwind / shadcn)
  └─ Fetch → /api/* (server-only secrets)

[Next.js API Routes]
  ├─ POST /api/ideas/create
  ├─ POST /api/agent/run     (Reason → Plan → Act → Verify)
  ├─ POST /api/pages/publish
  ├─ POST /api/tasks/update
  └─ GET  /api/ics/[ideaId].ics

[Agent Tools (server functions only)]
  ├─ createTasks(ideaId, tasks[])
  ├─ scheduleTasks(ideaId, schedule.days[])
  ├─ generateOnePager(ideaId, plan)
  └─ consistencyCheck(ideaId)

[Supabase]
  ├─ Auth (users)
  └─ DB (profiles, ideas, tasks, pages) + RLS

[LLM Provider]
  └─ JSON-only responses (strict schema)
```

## 4. Data Model (high level)
- **profiles**: id, email, created_at
- **ideas**: id, user_id, title, raw_input, summary, success_criteria(jsonb), is_public, created_at
- **tasks**: id, idea_id, user_id, title, description, priority(P1|P2|P3), status(TODO|DOING|DONE), estimate_hours, due_date, created_at
- **pages**: id, idea_id, user_id, hero, problem, solution, plan_md, cta_text, public_slug, is_public, created_at

## 5. API Contracts
**POST** `/api/ideas/create`
```json
{ "title": "string", "raw_input": "string" }
```
→ `{ "ideaId": "uuid" }`

**POST** `/api/agent/run`
```json
{ "ideaId": "uuid" }
```
→ `{ "ideaId": "uuid", "publicUrl": "/idea/my-slug", "icsUrl": "/api/ics/uuid.ics", "status": "PLANNING|ACTING|VERIFYING|DONE|FAILED" }`

**POST** `/api/pages/publish`
```json
{ "ideaId": "uuid", "is_public": true }
```
→ `{ "publicUrl": "/idea/my-slug" }`

**POST** `/api/tasks/update`
```json
{ "taskId": "uuid", "status": "TODO|DOING|DONE" }
```
→ `{ "ok": true }`

**GET** `/api/ics/[ideaId].ics` → returns `text/calendar`

## 6. Agent Contract (JSON-only)
**Schema (Plan)**
```json
{
  "summary": "string",
  "success_criteria": ["string"],
  "tasks": [
    {"title":"string","description":"string","priority":"P1|P2|P3","estimate_hours":1}
  ],
  "schedule": {"days": [{"day_offset":0, "task_titles":["..."]}]}
}
```
**Loop:** IDLE → PLANNING → ACTING (createTasks → scheduleTasks → generateOnePager) → VERIFYING → DONE | FAILED

## 7. Security & Privacy
- Secrets never in client; stored as env vars on Vercel.
- Validate all inputs (Zod); strip unknown fields.
- Supabase **RLS** on all tables (owner-only). Public read only when `pages.is_public=true`.
- Rate-limit `/api/agent/run` (e.g., 5/hour/user). Return 429 on breach.
- Sanitize markdown; never render raw HTML from the model.

## 8. Setup
```bash
# clone & install
pnpm i   # or npm i / yarn

# env (create .env.local)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_ANON_KEY=
LLM_API_KEY=
LLM_MODEL_ID=   # e.g., openrouter/some-model-id
```
- Create Supabase project; run schema SQL; enable RLS policies.
- Configure Vercel project + environment variables.

## 9. Development
```bash
pnpm dev   # http://localhost:3000
```
- Sign in (Supabase Auth UI or custom flow).
- Create an idea → Run agent → View dashboard → Publish page → Download `.ics`.

## 10. Testing
- **Unit:** JSON validation (Plan schema), schedule mapping.
- **Integration:** `/api/agent/run` saves tasks/pages; public page renders.
- **Security:** Cross-user read/write blocked (RLS). Anonymous agent run blocked.
- **UX:** Mobile layout; keyboard navigation; visible focus.

## 11. Deployment
- Deploy to Vercel (import GitHub repo). Set env vars.
- Smoke test a full idea → plan flow in production.

## 12. Scope & Constraints
- **Must-haves:** Auth, idea create, agent run, dashboard, public page, `.ics` export.
- **Out-of-scope (v1):** Collaboration, comments, payments, search tools, images, analytics, vector memory.
- **Constraints:** ≤ 35 hours, free tiers only, minimal PII.

## 13. Success Criteria (Week 1)
- Idea → plan ≤ 60s.
- JSON parse errors < 1% across 20 runs.
- Lighthouse ≥ 85 (landing + public page).

## 14. Definition of Done (MVP)
- Live URL on Vercel; working auth; end-to-end plan generation; shareable public page; `.ics` downloads; README updated.

## 15. Roadmap (Week Plan)
- Day 1: Foundations, data model, wireframes, scope.
- Day 2: Project scaffold, Tailwind, shadcn, Supabase Auth/DB.
- Day 3: Idea create + LLM wiring.
- Day 4: Agent tools + persistence.
- Day 5: UI polish + public page.
- Day 6: `.ics` + hardening + rate limits.
- Day 7: Tests + deploy + demo content.
```


