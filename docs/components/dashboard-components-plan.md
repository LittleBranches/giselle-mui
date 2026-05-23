---
sidebar_position: 10
sidebar_label: 'Dashboard Components Plan'
---

# Dashboard Components — Build Plan for giselle-mui

> **Context:** This plan defines every reusable component needed to render a full data
> dashboard in any project built on `giselle-mui`. The immediate consumers are:
>
> - **`first-branch`** — Žiga's open-source task tracker (deadline: ~20 Jun 2026). Needs
>   stat cards, data table, activity feed, progress bars, profile card, and chart widgets.
> - **`alexrebula`** — trip-costs dashboard (cost breakdowns, payment timelines, budget widgets).
>
> Every component must be general-purpose — nothing app-specific belongs in giselle-mui.
> Every component is built independently from scratch — no proprietary utilities.
>
> _Last updated: 26 May 2026 · Phase 1 scaffolding complete for all components · Phase 2 (implementation) in progress_

---

## Status legend

| Symbol | Meaning                                                                                    |
| ------ | ------------------------------------------------------------------------------------------ |
| ✅     | Implemented, tested, exported from barrel — ready to consume                               |
| ⚙️     | Phase 1 scaffolded: `types.ts` + test stubs + `README.md` + `index.ts` — **no `.tsx` yet** |
| 🔴     | Not started — no folder, no scaffold                                                       |

---

## Architecture status

All five subpath exports are **wired, build-verified, and in production** as of 19 May 2026.
No architectural prerequisites remain.

```
@littlebranches/giselle-mui          → dist/index.js    MUI-only components (main bundle)
@littlebranches/giselle-mui/utils    → dist/utils.js    Server-safe pure utilities
@littlebranches/giselle-mui/charts   → dist/charts.js   ApexCharts wrappers (optional peer dep)
@littlebranches/giselle-mui/motion   → dist/motion.js   framer-motion components (optional peer dep)
@littlebranches/giselle-mui/lab      → dist/lab.js      @mui/lab Timeline components (optional peer dep)
```

`GiselleThemeProvider`, `GiselleSettingsProvider`, and `GiselleThemeAndSettingsProvider` are
all shipped ✅ and exported from the main bundle.

---

## Status legend

| Symbol | Meaning                                                                                    |
| ------ | ------------------------------------------------------------------------------------------ |
| ✅     | Implemented, tested, exported from barrel — ready to consume                               |
| ⚙️     | Phase 1 scaffolded: `types.ts` + test stubs + `README.md` + `index.ts` — **no `.tsx` yet** |
| 🔴     | Not started — no folder, no scaffold                                                       |

---

## Group 1 — Cards (main bundle)

All card components live in `src/components/material/surfaces/card/` and export from
the main `@littlebranches/giselle-mui` bundle.

### `StatCard` ✅ Shipped — 5 May 2026

Compact data card: number, label, trend arrow, six palette colour variants, `chart?: ReactNode` slot.

### `StatCardRow` ✅ Shipped — 13 May 2026

Responsive `Grid2` row of `StatCard` items. Accepts `StatCardItem[]`, breakpoints `xs=12 sm=6 md=3`.

### `MetricCard` ✅ Shipped

Large metric with icon slot, decoration variants. Six palette keys.

### `QuoteCard` ✅ Shipped

Pull-quote card. Author name, role, avatar slot, decorative quote marks.

### `SelectableCard` ✅ Shipped

Keyboard-accessible clickable card wrapping `ButtonBase`. Avoids the `Paper onClick` accessibility anti-pattern.

---

### `ProfileSummaryCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Right-sidebar profile card — avatar (image or initials fallback), display name, optional role,
2–4 labelled stat values in a row below. Pure MUI: `Avatar`, `Typography`, `Stack`, `Divider`.

```ts
type ProfileSummaryCardProps = {
  name: string;
  role?: string;
  avatarSrc?: string;
  stats: Array<{ label: string; value: string | number }>;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `BalanceSummaryCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Large financial overview card. Primary metric (balance), two sub-stats (income / expenses) with
trend indicators, action buttons, `chart?: ReactNode` slot for an optional sparkline.
Use `chart?: ReactNode` slot — keeps this component in the main bundle with zero ApexCharts dep.

```ts
type BalanceSummaryCardProps = {
  balance: string | number;
  balanceLabel?: string;
  stats: Array<{ label: string; value: string | number; trend?: 'up' | 'down' }>;
  actions?: Array<{ label: string; icon: ReactNode; onClick?: () => void }>;
  chart?: ReactNode;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `CreditCardDisplay` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Dark card showing a payment card — masked number (`•••• •••• •••• 3640`), card holder, expiry,
`networkLogo?: ReactNode` slot. Purely presentational.

```ts
type CreditCardDisplayProps = {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  networkLogo?: ReactNode;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `HeroBannerCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Full-width gradient card with headline, optional subtitle/description, `action?: ReactNode` CTA
slot, `illustration?: ReactNode` right-side slot. Gradient uses `theme.vars.palette.*` — no
hardcoded hex. Consumer passes `<img>` or SVG into the illustration slot.

```ts
type HeroBannerCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  action?: ReactNode;
  illustration?: ReactNode;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `FeaturedItemCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Card with `image?: ReactNode` top area, optional `badge?: string` label, `title`, `description?`,
`action?: ReactNode` CTA slot. Used for product, article, or featured-app cards.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `PromoInviteCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Accent-coloured card: headline, body copy, email input, submit button. For invite / referral
incentive widgets.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `PeriodSummaryCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Summary card for a named time period. Stat rows with optional trend indicators, `chart?: ReactNode` slot.

```ts
type PeriodSummaryCardProps = {
  period: string;
  title?: string;
  stats: Array<{ label: string; value: string | number; trend?: 'up' | 'down'; color?: string }>;
  chart?: ReactNode;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `BudgetBreakdownCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Card with a named budget total, breakdown rows (category / amount / optional percentage),
`chart?: ReactNode` slot for an optional donut chart. General-purpose — no trip-cost semantics.

```ts
type BudgetBreakdownCardProps = {
  title: string;
  total: number | string;
  currency?: string;
  items: Array<{ label: string; amount: number | string; percentage?: number; color?: string }>;
  chart?: ReactNode;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `CostClassificationCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Classifies costs into categories (capex / opex / investment / opportunity). Category labels
are data-driven — the component renders whatever scheme the consumer defines. Uses MUI `Chip`

- `Stack` + `Typography`.

```ts
type CostClassificationCardProps = {
  title: string;
  items: Array<{
    label: string;
    amount: number | string;
    category: string;
    amortizedMonths?: number;
    color?: string;
  }>;
  totalLabel?: string;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `ROIComparisonCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Two-column card comparing material vs non-material returns on an investment. Material column:
labelled rows with numeric values + trend. Non-material column: labelled rows with string
values + `icon?: ReactNode` slot. Optional `chart?: ReactNode` for the material column.

```ts
type ROIComparisonCardProps = {
  title: string;
  materialItems: Array<{
    label: string;
    value: string | number;
    unit?: string;
    trend?: 'up' | 'down';
  }>;
  nonMaterialItems: Array<{ label: string; value: string; icon?: ReactNode }>;
  chart?: ReactNode;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `QuickTransferWidget` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Compact action widget: avatar row of contacts, amount input, transfer button, balance display.
Fits a dashboard sidebar. Pure MUI form components.

**Output subpath:** Main bundle. **Blockers:** None.

---

## Group 2 — Chart cards (`/charts` subpath)

All components in this group import `react-apexcharts`. They ship from
`@littlebranches/giselle-mui/charts`. Consumers must install `apexcharts` +
`react-apexcharts` as peer deps.

**Non-negotiable rule:** Chart options objects must never be defined inline in JSX.
Static options → module-level const in `*.styles.ts`. Theme-dependent options →
factory function `buildXxxOptions(theme)` in `*.styles.ts`.

### `RadialProgressCard` ✅ Shipped — 5 May 2026

Reference implementation for all chart components. Correct lazy-load pattern, options in
`*.styles.ts`. Folder: `src/components/chart/radial-progress/`.

---

### `ChartCardBase` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Shared shell primitive for chart cards: title/subtitle header, action slot, chart body area,
optional footer. Prevents repeated chrome across DonutChartCard, AreaLineChartCard, etc.
`SparklineBar` does NOT use `ChartCardBase` — it is an embedded chart primitive, not a card.

**Output subpath:** `/charts`. **Blockers:** None (subpath already configured ✅).

---

### `DonutChartCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Donut/pie chart in a card shell. Legend below or to the side.

```ts
type DonutChartCardProps = {
  title: string;
  subheader?: string;
  series: number[];
  labels: string[];
  total?: string | number;
  sx?: SxProps<Theme>;
};
```

**Immediate first-branch use:** Viewer dashboard — task status breakdown (Open / In Progress / In Review / Done).

**Output subpath:** `/charts`. **Blockers:** None (subpath ✅, GiselleThemeProvider ✅).

---

### `AreaLineChartCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Area or line chart in a card. 1–2 series. Optional year selector in header.

```ts
type AreaLineChartCardProps = {
  title: string;
  subheader?: string;
  series: Array<{ name: string; data: number[] }>;
  categories: string[];
  yearOptions?: number[];
  defaultYear?: number;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** `/charts`. **Blockers:** None.

---

### `BudgetVsActualChartCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Dual-series chart: planned (static) vs actual (grows over time). Area fill uses
`error.mainChannel` when actual > planned, `success.mainChannel` when under budget.
Never hardcoded hex.

```ts
type BudgetVsActualChartCardProps = {
  title: string;
  plannedSeries: Array<{ label: string; value: number }>;
  actualSeries: Array<{ label: string; value: number }>;
  xAxisLabel?: string;
  currency?: string;
  cumulativeMode?: boolean;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** `/charts`. **Blockers:** None.

---

### `ProjectionCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Dual-series area chart: actual costs vs projected return. The crossing point = break-even.
Optional vertical annotation at the crossing.

```ts
type ProjectionCardProps = {
  title: string;
  actualSeries: Array<{ label: string; value: number }>;
  projectedSeries: Array<{ label: string; value: number }>;
  xAxisLabel?: string;
  currency?: string;
  breakEvenAnnotation?: boolean;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** `/charts`. **Blockers:** None.

---

### `GroupedBarChartCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Grouped or stacked bar chart in a card. Multiple series, legend, x-axis labels.

**Output subpath:** `/charts`. **Blockers:** None.

---

### `HorizontalBarChartCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Horizontal progress-bar style chart. Each row = one category with filled bar + value label.
Uses ApexCharts for axis alignment precision (vs `ProgressStatsList` which is pure MUI).

**Output subpath:** `/charts`. **Blockers:** None.

---

### `RadarChartCard` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Radar/spider chart. Multiple polygon series, labelled axes.

**Output subpath:** `/charts`. **Blockers:** None.

---

### `SparklineBar` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Tiny embedded bar or area chart — no card wrapper. Designed to be passed as `chart={<SparklineBar />}`
to `StatCard` or `BalanceSummaryCard`.

```ts
type SparklineBarProps = {
  data: number[];
  color?: string;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** `/charts`. **Blockers:** None.

---

## Group 3 — Data display (main bundle)

All components in `src/components/material/data-display/`.

### `AnimatedGradientText` ✅ Shipped

### `GiselleIcon` ✅ Shipped

### `IconActionBar` ✅ Shipped

### `TechIconStrip` ✅ Shipped

---

### `DataTable` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Styled MUI `Table` (not DataGrid — avoids MUI X dep). Column definitions + typed row data.
Optional action menu per row.

```ts
type DataTableProps<K extends string> = {
  columns: DataTableColumn<K>[];
  rows: Array<Record<K, ReactNode> & { id: string | number }>;
  renderActions?: (row: Record<K, ReactNode> & { id: string | number }) => ReactNode;
  sx?: SxProps<Theme>;
};
```

**Immediate first-branch use:** Admin task table — all tasks with status, repo, rate, actions.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `ActivityFeedList` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Vertical list of activity items: avatar, primary text, secondary text, timestamp, optional status chip.

```ts
type ActivityFeedListProps = {
  items: Array<{
    id: string | number;
    avatar?: ReactNode;
    primary: string;
    secondary?: string;
    timestamp: string;
    status?: string;
  }>;
  sx?: SxProps<Theme>;
};
```

**Immediate first-branch use:** Viewer dashboard — recent task completions and payment events.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `ProgressStatsList` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Vertical list of labelled progress bars. Each row: label, value, coloured `LinearProgress`.

```ts
type ProgressStatsListProps = {
  items: Array<{ label: string; value: string | number; percentage: number; color?: string }>;
  sx?: SxProps<Theme>;
};
```

**Immediate first-branch use:** Viewer dashboard — Barefoot bucket split (Give / Save / Blow).

**Output subpath:** Main bundle. **Blockers:** None.

---

### `NewsFeedList` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Vertical list of news/article items: thumbnail, title, snippet, relative time.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `RelatedItemsList` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

List with optional tab filter. Each item: icon, name, sub-label, stat numbers. Uses MUI `Tabs` + `List`.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `ContactsList` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Compact contact list: avatar, name, email. Optional action icons per row.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `AvatarRow` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Horizontal stacked avatar group with a `+N` overflow indicator. Used in `QuickTransferWidget`
and any dashboard showing "who worked on this".

```ts
type AvatarRowProps = {
  avatars: Array<{ src?: string; name: string; size?: number }>;
  max?: number;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `StatusLabel` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Compact status indicator chip/label. Accepts a `status` string and maps it to a palette colour.
Useful anywhere a task or item status needs to be shown inline.

**Immediate first-branch use:** Task status column in admin table, viewer task list.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `ExpenseCategoryGroup` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Grouped list of expense items under a category header. Collapsible. Used to render
a structured expense breakdown in a sidebar or card.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `ExpenseLineItem` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Single row in an expense breakdown: icon slot, label, amount, optional trend indicator.
Sub-component of `ExpenseCategoryGroup` but independently exportable.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `AmortizationTable` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Table showing how a one-time cost is amortized. Each row = one period. Columns: period,
remaining balance, period cost, cumulative amortized. Optional `chart?: ReactNode` slot.

```ts
type AmortizationTableProps = {
  title?: string;
  totalCost: number;
  periodLabel: string;
  periods: number;
  currency?: string;
  chart?: ReactNode;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

## Group 4 — Navigation (main bundle)

All components in `src/components/material/navigation/`.

### `FloatingSubNav` ✅ Shipped

Floating sub-navigation bar with animated show/hide. Currently in main bundle.

---

### `AppTopBar` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

MUI `AppBar` wrapper. `logo?: ReactNode`, `title?: ReactNode`, `actions?: ReactNode` right-side
slot, `onMenuClick?` for sidebar toggle.

```ts
type AppTopBarProps = {
  logo?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  onMenuClick?: () => void;
  sx?: SxProps<Theme>;
};
```

**Immediate first-branch use:** Admin and viewer layout top bars.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `AppSidebar` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

MUI `Drawer` wrapper. `logo?: ReactNode`, `navItems: NavItem[]`, `width?`, `open?` for
controlled open/close. Nav items: icon, label, href, optional active state.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `Breadcrumbs` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

MUI `Breadcrumbs` wrapper with consistent styling. Accepts `items: { label, href? }[]`.
Last item is non-navigable (current page).

**Output subpath:** Main bundle. **Blockers:** None.

---

### `FloatingControlBar` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Floating pill-shaped action bar. Wraps children in a positioned container with elevation.
Used for contextual actions that float above the page content.

**Output subpath:** Main bundle. **Blockers:** None.

---

## Group 5 — Layout (main bundle)

All components in `src/components/material/layout/`. Shipped items are already exported.

### `SectionContainer` ✅ Shipped

### `SectionTitle` ✅ Shipped

### `TwoColumnShowcaseRow` ✅ Shipped

---

### `AppShell` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Full-page shell: sidebar + topbar + main content area. Handles sidebar open/close state.
Accepts `AppTopBar` and `AppSidebar` as `ReactNode` slots — no coupling to those components.

```ts
type AppShellProps = {
  sidebar?: ReactNode;
  topbar?: ReactNode;
  children?: ReactNode;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  sx?: SxProps<Theme>;
};
```

**Immediate first-branch use:** Admin and viewer layout shells.

**Output subpath:** Main bundle. **Blockers:** None.

---

### `AuthPageLayout` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Two-column layout for auth pages: form column + illustration column. `reverse?` flips sides.
`illustration?: ReactNode` slot.

```ts
type AuthPageLayoutProps = {
  children: ReactNode;
  illustration?: ReactNode;
  reverse?: boolean;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** Main bundle. **Blockers:** None.

---

### `PageHeader` ⚙️ Phase 1 scaffolded

**Phase 2 dispatch brief:**

Standard dashboard page header: `title`, `subtitle?`, `breadcrumbs?: ReactNode`, `action?: ReactNode`
right-side slot.

```ts
type PageHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  action?: ReactNode;
  sx?: SxProps<Theme>;
};
```

**Immediate first-branch use:** Admin task management page, viewer dashboard header.

**Output subpath:** Main bundle. **Blockers:** None.

---

## Group 6 — Motion (`/motion` subpath)

Components in `src/components/motion/`. Require `framer-motion` peer dep.

### Shipped (currently in `/motion`)

- `MotionContainer` ✅
- `MotionViewport` ✅
- `useScrollParallax` ✅
- `HeroButtonsRow` ✅
- `InteractiveHeroLogo` ✅
- Animation `variants` ✅

---

### `AnimatedTabPanel` 🔴 Not yet scaffolded

**Brief:** Wraps `children` in a `motion.div` with enter/exit animations. Used for animated
dashboard tab switches.

```ts
type AnimatedTabPanelProps = {
  children: ReactNode;
  value: number;
  index: number;
  sx?: SxProps<Theme>;
};
```

**Output subpath:** `/motion`. **Blockers:** None.

---

## Group 7 — Investment analytics (main bundle)

### `ScenarioComparisonWidget` 🔴 Not yet scaffolded

**Brief:** Interactive "what if" widget. Consumer defines scenario variables (toggle, slider,
dropdown). Each change re-computes outcome metrics via a pure `compute` function. Shows
before/after or multi-scenario outcome grid.

```ts
type ScenarioComparisonWidgetProps = {
  title: string;
  variables: ScenarioVariable[];
  compute: (values: Record<string, unknown>) => ScenarioOutcome[];
  outcomes: ScenarioOutcomeDefinition[];
  sx?: SxProps<Theme>;
};
```

`compute` must be a pure function — no side effects, no fetching.

**Output subpath:** Main bundle. **Blockers:** None (requires careful API design).

---

## first-branch shopping list

Components `first-branch` needs before ~20 Jun 2026 (Žiga's arrival):

| Widget                                         | Component                      | Status           | Priority   |
| ---------------------------------------------- | ------------------------------ | ---------------- | ---------- |
| Viewer stats row (tasks done, earned, pending) | `StatCard` × 3 + `StatCardRow` | `StatCardRow` ✅ | Done       |
| Profile card (display name + 3 stats)          | `ProfileSummaryCard`           | ⚙️ scaffolded    | **HIGH**   |
| Task table (admin view)                        | `DataTable`                    | ⚙️ scaffolded    | **HIGH**   |
| Task status breakdown                          | `StatusLabel`                  | ⚙️ scaffolded    | **HIGH**   |
| Barefoot bucket split                          | `ProgressStatsList`            | ⚙️ scaffolded    | **HIGH**   |
| Recent activity feed                           | `ActivityFeedList`             | ⚙️ scaffolded    | **HIGH**   |
| Task status donut chart                        | `DonutChartCard`               | ⚙️ scaffolded    | **MEDIUM** |
| Page header (admin/viewer)                     | `PageHeader`                   | ⚙️ scaffolded    | **HIGH**   |
| Admin layout shell                             | `AppShell` + `AppTopBar`       | ⚙️ scaffolded    | **HIGH**   |

**Minimum viable first-branch (MUI-only, no `/charts` dep):**
`ProfileSummaryCard` + `DataTable` + `StatusLabel` + `ProgressStatsList` + `ActivityFeedList` + `PageHeader` + `AppShell` + `AppTopBar`

---

## Build order (Phase 2)

### Tier 1 — Already done ✅

| What                                      | Status |
| ----------------------------------------- | ------ |
| All 5 subpath exports configured          | ✅     |
| `GiselleThemeProvider` + Settings shipped | ✅     |
| Phase 1 scaffolding for all components    | ✅     |

### Tier 2 — first-branch critical path (build next)

MUI-only, no dep blockers, needed by ~20 Jun 2026:

1. `StatusLabel` — simplest, unblocks task lists everywhere
2. `PageHeader` — layout primitive needed before shell
3. `AppTopBar` — needed for admin/viewer layouts
4. `AppShell` — composes the above
5. `ProfileSummaryCard` — viewer dashboard hero
6. `DataTable` — admin task table
7. `ProgressStatsList` — Barefoot bucket split
8. `ActivityFeedList` — recent completions feed

### Tier 3 — second wave (after first-branch Tier 2)

Remaining MUI-only cards and widgets:

- `BalanceSummaryCard`, `BudgetBreakdownCard`, `PeriodSummaryCard`
- `HeroBannerCard`, `FeaturedItemCard`, `PromoInviteCard`
- `CostClassificationCard`, `ROIComparisonCard`, `QuickTransferWidget`
- `CreditCardDisplay`, `AvatarRow`, `ContactsList`
- `NewsFeedList`, `RelatedItemsList`, `ExpenseCategoryGroup`, `ExpenseLineItem`
- `AppSidebar`, `Breadcrumbs`, `FloatingControlBar`
- `AuthPageLayout`, `AmortizationTable`

### Tier 4 — Chart components (parallel with Tier 3)

1. `ChartCardBase` — shared shell for all chart cards
2. `SparklineBar` — embedded in StatCard
3. `DonutChartCard` — first-branch status breakdown
4. `AreaLineChartCard` — earnings over time
5. `BudgetVsActualChartCard` — planned vs actual spend
6. `ProjectionCard` — cost vs return break-even
7. `GroupedBarChartCard`, `HorizontalBarChartCard`, `RadarChartCard`

### Tier 5 — Investment analytics + Motion

- `ScenarioComparisonWidget` — scaffold first, then implement
- `AnimatedTabPanel` — scaffold first, then implement

---

## Component count summary

| Group                             | Shipped ✅ | Scaffolded ⚙️ | Not started 🔴 |
| --------------------------------- | ---------- | ------------- | -------------- |
| Group 1 — Cards                   | 5          | 11            | 0              |
| Group 2 — Chart cards (`/charts`) | 1          | 9             | 0              |
| Group 3 — Data display            | 4          | 11            | 0              |
| Group 4 — Navigation              | 1          | 4             | 0              |
| Group 5 — Layout                  | 3          | 3             | 0              |
| Group 6 — Motion                  | 6          | 0             | 1              |
| Group 7 — Investment analytics    | 0          | 0             | 1              |
| **Total**                         | **20**     | **38**        | **2**          |

38 Phase 2 implementations needed. All but 2 are scaffolded and ready for `/create-giselle-component` dispatch.

---

## Related

- [`roadmap.mdx`](../roadmap.mdx) — Phase H: Dashboard Components
- [`cleanup-workflow.md`](./cleanup-workflow.md) — Definition of Done for every component
- `alexrebula/docs/roadmap.md` — Phase 1.6: Dashboard Components
- `first-branch/.github/copilot-instructions.md` — first-branch consumer requirements
