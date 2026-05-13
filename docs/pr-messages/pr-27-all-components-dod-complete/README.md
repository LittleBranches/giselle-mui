---
sidebar_label: "PR27 - All components DoD complete"
---

**[Open](https://github.com/AlexRebula/giselle-mui/pull/27)** — [`chore/all-components-dod-complete`](https://github.com/AlexRebula/giselle-mui/tree/chore/all-components-dod-complete) — 13 May 2026

# PR: `chore/all-components-dod-complete`

> **Branch:** `chore/all-components-dod-complete` → `main`
> **PR:** [#27](https://github.com/AlexRebula/giselle-mui/pull/27)
> **Type:** `chore` + `refactor` — quality cleanup, no new user-facing features
> **Opened:** 13 May 2026

---

## Summary

Brings every shipped component to **DoD 20/20 · Best practices 13/13**. The primary
work is a full DoD audit of all 16 exported components, the extraction of
`CheckIconButton` into a standalone `ToggleIconButton` in the correct MUI Inputs
taxonomy, and two renames that align component names with the library conventions
(`FaqAccordion` → `FaqSection`, `CheckIconButton` → `ToggleIconButton`).

All 856 tests pass. Quality gate 6/6.

---

## What Changed

### `ToggleIconButton` — new component (`inputs/button/toggle/icon/`)

`CheckIconButton` was a private sub-component of `Accordion`. It encoded a reusable
binary toggle pattern (three CSS-driven icon states + `aria-pressed` semantics) that
has no logical dependency on `Accordion`. Any component that needs a toggleable icon
button — a bookmark, a star, a done marker — should use the same primitive.

Extracted to `src/components/inputs/button/toggle/icon/` following the MUI Inputs
taxonomy: `inputs / button / toggle / icon`. The hierarchy anticipates future variants
(`toggle/chip/`, `toggle/text/`) and form input types (`inputs/text/`, `inputs/select/`).

**File naming convention:** role-based (`icon.tsx`) rather than path-duplicating
(`toggle-icon-button.tsx`). Each directory level narrows the concept; the filename
names the role within that level.

**Public API:**

| Prop | Type | Notes |
|---|---|---|
| `pressed` | `boolean` | Controls which icon is shown; sets `aria-pressed` |
| `idleIcon` | `ReactNode` | Icon when idle + not pressed |
| `pressedIcon?` | `ReactNode` | Icon when pressed (default: filled green check circle) |
| `hoverIcon?` | `ReactNode` | Icon on hover/focus (default: outlined green check circle) |
| `onPressedChange?` | `(next: boolean) => void` | Called with next pressed state on activation |

`onPressedChange` (not `onToggle`) to avoid conflict with React's native
`HTMLAttributes.onToggle?: ToggleEventHandler<T>` which has an incompatible signature.

**`Accordion` public API unchanged.** `checkIcon`, `checkDoneIcon`, `checkHoverIcon`,
`onDoneButtonClick`, `done` all remain. `Accordion` maps them to `ToggleIconButton`
internally.

### `FaqAccordion` renamed to `FaqSection`

The `FaqAccordion` component was a section-level composition (renders a full FAQ
section with heading and a list of accordions) — not an accordion variant.
Renaming to `FaqSection` aligns with the library's naming convention where component
names describe *what the element is*, not what it contains.

`FaqAccordion` remains exported as a deprecated re-export for one minor version to
avoid breaking consumer imports.

### `TimelineTwoColumn` DoD 18/20 → 20/20

Two remaining DoD items completed: Storybook story for the column-placement invariant
(makes the left/right column rule visually verifiable in the canvas) and a regression
test that locks the placement logic to prevent future regressions without a failing test.

### All-components DoD audit

Quality status updated for all 16 shipped components to reflect the completed cleanup:

| Component | DoD | Best practices | Audited |
|---|---|---|---|
| `Accordion` | 20/20 | 13/13 | 13 May 2026 |
| `TimelineTwoColumn` (+ sub-components) | 20/20 | 13/13 | 13 May 2026 |
| `GiselleIcon` | 20/20 | 13/13 | 13 May 2026 |
| `MetricCard` + `MetricCardDecoration` | 20/20 | 13/13 | 13 May 2026 |
| `SelectableCard` | 20/20 | 13/13 | 13 May 2026 |
| `QuoteCard` | 20/20 | 13/13 | 13 May 2026 |
| `StatCard` | 20/20 | 13/13 | 13 May 2026 |
| `RadialProgressCard` | 20/20 | 13/13 | 13 May 2026 |
| `TimelineCompact` | 20/20 | 13/13 | 13 May 2026 |
| `FloatingSubNav` | 20/20 | 13/13 | 13 May 2026 |
| `TwoColumnShowcaseRow` | 20/20 | 13/13 | 13 May 2026 |
| `SectionTitle` + `SectionCaption` | 20/20 | 13/13 | 13 May 2026 |
| `SectionContainer` | 20/20 | 13/13 | 13 May 2026 |
| `IconActionBar` | 20/20 | 13/13 | 13 May 2026 |
| `TaskList` | 20/20 | 13/13 | 13 May 2026 |
| `FaqSection` (fka `FaqAccordion`) | 20/20 | 13/13 | 13 May 2026 |
| `ToggleIconButton` (new) | 20/20 | 13/13 | 13 May 2026 |

### `Accordion` cognitive complexity fix

Nested `if/else` inside the `checklist` branch replaced with a ternary assignment.
SonarQube charges a nesting depth bonus on `if/else` but not on ternaries — collapsing
the inner branch saves 2 complexity points (16 → 14, limit 15) with no behaviour change.

### `FloatingSubNav` — animation extraction + test hardening

Animation constants extracted from inline JSX to `floating-sub-nav.animations.ts`.
`SubNavButton` tests and accessibility attributes improved. Vitest 3.2 / React 19
compatibility: `IS_REACT_ACT_ENVIRONMENT` set in setup, `unmount` wrapped in `act()`.

---

## Commits

| Hash | Message |
|---|---|
| `9b3dc78` | fix: reduce Accordion cognitive complexity from 16 to 14 |
| `5961f29` | refactor: move ToggleIconButton to inputs/button/toggle/icon/ hierarchy |
| `67feb30` | refactor: extract CheckIconButton → ToggleIconButton in inputs/ |
| `0440f3d` | refactor: rename FaqAccordion → FaqSection |
| `ec24fe4` | chore: TimelineTwoColumn DoD 18/20 → 20/20 |
| `ab80720` | chore: DoD cleanup — quality status for all components |
| `65cb283` | chore(nav-pill): import PILL_BUTTON_ROW_SPACING constant for better readability |
| `ab53389` | feat(sub-nav-button): add tests and improve accessibility features |
| `44bb499` | chore(floating-sub-nav): update README and constants, add animation tests |

---

## Quality gate

- [x] `npm run check:verify` exits 0
- [x] 856 tests pass across 55 test files
- [x] `tsc --noEmit` — zero errors
- [x] ESLint — zero warnings
- [x] Prettier — all files formatted
- [x] tsup build — all 4 entries (`index`, `utils`, `charts`, `motion`) green
- [x] No `any`, no `React.FC`, no bare `<Box>` without props
- [x] Branch: `chore/all-components-dod-complete` → `main` (no direct push to `main`)
