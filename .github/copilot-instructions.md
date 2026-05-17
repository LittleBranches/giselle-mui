# @alexrebula/giselle-mui — Copilot Instructions

This is an open-source React component library built on top of `@mui/material` v7.
It is authored by Alex Rebula and licensed MIT.

## What this library is

A set of small, focused MUI wrapper components that encode non-obvious design and
accessibility decisions so consumers don't have to rediscover them. Every component
in this library exists because it solves a recurring problem that is either:

- easy to get wrong (e.g. `Paper onClick` vs `ButtonBase` for keyboard accessibility), or
- non-trivial to implement correctly with MUI alone (e.g. icon baseline gaps, CSS-var color tinting)

## Stack

- React 18+ with TypeScript — strict mode, no `any`
- `@mui/material` v7 (CSS variables mode — `theme.vars.palette.*` not `theme.palette.*`)
- `@iconify/react` for icons (Apache 2.0 — the only allowed icon peer dependency)
- Vitest + jsdom for unit tests
- Storybook for visual development and autodoc

## Brand identity — the Giselle mango tree

The Giselle ecosystem is named after the Filipino partner of the author. The Philippine national fruit is the Carabao mango — both the logo mark and the ecosystem metaphor.

- **The tree** = shared foundation: design conventions, TypeScript patterns, test discipline
- **Each branch** = a package (`giselle-mui`, `giselle-sections-sdk`, `giselle-ui`, `giselle-docs`)
- **Each mango** = a release at its own ripeness stage

Ripeness scale: 🟢 green = alpha · 🟡 yellow-green = beta · 🟠 golden = stable · 🟤 amber = LTS

`giselle-mui` is the **yellow-green mango** — widest branch, most components, API stabilising.

**Palette:** Mango gold `#F5A623` · Deep grove `#2E7D32` · Lime `#76C442` · Ripe flesh `#FFF3CD` · Dark grove `#1A2B1A` · Warm tan `#F5EDDC`

**G lettermark:** The bowl of a capital G mirrors the elongated S-curve of a Carabao mango silhouette — readable as letter or fruit without labelling.

**WC-6:** The planned wide hero illustration — watercolour mango tree with per-package label badges. See `alexrebula/docs/brand/logo-concept.md` Track A.

## Component rules (non-negotiable)

0. **Zero personal data.** Stories, tests, JSDoc examples, and README code snippets must
   never contain real names (people, clients, employers), real project names, or any content
   derived from the `alexrebula` portfolio. Use generic placeholders:
   authors → `'Jane Smith'`, sources/projects → `'Platform Team'`, metrics → `'20+'` / `'of experience'`.
   Violating this rule exposes private career data in a public MIT-licensed repository.

1. **Zero proprietary dependencies.** Only `react`, `react-dom`, `@mui/material`,
   `@emotion/react`, `@emotion/styled`, and `@iconify/react` are allowed as
   peer/direct dependencies — plus the explicitly extended set listed in the
   **Additional allowed peer dependencies** section below (`@mui/lab`,
   `framer-motion`, `apexcharts`, `react-apexcharts`).

   **Subpath constraint:** `framer-motion` and `apexcharts`/`react-apexcharts` are allowed
   **only in their dedicated subpath entries** — never in `src/index.ts` (the main bundle).
   See **Subpath export architecture** below for the full rule.

2. **`sx` array spread on root element.** Always:
   `sx={[baseStyles, ...(Array.isArray(sx) ? sx : [sx])]}`.

3. **`...other` spread on root element.** Enables `data-*`, `aria-*`, `id`,
   `className` without prop drilling.

4. **Only own props get JSDoc.** Never redeclare or document props inherited from
   MUI interfaces. TypeScript inheritance carries MUI's own descriptions into
   Storybook autodoc automatically.

4a. **JSDoc must use Markdown formatting.** Storybook autodoc renders JSDoc descriptions
as Markdown. Use `**bold**`, `- ` bullet lists, and fenced code blocks (` ```tsx `).
Never use bare indented code lines — they do not render as code blocks in Markdown.
`@example` tags are rendered separately as code snippets and remain plain JSX/TSX.

5. **ReactNode slots for icons and decoration.** Components never import an icon
   library internally. Accept `icon?: ReactNode` and let the consumer fill it.

   **Consumer icon registration contract — non-negotiable:**
   Every consumer app that renders `GiselleIcon` or any component with an icon slot
   **must pre-register all used icons offline** before the first render. Iconify silently
   fetches missing icons from `api.iconify.design` — this is a CDN fallback, not acceptable
   in production or development. Use `createIconRegistrar` (exported from this library) to
   register inline SVG bodies from `@iconify-json/*` **without importing the full package**:

   ```ts
   import { createIconRegistrar } from '@alexrebula/giselle-mui';
   export const registerIcons = createIconRegistrar({
     solar: { icons: { 'star-bold': { body: '<path ...>' } } },
     logos: { icons: { react: { body: '<path ...>', width: 256, height: 256 } } },
   });
   ```

   Never import `@iconify/react` directly in section/data files — it bypasses the
   offline registration discipline. Always verify with the consumer app's offline
   coverage test before using a new icon string.

6. **`color` prop follows MUI palette key convention.**
   `'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'`
   with `@default 'primary'`.

7. **Decorative elements carry `aria-hidden`.** Quote marks, separator dots,
   background shapes.

8. **No hardcoded hex or rgba literals.** Use `theme.vars.palette[color].mainChannel`
   for tints.

## File structure per component

Every component lives in its own named subfolder. No `.tsx` or `.ts` component files
are permitted directly under `src/components/` — enforced by `scripts/check-structure.js`
in the quality gate.

```
src/components/<name>/
  <name>.tsx          — pure JSX composition only (no types, no utility functions, no constants)
  <name>.const.ts     — named constants (sizes, font sizes, badge sizes, spacing values)
  <name>.styles.ts    — all sx constants (static) and sx factories (dynamic)
  <name>.styles.test.ts — mock-theme assertions for every exported sx function
  <name>.stories.tsx  — Storybook stories — MUST include the component name (Storybook glob: `*.stories.@(ts|tsx)`)
  <name>.test.ts      — Vitest unit tests — MUST end in `.test.ts` (vitest glob: `src/**/*.test.ts`)
  types.ts            — all TypeScript types
  utils.ts            — pure logic functions (no JSX)
  index.ts            — barrel: re-exports component and types
  README.md           — why it exists, why it belongs here, design decisions, library safety
  <sub-component>.tsx — internal sub-components (one file each, flat in folder — NOT in subfolders)
```

**Separation rule — non-negotiable for every component:**

- **TypeScript `type` aliases AND `interface` declarations → `types.ts`** (never inside `.tsx`). This applies to every exported and internal type without exception — `Props`, `Item`, `Config`, helper union types, internal-only types. If it is a type, it does not live in a `.tsx` file.
- **Named constants → `<name>.const.ts`** (never inside `.tsx`). Every exported `const` that represents a size, font size, badge size, minimum touch target, or spacing value belongs in the const file. **Primitive values only — no JSX.** If a constant contains JSX (e.g. a default actions array with `<GiselleIcon />` elements), it belongs in `<name>.defaults.tsx` instead. See `*.const.ts companion files` section below.
- Pure logic / helper functions (no JSX) → separate `utils.ts` file (not inside `.tsx`)
- Any `sx={}` with more than ~3 properties → `<name>.styles.ts` (enforced by ESLint)
- **Internal sub-components → own `.tsx` files** (flat in the parent folder). See `Sub-component extraction rule` section below.
- The `.tsx` file is the **composition layer only**: it imports from all of the above and renders JSX.

**Domain/feature grouping — mirrors the "Components" nav:**
Related components are grouped under a shared parent folder. The quality gate enforces that
no `.tsx` file lives at `src/components/<file>.tsx` — every component is at least one
subfolder deep.

**Personal preference — non-negotiable:**
The `src/components/` tree deliberately mirrors the navigation hierarchy that consumers will
see in the documentation site and demo. Sub-groups follow MUI's own component category naming
(surfaces, data-display, layout, navigation, input, feedback) — the same categories documented
on mui.com. This makes the folder tree immediately predictable to any dev already familiar with
MUI: they can navigate to a component without reading docs.

```
src/components/
  chart/                       — chart components (ApexCharts wrappers and chart-card primitives)
    radial-progress/
  material/                    — MUI-based components (grouped by MUI category)
    surfaces/card/             — accordion, metric, quote, selectable, stat, stat-row
    data-display/icon/         — action-bar, giselle, tech-strip
    data-display/              — animated-gradient and other display primitives
    layout/                    — section-container, section-title, showcase-row
    navigation/                — floating-sub-nav
    input/                     — toggle-icon-button
    feedback/
    utils/
  motion/                      — framer-motion components
    container/ use-scroll-parallax/ variants/ viewport/
  section/                     — section-level compositions
    faq/ hero/ timeline/
  theming/                     — theme/provider components
    theme-provider/ settings-provider/
```

### TimelineTwoColumn internal file layout

The `timeline/two-column/` folder is the **reference implementation** for complex components.
It demonstrates the full types/utils/styles/const/sub-component split:

```
src/components/section/timeline/two-column/
  two-column.tsx                       — pure JSX composition only (no types, no logic functions)
  types.ts                             — all exported + internal TypeScript interfaces
  utils.ts                             — all pure logic functions (no JSX return); fully unit-testable
  styles.ts                            — all sx constants (static) and sx factories (dynamic)
  index.ts                             — barrel
  timeline-two-column.stories.tsx      — Storybook stories (must match *.stories.tsx glob)
  stories.styles.ts                    — sx constants used only in stories
  *.test.ts                            — co-located unit test files
  phase-card/       — PhaseCard sub-component (exported from package barrel)
  milestone-badge/  — MilestoneBadge sub-component (exported from package barrel)
  spine-connector/  — SpineConnector sub-component (internal)
  timeline-dot/     — TimelineDot sub-component (internal)
  phase-warning-popover/ — PhaseWarningPopover sub-component (internal)
```

**Rule:** `two-column.tsx` must remain pure JSX composition.

- TypeScript types → `types.ts`
- Pure logic/helper functions (nothing that returns JSX) → `utils.ts`
- Any `sx={}` with more than ~3 properties → `styles.ts`

## Test conventions

- File extension must be `.test.ts` (not `.tsx`) — vitest config uses `include: ['src/**/*.test.ts']`. A file named `test.ts` (no component-name prefix) does NOT match `*.test.ts` and will be silently skipped.
- Add `// @vitest-environment jsdom` at top of every test file
- Use `React.createElement` (not JSX) — avoids JSX transform requirement in `.ts` files
- Use `renderToStaticMarkup` for structure/ARIA tests
- Use `ReactDOM.createRoot` + `act` for interaction/click tests
- Mock all MUI components that have `theme.vars` in sx callbacks (`ThemeProvider` with
  `cssVariables: true` is required — available in Storybook but not in unit tests without
  wrapping, so mock the component instead)

## What Copilot should help build

- New components following all rules above
- Unit tests using the established Vitest patterns
- Storybook Stories with `argTypes: { control: false }` for `ReactNode` and `SxProps` slots
- README files: Why it exists → Why it belongs here → Design decisions → Library safety → File structure → Related
- Barrel index updates when new components are added

When asked to add a component, always verify: does this encode a non-obvious decision
that saves every consumer from rediscovering it? If not, it should not be in this library.

### Layout components belong here (not in alexrebula)

Any section layout pattern that is **used by more than one section page** — or that is
clearly general enough to be — belongs in `giselle-mui` as a named layout component, not
inline in `alexrebula/src/sections/`. Examples of patterns that belong here:

- Sidebar + main content grid (`<SidebarContentLayout>`)
- Gauge / radial-bar visualisation card (`<RadialGaugeCard>`)
- Two-column page layout with sticky sidebar
- KPI stats column alongside a timeline

**Decision rule — ask before writing any new JSX in `alexrebula/src/sections/`:**

> Would a second section page (or a different project) want this exact layout structure?
> If yes → create a named component in `giselle-mui/src/components/layout/` first, then import it.

This was violated when `StoreReadinessSectionInner` and `ReadinessGauge` were written directly
in `alexrebula/src/sections/store-readiness/view.tsx`. Both belong in giselle-mui:

- `ReadinessGauge` → `src/components/chart/radial-gauge/` (wraps ApexCharts radialBar)
- The sidebar+timeline layout → `src/components/layout/sidebar-timeline/`

**Backlog items (not yet extracted — add to roadmap when taking these on):**

- `ReadinessGauge` → giselle-mui `chart/radial-gauge/`
- `SidebarTimelineLayout` → giselle-mui `layout/sidebar-timeline/`

### Chart/ApexCharts options follow the data-layer convention

When a component uses ApexCharts:

- Chart `options` objects must **not** be defined inline in JSX.
- Static options → module-level `const` in a `*.styles.ts` file.
- Options that depend on theme tokens → a factory function in `*.styles.ts` that accepts `theme`.
- The component receives the result and passes it to `<ReactApexChart options={...} />` — never defines it inline.

- `TimelineTwoColumn` visual pages for roadmap docs — see the **Roadmap visual sync rule**
  in the `alexrebula` copilot instructions. `TimelineTwoColumn` is the designated component
  for rendering any `docs/**/roadmap.md` file visually. When a roadmap doc is updated, the
  companion timeline page in `alexrebula` must be updated in the same commit to keep phases,
  milestones, and all expandable sub-information in full parity with the markdown source.

- **Roadmap hierarchy bubble-up rule** — also defined in the `alexrebula` copilot instructions.
  When a phase or milestone in `giselle-mui/docs/roadmap.md` is completed or its date
  changes, the corresponding summary entry in `alexrebula/docs/roadmap.md` (Phase 1.5) and its
  `data.tsx` mirror must be updated in the same commit. The child roadmap is the source of
  truth for its own content; the ancestor holds a summary + link only, never a duplicate task list.

## Tone rule for docs and comments

**Hard rule — non-negotiable:** `giselle-mui/docs/` is a **public library documentation site**. It must describe components and utilities on their own terms. It must never document alexrebula's internal migration state, reference files in `alexrebula/src/`, or frame giselle-mui utilities as "replacements for" anything from a third-party kit.

Migration planning notes, copyright analysis, and "what we still need to fix in alexrebula" tracking belong exclusively in `alexrebula/docs/` — a **private repo**. If that content ends up in `giselle-mui/docs/`, it is in the wrong place and must be moved or removed, regardless of whether the banned-content scan passes.

When updating or writing docs:

- **Never** frame a utility as a "replacement for X" or "clean-room implementation of X from Y". Describe what it does: "`channelAlpha(channel, alpha)` creates an rgba tint from an MUI v7 CSS variable channel string."
- **Never** reference `alexrebula/src/` paths, alexrebula migration status, or private codebase internals in any `giselle-mui/docs/` file.
- **Never** write a "Copyright status" or "migration tracker" section in a component plan — that is private planning, not library documentation.
- **Never** mention proprietary, copyrighted, or internal libraries by name in `giselle-mui/docs/` — this is a public library, not an internal migration. No "replaces X from Y" statements anywhere in `giselle-mui/docs/`, `src/`, or component READMEs.
- **Describe components on their own terms.** Document the problem each component solves and the decisions it encodes — not what preceded it or what inspired it. This is standard practice for any library: React docs do not cite Angular; MUI docs do not cite Bootstrap. A `channelAlpha` entry should read "`channelAlpha(channel, alpha)` builds an rgba tint from an MUI v7 CSS variable channel string" — full stop. No "replaces X", no "unlike Y", no third-party theme names anywhere in `docs/`, `src/`, or component READMEs.

## Session shorthand commands

| Command                    | Meaning                                                                                                                                 |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `cleanup component <Name>` | Read `docs/components/cleanup-workflow.md` and execute the full cleanup workflow on the named component. No further explanation needed. |
| `review pr <N>`            | Run the PR review workflow below on PR #N.                                                                                              |
| `create pr <branch>`       | Execute Phase 0 + Phase 1 of `docs/pr-review-workflow.md` for `<branch>`; stop after Copilot review is confirmed triggered.             |

## PR review workflow — `review pr <N>`

When asked to `review pr <N>`, execute these phases in order:

**Phase 1 — Read the PR**
`mcp_gitkraken_pull_request_get_detail` — get PR title, branch, description, file list.

**Phase 2 — Read the comments**
`mcp_gitkraken_pull_request_get_comments` — list all existing review comments and replies.
Note every unresolved Copilot comment: its `id`, file, and what it flags.

**Phase 3 — Acknowledge in-thread (before fixing)**
For each unresolved Copilot comment, post a reply in its thread using:

```sh
gh api repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies \
  --method POST -f body="✅ Valid. <one-sentence acknowledgement>. Fixing: <what will change>."
```

⚠️ **NEVER use `mcp_gitkraken_pull_request_create_review` for thread replies.**
That tool creates a top-level review on the main PR thread — not a nested reply.
`gh api .../replies` is the only correct tool for replying inside an existing thread.

**Phase 4 — Fix the code**
Apply all fixes. Run `npm run check:verify`. Commit and push.

**Phase 5 — Confirm in-thread (after fixing)**
For each Copilot comment, post a follow-up reply in the same thread:

```sh
gh api repos/{owner}/{repo}/pulls/{pr}/comments/{comment_id}/replies \
  --method POST -f body="Fixed at commit \`<sha>\`: <one sentence describing the change>."
```

Use the same `comment_id` as Phase 3 — this nests the reply under the original comment.

**Phase 6 — Branch owner sign-off**
Prompt the user to resolve the threads in the GitHub PR UI.

---

## Session bootstrap: where Copilot should look first

At the start of every new Copilot session in this package, read these files:

| File                                                                            | Purpose                                                                                                        |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`docs/roadmap.md`](../docs/roadmap.md)                                         | Phase A (theme utilities), Phase B (Giselle brand palette), Phase C (GiselleThemeProvider) — next planned work |
| [`docs/components/timeline-plan.md`](../docs/components/timeline-plan.md)       | Full plan for `RoadmapTimeline` — next component to build                                                      |
| [`docs/theming/nextjs.md`](../docs/theming/nextjs.md)                           | How to wire this library into a Next.js app                                                                    |
| [`docs/components/cleanup-workflow.md`](../docs/components/cleanup-workflow.md) | Step-by-step playbook for creating or cleaning up any component — Definitions of Done for Scenario A and B     |

### Current components (shipped)

| Component                                            | File                                                    | Status                                     |
| ---------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------ |
| `GiselleIcon`                                        | `src/components/material/data-display/icon/giselle/`    | ✅ Shipped + tested                        |
| `MetricCard` + `MetricCardDecoration`                | `src/components/material/surfaces/card/metric/`         | ✅ Shipped + tested                        |
| `QuoteCard`                                          | `src/components/material/surfaces/card/quote/`          | ✅ Shipped + tested                        |
| `SelectableCard`                                     | `src/components/material/surfaces/card/selectable/`     | ✅ Shipped + tested                        |
| `createIconRegistrar`                                | `src/utils/icon/create-icon-registrar/`                 | ✅ Shipped + tested                        |
| `TimelineTwoColumn`                                  | `src/components/section/timeline/two-column/`           | ✅ Shipped + tested                        |
| `IconActionBar`                                      | `src/components/material/data-display/icon/action-bar/` | ✅ Shipped + tested                        |
| `channelAlpha`, `hexToChannel`, `pxToRem`, `remToPx` | `src/utils/theme/theme-utils/`                          | ✅ Shipped + tested (Phase A — 4 May 2026) |
| `giselleTheme`, palette constants                    | `src/utils/theme/preset/`                               | ✅ Shipped + tested (Phase B — 5 May 2026) |
| `StatCard`                                           | `src/components/material/surfaces/card/stat/`           | ✅ Shipped + tested (5 May 2026)           |

### Section-level companion types (canonical location)

These types must be defined here and imported from `@alexrebula/giselle-mui` by all consumers.
**Never re-define them in alexrebula data files or anywhere else.**

| Type                   | Location                                              | Purpose                                                                            |
| ---------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `TimelineSidebar`      | `src/components/section/timeline/two-column/types.ts` | Sidebar heading/body/chip for a timeline section page                              |
| `TimelineColumnLabels` | `src/components/section/timeline/two-column/types.ts` | Column header labels (`left`, `right`, optional subtitles)                         |
| `TimelineSectionData`  | `src/components/section/timeline/two-column/types.ts` | Aggregated `{ sidebar, columnLabels, phases }` — pass directly to a section view   |
| `StatCardItem`         | `src/components/material/surfaces/card/stat/types.ts` | Data-layer shape for one `StatCard` entry (uses `iconId: string`, not `ReactNode`) |

**Why this matters:** Types defined in data files are invisible to consumers of this library.
They also diverge over time — the same shape ends up with three different names across three
data files. Define once in giselle-mui, import everywhere.

### Next planned work (priority order)

1. **Phase B — finalize** — add `giselleTheme` usage to `docs/theming/nextjs.md`. One docs update to close Phase B. Branch: `feature/giselle-theme-preset`.
2. **Phase C — `GiselleThemeProvider`** — wraps `ThemeProvider` with the Giselle default palette. Zero-config usage. Accepts `themeOverrides` for partial overrides and `theme` for full bypass. See `docs/roadmap.md` Phase C. Blocked until Phase B PR merges.
3. **Storybook story polish** — Remaining: MetricCard notes panel, responsive `sx` demo in GiselleIcon.
4. **RoadmapTimeline component** — Phase A prerequisite (`channelAlpha`) is now met. Full plan in `docs/components/timeline-plan.md`. Uses `@mui/lab` Timeline primitives (acceptable peer dep).
5. **Phase H — Dashboard component suite** — 23 new components across 7 groups: stat cards, chart cards, data tables, financial widgets, hero cards, motion components, and investment analytics. Subpath exports (`/charts`, `/motion`) wired in tsup + package.json — 7 May 2026. Full spec: `docs/components/dashboard-components-plan.md`.

### Additional allowed peer dependencies

- `@mui/lab` — needed for Timeline primitives (`Timeline`, `TimelineItem`, `TimelineSeparator`, etc.). Acceptable under the zero-proprietary-dependencies rule. Goes in the **main bundle** (`dist/index.js`).
- `framer-motion` — allowed **only in the `/motion` subpath entry** (`dist/motion.js`). Never import `framer-motion` from a file that is part of `src/index.ts` — it would impose the dep on every consumer. **Always use `motion.div`, never `m.div`.** The `m.*` API requires `LazyMotion` in the consumer's tree — this is an invisible requirement that breaks any app not using lazy motion (including Storybook). `motion.*` works without a provider and is correct for library components.
- `apexcharts` + `react-apexcharts` — allowed **only in the `/charts` subpath entry** (`dist/charts.js`). Never import ApexCharts from a file that is part of `src/index.ts`. Components that embed a chart must accept `chart?: ReactNode` and let the consumer supply it — this keeps the component in the main bundle with zero chart dep. Declared with `peerDependenciesMeta.optional: true`.

### Subpath export architecture — non-negotiable

`giselle-mui` uses **tsup subpath exports** to isolate heavy optional dependencies. This is the answer to "can I use framer-motion / ApexCharts here?" — yes, but only in the right entry point.

```
@alexrebula/giselle-mui          → dist/index.js     MUI-only components + utils ('use client')
@alexrebula/giselle-mui/utils    → dist/utils.js     Server-safe pure utilities (no 'use client')
@alexrebula/giselle-mui/charts   → dist/charts.js    ApexCharts chart cards (optional peer dep)
@alexrebula/giselle-mui/motion   → dist/motion.js    framer-motion components (optional peer dep)
```

**The rule in one sentence:** if a component imports `framer-motion`, it goes in `src/motion-index.ts` → `dist/motion.js`. If it imports `apexcharts` or `react-apexcharts`, it goes in `src/charts-index.ts` → `dist/charts.js`. Everything else goes in `src/index.ts` → `dist/index.js`.

**Consumer contract:**

- A project that imports only from `@alexrebula/giselle-mui` never needs ApexCharts or framer-motion installed.
- A project that imports from `.../charts` must have `apexcharts` + `react-apexcharts` as deps.
- A project that imports from `.../motion` must have `framer-motion` as a dep.

**Why not a separate repo?** One repo, one `yalc push`, no version drift. The subpath pattern is strictly better at this library's scale.

**tsup config must declare all three entry points:**

```ts
// tsup.config.ts — required shape
defineConfig([
  { entry: { index: 'src/index.ts' },          ... },  // main — MUI only
  { entry: { utils: 'src/utils-index.ts' },     ... },  // utils — server-safe
  { entry: { charts: 'src/charts-index.ts' },   ... },  // charts — ApexCharts
  { entry: { motion: 'src/motion-index.ts' },   ... },  // motion — framer-motion
]);
```

**`package.json` exports map must match:**

```json
"exports": {
  ".": { "import": "./dist/index.mjs", "require": "./dist/index.js", "types": "./dist/index.d.ts" },
  "./utils": { "import": "./dist/utils.mjs", "require": "./dist/utils.js", "types": "./dist/utils.d.ts" },
  "./charts": { "import": "./dist/charts.mjs", "require": "./dist/charts.js", "types": "./dist/charts.d.ts" },
  "./motion": { "import": "./dist/motion.mjs", "require": "./dist/motion.js", "types": "./dist/motion.d.ts" }
}
```

**Status (7 May 2026):** `/utils` exists. `/charts` and `/motion` wired — `src/charts-index.ts`, `src/motion-index.ts`, tsup entries, and `package.json` exports map all in place. Build verified green. Placeholder barrels only — Phase H components will be exported from here.

### tsup `external` rule — non-negotiable

Every package listed under `peerDependencies` in `package.json` **must also appear in
the `external` array in `tsup.config.ts`**. If a peer dep is missing from `external`,
tsup bundles that package's source into `dist/index.js`. Webpack in the portfolio then
sees two module instances for context-holding singletons (e.g. `@mui/material`
`useMediaQuery`), causing runtime crashes:

```
_mui_material_useMediaQuery__WEBPACK_IMPORTED_MODULE_N__ is not a function
```

The webpack `resolve.alias` fix in `alexrebula/next.config.ts` only works on imports
that go through webpack's resolver — it cannot fix code that was pre-bundled by tsup.

**Enforcement checklist — run whenever `package.json` peerDependencies changes:**

1. Open `tsup.config.ts`.
2. Compare its `external` array against every key in `peerDependencies`.
3. Any missing key → add it to `external` immediately.
4. Run `npm run build` and verify the dist contains `import ... from "pkg"` lines
   (external reference), not inlined source code.

Current required entries (keep in sync with `package.json`):

- `react`, `react-dom`, `react/jsx-runtime`, `react/jsx-dev-runtime`
- `@mui/material`
- `@mui/lab`
- `@emotion/react`, `@emotion/styled`
- `@iconify/react`
- `framer-motion` — must be in `external` for the `/motion` entry
- `apexcharts`, `react-apexcharts` — must be in `external` for the `/charts` entry

**Each tsup entry has its own `external` array.** Do not assume the main entry's `external` covers the subpath entries — check each one.

---

## Git workflow rule — non-negotiable, no exceptions

**Never push directly to `main`. Every change goes through a branch and a pull request.**

```sh
# ✅ correct — always
git checkout -b feature/my-change
# ... make changes ...
git push origin feature/my-change
# then open a PR on GitHub

# ❌ forbidden — never
git push origin main
```

This applies to all changes: code, docs, config, copilot-instructions. No exceptions.

---

## Post-component workflow (enforce always — run after every new component is complete)

After every new component is built, tests pass, and `check:verify` is green, run these
steps **in order** before switching to the portfolio:

```sh
# 1. Build the distributable (tsup) — produces dist/index.js and dist/index.d.ts
npm run build

# 2. Push to the portfolio via yalc — updates node_modules/@alexrebula/giselle-mui
yalc push

# 3. In the portfolio — clear the Turbopack module-graph cache, then restart
#    (in alexrebula/) rm -rf .next && npm run dev
#    Turbopack caches the full module graph inside .next/dev/. Skipping this step
#    means the old pre-fix bundle stays loaded — components that were null stay null.
```

`yalc push` updates `node_modules/@alexrebula/giselle-mui` in the portfolio automatically.
**Always clear `.next` in the portfolio after a `yalc push`.**

---

## Quality gate

All six checks must pass before every push:

```sh
npm run check         # auto-fix Prettier + ESLint, then verify all
npm run check:verify  # verify only (same as CI / pre-push hook)
```

Checks (in order): Prettier → ESLint → `tsc --noEmit` → Vitest → tsup build → Storybook build

- **Storybook build** runs in CI (`CI=true`) and is also part of the pre-push hook (`--storybook` flag).
  Broken stories are caught before any code reaches `main`.
- **tsup build** verifies the published package compiles and tree-shakes cleanly — not just types.
- Pre-push hook wired via `.githooks/pre-push` + `scripts/setup-hooks.js` (runs on `postinstall`).
- GitHub Actions CI defined in `.github/workflows/ci.yml`.

### Storybook infrastructure

- Config: `.storybook/main.ts` (react-vite builder) + `.storybook/preview.tsx` (wraps stories in `ThemeProvider` with `cssVariables: true`)
- Stories live co-located with their component: `src/components/<name>/<name>.stories.tsx`
- **The filename MUST match `*.stories.tsx`** — Storybook's glob is `src/**/*.stories.@(ts|tsx)`. A file named `stories.tsx` (no component-name prefix) is invisible to Storybook and will never appear in the UI.
- Every story file must pass `tsc --noEmit`, ESLint, and Prettier — they are in `src/` and covered by all checks
- Named component helpers (e.g. `function ToggleDemo()`) must be used whenever a story render function uses React hooks — anonymous arrow functions inside `render:` violate the `react-hooks/rules-of-hooks` ESLint rule

### TimelineTwoColumn Storybook stories as design-decision documents — MANDATORY

Every non-trivial design decision in `TimelineTwoColumn` **must** be documented as a
dedicated Storybook story. Stories in this component are not just visual demos — they are
the canonical source of truth for architectural decisions that would otherwise only live
in PR descriptions or chat history.

**A new story is mandatory for every:**

- New component variant (`'marker'`, `'life-event'`, `'scenario'`) — document when to use
  it vs. the alternatives, with side-by-side comparison if relevant
- New prop that changes rendering behaviour — show the before/after in one story
- Non-obvious layout rule (column placement invariant, marker side direction, z-index
  stacking, overdue-dot colour) — make the rule visually verifiable in the canvas
- Design decision that was reached through iteration — document what was tried, what was
  wrong with it, and why the current approach was chosen

**Story structure for decision-doc stories:**

1. JSDoc on the export function: `title` → the rule or decision → why it was chosen →
   what the alternative was → the invariant it protects
2. `parameters.docs.description.story`: short markdown paragraph explaining what to observe
3. Canvas: shows the rule in action, verifiable without reading the source code

**Why this matters:**

`TimelineTwoColumn` has accumulated non-obvious architectural decisions through real-world
usage iterations (column inversion, marker `side` semantics, tooltip description previews,
birthday placement as marker not milestone, done-dot colour enforcement, z-index stacking).
A future contributor — or the next Copilot session — must be able to understand these
decisions from the stories alone, without access to the original conversation.

**The stories are the documentation. Write them first.**

---

## Code quality standards (enforce proactively — do not wait to be asked)

### Mandatory post-edit quality checks

After **every** file edit — no exceptions — run all three checks on the modified file before proceeding:

```sh
# 1. Prettier — auto-formats in place (fast, sub-second)
npx prettier --write <path/to/file>

# 2. ESLint with auto-fix — corrects lint violations in place (fast, sub-second)
npx eslint --fix <path/to/file>

# 3. SonarQube — catches cognitive complexity, DOM prop leaks, .dataset vs getAttribute, etc.
#    Use the sonarqube_analyze_file tool (not a terminal command)
```

**What each check catches:**

| Violation                                            | Prettier    | ESLint            | SonarQube |
| ---------------------------------------------------- | ----------- | ----------------- | --------- |
| Formatting (quotes, trailing commas, indent)         | ✅ auto-fix | ⚠️ some rules     | —         |
| Duplicate imports                                    | —           | ✅ auto-fix       | ✅        |
| Global builtins (`parseFloat` → `Number.parseFloat`) | —           | ✅ auto-fix       | ✅        |
| Unused variables / imports                           | —           | ✅                | ✅        |
| Cognitive complexity > 15                            | —           | ❌ not configured | ✅        |
| DOM prop leaks (`shouldForwardProp`)                 | —           | ❌                | ✅        |
| `getAttribute` vs `.dataset`                         | —           | ❌                | ✅        |

Do not run tests, mark a task complete, or move to the next file until all three pass on the file just edited. If any check reports errors, fix them immediately before continuing.

---

### Cognitive complexity

SonarQube enforces a limit of **15** per function. Any callback inside `.map()` or `.forEach()` that has conditional logic, nested branches, or derived values is at risk.

**When to run `sonarqube_analyze_file`:**

- When a session opens on a component file that has open tasks — run it immediately, before any other work.
- After every edit to a component file — run it again to confirm no new violations were introduced.
- Before marking any task complete — must show zero violations.

**How to fix:** Extract per-item logic into a named helper function. The render callback itself should only compose already-computed values into JSX. Regex patterns with long alternation groups (e.g. 12-way month names) count toward complexity — prefer a broad pattern + JS validation instead.

### Memoization

Any value or function inside a component that is:

- derived from props/state, or
- passed as a prop to a child, or
- used as a `useEffect` dependency

...must be wrapped in `useMemo` / `useCallback` unless it is a primitive literal. Inline arrow functions inside `.map()` callbacks that are passed as props to children must be extracted to named `useCallback` handlers defined before the return statement.

### JSDoc

- **Component function:** one-sentence JSDoc describing what problem it solves — always required.
- **Own props:** one-line JSDoc only when the purpose is non-obvious; add `@default value` for defaulted props.
- **Inherited MUI props:** no JSDoc, ever — TypeScript inheritance carries MUI's own JSDoc into autodoc automatically.
- **Multi-line JSDoc blocks are forbidden.** One line is the hard limit. If it takes more than one sentence, the API is probably wrong.

See full rules: [`docs/components/api-design-rules.md`](../docs/components/api-design-rules.md)

### Component API — tier system (enforce always)

Every component belongs to one tier. Identify the tier before designing props.

| Tier | When to use | Props | JSDoc on props? |
|---|---|---|---|
| **1 — Pure extension** | Only value-add is enforcing a convention | Inherit everything from MUI base. Add zero new props. | None on Props interface |
| **2 — Selective extension** | Narrowing MUI's API, adding a ReactNode slot, pre-wiring a non-obvious combination | Extend MUI base. Add only the truly new props. | Only on own props |
| **3 — Composition** | Assembles multiple MUI primitives from a data array | `items: Item[]`, `sx?: SxProps<Theme>`, config props only — do not extend a specific MUI base | Document the item type |

**Shared style vs shared component rule:**
- Visual-only sharing (colours, spacing, shadows) → use a style constant in `*.styles.ts`
- Structural sharing (recurring DOM shape with multiple named slots) → thin wrapper component

**The `Paper` → card pattern:** all card components extend `PaperProps` directly and import a shared `cardBaseSx` constant. There is no `BaseCard` wrapper component. Exception: `ChartCardBase` — justified by a non-trivial shared structural shell (title + year-selector slot + chart area + legend).

**7 prop design rules (non-negotiable):**
1. Inherit first — check if MUI already has the prop before adding it.
2. `ReactNode` for all slots — never accept a specific icon or image component type.
3. `sx` always last — forwarded to the root element.
4. `color` follows MUI convention — `'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'` with `@default 'primary'`.
5. No boolean props that duplicate MUI — `disabled`, `fullWidth`, `variant` come through the extended interface.
6. Data props use plain types — `items: Item[]` not `items: React.ComponentProps<...>`.
7. No callback duplication — only add callbacks for events MUI does not expose.

**Do not create a component if:** only a default prop value changed, it's identical to MUI, it's used in one place only, or the abstraction saves fewer lines than it adds.

See full rules: [`docs/components/api-design-rules.md`](../docs/components/api-design-rules.md)

---

### Component folder structure rule

A component gets its own subfolder (`src/components/<name>/`) **only when it is exported from `src/index.ts`** (independently usable by consumers).

Internal sub-components — helpers, local wrappers, private building blocks that only make sense inside their parent — stay flat in the parent's folder. Creating a subfolder for an internal component implies it is independently usable; that false signal causes confusion during refactors.

### Storybook title convention (enforce always — no exceptions)

The `title` in every `.stories.tsx` file **must mirror the `src/components/` folder path exactly**, using `/` as the separator and title-casing each segment.

**Rule:** `src/components/material/surfaces/card/stat/` → `title: 'Material/Surfaces/Card/Stat'`

- Derive the title by reading the file path — never invent a title independently.
- The `'Components'` group is **abolished** — it is a catch-all that gives no information.
- If a `title` disagrees with its folder path, fix the `title` — never move the file to match a title.
- CI enforces this automatically (`npm run check:verify` → `scripts/check-story-titles.js`).

**Decision rule for which model to trust:** if a model (Copilot, Claude, or other) assigns a `title` that conflicts with the folder path, the folder path wins — always. Verbal agreements to a different convention that were not committed to this file are void.

---

### Storybook story decision rule

A Storybook story file is created **only when seeing the component in isolation answers a question a developer would actually ask when deciding to use it**.

**Evaluation checklist before writing a story:**

1. Is the component exported from `src/index.ts` (independently usable)? If no — `.md` only.
2. Does isolation reveal something invisible in a full parent context (variant comparison, state matrix, light/dark mode switch)? If no — `.md` only.
3. Does a developer need to see this to choose how to use it? If no — `.md` only.

Use `argTypes: { control: false }` for `ReactNode` and `SxProps` slots. Every story that demonstrates colour variants must include all six palette keys: `primary`, `secondary`, `info`, `success`, `warning`, `error`.

Every exported component must have a `Responsive` story that renders the component inside labeled containers at each MUI standard breakpoint width: xs (360px), sm (600px), md (900px), lg (1200px). Use `parameters: { layout: 'padded' }` on these stories. For grid-based components (cards in a collection), the column count should increase with width. Named component helpers are required when the story uses React hooks.

**No hardcoded hex, rgb, or rgba literals in any story file — non-negotiable.** Story scaffold chrome (breakpoint labels, dashed borders, dividers) must use MUI theme tokens via `sx` on MUI components. Never use `style={{ color: '#666' }}` or `style={{ border: '1px dashed #ccc' }}`; use `sx={{ color: 'text.secondary' }}` and `sx={{ border: '1px dashed', borderColor: 'divider' }}` instead. This ensures story chrome respects dark mode automatically. Enforce this on every story file touched — not just new ones.

**Zero inline `sx={{}}` in story files — non-negotiable.** Every `sx` object in a story file — regardless of property count — must be extracted to a module-level named constant before the first story export. Reasoning: (1) consistent discoverability — all styles are grep-findable at file top, (2) no per-render object allocations for static styles, (3) uniform enforcement avoids "is 2 properties ok?" debates. The `~3 properties` threshold does not apply to story files. There are **no exceptions** — not even single-property objects or `{ width }` loop variables.

**Use shared story scaffold constants from `src/stories-defaults.ts`** — never re-define equivalent patterns inline. Import the relevant constant instead:

| Constant                          | Usage                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------- |
| `responsiveWrapperSx`             | Outer `<Box>` in `Responsive` stories (`flex`, `column`, `gap: 4`)            |
| `breakpointLabelSx`               | `<Typography variant="caption">` breakpoint width label                       |
| `breakpointContainerSx`           | Static `<Box>` styles (border, overflow) — use via one of the factories below |
| `buildBreakpointWidthSx(w)`       | Standard container at pixel width `w` — use in all Responsive stories         |
| `buildBreakpointPaddedWidthSx(w)` | Like above with `p: 1` — for stories that need inner padding                  |
| `buildBreakpointMaxWidthSx(w)`    | Like above with `maxWidth: '100%'` — for responsive-capped stories            |
| `variantGridSx`                   | `<Box>` wrapping a row of colour variant cards (`flex`, `wrap`, `gap: 2`)     |
| `dotColumnSx`                     | `<Box>` stacking dot demos vertically with centre alignment                   |
| `timelineStoryWrapperSx`          | `<Box>` wrapper for timeline stories (`maxWidth: 960`, `mx: 'auto'`, `p: 3`)  |
| `MANGO_*` constants               | Giselle brand palette tokens for any story that needs brand colours           |

### `*.styles.ts` companion files for sx extraction (enforce always)

Inline `sx` objects that span more than ~3 properties must be extracted to a co-located `<component-name>.styles.ts` file. This makes components scannable and the style logic independently testable.

**`style={{}}` on `motion.*` elements — no inline object literals, ever.** Every `style` prop on a `motion.*` component must reference a named export from `<component-name>.styles.ts`, regardless of property count. `MotionValue`-based styles use a factory function defined in `*.styles.ts`; the call happens in JSX:

```ts
// scroll-parallax-hero.styles.ts
import type { MotionValue } from 'framer-motion';
export const parallaxYStyle = (y: MotionValue<number>) => ({ y });
export const parallaxOpacityStyle = (opacity: MotionValue<number>) => ({ opacity });
```

```tsx
// in JSX — never inline { y: y1 } here
<motion.div style={parallaxYStyle(y1)}>
<motion.div style={parallaxOpacityStyle(opacity)}>
```

**Pattern — non-negotiable:**

```ts
// phase-card.styles.ts
import type { SxProps, Theme } from '@mui/material/styles';
import { channelAlpha } from '../../utils/theme-utils';

// Static sx — no runtime args needed
export const cornerBadgeSx: SxProps<Theme> = (theme) => ({
  boxShadow: `0 2px 6px ${channelAlpha(theme.vars!.palette.grey['900Channel'], 0.3)}`,
});

// Dynamic sx — takes component props as args, returns SxProps
export const paperSx =
  (done: boolean): SxProps<Theme> =>
  (theme) => ({
    opacity: done ? 0.6 : 1,
    transition: theme.transitions.create('opacity'),
  });
```

Then in the component: `sx={cornerBadgeSx}` or `sx={paperSx(done)}` — one token instead of 8 lines.

**File naming:** `<component-name>.styles.ts` — plain `.ts`, not `.tsx`. These files contain no JSX.

**Testing — mandatory:** Every `*.styles.ts` file must have a companion `*.styles.test.ts`. An `SxProps<Theme>` function is just `(theme: Theme) => CSSObject` — call it with a minimal mock theme and assert the returned object:

```ts
// phase-card.styles.test.ts
// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { cornerBadgeSx, paperSx } from './phase-card.styles';
import type { Theme } from '@mui/material/styles';

const mockTheme = {
  vars: { palette: { grey: { '900Channel': '33 43 54' } } },
  transitions: { create: () => 'opacity 300ms' },
} as unknown as Theme;

describe('cornerBadgeSx', () => {
  it('returns expected box-shadow using theme channel', () => {
    const styles = (cornerBadgeSx as Function)(mockTheme);
    expect(styles.boxShadow).toBe('0 2px 6px rgba(33 43 54 / 0.3)');
  });
});

describe('paperSx', () => {
  it('sets opacity 0.6 when done=true', () => {
    expect((paperSx(true) as Function)(mockTheme).opacity).toBe(0.6);
  });
  it('sets opacity 1 when done=false', () => {
    expect((paperSx(false) as Function)(mockTheme).opacity).toBe(1);
  });
});
```

**Regression tests for critical style rules:** Any style value that encodes a non-obvious design or accessibility decision (minimum size, required channel reference, WCAG contrast formula) must have a dedicated regression test that fails if the value is changed to something wrong. Do not leave these values guarded only by code review.

**Enforcement checklist — run whenever a component file is edited:**

1. Any new `sx={}` with more than ~3 properties → move to the styles file immediately
2. Any `style={{...}}` on a `motion.*` element (any property count) → move to the styles file immediately; use a factory if the values are `MotionValue` instances
3. Any existing inline `sx={}` or `style={{}}` touched during the edit → extract it at the same time (no mixed state)
4. After extraction → run the styles test file to confirm the mock-theme assertions still pass
5. **Name by structural role, not by child content.** A Box that positions a label is a _slot_ — name it `*SlotSx` or `*WrapperSx`, not `*LabelSx`. The name describes what the element _is_ structurally; naming it after what currently lives inside it becomes wrong the moment the child changes. Full rule: `docs/components/cleanup-workflow.md` Step 3.
6. **Merge parallel variants into a factory.** Two constants that share the same structure and differ only by one argument (e.g. `side: 'left' | 'right'`) must be a single factory — never two separate exports. Separate constants diverge silently under refactoring. Canonical examples: `timelineColumnSx`, `msColumnBoxSx`, `markerLabelSlotSx`. Full rule: `docs/components/cleanup-workflow.md` Step 3.

### `*.const.ts` companion files for constants (enforce always)

Every exported `const` that represents a **size, font size, badge size, minimum touch target, or spacing value** must live in a co-located `<component-name>.const.ts` file — never inside `.tsx`.

**Why this rule exists:**

- Constants are the most commonly regression-tested values in a component library. Extracting them lets a test do `import { CORNER_ALERT_BADGE_SIZE } from './phase-card.const'` without pulling in JSX, React, or MUI at all.
- It makes the contract between components explicit: every size value is named and one import away.
- Inline magic numbers (e.g. `width={26}`) are invisible to grep and untestable. Named exports are both.

**Pattern — non-negotiable:**

```ts
// phase-card.const.ts

/** Font size for all status badge labels (Overdue, Now, Date overlap, Scenario). */
export const STATUS_BADGE_FONT_SIZE = '0.75rem';

/** Size (px) of the corner alert badge circle container. */
export const CORNER_ALERT_BADGE_SIZE = 26;

/** Icon size (px) inside the corner alert badge circle. */
export const CORNER_ALERT_ICON_SIZE = 16;

/**
 * Icon size (px) for the viewed eye button.
 * Must meet WCAG 1.4.11 — interactive icons must be >= 20px. Never set below 20.
 */
export const PHASE_EYE_ICON_SIZE = 20;
```

Then in the component: `width={PHASE_EYE_ICON_SIZE}` — named, testable, grep-findable.

**File naming:** `<component-name>.const.ts` — plain `.ts`, not `.tsx`. No JSX, no MUI imports.

> **Scope of this rule:** `*.const.ts` is for **primitive constants only** — numbers, strings, booleans. Things like `ICON_SIZE = 20`, `FONT_SIZE = '0.75rem'`, `MIN_TOUCH_TARGET = 24`. Default value arrays that contain JSX (e.g. `DEFAULT_ICON_ACTIONS`) are **not** primitive constants — they belong in a separate `<component-name>.defaults.tsx` file instead. Never contort JSX into `createElement` calls just to satisfy a `.ts` extension.

**Barrel export:** The const file must be added to the folder's `index.ts`:

```ts
export * from './phase-card.const';
```

**Regression tests — mandatory:** The component's `*.test.ts` must include a `describe('readability — minimum size constants', ...)` block that imports each constant and asserts it is at or above its minimum:

```ts
import { PHASE_EYE_ICON_SIZE, CORNER_ALERT_ICON_SIZE } from './phase-card.const';

describe('readability — minimum size constants', () => {
  it('[regression] PHASE_EYE_ICON_SIZE >= 20px', () => {
    expect(PHASE_EYE_ICON_SIZE).toBeGreaterThanOrEqual(20);
  });
  it('[regression] CORNER_ALERT_ICON_SIZE >= 16px', () => {
    expect(CORNER_ALERT_ICON_SIZE).toBeGreaterThanOrEqual(16);
  });
});
```

**Enforcement checklist — run whenever a component file is edited:**

1. Any `export const` in a `.tsx` file that is a size, font size, or touch-target value → move to `*.const.ts` immediately.
2. Any `export const` that contains JSX (e.g. default action arrays, default icon elements) → move to `*.defaults.tsx` — never `.const.ts`.
3. Check that the const file is re-exported from `index.ts`.
4. Check that a regression test exists for every constant with a safety minimum.

### Sub-component extraction rule (enforce always)

Internal sub-components — functions that start with a capital letter and return JSX — must **never** be defined inline inside a parent `.tsx` file. Each sub-component gets its own `.tsx` file, flat in the same folder.

**Rule:**

- One `.tsx` file per component, including internal helpers.
- The parent `.tsx` imports and uses them — never defines them.
- Types for each sub-component remain in the folder's `types.ts` (not inside the sub-component file).
- If the sub-component has constants, they go in the folder's `*.const.ts`.
- If the sub-component has non-trivial logic, it calls helpers from the folder's `utils.ts`.

**Why:**

- A 600-line `.tsx` mixing 5 components is not maintainable. Finding a bug means searching the entire file.
- Sub-components defined inline are untestable in isolation. After extraction, each gets its own focused test.
- Even if a sub-component looks "internal today", it almost always becomes reusable later. Extracting now costs 2 minutes; extracting during a refactor costs much more.
- The fact that a function is only _used_ by one parent does not mean it should _live inside_ that parent.

**What belongs in its own file:**

Any function that:

- starts with a capital letter (React component convention), OR
- returns JSX (`ReactNode`), OR
- has its own prop type in `types.ts`

...gets its own `.tsx` file.

**What can stay inline:**

- Anonymous function expressions inside `Array.map()` that return 1–2 JSX elements with no logic.
- Helper render variables (e.g. `const badge = <GiselleIcon ... />`) that do not have their own props.

**File naming:** Use kebab-case matching the component's PascalCase name:

- `CardCornerAlertBadge` → `card-corner-alert-badge.tsx`
- `LabeledIconStrip` → `labeled-icon-strip.tsx`

**Barrel export:** Every sub-component file must be added to the folder's `index.ts`:

```ts
export * from './card-corner-alert-badge';
export * from './labeled-icon-strip';
```

**Tests — mandatory:** Every sub-component must have at least one test. Add the sub-component tests to the folder's main `*.test.ts` (a new `describe` block) or create a dedicated `<sub-component>.test.ts`.

### Preferred `.dataset` over `getAttribute` in tests

Use `element.dataset['camelKey']` rather than `element.getAttribute('data-kebab-key')` in test files. Sonar flags `getAttribute` as a code smell when `.dataset` is available.

### Minimum readable sizes (enforce always — not just before submission)

> **Every time you write a `width={...}` or `fontSize` on an icon or label, check this table first.**
> Violations of these minimums have happened repeatedly. Do not guess — look up the constant.

Icons and text in this library are read by real users. The following minimums are **non-negotiable** and enforced by regression tests:

| Element                                      | Minimum                     | Notes                                                  |
| -------------------------------------------- | --------------------------- | ------------------------------------------------------ |
| Inline icon (status badge, spine, pill)      | `width={16}`                | Never `width={12}` or `width={14}`                     |
| Interactive icon (button, clickable control) | `width={20}`                | Clickable icons must be larger than decorative ones    |
| Corner alert badge circle                    | `26px`                      | The circle container; icon inside must be `width={16}` |
| Standalone decorative icon (card corner)     | CSS `width: 32, height: 32` | Applied via `'& svg': { width: 32, height: 32 }`       |
| Pulsing dot / status indicator               | `12px`                      | Never `width: 10, height: 10`                          |
| Badge / pill label text                      | `0.75rem`                   | Never `0.65rem` or `0.7rem`                            |
| Item date / supplementary label              | `0.875rem`                  | Match `body2`; never override below default            |

**Enforcement pattern — mandatory for every component that has size values:**

1. Export every size value as a named constant from the component file:
   ```ts
   export const PILL_ICON_SIZE = 16;
   export const STATUS_BADGE_FONT_SIZE = '0.75rem';
   ```
2. Use the constant in the component JSX/sx — never inline the literal:
   ```tsx
   <GiselleIcon icon="..." width={PILL_ICON_SIZE} />
   <Typography sx={{ fontSize: STATUS_BADGE_FONT_SIZE }} />
   ```
3. Write a `describe('readability — minimum size constants', ...)` block in the component's `*.test.ts` that imports the constants and asserts each is `>= MIN_ICON_SIZE_PX` or `>= MIN_FONT_SIZE_REM`. If a constant is changed below the minimum, the test fails before production.

### Test coverage — 80% minimum

This package targets ≥80% line/branch/function/statement coverage, enforced in the quality gate. Coverage is measured with `@vitest/coverage-v8`.

**Running coverage locally:**

```sh
npm run test:coverage   # generates text summary + lcov report
```

**Gate status:** The 80% threshold is defined in `vitest.config.ts` under `coverage.thresholds`. Once wired into `scripts/quality-gate.js` (Phase 1.7 T1), `npm run check:verify` will fail if any threshold is not met.

**Rules — non-negotiable:**

- Every new component or utility must ship with tests. A file that adds exported symbols without tests is a blocker for merge.
- When a test is written, it must cover the expected behaviour, not just call the function. Refer to the test conventions section above.
- Do not artificially boost coverage with empty assertions or `it.todo`. Every test must make at least one meaningful assertion.
- Coverage excludes: `*.test.ts`, `*.stories.tsx`, `*/index.ts` barrel files. Do not add test-only helper files to the coverage `include` pattern.

### TimelineTwoColumn — MilestoneBadge column alignment rule

`MilestoneBadge` accepts a `columnSide: 'left' | 'right'` prop (default `'right'`).

**Rule — non-negotiable:**

- Left-column milestones (`columnSide="left"`) right-align their collapsed title and inline elements so text sits flush against the centre spine. There must be no ragged gap between the card text and the spine.
- The alignment resets to left the moment the card is **expanded** (full reading flow requires left-to-right text).
- **On hover, the alignment must not change.** Hover only reveals the card background and border; text stays right-aligned until the card is actually opened.
- Right-column milestones always use left alignment (default). Do not pass `columnSide` at all, or pass `"right"`.

**Implementation — how the prop works:**

| State     | `columnSide="left"`                                                            | `columnSide="right"`       |
| --------- | ------------------------------------------------------------------------------ | -------------------------- |
| Collapsed | `textAlign: 'right'` on Paper root; flex rows use `justifyContent: 'flex-end'` | No override (default left) |
| Expanded  | Left alignment (both columns identical)                                        | Left alignment             |

**Where it is set:** in `timeline-two-column.tsx`, both `MilestoneBadge` call sites:

- Left-column block (`ctx.phaseSide === 'left'`): `<MilestoneBadge columnSide="left" ...>`
- Right-column block (`ctx.phaseSide === 'right'`): no `columnSide` (default `'right'`)

---

### TimelineTwoColumn — done-dot color enforcement rule

**Rule — non-negotiable:**

Every dot on the timeline — phase dots and milestone dots alike — must be **green with a checkmark** when `done=true`. The green success color is the universal "done" signal and must never be overridden by the data's `color` prop or by a grayscale/opacity filter applied by the parent container.

**Two-part implementation (both are required):**

1. **`resolveEffectiveColor(color, done)`** in `timeline-dot.tsx` forces `color='success'` when `done=true`. This is called inside `TimelineDot` before any sx callbacks reference the color. Exported for regression tests.

2. **No grayscale on the dot container.** The center column Box in `timeline-two-column.tsx` must NOT apply `filter: 'grayscale(1)'` or `opacity` to the dot. Grayscale/opacity belongs on the card Paper only — not on the dot's wrapper Box.

| Element       | Done state   | Expected                                                   |
| ------------- | ------------ | ---------------------------------------------------------- |
| Phase dot     | `done=true`  | Green circle with checkmark; never grayed                  |
| Milestone dot | `done=true`  | Green filled circle with checkmark; never grayed           |
| Phase dot     | `done=false` | Uses data `color` as-is                                    |
| Milestone dot | `done=false` | Uses resolved `msColor` (overdue → error, else data color) |

**Regression test location:** `timeline-dot.test.ts` — `resolveEffectiveColor — done-dot color enforcement (regression)`.

---

### TimelineTwoColumn — corner alert badge column-side positioning rule

`PhaseCard` accepts a `columnSide: 'left' | 'right'` prop (default `'right'`). The corner alert badge uses this to anchor itself on the correct edge.

**Rule — non-negotiable:**

- Right-column cards: badge floats on the **right** top corner — the outer edge, away from the spine (`right: 0, transform: translate(50%, -50%)`).
- Left-column cards: badge floats on the **left** top corner — the outer edge, away from the spine (`left: 0, transform: translate(-50%, -50%)`).

**Why:** the badge must always float on the edge that faces outward (away from the spine). A badge anchored on the spine-facing edge overlaps the spine connector and milestone dots.

**Where it is set:** in `timeline-two-column.tsx`, the `PhaseCard` call site:

```tsx
<PhaseCard phase={phase} columnSide={phase.side} {...buildPhaseCardTsxProps(...)} />
```

`phase.side` is **direct** — `'left'` means the card renders in the left column, `'right'` in the right column. `columnSide` matches it directly so the badge floats on the outer edge of whichever column the card is in.

The logic is encapsulated in `resolveCornerBadgeAlign(columnSide)` in `phase-card.tsx`, which returns `{ left?, right?, transform, tooltipPlacement }`. Exported for regression tests.

**Regression test location:** `phase-card.test.ts` — `resolveCornerBadgeAlign — column-side positioning (regression)`.

---

### TimelineTwoColumn — eye button WCAG accessibility rule

All `isViewed` / `onMarkViewed` eye buttons in this component family must meet WCAG 2.2 AA.

**Rule — non-negotiable:**

| Element                 | Icon size                                | Why                                                        |
| ----------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| Phase card eye badge    | `width={20}` (`PHASE_EYE_ICON_SIZE`)     | Interactive icons must be >= 20px — larger than decorative |
| Milestone title-row eye | `width={20}` (`MILESTONE_EYE_ICON_SIZE`) | Same rule                                                  |

- **Never use `opacity` alone to communicate state.** Opacity reduces visual contrast below WCAG 1.4.11 (3:1 ratio for UI components). Use icon variant change (`bold` vs `outline`) AND a foreground/background colour change together.
- **Never set `cursor: 'default'` on a toggleable button.** The user must always be able to click to toggle. A viewed item must be un-markable.
- **Always include `aria-pressed={isViewed}` and a descriptive `aria-label`** that reflects the current state and the action that will happen on click (e.g. `'Mark as not viewed'` when `isViewed=true`).
- **Export size constants.** Every eye icon/button size must be a named export (`PHASE_EYE_ICON_SIZE`, `MILESTONE_EYE_ICON_SIZE`, `EYE_BUTTON_MIN_SIZE`, `MILESTONE_EYE_BUTTON_MIN_SIZE`). Write a regression test asserting each icon size is `>= 20` and each button min-size is `>= 24`.

**Where the eye buttons live:**

- Phase card: floats outside `<Paper>` at the bottom outer edge (`position: absolute, bottom: 0`), column-side aware. Constants: `PHASE_EYE_ICON_SIZE = 20`, `EYE_BUTTON_MIN_SIZE = 28`.
- Milestone: inline in the title row (`<Box display="flex" alignItems="center">`), before the title when `columnSide='left'` (right-aligned column), after the title when `columnSide='right'` (left-aligned column). Constant: `MILESTONE_EYE_ICON_SIZE = 20`.

**Regression test locations:** `phase-card.test.ts` — `eye button — WCAG accessibility regression`; `milestone-badge.test.ts` — `eye button — WCAG accessibility regression`.

---

### Component cleanup — definition of done

Use `cleanup component <Name>` to trigger the full workflow (`docs/components/cleanup-workflow.md`). The checklists below are the acceptance criteria — every PR that touches a component file is reviewed against these.

**Scenario A — Sub-component (flat inside a parent folder):**

- [ ] No `type`/`interface` in `.tsx` — all in parent `types.ts`
- [ ] No sx with more than ~3 properties inline — all in parent `*.styles.ts`
- [ ] No `style={{}}` on `motion.*` elements — all in parent `*.styles.ts` (factory pattern for MotionValues)
- [ ] No duplicated JSX blocks — extracted to helper or util
- [ ] All inline conditional logic that produces a derived value is in `utils.ts`
- [ ] JSDoc covers all props including behaviour flags
- [ ] At least one test `describe` block exists for this sub-component
- [ ] Exported from parent `index.ts`
- [ ] SonarQube: zero violations
- [ ] `npm run check:verify` exits 0
- [ ] Quality status added to JSDoc (one line) — Step 14

**Scenario B — Standalone component (own subfolder):**

- [ ] Own subfolder created with all companion files present
- [ ] No `type`/`interface` in `.tsx` — all in `types.ts`
- [ ] No sx with more than ~3 properties inline — all in `<name>.styles.ts`
- [ ] No `style={{}}` on `motion.*` elements — all in `<name>.styles.ts` (factory pattern for MotionValues)
- [ ] `<name>.styles.test.ts` covers every exported factory
- [ ] No named constants for sizes inline — all in `<name>.const.ts`
- [ ] Regression tests for every size constant with a safety minimum
- [ ] No pure logic functions in `.tsx` — all in `utils.ts`
- [ ] No capital-letter helper components inside `.tsx` — each in its own flat `.tsx`
- [ ] No `React.FC`, no `any`, no bare `<Box>` without props
- [ ] `sx` array spread on root element
- [ ] `...other` spread on root element
- [ ] All internal sub-components exported from `index.ts`
- [ ] `src/index.ts` exports the component
- [ ] `README.md` complete
- [ ] SonarQube: zero violations
- [ ] All six palette keys shown in stories where colour variants exist
- [ ] `Responsive` story present
- [ ] `npm run check:verify` exits 0
- [ ] `npm run build` exits 0
- [ ] `yalc push` + consuming app validated
- [ ] Quality status added to component JSDoc and `README.md` — Step 14

---

## MUI Store quality bar (enforce always — not just before submission)

These rules come directly from the MUI Store submission requirements
(`https://support.mui.com/hc/en-us/articles/11440613164444`). They are development
standards, not pre-submission checklists. Every component must comply from the moment
it is written. The relevant requirements are summarized in this section so the
instructions remain self-contained for contributors.

### Do not use `React.FC`

Use plain function declarations. `React.FC` is redundant, adds implicit `children` typing
baggage, and is explicitly banned by the MUI Store quality bar.

```tsx
// ❌ wrong
const MyComponent: React.FC<MyProps> = ({ foo }) => { ... }

// ✅ correct
function MyComponent({ foo }: MyProps) { ... }
```

**Enforcement:** Any new component using `React.FC` must be refactored before merge.

### Do not use `<Box>` without using its props

If a JSX element has no props — not even `sx` — use a raw `<div>` (or `<span>`, `<section>`,
etc.) instead. `<Box>` is only justified when you are actively using at least one of its
MUI-specific props (`sx`, `component`, `ref`, or shorthand layout props like `display`).

```tsx
// ❌ wrong — Box adds runtime cost but provides nothing
<Box>
  <Typography>Hello</Typography>
</Box>

// ✅ correct — plain div when no Box props are needed
<div>
  <Typography>Hello</Typography>
</div>

// ✅ correct — Box justified because sx is used
<Box sx={{ display: 'flex', gap: 2 }}>
  <Typography>Hello</Typography>
</Box>
```

**Before every PR:** run the following to catch bare Box usage:

```sh
grep -rn "<Box[^/]*>" src/ | grep -v "sx=\|component=\|className=\|ref=\|aria-\|data-\|display="
```

### Use `shouldForwardProp` on every reusable `styled()` component

If a component uses `styled()`, it **must** declare `shouldForwardProp` to prevent custom
props from leaking into the DOM.

```tsx
// ❌ wrong — custom prop leaks to DOM → React warning + Sonar violation
const StyledDiv = styled('div')<{ active: boolean }>`
  color: ${({ active }) => (active ? 'red' : 'black')};
`;

// ✅ correct
const StyledDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  color: ${({ active }) => (active ? 'red' : 'black')};
`;
```

Currently: zero `styled()` components in this library. This rule fires the moment the
first one is introduced.

### Icon imports: one level deep (not from package root)

Import from `@iconify/react`, not from any `@iconify-json/*` path or the icon package root
without the module specifier. This is already the correct pattern in this library — do not
deviate.

```tsx
// ✅ correct
import { Icon } from '@iconify/react';

// ❌ wrong — root import of full icon set
import allIcons from '@iconify/json';
```

### No source maps in the distributed build

`sourcemap: true` is acceptable in `tsup.config.ts` for the open-source library (developers
debugging against source). But any **premium or production distribution** build must set
`sourcemap: false`. MUI Store ToS §9 explicitly prohibits distributing source maps.

This does **not** require changing the current `tsup.config.ts` today. It is a hard
constraint on the future premium template's separate build config.

### Browser support targets

All components must work in — and must not use APIs or CSS features unavailable in — the
following minimum versions:

| Browser              | Minimum |
| -------------------- | ------- |
| Chrome               | ≥ 121   |
| Firefox              | ≥ 121   |
| Edge                 | ≥ 117   |
| Safari (macOS + iOS) | ≥ 17.0  |

This matches the MUI Core supported browser matrix. Do not use CSS features, JS APIs, or
DOM behaviour that falls outside these targets.

### Images and SVGs

- No low-resolution raster images. Any raster asset must look sharp at >200 PPI.
- SVG files must be optimised — no verbose metadata, no inline raster data.
- If SVGs are added to Storybook or a demo app, run them through `svgo` before committing.

---

## Contributor profiles — code review tone

This repository welcomes contributors at all experience levels. When reviewing any PR:

- **Hold the same quality standard regardless of contributor experience.** Do not lower the bar — explain what needs to change and why, just as you would for any contributor.
- **Explain the why, not just the what.** Do not say "use `const` here"; say "use `const` here because this value never changes — it signals to anyone reading the code that this was intentional, not a mistake."
- **One issue per comment.** Do not stack multiple changes into one comment.
- **Acknowledge what is correct before noting what to improve.**
- **When something is wrong, show what correct looks like** — not just "this is wrong"; show the fixed version and explain why it is better.
- **Four sentences max per comment.** Link to MDN or the repo README instead of writing a lecture inline.
- **No jargon without a definition.** If a term like "idempotent", "side effect", or "type assertion" appears in a comment, define it in the same sentence.
- **Do not ask for perfection.** If the code is correct, passes the quality gate, and solves the problem — it ships. Encourage, merge, move on.
