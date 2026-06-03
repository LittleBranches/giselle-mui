---
sidebar_label: "PR12 - Timeline enhancements"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/12)** — [`feature/timeline-enhancements`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-enhancements) — 1 May – 1 May 2026


# PR 12 — feature/timeline-enhancements

This folder contains the message documents for PR 12.

---

## Additional Context: pr-12-feature-timeline-enhancements.md

# feat: TimelineTwoColumn enhancements, IconActionBar, yalc build pipeline

## Summary

22 commits · 32 files changed · +3,752 / -739 lines · 239 tests passing

This PR covers three areas:

1. **`TimelineTwoColumn` major feature pass** — three-level disclosure, viewed state, eye buttons, corner alert badges, column-side alignment rules, done-dot colour enforcement, accessibility hardening, and a comprehensive regression test suite.
2. **`IconActionBar` — new component** — horizontal row of `Tooltip` + `IconButton` pairs with a `DEFAULT_ICON_ACTIONS` set, full test coverage, and Storybook stories.
3. **Build pipeline: junction → yalc** — `package.json` exports corrected, `tsup.config.ts` `'use client'` banner added, `local-development.md` rewritten, README corrected.

---

## 1. `TimelineTwoColumn` — feature pass

### 1a. Three-level title disclosure

`TimelinePhase` and milestone items now expose a three-level disclosure model:

| State | What renders |
|---|---|
| **Rest** (collapsed) | `shortTitle` (2–4 word glanceable label, falls back to `title`) |
| **Hover** (pre-click) | Full `title` + `description` — no layout shift on click |
| **Expanded** (after click) | Full `title` + `description` + `details[]` |

`PhaseCard` and `MilestoneBadge` implement this via a CSS-driven hover transition with a JavaScript click toggle for expansion. The hover state does **not** change alignment — only the expanded state resets `textAlign`.

### 1b. Viewed state (`isViewed` / `onMarkViewed`)

Both `TimelinePhase` and milestone items accept `isViewed?: boolean` and `onMarkViewed?: () => void`. This renders an eye icon button that:

- Uses `aria-pressed={isViewed}` and a state-aware `aria-label` (`'Mark as viewed'` / `'Mark as not viewed'`)
- Uses icon variant change (`bold` ↔ `outline`) **plus** a foreground colour change — never opacity alone (WCAG 1.4.11)
- Is always clickable — `cursor: 'default'` is never set on a toggleable control
- Has `cursor: 'pointer'` on the button element

Eye icon sizes are exported constants with regression tests:

```ts
export const PHASE_EYE_ICON_SIZE = 20;       // phase-card.tsx
export const MILESTONE_EYE_ICON_SIZE = 20;   // milestone-badge.tsx
```

### 1c. Corner alert badge (`PhaseCard`)

`PhaseCard` accepts `alertIcon?: ReactNode`, `alertTooltip?: string`, and `columnSide: 'left' | 'right'` (default `'right'`).

The badge floats on the **outer** edge of the card — away from the spine — so it never overlaps milestone dots. Positioning is computed by `resolveCornerBadgeAlign(columnSide)` (exported for regression tests).

| `columnSide` | Badge position |
|---|---|
| `'right'` | `right: 0, transform: translate(50%, -50%)` |
| `'left'` | `left: 0, transform: translate(-50%, -50%)` |

In `timeline-two-column.tsx`, `columnSide` is set to the **inverse** of `phase.side` because `phase.side` describes which column is _opposite_ the phase.

### 1d. Done-dot colour enforcement

`resolveEffectiveColor(color, done)` in `timeline-dot.tsx` forces `color='success'` when `done=true`, regardless of the phase's `color` prop. The done dot is **always green with a checkmark** — the phase colour cannot override it.

The centre-column Box in `timeline-two-column.tsx` applies `filter: grayscale(1)` to the _card_ only, never to the dot's wrapper — so done dots remain green even when their surrounding card is greyed.

Regression test: `timeline-dot.test.ts` → `resolveEffectiveColor — done-dot color enforcement`.

### 1e. `MilestoneBadge` column-side alignment

Left-column milestones right-align their collapsed title and inline elements so text sits flush against the centre spine. Alignment resets to left when expanded. **Hover does not change alignment.**

`MilestoneBadge` accepts `columnSide: 'left' | 'right'` (default `'right'`). In `timeline-two-column.tsx` the correct side is passed at both call sites.

### 1f. Tooltip on `TimelineDot`

`TimelineDot` now accepts `tooltip?: string`. A `Tooltip` wraps the dot — showing phase status and date on hover. The tooltip is suppressed when empty.

### 1g. `sortPhases` — `key`-based sort option

`utils.ts` extends `sortPhasesByDate(phases, sortOrder)` with a `'key'` option. `TimelineTwoColumnProps` accepts `sortOrder: 'asc' | 'desc' | 'key'` (default `'desc'`). In `'key'` mode phases sort strictly by `phase.key` ascending, ignoring dates — fractional keys (e.g. `4.5`) interleave life events between roles.

### 1h. `TimelinePlatformItem` object form

`TimelinePlatformItem` now accepts `{ icon: ReactNode; label: string }` in addition to the legacy `string` form. The object form renders a tooltip-wrapped icon slot. The string form is retained as a backward-compat shim.

### 1i. New test files

| File | Tests |
|---|---|
| `milestone-badge.logic.test.ts` | `hasDetails` guard, minimum size constants |
| `milestone-badge.interaction.test.ts` | Expand/collapse, `isViewed` toggle, click handlers |
| `milestone-badge.test.ts` | Structure, ARIA, `columnSide` alignment, eye button regression |
| `phase-card.test.ts` | `resolveCornerBadgeAlign` regression, eye button WCAG regression, structure |
| `timeline-dot.test.ts` | `resolveEffectiveColor` regression |
| `utils.test.ts` | `sortPhasesByDate` (asc / desc / key modes), `getLastYear`, `parseFirstDate`, `detectPhaseOverlaps` |
| `timeline-two-column.column-placement.test.ts` | Column placement invariant |

---

## 2. `IconActionBar` — new component

**Why it exists:** MUI's `Tooltip` does not render when its direct child is a disabled `IconButton`. The fix is a `<span>` wrapper between them. This is easy to forget and rediscover. `IconActionBar` encodes the pattern once.

### Files

| File | Purpose |
|---|---|
| `icon-action-bar.tsx` | Component + `IconActionItem` interface + `DEFAULT_ICON_ACTIONS` |
| `icon-action-bar.test.ts` | 15 tests — structure, ARIA, click handlers, disabled state, `href`/`component` forwarding |
| `icon-action-bar.stories.tsx` | Default, CustomActions, WithDisabled, Responsive stories |
| `index.ts` | Barrel: `IconActionBar`, `IconActionBarProps`, `IconActionItem`, `DEFAULT_ICON_ACTIONS` |
| `README.md` | Why it exists, design decisions, library safety |

### API

```ts
interface IconActionItem {
  tooltip: string;
  icon: ReactNode;
  onClick?: IconButtonProps['onClick'];
  href?: string;
  component?: React.ElementType;
  disabled?: boolean;
  'aria-label'?: string;
  tooltipPlacement?: TooltipProps['placement'];
}

interface IconActionBarProps extends BoxProps {
  actions?: IconActionItem[];  // defaults to DEFAULT_ICON_ACTIONS
}
```

`DEFAULT_ICON_ACTIONS` provides Edit / View / Print / Send / Share using Solar icons.

### Exported from `src/index.ts`

```ts
export { IconActionBar, DEFAULT_ICON_ACTIONS } from './components/icon-action-bar';
export type { IconActionBarProps, IconActionItem } from './components/icon-action-bar';
```

---

## 3. Build pipeline: junction → yalc

### Problem

The portfolio consumed `@littlebranches/giselle-mui` via a Windows junction pointing at the TypeScript source. This worked with `transpilePackages` + webpack. When switched to Turbopack + yalc, two issues emerged:

**Issue 1 — `Module not found: Can't resolve '@littlebranches/giselle-mui'`**

`package.json` root `exports` pointed to `./src/index.ts`. yalc copies `package.json` verbatim without applying `publishConfig`. Turbopack tried to load a TypeScript file from `node_modules` and gave up.

Fix: root-level `exports`/`main`/`module`/`types` now point directly to `dist/`:

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "publishConfig": { "access": "public" }
}
```

**Issue 2 — `createContext only works in Client Components`**

The dist had no `'use client'` directive. When the roadmap page (a Server Component) imported `GiselleIcon` through a data file with no client boundary, Next.js RSC evaluated the giselle-mui bundle on the server and hit MUI's `createContext`.

Fix: `banner: { js: "'use client';" }` in `tsup.config.ts`:

```ts
export default defineConfig({
  banner: { js: "'use client';" },
  // ...
});
```

All components use MUI hooks/context/browser APIs — the entire bundle is correctly client-only.

### `tsup external` rule enforcement

`tsup.config.ts` `external` array is now kept in sync with every `peerDependencies` key. `@mui/lab` was added when the lab Timeline primitives were adopted. The enforcement checklist is documented in `.github/copilot-instructions.md`.

### Documentation

- `docs/local-development.md` — fully rewritten around the yalc workflow (old junction content removed)
- `README.md` — Status corrected to "Not yet published to npm"; local development section updated; `IconActionBar` added to components table

---

## Test suite

```
Test Files  13 passed (13)
     Tests  239 passed (239)
  Duration  ~10s
```

All six quality gate checks pass: Prettier → ESLint → `tsc --noEmit` → Vitest → tsup build → Storybook build.

---

## Files changed

| Area | Files |
|---|---|
| New component | `src/components/icon-action-bar/` (5 files) |
| Timeline enhancements | `src/components/timeline-two-column/` (13 files) |
| Build config | `package.json`, `tsup.config.ts`, `vitest.config.ts` |
| Docs | `README.md`, `docs/local-development.md`, `docs/theming/roadmap.md`, `docs/components/` |
| Instructions | `.github/copilot-instructions.md` |
| Barrel | `src/index.ts` |

---

## Additional Context: pr-12-timelinetwocolumn-enhancements-iconactionbar-yalc-build-pipeline.md

# PR #12: TimelineTwoColumn enhancements, IconActionBar, yalc build pipeline

## Branch

`feature/timeline-enhancements` → `main`

## Date

2 May 2026

## Context

Historical PR record preserved for completeness in the PR messages index.

## Notes

- Title from GitHub: TimelineTwoColumn enhancements, IconActionBar, yalc build pipeline
- Closed PR document added so the PR history stays complete and easy to compare against local branch work.
