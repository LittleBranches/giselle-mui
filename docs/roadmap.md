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
import { extendTheme, CssVarsProvider } from '@mui/material/styles';
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

### Phase C — GiselleThemeProvider component — Theming (HIGH priority)

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

// Consumer overrides specific tokens — still wraps in CssVarsProvider correctly
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

**What it wraps:**

```tsx
// Internal implementation shape (simplified)
import { CssVarsProvider, extendTheme } from '@mui/material/styles';
import { giselleTheme } from '../utils/theme-preset';

function GiselleThemeProvider({ children, themeOverrides, theme }: Props) {
  const resolvedTheme = theme ?? extendTheme(merge(giselleTheme, themeOverrides ?? {}));
  return <CssVarsProvider theme={resolvedTheme}>{children}</CssVarsProvider>;
}
```

| Task                                                                                   | Label   | Status |
| -------------------------------------------------------------------------------------- | ------- | ------ |
| Complete Phase B (Giselle theme preset) — this prerequisite is already met             | Theming | ✅     |
| Define `GiselleThemeProviderProps` interface (`children`, `themeOverrides?`, `theme?`) | Theming | ⬜     |
| Implement `GiselleThemeProvider` wrapping `CssVarsProvider` with merge logic           | Theming | ⬜     |
| Export `GiselleThemeProvider` from `giselle-mui/src/index.ts`                          | Theming | ⬜     |
| Add Storybook story: default palette, with overrides, fully custom                     | Theming | ⬜     |
| Add Vitest test: renders correctly, passes `data-mui-color-scheme` to DOM              | Theming | ⬜     |
| Update `theming/nextjs.md` with the new zero-config usage pattern                      | Theming | ⬜     |

**Storybook note:** Storybook in `giselle-mui` must be able to test two things:

1. MUI wrapper components (existing) — isolated, styled via a test theme
2. `GiselleThemeProvider` — with the default Giselle palette, with overrides, and with a
   fully custom theme. All three modes must have a story.

Sample token data used in Storybook stories must be defined in `giselle-mui` itself —
no imports from `alexrebula` or any client project.

**This is the foundational prerequisite for:**

- Writing authoritative dev.to articles about MUI v7 CSS variables (`GiselleThemeProvider` is the worked example)
- The premium template (the template's look is the default Giselle palette, consumers override it)
- Replacing `minimal-shared/utils` in the portfolio's theme setup

---

## Corresponding alexrebula milestone

See [alexrebula `docs/roadmap.md`](https://github.com/AlexRebula/rm/blob/main/presentation/alexrebula/docs/roadmap.md)
for the milestone tracking the removal of `minimal-shared/utils` imports from
`alexrebula/src/theme/`.

---

### Phase D — GiselleSettingsProvider — Theming (Medium priority)

**Goal:** Export a framework-agnostic, MIT-safe `GiselleSettingsProvider<TState>` that
persists user UI preferences (color mode, direction, font size, color presets) with zero
proprietary dependencies. Enables consumers to migrate off the Minimals `SettingsProvider`
in a one-import swap.

**Prerequisite:** Phase C (GiselleThemeProvider) — the settings system drives the theme.

Full design: [`docs/components/settings-provider-plan.md`](../components/settings-provider-plan.md)

| Task                                                                                                     | Label   | Status |
| -------------------------------------------------------------------------------------------------------- | ------- | ------ |
| Phase α: Port `useLocalStorage<T>` to `src/utils/use-local-storage.ts`                                   | Theming | ⬜     |
| Phase α: Write `isDeepEqual(a, b)` — covers primitives, arrays, plain objects (no es-toolkit)            | Theming | ⬜     |
| Phase α: Write `getCookieValue` / `setCookieValue` — SSR-safe (`typeof document !== 'undefined'`)        | Theming | ⬜     |
| Phase α: Tests for all three utilities                                                                   | Theming | ⬜     |
| Phase 1: Define `BaseSettingsState`, `GiselleSettingsContextValue<T>`, `GiselleSettingsProviderProps<T>` | Theming | ⬜     |
| Phase 1: Implement `GiselleSettingsProvider<T>` — localStorage by default, `initialState?` for SSR       | Theming | ⬜     |
| Phase 1: Version check on mount — reset to defaults if stored version mismatches                         | Theming | ⬜     |
| Phase 1: Export `useGiselleSettings<T>()` hook                                                           | Theming | ⬜     |
| Phase 1: Storybook story — default, `setField`, `canReset`/`onReset`, drawer toggle                      | Theming | ⬜     |
| Phase 1: Vitest tests — render, `setField`, `canReset`, `onReset`, version mismatch reset                | Theming | ⬜     |
| Phase 2: `storage: 'cookie'` option (client-side `document.cookie`)                                      | Theming | ⬜     |
| Phase 2: `storage: StorageAdapter<T>` custom adapter                                                     | Theming | ⬜     |
| Phase 2: `detectGiselleSettings()` server helper (separate `/server` entrypoint)                         | Theming | ⬜     |
| Phase 3: `SettingsThemeBridge` — internal bridge wiring settings state into `GiselleThemeProvider`       | Theming | ⬜     |
| Phase 3: `GiselleThemeAndSettingsProvider` convenience wrapper                                           | Theming | ⬜     |
| Phase 3: Migration guide in README and `theming/nextjs.md`                                               | Theming | ⬜     |

---

### Phase E — Standalone project UI primitives — Components (Medium priority)

**Goal:** Export the layout and section primitives that every portfolio or product site needs,
so a blank Next.js project can assemble full pages with zero Minimals dependency and zero
reimplementation of recurring patterns.

**Prerequisite:** Phase A (`channelAlpha`) — some primitives use CSS-variable alpha tints.

**Source material:** These patterns are already proven in alexrebula. They must be written
from scratch in giselle-mui (copyright rule: no copy from the private repo).

**Extraction candidates** (need only light cleanup — not a full rewrite):

| Task                                                                                              | Label      | Status |
| ------------------------------------------------------------------------------------------------- | ---------- | ------ |
| Extract `TwoColumnShowcaseRow` — clean, zero Minimals, ready now                                  | Components | ✅     |
| Extract `SectionTitle` + `SectionCaption` — section heading group with optional gradient accent   | Components | ✅     |
| Extract `FloatingSubNav` — sticky/fixed pill nav with framer-motion, `ReactNode` icon slot        | Components | ✅     |
| Extract `OptionWithBlurb` — tiny wrapper, clean, zero Minimals                                    | Components | ⬜     |
| Extract `SectionPendingLoader` — replace internal `Iconify` with `GiselleIcon`                    | Components | ⬜     |
| Extract `FloatingControlBar` — replace `channelAlpha` (Phase A first) + `Iconify` → `GiselleIcon` | Components | ⬜     |

**Write from scratch** (no copy from alexrebula — independent implementations):

| Task                                                                                                                                             | Label      | Status |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------ |
| `SectionContainer` — `Container` + consistent vertical padding + optional title/subtitle slot                                                    | Components | ✅     |
| `StatCard` — data card with sparkline, six palette variants, `StatCardItem[]` data prop — ✅ Done 5 May 2026                                     | Components | ✅     |
| `RadialProgressCard` — Card wrapping an ApexCharts radialBar with configurable progress items and palette keys                                   | Components | ✅     |
| `resolveMaturityColor(pct)` + `resolveMaturityLabel(pct)` — maps readiness percentages to MUI palette key and mango-stage label                  | Utilities  | ✅     |
| `assignMilestoneSidesByDone(phases)` — derives milestone column placement from `done` state; exported so consumers don't reimplement the pattern | Utilities  | ✅     |
| `HeroSection` — full-width hero: headline, subtitle, CTA slot, background tint via `channelAlpha`                                                | Components | ⬜     |
| `FAQAccordion` — MUI `Accordion` with consistent styling, icon slot, and accessible expand                                                       | Components | ⬜     |

**When this phase is done:**

A blank `create-next-app` project can install `@alexrebula/giselle-mui`, add
`GiselleThemeProvider` to `layout.tsx`, and assemble a full homepage from exported
components — no proprietary theme, no reimplemented patterns.

Full gap analysis: [`docs/components/standalone-gap-analysis.md`](../components/standalone-gap-analysis.md)

---

### Phase F — DetailsDrawer — Components (Medium priority)

**Goal:** Export a reusable `<DetailsDrawer>` component — a slide-in panel from the right edge
of the viewport, styled to MUI theme tokens, with zero Minimals dependency. This is the
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
The interaction model is inspired by the Minimals `SettingsDrawer` pattern, but this
component is written **entirely from scratch** in giselle-mui. No code, no utility
functions, no styled-component definitions are copied from Minimals. The pattern (slide-in
drawer with overlay, header, body, close button) is a standard UI primitive — it is not
proprietary to Minimals.

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
is copied or adapted from `alexrebula/src/`. The public MIT boundary must not be crossed.

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
