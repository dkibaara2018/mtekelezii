# Top Risks & Mitigations (v1)

1) Invalid JSON from LLM
   - Mitigate: Strict JSON schema; single repair retry; friendly failure UI + Retry button.

2) LLM quota/rate limit exceeded
   - Mitigate: Per-user cooldown (e.g., 10 min); cache last successful plan; 5/hour/user limit.

3) RLS misconfiguration
   - Mitigate: Owner checks server-side; RLS smoke tests; no client-side user_id control.

4) Data leakage in public pages
   - Mitigate: Private by default; explicit publish toggle; 404 for unpublished; minimal fields.

5) Schedule/task mismatch
   - Mitigate: Server-side consistency check; ensure all scheduled titles exist.

