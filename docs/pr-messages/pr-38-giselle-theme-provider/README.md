---
sidebar_label: 'PR38 - GiselleThemeProvider (Phase C)'
---

**[Open](https://github.com/AlexRebula/giselle-mui/pull/38)** — [`feature/giselle-theme-provider`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-provider) — 13 May 2026

# PR: `feature/giselle-theme-provider`

> **Branch:** `feature/giselle-theme-provider` → `main`
> **PR:** [#38](https://github.com/AlexRebula/giselle-mui/pull/38)
> **Type:** `feature` — new component, new public API, docs update, Storybook infra
> **Opened:** 13 May 2026

---

## Summary

Phase C of the giselle-mui theming roadmap. Ships `GiselleThemeProvider` — a zero-config
`ThemeProvider` wrapper that uses the Giselle brand palette by default, accepts
`themeOverrides` for partial customisation, or accepts a fully custom `theme` for total bypass.

Introduces `giselleThemeOptions` as a new public export — the raw `CssVarsThemeOptions` object
that drives the Giselle preset, enabling consumers to build their own `extendTheme()` calls on
the Giselle base without depending on undocumented internals.

Wires the Giselle theme preset into the Storybook toolbar as the new default theme. Updates
`docs/theming/nextjs.md` with the recommended zero-config integration pattern.

This PR unblocks Phase D (`GiselleSettingsProvider`), which requires `GiselleThemeProvider` as
its foundation. 862 tests pass. Quality gate 6/6.

---

## What Changed

### `GiselleThemeProvider` — new component (`src/components/theme-provider/giselle/`)

Three-tier theme resolution, ordered by consumer control:

**1. Zero-config** — `<GiselleThemeProvider>` with no props uses `giselleTheme` (Giselle brand
palette) as the resolved theme. The consumer installs the library, wraps their app, and gets
the mango-grove palette immediately with no configuration.

**2. `themeOverrides`** — accepts a partial `CssVarsThemeOptions`. The internal `deepMerge`
utility merges the override on top of `giselleThemeOptions`, then calls `extendTheme()` once on
the result. The consumer controls only the tokens they care about; everything else stays as the
Giselle default.

**3. `theme`** — accepts a fully custom `extendTheme()` result (`CssVarsTheme`). Bypasses
`giselleThemeOptions` and `deepMerge` entirely. The consumer owns the full theme object;
`GiselleThemeProvider` ensures correct `ThemeProvider` wrapping with `defaultMode`.

Priority rule: `theme` > `themeOverrides` > default. If `theme` is provided, `themeOverrides`
is silently ignored (documented in README and JSDoc).

**`defaultMode`** defaults to `'system'` — respects OS colour preference out of the box.
See [Design decisions](#design-decisions) for why `'system'` is the correct default for a
library component.

**`'use client'`** — the component carries `'use client'` because `ThemeProvider` is a client
component. Correct for an App Router root layout wrapper.

**Public API:**

| Prop              | Type                            | Default    | Notes                                              |
| ----------------- | ------------------------------- | ---------- | -------------------------------------------------- |
| `children`        | `ReactNode`                     | required   | Content wrapped in the provider                    |
| `themeOverrides?` | `CssVarsThemeOptions`           | —          | Partial override merged onto `giselleThemeOptions` |
| `theme?`          | `CssVarsTheme`                  | —          | Fully custom theme — bypasses defaults entirely    |
| `defaultMode?`    | `'light' \| 'dark' \| 'system'` | `'system'` | Initial colour mode on first render                |

**Files:**

| File                  | Role                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------- |
| `giselle.tsx`         | Component implementation                                                              |
| `types.ts`            | `GiselleThemeProviderProps` interface                                                 |
| `giselle.test.ts`     | 6 Vitest tests                                                                        |
| `giselle.stories.tsx` | 4 Storybook stories                                                                   |
| `index.ts`            | Barrel — re-exports component and types                                               |
| `README.md`           | Why it exists, three-tier model, `deepMerge` rationale, `defaultMode='system'` choice |

---

### `src/utils/deep-merge.ts` — new internal utility

Recursive plain-object merge utility. Used only by `GiselleThemeProvider` to merge
`themeOverrides` on top of `giselleThemeOptions` before calling `extendTheme()`.

**Intentionally NOT exported from the package barrel** (`src/index.ts` or
`src/utils-index.ts`). Consumers who need to merge theme options should use the
`giselleThemeOptions` export + manual spread (documented in Option B, `theming/nextjs.md`).
Exporting `deepMerge` would create a public API contract for an internal implementation detail.

**Type constraint:** `T extends object` (not `T extends Record<string, unknown>`) because
`CssVarsThemeOptions` has no index signature. Internal casts to `Record<string, unknown>` are
used inside the function body to satisfy TypeScript without requiring an index signature on the
consuming type.

---

### `giselleThemeOptions` — new public export

`src/utils/theme-preset.ts` now exports `giselleThemeOptions: CssVarsThemeOptions` — the raw
input object used to construct `giselleTheme = extendTheme(giselleThemeOptions)`.

**Why this is exported:**

`giselleTheme` (the `extendTheme()` result, a `CssVarsTheme` object) cannot be spread into a
second `extendTheme()` call — it is the output, not the input. A consumer building their own
theme on the Giselle base (Option B) needs the raw `CssVarsThemeOptions` to spread. Without
this export, Option B was structurally impossible, and the docs example was wrong.

`giselleThemeOptions` also enables consumers to inspect exactly which tokens the Giselle preset
sets without reading source code.

Exported from:

- `src/index.ts` — main bundle
- `src/utils-index.ts` — `/utils` sub-path (server-safe)

---

### `docs/theming/nextjs.md` — zero-config section added

Added `### GiselleThemeProvider — zero config (recommended)` as the first section. Shows the
App Router `layout.tsx` pattern:

```tsx
import { GiselleThemeProvider } from '@littlebranches/giselle-mui';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GiselleThemeProvider>{children}</GiselleThemeProvider>
      </body>
    </html>
  );
}
```

Updated Option B to use `giselleThemeOptions` with manual spread. The previous example
incorrectly showed `...giselleTheme` — `extendTheme()` output cannot be spread into a second
`extendTheme()` call. Corrected to:

```ts
const myTheme = extendTheme({
  ...giselleThemeOptions,
  colorSchemes: {
    ...giselleThemeOptions.colorSchemes,
    light: {
      palette: {
        ...giselleThemeOptions.colorSchemes?.light?.palette,
        primary: { main: '#1976d2' },
      },
    },
  },
});
```

---

### `.storybook/preview.tsx` — Giselle theme preset wired

- `giselleTheme` imported from `src/utils/theme-preset`
- Registered as `'giselle'` in the `themes` registry alongside `'mui-default'`
- **Default changed from `'mui-default'` to `'giselle'`** — all stories open with the Giselle
  mango-grove palette by default. This is the correct default: the library's own stories should
  demonstrate the library's own palette, not the MUI default blue.
- Toolbar item added: `🥭 Giselle` (value `'giselle'`) — reflects the brand identity
- Both stale `Phase B:` TODO comments removed (they were planning notes for exactly this change)

The `as unknown as typeof muiDefaultTheme` cast in the registry is needed because `extendTheme()`
returns a `CssVarsTheme` while the registry is typed to `Theme` — structurally compatible at
runtime, different TypeScript shapes. See [Design decisions](#design-decisions) for rationale.

---

### Roadmap updates

- `giselle-mui/docs/roadmap.md` — Phase C heading marked `✅ Done — 13 May 2026`; all 7 task
  checkboxes set to ✅; aspirational code snippet updated to reflect actual shipped implementation
  (`giselleThemeOptions`, `deepMerge`, `defaultMode`)
- `alexrebula/docs/roadmap.md` — Phase C summary updated (bubble-up rule):
  `✅ Phase C shipped (GiselleThemeProvider component — zero-config, themeOverrides, full custom
  theme prop; Vitest + Storybook; giselleThemeOptions export for Option B consumers) — 13 May 2026`
- `alexrebula/src/sections-api/roadmap/data.tsx` — `giselle-mui Phase B/C` milestone:
  `color: 'warning'` → `color: 'success'`; description updated to include 13 May 2026 delivery
  date and `giselleThemeOptions` export

---

### Tests (6 new in `giselle.test.ts`)

| Test                                                | What it verifies                                                           |
| --------------------------------------------------- | -------------------------------------------------------------------------- |
| `renders children with zero config`                 | Default usage renders children without crashing                            |
| `zero-config — uses giselleTheme as default`        | No props → `data-mui-color-scheme` attribute is set (ThemeProvider active) |
| `defaultMode prop is forwarded`                     | Passes `defaultMode` through to ThemeProvider                              |
| `themeOverrides are accepted without crash`         | Partial override object does not throw                                     |
| `custom theme bypasses giselleTheme`                | `theme` prop is accepted and provider renders correctly                    |
| `theme wins over themeOverrides when both provided` | `theme` takes priority; `themeOverrides` is silently ignored               |

---

## Files changed

| File                                                        | Change                                                                                                                        |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `src/components/theme-provider/giselle/giselle.tsx`         | New — `GiselleThemeProvider` component                                                                                        |
| `src/components/theme-provider/giselle/types.ts`            | New — `GiselleThemeProviderProps` interface                                                                                   |
| `src/components/theme-provider/giselle/giselle.test.ts`     | New — 6 Vitest tests                                                                                                          |
| `src/components/theme-provider/giselle/giselle.stories.tsx` | New — 4 Storybook stories (Default, WithThemeOverrides, FullyCustomTheme, DarkMode)                                           |
| `src/components/theme-provider/giselle/index.ts`            | New — barrel export                                                                                                           |
| `src/components/theme-provider/giselle/README.md`           | New — component README                                                                                                        |
| `src/utils/deep-merge.ts`                                   | New — internal recursive merge utility (not exported from barrel)                                                             |
| `src/utils/theme-preset.ts`                                 | Updated — `giselleThemeOptions` exported                                                                                      |
| `src/index.ts`                                              | Updated — `giselleThemeOptions`, `GiselleThemeProvider`, `GiselleThemeProviderProps` added                                    |
| `src/utils-index.ts`                                        | Updated — `giselleThemeOptions` added                                                                                         |
| `docs/theming/nextjs.md`                                    | Updated — zero-config section added; Option B corrected to use `giselleThemeOptions` spread                                   |
| `.storybook/preview.tsx`                                    | Updated — `giselleTheme` registered; default changed to `'giselle'`; `🥭 Giselle` toolbar item; Phase B TODO comments removed |
| `giselle-mui/docs/roadmap.md`                               | Updated — Phase C ✅ Done 13 May 2026; code snippet corrected                                                                 |
| `alexrebula/docs/roadmap.md`                                | Updated — Phase C summary entry (bubble-up rule)                                                                              |
| `alexrebula/src/sections-api/roadmap/data.tsx`              | Updated — milestone color and description                                                                                     |

---

## Cross-repo impact

| Repo           | Change                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `alexrebula`   | Roadmap updated (bubble-up rule). `GiselleThemeProvider` available in `node_modules` via `yalc push`.                                |
| `giselle-docs` | `@littlebranches/giselle-mui` updated via `yalc push`.                                                                                   |
| `first-branch` | `@littlebranches/giselle-mui` updated via `yalc push`. Phase C is the prerequisite for zero-config theming in the Žiga task-tracker app. |

---

## Quality gate

- [x] `npm run check:verify` exits 0 — 6/6 checks pass (Prettier, ESLint, tsc, Vitest, tsup build, Storybook build)
- [x] 862 tests pass (856 pre-branch + 6 new in `giselle.test.ts`)
- [x] Storybook builds clean (`CI=true storybook build`)
- [x] tsup build exits 0
- [x] No `any`, no `React.FC`, no bare `<Box>`
- [x] Branch → PR (not pushed to `main` directly)
- [x] `yalc push` done — alexrebula, giselle-docs, first-branch updated

---

## Design decisions

### Why `defaultMode = 'system'` and not `'light'`

An open-source library that defaults to `'light'` forces every dark-mode user to pass
`defaultMode="dark"` explicitly. `'system'` respects the OS preference out of the box and is
the most user-friendly default for a library component across the broadest range of consumer
contexts. Consumers who need a fixed mode can always override with `defaultMode="light"` or
`defaultMode="dark"`.

### Why `deepMerge` is not exported

Exporting `deepMerge` would create a public API commitment for a function that exists solely to
support `GiselleThemeProvider`'s `themeOverrides` prop. If the merge strategy needs to change
internally — different key handling, nested array behaviour, or prototype-safe iteration — it
can change without a semver major bump. Consumers who need a merge utility should use the
`giselleThemeOptions` export + manual spread; that pattern is explicit, documented, and requires
no hidden library dependency.

### Why `giselleThemeOptions` is exported

`giselleTheme = extendTheme(giselleThemeOptions)` — the output (`CssVarsTheme`) cannot be
spread into a second `extendTheme()` call. A consumer building their own theme on the Giselle
base (Option B) needs the raw `CssVarsThemeOptions`. Without this export, Option B was
structurally impossible and the `theming/nextjs.md` docs example was wrong.

`giselleThemeOptions` also serves as the canonical reference for which tokens the Giselle preset
sets: any consumer can inspect it without reading source code.

### `as unknown as typeof muiDefaultTheme` in Storybook preview

`extendTheme()` returns a `CssVarsTheme`; the Storybook `themes` registry is typed
`Record<string, typeof muiDefaultTheme>` (a `Theme` shape). They are structurally compatible at
runtime — both satisfy the MUI theme interface consumed by `<ThemeProvider>` — but TypeScript
cannot verify this structural compatibility without the cast. The alternative (typing the
registry as `Record<string, unknown>`) would require downstream casting wherever `themes[key]`
is passed to `<ThemeProvider>`. The `as unknown as` pattern is the "I can verify by inspection
that these are compatible" escape hatch; it is constrained to a single line in the preview file.

### `T extends object` constraint on `deepMerge`

`CssVarsThemeOptions` has no index signature — it is a wide but non-generic interface. The
original constraint `T extends Record<string, unknown>` rejected it because TypeScript requires
an explicit index signature to satisfy that constraint. Changed to `T extends object` (the
widest useful object constraint) with internal casts to `Record<string, unknown>` inside the
function body. The runtime behaviour is identical; only the type boundary changed.
