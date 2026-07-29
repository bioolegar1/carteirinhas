# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static Angular frontend that renders digital student ID cards ("carteirinha estudantil") from a hardcoded local dataset. No backend, no auth, no persistence — deployed as a static site to Vercel (`vercel.json` rewrites everything to `index.html`). The original static-HTML prototype this app was migrated from is kept at `commands/carteirinha.html` for reference.

Node version is pinned in `.nvmrc` (26).

## Commands

```bash
npm start              # ng serve (dev server)
npm run build           # ng build -> dist/carteirinha-estudantil
npm run lint            # eslint on src/**/*.ts and src/**/*.html
npm test                # ng test --watch=false --browsers=ChromeHeadless (Karma/Jasmine)
npm run e2e             # playwright test (spins up npm start on 127.0.0.1:4310 automatically)
```

Single test file:
- Karma/Jasmine: no built-in single-file flag via the npm script; run `ng test --watch=false --browsers=ChromeHeadless --include='**/student-card.component.spec.ts'` (adjust path).
- Playwright: `npx playwright test e2e/student-card.spec.ts`, or `npx playwright test -g "renders not found state"` to filter by title.

Playwright runs two projects (`desktop`, `mobile`/Pixel 7) against every spec by default.

## Architecture

Everything lives under `src/app/student-cards/`:

- `models/student-card.model.ts` — `StudentCardData` shape (personal/document/course fields, `photoUrl?`, `qrImageUrl?`, nested `issuer`/`validator`/`benefit` data).
- `data/student-cards.data.ts` — the entire "database": a `readonly STUDENT_CARDS[]` array of predefined registrations. Shared sub-objects (`sharedBenefit`, `sharedIssuer`, `sharedValidator`) are spread across cards. **Adding a new student = adding an entry here** (plus a photo/QR asset under `public/assets/`); no other file needs to change.
- `services/student-card-data.service.ts` — `StudentCardDataService.findById(id)` looks up a card by id, falling back to the first card in the array when `id` is null; returns `null` when not found.
- `pages/student-card-page/` — top-level page. Reads `?id=` from the query string via `ActivatedRoute` (no route params, no card list/selector UI — direct-link-only by design, see PRD), resolves the card through a `computed()`, and owns fullscreen toggling.
- `components/student-card/` — the flip container. Holds `flipped`/`displayedBack`/`turning` signals; the ~380ms/760ms `setTimeout` pair in `flip()` staggers the CSS flip animation from the visible face swap, so don't "simplify" it without checking the animation timing in the `.scss`.
- `components/student-card-front/` and `student-card-back/` — front/back faces. Front tracks `photoFailed` (set via `(error)` on the `<img>`) to show a placeholder instead of a broken image; there's no analogous QR-missing signal because the QR is optional and just conditionally rendered.
- `components/app-header/`, `components/bottom-nav/` — chrome components, no state.

Routing (`app.routes.ts`) is a single wildcard-to-root route — the app is effectively one page, and identity resolution happens entirely through the query string, not through Angular route params.

## Conventions

- Angular schematics default (`angular.json`) already enforce standalone components, SCSS, and `ChangeDetectionStrategy.OnPush` for anything generated with `ng generate` — match that by hand for anything written manually.
- Component selectors must be `app-` prefixed kebab-case (enforced by eslint `@angular-eslint/component-selector`).
- Styles are per-component `.scss` files (no global 7-1 SCSS structure exists in `src/`, despite what `rules/scss-architecture.md` documents generically).
- `rules/*.md` and `agents/*.md` are a shared fullstack (Angular + Java/Spring Boot, "DocIQ") template reused across projects. Only `rules/angular.md` and `rules/scss-architecture.md` are relevant here; `java.md`, `spring-boot.md`, `rest-api.md`, `openapi-swagger.md` describe a backend that doesn't exist in this repo.
- `commands/`, `templates/`, `tasks/`, `enablers/` implement a slash-command PRD workflow (`criar-prd` → `criar-techspec` → `criar-tasks` → `executar-task`, reviewed by the `task-reviewer` agent). `tasks/prd-carteirinha-estudantil-estatica/` is the completed record for this feature (`prd.md`, `techspec.md`, `tasks.md`, and per-task `N_task.md`/`N_task_review.md`) — useful as historical context for *why* the app looks the way it does, not a template to imitate for unrelated changes.
