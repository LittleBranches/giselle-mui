---
sidebar_label: "PR21 - Refactor component structure"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/21)** — [`refactor/structure-and-extract`](https://github.com/AlexRebula/giselle-mui/tree/refactor/structure-and-extract) — 4 May – 4 May 2026


# refactor: universal component structure convention + check-structure gate

## What

Stacked on #20. A large structural refactor to make the component tree consistently navigable and add a CI-enforced structure gate.

### 1. Namespace grouping

Components moved into domain namespaces:

```
src/components/
  card/
    metric/   ← was metric-card/
    quote/    ← was quote-card/
  timeline/
    two-column/   ← was timeline-two-column/
      two-column.tsx         ← renamed from timeline-two-column.tsx
      types.ts               ← extracted from two-column.tsx
      utils.ts               ← extracted from two-column.tsx
      styles.ts              ← extracted inline sx
      stories.tsx            ← renamed from timeline-two-column.stories.tsx
      stories.styles.ts      ← extracted from stories.tsx
      milestone-badge/
      phase-card/
      phase-warning-popover/
      spine-connector/
      timeline-dot/
```

### 2. `check-structure.js` gate

A new `scripts/check-structure.js` enforces the convention at CI time:

- **No flat component files** — every `.tsx` in `src/components/` must live inside a subfolder (never `src/components/foo.tsx`)
- **Checked as step 0** of the quality gate (`npm run check:verify`)

### 3. Inline sx extraction

All remaining inline `sx` objects in `two-column.tsx` extracted to `styles.ts`:
- `centerColumnSx`, `timelineRootSx`, `markerRowInnerSx`, `markerCaptionSx`, `markerDateSpanSx`

## Checklist

- All quality gate checks pass (Structure ✓ Prettier ✓ ESLint ✓ tsc ✓ Vitest 504 ✓ tsup ✓ Storybook ✓)
- Public barrel exports unchanged — consumers import from `@alexrebula/giselle-mui` as before
- `src/index.ts` updated to new paths
