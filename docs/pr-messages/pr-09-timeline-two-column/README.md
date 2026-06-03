---
sidebar_label: "PR09 - TimelineTwoColumn"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/9)** — [`feature/timeline-two-column`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-two-column) — 29 Apr – 29 Apr 2026


# PR 9 — feature/timeline-two-column

This folder contains the message documents for PR 9.

---

## Additional Context: pr-9-feature-timeline-two-column.md

# feat: TimelineTwoColumn component, Storybook infrastructure, CI/CD pipeline

## Summary

This PR delivers four major areas of work:

1. **`TimelineTwoColumn` component** — the main new component, with all sub-components, tests, and stories
2. **Storybook infrastructure** — configuration, stories for all existing components, and a pre-push hook
3. **Quality gate + CI** — ESLint, Prettier, Vitest, tsup, and Storybook build checks wired as a single script and GitHub Actions workflow
4. **Vercel deploy pipeline** — automated Storybook deployment on every merge to `main`, gated on quality gate passing

---

## 1. `TimelineTwoColumn` component

A two-column MUI Lab `Timeline` that renders career or roadmap phases alternating left and right with milestone badges.

### Sub-components (all in `src/components/timeline-two-column/`)

| File | Purpose |
|---|---|
| `timeline-two-column.tsx` | Root component — sorts phases, renders the full timeline |
| `timeline-dot.tsx` | Unified dot for phase and milestone rows. Supports active state with an animated pulsation ring (CSS `::after`), done state with a checkmark, and checklist mode with click toggle |
| `phase-card.tsx` | Card for one phase — title, description, date, platforms strip, expandable details, scenario/life-event variants |
| `milestone-badge.tsx` | Small badge rendered alongside a phase for secondary events |
| `spine-connector.tsx` | Vertical line between phases, dimmed when `done` |
| `animations.ts` | `pulseRing` and `checkPop` keyframe definitions |
| `types.ts` | `TimelinePhase`, `TimelineTwoColumnProps`, `HighlightedPaletteKey` |
| `utils.ts` | `sortPhasesByDate`, `getLastYear`, `parseLastDate` |
| `index.ts` | Barrel export |

### Key design decisions

- **`overflow: hidden` moved off root** — the pulsation ring uses `inset: -5px` on `::after`, which requires `overflow: visible` on the outer Box. An inner clip Box handles `border-radius` clipping for the dot background. This was a bug where the ring was silently clipped and only discovered visually.
- **`TimelineColumn` regression lock** — the two column Boxes are extracted into a local `TimelineColumn` helper that must not be inlined. It exists to prevent the near-identical left/right Boxes from drifting during refactors.
- **`data-active` attribute** — the outer Box carries `data-active="true"` when `active=true` and `size='phase'`, enabling test assertions and consumer CSS hooks.

### Tests

| File | What it covers |
|---|---|
| `timeline-dot.test.ts` | `data-active` attribute presence/absence, done-state checkmark, click/keydown interaction |
| `phase-card.test.ts` | Renders title, description, date; platforms strip; details expansion |
| `milestone-badge.interaction.test.ts` | Click/keyboard toggle |
| `milestone-badge.logic.test.ts` | Label rendering, done state |
| `spine-connector.test.ts` | `done` prop dims the connector |
| `timeline-two-column.column-placement.test.ts` | Phases appear in the correct column (left/right) |
| `utils.test.ts` | `sortPhasesByDate`, `parseLastDate`, `getLastYear` |

### Stories

- `timeline-two-column.stories.tsx` — `ReadOnly` (3 phases: right/left/right, one active with `activeLabel:'Now'`, satisfies column-placement invariant) and `ChecklistMode`
- `timeline-dot.stories.tsx` — Default, Active, DonePhase, MilestoneDefault, MilestoneDone, ChecklistPhase (with hook), ChecklistMilestone (with hook), AllColors, AllColorsActive

---

## 2. Storybook infrastructure

- **`.storybook/main.ts`** — react-vite builder, component glob includes `src/**/*.stories.tsx`
- **`.storybook/preview.tsx`** — wraps all stories in `ThemeProvider` (MUI v7 `CssVarsProvider` + Emotion cache)
- **Stories for all existing components** — `GiselleIcon`, `MetricCard`, `QuoteCard`, `SelectableCard`
- All stories use `argTypes: { control: false }` for `ReactNode` and `SxProps` slots
- Named component helpers (`ChecklistPhaseDemo`, `ChecklistMilestoneDemo`) for stories that use React hooks — required by `react-hooks/rules-of-hooks`

---

## 3. Quality gate

A single Node script (`scripts/quality-gate.js`) runs all six checks in order:

```
Prettier → ESLint → tsc --noEmit → Vitest → tsup build → Storybook build
```

- `npm run check` — auto-fix Prettier + ESLint, then verify
- `npm run check:verify` — verify only (used in CI and pre-push)
- `INCLUDE_STORYBOOK` is always true in CI (`CI=true`) and enabled via `--storybook` flag in the pre-push hook
- **`.githooks/pre-push`** — runs `check:verify` before every push; resolved to handle Windows Git hook PATH issues (node not found in GitLens shell — hook falls back gracefully rather than blocking the push)

---

## 4. CI / Vercel deploy pipeline

Two GitHub Actions workflows:

### `ci.yml` — runs on every push and every PR

Runs the full quality gate in verify mode on `ubuntu-latest` / Node 22.

### `deploy-storybook.yml` — runs only on push to `main`

Two jobs:
- **`quality-gate`** — full six-check gate (same as CI)
- **`deploy`** (`needs: quality-gate`) — `vercel pull` → `vercel build --prod` → `vercel deploy --prebuilt --prod`

If quality gate fails, the deploy job is blocked. The previously deployed Storybook version stays live.

**Vercel auto-deploy is disabled** (`"github": { "enabled": false }` in `vercel.json`) — only this workflow deploys to Vercel.

Required GitHub secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — all set.

---

## 5. Documentation

| File | What it covers |
|---|---|
| `docs/local-development.md` | Day-to-day workflow, HMR, junction setup, the ESM static analysis trap (root cause + fix), 5 alternative workflows, interview summary |
| `docs/storybook-deploy.md` | Full Vercel deploy pipeline setup, one-time steps, how to re-create |

---

## The ESM static analysis trap (notable fix)

After `TimelineTwoColumn` was added to `src/index.ts`, the `alexrebula` consumer app compiled without errors but crashed at runtime:

```
Element type is invalid: expected a string (or class/function) but got: undefined
```

Root cause: `giselle-mui` has `"type":"module"` in `package.json`. This triggers webpack 5's strict ESM mode (`fullySpecified: true`), which validates export names statically **before transpilation**. Extension-less barrel re-exports (`export { X } from './x'` without `.tsx`) cannot be resolved in strict ESM mode, so webpack marked `TimelineTwoColumn` as "not exported" — silently at compile time, fatally at runtime.

Fix in `alexrebula/next.config.ts`:

```ts
config.module.rules.push({
  test: /node_modules\/@littlebranches\/giselle-mui\/.*\.[jt]sx?$/,
  resolve: { fullySpecified: false },
});
```

This opts giselle-mui's source files out of strict ESM mode. It is a targeted one-line rule that affects nothing else. Fully documented in `docs/local-development.md`.

---

## Checklist

- [x] All six quality gate checks pass (`npm run check:verify`)
- [x] All tests pass (156 tests)
- [x] Storybook builds cleanly
- [x] `TimelineTwoColumn` renders correctly in `alexrebula` dev server (runtime error resolved)
- [x] ESM pitfall documented in `docs/local-development.md`
- [x] Vercel deploy pipeline configured and secrets set

---

## Additional Context: pr-9-timelinetwocolumn-component-storybook-infrastructure-ci-cd-pipeline.md

# PR #9: TimelineTwoColumn component, Storybook infrastructure, CI/CD pipeline

## Branch

`feature/timeline-two-column` → `main`

## Date

29 Apr 2026

## Context

Historical PR record preserved for completeness in the PR messages index.

## Notes

- Title from GitHub: TimelineTwoColumn component, Storybook infrastructure, CI/CD pipeline
- Closed PR document added so the PR history stays complete and easy to compare against local branch work.
