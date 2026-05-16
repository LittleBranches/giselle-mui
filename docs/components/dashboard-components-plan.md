---
sidebar_position: 10
sidebar_label: 'Dashboard Components Plan'
---

# Dashboard Components — Build Plan for giselle-mui

> **Context:** This plan defines every reusable component needed to render a full data
> dashboard in `alexrebula` (and any future project built on `giselle-mui`). The immediate
> use case is the **trip-costs dashboard** in `alexrebula` — displaying cost breakdowns,
> payment timelines, wage progress, and budget widgets using the same widget vocabulary as
> a product analytics dashboard. The components must be general-purpose: nothing
> trip-cost-specific belongs in giselle-mui.
>
> Every component listed here must be built independently from scratch in `giselle-mui` — no
> proprietary utilities, no unauthorized imports.
>
> _Last updated: 12 May 2026_

---

## Dependency architecture — the subpath export strategy

### The problem

Some components need heavy dependencies (`apexcharts`, `react-apexcharts`, `framer-motion`).
Bundling them into the main `dist/index.js` means every consumer pays the bundle cost even
if they never use a chart or animation.

### Options considered

| Option                                     | Pros                                                    | Cons                                                          |
| ------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------- |
| **A — Single bundle, optional peer deps**  | Simple                                                  | Consumer installs ApexCharts even for a text-only project     |
| **B — Separate repo `giselle-mui-charts`** | Clean separation                                        | Two packages to maintain, two yalc pushes, version drift risk |
| **C — Subpath exports (chosen ✅)**        | Zero cost for unused subpaths, one repo, proven pattern | Requires `exports` map in `package.json` + extra tsup entry   |

### Current state (already two entry points in `tsup.config.ts`)

```
@alexrebula/giselle-mui         → dist/index.js     (components, 'use client')
@alexrebula/giselle-mui/utils   → dist/utils.js     (server-safe utils, no 'use client')
```

### Planned subpath additions

```
@alexrebula/giselle-mui/charts  → dist/charts.js    (ApexCharts wrappers, optional peer dep)
@alexrebula/giselle-mui/motion  → dist/motion.js    (framer-motion components, optional peer dep)
```

**Implementation:** Add two new tsup entry objects to `tsup.config.ts`, matching the existing
`utils` pattern. Add corresponding `exports` entries to `package.json`. Mark `apexcharts`,
`react-apexcharts`, and `framer-motion` as `peerDependenciesMeta.optional: true` (already done
for apexcharts — needs verification for framer-motion).

**Consumer contract:** A consumer who imports only from `@alexrebula/giselle-mui` never needs
ApexCharts installed. A consumer who imports from `.../charts` must have ApexCharts as a dep.
This mirrors how `@mui/x-date-pickers` is consumed — opt-in subpath.

**No new repo needed.** The one-repo / subpath-export approach is strictly better for this
library's scale.

---

## Blocker key

| Symbol | Meaning                                                                  |
| ------ | ------------------------------------------------------------------------ |
| ✅     | Already shipped in giselle-mui                                           |
| 🟡     | Exists in alexrebula but needs cleanup before extraction                 |
| 🔴     | Does not exist anywhere — must be written from scratch                   |
| ⚙️     | Architecture blocker (theme, settings, or subpath setup must land first) |
| 📦     | Dependency blocker (optional peer dep subpath must be set up first)      |

---

## Group 1 — Stat / Metric cards (MUI only)

### `StatCard` ✅ Shipped — 5 May 2026

**What it is:** Compact data card. Number, label, trend arrow, six palette colour variants,
sparkline slot via `chart?: ReactNode`.

**Transferability:** 100% — already in giselle-mui. ApexCharts sparkline is the consumer's
responsibility (passes a `ReactNode` into the `chart` slot — StatCard itself has zero
ApexCharts dependency).

**Blockers:** None. In production.

---

### `StatCardRow` ✅ Shipped — 13 May 2026

**What it is:** Responsive grid of `StatCard` items. Seen in every dashboard top row.
Accepts a `StatCardItem[]` array (type already in `giselle-mui`) and lays them out in a
`Grid2` row with the correct breakpoints (`xs=12 sm=6 md=3`).

**Transferability:** 100% once built. Zero special deps.

**Output subpath:** Main bundle (`@alexrebula/giselle-mui`).

---

### `ProfileSummaryCard` 🔴 Needs building

**What it is:** Right-sidebar profile card. Avatar (image or initials fallback), display
name, optional role/subtitle, and a horizontal row of 2–4 labelled stat values below.

**Seen in:** Analytics-style dashboards — avatar, name, role label, 3 stat numbers in a row (e.g. "Courses in progress / Completed / Certificates").

**Immediate consumer:**

- Example: contributor dashboard sidebar — profile card with display name, earned-to-date, and pending payment stats. Display name comes from the authenticated session.

**Accepts:**

```ts
type ProfileSummaryCardProps = {
  name: string;
  role?: string;
  avatarSrc?: string;
  stats: Array<{ label: string; value: string | number }>;
  sx?: SxProps<Theme>;
};
```

**Transferability:** 100%. Pure MUI (`Avatar`, `Typography`, `Stack`, `Divider`). No charts.

**Blockers:** None.

**Output subpath:** Main bundle.

---

### `BalanceSummaryCard` 🔴 Needs building

**What it is:** Large financial overview card. Primary metric (e.g. total balance), two
sub-stats (income / expenses) with trend indicators, a sparkline or line chart below.
Action buttons: Send / Add card / Request.

**Seen in:** Banking dashboard (top-left card "Total balance $49,990").

**Transferability:** High for the shell. Line chart inside = ApexCharts sparkline (optional).

**Blockers:**

- 📦 `/charts` subpath must exist if the embedded sparkline uses ApexCharts.
- Or: accept `chart?: ReactNode` and let the consumer supply the chart — simpler.
- Recommended: `chart?: ReactNode` slot. Keep BalanceSummaryCard in the main bundle.

**Output subpath:** Main bundle.

---

### `CreditCardDisplay` 🔴 Needs building

**What it is:** Dark card showing a credit/debit card — masked number (`•••• •••• •••• 3640`),
card holder name, expiry date, card network logo slot. Purely presentational.

**Seen in:** Banking dashboard (top-right dark card).

**Transferability:** 100%. Pure MUI + CSS. Zero deps beyond core.

**Blockers:** None beyond standard MUI.

**Output subpath:** Main bundle.

---

## Group 2 — Chart cards (ApexCharts — subpath `/charts`)

> All components in this group go in `@alexrebula/giselle-mui/charts` (new tsup entry).
> Consumers must install `apexcharts` and `react-apexcharts` as peer deps.
> Every component in this group follows the same rule as `RadialProgressCard`:
> **chart options live in `*.styles.ts`, never inline in JSX.**

### `ChartCardBase` ⬜ Needs building

**What it is:** Shared card shell primitive for chart cards: title/subtitle header,
action slot, chart body slot, optional footer slot, and loading/empty states.

**Why it exists:** Prevent repeated card chrome implementation across
`DonutChartCard`, `AreaLineChartCard`, `GroupedBarChartCard`, `RadarChartCard`, and
other chart-card components.

**Rule:** `SparklineBarChart` does NOT use `ChartCardBase` because it is an embedded
chart primitive (no card wrapper).

**Output subpath:** `/charts`.

### `RadialProgressCard` ✅ Shipped — 5 May 2026

**What it is:** Card wrapping an ApexCharts radialBar. Already shipped with correct
lazy-load pattern. Reference implementation for all chart components below.

**Output subpath:** Currently in main bundle via lazy load. Move to `/charts` in Phase H.

---

### `DonutChartCard` 🔴 Needs building

**What it is:** Donut/pie chart in a card shell. Shows a legend below or to the side.
Accepts `series: number[]`, `labels: string[]`, `title: string`, `total?: number`.

**Seen in:** App dashboard ("Current download by OS"), Ecommerce ("Sale by gender"),
Analytics ("Current visits"), Banking ("Expenses categories").

**Immediate consumer:**

- Example: task management viewer dashboard — status breakdown (Open / In Progress / In Review / Done counts).

**Transferability:** 100% once ApexCharts subpath is in place.

**Blockers:**

- 📦 `/charts` subpath must be configured in tsup + package.json first.
- Chart options (colors, plotOptions) must come from `donut-chart-card.styles.ts`.
- Uses `theme.vars.palette.*` for colors — requires `GiselleThemeProvider` or manual theme.

**Output subpath:** `/charts`.

---

### `AreaLineChartCard` 🔴 Needs building

**What it is:** Area or line chart in a card. Supports 1–2 series (e.g. income vs expenses).
Year selector in card header. Accepts `series: ApexAxisChartSeries`, `title`, `subtitle`,
`yearOptions?: number[]`.

**Seen in:** Ecommerce ("Yearly sales"), Banking (balance line in BalanceSummaryCard).

**Immediate consumer:**

- Example: contributor earnings dashboard — accumulated total per week (bucketed from task completion date).

**Output subpath:** `/charts`.

**Blockers:** Same as DonutChartCard.

---

### `BudgetVsActualChartCard` 🔴 Needs building

**What it is:** Dual-series line chart comparing **planned spend** against **actual spend**
over a set of time periods. The planned series is fixed at period start (the budget).
The actual series grows as real spend is recorded. The key visual is the divergence
gap — the chart fills `error.main` when actual exceeds planned (over budget) and
`success.main` when actual is below planned (under budget).

Distinct from `AreaLineChartCard` (a general chart with no budget semantics) and from
`ProjectionChartCard` (which compares cost vs projected return — the break-even model).
This component encodes the specific "planned vs actual" BI pattern with correct
variance fill semantics.

**Accepts:**

- `title: string`
- `plannedSeries: BudgetDataPoint[]` — `{ label: string; value: number }` (static budget)
- `actualSeries: BudgetDataPoint[]` — `{ label: string; value: number }` (grows over time)
- `xAxisLabel?: string` — e.g. `'Week'` or `'Month'`
- `currency?: string` — e.g. `'AUD'`
- `cumulativeMode?: boolean` — `true` = cumulative totals, `false` = period deltas

**Variance colouring (non-negotiable):**

Area fill between the two series uses `theme.vars.palette.error.mainChannel` when actual

> planned and `theme.vars.palette.success.mainChannel` when actual < planned. Never
> hardcoded hex or rgba literals.

**Immediate consumer:**

- Example: project administration dashboard — planned payment schedule vs actual payout dates.

**Output subpath:** `/charts`.

**Blockers:**

- 📦 `/charts` subpath must be configured first. ✅ Done (7 May 2026).
- Chart options and variance fill logic must come from `budget-vs-actual-chart-card.styles.ts`.
- `BudgetDataPoint` type must be defined in `types.ts` before building the component.

---

### `GroupedBarChartCard` 🔴 Needs building

**What it is:** Grouped or stacked bar chart in a card. Supports multiple series, legend,
x-axis labels. Accepts `series`, `categories`, `stacked?: boolean`, `title`.

**Seen in:** App ("Area installed"), Analytics ("Website visits"), Banking ("Balance statistics").

**Output subpath:** `/charts`.

**Blockers:** Same as DonutChartCard.

---

### `HorizontalBarChartCard` 🔴 Needs building

**What it is:** Horizontal progress-bar style chart. Each row = one category with a filled
bar and a value label. Different from `ProgressStatsList` — this uses ApexCharts for precise
axis alignment.

**Seen in:** Analytics ("Conversion rates — Female, Male, Other, Senior, Future").

**Output subpath:** `/charts`.

**Blockers:** Same as DonutChartCard.

---

### `RadarChartCard` 🔴 Needs building

**What it is:** Radar / spider chart. Multiple polygon series, labelled axes. Accepts
`series: ApexAxisChartSeries`, `categories: string[]`, `title`.

**Seen in:** Analytics-style dashboards — strength/score breakdown by category (e.g. subjects, skill areas, repo types).

**Immediate consumer:**

- Example: contributor metrics dashboard — per-repository completion strength across multiple tracked repositories.

**Output subpath:** `/charts`.

**Blockers:** Same as DonutChartCard.

---

### `SparklineBar` 🔴 Needs building

**What it is:** Tiny bar or area chart for embedding inside `StatCard` or
`BalanceSummaryCard`. Not a full chart card — just the chart element (no card shell).
Designed to be passed as `chart={<SparklineBar ... />}` to `StatCard`.

**Seen in:** Top stat row in App and Ecommerce dashboards (bar sparklines on the right
of each stat card).

**Output subpath:** `/charts`.

**Blockers:** Same as DonutChartCard.

---

## Group 3 — Data lists and tables (MUI only)

### `DataTable` 🔴 Needs building

**What it is:** Styled MUI `Table` (not DataGrid — avoid MUI X dependency). Accepts
`columns: DataTableColumn[]` and `rows: Record<string, ReactNode>[]`. Renders a
scroll-safe, compact table with an optional action menu per row.

**Seen in:** App ("New Invoices"), Ecommerce ("Best salesman"), Banking ("Recent transitions").

**Transferability:** 100% using MUI `Table`. DataGrid would add MUI X as a dep — avoid.

**Blockers:** Define `DataTableColumn` and `DataTableRow` types in `types.ts`. No dep blockers.

**Output subpath:** Main bundle.

---

### `ActivityFeedList` 🔴 Needs building

**What it is:** Vertical list of activity items. Each item: avatar (image or icon),
primary text, secondary text, timestamp, optional status chip. Accepts `ActivityFeedItem[]`.

**Seen in:** Banking ("Recent transitions"), App ("New Invoices" alternative layout).

**Transferability:** 100%. Pure MUI `List` + `ListItem` + `Avatar` + `Chip`.

**Blockers:** None.

**Output subpath:** Main bundle.

---

### `NewsFeedList` 🔴 Needs building

**What it is:** Vertical list of news/article items. Each item: thumbnail image, title,
snippet (1–2 lines), relative time. Accepts `NewsFeedItem[]`.

**Seen in:** Analytics ("News" section).

**Transferability:** 100%. MUI `List` + `Box`.

**Blockers:** None.

**Output subpath:** Main bundle.

---

### `RelatedItemsList` 🔴 Needs building

**What it is:** Vertical list with tab filter ("Top 7 days / Top 30 days / All time").
Each item: icon, name, sub-label, 3 stat numbers. Accepts `tabs: string[]` and
`items: RelatedItem[]` per tab.

**Seen in:** App dashboard ("Related applications").

**Blockers:** None beyond standard MUI (`Tabs`, `List`).

**Output subpath:** Main bundle.

---

## Group 4 — Financial / action widgets (MUI only)

### `ProgressStatsList` 🔴 Needs building

**What it is:** Vertical list of labeled progress bars. Each row: label, value (amount +
percentage), coloured `LinearProgress`. Accepts `ProgressStatsItem[]`.

**Seen in:** Ecommerce ("Sales overview — Total profit / Total income / Total expenses").

**Transferability:** 100%. Uses MUI `LinearProgress` + `Typography` + `Stack`. No charts.

**Output subpath:** Main bundle.

---

### `QuickTransferWidget` 🔴 Needs building

**What it is:** Avatar row (contacts), text input for amount (`$200`), confirm button
("Transfer now"), balance display. A compact action widget that fits in a dashboard sidebar.

**Seen in:** Banking dashboard (right panel).

**Transferability:** 100%. MUI form components only.

**Blockers:** None.

**Output subpath:** Main bundle.

---

### `ContactsList` 🔴 Needs building

**What it is:** Compact vertical list of contacts with avatar and email. Optional action
icons per row. Accepts `ContactItem[]`.

**Seen in:** Banking ("Contacts — 502 contacts").

**Transferability:** 100%.

**Output subpath:** Main bundle.

---

### `BudgetBreakdownCard` 🔴 Needs building (trip-costs specific → generalise)

**What it is:** Card showing a named budget with a primary total, breakdown rows
(category / amount / percentage), and an optional donut chart slot. This is the component
that will display the trip costs breakdown in alexrebula.

**General version accepts:**

- `title: string`
- `total: number | string`
- `currency?: string`
- `items: BudgetItem[]` — `{ label, amount, percentage?, color? }`
- `chart?: ReactNode` — optional donut chart

**Seen as concept in:** Ecommerce "Sales overview" + Banking "Current balance" combined.

**Blockers:** None. MUI only. Donut chart passed as a slot — no direct ApexCharts dep.

**Output subpath:** Main bundle.

---

## Group 5 — Hero / marketing cards (MUI only)

### `HeroBannerCard` 🔴 Needs building

**What it is:** Full-width or wide card with gradient background, headline text, optional
subtitle, CTA button slot, and an illustration slot (right side). Dark-mode and light-mode
variants.

**Seen in:** App ("Welcome back Jaydon Frankie"), Ecommerce ("Congratulations").

**Rule:** The illustration is a `ReactNode` slot — `HeroBannerCard` itself never imports an
image. Consumer passes `<img src="..." />` or an SVG component.

**Blockers:**

- ⚙️ `GiselleThemeProvider` (Phase C) must exist so the gradient uses `theme.vars.palette.*`
  channel references — no hardcoded hex.

**Output subpath:** Main bundle.

---

### `FeaturedItemCard` 🔴 Needs building

**What it is:** Right-rail card with a product or article image, badge label ("NEW",
"FEATURED APP"), title, short description, and a CTA button. Image fills the top of the card.

**Seen in:** App ("Understanding Blockchain Technology"), Ecommerce ("Urban Explorer Sneakers").

**Blockers:** None.

**Output subpath:** Main bundle.

---

### `PromoInviteCard` 🔴 Needs building

**What it is:** Accent-coloured card with an incentive headline ("Invite friends and earn
$50"), body copy, email input, and a submit button.

**Seen in:** Banking (bottom-right dark red card).

**Blockers:** None.

**Output subpath:** Main bundle.

---

## Group 6 — Motion components (framer-motion — subpath `/motion`)

> Components in this group require `framer-motion` as a peer dep. They go in
> `@alexrebula/giselle-mui/motion` (new tsup entry). Consumers who don't use motion
> components pay zero bundle cost.

### `FloatingSubNav` 🟡 Already in giselle-mui (main bundle)

**What it is:** Floating sub-navigation bar with animated show/hide. Currently ships in the
main bundle. Should move to `/motion` to avoid imposing framer-motion on all consumers.

**Current state:** Shipped, uses `motion.div`, follows `motion.*` rule (not `m.*`).

**Blockers:**

- 📦 `/motion` subpath must be configured before this can move out of the main bundle.
- This is a breaking change for current consumers of the main bundle — needs a deprecation
  path or minor version bump with a re-export shim.

**Output subpath:** Move from main bundle → `/motion`.

---

### Animated tab panels / page transitions 🔴 Needs building

**What it is:** `AnimatedTabPanel` — wraps `children` in a `motion.div` with enter/exit
animations. Used for dashboard tab switches.

**Output subpath:** `/motion`.

---

## Group 7 — Investment analytics / projection widgets

> These components exist because of a specific mental model: an investment (e.g. a person,
> a codebase, a tool) has both a cost curve and a return curve. The cost appears first;
> the return emerges over time. The widgets below make that model visible and interactive.
> They are general-purpose — nothing use-case-specific belongs in giselle-mui.
> The data shapes are intentionally abstract (`InvestmentItem`, `ProjectionSeries`,
> `ScenarioInput`) so any ROI or planning dashboard can consume them.

### `ProjectionChartCard` 🔴 Needs building

**What it is:** Dual-series area/line chart in a card. One series = actual costs over time
(week or month buckets). One series = projected return / dividend curve. The two series
cross at the break-even point — that crossing is the key visual insight.

**Accepts:**

- `title: string`
- `actualSeries: ProjectionDataPoint[]` — `{ label: string, value: number }`
- `projectedSeries: ProjectionDataPoint[]`
- `xAxisLabel?: string` — e.g. `'Week'` or `'Month'`
- `currency?: string` — e.g. `'AUD'`
- `breakEvenAnnotation?: boolean` — draw a vertical line at the crossing point

**Seen as concept in:** Ecommerce "Yearly sales" (dual series area chart).

**Output subpath:** `/charts`.

**Blockers:**

- 📦 `/charts` subpath must be configured first.
- Chart options (colors, fill opacity, annotation) must come from `projection-chart-card.styles.ts`.

---

### `CostClassificationCard` 🔴 Needs building

**What it is:** Card that breaks a set of costs into named categories with distinct
visual treatment. Categories are data-driven — the component does not know what
"CAPEX" or "opportunity cost" means; it renders whatever classification scheme
the consumer defines.

**Default category vocabulary (consumer-defined, not hardcoded):**

- `'capex'` — one-time spend that produces a durable asset (amortized)
- `'opex'` — recurring spend with no residual asset
- `'investment'` — spend that creates a future return (opportunity cost model)
- `'opportunity'` — non-cash cost (time, foregone income)

**Accepts:**

- `title: string`
- `items: CostClassificationItem[]` — `{ label, amount, category, amortizedMonths?, color? }`
- `totalLabel?: string`

**Output subpath:** Main bundle (no chart dep — uses MUI `Chip` + `Stack` + `Typography`).

**Blockers:** None.

---

### `ROIComparisonCard` 🔴 Needs building

**What it is:** Side-by-side comparison of investment returns across two dimensions:
material (income, time saving, product shipped) and non-material (relationship,
skill development, compounding value). Renders two columns of labeled metric rows
with a qualitative/quantitative indicator per row.

**The key insight:** non-material dividends (a 15-year-old who understands git, code
review, and shipping software) are often larger than the material ones but invisible
in any standard financial model. This widget makes them explicit.

**Accepts:**

- `title: string`
- `materialItems: ROIItem[]` — `{ label, value, unit?, trend? }`
- `nonMaterialItems: ROIItem[]` — `{ label, value: string, icon?: ReactNode }`
- `chart?: ReactNode` — optional bar chart slot for the material column

**Output subpath:** Main bundle.

**Blockers:** None.

---

### `ScenarioComparisonWidget` 🔴 Needs building

**What it is:** Interactive "what if" widget. Consumer defines a set of scenario
variables (toggle, numeric slider, dropdown). Each variable change re-computes a
set of outcome metrics in real time. Shows a before/after or multi-scenario grid.

**General enough to model:**

- "What if a contributor completes 4 tasks vs 8 tasks — how does the wage cost change and
  how does the projected delivery speed change?"
- "What if I defer the desk — how does CAPEX drop and what is the productivity impact?"
- "What if the visit is 48 days vs 53 days — how do recurring costs change?"

**Accepts:**

- `title: string`
- `variables: ScenarioVariable[]` — `{ key, label, type: 'toggle'|'range'|'select', defaultValue, options? }`
- `compute: (values: Record<string, unknown>) => ScenarioOutcome[]`
- `outcomes: ScenarioOutcomeDefinition[]` — `{ key, label, format: 'currency'|'days'|'percent'|'text' }`

**Output subpath:** Main bundle. The `compute` function is pure — no animation dep.
Optional: wrap in a motion variant in `/motion` for animated value transitions.

**Blockers:**

- Requires careful API design — `compute` must be a pure function (no side effects)
  so the component stays testable and server-renderable.
- Define `ScenarioVariable`, `ScenarioOutcome`, `ScenarioOutcomeDefinition` types in
  `types.ts` before building the component.

---

### `AmortizationScheduleTable` 🔴 Needs building

**What it is:** Table showing how a one-time cost (CAPEX) is amortized over a defined
period. Each row = one time period (month/quarter). Columns: period, remaining balance,
period cost, cumulative amortized. Optional: a `chart?: ReactNode` slot for a bar
chart showing the curve.

**Why it belongs here:** Any dashboard that tracks an investment (a tool, a person, a
dep upgrade) needs to distinguish "I paid AUD 1,800 for a laptop today" from "the
effective monthly cost is AUD 75 over 24 months". This table makes that explicit.

**Accepts:**

- `title: string`
- `totalCost: number`
- `periodLabel: string` — e.g. `'Month'`
- `periods: number` — total amortization period
- `currency?: string`
- `chart?: ReactNode`

**Output subpath:** Main bundle.

**Blockers:** None.

---

## Build order (recommended)

Phase G of the giselle-mui roadmap covers these components. Recommended order:

### Tier 1 — Architecture prerequisites (unblock everything)

| Task                                                             | Why                                                   |
| ---------------------------------------------------------------- | ----------------------------------------------------- |
| Configure `/charts` subpath in tsup + package.json               | Unblocks all ApexCharts chart cards                   |
| Configure `/motion` subpath in tsup + package.json               | Unblocks FloatingSubNav move + new motion components  |
| Confirm `framer-motion` is `peerDependenciesMeta.optional: true` | Already done for apexcharts; verify for framer-motion |
| Phase C — `GiselleThemeProvider`                                 | Unblocks HeroBannerCard gradient tokens               |

### Tier 2 — MUI-only components (no dep blockers, build immediately)

Build these in parallel with Tier 1 — they have no architectural dependencies:

1. `ProgressStatsList` — needed for trip-costs "payment spread" view
2. `BudgetBreakdownCard` — primary trip-costs component
3. `ActivityFeedList` — timeline of payments / cash-flow
4. `DataTable` — task list / payment history
5. `HeroBannerCard` — dashboard welcome card
6. `StatCardRow` — stat cards in a responsive grid
7. `BalanceSummaryCard` (`chart?: ReactNode` slot)
8. `NewsFeedList`, `ContactsList`, `QuickTransferWidget`, `RelatedItemsList`

### Tier 3 — Chart components (after `/charts` subpath is configured)

1. `SparklineBar` — embedded in StatCard
2. `DonutChartCard` — expenses breakdown, bucket split visualisation
3. `AreaLineChartCard` — cash-flow over time
4. `ProjectionChartCard` — dual series cost vs return, break-even annotation
5. `GroupedBarChartCard` — weekly spend by category
6. `HorizontalBarChartCard` — conversion / budget category bars
7. `RadarChartCard` — (lower priority — no immediate trip-costs use case)

### Tier 4 — Motion components (after `/motion` subpath is configured)

1. Move `FloatingSubNav` from main → `/motion`
2. `AnimatedTabPanel`

---

## Trip-costs dashboard — component shopping list

The specific components needed to render a cost-breakdown dataset as a
live dashboard in alexrebula (Phase H of the alexrebula roadmap):

| Widget                                                     | Component                       | Status                          |
| ---------------------------------------------------------- | ------------------------------- | ------------------------------- |
| Stat row: total cost, cash needed this week, ZipPay amount | `StatCard` × 3 + `StatCardRow`  | `StatCard` ✅, `StatCardRow` ✅ |
| Cash-flow timeline                                         | `TimelineTwoColumn`             | ✅                              |
| Budget breakdown (flights, CAPEX, activities, wages)       | `BudgetBreakdownCard`           | 🔴                              |
| Donut: cost categories                                     | `DonutChartCard`                | 🔴                              |
| Payment spread table (ZipPay vs cash)                      | `DataTable`                     | 🔴                              |
| Activity feed: payment events as tasks are paid            | `ActivityFeedList`              | 🔴                              |
| Wage progress + Barefoot split                             | `ProgressStatsList`             | 🔴                              |
| Barefoot buckets donut                                     | `DonutChartCard`                | 🔴                              |
| Task completion progress                                   | `StatCard` (tasks done / total) | ✅                              |
| Cost classification (CAPEX / OpEx / Investment)            | `CostClassificationCard`        | 🔴                              |
| Costs vs projected return over time (break-even line)      | `ProjectionChartCard`           | 🔴                              |
| Planned vs actual spend over time (budget adherence)       | `BudgetVsActualChartCard`       | 🔴                              |
| Material vs non-material dividends                         | `ROIComparisonCard`             | 🔴                              |
| Scenario: "what if contributor does 4 vs 8 tasks?"         | `ScenarioComparisonWidget`      | 🔴                              |
| Laptop/desk amortization over 24 months                    | `AmortizationScheduleTable`     | 🔴                              |

**Minimum viable dashboard (MUI-only components only, no charts subpath needed):**

`StatCardRow` + `BudgetBreakdownCard` + `DataTable` + `ActivityFeedList` + `ProgressStatsList`

This gives a fully functional read-only dashboard for the trip costs. Chart components
add visual richness but are not required for the data to be legible.

---

## Component count summary

| Group                    | Count                                                      | Subpath       | Status     |
| ------------------------ | ---------------------------------------------------------- | ------------- | ---------- |
| Already shipped          | 2 (`StatCard`, `RadialProgressCard`)                       | Main + Charts | ✅         |
| MUI-only (no dep)        | 16                                                         | Main bundle   | 🔴 All new |
| ApexCharts chart cards   | 8 (incl. `ProjectionChartCard`, `BudgetVsActualChartCard`) | `/charts`     | 🔴 All new |
| Motion components        | 2 (1 move, 1 new)                                          | `/motion`     | 🟡/🔴      |
| **Total new components** | **24**                                                     |               |            |

---

## Related

- [`roadmap.mdx`](../roadmap.mdx) — Phases A–G (add Phase H: Dashboard Components here)
- [`standalone-gap-analysis.md`](../standalone-gap-analysis.md) — Phase D UI primitives
- `alexrebula/docs/roadmap.md` — Phase 1.6: Dashboard Components (bubble-up entry)
