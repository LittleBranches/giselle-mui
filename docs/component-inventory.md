---
sidebar_position: 4
sidebar_label: 'Component Inventory'
---

# @alexrebula/giselle-mui — Complete Component Inventory

> Master inventory across all planning docs. Single source of truth for "what exists, what is planned, and what phase it belongs to."
>
> _Last updated: 14 May 2026_
>
> **Source docs:** `roadmap.mdx`, `standalone-gap-analysis.md`, `components/dashboard-components-plan.md`, `components/home-components-extraction-plan.md`, `components/settings/settings-provider-plan.md`, `components/trip-planner-components-plan.md`, `alexrebula/docs/todo/giselle-mui.md`

---

## Currently shipped ✅

| Component / Export                                                                 | Location                                | Subpath       | Phase | Notes                                                              |
| ---------------------------------------------------------------------------------- | --------------------------------------- | ------------- | ----- | ------------------------------------------------------------------ |
| `GiselleIcon`                                                                      | `icon/giselle/`                         | main          | —     | Offline Iconify wrapper                                            |
| `createIconRegistrar`                                                              | `utils/`                                | main          | —     | Icon set registration utility                                      |
| `MetricCard` + `MetricCardDecoration`                                              | `card/metric/`                          | main          | —     |                                                                    |
| `QuoteCard`                                                                        | `card/quote/`                           | main          | —     |                                                                    |
| `SelectableCard`                                                                   | `card/selectable/`                      | main          | —     |                                                                    |
| `IconActionBar`                                                                    | `action-bar/icon/`                      | main          | —     |                                                                    |
| `TimelineTwoColumn`                                                                | `timeline/two-column/`                  | main          | —     | Full two-column phase/milestone timeline                           |
| `MilestoneBadge`, `PhaseCard`, `TimelineDot`                                       | `timeline/two-column/`                  | main          | —     | Sub-components of `TimelineTwoColumn`; independently exported      |
| `StatCard`                                                                         | `card/stat/`                            | main          | E     | Shipped 5 May 2026                                                 |
| `RadialProgressCard`                                                               | `chart/radial-progress/`                | `/charts`     | E     | Shipped 5 May 2026; exported from `/charts` subpath                |
| `TimelineCompact` + `TaskDetailsRenderer`, `resolveCompactColor`                   | `timeline/compact/`                     | main          | E     | Shipped 7 May 2026; 29 tests (15 component + 14 styles), 4 stories |
| `FloatingSubNav`                                                                   | `nav/floating-sub-nav/`                 | main          | —     | Should move to `/motion` in Phase H                                |
| `TwoColumnShowcaseRow`                                                             | `layout/two-column-showcase-row/`       | main          | E     |                                                                    |
| `SectionContainer`                                                                 | `layout/section-container/`             | main          | E     | `Container` + vertical padding + optional title/subtitle slot      |
| `SectionTitle` + `SectionCaption`                                                  | `layout/section-title/`                 | main          | E     | Static base; animated `/motion` variants are Phase I               |
| `channelAlpha`, `hexToChannel`, `pxToRem`, `remToPx`                               | `utils/theme-utils.ts`                  | main + /utils | A     | Shipped 4 May 2026                                                 |
| `giselleTheme`, `giselleThemeOptions`, palette constants                           | `utils/theme-preset.ts`                 | main + /utils | B     | Shipped 5 May 2026                                                 |
| `GiselleThemeProvider`                                                             | `components/theme-provider/`            | main          | C     | Shipped 13 May 2026                                                |
| `GiselleSettingsProvider`, `GiselleThemeAndSettingsProvider`, `useGiselleSettings` | `components/settings-provider/`         | main          | D     | Shipped 14 May 2026                                                |
| `useLocalStorage`, `isDeepEqual`, `getCookieValue`, `setCookieValue`               | `utils/`                                | main          | D     | Shipped 14 May 2026                                                |
| `resolveMaturityColor`, `resolveMaturityLabel`                                     | `utils/maturity-utils.ts`               | main + /utils | —     | Palette-key resolution helpers                                     |
| `assignMilestoneSidesByDone`                                                       | `utils/timeline-utils.ts`               | main + /utils | —     | Timeline data utility                                              |
| `useNestedChecklist`                                                               | `utils/use-nested-checklist.ts`         | main          | —     | Checklist state hook                                               |
| `Accordion`                                                                        | `components/accordion/`                 | main          | E     | Shipped 13 May 2026                                                |
| `ToggleIconButton`                                                                 | `components/inputs/button/toggle/icon/` | main          | E     | Shipped 13 May 2026; replaces deprecated `CheckIconButton`         |
| `TaskList`                                                                         | `components/timeline/task-list/`        | main          | E     | Shipped 13 May 2026                                                |
| `StatCardRow`                                                                      | `components/card/stat-row/`             | main          | H     | Shipped 13 May 2026                                                |
| `FaqSection` (`FaqAccordion` deprecated alias)                                     | `components/faq/accordion/`             | `/motion`     | E     | Shipped 13 May 2026                                                |

**Shipped count: ~40 named exports across main bundle, `/charts`, `/motion`, and `/utils` subpaths**

---

## Quality status — shipped components

> **Terminology note:** "Best practices" score maps to a set of 13 requirements tracked in private planning docs. The label used here is intentionally generic — this inventory is part of a public open-source package.
>
> Scores reflect the date of the last cleanup audit. Re-run SonarQube and update after any significant change.

| Component                                                            | DoD   | Best practices | Last audited |
| -------------------------------------------------------------------- | ----- | -------------- | ------------ |
| `Accordion`                                                          | 20/20 | 13/13          | 13 May 2026  |
| `TimelineTwoColumn` (+ `PhaseCard`, `TimelineDot`, `MilestoneBadge`) | 20/20 | 13/13          | 13 May 2026  |
| `GiselleIcon`                                                        | 20/20 | 13/13          | 13 May 2026  |
| `MetricCard` + `MetricCardDecoration`                                | 20/20 | 13/13          | 13 May 2026  |
| `SelectableCard`                                                     | 20/20 | 13/13          | 13 May 2026  |
| `QuoteCard`                                                          | 20/20 | 13/13          | 13 May 2026  |
| `StatCard`                                                           | 20/20 | 13/13          | 13 May 2026  |
| `RadialProgressCard`                                                 | 20/20 | 13/13          | 13 May 2026  |
| `TimelineCompact`                                                    | 20/20 | 13/13          | 13 May 2026  |
| `FloatingSubNav`                                                     | 20/20 | 13/13          | 13 May 2026  |
| `TwoColumnShowcaseRow`                                               | 20/20 | 13/13          | 13 May 2026  |
| `SectionTitle` + `SectionCaption`                                    | 20/20 | 13/13          | 13 May 2026  |
| `SectionContainer`                                                   | 20/20 | 13/13          | 13 May 2026  |
| `IconActionBar`                                                      | 20/20 | 13/13          | 13 May 2026  |
| `TaskList`                                                           | 20/20 | 13/13          | 13 May 2026  |
| `FaqSection`                                                         | 20/20 | 13/13          | 13 May 2026  |
| `GiselleThemeProvider`                                               | ⬜    | ⬜             | —            |
| `GiselleSettingsProvider` + `GiselleThemeAndSettingsProvider`        | ⬜    | ⬜             | —            |
| `ToggleIconButton`                                                   | ⬜    | ⬜             | —            |
| `StatCardRow`                                                        | ⬜    | ⬜             | —            |

**DoD scale:** Scenario B = n/20 items · Scenario A (sub-component) = n/10 items  
**Best practices scale:** 13 items — see `docs/components/cleanup-workflow.md` Step 14 for the rubric

---

## Phase C — `GiselleThemeProvider` ✅ Done — 13 May 2026

| Component                                                                                                                                                      | Status |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `GiselleThemeProvider` — wraps MUI `ThemeProvider`, ships Giselle palette as default. Accepts `themeOverrides` for partial overrides, `theme` for full bypass. | ✅     |

---

## Phase D — `GiselleSettingsProvider` ✅ Done — 14 May 2026

> Full spec: [`components/settings/settings-provider-plan.md`](./components/settings/settings-provider-plan.md)

| Component / Export                                                                           | Status | Notes                                                         |
| -------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| `GiselleSettingsProvider<T>` — settings context with localStorage / cookie / custom adapters | ✅     | Generic over state shape — consumer defines own settings type |
| `useLocalStorage<T>` utility                                                                 | ✅     | Internal dep, also exported for consumers                     |
| `detectGiselleSettings()` — SSR-safe cookie read helper for Next.js App Router               | ⬜     | Not yet implemented; tracked as Phase D follow-up             |
| `GiselleThemeAndSettingsProvider` — convenience wrapper combining both providers             | ✅     |                                                               |

---

## Phase E — Standalone UI primitives

> Phase E is **partially done** (7 components shipped). Remaining: `HeroSection`, `OptionWithBlurb`, `SectionPendingLoader`, `FloatingControlBar`.

| Component              | Source                              | Status                 | Blocker                                           |
| ---------------------- | ----------------------------------- | ---------------------- | ------------------------------------------------- |
| `StatCard`             | Written from scratch                | ✅ Shipped 5 May 2026  | —                                                 |
| `RadialProgressCard`   | Written from scratch                | ✅ Shipped 5 May 2026  | —                                                 |
| `TimelineCompact`      | Written from scratch                | ✅ Shipped 7 May 2026  | —                                                 |
| `SectionContainer`     | Written from scratch                | ✅ Shipped             | —                                                 |
| `TwoColumnShowcaseRow` | alexrebula                          | ✅ Shipped             | —                                                 |
| `HeroSection`          | Write from scratch                  | ⬜                     | None                                              |
| `FaqSection`           | Write from scratch                  | ✅ Shipped 13 May 2026 | Renamed from `FaqAccordion`; in `/motion` subpath |
| `OptionWithBlurb`      | alexrebula (tiny, ready to extract) | ⬜                     | None                                              |
| `SectionPendingLoader` | alexrebula                          | ⬜                     | Replace `Iconify` → `GiselleIcon`                 |
| `FloatingControlBar`   | alexrebula                          | ⬜                     | Replace `Iconify` → `GiselleIcon`                 |

---

## Phase F — `DetailsDrawer`

| Component                                                                                                                 | Status |
| ------------------------------------------------------------------------------------------------------------------------- | ------ |
| `DetailsDrawer` — slide-in detail panel: shell only, content via slot. Responsive width, backdrop, header + footer slots. | ⬜     |

---

## Phase G — `TimelineItemDetails`

| Component                                                                                       | Status | Blocker |
| ----------------------------------------------------------------------------------------------- | ------ | ------- |
| `TimelineItemDetails` — read/edit panel for any timeline item. Rendered inside `DetailsDrawer`. | ⬜     | Phase F |

---

## Phase H — Dashboard component suite

> Full spec: [`components/dashboard-components-plan.md`](./components/dashboard-components-plan.md)

### Architecture prerequisites

| Task                                               | Status                                    |
| -------------------------------------------------- | ----------------------------------------- |
| Configure `/charts` subpath in tsup + package.json | ✅ Wired (placeholder barrel, 7 May 2026) |
| Configure `/motion` subpath in tsup + package.json | ✅ Wired (placeholder barrel, 7 May 2026) |

### Group 1 — Stat / metric cards (main bundle)

| Component                                                                 | Status |
| ------------------------------------------------------------------------- | ------ |
| `StatCardRow` — responsive `Grid2` of `StatCard` items                    | ✅     |
| `BalanceSummaryCard` — large financial overview card with sparkline slot  | 🔴     |
| `CreditCardDisplay` — presentational masked card number / holder / expiry | 🔴     |

### Group 2 — Chart cards (`/charts` subpath, ApexCharts peer dep)

| Component                                                                                        | Status |
| ------------------------------------------------------------------------------------------------ | ------ |
| `SparklineBar` — tiny bar or area chart for embedding inside `StatCard`                          | 🔴     |
| `DonutChartCard` — donut/pie chart with legend in a card shell                                   | 🔴     |
| `AreaLineChartCard` — area or line chart, 1–2 series, year selector                              | 🔴     |
| `BudgetVsActualChartCard` — planned vs actual spend with variance fill (error/success area fill) | 🔴     |
| `GroupedBarChartCard` — grouped or stacked bar chart                                             | 🔴     |
| `HorizontalBarChartCard` — horizontal progress-bar style chart                                   | 🔴     |
| `RadarChartCard` — radar / spider chart                                                          | 🔴     |
| `ProjectionChartCard` — dual-series cost vs projected return, break-even annotation              | 🔴     |

### Group 3 — Data lists and tables (main bundle)

| Component                                                                               | Status |
| --------------------------------------------------------------------------------------- | ------ |
| `DataTable` — styled MUI `Table` (not DataGrid), optional per-row action menu           | 🔴     |
| `ActivityFeedList` — avatar + primary/secondary text + timestamp + optional status chip | 🔴     |
| `NewsFeedList` — thumbnail + title + snippet + relative time                            | 🔴     |
| `RelatedItemsList` — tabbed list, each item has 3 stat numbers                          | 🔴     |

### Group 4 — Financial / action widgets (main bundle)

| Component                                                                         | Status |
| --------------------------------------------------------------------------------- | ------ |
| `ProgressStatsList` — labeled `LinearProgress` rows (label + amount + percentage) | 🔴     |
| `QuickTransferWidget` — avatar row + amount input + confirm button                | 🔴     |
| `ContactsList` — compact avatar + email list, optional action icons               | 🔴     |
| `BudgetBreakdownCard` — named budget, breakdown rows, optional donut chart slot   | 🔴     |

### Group 5 — Hero / marketing cards (main bundle)

| Component                                                                             | Status | Blocker                                                            |
| ------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------ |
| `HeroBannerCard` — gradient card with headline, subtitle, CTA slot, illustration slot | 🔴     | Phase C (gradient needs `theme.vars.palette.*` — no hardcoded hex) |
| `FeaturedItemCard` — image-topped card with badge label, title, description, CTA      | 🔴     | None                                                               |
| `PromoInviteCard` — accent card with incentive headline, email input, submit button   | 🔴     | None                                                               |

### Group 6 — Motion components (`/motion` subpath, framer-motion peer dep)

| Component                                                                      | Status | Notes                                                                             |
| ------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------- |
| `FloatingSubNav` — move from main bundle → `/motion`                           | 🟡     | Breaking change for current consumers; needs re-export shim or minor version bump |
| `AnimatedTabPanel` — wraps children in `motion.div` with enter/exit animations | 🔴     |                                                                                   |

### Group 7 — Investment analytics / projection widgets (main bundle)

| Component                                                                                                     | Status |
| ------------------------------------------------------------------------------------------------------------- | ------ |
| `CostClassificationCard` — categorised cost breakdown (CAPEX / OpEx / Investment / Opportunity)               | 🔴     |
| `ROIComparisonCard` — material vs non-material return rows side-by-side, optional chart slot                  | 🔴     |
| `ScenarioComparisonWidget` — interactive variables (`toggle` / `range` / `select`) → computed outcome metrics | 🔴     |
| `AmortizationScheduleTable` — CAPEX amortized over periods (month/quarter), optional chart slot               | 🔴     |

---

## Home components extraction plan (`/motion` subpath)

> Full spec: [`components/home-components-extraction-plan.md`](./components/home-components-extraction-plan.md)
>
> All 7 phases go in the `/motion` subpath (`dist/motion.js`). `framer-motion` is already wired as an optional peer dep.

| Phase | Component / Export                                                                                                    | Status | Blocker                                                                  |
| ----- | --------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------ |
| 1     | `fadeVariants`, `scaleVariants`, `zoomVariants` — motion variant factory utilities                                    | ⬜     | None (start in parallel with anything)                                   |
| 2     | `SectionTitle` + `SectionCaption` — **animated `/motion` variants** (static base shipped in Phase E)                  | ⬜     | Phase 1 (`fadeVariants`)                                                 |
| 3     | `FloatingSideNav` — vertically stacked left-side pill nav (distinct from `FloatingSubNav`)                            | ⬜     | Phase 1 (`fadeVariants`)                                                 |
| 4     | SVG animation primitives — `FloatLine`, `FloatTriangle`, `FloatDot`, `CircleDot`, `PlusSign` (internal, not exported) | ⬜     | Phase 1                                                                  |
| 5     | `HeroBackground` — radial gradient backdrop + animated SVG grid layer                                                 | ⬜     | Phases 1, 4                                                              |
| 6     | `FloatingIconCloud` — floating icon images with seeded pseudo-random positioning                                      | ⬜     | None                                                                     |
| 7     | `InteractiveHeroLogo` — the most valuable single component in this plan                                               | ⬜     | Move `useImagePreloader` from alexrebula utils → giselle-mui utils first |

---

## Phase I — Period Breakdown component suite (Trip Planner)

> Full spec: [`components/trip-planner-components-plan.md`](./components/trip-planner-components-plan.md)
>
> All motion components go in the `/motion` subpath. Atomic building blocks and period cards go in the main bundle.

### Architecture prerequisites

| Task                                                   | Status |
| ------------------------------------------------------ | ------ |
| Types file: `src/components/period-breakdown/types.ts` | ⬜     |
| `/motion` subpath entry point wired                    | ✅     |

### Group A — Atomic building blocks (main bundle)

| Component                                                                             | Status |
| ------------------------------------------------------------------------------------- | ------ |
| `ExpenseLineItem` — single expense row: icon + label + amount + optional note         | 🔴     |
| `ExpenseCategoryGroup` — collapsible group: category chip + list of `ExpenseLineItem` | 🔴     |

### Group B — Period cards (main bundle)

| Component                                                                             | Status |
| ------------------------------------------------------------------------------------- | ------ |
| `PeriodSummaryCard` — summary card for one period: title + total + progress bar + CTA | 🔴     |

### Group C — Motion components (`/motion` subpath)

| Component                                                                                     | Status |
| --------------------------------------------------------------------------------------------- | ------ |
| `PeriodDetailSheet` — slide-in detail sheet for a single period (framer-motion)               | 🔴     |
| `HorizontalScrollRail` — smooth horizontal carousel rail (framer-motion drag)                 | 🔴     |
| `ExpandingPeriodStrip` — compact strip that expands on click (framer-motion layout animation) | 🔴     |
| `BudgetSummaryDrawer` — bottom/side drawer with totals + category breakdown (framer-motion)   | 🔴     |

### Group D — View containers (`/motion` subpath)

| Component                                                                                     | Status |
| --------------------------------------------------------------------------------------------- | ------ |
| `BreakdownCarouselView` — horizontal carousel of `PeriodSummaryCard` + `PeriodDetailSheet`    | 🔴     |
| `BreakdownExpandingView` — expanding strip view using `ExpandingPeriodStrip`                  | 🔴     |
| `BreakdownStackedView` — vertical stacked accordion view (MUI `Accordion`)                    | 🔴     |
| `WeeklyBreakdownPage` — top-level page: view switcher + selected view + `BudgetSummaryDrawer` | 🔴     |

---

## Quality bar / npm publish blockers

> These are not new components — they are fixes to already-shipped components. All must be ✅ before Route B (npm publish).

### `TimelineTwoColumn` — branch finalization (`feature/giselle-mui-career-timeline-finalisation`)

#### `TimelineDot` fixes

| Item                                                                                                                                                                               | Status |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Fix pulse ring absent — `inset: -5` (unitless, invalid CSS) → `inset: '-5px'` in `timeline-dot.tsx` (`::after` sx)                                                                 | ⬜     |
| Fix pulse ring colour mismatch — active dot ring must match `PhaseCard`'s "Now" badge colour (warning/yellow). Verify `effectiveColor` resolves correctly once ring is visible     | ⬜     |
| Fix focus ring rectangular — replace `outline: '2px solid'` + `outlineOffset` with `outline: 'none'` + `box-shadow: '0 0 0 3px ...'` so ring follows `border-radius: 50%`          | ⬜     |
| Fix checklist mode icon state — clicking dot to mark done/undone must visually change the icon (muted/greyed when done, restored when undone); dot ring/background already changes | ⬜     |
| Increase phase dot size for visual hierarchy — `size='phase'` must be visibly larger than `size='milestone'`; active state must NOT change the size (ring communicates active)     | ⬜     |
| Regression test: `timeline-dot.styles.test.ts` — `::after` inset value is a string with a CSS unit (guard against bare number regression)                                          | ⬜     |
| Regression test: phase dot size constant > milestone dot size constant                                                                                                             | ⬜     |

#### `SpineConnector` / layout fixes

| Item                                                                                                                                                                                      | Status |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Fix milestone dots missing spine connector — every dot (phase and milestone) must have a vertical line segment above and below it; currently milestone dots float with no connecting line | ⬜     |
| Fix card spacing breaks spine line — increasing `PhaseCard` gap breaks `SpineConnector` into segments; spine must remain continuous regardless of card height                             | ⬜     |
| Fix year label breathing room — year label must sit in the inter-card gap with clear space above and below (tied to spacing fix above)                                                    | ⬜     |

#### `PhaseCard` visual fixes

| Item                                                                                                                                                          | Status |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Fix card hover elevation too low — shadow delta on hover is barely perceptible; increase it; expanded card retains hover-level elevation (does not snap back) | ⬜     |
| Fix expanded card sibling blur — blur must not apply to the expanded card itself; expanded card holds hover elevation; blur applies to siblings only          | ⬜     |
| WCAG: expanded bullet text — assess `text.secondary` at body size against paper background; fix if below AA (4.5:1)                                           | ⬜     |

#### Storybook

| Item                                                                                                                                                                                      | Status |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Write `PhaseCard.stories.tsx` — three variants side-by-side (standard right / grey left / highlighted), all three status badges (active / overdue / scenario), with and without `details` | ⬜     |

### All shipped components

#### Code quality

| Item                                                                                                                                         | Status |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Fix `timeline-two-column.tsx:436` — `<Box onClick={stopCardPropagation}>` → `<div>`                                                          | ⬜     |
| Fix 4 `<Box key={width}>` in Responsive stories (MetricCard, QuoteCard, SelectableCard, TimelineTwoColumn) → `<div>`                         | ⬜     |
| Memoization audit — check every event handler passed as prop and every derived value; wrap in `useCallback`/`useMemo` as needed; not yet run | ⬜     |
| SonarQube zero-violations audit — `GiselleIcon`, `MetricCard`, `QuoteCard`, `SelectableCard`                                                 | ⬜     |
| SonarQube zero-violations audit — `TimelineTwoColumn`, `PhaseCard`, `MilestoneBadge`, `TimelineDot`                                          | ⬜     |
| SonarQube zero-violations audit — `createIconRegistrar`                                                                                      | ⬜     |

#### JSDoc

| Item                                                                                    | Status |
| --------------------------------------------------------------------------------------- | ------ |
| JSDoc on `MetricCardColor`, `MetricCardProps`, `MetricCardDecorationProps` own props    | ⬜     |
| JSDoc on `QuoteCardProps`, `SelectableCardProps` own props                              | ⬜     |
| JSDoc on `MilestoneBadgeProps`, `PhaseCardProps`, `TimelineDotComponentProps` own props | ⬜     |

#### Quality gate expansion

| Item                                                                                                                                                    | Status |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Add bare-`<Box>` grep to `npm run check:verify` gate                                                                                                    | ⬜     |
| Storybook component readiness gate — CI step that fails if any export in `src/index.ts` is missing at least one story file, one test file, and a README | ⬜     |
| Document SonarQube workflow in `giselle-mui/docs/local-development.md` — what it checks, how to run it, what the cognitive complexity limit is          | ⬜     |
| GitHub Actions CI wired (`.github/workflows/ci.yml`)                                                                                                    | ⬜     |

#### Release

| Item                                                   | Status |
| ------------------------------------------------------ | ------ |
| Storybook deployed to public URL (Chromatic or Vercel) | ⬜     |
| `CHANGELOG.md` first version entry                     | ⬜     |
| `package.json` version bumped to `0.1.0`               | ⬜     |

#### Deferred (post-launch)

| Item                                                                                                                                                                    | Status |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Extract `CardStatusBadge` — "Now" pulsing badge + "Overdue" chip + scenario label from `PhaseCard`; deferred until proprietary identifier cleanup is confirmed complete | ⬜     |

---

## Summary counts

| Category                                  | Count                                                             |
| ----------------------------------------- | ----------------------------------------------------------------- |
| ✅ Shipped (components + utilities)       | ~36 exports (see shipped table above)                             |
| Phase C — `GiselleThemeProvider`          | ✅ Done                                                           |
| Phase D — Settings provider + utilities   | ✅ Done                                                           |
| Phase E — UI primitives (remaining)       | 4                                                                 |
| Phase F + G — Drawer + Details            | 2                                                                 |
| Phase H — Dashboard suite (remaining)     | 23                                                                |
| Phase I — Period Breakdown (Trip Planner) | 11                                                                |
| Home components extraction — `/motion`    | 6 components + 3 motion factories (Phase I-2 static base shipped) |
| **Total not yet built**                   | **~47**                                                           |

---

## Blocker key

| Symbol | Meaning                                                                  |
| ------ | ------------------------------------------------------------------------ |
| ✅     | Shipped and in production                                                |
| 🟡     | Exists somewhere but needs cleanup / refactor before merge               |
| 🔴     | Does not exist — must be written from scratch                            |
| ⬜     | Planned but not started                                                  |
| ⚙️     | Architecture blocker (theme, settings, or subpath setup must land first) |
| 📦     | Dependency blocker (optional peer dep subpath must be configured first)  |

---

## Related

- [`roadmap.mdx`](./roadmap.mdx) — Phase A → H timeline with milestone detail
- [`standalone-gap-analysis.md`](./standalone-gap-analysis.md) — what a blank Next.js project needs from this library
- [`components/dashboard-components-plan.md`](./components/dashboard-components-plan.md) — full Phase H spec with build-order tiers
- [`components/trip-planner-components-plan.md`](./components/trip-planner-components-plan.md) — Phase I period breakdown / trip planner component suite (11 new components)
- [`components/home-components-extraction-plan.md`](./components/home-components-extraction-plan.md) — home section extraction phases 1–7
- [`components/settings/settings-provider-plan.md`](./components/settings/settings-provider-plan.md) — Phase D full architecture spec
