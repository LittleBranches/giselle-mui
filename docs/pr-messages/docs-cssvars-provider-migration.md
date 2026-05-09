# docs: CssVarsProvider → ThemeProvider migration — remove all deprecated API references

## Summary

Replaces every reference to the deprecated `CssVarsProvider` + `extendTheme()` API across
all documentation, README files, test comments, and the companion `alexrebula` data files.
`CssVarsProvider` was the early experimental approach from MUI v6/v7 pre-release. In MUI v7
stable, `ThemeProvider` was unified to handle CSS variables natively via `createTheme({ cssVariables: true })`.
Storybook was already migrated (see PR `feature-phase-warning-popover.md` — May 2026). The
written docs were still teaching the old way.

---

## Why

After Phase B shipped (`giselleTheme` exported 5 May 2026), the JSDoc on `theme-preset.ts`
still showed:

```tsx
import { CssVarsProvider } from '@mui/material/styles';
<CssVarsProvider theme={giselleTheme}>...</CssVarsProvider>;
```

Every consumer reading the docs would have copied a deprecated API. The fix needed to be
complete — partial updates leave the old pattern visible in at least one file, which is
enough to spread the wrong pattern.

**Key fact: `giselleTheme` does not need to change.** `giselleTheme` uses `extendTheme()`,
and `ThemeProvider` in MUI v7 accepts both `createTheme()` and `extendTheme()` results.
The implementation is correct; only the docs were wrong.

---

## What changed

### `src/` — TypeScript and README files

- **`src/utils/theme-preset.ts`** — JSDoc `@example` updated: `CssVarsProvider` → `ThemeProvider`,
  `import { CssVarsProvider }` → `import { ThemeProvider }`.
- **`src/components/icon/giselle/README.md`** — 3 code examples updated: Vite/CRA `main.tsx`,
  Next.js App Router layout, and Pages Router `_app.tsx`. All import `ThemeProvider` and wrap
  with `<ThemeProvider theme={theme}>`.
- **`src/components/chart/radial-progress/README.md`** — 1 inline reference: "MUI v7 with
  `CssVarsProvider` returns the CSS variable reference string" → "with `ThemeProvider` (CSS
  variables mode)".

### Test comments

Five test files had `// ... avoid CssVarsProvider ...` comments. Updated to reference
`ThemeProvider` — which is what Storybook's `preview.tsx` actually uses:

- `src/components/nav/floating-sub-nav/floating-sub-nav.test.ts`
- `src/components/chart/radial-progress/radial-progress-card.test.ts`
- `src/components/layout/section-title/section-title.test.ts`
- `src/components/card/quote/quote-card.test.ts`
- `src/components/card/metric/metric-card.test.ts`

### `docs/` — theming guides

- **`docs/theming/README.md`** — 1 line: "injected by `ThemeProvider` at the root of your app".
- **`docs/theming/react.md`** — full guide rewritten for the unified `ThemeProvider` API:
  - Setup now shows `createTheme({ cssVariables: true })` as the recommended approach.
  - `giselleTheme` presented as an alternative preset (not the only starting point).
  - Dark mode section updated to `ThemeProvider defaultMode=` props.
  - Key differences table: distinguishes v7 unified API from the old experimental approach.
  - Historical note preserved: "Early MUI v7 docs showed `extendTheme()` + `CssVarsProvider`
    — that was the old experimental approach. Do not copy it."
- **`docs/theming/nextjs.md`** — full guide rewritten:
  - App Router layout: `ThemeProvider` import + usage.
  - Pages Router `_app.tsx`: `ThemeProvider`.
  - `giselleTheme` usage section: `<ThemeProvider theme={giselleTheme}>`.
  - All 3 troubleshooting entries reference `ThemeProvider`.

### `docs/` — other docs

- **`docs/components/icon/giselle/iconify-registration.md`** — 3 code examples (App Router,
  Vite/CRA, Pages Router): all `CssVarsProvider` → `ThemeProvider`.
- **`docs/standalone-gap-analysis.md`** — "wire up a MUI `ThemeProvider` manually" (was
  `CssVarsProvider`).
- **`docs/components/settings/settings-provider-plan.md`** — "drives `ThemeProvider` theme
  state" (was `CssVarsProvider`).
- **`docs/incidents/timeline-hover-regression-may-2026.md`** — "requires `ThemeProvider`
  setup not yet in the test harness" (was `CssVarsProvider`).
- **`docs/roadmap.mdx`** — Phase C description, "Current state" import block, implementation
  snippet, and task table row all updated to reference `ThemeProvider`.

### `.github/copilot-instructions.md`

Three occurrences:

1. Test conventions: "ThemeProvider with `cssVariables: true` is required in Storybook".
2. Phase C description: "wraps `ThemeProvider` with the Giselle default palette".
3. Storybook infrastructure: "wraps stories in `ThemeProvider` with `cssVariables: true`".

### `README.md`

`⚠️ ThemeProvider requirement` section: text + code example updated to show
`ThemeProvider` + `createTheme({ cssVariables: true })`.

---

## What was intentionally left unchanged

- **`docs/theming/react.md` line 175** — historical note that explicitly says CssVarsProvider
  was the old approach. This is explanatory context — it must stay.
- **`docs/pr-messages/feature-phase-warning-popover.md`** — historical PR record documenting
  the original Storybook migration. Accurate as written.
- **`docs/pr-messages/feature-timeline-two-column.md`** — historical PR record.
- **`alexrebula/docs/roadmap/data.tsx` lines 525, 536** — blog post #34 titles: "Unit testing
  MUI v7 components with Vitest and jsdom (without CssVarsProvider)". The post topic is
  testing _without needing_ the provider — the title is correct and intentional.

---

## Companion alexrebula changes (same commit)

Two milestone description strings in the portfolio data layer were also updated:

- `src/sections-api/roadmap/data.tsx` — Phase B/C milestone description: "wrapping ThemeProvider".
- `src/sections-api/store-readiness/data.tsx` — Phase C milestone description: "wrapping ThemeProvider".
- `docs/roadmap.md` — Phase 1.5 `GiselleThemeProvider` milestone row: wording updated to match.

---

## Dist rebuild

`npm run build` and `yalc push` ran after all source edits. The `dist/*.map` source maps
now embed the corrected JSDoc from `theme-preset.ts`. Both `alexrebula` and `giselle-docs`
received the updated package via yalc.
