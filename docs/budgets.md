# Performance & Accessibility Budgets (v1)

These budgets help keep the MVP fast and usable. Treat them as **release gates**.

## Performance Budgets
- **Lighthouse Performance ≥ 85** on both `/` (landing) and `/idea/[slug]` (public page).
- **API latency:** **p50 < 800ms** and **p95 < 1500ms** for app-owned APIs (**excluding** the upstream LLM round trip).
- **Core Web Vitals (targets):**
  - **LCP** < 2.5s (good) on 3G Fast / mid-tier device.
  - **CLS** < 0.1
  - **INP** < 200ms
- **Page weight (guideline):** < 300 KB critical CSS/JS for the landing and public page.
- **Requests (guideline):** < 25 HTTP requests on first load.

## Accessibility Budgets
- **Color contrast:** **≥ 4.5:1** for body text (≥ 3:1 for large text/icons).
- **Keyboard support:** 100% interactive elements operable via keyboard; no trapped focus.
- **Focus visibility:** clear focus styles on all interactive elements; include **Skip to content** link.
- **Labeling:** every input has a `<label>`; icon-only buttons have `aria-label`.
- **Images:** meaningful images have `alt`; decorative images `alt=""`.
- **Structure:** logical heading order (H1→H2→H3), proper landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`).

## How to Check (quick)
- **Lighthouse:** run in Chrome DevTools → target ≥ 85 on Performance (desktop & mobile).
- **axe DevTools / Lighthouse A11y:** fix all **Serious**/**Critical** issues; aim for zero violations.
- **Manual a11y pass:** tab through the app, verify focus order and visibility; test with screen reader if possible.

## Notes
- LLM latency is excluded from API p50; measure only your app’s processing time and network overhead to the LLM gateway.
- If a budget fails, log an issue, assign an owner, and track fix-before-release.
