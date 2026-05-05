# feat: Phase B theme preset + StatCard + RadialProgressCard + layout extractions

## Branch

`feature/giselle-theme-preset` → `main`

## Summary

Four major areas of new work shipped in this branch:

1. **Phase B — Giselle brand theme preset** — `giselleTheme` and palette constants exported and documented.
2. **Layout component extractions (Phase E)** — `SectionTitle`, `TwoColumnShowcaseRow`, and `FloatingSubNav` moved from the private `alexrebula` portfolio into `giselle-mui` as independently reusable, MIT-licensed components.
3. **`StatCard` component** — new KPI card with sparkline chart slot, trend indicator, decoration slot, maturity badge, and full test coverage.
4. **`RadialProgressCard` component** — new multi-series radialBar chart card using ApexCharts, with full styles and tests. Replaces the broken single-series `ReadinessGauge` in the `alexrebula` store-readiness section.

Supporting changes: utility sub-path for server-safe exports, Storybook title convention standardisation, naming convention enforcement, roadmap Phase H planning.

---

## 1 — Phase B: Giselle brand theme preset

### What shipped

- **`src/utils/theme-preset.ts`** — `giselleTheme` via `extendTheme()` with the full Giselle palette. Exported from `src/index.ts`.
- **Palette constants** — `GISELLE_PRIMARY`, `GISELLE_SECONDARY` (Mango gold `#F5A623`), full light/dark mode values.
- **`docs/theming/nextjs.md`** — full usage guide: zero-config `CssVarsProvider` wiring, palette decision rationale, both light and dark mode examples.
- **`src/utils/theme-preset.test.ts`** — 16 tests covering palette keys, `extendTheme` output, and dark-mode token resolution.

### Palette decisions

| Key                                | Light main           | Dark main            | Rationale                                 |
| ---------------------------------- | -------------------- | -------------------- | ----------------------------------------- |
| `primary`                          | `#2E7D32` Deep grove | `#76C442` Lime       | Brand identity — mango tree grove         |
| `secondary`                        | `#F5A623` Mango gold | `#F5A623` Mango gold | Unchanged across modes — the mango itself |
| `info / success / warning / error` | MUI v7 defaults      | MUI v7 defaults      | Standard semantic colors                  |

---

## 2 — Layout component extractions (Phase E)

Three components extracted from `alexrebula/src/` and rewritten from scratch in `giselle-mui`. No code copied — copyright boundary enforced.

### `SectionTitle` — `src/components/layout/section-title/`

Reusable section header: `overline` + `heading` + optional `caption`. Accepts `sx` and `...other` spread. Storybook story + 8 Vitest tests + styles.test.ts.

### `TwoColumnShowcaseRow` — `src/components/layout/two-column-showcase-row/`

Responsive two-column showcase layout: left description column + right content slot. Collapses to single column on mobile. 5 Vitest tests.

### `FloatingSubNav` — `src/components/nav/floating-sub-nav/`

Sticky in-page section navigator. Accepts `items: { id, label }[]`, tracks active section via `IntersectionObserver`, highlights the current item. Uses `motion.div` (never `m.div` — avoids `LazyMotion` provider requirement). Full types, styles, 5 tests + styles.test.ts.

---

## 3 — `StatCard` component — `src/components/card/stat/`

A KPI metric card used in section dashboards. Encodes several non-obvious decisions:

### Features

- **Sparkline chart slot** — `chart?: ReactNode` — consumer renders `<ReactApexChart type="line" ...>` directly. No ApexCharts dep inside the library.
- **Trend indicator** — `trend: 'up' | 'down' | 'neutral'` with `trendLabel: string`. Green/red/grey colour is derived from `color` prop + `trend`.
- **Decoration slot** — `decoration?: ReactNode` — for `<MetricCardDecoration>` or `<GiselleIcon>` overlaid at bottom-right of the card.
- **Maturity badge** — optional `maturity?: 'alpha' | 'beta' | 'stable' | 'lts'` chip in the top-right corner.
- **`color` prop** follows MUI palette key convention (`primary | secondary | info | success | warning | error`).

### Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `stat-card.tsx`            | Pure JSX composition                             |
| `stat-card.styles.ts`      | All sx constants + factory functions             |
| `stat-card.styles.test.ts` | 16 mock-theme assertions                         |
| `stat-card.test.ts`        | 10 render tests                                  |
| `stat-card.stories.tsx`    | Full Storybook story with all variants           |
| `types.ts`                 | `StatCardProps`, `StatCardColor`, `StatCardItem` |
| `index.ts`                 | Barrel                                           |
| `README.md`                | Why it exists, design decisions                  |

### Fix: decoration element position

`decorationSx` was incorrectly positioned `top: -20, left: -20`. Regression test expected `bottom: -20, right: -20` (the correct outer-edge anchor). Fixed and test now green.

---

## 4 — `RadialProgressCard` component — `src/components/chart/radial-progress/`

A multi-series radialBar chart card. Generic replacement for the broken single-series `ReadinessGauge` in `alexrebula/src/sections/store-readiness/`.

### Features

- **Multi-series** — `series: RadialProgressItem[]` — each item has `label`, `value` (0–100), and `color: StatCardColor`.
- **`total` + `totalLabel`** — centred in the donut hole (e.g. `35` + `'% Ready'`).
- **SSR-safe** — uses `React.lazy(() => import('react-apexcharts'))` + `Suspense`. No Next.js `dynamic()` dependency — the library stays framework-agnostic.
- **`chartHeight`** — configurable, defaults to 280px.
- **Legend row** — colour dots + labels + values rendered below the chart in pure MUI JSX.
- **Extends `CardProps`** — accepts `sx`, `title?`, `subheader?`, and all MUI Card props.

### Files

| File                                  | Purpose                                                       |
| ------------------------------------- | ------------------------------------------------------------- |
| `radial-progress-card.tsx`            | Lazy ApexCharts + Card layout                                 |
| `radial-progress-card.styles.ts`      | `buildRadialProgressOptions(theme, ...)`, legend sx constants |
| `radial-progress-card.styles.test.ts` | 13 tests covering formatter, colors, labels, fallback         |
| `radial-progress-card.test.ts`        | 6 render tests (legend labels/values, header conditional)     |
| `types.ts`                            | `RadialProgressItem`, `RadialProgressCardProps`               |
| `index.ts`                            | Barrel                                                        |
| `README.md`                           | Design decisions, SSR approach, consumer usage                |

### Color strategy

Uses `theme.palette[color].main` (not CSS vars) — ApexCharts renders SVG via JavaScript and cannot read CSS custom properties at runtime.

---

## 5 — Server-safe utils sub-path (`@alexrebula/giselle-mui/utils`)

`src/utils-index.ts` exports server-safe utilities separately. The tsup config builds a second entry (`utils: 'src/utils-index.ts'`) with no `'use client'` banner, so RSC-compatible data files can import from `@alexrebula/giselle-mui/utils` without triggering a `'use client'` boundary in server components.

Current exports from the utils sub-path:

- `assignMilestoneSidesByDone`
- `channelAlpha`, `hexToChannel`, `pxToRem`, `remToPx`
- `resolveMaturity`
- Theme utility helpers

---

## 6 — `TimelineTwoColumn` milestone placement improvements

- `assignMilestoneSidesByDone` — server-safe utility that assigns `side` to milestones based on `done` state, enabling the two-column layout to auto-balance left/right placement.
- Extracted `styles.ts` and `utils.ts` companions for the two-column component — sx constants and pure logic functions separated from JSX.
- `timeline-utils.ts` — new helper module with `resolveTimelinePosition` and related utilities; 7 Vitest tests.

---

## 7 — Roadmap and dev quality

### Roadmap

- **Phase A** ✅ — theming utilities marked complete (4 May 2026).
- **Phase B** ✅ — brand preset marked complete (5 May 2026).
- **Phase E** ✅ — SectionTitle, TwoColumnShowcaseRow, FloatingSubNav marked done.
- **Phase H** planned — Portfolio Layout & Application Shell Extraction (TrackerSectionLayout, AppTopBar, AppSidebarDrawer, AppLayout, LoginCard, DonutSummaryCard, AreaSparklineCard). Blocked on Phases C + D.
- Label column added to all task tables.

### Dev quality

- **Storybook title conventions** — all stories migrated to the canonical group map (`Cards/Stat`, `Data Display/Icon`, `Navigation/Floating Sub Nav`, `Layout/Section Title`, etc.). `'Components'` group abolished.
- **Naming conventions** — `*.stories.tsx` and `*.test.ts` glob conventions enforced. Files named `stories.tsx` or `test.ts` (no component-name prefix) renamed.
- **GiselleIcon + SelectableCard** — removed from this package and re-added under the correct namespace structure.

---

## 8 — Copilot review fixes (post-review batches)

Fixes applied after initial review comments on this PR.

### `RadialProgressCard` — dot size, palette fallbacks, useMemo deps

- **`LEGEND_DOT_SIZE = 12`** — legend dot was `10 × 10`. Raised to 12 to meet the minimum readable size rule for status indicators (`>= 12px`). Exported as a named constant; regression test added.
- **Hardcoded hex fallbacks removed** — `legendDotSx` was using `?? '#888'` / `?? '#222'` / `?? '#e0e0e0'` when `theme.vars` was absent. Replaced with `theme.palette.text.secondary`, `theme.palette.text.primary`, and `(theme.vars?.palette.grey[200] ?? theme.palette.grey[200])`. Tests updated to assert palette tokens instead of raw hex.
- **`resolvedColors` useMemo deps** — `theme` was missing from the dependency array (stale closure). Added `theme` to deps; removed the now-unnecessary `eslint-disable` comment.
- **`resolvedColors[i] ?? '#1976d2'` fallback** — hardcoded hex replaced with `theme.palette.primary.main`.

### `FloatingSubNav` — inline sx extraction

- `stickyInnerSx` extracted from an inline `sx={{ transform: 'translateY(-100%)', pointerEvents: 'auto', pb: { xs: '23px', md: '31px' } }}` (4 properties — over the ~3-property limit) to a named constant in `floating-sub-nav.styles.ts`. Two new tests in `floating-sub-nav.styles.test.ts`.

### `docs/theming/nextjs.md` — import path correction

- Two `giselleTheme` import examples corrected from `'@alexrebula/giselle-mui'` to `'@alexrebula/giselle-mui/utils'`. The root import carries a `'use client'` banner; the utils sub-path is server-safe.

### `TwoColumnShowcaseRow` — Grid v2 clarifying comment

- Added a comment explaining that `@mui/material/Grid` exports Grid v2 in MUI v7 (Grid v1 was removed) and that the `size={}` prop is the correct v2 API.

### `.github/copilot-instructions.md` — peer deps rule

- Component rule #1 updated to explicitly list the extended peer dep set (`@mui/lab`, `framer-motion`, `apexcharts`, `react-apexcharts`) and cross-reference the **Additional allowed peer dependencies** section, so the rule is no longer inconsistent with `package.json`.

### `README.md` — brought up to date

- Components table: added `StatCard`, `FloatingSubNav`, `SectionTitle`, `TwoColumnShowcaseRow`.
- Roadmap table: added Phase B row (`giselleTheme` preset, ✅ Done 5 May 2026).
- License independence note: corrected to list all open-source peers (`@mui/lab`, `framer-motion`, optional `apexcharts`/`react-apexcharts`).
- Peer deps install block: added `@mui/lab`, `framer-motion`, and the optional ApexCharts pair.

---

## Test summary

| Scope                          | Tests                | Status         |
| ------------------------------ | -------------------- | -------------- |
| All test files                 | **629**              | ✅ All passing |
| New — `RadialProgressCard`     | 20 (styles + render) | ✅             |
| New — `StatCard`               | 26 (styles + render) | ✅             |
| New — `FloatingSubNav`         | 15 (render + styles) | ✅             |
| New — `maturity-utils`         | 17                   | ✅             |
| New — `timeline-utils`         | 7                    | ✅             |
| Existing — `TimelineTwoColumn` | unchanged            | ✅             |

---

## Checklist

- [x] Phase B `giselleTheme` exported and tested (16 tests)
- [x] `SectionTitle` extracted + tested (8 tests)
- [x] `TwoColumnShowcaseRow` extracted + tested (5 tests)
- [x] `FloatingSubNav` extracted + tested (15 tests)
- [x] `StatCard` shipped + tested (26 tests)
- [x] `RadialProgressCard` shipped + tested (20 tests)
- [x] Server-safe utils sub-path (`@alexrebula/giselle-mui/utils`) builds cleanly
- [x] `decorationSx` regression fixed (bottom-right position)
- [x] Storybook titles follow canonical group map
- [x] Phase H roadmap entry added
- [x] `LEGEND_DOT_SIZE = 12` — minimum readable size enforced + regression test
- [x] Hardcoded hex fallbacks replaced with palette tokens
- [x] `resolvedColors` useMemo deps include `theme`
- [x] `stickyInnerSx` extracted + tested
- [x] `docs/theming/nextjs.md` import corrected to `/utils`
- [x] `README.md` updated (components, roadmap, peer deps)
- [x] `npm run check:verify` passes (Prettier → ESLint → tsc → 629 tests → tsup build → Storybook build)
