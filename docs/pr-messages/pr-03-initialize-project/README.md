---
sidebar_label: "PR03 - Initialize project"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/3)** — [`feature/initial-files`](https://github.com/AlexRebula/giselle-mui/tree/feature/initial-files) — 21 Apr – 21 Apr 2026


# Initialize project and add components with theming documentation

# Changes — giselle-mui OSS library setup + local dev wiring

_Session: April 22, 2026_

---

## Overview

This session bootstrapped `@alexrebula/giselle-mui` as a standalone open-source React
component library, migrated four existing portfolio components into it, fixed TypeScript
strictness issues, added comprehensive documentation, and wired the library into the
portfolio app for zero-build local development via Yarn workspaces.

---

## 1. `giselle-mui` — new repo, fully bootstrapped

### Infrastructure

| File | What was done |
|---|---|
| `LICENSE` | MIT, 2026 Alex Rebula |
| `package.json` | `@alexrebula/giselle-mui` v0.1.0, dual ESM/CJS via tsup, all MUI/Emotion/Iconify as peer deps |
| `tsconfig.json` | strict, ES2020, Bundler moduleResolution, verbatimModuleSyntax |
| `tsup.config.ts` | entry `src/index.ts`, formats `esm`+`cjs`, `dts: true`, all peers external |
| `vitest.config.ts` | environment: node, `include: ['src/**/*.test.ts']` |
| `.gitignore` | node_modules, dist, storybook-static, coverage |
| `.github/copilot-instructions.md` | Copilot workspace prompt encoding all component authoring rules |

### Source — 4 components

All components follow the library rules: `sx` array spread, `...other` on root, `ReactNode`
icon slots, `theme.vars.palette` CSS variables, no hardcoded colour literals.

#### `GiselleIcon`
- Thin wrapper around `@iconify/react` `Icon`
- Aligns icon baseline with adjacent text via `display: inline-flex; translateY` trick
- Accepts `width`/`height` (default 20) and full `sx` passthrough
- 8 unit tests

#### `MetricCard`
- Stat display card: value, label, optional description, optional icon decoration
- Companion `MetricCardDecoration` component for the icon slot
- CSS-variable colour tinting via `theme.vars!.palette[color].mainChannel`
- Exports: `MetricCard`, `MetricCardDecoration`, `MetricCardProps`, `MetricCardDecorationProps`, `MetricCardColor`
- 15 unit tests

#### `SelectableCard`
- Keyboard-accessible selectable card using `ButtonBase` (not `Paper onClick`)
- Selected state drives border colour and background tint via `theme.vars!`
- Supports `icon`, `title`, `description`, `selected`, `color`
- 15 unit tests

#### `QuoteCard`
- Blockquote display: quote text, author name, optional author role and avatar
- Decorative `"` opening quote mark (`aria-hidden`)
- Avatar slot accepts any `ReactNode`
- CSS-variable tint for the quote mark accent colour
- 14 unit tests

**Total: 52 tests, all passing.**

### Barrel

`src/index.ts` exports all components and their types.

### Documentation

| File | Contents |
|---|---|
| `README.md` | Status/beta badge, ⚠️ ThemeProvider requirement, component table, install, usage, tech stack, local dev, roadmap, ecosystem table |
| `docs/theming-react.md` | Full `CssVarsProvider` + `extendTheme` setup for Vite/CRA, dark mode toggle, migration table from `theme.palette` to `theme.vars`, troubleshooting |
| `docs/theming-nextjs.md` | App Router (`AppRouterCacheProvider` + `suppressHydrationWarning`) and Pages Router (`_document.tsx` + `_app.tsx`), Server Component boundary pattern |

### TypeScript strict-mode fix

MUI v7 in CSS variables mode types `theme.vars` as `CssVarsTheme | undefined` under
`--strict`. Fixed with non-null assertions (`theme.vars!.palette…`) in:
- `metric-card.tsx` (1 instance)
- `selectable-card.tsx` (5 instances)
- `quote-card.tsx` (2 instances)

`npx tsc --noEmit` → 0 errors after fix.

### Dev-time source wiring (`publishConfig` pattern)

`package.json` `main`/`module`/`types`/`exports` now point at `./src/index.ts` so any
workspace consumer reads raw TypeScript source — no build required during local development.
`publishConfig` overrides those fields back to `./dist/…` paths automatically when
`npm publish` is run, so npm consumers always receive compiled output.

```json
"main": "./src/index.ts",
"publishConfig": {
  "main": "./dist/index.cjs",
  "exports": { ... }
}
```

---

## 2. `giselle-ui` — README update

Added a **Status** section marking the package as pre-release / not yet published to npm,
with install instructions gated accordingly.

---

## 3. `giselle-sections-sdk` — README update

Added ecosystem footer linking back to `giselle-mui` and `giselle-ui`.

---

## 4. Portfolio (`alexrebula`) — wired to library source

### `package.json`

Added `@alexrebula/giselle-mui: "*"` to `dependencies`. The `*` version resolves to the
local workspace symlink — no version pinning needed during development.

### `next.config.ts`

Added `transpilePackages: ['@alexrebula/giselle-mui']` so Next.js's SWC compiler
processes the symlinked `.tsx` source files directly. This is the mechanism that makes
HMR work across the package boundary with zero build steps.

```ts
const nextConfig: NextConfig = {
  transpilePackages: ['@alexrebula/giselle-mui'],
  // ...rest unchanged
};
```

---

## 5. Workspace root — Yarn workspaces

Created `package.json` to declare the monorepo workspace root:

```json
{
  "private": true,
  "workspaces": [
    "giselle-mui",
    "rm/presentation/alexrebula"
  ]
}
```

Running `yarn install` at root will symlink `@alexrebula/giselle-mui` into the
portfolio's `node_modules`, completing the wiring.

---

## Migration path to npm (when ready to publish)

1. Run `tsup` to populate `dist/`
2. Run `npm publish` — `publishConfig` automatically replaces the `src` paths with `dist` paths in the published package manifest
3. Remove `"@alexrebula/giselle-mui": "*"` from portfolio `dependencies` and reinstall with the versioned npm package
4. Remove `transpilePackages` from `next.config.ts` (the published package is pre-compiled)
5. Delete the workspace root `package.json` or remove the `giselle-mui` entry from `workspaces`

No import paths in the portfolio need to change at any point.

---

## What is NOT done yet

- [ ] `yarn install` at workspace root (pending — verifies symlink wiring end-to-end)
- [ ] Delete duplicate components from portfolio `src/components/alexrebula/giselle-mui/`
- [ ] Update portfolio import sites to use `'@alexrebula/giselle-mui'`
- [ ] Storybook stories for all 4 components
- [ ] npm publish (planned May/June 2026)
