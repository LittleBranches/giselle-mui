---
sidebar_label: "PR25 - Career timeline finalisation"
---

**[Open](https://github.com/AlexRebula/giselle-mui/pull/25)** — [`feature/giselle-mui-career-timeline-finalisation`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-mui-career-timeline-finalisation) — 6 May 2026


# PR 25 — feature/giselle-theme-preset

This folder contains the message documents for PR 25.


---

## Additional Context: pr-25-docs-cssvars-provider-migration.md

# docs: CssVarsProvider → ThemeProvider migration — remove all deprecated API references

## Summary

Replaces every reference to the deprecated `CssVarsProvider` + `extendTheme()` API across
all documentation, README files, test comments, and the companion `alexrebula` data files.
`CssVarsProvider` was the early experimental approach from MUI v6/v7 pre-release. In MUI v7
stable, `ThemeProvider` was unified to handle CSS variables natively via `createTheme({ cssVariables: true })`.
Storybook was already migrated (see PR `pr-16-feature-phase-warning-popover.md` — May 2026). The
written docs were still teaching the old way.

---

## Why

After Phase B shipped (`giselleTheme` exported 5 May 2026), the JSDoc on `theme-preset.ts`
still showed:

```tsx
import { CssVarsProvider } from '@mui/material/styles';
<CssVarsProvider theme={giselleTheme}>...</CssVarsProvider>;
```

Every consumer reading the docs would have copied a deprecated API. The fix needed to be
complete — partial updates leave the old pattern visible in at least one file, which is
enough to spread the wrong pattern.

**Key fact: `giselleTheme` does not need to change.** `giselleTheme` uses `extendTheme()`,
and `ThemeProvider` in MUI v7 accepts both `createTheme()` and `extendTheme()` results.
The implementation is correct; only the docs were wrong.

---

## What changed

### `src/` — TypeScript and README files

- **`src/utils/theme-preset.ts`** — JSDoc `@example` updated: `CssVarsProvider` → `ThemeProvider`,
  `import { CssVarsProvider }` → `import { ThemeProvider }`.
- **`src/components/icon/giselle/README.md`** — 3 code examples updated: Vite/CRA `main.tsx`,
  Next.js App Router layout, and Pages Router `_app.tsx`. All import `ThemeProvider` and wrap
  with `<ThemeProvider theme={theme}>`.
- **`src/components/chart/radial-progress/README.md`** — 1 inline reference: "MUI v7 with
  `CssVarsProvider` returns the CSS variable reference string" → "with `ThemeProvider` (CSS
  variables mode)".

### Test comments

Five test files had `// ... avoid CssVarsProvider ...` comments. Updated to reference
`ThemeProvider` — which is what Storybook's `preview.tsx` actually uses:

- `src/components/nav/floating-sub-nav/floating-sub-nav.test.ts`
- `src/components/chart/radial-progress/radial-progress-card.test.ts`
- `src/components/layout/section-title/section-title.test.ts`
- `src/components/card/quote/quote-card.test.ts`
- `src/components/card/metric/metric-card.test.ts`

### `docs/` — theming guides

- **`docs/theming/README.md`** — 1 line: "injected by `ThemeProvider` at the root of your app".
- **`docs/theming/react.md`** — full guide rewritten for the unified `ThemeProvider` API:
  - Setup now shows `createTheme({ cssVariables: true })` as the recommended approach.
  - `giselleTheme` presented as an alternative preset (not the only starting point).
  - Dark mode section updated to `ThemeProvider defaultMode=` props.
  - Key differences table: distinguishes v7 unified API from the old experimental approach.
  - Historical note preserved: "Early MUI v7 docs showed `extendTheme()` + `CssVarsProvider`
    — that was the old experimental approach. Do not copy it."
- **`docs/theming/nextjs.md`** — full guide rewritten:
  - App Router layout: `ThemeProvider` import + usage.
  - Pages Router `_app.tsx`: `ThemeProvider`.
  - `giselleTheme` usage section: `<ThemeProvider theme={giselleTheme}>`.
  - All 3 troubleshooting entries reference `ThemeProvider`.

### `docs/` — other docs

- **`docs/components/icon/giselle/iconify-registration.md`** — 3 code examples (App Router,
  Vite/CRA, Pages Router): all `CssVarsProvider` → `ThemeProvider`.
- **`docs/standalone-gap-analysis.md`** — "wire up a MUI `ThemeProvider` manually" (was
  `CssVarsProvider`).
- **`docs/components/settings/settings-provider-plan.md`** — "drives `ThemeProvider` theme
  state" (was `CssVarsProvider`).
- **`docs/incidents/timeline-hover-regression-may-2026.md`** — "requires `ThemeProvider`
  setup not yet in the test harness" (was `CssVarsProvider`).
- **`docs/roadmap.mdx`** — Phase C description, "Current state" import block, implementation
  snippet, and task table row all updated to reference `ThemeProvider`.

### `.github/copilot-instructions.md`

Three occurrences:

1. Test conventions: "ThemeProvider with `cssVariables: true` is required in Storybook".
2. Phase C description: "wraps `ThemeProvider` with the Giselle default palette".
3. Storybook infrastructure: "wraps stories in `ThemeProvider` with `cssVariables: true`".

### `README.md`

`⚠️ ThemeProvider requirement` section: text + code example updated to show
`ThemeProvider` + `createTheme({ cssVariables: true })`.

---

## What was intentionally left unchanged

- **`docs/theming/react.md` line 175** — historical note that explicitly says CssVarsProvider
  was the old approach. This is explanatory context — it must stay.
- **`docs/pr-messages/pr-16/pr-16-feature-phase-warning-popover.md`** — historical PR record documenting
  the original Storybook migration. Accurate as written.
- **`docs/pr-messages/pr-9/pr-9-feature-timeline-two-column.md`** — historical PR record.
- **`alexrebula/docs/roadmap/data.tsx` lines 525, 536** — blog post #34 titles: "Unit testing
  MUI v7 components with Vitest and jsdom (without CssVarsProvider)". The post topic is
  testing _without needing_ the provider — the title is correct and intentional.

---

## Companion alexrebula changes (same commit)

Two milestone description strings in the portfolio data layer were also updated:

- `src/sections-api/roadmap/data.tsx` — Phase B/C milestone description: "wrapping ThemeProvider".
- `src/sections-api/store-readiness/data.tsx` — Phase C milestone description: "wrapping ThemeProvider".
- `docs/roadmap.md` — Phase 1.5 `GiselleThemeProvider` milestone row: wording updated to match.

---

## Dist rebuild

`npm run build` and `yalc push` ran after all source edits. The `dist/*.map` source maps
now embed the corrected JSDoc from `theme-preset.ts`. Both `alexrebula` and `giselle-docs`
received the updated package via yalc.

---

## Additional Context: pr-25-feature-timeline-finalisation-may-2026.md

# PR: `feature/giselle-mui-career-timeline-finalisation`

> **Branch:** `feature/giselle-mui-career-timeline-finalisation` → `main`
> **Date:** 9 May 2026 (updated)
> **Author:** Alex Rebula

---

## What this PR delivers

This is the largest single PR in the library's history. It ships major new timeline
components and utilities, a complete cleanup and quality infrastructure overhaul, and a
step-change in developer tooling for maintainers of this library.

---

## New components

### `Accordion`

A generic, WCAG 2.2 AA-compliant accordion for any collapsible content. Solves two
recurring MUI problems — done-toggle as an independent interactive element (no nested
`<button>` inside `<button>`) and a decorative leading icon slot — correctly and once.

Checklist mode: `<Checkbox>` or `CheckIconButton` before the title, fully independent from
the expand/collapse trigger. Supports custom icon variants for done/hover states.

### `TaskList`

A flat, keyboard-accessible list of done/pending items. Renders without expand/collapse.
Shares the same `done`/`onDoneButtonClick` API as `Accordion` for consistent patterns
across both list and accordion contexts.

### `FaqAccordion` (`/motion` subpath)

Full FAQ section with framer-motion scroll animation, decorative SVGs, and a contact
footer. Lives in the `/motion` subpath — consumers who don't use framer-motion pay zero
bundle cost.

### `TimelineCompact`

Single-column accordion renderer for `TimelinePhase[]`. The mobile companion to
`TimelineTwoColumn`. Swap at xs/sm breakpoints — identical data shape, no data-layer
changes required. 29 Vitest tests (15 component + 14 styles), 4 stories, size-constant
regression tests.

### `useNestedChecklist` hook

Framework-agnostic hook for parent/child done-state sync. A phase is done when all its
milestones are done; marking a phase done cascades to children. Used by both
`TimelineCompact` and `TimelineTwoColumn` accordion rows.

### `TaskDetailsRenderer`

Shared task-details renderer extracted for reuse across compact timeline detail surfaces.
Renders summary text, optional rich details content, and nested task rows from the new
`TaskDetails` shape.

### `MarkerRow` + `MarkerLabel` (internal `two-column` sub-components)

Two new sub-components for the `TimelineTwoColumn` marker phase variant. `MarkerRow`
renders a full-width marker phase row spanning both columns. `MarkerLabel` renders the
label on the correct side with proper alignment and sx factory consolidation.

---

## `TimelineTwoColumn` finalisations

All outstanding polish items resolved:

- **`PhaseCard`** — `CheckIconButton` mode for done-toggle; scenario badge; corner alert
  badge column-side positioning (regression tested); eye button WCAG 2.2 AA (icon ≥20px,
  `aria-pressed`, `aria-label` reflects current state, no `cursor: default` on toggleable)
- **`MilestoneBadge`** — eye button WCAG 2.2 AA; column-side alignment (left column
  right-aligns collapsed text, resets on expand, does not change on hover — regression tested)
- **`TimelineDot`** — pulse ring effect; done-dot green enforcement via
  `resolveEffectiveColor(color, done)` — always `'success'` when done, never overrideable
  by data color or parent grayscale filter (regression tested)
- **`PhaseWarningPopover`** — overdue warning tooltip for phases
- **`MilestoneModal`** — slide-in detail panel with checklist task toggle functionality
- **`PhaseAccordionRow`** — expandable accordion row for `TimelineCompact` integration
- **`TaskDetailsModal` + `TaskDetailsRenderer` integration** — detail modal now delegates
  rendering to a shared renderer component for consistent output and easier reuse
- **`ScenarioBadge`** — scenario/variant label badge for phase cards
- **Marker row styles** — `markerRowInnerSx`, `markerCaptionSx`, `markerDateSpanSx`
  consolidated into the correct `// ── Marker phase row ──` section in `two-column.styles.ts`
- **`timelineColumnSx`**, **`msColumnBoxSx`**, **`markerLabelSlotSx`** — parallel variants
  merged into single factories (eliminates silent divergence under refactoring)
- **Storybook offline icon registration** — Solar icon set registered; stories never
  fetch from `api.iconify.design`
- **Mobile regression tests** — responsive breakpoint assertions for column widths and
  layout overflow

---

## Post-draft updates (9 May 2026)

After the initial draft, this branch received additional timeline and roadmap work:

- **Task details model and rendering**
  - Added `TaskDetails` type and export from the timeline API
  - Added `TaskDetailsRenderer` component and tests
  - Refactored `TaskDetailsModal` and `PhaseAccordionRow` to use shared details rendering
- **Stable keying for timeline data**
  - Added unique keys for milestones and nested tasks in timeline data and mapping helpers
  - Updated `resolveTaskChildren` handling for richer details payloads and key stability
- **Roadmap data restructuring**
  - Reworked roadmap milestones into nested `children` entries with expanded descriptions
    for clearer phase-level documentation

---

## Quality infrastructure (8 May 2026)

This PR establishes the cleanup and quality tracking system that every future component
will use:

### `docs/components/cleanup-workflow.md`

New 14-step playbook for creating or cleaning up any component. Covers Phase 0 (role
determination), Phase 1 (context gathering), and Phase 2 (Steps 1–14 sequential
implementation). Includes full Definitions of Done for both Scenario A (sub-component)
and Scenario B (standalone).

**New Step 14 — Quality status recording:** After every cleanup, record the score in the
component JSDoc (one line: `DoD n/20 · Best practices n/13`) and in the component
`README.md` (full breakdown table). Scores are dated so staleness is visible.

### Session shorthand command

`cleanup component <Name>` — wired into `copilot-instructions.md`. A fresh Copilot
session with zero prior context can execute the full cleanup workflow on any named
component without further instruction.

### Scoped instructions file

`.github/instructions/component-cleanup.instructions.md` (`applyTo: "src/components/**"`)
— VS Code Copilot auto-loads this file whenever any component file is open. Provides the
10-item minimum check and both DoD checklists inline, without requiring the developer to
have read the full playbook.

### DoD checklists inlined in `copilot-instructions.md`

GitHub PR reviewer bot uses `copilot-instructions.md` as its primary signal. Both
Scenario A and Scenario B DoD checklists are now inlined — the reviewer can flag
non-compliant PRs against the checklist without any additional prompt.

### `docs/component-inventory.md` — Quality status table

New `## Quality status` section added to the component inventory. Two columns per
component: `DoD` (n/20) and `Best practices` (n/13), with last-audited date. Backfill
target: all shipped components audited before Phase H begins.

Components scored today:
| Component | DoD | Best practices | Audited |
|---|---|---|---|
| `Accordion` | 19/20 | 12/13 | 8 May 2026 |
| `TimelineTwoColumn` (+ sub-exports) | 18/20 | 12/13 | 8 May 2026 |

---

## Architecture additions

- **`/charts` subpath** — `src/charts-index.ts`, tsup entry, and `package.json` exports
  map wired. Placeholder barrel — Phase H ApexCharts components export from here.
  Consumers who don't import `.../charts` pay zero bundle cost for ApexCharts.
- **`/motion` subpath** — `src/motion-index.ts`, tsup entry, and `package.json` exports
  map wired. `FaqAccordion` exports from here. framer-motion isolated.
- **Dependabot configuration** — `.github/dependabot.yml` added.
- **`prebuild` script** — cleans `dist/` before every build to prevent stale artifact accumulation.

---

## Test coverage

All 843 tests pass (51 test files). Key new suites:

- `accordion.test.ts` — render, ARIA, checklist mode, interaction
- `check-icon-button.test.ts` — custom icon mode, WCAG
- `marker-row.test.ts` — column placement, responsive regression
- `timeline-two-column.column-placement.test.ts` — structural invariants
- `timeline-dot.test.ts` — pulse ring, done-dot color enforcement regression
- `phase-card.test.ts` — corner badge positioning, eye button WCAG regression
- `milestone-badge.test.ts` — eye button WCAG, column alignment regression
- `compact.test.ts` + `compact.styles.test.ts` — TimelineCompact component + styles
- `task-details-renderer.test.ts` — shared details renderer for compact timeline surfaces
- `faq-accordion.test.ts` + `faq-accordion.styles.test.ts` — FaqAccordion

---

## Files changed (summary by area)

| Area                     | Key files                                                                                                                                                                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New components           | `accordion/`, `timeline/task-list/`, `faq/accordion/`, `timeline/compact/`                                                                                                                                                                    |
| Two-column finalisations | `phase-card/`, `milestone-badge/`, `timeline-dot/`, `phase-warning-popover/`, `marker-row.tsx`, `marker-label.tsx`, `two-column.styles.ts`                                                                                                    |
| Architecture             | `src/charts-index.ts`, `src/motion-index.ts`, `tsup.config.ts`, `package.json`                                                                                                                                                                |
| Tooling                  | `docs/components/cleanup-workflow.md`, `.github/copilot-instructions.md`, `.github/instructions/component-cleanup.instructions.md`                                                                                                            |
| Docs                     | `docs/component-inventory.md`, `docs/roadmap.mdx`, `docs/components/dashboard-components-plan.md`, `docs/components/home-components-extraction-plan.md`, `src/components/accordion/README.md`, `src/components/timeline/two-column/README.md` |

---

## Breaking changes

None. All additions are backward-compatible.

---

## Checklist

- [x] `npm run check:verify` exits 0
- [x] `npm run build` exits 0 (all four subpath entries: `index`, `utils`, `charts`, `motion`)
- [x] `yalc push` + consumer validation completed (alexrebula, giselle-docs, first-branch)
- [x] SonarQube: zero violations on cleaned component set

---

## Additional Context: pr-25-review-fix-checklist.md

# PR #25 — Reviewer Fix Checklist (Local Branch Verification)

Date: 9 May 2026
Scope: Verification of Copilot reviewer comments against current local branch code (not GitHub thread status).

## Applied

- [x] Storybook solar icons no longer imported from `@iconify-json` in preview
- [x] Duplicate `src/types/parent-profile.ts` removed
- [x] Task toggle buttons now use `type="button"`
- [x] Task toggle click handlers now call `stopPropagation`
- [x] Unconditional `tabIndex` focusability issue fixed
- [x] Sorted milestone index bug fixed (uses sorted milestone list)
- [x] `taskDoneStates` now derived from resolved `children/details` task list
- [x] Done-style regression tests now call real style factories (`buildPaperSx` / `milestonePaperSx`)
- [x] `deloper-notes` folder typo fixed to `developer-notes`

## Not Applied

- [ ] Domain-specific `PersonProfile` exports removed from root API
- [ ] Root API no longer exports motion/chart-dependent components (`FloatingSubNav` / `RadialProgressCard`)
- [ ] `framer-motion` marked optional in `peerDependenciesMeta`
- [ ] `styled(motion.svg)` updated with explicit `shouldForwardProp`
- [ ] `resolveCornerBadgeAlign` doc text corrected (currently still says "between card and centre spine")
- [ ] Duplicate troubleshooting content deduplicated (`troubleshooting.md` vs `collapsed-state-content-inventory.md`)
- [ ] Ancestor `pointerEvents` suppression reworked so done-card hover-restore can fire
- [ ] ScenarioBadge regression tests switched from mirrored logic to production-render assertions
- [ ] Typography regression tests switched from mirrored helpers to production-path assertions
- [ ] `Task` type/docs aligned with actual toggle API depth support (or API extended for true deep-path toggling)

## Key Files

- `src/index.ts`
- `src/types/person-profile.ts`
- `package.json`
- `src/components/faq/accordion/faq-accordion-svg.tsx`
- `src/components/timeline/two-column/phase-card/utils.ts`
- `src/components/timeline/two-column/two-column.styles.ts`
- `src/components/timeline/two-column/phase-card/phase-card.styles.ts`
- `src/components/timeline/two-column/milestone-badge/milestone-badge.styles.ts`
- `src/components/timeline/two-column/phase-card/index.test.ts`
- `docs/components/timeline/two-column/phase-card/developer-notes/troubleshooting.md`
- `docs/components/timeline/two-column/phase-card/developer-notes/collapsed-state-content-inventory.md`
