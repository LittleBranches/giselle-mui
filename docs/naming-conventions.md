# giselle-mui — Component Naming Conventions

> **Status:** Active standard — applies to every component from the date of this document.
> Existing components that pre-date it are already compliant; this formalises the rules
> so new additions are consistent without debate.
>
> _Last updated: 16 May 2026_

---

## Core rules

1. **Components are PascalCase.** `AppSidebar`, `StatCard`, `DataTable`. No exceptions.
2. **Folders are kebab-case.** `app-sidebar/`, `stat-card/`, `data-table/`.
3. **Folder name = component name in kebab.** One component per folder. If the folder is
   `balance-summary-card/`, the exported component is `BalanceSummaryCard`.
4. **No generic prefixes.** Do not prefix every component with `Giselle`. The `Giselle`
   prefix is reserved for one component only: `GiselleIcon` — where it disambiguates from
   Iconify's own `Icon` component. Everywhere else the name stands alone.
5. **No `I` interface prefix.** TypeScript interfaces are `BalanceSummaryCardProps`, not
   `IBalanceSummaryCardProps`.

---

## Suffix conventions

| Suffix    | Meaning                                                          | Examples                                       |
| --------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| `Card`    | A self-contained raised surface presenting a single data concept | `StatCard`, `MetricCard`, `BalanceSummaryCard` |
| `Row`     | A horizontal layout of same-type items                           | `StatCardRow`, `AvatarRow`                     |
| `List`    | A vertical list of same-type items                               | `ActivityFeedList`, `ProgressStatsList`        |
| `Table`   | Tabular data with headers and sortable rows                      | `DataTable`, `AmortizationTable`               |
| `Section` | A full-width page section (hero, FAQ, etc.)                      | `HeroSection`, `FaqSection`, `PricingSection`  |
| `Layout`  | A page shell or structural wrapper with named slots              | `AppShell`, `AuthPageLayout`, `PageHeader`     |
| `Label`   | A small status/badge/chip inline element                         | `StatusLabel`                                  |
| `Sheet`   | A bottom/side drawer that reveals detail                         | `PeriodDetailSheet`, `BudgetSummaryDrawer`     |
| `Strip`   | A horizontal scrolling or expandable inline strip                | `HorizontalScrollRail`, `ExpandingPeriodStrip` |
| no suffix | Navigation, provider, or utility components                      | `AppSidebar`, `AppTopBar`, `Breadcrumbs`       |

---

## Category-specific conventions

### Shell and navigation (Phase J)

Shell and navigation components use the `App` prefix to make their role immediately obvious:
they are application-level chrome, not page-level content components.

| Component        | Folder                     | Naming rationale                                                                                                                                                                     |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AppShell`       | `layout/app-shell/`        | `Shell` is the structural descriptor — signals it has named slots (sidebar, topbar, content). Used in MUI docs too. Preferred over layout-mode names like `DashboardLayout`.         |
| `AppSidebar`     | `navigation/app-sidebar/`  | Named by role, not by layout mode. Layout mode (`mini`, `horizontal`) is exposed as a prop variant rather than encoded into separate component names.                                |
| `AppTopBar`      | `navigation/app-top-bar/`  | Descriptive compound preferred over `Header` to avoid clashing with the HTML `<header>` element.                                                                                     |
| `AuthPageLayout` | `layout/auth-page-layout/` | Named by purpose (auth page), not by visual style. Style variants are props.                                                                                                         |
| `PageHeader`     | `layout/page-header/`      | A row containing page title + breadcrumbs + primary action button. No naming conflict with any structural concept.                                                                   |

**AppShell slot contract (explicit):**

- `sidebar` slot is optional.
- `topbar` slot is optional.
- `main` slot is required.

This allows the same shell primitive to support both dashboard pages (with sidebar)
and landing/marketing pages (no sidebar) without introducing a second shell component.

### Card components

All card components use the `Card` suffix. The descriptive noun before `Card` states what
the card displays or represents — never how it looks.

```
StatCard            — a KPI number with trend
MetricCard          — a larger metric with subtitle and icon slot
QuoteCard           — a testimonial quote with attribution
SelectableCard      — a card that can be selected (active state)
BalanceSummaryCard  — an account balance with income/expense breakdown
CreditCardDisplay   — a visual representation of a payment card
ProfileSummaryCard  — a user's avatar, name, role, and key stats
HeroBannerCard      — a marketing hero surface inside a card frame
FeaturedItemCard    — a highlighted product or service item card
PromoInviteCard     — an invitation or promotional CTA card
BudgetBreakdownCard — budget allocation by category
QuickTransferCard   — a send-money or transfer action surface
PeriodSummaryCard   — a trip/period summary (Phase I)
```

### Data display components

Named by what they show, with the category type as a suffix (`List`, `Table`, `Label`).

```
DataTable           — generic sortable/paginated table (MUI Table wrapper)
ActivityFeedList    — a list of timestamped activity items
NewsFeedList        — a list of news/post preview items
RelatedItemsList    — a list of related content links
ProgressStatsList   — a list of items with a progress bar each
ContactsList        — a list of contacts with avatar + metadata
AvatarRow           — a horizontal group of overlapping avatars
StatusLabel         — inline status badge (replaces MUI Chip for status use cases)
AmortizationTable   — loan amortization schedule table
```

**Why `StatusLabel` and not `StatusChip`?**
MUI already exports `<Chip>` — naming ours `StatusChip` creates ambiguity between "a MUI
Chip with status styles" (which anyone could write inline) and "our component with predefined
colour-to-status mapping." `StatusLabel` states the semantic role clearly and avoids the MUI
component-name collision.

### Chart components (in `/charts` subpath)

Most chart components wrap ApexCharts and carry the `Card` suffix because they render
as standalone card surfaces.

`ChartCardBase` is the shared card-shell primitive for chart cards. Chart-specific card
components (`DonutChartCard`, `AreaLineChartCard`, `RadarChartCard`, etc.) should compose
`ChartCardBase` rather than re-implementing card chrome.

`SparklineBarChart` is the deliberate exception: it is an embedded chart primitive used
inside another card component (typically `StatCard`), so it does not use the `Card` suffix.

```
ChartCardBase        — shared chart card shell (title/subtitle/actions/body/footer slots)
RadialProgressCard     — single radial bar with percentage label
SparklineBarChart      — embedded sparkline bar (no card — used inside StatCard)
DonutChartCard         — donut / pie breakdown card
AreaLineChartCard      — area or multi-line time series card
GroupedBarChartCard    — grouped vertical bar comparison card
HorizontalBarChartCard — horizontal bar ranking card
RadarChartCard         — radar / spider chart card
BudgetVsActualCard     — budget vs actual comparison chart card
ProjectionCard         — forecast / projection area chart card
```

Note: `SparklineBarChart` is the exception — no `Card` suffix because it embeds inside an
existing card (typically `StatCard`). It renders just the chart, no Card wrapper.

### Section components

Full-page sections are named `<Subject>Section`. They receive their data via props and
return a full-width `<section>` element. They compose multiple smaller components but are
not themselves exported as reusable primitives.

```
HeroSection        — scroll-parallax hero with buttons row
FaqSection         — FAQ accordion with section title
PricingSection     — 3-tier pricing cards
ErrorSection       — 404 / 500 error with illustration slot
```

### Motion components (in `/motion` subpath)

Motion components are named by what they DO or what they ARE, without a suffix. They are
structural wrappers that apply animation — not data-display components.

```
MotionContainer       — staggered fade entry for a group of children
MotionViewport        — triggers animation when element enters viewport
AnimatedTabPanel      — tab panel with slide/fade transition
FloatingSubNav        — sticky sub-navigation with scroll-linked active state
FloatingSideNav       — full side navigation with framer-motion transitions
HeroBackground        — parallax hero background layer
FloatingIconCloud     — animated icon cluster
InteractiveHeroLogo   — logo with interactive hover/click animation
```

---

## Naming decision log

Explicit decisions for names that could have been chosen differently. Each row documents the
alternative considered and why the current name was preferred.

| Our name             | Alternative considered         | Decision                     | Reason                                                                        |
| -------------------- | ------------------------------ | ---------------------------- | ----------------------------------------------------------------------------- |
| `AppShell`           | `DashboardLayout`              | Prefer `AppShell`            | `Shell` is a more precise structural term; not tied to a single page type     |
| `AppSidebar`         | `NavMini`, `NavHorizontal`     | Prefer `AppSidebar`          | We encode layout mode as a prop, not as separate components                   |
| `AppTopBar`          | `Header`                       | Prefer `AppTopBar`           | Avoids HTML element conflict; more specific                                   |
| `StatusLabel`        | `StatusChip`                   | Prefer `StatusLabel`         | We add `Status` prefix to signal its semantic role; avoids MUI Chip collision |
| `DataTable`          | `TableData`                    | Prefer `DataTable`           | `DataTable` reads as a noun; `TableData` reads as an adjective                |
| `BalanceSummaryCard` | `BankingBalanceStatistics`     | Shortened                    | More reusable name (works for any balance, not only banking)                  |
| `ActivityFeedList`   | `AppTimeline`, `ActivityNews`  | Prefer `ActivityFeedList`    | `List` suffix signals the structural pattern; `Feed` signals the content type |
| `AvatarRow`          | `AvatarGroup`                  | Prefer `AvatarRow`           | `Row` is consistent with our existing `StatCardRow` pattern                   |

**Generic names shared across many libraries:** `DonutChartCard`, `RadarChartCard`,
`ProgressStatsList` — these are standard domain terms. No naming conflict risk because they
exist on a distinct npm scope (`@alexrebula/giselle-mui`).

---

## What makes a name good (the test)

A good component name in giselle-mui satisfies all four:

1. **Self-describing without reading docs.** A developer who has never used this library
   can read `BalanceSummaryCard` and know what it renders.
2. **Consistent with the suffix rules above.** No inventing new suffixes per-component.
3. **Unique within the package.** No two components can produce the same folder name.
4. **Portable.** The name makes sense outside the context of any specific project
   (portfolio, dashboard, task tracker). No names that embed project-specific concepts
   like `ZigaTaskBadge` or `AlexEarningsCard`.
