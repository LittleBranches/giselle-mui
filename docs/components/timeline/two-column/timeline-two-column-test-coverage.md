---
sidebar_position: 3
sidebar_label: 'TimelineTwoColumn — Tests'
---

# `TimelineTwoColumn` — Behavior Specification & Test Coverage

This page is a complete index of every unit and regression test for the
`TimelineTwoColumn` component family. Each section maps a **feature area** to
the tests that verify it and notes which Storybook story lets you visually
confirm the same behavior.

**Reading as a buyer or integrator:** The test list is your behavioral contract.
If a behavior you need appears here, it is guaranteed by an automated test that
runs on every commit.

**Reading alongside Storybook:** Each section has a _Storybook_ note. Open that
story, trigger the interaction, and confirm the visual result matches the
expected outcome.

---

## Test file map

| File                                           | What it covers                                                                                                                                   |   Tests |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------: |
| `utils.test.ts`                                | Date parsing, phase sorting, overlap detection, month-index helpers                                                                              |      62 |
| `phase-card.test.ts`                           | Variant, click/keyboard, expansion mode, status badges, platform strip, corner badge positioning, eye button WCAG, photos slot render regression |      65 |
| `phase-warning-popover.test.ts`                | `parsePhaseRange`, `getConnectedOverlapGroup`, slider state, resolveOverlaps wiring                                                              |      26 |
| `milestone-badge.interaction.test.ts`          | Card visibility, expand/collapse, keyboard, display-mode regressions                                                                             |      32 |
| `timeline-two-column.tooltip.test.ts`          | Dot tooltip text, overdue label, active label, description preview                                                                               |      38 |
| `milestone-badge.logic.test.ts`                | `hasDetails` interactivity gate, `displayTitle` three-level disclosure                                                                           |      19 |
| `timeline-two-column.interaction.test.ts`      | `handleExpandMilestone`, `handleExpandPhaseCard`, `computeSlotHeights`, checklist `ms.done` initialization seeding regression                    |      20 |
| `timeline-dot.test.ts`                         | Rendering, done state, active-pulse attribute, click/keydown                                                                                     |      17 |
| `spine-connector.test.ts`                      | Year-boundary label, color variants, prop passthrough                                                                                            |      11 |
| `milestone-badge.test.ts`                      | Readability minimum-size constants, eye button WCAG regression                                                                                   |       6 |
| `phase-card.styles.test.ts`                    | `photoImgSx` factory — first-vs-subsequent margin, shared base styles, regression lock                                                           |       4 |
| `timeline-two-column.sort.test.ts`             | `sortOrder='key'` chronological sort                                                                                                             |       4 |
| `timeline-two-column.column-placement.test.ts` | Milestone opposite-column structural invariant                                                                                                   |       3 |
| **Total**                                      |                                                                                                                                                  | **307** |

---

## Capabilities at a glance

| Capability                                          |   Supported    | Notes                                                                 |
| --------------------------------------------------- | :------------: | --------------------------------------------------------------------- |
| Alternating left/right column layout                |       ✅       | `side: 'left' \| 'right'` per phase                                   |
| Milestones nested inside parent period              |       ✅       | Opposite column, same `<li>` — not a separate row                     |
| Phase expansion (click to reveal details)           |       ✅       | Uncontrolled (internal state) or controlled (`onRequestExpand`)       |
| Milestone expansion (click to reveal bullet points) |       ✅       | Toggle on click, Enter, or Space                                      |
| Done state (checkmark dot)                          |       ✅       | `done: true` on phase or milestone                                    |
| Active phase indicator (pulsing ring)               |       ✅       | `active: true` + optional `activeLabel`                               |
| Overdue badge (automatic past-due detection)        |       ✅       | Date in the past + not done                                           |
| Scenario / life-event variant (highlighted card)    |       ✅       | `variant: 'scenario' \| 'life-event'`                                 |
| Scenario status badge (fallback)                    |       ✅       | Only shown when not active / overdue / dateConflict                   |
| Date-conflict badge                                 |       ✅       | `dateConflict: true` — stacks with active + overdue                   |
| Platform strip — `{ icon, label }` chips            |       ✅       | Preferred shape; icon slot suppresses text label                      |
| Platform strip — legacy string form                 |       ✅       | Renders as text label only; strings are NOT auto-resolved as icon IDs |
| Checklist mode (interactive dots)                   |       ✅       | `checklist` prop → dots become keyboard-accessible checkboxes         |
| Year-boundary label on spine                        |       ✅       | `yearMilestone` prop on `SpineConnector`                              |
| Phase sort — newest-first, active pinned            |       ✅       | `sortPhasesByDate()` default                                          |
| Phase sort — chronological ascending                |       ✅       | `sortPhasesByDate(phases, 'asc')` — no active pinning                 |
| Overlap detection                                   |       ✅       | `detectPhaseOverlaps()` returns `Set` of conflicting phase keys       |
| All 6 MUI palette keys                              |       ✅       | `primary \| secondary \| info \| success \| warning \| error`         |
| Keyboard accessibility                              |       ✅       | Enter/Space on cards and milestone badges; `tabIndex={0}` on dots     |
| `id`, `data-*`, `aria-*` passthrough                |       ✅       | `...other` spread on root element                                     |
| Responsive layout adaptation                        | ⚠️ Visual only | Tested in `Responsive` story; no unit assertions                      |
| Framer Motion / parallax animation                  |       ❌       | `framer-motion` is not an allowed peer dependency                     |
| Inline editing                                      |       ❌       | Data flows in only — no two-way binding                               |
| Drag-to-reorder                                     |       ❌       | Not planned                                                           |

---

## Feature area specifications

---

### 1 · Date parsing

**File:** `utils.test.ts` &nbsp;|&nbsp; Functions: `getLastYear`, `parseLastDate`, `parseSortableDate`, `parseFirstDate`, `MONTH_INDEX`

Date strings come from user-provided phase and milestone data. They are free-form
(`'Jan 2020 – Dec 2023'`, `'~1994'`, `'present'`) and are normalised before
sorting or overdue detection runs.

**Storybook:** Not directly observable. Verify indirectly: dates appear correctly
in the `ReadOnly` and `ChecklistMode` stories.

#### `getLastYear` — extract the final 4-digit year from any string

| Test                                                                       | Type |
| -------------------------------------------------------------------------- | :--: |
| Returns `null` for empty string                                            | unit |
| Returns `null` when no year present (`'present'`, `'Unknown'`)             | unit |
| Extracts year prefixed with tilde — `'~1992'` → `1992`                     | unit |
| Returns the single year when only one is present                           | unit |
| Returns the **last** year when a range is given — `'2005 – 2006'` → `2006` | unit |
| Ignores 3-digit and 5-digit numbers                                        | unit |
| Handles years embedded in full sentences                                   | unit |

#### `MONTH_INDEX` — 0-based month lookup

| Test                                                                                   | Type |
| -------------------------------------------------------------------------------------- | :--: |
| Maps all 12 abbreviated month keys to correct 0-based indices (`jan` → 0 … `dec` → 11) | unit |

#### `parseLastDate` — parse the end date of a range to a `Date`

| Test                                                                | Type |
| ------------------------------------------------------------------- | :--: |
| Returns `null` for strings with no recognisable date                | unit |
| Parses a full day-month-year date                                   | unit |
| Parses a month-only date and returns the **last day** of that month | unit |
| Returns correct last day for February in a non-leap year            | unit |
| Returns correct last day for February in a leap year                | unit |
| Parses the END date of a range string (ignores start)               | unit |
| Is case-insensitive for month names                                 | unit |
| Handles full month name prefixes — `'January'`                      | unit |

#### `parseSortableDate` — single comparable timestamp from any date string

| Test                                                                        | Type |
| --------------------------------------------------------------------------- | :--: |
| Returns `null` for strings with no recognisable date                        | unit |
| Returns a timestamp for a full day-month-year string                        | unit |
| Ignores trailing noise — `'27 Apr 2026 — URGENT'` → Apr 27                  | unit |
| Ignores parenthetical day names — `'13 Jun 2026 (Sat)'` → Jun 13            | unit |
| Falls back to year-only for `'~1994'` → Jan 1 1994                          | unit |
| Falls back to year-only for `'2015 – present'` → Jan 1 2015                 | unit |
| A full date is always more recent than the same year via year-only fallback | unit |

#### `parseFirstDate` — parse the start date of a range to a `Date`

| Test                                                       | Type |
| ---------------------------------------------------------- | :--: |
| Returns the first day of the **start** month for a range   | unit |
| Returns the first day of the month for a single-month date | unit |
| Returns Jan 1 for a year-only string                       | unit |
| Returns `null` for an empty string                         | unit |
| Returns `null` when no date is present                     | unit |

---

### 2 · Phase sorting

**File:** `utils.test.ts` &nbsp;|&nbsp; Function: `sortPhasesByDate`

**Storybook:** `Components/TimelineTwoColumn/ReadOnly` — the active phase
(Lead Frontend Engineer) always appears at the top regardless of its date
relative to the other phases.

| Test                                                                    | Type | Regression note                                                                                |
| ----------------------------------------------------------------------- | :--: | ---------------------------------------------------------------------------------------------- |
| Pins active phase first regardless of its date                          | unit |                                                                                                |
| Sorts remaining phases newest-first (descending by date)                | unit |                                                                                                |
| **key 9 (Apr 27) sorts after key 8 (Jun 13) in descending order**       |  🔒  | Before fix, `b.key - a.key` was used instead of date comparison — Jun 13 appeared after Apr 27 |
| **eVisitor (key 9, Apr 27) appears directly after IMR (key 1, Apr 24)** |  🔒  | Same root cause                                                                                |
| Breaks ties by descending key when dates are identical                  | unit |                                                                                                |
| Sorts undated phases to the end                                         | unit |                                                                                                |
| Sorts year-only dates after same-year full dates                        | unit |                                                                                                |
| Does not mutate the original array                                      | unit |                                                                                                |
| `asc` mode: pure chronological — no active pinning, no done pinning     | unit |                                                                                                |

---

### 3 · Overlap detection

**File:** `utils.test.ts` &nbsp;|&nbsp; Function: `detectPhaseOverlaps`

When two phases have overlapping date ranges, the phase card renders a
`dateConflict` badge. `detectPhaseOverlaps` returns a `Set<number | string>`
of the phase keys involved.

**Storybook:** Not visible in current stories. Add overlapping-date phases to
the `ReadOnly` story sample data to verify the badge appears.

| Test                                                            | Type |
| --------------------------------------------------------------- | :--: |
| Returns empty set when no phases overlap                        | unit |
| Returns both keys when two phases overlap                       | unit |
| Returns all three keys when three phases share an overlap       | unit |
| Ignores phases with unparseable dates                           | unit |
| Does not flag adjacent ranges that share only an endpoint month | unit |

---

### 4 · Phase card — variant highlighting

**File:** `phase-card.test.ts` &nbsp;|&nbsp; Function: `isHighlightedVariant`

`variant: 'scenario'` and `variant: 'life-event'` receive a highlighted border
and background. All other variant strings, including `undefined`, render as
plain cards.

**Storybook:** Add a phase with `variant: 'scenario'` to the `ReadOnly` story
to see the highlighted card treatment.

| Test                             | Type |
| -------------------------------- | :--: |
| `'scenario'` → `true`            | unit |
| `'life-event'` → `true`          | unit |
| `undefined` → `false`            | unit |
| Unknown variant string → `false` | unit |
| Empty string → `false`           | unit |

---

### 5 · Phase card — click & keyboard interaction

**File:** `phase-card.test.ts` &nbsp;|&nbsp; Functions: `buildCardClickHandler`, `buildCardKeyDownHandler`

Phase cards with a `details` array are expandable. Cards without details are
inert — clicks and key presses are no-ops.

**Storybook:** `Components/TimelineTwoColumn/ReadOnly` — click any phase card
that has a details list to expand it. Tab to it and press Enter or Space.

#### Click handler

| Test                                            | Type |
| ----------------------------------------------- | :--: |
| `hasDetails=true` → toggle called on click      | unit |
| `hasDetails=false` → toggle NOT called on click | unit |

#### Keyboard handler (Enter / Space only)

| Test                                                          | Type |
| ------------------------------------------------------------- | :--: |
| Enter + `hasDetails=true` → toggle called + default prevented | unit |
| Space + `hasDetails=true` → toggle called + default prevented | unit |
| Enter + `hasDetails=false` → no-op                            | unit |
| Tab + `hasDetails=true` → no-op (only Enter/Space activate)   | unit |

---

### 6 · Phase card — expansion modes

**File:** `phase-card.test.ts` &nbsp;|&nbsp; Function: `resolveCardExpansion`

Phase cards support two expansion modes: **uncontrolled** (internal `useState`)
and **controlled** (`onRequestExpand` + `isExpanded` from the consumer). The
mode is selected by whether `onRequestExpand` is provided.

**Storybook:** `Components/TimelineTwoColumn/ReadOnly` uses uncontrolled mode.
Controlled mode is typically used when a parent component manages which cards
are open (accordion pattern).

#### Uncontrolled mode

| Test                                                                | Type |
| ------------------------------------------------------------------- | :--: |
| No `onRequestExpand` → `expanded` equals `internalExpanded`         | unit |
| `internalExpanded=true` → `expanded` is `true`                      | unit |
| Uncontrolled toggle calls setter with an inverting updater function | unit |

#### Controlled mode

| Test                                                            | Type |
| --------------------------------------------------------------- | :--: |
| `onRequestExpand` provided → `expanded` equals `isExpanded`     | unit |
| `isExpanded=undefined` in controlled mode → defaults to `false` | unit |
| Controlled toggle calls `onRequestExpand`                       | unit |

---

### 7 · Phase card — status badges

**File:** `phase-card.test.ts` &nbsp;|&nbsp; Function: `resolveStatusBadges` (mirrors `CardStatusBadge` internal logic)

Status badges stack: a phase card can simultaneously show an **active** dot, an
**overdue** chip, and a **dateConflict** chip. The `scenario` badge is a
fallback — it only appears when none of the others apply.

**Storybook:** `Components/TimelineTwoColumn/ChecklistMode` — undone past-due
phases show the overdue highlight.

| Test                                                           | Type | Regression note                                                                 |
| -------------------------------------------------------------- | :--: | ------------------------------------------------------------------------------- |
| `overdue + not done` → `['overdue']`                           | unit |                                                                                 |
| **`overdue + done` → `[]` — done suppresses overdue**          |  🔒  | Completed phases cannot be pending; the done flag must win                      |
| `active + not done` → `['active']`                             | unit |                                                                                 |
| **`active + overdue` → `['active', 'overdue']` — both render** |  🔒  | An in-progress phase past its end date must show both indicators simultaneously |
| **`done + active` → `[]` — done suppresses Now dot**           |  🔒  | A completed phase must not show the active "Now" dot                            |
| `dateConflict` stacks on top of `active + overdue`             | unit |                                                                                 |
| `scenario + scenarioLabel` → `['scenario']` (fallback only)    | unit |                                                                                 |
| Scenario suppressed when `active` is set                       | unit |                                                                                 |
| `scenario` without `scenarioLabel` → `[]` (no empty badge)     | unit |                                                                                 |
| No conditions met → `[]`                                       | unit |                                                                                 |

---

### 8 · Phase card — platform strip

**File:** `phase-card.test.ts` &nbsp;|&nbsp; Functions: `derivePlatformEntry`, `buildPlatformStripItems`

Each phase accepts a `platforms` array of technology chips. The preferred form
is `{ icon: ReactNode, label: string }`. A legacy `string` form is supported for
backward compatibility — strings render as text labels with no icon and are
**not** auto-resolved as Iconify IDs.

**Storybook:** `Components/TimelineTwoColumn/ReadOnly` — platform icon chips
are visible below each phase card title (React, TypeScript, AWS, etc.).

#### `derivePlatformEntry`

| Test                                                                | Type | Regression note                                                                 |
| ------------------------------------------------------------------- | :--: | ------------------------------------------------------------------------------- |
| Plain tech name → text label, no icon                               | unit |                                                                                 |
| Iconify-ID string (`'logos:php'`) → text label, NOT auto-resolved   | unit | Before `{ icon, label }` migration, strings were mistakenly treated as icon IDs |
| Object platform preserves the provided label and icon node          | unit |                                                                                 |
| Multiple string platforms each resolve to text labels with no icons | unit |                                                                                 |

#### `buildPlatformStripItems`

| Test                                                                      | Type |
| ------------------------------------------------------------------------- | :--: |
| Icon node renders and suppresses the fallback text label                  | unit |
| `{ icon, label }` never renders label as inner text when icon is provided | unit |
| Icon items and string items can coexist in one array                      | unit |

---

### 9 · Milestone badge — interactivity gate

**File:** `milestone-badge.logic.test.ts` &nbsp;|&nbsp; Function: `computeHasDetails`

`hasDetails` gates cursor, `onClick`, `aria-expanded`, and the `Collapse`
section. It is independent of the (now-removed) `display` prop.

| Test                                                                    | Type | Regression note                                                                |
| ----------------------------------------------------------------------- | :--: | ------------------------------------------------------------------------------ |
| `details=undefined` → `false`                                           | unit |                                                                                |
| `details=[]` (empty array) → `false`                                    | unit |                                                                                |
| `details` with one item → `true`                                        | unit |                                                                                |
| `details` with multiple items → `true`                                  | unit |                                                                                |
| **Any milestone with details is expandable regardless of display mode** |  🔒  | Previously an `isInline` gate blocked expansion even when details were present |
| **Milestone with no details is not expandable**                         |  🔒  | Confirms the inverse is also preserved after removing the gate                 |

---

### 10 · Milestone badge — card visibility & expansion

**File:** `milestone-badge.interaction.test.ts`

**Storybook:** `Components/TimelineTwoColumn/ReadOnly` — click a milestone dot
to expand its detail bullets. Click again to collapse.

#### Always visible (no click required)

| Test                                            | Type |
| ----------------------------------------------- | :--: |
| Title is rendered immediately without any click | unit |
| Date is rendered immediately without any click  | unit |
| Details are hidden on initial render            | unit |

#### Click-to-expand/collapse

| Test                                                 | Type |
| ---------------------------------------------------- | :--: |
| First click reveals the details section              | unit |
| Second click collapses the details section           | unit |
| Third click re-expands (toggle is symmetrical)       | unit |
| All detail items are rendered when expanded          | unit |
| Detail item count matches the `details` array length | unit |

#### No-op when there are no details

| Test                                                               | Type |
| ------------------------------------------------------------------ | :--: |
| Details section never appears after click when `details=undefined` | unit |
| Details section never appears after click when `details=[]`        | unit |
| Title remains visible after a no-op click                          | unit |

#### `data-has-details` attribute

| Test                                       | Type |
| ------------------------------------------ | :--: |
| `"true"` when `details` array is non-empty | unit |
| `"false"` when `details` is `undefined`    | unit |
| `"false"` when `details` is `[]`           | unit |

#### Display-mode regression guard

| Test                                           | Type | Regression note                                |
| ---------------------------------------------- | :--: | ---------------------------------------------- |
| **`display:hover` + details → click expands**  |  🔒  | Was blocked by the now-removed `isInline` gate |
| `display:inline` + no details → click is no-op | unit |                                                |
| `display:inline` + details → click expands     | unit |                                                |
| `display:hover` + no details → click is no-op  | unit |                                                |

---

### 11 · Milestone badge — keyboard activation

**File:** `milestone-badge.interaction.test.ts`

**Storybook:** `Components/TimelineTwoColumn/ReadOnly` — tab to a milestone
dot, press Enter or Space to expand it.

| Test                                                           | Type |
| -------------------------------------------------------------- | :--: |
| Enter expands details when `hasDetails=true`                   | unit |
| Space expands details when `hasDetails=true`                   | unit |
| Second Enter collapses an already-expanded section             | unit |
| Second Space collapses an already-expanded section             | unit |
| Enter is a no-op when `hasDetails=false`                       | unit |
| Space is a no-op when `hasDetails=false`                       | unit |
| `ArrowDown` is a no-op even when `hasDetails=true`             | unit |
| Click then Enter toggles correctly (click opens, Enter closes) | unit |

---

### 12 · TimelineDot — rendering, done state, interaction

**File:** `timeline-dot.test.ts`

**Storybook:** `Components/TimelineDot` — all 6 palette colors, done/active/
default states together in one view.

#### Rendering

| Test                                                      | Type |
| --------------------------------------------------------- | :--: |
| Renders without crashing with defaults                    | unit |
| Renders without crashing for each of the 6 palette colors | unit |
| Renders without crashing at `size='milestone'`            | unit |
| Renders without crashing in done state                    | unit |
| Renders without crashing in active state                  | unit |

#### `data-active` attribute (gates the CSS pulse animation)

| Test                                                                                    | Type |
| --------------------------------------------------------------------------------------- | :--: |
| `data-active="true"` present when `active=true` and `size='phase'` (default)            | unit |
| `data-active` absent when `active=false`                                                | unit |
| `data-active` absent when `active=true` but `size='milestone'` — milestones never pulse | unit |
| `data-active` absent when `active=undefined`                                            | unit |

#### Done state

| Test                                                 | Type |
| ---------------------------------------------------- | :--: |
| Renders a checkmark polyline when `done=true`        | unit |
| Does not render checkmark polyline when `done=false` | unit |

#### Interaction

| Test                                                        | Type |
| ----------------------------------------------------------- | :--: |
| `onClick` fires when the root element is clicked            | unit |
| `onKeyDown` fires when a key is pressed on the root element | unit |

---

### 13 · SpineConnector — year label & color variants

**File:** `spine-connector.test.ts`

The spine connector between phase dots optionally renders a floating year chip
(`yearMilestone` prop), marking year transitions on long timelines.

**Storybook:** Not visible in current stories. The chip appears between phases
that cross a year boundary — add phases with dates in different years to any
story.

#### Year label

| Test                                                            | Type |
| --------------------------------------------------------------- | :--: |
| Renders a year chip when `yearMilestone` is set                 | unit |
| Does NOT render a year chip when `yearMilestone` is `undefined` | unit |
| Does NOT render a year chip when `yearMilestone` is `null`      | unit |
| Year chip contains the exact year string (not a different year) | unit |

#### Color variants

| Test                                                        | Type |
| ----------------------------------------------------------- | :--: |
| Each of the 6 palette color values renders without crashing | unit |

#### Prop passthrough

| Test                              | Type |
| --------------------------------- | :--: |
| `id` prop appears on root element | unit |

---

### 14 · Column placement — structural invariant

**File:** `timeline-two-column.column-placement.test.ts`

This is the most architecturally critical test in the suite. Milestones must
render in the **opposite** column from their parent phase card, inside the same
`<li>`. This keeps milestones visually alongside their parent period rather than
below it in the DOM flow.

**Storybook:** `Components/TimelineTwoColumn/ReadOnly` — both a `side='left'`
and a `side='right'` phase are present, each with milestones. Confirm that
milestones sit in the opposite column from their phase card.

| Test                                                                                     | Type |
| ---------------------------------------------------------------------------------------- | :--: |
| `phase.side='right'` → phase card in left column → milestone must be in **right** column | unit |
| `phase.side='left'` → phase card in right column → milestone must be in **left** column  | unit |
| Milestone column is never the same as its parent phase card column                       | unit |

---

## Storybook cross-reference

| Story                               | Key behaviors to verify                                                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TimelineTwoColumn/ReadOnly`        | Left/right alternation, active phase pulsing, done checkmarks, milestone placement, platform icon chips, card expand/collapse on click, keyboard navigation |
| `TimelineTwoColumn/ChecklistMode`   | Click phase/milestone dots to toggle done; undone past-due items highlight automatically                                                                    |
| `TimelineTwoColumn/Responsive`      | Layout at xs/sm/md/lg breakpoints — no overflow at narrow widths                                                                                            |
| `TimelineDot/AllColors`             | All 6 palette keys × done/active/default states — color rendering, checkmark, pulse attribute                                                               |
| `TimelineTwoColumn/PhotosArraySlot` | Multiple photos stack vertically inside a card; `photo` (singular) normalises to a single-element array; `photos` wins when both fields are present         |

---

## Not covered by unit tests

These behaviors exist and work correctly but require visual inspection in
Storybook — no unit assertion currently verifies them:

| Behavior                                     | Where to verify                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| Pulsing ring animation on active dots        | `TimelineTwoColumn/ReadOnly` — the active phase dot                       |
| Expand/collapse transition (MUI `Collapse`)  | `TimelineTwoColumn/ReadOnly` — click any expandable phase card            |
| CSS color tinting via `theme.vars.palette.*` | `TimelineDot/AllColors` — all 6 palette keys                              |
| Overdue dot turning red in checklist mode    | `TimelineTwoColumn/ChecklistMode` — any undone past-due phase             |
| Overdue dot turning red in read-only mode    | Add a past-due undone phase to `ReadOnly`                                 |
| Responsive column layout at narrow widths    | `TimelineTwoColumn/Responsive`                                            |
| Icon rendering in phase/milestone dots       | `TimelineTwoColumn/ReadOnly` — icons in the dot center                    |
| Icon rendering in platform strip chips       | `TimelineTwoColumn/ReadOnly` — React/TypeScript/AWS chips below each card |
| Scenario card highlighted border/background  | Add a phase with `variant: 'scenario'` to `ReadOnly`                      |
| Spine year-boundary chip visual position     | Add phases spanning a year boundary to any story                          |
