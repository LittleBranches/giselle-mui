# GiselleThemeProvider

## Why it exists

Every MUI v7 application needs a `ThemeProvider` wrapping the component tree, and that provider needs a theme created with `extendTheme()`. Without `GiselleThemeProvider`, consumers must:

1. Import `extendTheme` from `@mui/material/styles`
2. Create a theme manually, choosing all six palette keys for both colour schemes
3. Import `ThemeProvider` and wire everything together

`GiselleThemeProvider` removes all three steps. Wrap your application and every MUI component inherits the correct CSS variable theme — zero configuration required.

## Why it belongs here

This is the primary DX entry point for the `@littlebranches/giselle-mui` library. The Giselle brand palette (Phase B) and theme utilities (Phase A) are only useful to consumers once there is a zero-config provider that ships them. Without this component, every consumer must wire up `ThemeProvider`, `extendTheme`, and the palette manually — defeating the purpose of a themed component library.

## Design decisions

**Three-tier override model:**

```
1. No props         → use giselleTheme (pre-built, zero overhead)
2. themeOverrides   → deepMerge(giselleThemeOptions, themeOverrides) → extendTheme()
3. theme prop       → use as-is, giselleTheme ignored entirely
```

**Why `extendTheme()` for the override case, not `ThemeProvider` with `createTheme`?**
MUI v7 CSS variables mode requires `extendTheme()` (not `createTheme()`) to generate CSS custom property tokens. `ThemeProvider` with `createTheme()` does not inject the `--mui-palette-*` variables that giselle-mui components depend on.

**Why `deepMerge` instead of spread?**
The palette is nested three levels deep (`colorSchemes.light.palette.*`). A shallow spread at the top level would replace the entire `colorSchemes` object, losing the dark-mode palette entirely. Recursive merge preserves all Giselle defaults and only overwrites what `themeOverrides` specifies.

**`defaultMode="system"` as the default:**
System preference is the correct default for zero-config usage. Consumers can override to `"light"` or `"dark"` explicitly.

## Library safety

- No hardcoded hex or rgba literals in the component file — all palette values live in `src/utils/theme-preset.ts`
- No personal data in stories (generic placeholder content only)
- No imports from any external private or proprietary codebase

## File structure

```
src/components/theme-provider/giselle/
  giselle.tsx               — JSX composition + ThemeProvider wiring
  types.ts                  — GiselleThemeProviderProps interface
  giselle.test.ts           — Vitest unit tests
  giselle.stories.tsx       — Storybook: default, overrides, custom, dark mode
  index.ts                  — barrel export
  README.md                 — this file
```

## Related

- `src/utils/theme-preset.ts` — `giselleThemeOptions` (raw options) + `giselleTheme` (resolved)
- `src/utils/deep-merge.ts` — `deepMerge()` utility used to merge `themeOverrides`
- `docs/theming/nextjs.md` — Next.js setup guide with zero-config example
