# LLM Notes (Provider, Model, Limits)

> This file documents the free LLM path for the Mtekelezi MVP.

## Primary Provider — OpenRouter
- **Model ID:** `mistral/mistral-small-24b-instruct-2501:free`
- **Endpoint (OpenAI-compatible):** `https://openrouter.ai/api/v1/chat/completions`
- **Auth header:** `Authorization: Bearer <OPENROUTER_API_KEY>`
- **Context window:** ~32,768 tokens (see model page).
- **Free limits:** up to **20 requests/minute**; per-day: **50 free calls/day** if you’ve purchased **< 10** credits, or **1000/day** if you’ve purchased **≥ 10** credits.
- **Why this model:** good speed/quality balance, large context for JSON plans, widely available “:free” variant.

**Sources**
- OpenRouter limits: https://openrouter.ai/docs/api-reference/limits
- OpenRouter FAQ on daily caps: https://openrouter.ai/docs/faq
- Model page (context): https://openrouter.ai/mistral/mistral-small-24b-instruct-2501%3Afree
- Optional headers: https://openrouter.ai/docs/api-reference/overview

## Fallback Provider — Together AI (only if burst RPM needed)
- **Typical free limits (chat/code):** **60 RPM** and **60,000 TPM** (allowed geographies only; model-specific exceptions apply).
- **Source:** https://docs.together.ai/docs/rate-limits

## Tertiary — Hugging Face Inference (Serverless)
- **Free limits:** documented as roughly “**few hundred requests/hour**,” and subject to change. OK for light usage, not for stable production throughput.
- **Source:** https://huggingface.co/learn/cookbook/en/enterprise_hub_serverless_inference_api

---

## JSON Output Contract (reminder)
- LLM **must** return **valid JSON only** (no markdown, no comments).
- On parse failure: **retry once** with `prompts/repair.txt`.
- Cap `max_tokens` to ~**1200** for responses (well under context window).

## Practical Max Tokens (our usage)
- **Inputs:** system + user prompt under ~2–3K tokens.
- **Outputs:** cap at **1200** tokens (fits schema + stays fast).
- **Total context:** comfortably below **32K**.

## Rate-limit Strategy (app-level)
- Per-user cooldown on `/api/agent/run`: **5/hour**.
- On HTTP **429**: wait **15–30s**, then allow a single retry.
- Show a friendly toast when rate-limited.

## Env Vars (add to `.env.local`)
```
OPENROUTER_API_KEY=sk-or-...
LLM_MODEL_ID=mistral/mistral-small-24b-instruct-2501:free
```
(Optional fallbacks)
```
TOGETHER_API_KEY=
HF_TOKEN=
```

## Quick Test (curl)
> Replace `sk-or-...` with your real key. Do **not** commit this.
```bash
curl -s https://openrouter.ai/api/v1/chat/completions   -H "Authorization: Bearer sk-or-REDACTED"   -H "Content-Type: application/json"   -H "HTTP-Referer: https://example.com"   -H "X-Title: Mtekelezi"   -d '{
    "model": "mistral/mistral-small-24b-instruct-2501:free",
    "temperature": 0.2,
    "max_tokens": 1200,
    "messages": [
      {"role":"system","content":"Return ONLY valid JSON: {\"ok\":true}"},
      {"role":"user","content":"Say ok"}
    ]
  }'
```

## Optional headers (OpenRouter)
- `HTTP-Referer`: your deployed site URL (helps attribution/leaderboards)
- `X-Title`: your app’s name (“Mtekelezi”)
(Source: https://openrouter.ai/docs/api-reference/overview)
