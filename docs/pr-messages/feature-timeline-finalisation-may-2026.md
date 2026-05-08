# PR: `feature/giselle-mui-career-timeline-finalisation`

> **Branch:** `feature/giselle-mui-career-timeline-finalisation` → `main`
> **Date:** 8 May 2026
> **Author:** Alex Rebula

---

## What this PR delivers

This is the largest single PR in the library's history. It ships six new components, a
complete cleanup and quality infrastructure overhaul, and a step-change in developer
tooling for maintainers of this library.

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

All 825+ tests pass. Key new suites:

- `accordion.test.ts` — render, ARIA, checklist mode, interaction
- `check-icon-button.test.ts` — custom icon mode, WCAG
- `marker-row.test.ts` — column placement, responsive regression
- `timeline-two-column.column-placement.test.ts` — structural invariants
- `timeline-dot.test.ts` — pulse ring, done-dot color enforcement regression
- `phase-card.test.ts` — corner badge positioning, eye button WCAG regression
- `milestone-badge.test.ts` — eye button WCAG, column alignment regression
- `compact.test.ts` + `compact.styles.test.ts` — TimelineCompact component + styles
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
- [ ] `yalc push` + `first-branch` validated (pending — `Accordion` cleanup in progress in parallel session)
- [ ] SonarQube: zero violations on all changed component files (pending)
