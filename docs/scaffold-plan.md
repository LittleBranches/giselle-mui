# giselle-mui — Library Scaffold Plan

> **Purpose:** Define the structure and strategy for creating a complete skeleton branch —
> one placeholder folder per component, every planned component present from day one.
>
> _Last updated: 16 May 2026_

---

## What the scaffold branch accomplishes

The current state of `src/components/` is: ~15 real components, ~60+ components planned
but not yet started. The result is a gap between what the folder tree says and what actually
exists.

The scaffold branch (`chore/scaffold-component-tree`) closes that gap structurally:

1. **Every planned component gets a folder.** No more relying on the inventory doc to know
   what is missing — the folder tree IS the inventory.
2. **Each folder has all boilerplate files pre-created.** Types, barrel, README, test stub.
   Implementation is the only thing missing.
3. **Progress is measurable at a glance.** A folder with only a README + stub is obviously
   unimplemented. A folder with a `.tsx` file is shipped. No ambiguity.
4. **Tests can be written before implementation (TDD).** The `<name>.test.ts` file exists
   and has `it.todo` stubs for every planned behaviour — ready to be filled in before the
   component `.tsx` is written.

---

## Phase 0 — Bonus folder dissolution (completed)

The `bonus/` transitional folder has been dissolved. Both components have been moved to their canonical locations:

- `RadialProgressCard` → `src/components/chart/radial-progress/`
- `AnimatedGradientText` → `src/components/material/data-display/animated-gradient/`

Import paths in `src/charts-index.ts`, `src/index.ts`, and all story files were updated. The empty `src/components/bonus/` directory was deleted.

---

## What each placeholder folder contains

Every new (unimplemented) component folder is pre-populated with these files:

```
src/components/<category>/<name>/
  index.ts           — barrel (empty re-exports, ready to fill in)
  types.ts           — TypeScript interfaces (Props stub with JSDoc skeleton)
  <name>.test.ts     — Vitest test file (it.todo stubs per planned behaviour)
  README.md          — why it exists, what it solves, API sketch, design decisions
  roadmap.md         — planned status, open improvements, completed tasks (empty)
```

What is NOT pre-created:

```
  <name>.tsx         — NOT created (existence of .tsx = implemented)
  <name>.styles.ts   — NOT created until implementation begins
  <name>.const.ts    — NOT created until implementation begins
  <name>.stories.tsx — NOT created until implementation begins
```

**The rule:** If `<name>.tsx` exists, the component is real. If the folder has only a
README + types + test stub, it is a placeholder. Any tool or script can determine
implementation status from the filesystem.

---

## File content templates

### `index.ts` (stub)

```ts
// Placeholder — not yet implemented.
// When <ComponentName> is built, add:
// export { <ComponentName> } from './<name>';
// export type { <ComponentName>Props } from './types';
```

### `types.ts` (stub)

```ts
import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Props for `<ComponentName>`.
 *
 * @todo Fill in props when implementation begins.
 * See README.md for the planned API.
 */
export interface <ComponentName>Props {
  /** MUI sx prop — forwarded to root element. */
  sx?: SxProps<Theme>;
}
```

### `<name>.test.ts` (stub)

```ts
// @vitest-environment jsdom
import { describe, it } from 'vitest';

// Placeholder test file — stubs filled in before implementation.
// See README.md for planned behaviours.

describe('<ComponentName>', () => {
  it.todo('renders without crashing');
  it.todo('applies sx prop to root element');
  // Add component-specific behaviour stubs here
});
```

### `README.md` (stub)

```md
# <ComponentName>

## Why it exists

_One paragraph explaining the recurring problem this component solves._
_What would a developer have to write by hand without it?_

## Why it belongs in giselle-mui

_One paragraph confirming this is reusable across projects (not alexrebula-specific)._

## Planned API

| Prop | Type             | Default | Description              |
| ---- | ---------------- | ------- | ------------------------ |
| `sx` | `SxProps<Theme>` | —       | MUI sx forwarded to root |

## Design decisions

_Key choices made during design — preserved here so they survive future refactors._

## Phase

Phase: `<phase-label>` | Priority tier: `T<N>`

## File structure

_Filled in when implementation begins._

## Related

_Links to similar components, docs, or stories once they exist._
```

---

## Scaffold execution order

### Step 1 — bonus/ dissolution (Phase 0 — completed)

Files moved, imports updated, `bonus/` deleted.

### Step 2 — material/ placeholders

Create placeholders for all `⬜` and `🔴` components in `material/` sub-tree.
Priority order: Phase J (T1) first, then Phase H, then Phase E remaining.

**Phase J T1 first (dashboard shell — highest value, most blocking):**

- `material/layout/app-shell/`
- `material/layout/auth-page-layout/`
- `material/navigation/app-sidebar/`
- `material/navigation/app-top-bar/`
- `material/data-display/status-label/`
- `section/error/`

### Step 3 — chart/ placeholders

All Phase H G2 chart component folders.

### Step 4 — motion/ placeholders

All Phase H G6 and Phase I C/D motion component folders.

### Step 5 — remaining section/ and theming/ stubs

`section/pricing/`, `lab/timeline/item-details/`.
Note: `section/hero/` was skipped — `HeroSection` is already fully implemented at `section/hero/section/`.

---

## Branch strategy

```sh
# Branch from main (after bonus/ dissolution lands separately)
git checkout -b chore/scaffold-component-tree

# Create all placeholder folders (see script below)
node scripts/scaffold-components.js

# Verify: every folder in the inventory tree exists in src/
node scripts/check-structure.js

# Verify: no TypeScript errors introduced (only stubs, should be clean)
npx tsc --noEmit

# PR: one commit, one PR — scaffold only, no implementation
```

---

## Scaffold script outline (`scripts/scaffold-components.js`)

Rather than manually creating 50+ folders with identical boilerplate, a scaffold script
generates them from a flat list of `{ path, componentName, phase, tier }` entries.

```js
// scripts/scaffold-components.js
// Usage: node scripts/scaffold-components.js
// Creates placeholder folders for all unimplemented components in the taxonomy.
// Safe to re-run — skips folders that already have a .tsx file (already implemented).

const COMPONENTS = [
  // Phase J — T1 dashboard shell (highest priority)
  { path: 'material/layout/app-shell', name: 'AppShell', phase: 'J', tier: 'T1' },
  { path: 'material/layout/auth-page-layout', name: 'AuthPageLayout', phase: 'J', tier: 'T1' },
  { path: 'material/layout/page-header', name: 'PageHeader', phase: 'J', tier: 'T2' },
  { path: 'material/navigation/app-sidebar', name: 'AppSidebar', phase: 'J', tier: 'T1' },
  { path: 'material/navigation/app-top-bar', name: 'AppTopBar', phase: 'J', tier: 'T1' },
  { path: 'material/navigation/breadcrumbs', name: 'Breadcrumbs', phase: 'J', tier: 'T2' },
  { path: 'material/data-display/status-label', name: 'StatusLabel', phase: 'J', tier: 'T1' },
  { path: 'material/data-display/avatar-row', name: 'AvatarRow', phase: 'J', tier: 'T2' },
  {
    path: 'material/surfaces/card/profile-summary',
    name: 'ProfileSummaryCard',
    phase: 'J',
    tier: 'T2',
  },
  { path: 'section/error', name: 'ErrorSection', phase: 'J', tier: 'T1' },
  { path: 'section/pricing', name: 'PricingSection', phase: 'J', tier: 'T3' },
  // Phase H G1 — financial cards
  {
    path: 'material/surfaces/card/balance-summary',
    name: 'BalanceSummaryCard',
    phase: 'H-G1',
    tier: 'T2',
  },
  {
    path: 'material/surfaces/card/credit-card-display',
    name: 'CreditCardDisplay',
    phase: 'H-G1',
    tier: 'T3',
  },
  // Phase H G2 — chart cards (in chart/)
  { path: 'chart/chart-card-base', name: 'ChartCardBase', phase: 'H-G2', tier: 'T1' },
  { path: 'chart/donut-chart-card', name: 'DonutChartCard', phase: 'H-G2', tier: 'T1' },
  { path: 'chart/area-line-chart-card', name: 'AreaLineChartCard', phase: 'H-G2', tier: 'T1' },
  { path: 'chart/grouped-bar-chart-card', name: 'GroupedBarChartCard', phase: 'H-G2', tier: 'T1' },
  { path: 'chart/sparkline-bar', name: 'SparklineBarChart', phase: 'H-G2', tier: 'T1' },
  {
    path: 'chart/horizontal-bar-chart-card',
    name: 'HorizontalBarChartCard',
    phase: 'H-G2',
    tier: 'T2',
  },
  { path: 'chart/radar-chart-card', name: 'RadarChartCard', phase: 'H-G2', tier: 'T3' },
  { path: 'chart/budget-vs-actual-card', name: 'BudgetVsActualCard', phase: 'H-G2', tier: 'T3' },
  { path: 'chart/projection-card', name: 'ProjectionCard', phase: 'H-G2', tier: 'T3' },
  // ... (full list — all ⬜ and 🔴 entries from component-inventory.md)
];
```

The script generates `index.ts`, `types.ts`, `<name>.test.ts`, `README.md`, and `roadmap.md`
for each entry that does not already have a `.tsx` file.

**The scaffold script itself is a chore — build it when executing the branch, not before.**
The component list above is the authoritative input; the script format is secondary.

---

## What this enables

Once the scaffold branch is merged:

1. **Any component can be implemented in its own focused PR.** The folder exists, the
   README describes what to build, the test stubs describe the expected behaviour.
   The implementer writes `.tsx` + `.styles.ts` + fills in the tests — one PR per component.

2. **The roadmap is the file tree.** Run `find src/components -name '*.tsx' | wc -l` to
   count implemented components. Run `find src/components -name 'README.md' | wc -l` to
   count total planned components. The ratio is coverage.

3. **PRs are reviewable.** A 200-file "add all missing components" PR is unreviewable.
   A "implement `StatusLabel`" PR touching 5 files is a 10-minute review.

4. **Contributors have clear entry points.** Every placeholder folder is a self-contained
   task with a README explaining what to build. A contributor does not need to read the
   full roadmap to understand what is needed.
