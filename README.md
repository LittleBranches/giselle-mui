# Giselle MUI

`@alexrebula/giselle-mui` — small, focused MUI wrapper components that encode non-obvious design and
accessibility decisions — so consumers don't have to rediscover them.

Built on `@mui/material` v7 (CSS variables mode). TypeScript-first. MIT licensed.

> **License independence:** This library is **MIT licensed**. All peer dependencies are open-source: `@mui/material`, `@mui/lab`, `@iconify/react` (Apache 2.0), `framer-motion` (MIT), and optionally `apexcharts` / `react-apexcharts` (MIT). No code has been copied or derived from any proprietary theme. Every component is an original work. See [LICENSE](./LICENSE).

---

## The mango tree

The Giselle packages are a Philippine mango tree. The trunk is the shared foundation — design conventions, TypeScript patterns, test discipline — that all packages grow from. Each package is one mango on the tree, at its own stage of ripeness.

`giselle-mui` is the **yellow-green mango** 🟡 — the API is stabilising, components are tested and documented, and the first stable release is close. It is the widest branch on the tree: MUI wrapper components that encode non-obvious design and accessibility decisions so every consumer gets them right without rediscovering them.

Ripeness scale: 🟢 alpha → 🟡 beta → 🟠 stable → 🟤 LTS.

---

## Status

> **Beta — active development. Not yet published to npm.**
>
> The API is stable and the test suite covers component structure, prop forwarding, ARIA
> semantics, and interaction behaviour across all shipped components. The package is fully
> built and tested locally. First public npm release is planned alongside the portfolio
> site launch (May/June 2026).
> Feedback and issues are welcome on [GitHub](https://github.com/AlexRebula/giselle-mui/issues).

Test coverage is functional and growing. The current suite covers component structure,
prop forwarding, ARIA semantics, and interaction behaviour. Coverage of edge cases
and visual logic (which requires a full MUI theme provider) is tracked in the component
READMEs and expanded with each release.

**The test suite will receive a full review and overhaul before the first npm publish.**
This includes edge-case coverage, negative assertion quality, and any gaps identified
during pre-release review. No package ships to npm until the tests meet the same
standard as the implementation.

Until the package is on npm, use it from disk — see [Local development](#local-development).

---

## ⚠️ ThemeProvider requirement

These components are built on **MUI v7 CSS variables mode**. They require a
`CssVarsProvider` (or equivalent MUI theme provider) somewhere above them in the React tree.

Without a theme provider, `theme.vars.*` CSS custom properties are not injected, and
**components will render without meaningful colours or styles** — buttons without borders,
cards without backgrounds, icons without tint.

This is intentional: the library delegates theme ownership to the consuming application,
so it can integrate into any existing MUI theme without conflict.

**Minimal setup:**

```tsx
import { CssVarsProvider, extendTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = extendTheme();

export function App() {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <YourApp />
    </CssVarsProvider>
  );
}
```

Full integration guides:

- [React — Vite / CRA](./docs/theming/react.md)
- [Next.js — App Router + Pages Router](./docs/theming/nextjs.md)

---

## Components

| Component                                         | What it solves                                                                                                                                   |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GiselleIcon`                                     | `@iconify/react` wrapper with full MUI `sx` support — fixes the `Box component={ThirdParty}` TypeScript pitfall and the CDN flicker problem.     |
| `createIconRegistrar`                             | Bundles icon SVG bodies offline — no CDN, no flicker, any framework.                                                                             |
| `MetricCard` + `MetricCardDecoration`             | Structured stat card (value / label / icon / decoration slots) with CSS-var colour tinting. Zero icon-library dependency.                        |
| `StatCard`                                        | Single-metric summary card (value / label / icon / trend) — data-layer driven via `StatCardItem`; palette-key colour prop.                       |
| `SelectableCard`                                  | Clickable card on `ButtonBase` — correct `aria-pressed`, keyboard focus ring, and hover state without rediscovering the `Paper onClick` pitfall. |
| `QuoteCard`                                       | Testimonial card with CSS-var tinted border and conditional attribution row.                                                                     |
| `TimelineTwoColumn` + `PhaseCard` + `TimelineDot` | Two-column alternating timeline for career or roadmap layouts — phase cards, milestone badges, animated active dot, checklist mode.              |
| `IconActionBar`                                   | Horizontal row of `Tooltip` + `IconButton` pairs — encodes the disabled-child `<span>` wrapper pattern so tooltips work on disabled buttons.     |
| `FloatingSubNav`                                  | Sticky / fixed floating pill navigation bar with `framer-motion` enter/exit animation — position-mode aware, scroll-offset configurable.         |
| `SectionTitle`                                    | Section heading with optional subtitle and colour accent — consistent vertical rhythm across section layouts.                                    |
| `TwoColumnShowcaseRow`                            | Responsive two-column row (text + visual) for showcase/feature layouts — MUI v7 Grid v2 with configurable column widths.                         |

**Full API documentation, prop tables, and live examples → [Storybook](./storybook-static/index.html)** (build locally with `npm run build-storybook`, then open the generated file)

**Design decisions and architecture per component → [Docusaurus docs](https://giselle-docs.vercel.app/giselle-mui)**

Every component exists because it solves a problem that is either easy to get wrong or non-trivial to implement correctly with MUI alone. Each `src/components/<name>/README.md` documents the design rationale, accessibility decisions, and library-safety notes.

---

## Install

> **Not yet published to npm.** This will work after the package is released.

```bash
npm install @alexrebula/giselle-mui
```

Peer dependencies (install separately if not already in your project):

```bash
npm install @mui/material @mui/lab @emotion/react @emotion/styled react react-dom
```

Required if you use `FloatingSubNav`:

```bash
npm install framer-motion
```

Optional — only required if you use `GiselleIcon`:

```bash
npm install @iconify/react
```

Optional — only required if you use `RadialProgressCard`:

```bash
npm install apexcharts react-apexcharts
```

> **Icon registration required.** `GiselleIcon` renders from the `@iconify/react` store.
> Without pre-registration, icons load from the Iconify CDN — causing visible flicker.
> See [GiselleIcon and icon registration](#giselleicon-and-icon-registration) below.

---

## Usage

```tsx
import {
  GiselleIcon,
  MetricCard,
  MetricCardDecoration,
  SelectableCard,
  QuoteCard,
} from '@alexrebula/giselle-mui';

// Wrap your app in CssVarsProvider — see docs/theming-react.md for full setup
<MetricCard
  value="20+"
  label="Years"
  sublabel="front-end, since 2005"
  color="primary"
  icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />}
  decoration={<MetricCardDecoration color="primary" />}
/>;
```

---

## GiselleIcon and icon registration

`GiselleIcon` renders icons from the `@iconify/react` module-level store. That store is
**empty by default**. If you don't pre-load it, `@iconify/react` falls back to the
Iconify CDN — icons load after a network round-trip and flicker visibly on first render.

### Online (CDN) — zero setup, not production-ready

Icon names from the [Iconify catalogue](https://icon-sets.iconify.design/) load
automatically with no configuration. Works in **any framework**. Acceptable for
prototyping; not suitable for production.

```tsx
// Works immediately — icons fetched from CDN on demand
<GiselleIcon icon="solar:rocket-bold-duotone" />
```

### Offline registration — recommended for production

Use `createIconRegistrar` to bundle icon SVG bodies directly in your JS output.
No CDN, no flicker, works in **any framework**.

```ts
// src/icon-sets.ts
import { createIconRegistrar } from '@alexrebula/giselle-mui';

export const registerIcons = createIconRegistrar({
  'solar:rocket-bold-duotone': {
    body: '<path fill="currentColor" d="..." />',
  },
  'logos:typescript-icon': {
    width: 256,
    height: 256, // logos: icons need explicit dims — see README
    body: '<path fill="#3178c6" d="..." />',
  },
});
```

Then call `registerIcons()` at module level before React renders:

- **Vite / CRA** — call it in `src/main.tsx` before `createRoot`
- **Next.js App Router** — call it at module level inside a `'use client'` component mounted in root layout
- **Next.js Pages Router** — call it in `pages/_app.tsx`

Full setup guide (framework examples, viewBox rules, monorepo caveats):
→ [GiselleIcon README](./src/components/giselle-icon/README.md)
→ [docs/iconify-registration.md](./docs/iconify-registration.md)

---

## Tech stack

- React 18+ with TypeScript — strict mode, no `any`
- `@mui/material` v7 (CSS variables mode — `theme.vars.palette.*`, not `theme.palette.*`)
- `@iconify/react` for icons (Apache 2.0 — only allowed icon peer dependency)
- Vitest + jsdom for unit tests
- Storybook for visual development and autodoc

---

## Local development

```bash
git clone git@github.com:AlexRebula/giselle-mui.git
cd giselle-mui
npm install
npm run typecheck
npm test
npm run build
```

**Developing alongside a consumer app (e.g. the alexrebula portfolio)?**
Use [yalc](https://github.com/wclr/yalc) — a local package registry that installs your
built dist as a real package (no symlinks, no junctions, Turbopack compatible):

```bash
# one-time setup
npm install -g yalc

# in giselle-mui — after any change
npm run build && yalc push

# in the consumer app — one-time
yalc add @alexrebula/giselle-mui
```

Full workflow, publishing steps, and the reasoning behind yalc:
→ [docs/local-development.md](./docs/local-development.md)

---

## Roadmap

| Phase                    | Status     | Description                                                                                                                          |
| ------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Core components          | ✅ Done    | `GiselleIcon`, `MetricCard`, `SelectableCard`, `QuoteCard`, `TimelineTwoColumn` — all with unit tests + READMEs                      |
| Storybook stories        | ✅ Done    | Stories shipped for all components. Deployed locally; public hosting planned.                                                        |
| Phase A theme utilities  | ✅ Done    | `channelAlpha`, `hexToChannel`, `pxToRem`/`remToPx` — see [`docs/roadmap.md`](./docs/roadmap.mdx)                                     |
| Phase B brand theme      | ✅ Done    | `giselleTheme` preset + palette constants — import from `@alexrebula/giselle-mui/utils` — see [`docs/roadmap.md`](./docs/roadmap.mdx) |
| npm publish              | ⬜ Planned | Alongside portfolio launch, May/June 2026                                                                                            |
| Additional components    | ⬜ Planned | Components extracted from portfolio patterns as they meet the extraction checklist                                                   |
| Storybook public hosting | ⬜ Planned | Chromatic or self-hosted, cross-linked from Docusaurus                                                                               |

Full detail: [`docs/roadmap.md`](./docs/roadmap.mdx)

---

## Part of the Giselle UI ecosystem

| Package                            | Description                                              | Status |
| ---------------------------------- | -------------------------------------------------------- | ------ |
| `@alexrebula/giselle-mui`          | MUI wrapper components (this package)                    | Beta   |
| `@alexrebula/giselle-ui`           | Framework-agnostic component primitives                  | Beta   |
| `@alexrebula/giselle-sections-sdk` | Typed section data contracts for portfolio/product sites | Beta   |

All packages are in active development and will be published together.

---

## License

MIT — see [LICENSE](./LICENSE).

---

Made with ❤️ by [Alex Rebula](https://github.com/AlexRebula)
