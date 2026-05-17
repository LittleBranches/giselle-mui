# Cross-session briefing — `giselle-mui` implementation plan

**Source session:** `https://claude.ai/code/session_011tcDDSDTRkapyrWzjVxdAV`
**Source repo:** `alexrebula/giselle-mui` (public, open-source MUI component library)
**Date:** 17 May 2026

---

## Context

This session is managing the `giselle-mui` open-source library. The `rm` session is planning the `GiselleThemeProvider` which will replace the copyrighted Minimal theme provider in the `alexrebula/rm` Next.js app. **The two plans must be compatible.** This briefing gives the `rm` session full visibility into what `giselle-mui` is planning, so the `GiselleThemeProvider` PR scope and API does not conflict.

---

## Current state of `giselle-mui`

**Merged / landed:**
- PR #53 (`chore/scaffold-component-tree`) — full component folder tree scaffolded, ~70 placeholder files. Ready to merge.
- Branch `claude/review-github-repos-LptP8` — documentation PR (incident report, taxonomy rules). Open as PR #54.

**In progress (branch `feat/component-types`, pushed, not yet PR'd):**
- `docs/components/api-design-rules.md` — full tier system rules document (Tier 1 / 2 / 3 component classification)
- `.github/copilot-instructions.md` — updated with tier rules + correct Storybook folder-mirror title convention
- **48 `types.ts` files filled** — all scaffolded component stubs now have reviewed prop interfaces (see tier breakdown below)

---

## Planned implementation PRs — full roadmap (~12–15 PRs)

| PR | Label | Contents | Subpath | Blocker |
|---|---|---|---|---|
| A | Architecture | `/charts` + `/motion` subpath exports in tsup + package.json; CI story-title guard script (`scripts/check-story-titles.js`) | — | Must land first |
| **B** | **GiselleThemeProvider** | **See below — this is the cross-session PR** | main | None |
| C | Dashboard MUI cards | `StatCardRow`, `ProfileSummaryCard`, `BalanceSummaryCard`, `CreditCardDisplay`, `BudgetBreakdownCard` | main | B (gradient tokens) |
| D | Data lists | `ActivityFeedList`, `NewsFeedList`, `ContactsList`, `ProgressStatsList`, `RelatedItemsList`, `AvatarRow`, `DataTable`, `QuickTransferWidget` | main | None |
| E | Hero + promo cards | `HeroBannerCard`, `FeaturedItemCard`, `PromoInviteCard` | main | B |
| F | Chart base + first charts | `ChartCardBase`, `DonutChartCard`, `AreaLineChartCard` | `/charts` | A |
| G | Remaining chart cards | `GroupedBarChartCard`, `HorizontalBarChartCard`, `ProjectionChartCard`, `BudgetVsActualChartCard`, `RadarChartCard`, `SparklineBar` | `/charts` | A |
| H | Investment analytics | `CostClassificationCard`, `ROIComparisonCard`, `ScenarioComparisonWidget`, `AmortizationScheduleTable` | main | None |
| I | Layout + nav shell | `AppShell`, `AppTopBar`, `AppSidebar`, `PageHeader`, `Breadcrumbs`, `AuthPageLayout`, `DetailsDrawer` | main | None |
| J | Motion utilities + section titles | Motion variant utilities (`fadeVariants` etc.), `SectionTitle`, `SectionCaption` | `/motion` | A |
| K | Home nav + hero components | `FloatingSideNav`, `HeroBackground`, `FloatingIconCloud` | `/motion` | A, J |
| L | `InteractiveHeroLogo` | Flagship animation component — 3-phase hover state machine | `/motion` | A |
| M | Section pages | `ErrorSection`, `PricingSection`, `HeroSection` | main | B |

---

## PR B — `GiselleThemeProvider` — what `giselle-mui` expects

This is the critical cross-session dependency. The `rm` session is designing this in detail. Here is what `giselle-mui` has already committed as the prop interface (in `src/components/theming/theme-provider/giselle/types.ts`):

```ts
export interface GiselleThemeProviderProps {
  children: ReactNode;

  // Partial overrides deep-merged on top of Giselle brand defaults
  themeOverrides?: CssVarsThemeOptions;

  // A fully custom theme — when provided, themeOverrides is ignored
  theme?: CssVarsTheme;

  // @default 'system'
  defaultMode?: 'light' | 'dark' | 'system';
}
```

**What the `rm` session needs to be aware of for PR B:**
- `GiselleThemeProvider` must use `extendTheme()` + `CssVarsProvider` from MUI v7 (CSS variables mode) — **not** `createTheme()` + `ThemeProvider` (the Minimal theme pattern)
- All palette references inside `giselle-mui` components use `theme.vars.palette.*` (CSS variable channel references), not `theme.palette.*` — this is non-negotiable for dark mode support
- The Minimal theme's `componentsProps` pattern is MUI v6 — `giselle-mui` uses `slotProps` (MUI v7+)
- Forbidden words guard: `giselle-mui` has a CI check for forbidden strings. Any code extracted from Minimal must be scrubbed of Minimal-specific identifiers before landing in `giselle-mui`. The `rm` session must not copy Minimal's internal utility function names, theme key names, or config property names verbatim.

---

## Copyright / extraction rules (for `rm` session reference)

These rules govern anything that moves from `rm` (Minimal-derived) → `giselle-mui` (open-source):

1. **No Minimal utility functions** — do not copy `bgGradient()`, `textGradient()`, `alpha()`, or any Minimal theme helper verbatim. Rewrite from scratch using MUI CSS variables primitives.
2. **No Minimal config structure** — `CONFIG.assetsDir`, `CONFIG.site`, etc. must be replaced with explicit props (e.g. `backgroundImageSrc?: string`).
3. **No Minimal component names** — if Minimal has a `SettingsProvider`, the `giselle-mui` equivalent must be named differently (`GiselleSettingsProvider` or `GiselleThemeProvider`).
4. **All palette tokens must use `theme.vars.palette.*`** — never `#hex` literals, never `rgba()`, never `theme.palette.*` (non-variable form).
5. **`channelAlpha` helper** — `giselle-mui` has its own `channelAlpha(mainChannel, 0.08)` util in `src/utils/theme-utils.ts` for alpha tinting. Use this instead of Minimal's alpha helper.

---

## API design rules (tier system) — brief for `rm` session

Every component in `giselle-mui` is tiered before props are designed:

| Tier | Rule |
|---|---|
| **1 — Pure extension** | Extends MUI base, adds zero new props. Convention enforcement only. |
| **2 — Selective extension** | Extends MUI base, adds only genuinely new props (ReactNode slots, narrowed `color` type). JSDoc only on own props. |
| **3 — Composition** | Data-driven (`items: Item[]`). Does not extend a specific MUI base. Item type is the real API. |

`GiselleThemeProvider` is a **Tier 2** component: it wraps MUI `CssVarsProvider` and adds `themeOverrides` + `defaultMode`. No re-declaration of MUI props.

Full rules: `docs/components/api-design-rules.md` in `giselle-mui`.

---

## Key files the `rm` session should know about

| File | What it contains |
|---|---|
| `src/components/theming/theme-provider/giselle/types.ts` | Already-committed prop interface for `GiselleThemeProvider` |
| `docs/components/api-design-rules.md` | Full tier system + JSDoc rules + `cardBaseSx` pattern |
| `.github/copilot-instructions.md` | Condensed rules for any AI model working in this repo |
| `docs/components/dashboard-components-plan.md` | Full API specs for all dashboard components |
| `docs/components/home-components-extraction-plan.md` | Full extraction plan for motion/home components |

---

*End of briefing. Source session: `https://claude.ai/code/session_011tcDDSDTRkapyrWzjVxdAV`*
