# ExpandingPeriodStrip

## Why it exists

Navigating across time periods (weeks, months, quarters) inline — without a full
date-picker — requires a compact strip of period labels that expands to show more options
when tapped. Without a shared component, developers build this with custom animation
logic to expand/collapse the strip, manage the selected period state, handle the layout
reflow, and keep the interaction consistent with the rest of the motion system.

## Why it belongs in giselle-mui

A time-period navigation strip is a recurring UI element in any app that presents
time-series data — reporting tools, planners, trackers, and dashboards all need it. The
component handles the expand/collapse animation and selection state; the period data
(labels, identifiers) is supplied by the caller. It is not coupled to any specific
calendar implementation.

## Design decisions

TBD — filled in during implementation.

## Related

- [PeriodDetailSheet](../period-detail-sheet/README.md) — sheet that shows detail for the selected period
- [BudgetSummaryDrawer](../budget-summary-drawer/README.md) — drawer alternative for summary overlays
- [HorizontalScrollRail](../horizontal-scroll-rail/README.md) — horizontal scroll primitive usable by this component

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: period data props (e.g. `periods`, `activeId`, `onSelect`) and expand behaviour
props are to be defined during implementation.

**Visual description:** A horizontal strip showing a compact list of period labels (e.g.
"May", "Jun", "Jul"). In its default state it shows 3–5 labels. When a user taps to
expand, the strip animates open to reveal more periods. The active period is highlighted.
Selecting a period calls `onSelect` and may collapse the strip back to its compact state.

**Reference component substituted:** Closed-source expanding period selector used in
weekly and monthly tracking screens.

**Acceptance criteria:**
- [ ] Renders correctly with one or more periods
- [ ] Compact state shows a limited subset of periods; expanded state shows all
- [ ] Expand and collapse are animated smoothly without layout jump
- [ ] Active period is visually distinguished
- [ ] Selecting a period calls `onSelect` with the period identifier
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `expanding-period-strip.test.ts`

## Phase

Phase: `I-C` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
