---
sidebar_position: 2
sidebar_label: 'Roadmap'
---

# @alexrebula/giselle-mui — Roadmap

> This file is the source of truth for the giselle-mui library build. It covers theme utilities (Phases A–D), components, and extraction candidates. Summary entries for completed phases bubble up to `alexrebula/docs/roadmap.md` Phase 1.5 (private companion repo — not linkable from here).

---

## Current state

`@alexrebula/giselle-mui` uses only standard MUI v7 APIs to set up its theme:

```ts
import { extendTheme, ThemeProvider } from '@mui/material/styles';
```

There are zero external theme utility imports in this package.
See [`theming/nextjs.md`](./theming/nextjs.md) for the recommended setup in a new project.

---

## Theme utilities

**Phase A shipped — 4 May 2026.** Theme-building helpers are available as named exports
from `@alexrebula/giselle-mui`:

```ts
import { channelAlpha, hexToChannel, pxToRem, remToPx } from '@alexrebula/giselle-mui';
```

See [`theming/nextjs.md`](./theming/nextjs.md) for full usage examples and integration guide.

---

## Roadmap for giselle-mui

### Phase A — Ship standalone theme token utilities — Theming ✅ Done — 4 May 2026

**Goal:** Ship the small theme-building primitives needed by any MUI v7 project
as named exports from `giselle-mui`, so consuming projects have them out of the box.

| Task                                                                  | Label   | Status |
| --------------------------------------------------------------------- | ------- | ------ |
| Add `channelAlpha(channel, alpha)` to `giselle-mui/src/utils/`        | Theming | ✅     |
| Add `hexToChannel(hex)` to `giselle-mui/src/utils/`                   | Theming | ✅     |
| Add `pxToRem(px)` and `remToPx(rem)` to `giselle-mui/src/utils/`      | Theming | ✅     |
| Export all theme utilities from `giselle-mui/src/index.ts`            | Theming | ✅     |
| Add tests for all theme utilities (22 tests in `theme-utils.test.ts`) | Theming | ✅     |
| Update `theming/nextjs.md` to show usage from giselle-mui             | Theming | ✅     |

### Phase B — Giselle brand theme preset — Theming ✅ Done — 5 May 2026

**Goal:** Define the Giselle default palette and typography scale as a named export
(`giselleTheme`) — a ready-to-use `extendTheme()` result that consuming projects can
import directly, extend, or ignore in favour of their own palette.

The default palette decisions (documented in `src/utils/theme-preset.ts` JSDoc):

- **Primary light:** `#2E7D32` Deep grove green — WCAG 4.76:1 contrast against white
- **Primary dark:** `#76C442` Lime — readable on dark backgrounds
- **Secondary:** `#F5A623` Mango gold — unchanged across modes
- **Info / Success / Warning / Error:** standard MUI v7 family values, both modes

| Task                                                                                                   | Label   | Status |
| ------------------------------------------------------------------------------------------------------ | ------- | ------ |
| Decide final hex values for `primary` and `secondary` Giselle palette colours                          | Theming | ✅     |
| Define `giselleTheme` using `extendTheme()` with the Giselle palette                                   | Theming | ✅     |
| Ensure all six palette keys are covered: `primary`, `secondary`, `info`, `success`, `warning`, `error` | Theming | ✅     |
| Export `giselleTheme` from `giselle-mui/src/index.ts`                                                  | Theming | ✅     |
| Document the palette decisions in `theming/nextjs.md`                                                  | Theming | ✅     |

### Phase C — GiselleThemeProvider component — Theming ✅ Done — 13 May 2026

**Goal:** Expose a `<GiselleThemeProvider>` wrapper from `giselle-mui` that:

1. Ships with the Giselle brand theme (Phase B) as the default — zero-config usage
2. Accepts a `themeOverrides` prop for consumers who want a different palette, typography, or spacing
3. Accepts a `theme` prop for consumers who want to bypass the defaults entirely and pass their own `extendTheme()` result

This is the DX goal:

```tsx
// Zero config — uses Giselle green + amber palette
<GiselleThemeProvider>
  <App />
</GiselleThemeProvider>

// Consumer overrides specific tokens — still wraps in ThemeProvider correctly
<GiselleThemeProvider themeOverrides={{ palette: { primary: { main: '#1976d2' } } }}>
  <App />
</GiselleThemeProvider>

// Fully custom — consumer owns the full theme
<GiselleThemeProvider theme={extendTheme(myThemeInput)}>
  <App />
</GiselleThemeProvider>
```

**Design principle — sensible defaults, easy to override:**

The previous plan required consumers to provide all tokens. This created too much friction for
the zero-config case. The revised design ships a real default so consumers can try the library
immediately without any theme configuration.

**What it wraps (shipped implementation — simplified):**

```tsx
// 'use client' — ThemeProvider is a client component
import { ThemeProvider, extendTheme } from '@mui/material/styles';
import { giselleTheme, giselleThemeOptions } from '../utils/theme-preset';
import { deepMerge } from '../utils/deep-merge'; // internal — not exported from barrel

function GiselleThemeProvider({ children, themeOverrides, theme, defaultMode = 'system' }: Props) {
  const resolvedTheme =
    theme ??
    (themeOverrides ? extendTheme(deepMerge(giselleThemeOptions, themeOverrides)) : giselleTheme);
  return (
    <ThemeProvider theme={resolvedTheme} defaultMode={defaultMode}>
      {children}
    </ThemeProvider>
  );
}
```

| Task                                                                                   | Label   | Status |
| -------------------------------------------------------------------------------------- | ------- | ------ |
| Complete Phase B (Giselle theme preset) — this prerequisite is already met             | Theming | ✅     |
| Define `GiselleThemeProviderProps` interface (`children`, `themeOverrides?`, `theme?`) | Theming | ✅     |
| Implement `GiselleThemeProvider` wrapping `ThemeProvider` with merge logic             | Theming | ✅     |
| Export `GiselleThemeProvider` from `giselle-mui/src/index.ts`                          | Theming | ✅     |
| Add Storybook story: default palette, with overrides, fully custom                     | Theming | ✅     |
| Add Vitest test: renders correctly, passes `data-mui-color-scheme` to DOM              | Theming | ✅     |
| Update `theming/nextjs.md` with the new zero-config usage pattern                      | Theming | ✅     |

**Storybook note:** Storybook in `giselle-mui` must be able to test two things:

1. MUI wrapper components (existing) — isolated, styled via a test theme
2. `GiselleThemeProvider` — with the default Giselle palette, with overrides, and with a
   fully custom theme. All three modes must have a story.

Sample token data used in Storybook stories must be defined in `giselle-mui` itself —
no imports from `alexrebula` or any client project.

**This is the foundational prerequisite for:**

- Writing authoritative dev.to articles about MUI v7 CSS variables (`GiselleThemeProvider` is the worked example)
- The premium template (the template's look is the default Giselle palette, consumers override it)

---

### Phase D — GiselleSettingsProvider — Theming ✅ Done — 14 May 2026

**Goal:** Export a framework-agnostic, MIT-safe `GiselleSettingsProvider<TState>` that
persists user UI preferences (color mode, direction, font size, color presets) with zero
proprietary dependencies. Enables consumers to swap out a third-party `SettingsProvider`
in a one-import change.

**Prerequisite:** Phase C (GiselleThemeProvider) — the settings system drives the theme.

Full design: [`docs/components/settings-provider-plan.md`](../components/settings-provider-plan.md)

| Task                                                                                                     | Label   | Status |
| -------------------------------------------------------------------------------------------------------- | ------- | ------ |
| Phase α: Port `useLocalStorage<T>` to `src/utils/use-local-storage.ts`                                   | Theming | ✅     |
| Phase α: Write `isDeepEqual(a, b)` — covers primitives, arrays, plain objects (no es-toolkit)            | Theming | ✅     |
| Phase α: Write `getCookieValue` / `setCookieValue` — SSR-safe (`typeof document !== 'undefined'`)        | Theming | ✅     |
| Phase α: Tests for all three utilities                                                                   | Theming | ✅     |
| Phase 1: Define `BaseSettingsState`, `GiselleSettingsContextValue<T>`, `GiselleSettingsProviderProps<T>` | Theming | ✅     |
| Phase 1: Implement `GiselleSettingsProvider<T>` — localStorage by default, `initialState?` for SSR       | Theming | ✅     |
| Phase 1: Version check on mount — reset to defaults if stored version mismatches                         | Theming | ✅     |
| Phase 1: Export `useGiselleSettings<T>()` hook                                                           | Theming | ✅     |
| Phase 1: Storybook story — default, `setField`, `canReset`/`onReset`, drawer toggle                      | Theming | ✅     |
| Phase 1: Vitest tests — render, `setField`, `canReset`, `onReset`, version mismatch reset                | Theming | ✅     |
| Phase 2: `storage: 'cookie'` option (client-side `document.cookie`)                                      | Theming | ✅     |
| Phase 2: `storage: StorageAdapter<T>` custom adapter                                                     | Theming | ✅     |
| Phase 2: `detectGiselleSettings()` server helper (separate `/server` entrypoint)                         | Theming | ✅     |
| Phase 3: `SettingsThemeBridge` — internal bridge wiring settings state into `GiselleThemeProvider`       | Theming | ✅     |
| Phase 3: `GiselleThemeAndSettingsProvider` convenience wrapper                                           | Theming | ✅     |
| Phase 3: Migration guide in README and `theming/nextjs.md`                                               | Theming | ✅     |

---

### Phase E — Standalone project UI primitives — Components (Medium priority)

**Goal:** Export the layout and section primitives that every portfolio or product site needs,
so a blank Next.js project can assemble full pages with zero proprietary dependencies and zero
reimplementation of recurring patterns.

**Prerequisite:** Phase A (`channelAlpha`) — some primitives use CSS-variable alpha tints.

**Source material:** These patterns are already proven in alexrebula. They must be written
from scratch in giselle-mui (copyright rule: no copy from the private repo).

**Extraction candidates** (need only light cleanup — not a full rewrite):

| Task                                                                                              | Label      | Status |
| ------------------------------------------------------------------------------------------------- | ---------- | ------ |
| Extract `TwoColumnShowcaseRow` — clean, no proprietary identifiers, ready now                     | Components | ✅     |
| Extract `SectionTitle` + `SectionCaption` — section heading group with optional gradient accent   | Components | ✅     |
| Extract `FloatingSubNav` — sticky/fixed pill nav with framer-motion, `ReactNode` icon slot        | Components | ✅     |
| Extract `OptionWithBlurb` — tiny wrapper, clean, no proprietary identifiers                       | Components | ⬜     |
| Extract `SectionPendingLoader` — replace internal `Iconify` with `GiselleIcon`                    | Components | ⬜     |
| Extract `FloatingControlBar` — replace `channelAlpha` (Phase A first) + `Iconify` → `GiselleIcon` | Components | ⬜     |

**Write from scratch** (no copy from alexrebula — independent implementations):

| Task                                                                                              | Label      | Status |
| ------------------------------------------------------------------------------------------------- | ---------- | ------ |
| `SectionContainer` — `Container` + consistent vertical padding + optional title/subtitle slot     | Components | ✅     |
| `HeroSection` — full-width hero: headline, subtitle, CTA slot, background tint via `channelAlpha` | Components | ✅     |
| `FAQAccordion` — MUI `Accordion` with consistent styling, icon slot, and accessible expand        | Components | ⬜     |

**When this phase is done:**

A blank `create-next-app` project can install `@alexrebula/giselle-mui`, add
`GiselleThemeProvider` to `layout.tsx`, and assemble a full homepage from exported
components — no proprietary theme, no reimplemented patterns.

Full gap analysis: [`docs/components/standalone-gap-analysis.md`](../components/standalone-gap-analysis.md)

---

### Phase F — DetailsDrawer — Components (Medium priority)

**Goal:** Export a reusable `<DetailsDrawer>` component — a slide-in panel from the right edge
of the viewport, styled to MUI theme tokens, with zero proprietary dependencies. This is the
universal shell for any detail or edit view in the library: timeline item details, settings,
preview panels, and any future per-item UI.

**Design principle — shell only, content via slot:**

`DetailsDrawer` is a pure layout container. It owns:

- The slide-in/out animation (CSS transition, not Framer Motion — no extra dep)
- The backdrop overlay (semi-transparent, click-to-close)
- The close button in the header
- The header title slot (`ReactNode`)
- The body content slot (`children`)
- The footer action slot (`ReactNode` — for Save / Cancel buttons in edit mode)

It does NOT own:

- Any knowledge of timelines, items, or data shapes
- Any internal fetch or state beyond `open`/`onClose`

**Width:** responsive — `100vw` on xs/sm, `480px` on md+. Controlled by `width` prop with
that default. Stays within `xs: '100%', md: 480` using MUI `sx`.

**Inspiration source (non-negotiable copyright note):**
The interaction model is a standard UI primitive — a slide-in drawer with overlay, header,
body, and close button. This component is written **entirely from scratch** in giselle-mui.
No code, utility functions, or styled-component definitions from any external theme kit are
copied. The pattern is not proprietary to any specific theme.

**Props interface:**

```tsx
export interface DetailsDrawerProps {
  /** Controls open/closed state. */
  open: boolean;
  /** Called when the user closes the drawer (close button or backdrop click). */
  onClose: () => void;
  /** Optional header title. */
  title?: ReactNode;
  /** Optional footer slot — use for Save / Cancel buttons in edit mode. */
  footer?: ReactNode;
  /** Override drawer width. @default { xs: '100%', md: 480 } */
  width?: number | string | Record<string, number | string>;
  /** Content to display inside the drawer body. */
  children?: ReactNode;
  /** MUI sx prop for the root Paper element. */
  sx?: SxProps<Theme>;
}
```

| Task                                                                                           | Label      | Status |
| ---------------------------------------------------------------------------------------------- | ---------- | ------ |
| Implement `DetailsDrawer` — slide animation, backdrop, close button, slots                     | Components | ⬜     |
| Responsive width: `{ xs: '100%', md: 480 }` default, overridable via `width` prop              | Components | ⬜     |
| Export from `src/index.ts` + barrel `src/components/details-drawer/index.ts`                   | Components | ⬜     |
| Storybook story: empty, with title, with footer, with full `TimelineItemDetails` inside        | Components | ⬜     |
| Vitest test: renders open/closed, close button calls `onClose`, backdrop click calls `onClose` | Components | ⬜     |
| README: why this exists, design decisions, copyright note                                      | Components | ⬜     |

---

### Phase G — TimelineItemDetails — Components (Medium priority)

**Goal:** Export a `<TimelineItemDetails>` component — the universal read/edit panel for
any timeline item (phase, milestone, life event, scenario). Rendered inside `DetailsDrawer`,
it displays the full item data in a structured, Asana-inspired layout.

**Why this belongs in giselle-mui:**

Every timeline variant this library will ever export (TimelineTwoColumn, the planned
RoadmapTimeline, a future ProjectTimeline) shares the same conceptual structure: an item has
a title, a date, a description, sub-items, photos, links, and status metadata. The details
view is non-trivial to implement correctly (accessible field layout, read/edit mode toggle,
photo grid, nested sub-item list). Encoding it here means no consumer ever reimplements it.

**Layout — Asana task detail model:**

```
┌────────────────────────────────────────┐
│  [Status chip]  [Date]                 │  ← top metadata row
│  Title (h2, editable in edit mode)     │
│  Short description (subtitle)          │
│                                        │
│  ── Details ─────────────────────────  │
│  Long description / body               │
│                                        │
│  ── Sub-items ───────────────────────  │
│  ○ Sub-item 1                          │
│  ○ Sub-item 2                          │
│                                        │
│  ── Photos ──────────────────────────  │
│  [img]  [img]  [img]                   │  ← row of thumbnails
│                                        │
│  ── Links / related ─────────────────  │
│  • link 1                              │
└────────────────────────────────────────┘
```

**Two modes — read and edit:**

- **Read mode (Phase G v1):** All fields rendered as static text/chips/images. No form
  controls. This is the primary deliverable.
- **Edit mode (Phase G v2, separate milestone):** Fields become controlled MUI inputs
  (`TextField`, `DatePicker`, etc.). A `onSave(updatedItem)` callback is called on submit.
  The drawer `footer` slot shows Save / Cancel. Edit mode is **not** in scope for v1.

**Data shape — generic, not timeline-specific:**

`TimelineItemDetails` accepts a `TimelineItemDetailData` interface that maps to the common
subset of `TimelinePhase` and `Milestone` from `TimelineTwoColumn`. This avoids coupling
the details component to any one timeline type:

```ts
export interface TimelineItemDetailData {
  title: string;
  shortTitle?: string;
  date?: string;
  description?: string;
  details?: string[]; // bullet list items
  photos?: Array<{ src: string; alt: string }>;
  color?: HighlightedPaletteKey;
  done?: boolean;
  overdue?: boolean;
  links?: Array<{ label: string; href: string }>;
  /** Any extra fields the consumer wants to display. */
  extra?: Array<{ label: string; value: ReactNode }>;
}
```

**Integration with TimelineTwoColumn:**

`TimelineTwoColumn` will accept an `onItemClick?: (item: TimelineItemDetailData) => void`
callback. When a phase card or milestone badge is clicked (not the done-dot), the callback
fires with the normalised `TimelineItemDetailData`. The consumer opens `DetailsDrawer` and
passes the data to `TimelineItemDetails`. This keeps `TimelineTwoColumn` and `DetailsDrawer`
decoupled — the consumer owns the open/close state.

**Prerequisite:** Phase F (`DetailsDrawer`) — `TimelineItemDetails` is always rendered
inside a `DetailsDrawer`.

| Task                                                                                   | Label      | Status |
| -------------------------------------------------------------------------------------- | ---------- | ------ |
| Define `TimelineItemDetailData` interface in `types.ts`                                | Components | ⬜     |
| Implement `TimelineItemDetails` — read-only layout, all field slots                    | Components | ⬜     |
| Status chip: maps `color` + `done`/`overdue` to label + palette color                  | Components | ⬜     |
| Photo slot: responsive row of thumbnails with lightbox-ready click handler             | Components | ⬜     |
| Sub-items slot: styled list from `details[]` array                                     | Components | ⬜     |
| Links slot: anchor list with `GiselleIcon` icon per item                               | Components | ⬜     |
| Extra fields slot: `label: value` rows for consumer-defined metadata                   | Components | ⬜     |
| Export from `src/index.ts` + barrel `src/components/timeline-item-details/index.ts`    | Components | ⬜     |
| Storybook story: phase item, milestone item, overdue item, minimal item (no optionals) | Components | ⬜     |
| Vitest test: renders all slots, status chip label for each `color`/`done` combination  | Components | ⬜     |
| README: why it exists, why it belongs here, design decisions                           | Components | ⬜     |
| Phase G v2: edit mode — controlled inputs, `onSave`, `onCancel` callbacks              | Components | ⬜     |
| Phase G v2: wire `TimelineTwoColumn.onItemClick` to open drawer with item data         | Components | ⬜     |

---

## Phase H — Portfolio Layout & Application Shell Extraction

**Goal:** Extract every reusable layout and shell pattern from the `alexrebula` portfolio
into `giselle-mui` as independently usable, MIT-licensed components. This covers page-level
section layout composites, navigation components, authentication section shells, and the
application shell itself. All components are written from scratch — no code is copied from
the private `alexrebula` repo.

**Scope:**

- **Section layout composites** — page templates that combine multiple primitives into a
  named reusable layout. For example, `TrackerSectionLayout` (full-width heading + stat-card
  grid + sidebar with radial chart + checklist timeline), `HeroSectionLayout`, etc.
- **Navigation components** — top app bar, sidebar navigation drawer, floating sub-nav, and
  any breadcrumb or tab-bar pattern used across sections.
- **Auth / login section** — login card shell, optional social-login row, forgot-password link
  layout. No backend — structural only.
- **Application shell** — `AppLayout` wrapper that composes `AppHeader` + `AppSidebar` +
  main content area. Accepts slot props for header actions, sidebar items, and footer.
- **Additional chart widgets** — any chart card beyond `RadialProgressCard` that proves
  reusable across more than one section (e.g., area-sparkline card, donut summary card).

**Copyright rule — non-negotiable:**
Every component in Phase H is written independently from scratch. No JSX, logic, or styling
is copied from any private or proprietary source. The public MIT boundary must not be crossed.

**Blocked on:** Phases C + D (GiselleThemeProvider + GiselleSettingsProvider) — application
shell components depend on a theme context and settings context being available without
consumer boilerplate.

| Task                                                                                          | Label      | Status |
| --------------------------------------------------------------------------------------------- | ---------- | ------ |
| Define `TrackerSectionLayout` component — heading + stat grid + sidebar/timeline split        | Components | ⬜     |
| Extract `SidebarTimelineLayout` — generic 1/3 sticky sidebar + 2/3 scrolling main             | Layout     | ⬜     |
| Navigation: `AppTopBar` — responsive header with title, nav links, icon-action slots          | Navigation | ⬜     |
| Navigation: `AppSidebarDrawer` — collapsible nav drawer with icon + label items               | Navigation | ⬜     |
| Navigation: `FloatingSubNav` — anchored in-page section navigator (already in library, audit) | Navigation | ⬜     |
| `AppLayout` — application shell: composes `AppTopBar` + `AppSidebarDrawer` + main slot        | Layout     | ⬜     |
| Auth: `LoginCard` — email + password fields + submit button (structural, no backend)          | Auth       | ⬜     |
| Auth: `AuthPageLayout` — full-screen split or centred shell that wraps `LoginCard`            | Auth       | ⬜     |
| Chart: `DonutSummaryCard` — Card wrapping a donut chart with centred total label + legend     | Chart      | ⬜     |
| Chart: `AreaSparklineCard` — Card with a full-bleed area chart and overlaid stat              | Chart      | ⬜     |
| Export all Phase H symbols from `src/index.ts`                                                | Core       | ⬜     |
| Storybook stories for every Phase H component                                                 | Components | ⬜     |
| Vitest tests for every Phase H component + utility                                            | Components | ⬜     |
| README for every Phase H component folder                                                     | Components | ⬜     |
| Docusaurus page in `giselle-docs` wiring Phase H component docs                               | Docs       | ⬜     |

---

### Phase I — Motion & Animation Primitives — `/motion` subpath ✅ Done — 15 May 2026

**Goal:** Export the animation building blocks that every animated section or hero needs,
as independently importable utilities and components. Consuming the main bundle is unaffected —
all framer-motion-dependent code goes into the `/motion` subpath.

**Why this belongs in giselle-mui:**

Every portfolio site, product landing page, and application shell uses the same small set of
motion patterns: fade-in on enter, stagger children, parallax on scroll. The variant factories
and transition defaults are non-trivial to tune (easing curve, duration, stagger interval),
and the same wrong defaults appear in project after project. Encoding them here means no
consumer ever re-discovers the 0.64s ease-in-out cubic — they import it.

**Folder structure:**

```
src/components/motion/
  variants/             ← variant factories (one subfolder per variant type)
    transition/         ← transitionEnter, transitionExit
    container/          ← container() stagger factory
    fade/               ← fade() — 10 directions
    slide/              ← slide() — 8 directions
    scale/              ← scale() — 6 directions
    bounce/             ← bounce() — 10 directions
    rotate/             ← rotate() — in/out
    flip/               ← flip() — inX/inY/outX/outY
    zoom/               ← zoom() — 10 directions
    actions/            ← hover(), tap(), transitionHover(), transitionTap()
  container/            ← MotionContainer component
  viewport/             ← MotionViewport component
  use-scroll-parallax/  ← useScrollParallax hook
  README.md
```

Each subfolder follows the full component convention: `<name>.ts(x)`, `<name>.const.ts`,
`types.ts`, `<name>.test.ts`, `index.ts`.

---

**`/motion` subpath** (`src/motion-index.ts`):

| Task                                                                                                        | Label  | Status |
| ----------------------------------------------------------------------------------------------------------- | ------ | ------ |
| `transitionEnter(opts?)` — enter transition defaults: 0.64s, cubic `[0.43, 0.13, 0.23, 0.96]`               | Motion | ✅     |
| `transitionExit(opts?)` — exit transition defaults: 0.48s, same easing                                      | Motion | ✅     |
| `fade(direction, opts?)` — fade `Variants` factory, 10 directions                                           | Motion | ✅     |
| `slide(direction, opts?)` — slide `Variants` factory, 8 directions                                          | Motion | ✅     |
| `scale(direction, opts?)` — scale `Variants` factory, 6 directions                                          | Motion | ✅     |
| `bounce(direction, opts?)` — bounce `Variants` factory, 10 directions                                       | Motion | ✅     |
| `rotate(direction, opts?)` — rotate `Variants` factory, in/out                                              | Motion | ✅     |
| `flip(direction, opts?)` — flip `Variants` factory, inX/inY/outX/outY                                       | Motion | ✅     |
| `zoom(direction, opts?)` — zoom `Variants` factory, 10 directions                                           | Motion | ✅     |
| `container(opts?)` — stagger container `Variants` factory: `staggerChildren: 0.05`, `delayChildren: 0.05`   | Motion | ✅     |
| `hover(scale?)`, `tap(scale?)` — `whileHover`/`whileTap` prop factories                                     | Motion | ✅     |
| `transitionHover(props?)`, `transitionTap(props?)` — transition config helpers                              | Motion | ✅     |
| `MotionContainer` — `motion.div` stagger wrapper; `action`/`animate` props for toggle mode                  | Motion | ✅     |
| `MotionViewport` — scroll-triggered stagger wrapper; auto-disables animation on mobile                      | Motion | ✅     |
| `useScrollParallax()` — 5 spring-smoothed parallax `y` values driven by element scroll                      | Motion | ✅     |
| Export all from `src/motion-index.ts`                                                                       | Motion | ✅     |
| Vitest tests for all variant factories — per-subfolder `.test.ts` files                                     | Motion | ✅     |
| Storybook story: `MotionContainer` with child items fading/sliding in                                       | Motion | ✅     |
| README for `src/components/motion/`                                                                         | Motion | ✅     |
| Subfolder restructure: flat files → `variants/<name>/` per factory, component convention applied throughout | Motion | ✅     |

**Main bundle additions** (`src/index.ts`):

| Task                                                                                                                                                                                | Label      | Status |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ |
| `AnimatedGradientText` — cycling gradient `<span>` using CSS `backgroundPosition` animation and `theme.vars.palette` color tokens; accepts `color1`, `color2`, and `duration` props | Components | ✅     |
| `TechIconStrip` — horizontal icon + label row; accepts an array of `{ icon: ReactNode; label: string }` items, optional `title`, optional `centeredWrap`                            | Components | ✅     |
| Export both from `src/index.ts`                                                                                                                                                     | Core       | ✅     |
| Storybook stories for both (all six palette keys for `AnimatedGradientText`; Responsive story for `TechIconStrip`)                                                                  | Components | ✅     |
| Vitest tests for both                                                                                                                                                               | Components | ✅     |
| README for each component folder                                                                                                                                                    | Components | ✅     |

---

## Phase L — Quality Infrastructure

| Task                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Label | Status                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | --------------------- |
| PR template (`.github/pull_request_template.md`) — consistent across all repos                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Chore | ✅ Done — 9 May 2026  |
| PR messages index (`docs/pr-messages/`) — all 26 PRs documented                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Chore | ✅ Done — 9 May 2026  |
| **Per-component `roadmap.md` files** — each component folder gets its own `roadmap.md` with a standard format covering planned improvements, known gaps, and next milestones. The format must be identical across all components so information transfers consistently to any tooling or documentation layer. Named `roadmap.md` in every component folder.                                                                                                                                                                                                    | Chore | ⬜                    |
| Update `docs/components/cleanup-workflow.md` to include Step 10b — create/update the component `roadmap.md` as a mandatory step so Copilot always creates or updates it during any cleanup run.                                                                                                                                                                                                                                                                                                                                                         | Chore | ✅ Done — 14 May 2026 |
| **PR review workflow formalised** — `docs/pr-review-workflow.md` shipped. The conventions developed iteratively across PRs #37–#43 are now a single, executable document covering branch hygiene, PR creation (via `gh pr create` only), Copilot review response, fix batch commit, and branch owner sign-off. Session shorthands `review pr <N>` and `create pr <branch>` make the workflow invocable in any future Copilot session without re-explanation. This is the point where ad-hoc process became repeatable, self-documenting infrastructure. | Chore | ✅ Done — 14 May 2026 |

---

## Phase M — GiselleMUIView Demo (little-branches/giselle)

**Goal:** Build the live component showcase at `/little-branches/giselle/mui/` in the
`alexrebula` portfolio. This is the primary proof-of-concept for Giselle Premium.
MUI Store reviewers click through this page.

**Architecture insight (confirmed via competitive analysis — 16 May 2026):**

A well-regarded admin template in this category ships 100+ pages with only 9 thin custom
component wrappers. All other pages are built from stock MUI styled by the theme. This
confirms: **`GiselleThemeProvider` IS the product for standard MUI components.** No thin
wrapper components need to be exported from giselle-mui for standard MUI — the theme
handles all of them.

**What this phase builds:**

1. **`GiselleThemeProvider` wired into `little-branches`** — the single prerequisite.
   All demo pages render inside `GiselleThemeProvider`. This is the first task.

2. **Stock MUI showcase pages** (under `material/` in the demo route) — pages that render
   standard MUI components (Accordion, Button, Card, etc.) **without any wrapper**.
   These pages prove the theme works correctly on stock MUI with zero consumer boilerplate.

3. **giselle-mui custom component pages** — MetricCard, QuoteCard, StatCard, GiselleIcon,
   TimelineTwoColumn, etc. One demo page per component.

**No thin MUI wrappers are exported from giselle-mui for this phase.** A `GiselleAccordion`
that does nothing beyond `<Accordion {...props} />` would add zero value — the theme handles
it. Thin wrappers only emerge if, while building demo pages, a repeated pattern is found that
justifies the wrapper (e.g. a specific `expandIcon` + `disableGutters` combination needed
on every accordion).

**Full spec:** `alexrebula/docs/giselle-premium/giselle-mui-restructure-plan.md` —
`GiselleMUIView` section (route structure, `nav-config.ts` data shape, atomic design taxonomy,
`View → Template → Organism` wiring pattern).

**Blocked on:** Phase C (`GiselleThemeProvider`) — must be shipped and `yalc push`ed before
demo pages can render the Giselle theme.

| Task                                                                                          | Label     | Status |
| --------------------------------------------------------------------------------------------- | --------- | ------ |
| Wire `GiselleThemeProvider` into `little-branches/giselle` — first and only prerequisite      | Core      | ⬜     |
| `nav-config.ts` — define `GiselleNavSection[]` data shape and initial items list              | Core      | ⬜     |
| `GiselleMUIView` — grid index page at `/little-branches/giselle/mui/`                         | Page      | ⬜     |
| `GiselleMUIDemoTemplate` — three-column shell (primary nav, main, secondary nav) — slots only | Template  | ⬜     |
| `GiselleDemoHero` — heading banner + breadcrumbs organism                                     | Organism  | ⬜     |
| `GiselleDemoPrimaryNav` — left sidebar nav from `allGiselleComponents` data                   | Organism  | ⬜     |
| `GiselleDemoSecondaryNav` — right anchor list with scroll spy                                 | Organism  | ⬜     |
| `GiselleDemoSection` — card wrapper with anchor ID + title + content slot                     | Organism  | ⬜     |
| Demo page: `material/accordion/` — stock MUI Accordion under GiselleTheme                     | Demo page | ⬜     |
| Demo page: `material/cards/metric/` — MetricCard                                              | Demo page | ⬜     |
| Demo page: `material/cards/quote/` — QuoteCard                                                | Demo page | ⬜     |
| Demo page: `material/cards/stat/` — StatCard                                                  | Demo page | ⬜     |
| Demo page: `material/icons/giselle-icon/` — GiselleIcon all palette keys                      | Demo page | ⬜     |
| Demo page: `sections/timeline/two-column/` — TimelineTwoColumn with real data                 | Demo page | ⬜     |
| SVG thumbnails for `nav-config.ts` cards — `public/assets/icons/giselle-mui/ic-<slug>.svg`    | Assets    | ⬜     |
