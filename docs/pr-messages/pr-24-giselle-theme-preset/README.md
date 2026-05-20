---
sidebar_label: "PR24 - Giselle theme preset"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/24)** — [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset) — 5 May – 5 May 2026


# PR 24 — feature/giselle-theme-preset

This folder contains the message documents for PR 24.

---

## Additional Context: pr-24-feature-phase-b-statcard-radial-progress.md

# fix: Copilot review fixes from PR #23 — palette tokens, legend dot size, sx extraction, README

## Branch

`feature/giselle-theme-preset` → `main`

## Context

PR #23 (`feature/giselle-theme-preset`) was closed. This PR (#24) contains the remaining
commits from that branch: post-review fixes and documentation updates that were not yet
in `main` when #23 closed.

All the feature work (Phase B `giselleTheme`, `StatCard`, `RadialProgressCard`, `SectionTitle`,
`TwoColumnShowcaseRow`, `FloatingSubNav`) was already merged to `main` via PR #23.

---

## Changes

### 1 — `RadialProgressCard` — legend dot size, palette fallbacks, useMemo deps

**Files:** `radial-progress-card.styles.ts`, `radial-progress-card.styles.test.ts`, `radial-progress-card.tsx`

- **`LEGEND_DOT_SIZE = 12`** — legend dot was `10 × 10`. Raised to 12 to meet the minimum
  readable size rule for status indicators (`>= 12px`). Exported as a named constant.
  Regression test added asserting `LEGEND_DOT_SIZE >= 12`.

- **Hardcoded hex fallbacks removed** — `legendDotSx` used `?? '#888'` / `?? '#222'` /
  `?? '#e0e0e0'` when `theme.vars` was absent. Replaced with `theme.palette.text.secondary`,
  `theme.palette.text.primary`, and `(theme.vars?.palette.grey[200] ?? theme.palette.grey[200])`.
  Tests updated to assert palette tokens instead of raw hex strings.

- **`resolvedColors[i] ?? '#1976d2'` fallback** — hardcoded hex replaced with `theme.palette.primary.main`.

- **`resolvedColors` useMemo deps** — `theme` was missing from the dependency array (stale closure).
  Added `theme` to deps; removed the now-unnecessary `eslint-disable` comment.

### 2 — `FloatingSubNav` — inline sx extraction

**Files:** `floating-sub-nav.styles.ts`, `floating-sub-nav.styles.test.ts`, `floating-sub-nav.tsx`

- `stickyInnerSx` extracted from an inline `sx` object (4 properties — over the ~3-property limit)
  to a named constant in `floating-sub-nav.styles.ts`.
- Two new tests: `'floats the pill upward via translateY(-100%)'` and `'restores pointer events on the inner box'`.

### 3 — `docs/theming/nextjs.md` — import path correction

- Two `giselleTheme` import examples corrected from `'@littlebranches/giselle-mui'` to
  `'@littlebranches/giselle-mui/utils'`. The root import carries a `'use client'` banner and
  cannot be used in RSC-compatible data files; the `/utils` sub-path is server-safe.

### 4 — `TwoColumnShowcaseRow` — Grid v2 clarifying comment

- Added a comment explaining that `@mui/material/Grid` exports Grid v2 in MUI v7 (Grid v1
  was removed) and that the `size={}` prop is the correct v2 API — not an accidental Grid v1 import.

### 5 — `.github/copilot-instructions.md` — peer deps rule

- Component rule #1 updated to explicitly list the extended peer dep set (`@mui/lab`,
  `framer-motion`, `apexcharts`, `react-apexcharts`) and cross-reference the **Additional
  allowed peer dependencies** section. The old wording listed only 6 peers, which contradicted
  `package.json`.

### 6 — `README.md` — brought up to date

- **Components table**: added `StatCard`, `FloatingSubNav`, `SectionTitle`, `TwoColumnShowcaseRow`.
- **Roadmap table**: added Phase B row (`giselleTheme` preset, ✅ Done 5 May 2026).
- **License independence note**: corrected to list all open-source peers (`@mui/lab`,
  `framer-motion`, optional `apexcharts`/`react-apexcharts`).
- **Peer deps install block**: added `@mui/lab`, `framer-motion`, and the optional ApexCharts pair.
- **Table formatting**: fixed column separator width in `TwoColumnShowcaseRow` row and
  roadmap status column.

---

## Files changed

| File | Change |
| --- | --- |
| `src/components/chart/radial-progress/radial-progress-card.styles.ts` | `LEGEND_DOT_SIZE = 12`; palette token fallbacks |
| `src/components/chart/radial-progress/radial-progress-card.styles.test.ts` | Regression test + updated fallback assertions |
| `src/components/chart/radial-progress/radial-progress-card.tsx` | `theme` in useMemo deps; palette fallback |
| `src/components/nav/floating-sub-nav/floating-sub-nav.styles.ts` | `stickyInnerSx` constant added |
| `src/components/nav/floating-sub-nav/floating-sub-nav.styles.test.ts` | 2 new tests |
| `src/components/nav/floating-sub-nav/floating-sub-nav.tsx` | Use `stickyInnerSx` |
| `src/components/layout/two-column-showcase-row/two-column-showcase-row.tsx` | Grid v2 comment |
| `docs/theming/nextjs.md` | `/utils` import path |
| `.github/copilot-instructions.md` | Peer deps rule |
| `README.md` | Components, roadmap, license note, formatting |

---

## Test summary

| Scope | Tests | Status |
| --- | --- | --- |
| All test files | **629** | ✅ All passing |
| Updated — `RadialProgressCard` styles | +1 regression test | ✅ |
| Updated — `FloatingSubNav` styles | +2 new tests | ✅ |

No new components. No tests removed.

---

## Checklist

- [x] `LEGEND_DOT_SIZE = 12` — minimum readable size enforced + regression test
- [x] Hardcoded hex fallbacks replaced with palette tokens throughout
- [x] `resolvedColors` useMemo deps include `theme`; eslint-disable comment removed
- [x] `stickyInnerSx` extracted to styles file + tested
- [x] `docs/theming/nextjs.md` import corrected to `/utils`
- [x] `TwoColumnShowcaseRow` Grid v2 comment added
- [x] `.github/copilot-instructions.md` peer deps rule consistent with `package.json`
- [x] `README.md` updated (components, roadmap, license note, formatting)
- [x] `npm run check:verify` passes (Prettier → ESLint → tsc → 629 tests → tsup build → Storybook build)

---

## Additional Context: pr-24-fix-documentation-and-styling-issues-from-copilot-review.md

# PR #24: Fix documentation and styling issues from Copilot review

## Branch

`feature/giselle-theme-preset` → `main`

## Date

5 May 2026

## Context

Historical PR record preserved for completeness in the PR messages index.

## Notes

- Title from GitHub: Fix documentation and styling issues from Copilot review
- Closed PR document added so the PR history stays complete and easy to compare against local branch work.
