---
sidebar_label: "PR20 - Refactor timeline subfolders"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/20)** — [`refactor/timeline-subfolders`](https://github.com/AlexRebula/giselle-mui/tree/refactor/timeline-subfolders) — 4 May – 4 May 2026


# refactor(timeline-two-column): nest sub-components in own subfolders

## What

Each internal sub-component of `TimelineTwoColumn` now lives in its own subfolder inside `src/components/timeline-two-column/`:

```
timeline-two-column/
  milestone-badge/
    milestone-badge.tsx  →  index.ts + styles.ts + *.test.ts
  phase-card/
    phase-card.tsx       →  index.ts + styles.ts + *.test.ts
  phase-warning-popover/
    phase-warning-popover.tsx  →  index.ts + styles.ts + *.test.ts
  spine-connector/
    spine-connector.tsx  →  index.ts + styles.ts + *.test.ts
  timeline-dot/
    timeline-dot.tsx     →  index.ts + styles.ts + *.test.ts
```

Each subfolder has its own `index.ts` barrel so import paths from the parent are unchanged (`'./phase-card'` → same).

## Why

The flat `timeline-two-column/` folder had 40+ files. Co-locating each sub-component's source, styles, and tests in a named subfolder makes the folder scannable and each component's surface area obvious at a glance.

## Checklist

- All quality gate checks pass (Prettier ✓ ESLint ✓ tsc ✓ Vitest 504 ✓ tsup ✓ Storybook ✓)
- No behaviour changes — pure file move + barrel wiring
- Import paths from `timeline-two-column/index.ts` unchanged
