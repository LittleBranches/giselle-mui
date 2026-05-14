---
sidebar_position: 11
sidebar_label: 'Trip Planner Components Plan'
---

# Trip Planner — Weekly Cost Breakdown: Component Plan

> **Context:** This plan defines every reusable component needed to render a weekly-period
> cost breakdown view — an interactive, visually rich page showing a multi-week visit
> broken down by category, with collapsible full-screen detail per week and a persistent
> total summary drawer. The immediate consumer is `alexrebula` (the private trip data page),
> but every component here is general-purpose: nothing trip-specific belongs in giselle-mui.
>
> This plan is a companion to [`dashboard-components-plan.md`](./dashboard-components-plan.md).
> Components already planned there are referenced but not re-specified here.
>
> _Last updated: 14 May 2026_

---

## Copyright status — the definitive answer

### What the concern was

The initial brainstorm listed MUI `Drawer`, `Chip`, `LinearProgress`, and `Collapse` as
"from Minimals / alexrebula (private — consume here, never copy to giselle-mui)". This
framing was misleading. Those components are from **`@mui/material`** — Apache 2.0 / MIT
licensed. The copyright constraint never applied to them.

### The actual constraint (narrow and already tracked)

The **only** copyright-sensitive code in the current codebase is:

| Location | What it is | Risk |
|---|---|---|
| `alexrebula/src/theme/` | Imports from the Minimals utility package (proprietary color helpers — replaced by `channelAlpha` etc.) | Must not be copied to any public package |
| `alexrebula/src/components/iconify/` | `Iconify` component uses the Minimals shared utilities package | Must stay in alexrebula; not portable as-is |
| `alexrebula/src/components/settings/` | `SettingsDrawer` and `SettingsContext` from Minimals | Proprietary pattern — must be replaced by `GiselleSettingsProvider` (Phase D) |

### What is already done

| Migration | Status |
|---|---|
| `channelAlpha`, `hexToChannel`, `pxToRem`, `remToPx` — clean-room replacements for `varAlpha` etc. | ✅ Shipped Phase A |
| `giselleTheme` — MIT-safe brand palette (replaces Minimals theme tokens) | ✅ Shipped Phase B |
| `GiselleThemeProvider` — replaces `ThemeProvider` wrapper from Minimals | ✅ Shipped Phase C |
| `GiselleSettingsProvider` — replaces `SettingsProvider` from Minimals | ⬜ Phase D (tracked) |
| ThemeProvider decoupling in alexrebula `src/theme/` (remove `minimal-shared/utils` imports) | ⬜ alexrebula Phase 1.5 (tracked) |

### What this means for new components

**Any component that wraps MUI primitives (Drawer, Chip, LinearProgress, Tabs, Collapse,
Paper, etc.) can be built in giselle-mui today, with zero copyright risk.** MUI is the
dependency — it is MIT/Apache 2.0 and fully allowed. The rule is only that the component
implementation must not call proprietary Minimals color helpers — the clean-room equivalents
(`channelAlpha` etc.) are already in giselle-mui for that purpose.

**Estimated effort to reach full copyright independence:** The remaining Minimals utility imports
in `alexrebula/src/theme/` are 3–5 calls (the proprietary color helper → `channelAlpha`
substitution pattern). That is a 1–2 hour migration task, already tracked. The
`GiselleSettingsProvider` (Phase D) is the larger item — estimated 3–5 days including tests.
Once Phase D ships, `alexrebula` can remove `minimal-shared` from its `package.json` entirely.

---

## Blocker key

| Symbol | Meaning |
|---|---|
| ✅ | Already shipped in giselle-mui |
| 🟨 | Shipped but in wrong subpath or needs adjustment |
| 🔴 | Does not exist — must be written from scratch |
| 📋 | Already planned in `dashboard-components-plan.md` |
| 📦 | Depends on `/motion` or `/charts` subpath (both already wired — 7 May 2026) |

---

## The "one data shape, multiple views" architecture

The core design goal: the consumer provides one array of `PeriodData` (below) and selects
a `view` prop. The component renders a completely different visual layout without any data
wiring change.

```tsx
// Consumer — alexrebula (private data, never in giselle-mui)
import { WeeklyBreakdownPage } from '@alexrebula/giselle-mui/motion';

<WeeklyBreakdownPage
  periods={tripWeeks}          // PeriodData[] — the one and only data prop
  currency="AUD"
  view="carousel"              // 'carousel' | 'expanding-strip' | 'stacked' | 'table'
/>
```

The `view` prop can be driven by a `useState` toggle — a tab strip, a button group, or a
`FloatingControlBar` — so the user can switch between views at runtime without touching data.

---

## Shared TypeScript types (canonical location: giselle-mui)

All types below belong in `giselle-mui/src/components/period-breakdown/types.ts` and are
exported from `src/index.ts`. **They must never be redefined in alexrebula data files** —
the same ESLint rule that bans `export type` in `sections-api/**` applies here.

```ts
// src/components/period-breakdown/types.ts

import type { PaletteColor } from '@mui/material';

// ─── Expense line item ────────────────────────────────────────────────────────

/** A single expense entry within a period. */
export type ExpenseItem = {
  /** Display label for this expense. */
  label: string;
  /** Cost amount in the consumer-supplied currency. */
  amount: number;
  /** Category key — consumer defines valid values via `ExpenseCategory`. */
  category: string;
  /** Optional note shown in expanded detail. */
  note?: string;
  /** Optional icon identifier (Iconify string — consumer pre-registers offline). */
  iconId?: string;
};

// ─── Expense category definition ─────────────────────────────────────────────

/** Display definition for one expense category used in legends and group headers. */
export type ExpenseCategoryDef = {
  /** Unique key matching `ExpenseItem.category`. */
  key: string;
  /** Human-readable label (e.g. 'Food & Dining'). */
  label: string;
  /** MUI palette colour for this category's accent. */
  color: PaletteColor;
  /** Optional Iconify icon id pre-registered offline by the consumer. */
  iconId?: string;
};

// ─── Period (one week / day / month) ─────────────────────────────────────────

/** One time-period slot in the breakdown (week, day, month — consumer decides). */
export type PeriodData = {
  /** Unique identifier. Never contains personal names. */
  id: string;
  /**
   * Display index shown on the card (e.g. `1` for "Week 1").
   * Distinct from array index — allows gaps and non-sequential ordering.
   */
  periodNumber: number;
  /** ISO date string for the start of the period. */
  from: string;
  /** ISO date string for the end of the period (inclusive). */
  to: string;
  /** Short label for this period (e.g. 'Great Ocean Road'). */
  label: string;
  /** MUI palette colour key for this period's card accent and background tint. */
  color: PaletteColor;
  /** All expense line items in this period. */
  expenses: ExpenseItem[];
  /**
   * Up to 4 short highlight strings shown on the collapsed card
   * (e.g. 'Penguin parade', 'Philip Island').
   * These are display labels only — no personal data.
   */
  highlights?: string[];
  /** Optional total planned budget for this period (for budget-vs-actual rendering). */
  budgetCap?: number;
};

// ─── View variants ────────────────────────────────────────────────────────────

/** The visual layout variant for the breakdown page. */
export type BreakdownViewVariant =
  | 'carousel'          // horizontal scroll rail — one card partially visible at edges
  | 'expanding-strip'   // all periods in a flex row; non-selected compress; selected expands
  | 'stacked'           // vertical accordion — default mobile fallback
  | 'table';            // tabular layout — all periods as rows, categories as columns

// ─── Summary drawer ───────────────────────────────────────────────────────────

/** Data shape for the summary drawer totals. Derived from PeriodData[] by the consumer. */
export type PeriodSummary = {
  /** Total cost across all periods. */
  grandTotal: number;
  /** Per-category totals across all periods. */
  categoryTotals: Array<{ category: string; total: number; percentage: number }>;
  /** Per-period totals for the sparkline row in the drawer. */
  periodTotals: Array<{ id: string; periodNumber: number; label: string; total: number }>;
};
```

---

## Brainstorm → plan name mapping

The initial brainstorm used informal names. The plan below renames them to be generic (no
trip-specific nouns). This table maps the two so nothing appears "missing".

| Brainstorm name | Plan name | Group |
|---|---|---|
| `WeekPlannerCard` | `PeriodSummaryCard` | Group B |
| `WeekDetailSheet` | `PeriodDetailSheet` | Group C |
| `HorizontalScrollRail` | `HorizontalScrollRail` | Group C |
| `BudgetSummaryDrawer` | `BudgetSummaryDrawer` | Group C |
| `ExpandingPeriodStrip` (horizontal accordion) | `ExpandingPeriodStrip` | Group C |
| `ExpenseCategoryGroup` | `ExpenseCategoryGroup` | Group A |
| `ExpenseLineItem` | `ExpenseLineItem` | Group A |
| `BreakdownCarouselView` (carousel container) | `BreakdownCarouselView` | Group D |
| `BreakdownExpandingView` (expanding strip container) | `BreakdownExpandingView` | Group D |
| `BreakdownStackedView` (vertical fallback) | `BreakdownStackedView` | Group D |
| `WeeklyBreakdownPage` (top-level page) | `WeeklyBreakdownPage` | Group D |

All eleven "build from scratch" components are present. None were dropped.

---

## Component inventory

### Group 0 — MUI primitives used internally (no new components to build)

These are Apache 2.0 / MIT licensed `@mui/material` primitives. They are not components to
build — they are the building blocks that our new components wrap and compose. They are listed
here explicitly because the brainstorm originally listed them under a misleading
"from Minimals / alexrebula" heading. That framing was wrong. They belong to MUI, not Minimals.

**Copyright status of all items in this group: zero risk.** `@mui/material` is Apache 2.0.
Using any of these primitives in a giselle-mui component is unconditionally allowed.

| MUI primitive | Used in | Role |
|---|---|---|
| `Accordion` + `AccordionSummary` | `BreakdownStackedView` | Period rows in the vertical fallback view. Already also shipped as giselle-mui's own `Accordion` wrapper (Group E). |
| `Drawer` (`anchor="bottom"`) | `BudgetSummaryDrawer` | The MUI Drawer provides the accessible focus trap, backdrop, and portal. The framer-motion animation replaces MUI's built-in transition — `transitionDuration={0}` disables MUI's transition so framer-motion owns it. |
| `Chip` | `PeriodSummaryCard`, `ExpenseCategoryGroup` | Highlight tags on collapsed card; category label pill in group header. |
| `LinearProgress` | `ExpenseCategoryGroup`, `BudgetSummaryDrawer` | Budget-used bar per category (`value` = percentage of period budget consumed). Uses `theme.vars.palette[color].main` — no hardcoded hex. |
| `Tooltip` | `ExpenseLineItem`, `PeriodSummaryCard` | Hover detail on a cost line (e.g. full note text when truncated); period total tooltip on compressed tiles in `ExpandingPeriodStrip`. |
| `Collapse` | `ExpenseCategoryGroup` | Simple CSS-height transition for expanding a category group's item list. Alternative to framer-motion `AnimatePresence` for the basic (no-motion) version of the component. |
| `Paper` | `PeriodDetailSheet`, `BudgetSummaryDrawer`, `PeriodSummaryCard` | Surface layer with elevation and border-radius. |
| `Tabs` + `Tab` | `WeeklyBreakdownPage` (view switcher) | The view-variant selector bar (`carousel / expanding / stacked`). |

### ApexCharts primitives (via `/charts` subpath — optional peer dep)

| Chart type | Used in | Role |
|---|---|---|
| `radialBar` (`RadialProgressCard` — ✅ already shipped) | `PeriodSummaryCard` (optional) | Per-period budget-consumed ring in the corner of the collapsed tile. Consumer passes it as a `chart?: ReactNode` slot — `PeriodSummaryCard` itself has zero ApexCharts dep. |
| `donut` / `pie` (`DonutChartCard` — 🔴 planned Phase H) | `PeriodDetailSheet chart` slot, `BudgetSummaryDrawer chart` slot | Category split as a donut. Passed as `chart?: ReactNode` — same zero-dep slot pattern. |

---

### Group A — Atomic building blocks (MUI only, main bundle)

These are the smallest units. Every view variant above uses them.

---

#### `ExpenseLineItem` 🔴 New — build from scratch

**What it is:** A single expense row — icon · label · optional note · amount. Read-only,
presentational. The atom that `ExpenseCategoryGroup` maps over.

**Accepts:** `ExpenseItem`, `currency: string`, `sx?`

**Copyright status:** Zero risk. Pure MUI `Stack` + `Typography` + optional `GiselleIcon`.

**Output subpath:** Main bundle.

**Storybook title:** `Data Display/Expense Line Item`

---

#### `ExpenseCategoryGroup` 🔴 New — build from scratch

**What it is:** A collapsible group of `ExpenseLineItem` rows for one category. Header row
shows category icon + label + subtotal. Body is a list of items revealed on expand.
Uses MUI `Collapse` — no framer-motion required for the basic version.

**Accepts:** `category: ExpenseCategoryDef`, `items: ExpenseItem[]`, `currency: string`,
`defaultExpanded?: boolean`, `sx?`

**Copyright status:** Zero risk. MUI `Collapse` + `Stack` + `GiselleIcon`. No Minimals.

**Output subpath:** Main bundle.

**Storybook title:** `Data Display/Expense Category Group`

---

### Group B — Period cards (MUI only, main bundle)

---

#### `PeriodSummaryCard` 🔴 New — build from scratch

**What it is:** The collapsed tile that represents one period in the scroll rail or
expanding strip. Shows: period number badge, date range, label, total cost (coloured),
and up to 4 highlight chips. The surface the user clicks to expand into `PeriodDetailSheet`.

**Accepts:** `period: PeriodData`, `currency: string`, `isSelected?: boolean`,
`onSelect?: () => void`, `sx?`

**Design notes:**

- Background uses a subtle tint from `theme.vars.palette[period.color].mainChannel` via
  `channelAlpha` — no hardcoded hex. Six palette keys supported.
- The period number badge (e.g. "W1") uses the colour's `main` value as background.
- Highlight chips use MUI `Chip` (MUI is MIT — zero copyright issue).
- `isSelected` adds an elevated border and scale — CSS-only, no framer-motion in this component.

**Copyright status:** Zero risk.

**Output subpath:** Main bundle.

**Storybook title:** `Cards/Period Summary`

---

### Group C — Motion components (`/motion` subpath)

All components below require `framer-motion` as a peer dep. They are exported from
`@alexrebula/giselle-mui/motion`. Always use `motion.div`, never `m.div`.

---

#### `PeriodDetailSheet` 🔴 New — build from scratch

**What it is:** The full-screen overlay that slides up when a `PeriodSummaryCard` is
selected. Uses framer-motion `layoutId` shared layout animation — the card morphs into the
sheet (Apple-style). Shows:

- Sticky header: period label, date range, total cost badge, close button
- `StatCardRow` of per-category subtotals (reuses `StatCard` from existing giselle-mui)
- Scrollable body: one `ExpenseCategoryGroup` per category, all defaultExpanded
- Optional `DonutChartCard` slot (passed as `chart?: ReactNode` — no direct ApexCharts dep)
- Optional `BudgetVsActualChartCard` slot (passed as `budgetChart?: ReactNode`)

**Accepts:** `period: PeriodData`, `currency: string`, `categories: ExpenseCategoryDef[]`,
`isOpen: boolean`, `onClose: () => void`, `chart?: ReactNode`, `budgetChart?: ReactNode`, `sx?`

**Design notes:**

- Full-screen uses `position: fixed`, `inset: 0`, `zIndex: theme.zIndex.modal`.
- The `layoutId` must match the `PeriodSummaryCard`'s root element `layoutId`.
- Scroll lock on `<body>` when open — standard `overflow: hidden` on mount, restored on close.
- Backdrop uses `motion.div` with `opacity` 0→0.5.

**Copyright status:** Uses framer-motion (MIT licensed, allowed peer dep). Zero Minimals risk.

**Blockers:** 📦 `/motion` subpath — already wired (7 May 2026).

**Output subpath:** `/motion`.

**Storybook title:** `Giselle MUI/Period/Detail Sheet`

---

#### `HorizontalScrollRail` 🔴 New — build from scratch

**What it is:** A horizontal scroll container with scroll-snap, prev/next navigation arrows,
and a progress dot indicator. The generic shell that `BreakdownCarouselView` renders its
`PeriodSummaryCard` tiles into.

**Accepts:** `children: ReactNode`, `itemWidth?: number | string`, `gap?: number`,
`showArrows?: boolean`, `showDots?: boolean`, `sx?`

**Design notes:**

- Uses CSS `scroll-snap-type: x mandatory` + `scroll-snap-align: start` on children.
- Arrow buttons: `IconButton` with `GiselleIcon`. Hidden on touch devices via `@media (hover: none)`.
- Dot indicator: maps over `React.Children` — filled dot for snapped position.
- framer-motion `useScroll` + `useTransform` adds a subtle scale effect on non-focused cards
  (the `variant: 'parallax'` mode — opt-in).

**Copyright status:** Zero risk.

**Blockers:** 📦 `/motion` subpath for the parallax variant.

**Output subpath:** `/motion` (the parallax-capable version). A CSS-only version can live in
the main bundle as `ScrollRail` if a no-motion consumer needs it.

**Storybook title:** `Layout/Horizontal Scroll Rail`

---

#### `ExpandingPeriodStrip` 🔴 New — build from scratch

**What it is:** The `expanding-strip` view variant. All periods sit in a `motion.div` flex
row. Non-selected tiles compress to a fixed narrow width (period number + colour bar only).
Selected tile expands to fill remaining space via framer-motion `layout` animation. This is
a single animated reflow — no overlay.

**Design notes:**

- Uses framer-motion `layout` on each tile — each `motion.div` child transitions its own width.
- The compressed state shows only the period number vertically centered.
- The expanded state shows the full `PeriodSummaryCard` content.
- **Not suitable as the only view on mobile** — a minimum of 6–7 compressed tiles requires
  at least ~900px viewport. Below `md` breakpoint, substitute with `BreakdownStackedView`
  or `BreakdownCarouselView`.

**Accepts:** `periods: PeriodData[]`, `currency: string`,
`categories: ExpenseCategoryDef[]`, `selectedId?: string`,
`onSelect?: (id: string) => void`, `sx?`

**Copyright status:** framer-motion is MIT. Zero Minimals risk.

**Blockers:** 📦 `/motion` subpath.

**Output subpath:** `/motion`.

**Storybook title:** `Giselle MUI/Period/Expanding Strip`

---

#### `BudgetSummaryDrawer` 🔴 New — build from scratch

**What it is:** A persistent bottom edge handle. In collapsed state: a centred pill
("Total: AUD $X,XXX · 7 weeks" + chevron). On click: slides up via framer-motion
`AnimatePresence` + `motion.div` to reveal:

- A `StatCardRow` of per-period totals (sparkline colour-coded)
- Per-category totals as `ProgressStatsList` rows
- A grand total in a large `MetricCard`
- Optional `DonutChartCard` slot showing category split across all periods

The pattern is architecturally identical to `FaqSection` (which already exists in
`/motion`) — the same collapsed-handle → animated-expand mechanic, adapted for financial
summary content.

**Accepts:** `summary: PeriodSummary`, `currency: string`, `periodLabel?: string`,
`chart?: ReactNode`, `sx?`

**Design notes:**

- Collapsed handle: `position: fixed`, `bottom: 0`, centred, MUI `Paper` with border-radius
  on top corners, drag handle indicator dot.
- Expanded: `height` animates from handle-height to `min(70vh, 520px)`.
- Z-index: `theme.zIndex.snackbar - 1` so it stays below modals.
- Close via chevron click or drag-down gesture (`useDragControls` from framer-motion).

**Copyright status:** MUI `Paper` + framer-motion (both MIT). No Minimals pattern copied.

**Blockers:** 📦 `/motion` subpath. Reuses `PeriodSummary` type.

**Output subpath:** `/motion`.

**Storybook title:** `Giselle MUI/Period/Budget Summary Drawer`

---

### Group D — View container components (`/motion` subpath)

These are the top-level "view" components. Each accepts the same `periods: PeriodData[]`
and `currency: string` props and renders a different layout. The consumer selects one.

---

#### `BreakdownCarouselView` 🔴 New — build from scratch

**What it is:** Composes `HorizontalScrollRail` + `PeriodSummaryCard[]` + `PeriodDetailSheet`.
Handles selected state, open/close of the detail sheet, and the `layoutId` wiring.

**Accepts:** `periods: PeriodData[]`, `currency: string`,
`categories: ExpenseCategoryDef[]`, `summarySlot?: ReactNode`, `sx?`

**Output subpath:** `/motion`.

**Storybook title:** `Giselle MUI/Period/Breakdown — Carousel`

---

#### `BreakdownExpandingView` 🔴 New — build from scratch

**What it is:** Composes `ExpandingPeriodStrip` + inline detail panel (no full-screen
overlay — the expanded strip item shows the full breakdown within the strip). Desktop-only
meaningful variant.

**Output subpath:** `/motion`.

**Storybook title:** `Giselle MUI/Period/Breakdown — Expanding Strip`

---

#### `BreakdownStackedView` 🔴 New — build from scratch

**What it is:** Vertical accordion view. Each period is a MUI `Accordion` row (reuses
the `Accordion` component already shipped in giselle-mui). No framer-motion required — but
adding an `AnimatePresence` wrapper for smooth height transitions moves it to `/motion`.
Default mobile fallback for all view variants.

**Output subpath:** `/motion` (for animated height). Could be in main bundle if CSS-only
transitions are acceptable — decision deferred.

**Storybook title:** `Giselle MUI/Period/Breakdown — Stacked`

---

#### `WeeklyBreakdownPage` 🔴 New — build from scratch

**What it is:** The top-level composition. Renders the selected view variant + the
`BudgetSummaryDrawer` pinned to the bottom. Includes a view-switcher button group
(carousel / expanding / stacked) in the page header — or accepts an `onViewChange`
callback if the consumer wants to drive it externally.

**Accepts:**

```ts
type WeeklyBreakdownPageProps = {
  periods: PeriodData[];
  currency: string;
  categories: ExpenseCategoryDef[];
  /** Computed once by the consumer from periods[]. */
  summary: PeriodSummary;
  /** Initial view. Defaults to 'carousel'. */
  defaultView?: BreakdownViewVariant;
  /** Optional chart passed into BudgetSummaryDrawer. */
  summaryChart?: ReactNode;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** `/motion`.

**Storybook title:** `Giselle MUI/Period/Weekly Breakdown Page`

---

### Group E — Reused from existing giselle-mui (no new work)

| Component | Status | Role in this page |
|---|---|---|
| `StatCard` | ✅ Shipped | Per-category subtotal tile inside `PeriodDetailSheet` |
| `StatCardRow` | ✅ Shipped | Responsive grid of category subtotals |
| `MetricCard` + `MetricCardDecoration` | ✅ Shipped | Grand total display in `BudgetSummaryDrawer` |
| `GiselleIcon` | ✅ Shipped | Category icons throughout |
| `SectionTitle` | ✅ Shipped | Page heading |
| `SectionContainer` | ✅ Shipped | Page-level padding |
| `Accordion` | ✅ Shipped | `BreakdownStackedView` period rows |
| `FaqSection` (in `/motion`) | ✅ Shipped | Reference pattern for `BudgetSummaryDrawer` expand mechanic |

---

### Group F — Referenced from dashboard-components-plan.md (not re-specified here)

These are fully specified in [`dashboard-components-plan.md`](./dashboard-components-plan.md).
They are used as optional slots (`chart?: ReactNode`) in the components above, keeping
this component group free of ApexCharts as a direct dependency.

| Component | Plan status | Slot it fills |
|---|---|---|
| `DonutChartCard` | 🔴 Planned (Phase H) | `PeriodDetailSheet chart` slot, `BudgetSummaryDrawer chart` slot |
| `BudgetVsActualChartCard` | 🔴 Planned (Phase H) | `PeriodDetailSheet budgetChart` slot |
| `ProgressStatsList` | 🔴 Planned (Phase H) | `BudgetSummaryDrawer` category totals body |
| `BudgetBreakdownCard` | 🔴 Planned (Phase H) | Stand-alone alternative to `PeriodDetailSheet` for simple cases |
| `SparklineBar` | 🔴 Planned (Phase H) | `StatCard chart` slot inside `StatCardRow` in drawer |

---

## Component dependency graph

```
WeeklyBreakdownPage
├── BreakdownCarouselView  (or ExpandingView or StackedView — same data, different render)
│   ├── HorizontalScrollRail
│   │   └── PeriodSummaryCard[]    ← uses ExpenseCategoryDef for highlight chips
│   └── PeriodDetailSheet          ← full-screen motion overlay
│       ├── StatCardRow            (existing)
│       │   └── StatCard[]         (existing)
│       ├── ExpenseCategoryGroup[]
│       │   └── ExpenseLineItem[]
│       ├── chart? slot            (consumer supplies DonutChartCard from /charts)
│       └── budgetChart? slot      (consumer supplies BudgetVsActualChartCard)
└── BudgetSummaryDrawer
    ├── MetricCard                 (existing)
    ├── ProgressStatsList          (planned Phase H)
    └── chart? slot                (consumer supplies DonutChartCard)
```

---

## Build order (recommended)

### Tier 0 — Types first (no component code, just types)

Define all shared types in `src/components/period-breakdown/types.ts` and export from
`src/index.ts`. This unblocks every component below in parallel.

| Task | Effort |
|---|---|
| Define `ExpenseItem`, `ExpenseCategoryDef`, `PeriodData`, `PeriodSummary`, `BreakdownViewVariant` in `types.ts` | 1–2 hours |
| Export from `src/index.ts` | 15 min |
| Write `src/components/period-breakdown/utils.ts` — `deriveSummary(periods)` pure helper | 1 hour |

---

### Tier 1 — Atomic building blocks (MUI only, no blockers)

| Component | Estimated effort | Subpath |
|---|---|---|
| `ExpenseLineItem` | 1–2 hours | Main bundle |
| `ExpenseCategoryGroup` | 2–3 hours | Main bundle |
| `PeriodSummaryCard` | 2–4 hours | Main bundle |

---

### Tier 2 — Motion components (requires `/motion` subpath — already wired)

| Component | Estimated effort | Subpath | Depends on |
|---|---|---|---|
| `HorizontalScrollRail` | 3–4 hours | `/motion` | Nothing |
| `PeriodDetailSheet` | 4–6 hours | `/motion` | Tier 1 components, StatCardRow (existing) |
| `BudgetSummaryDrawer` | 3–4 hours | `/motion` | MetricCard (existing), ProgressStatsList (Phase H) |
| `ExpandingPeriodStrip` | 4–6 hours | `/motion` | Tier 1 components |

---

### Tier 3 — View containers (depends on Tier 2)

| Component | Estimated effort | Subpath | Depends on |
|---|---|---|---|
| `BreakdownCarouselView` | 2–3 hours | `/motion` | Scroll Rail + Detail Sheet |
| `BreakdownExpandingView` | 2–3 hours | `/motion` | Expanding Strip |
| `BreakdownStackedView` | 1–2 hours | `/motion` | Accordion (existing) |
| `WeeklyBreakdownPage` | 3–4 hours | `/motion` | All Tier 3 + Summary Drawer |

**Total estimated build time (Tier 0 through Tier 3):** 28–44 hours (without chart slots).
Chart slot components from `dashboard-components-plan.md` are independent — they slot in via
`ReactNode` props once built, requiring zero changes to this component tree.

---

## Data flow: alexrebula consumer (private — never in giselle-mui)

The `alexrebula` data file (`src/sections-api/trip-planner/data.ts`) provides:

```ts
// alexrebula — private, personal, never in public packages
// Imports types from @alexrebula/giselle-mui — the canonical type source.
import type { PeriodData, ExpenseCategoryDef, PeriodSummary } from '@alexrebula/giselle-mui';
import { deriveSummary } from '@alexrebula/giselle-mui'; // pure util

export const TRIP_CATEGORIES: ExpenseCategoryDef[] = [
  { key: 'accommodation', label: 'Accommodation', color: 'primary', iconId: 'solar:home-bold' },
  { key: 'food',          label: 'Food & Dining',  color: 'success', iconId: 'solar:chef-hat-bold' },
  { key: 'transport',     label: 'Transport',       color: 'info',    iconId: 'solar:bus-bold' },
  { key: 'activities',    label: 'Activities',      color: 'warning', iconId: 'solar:ticket-bold' },
  { key: 'misc',          label: 'Miscellaneous',   color: 'secondary', iconId: 'solar:tag-bold' },
];

export const TRIP_WEEKS: PeriodData[] = [
  // ... week data here (private — contains actual costs)
];

export const TRIP_SUMMARY: PeriodSummary = deriveSummary(TRIP_WEEKS);
```

The page component in `alexrebula/src/sections/trip-planner/view.tsx` imports these and
passes them to `WeeklyBreakdownPage`. Zero data-wiring changes are needed to switch the
view variant — `defaultView` prop change only.

---

## Storybook stories — mandatory per component

Each component above requires at minimum:

1. **Default** story — generic placeholder data (no personal info — use city names like
   'Melbourne CBD', 'Surf Coast', 'Yarra Valley'; generic categories)
2. **All six palette colours** story (for `PeriodSummaryCard` colour variants)
3. **Responsive** story at xs / sm / md / lg widths
4. **Decision doc** story for any non-obvious design choice (layoutId animation, drag-to-close, etc.)

Storybook sample data lives in `giselle-mui` itself — never imported from alexrebula.
Generic placeholders: city names, generic activity labels, round-number amounts.

---

## Related plans

- [`dashboard-components-plan.md`](./dashboard-components-plan.md) — chart card slots
  (`DonutChartCard`, `BudgetVsActualChartCard`, `ProgressStatsList`)
- [`giselle-mui/docs/roadmap.md`](../roadmap.md) — Phase H dashboard suite
- [`alexrebula/docs/roadmap.md`](../../../../rm/presentation/alexrebula/docs/roadmap.md) — Phase 1.5 ThemeProvider decoupling
