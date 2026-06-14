# PeriodDetailSheet

## Why it exists

When a user selects a time period (a day, week, or month) from a navigation element, a
common pattern is to slide up a bottom sheet containing the detail for that period —
without navigating to a new page. Without a shared component, developers wire a MUI
`Drawer` (anchored to the bottom), manage the open/close state, animate the entry,
handle safe-area insets on mobile, and style a detail layout inside it — all from
scratch for each screen that needs this interaction.

## Why it belongs in giselle-mui

A bottom-sheet detail overlay for time periods is a recurring interaction in any app
that presents time-series or calendar data. The component manages the sheet shell
(positioning, animation, overlay, dismissal); the content is caller-supplied. It is
not tied to any specific period data model and works equally well for weekly, monthly,
or custom period granularities.

## Design decisions

TBD — filled in during implementation.

## Related

- [ExpandingPeriodStrip](../expanding-period-strip/README.md) — period navigation strip that triggers this sheet
- [BudgetSummaryDrawer](../budget-summary-drawer/README.md) — side-drawer alternative for summary overlays
- [WeeklyBreakdownPage](../weekly-breakdown-page/README.md) — page-level context in which this sheet appears

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: open/close props (e.g. `open: boolean`, `onClose: () => void`) and period content
slot props are to be defined during implementation.

**Visual description:** A sheet anchored to the bottom of the viewport that slides up
over the page content when `open` is true. It has a drag handle or close button at the
top. The sheet's height is determined by its content up to a maximum of roughly 80vh,
after which the content area scrolls. A semi-transparent backdrop dims the page behind
it. Dragging the sheet downward dismisses it with a smooth spring transition.

**Reference component substituted:** Closed-source period detail bottom sheet used in
weekly and monthly tracking screens.

**Acceptance criteria:**
- [ ] Renders correctly when `open` is true
- [ ] Slides up from the bottom with a smooth animated entry
- [ ] Slides back down on close before unmounting
- [ ] Backdrop click and close button both call `onClose`
- [ ] Content area scrolls when content exceeds the maximum sheet height
- [ ] Sheet respects safe-area insets on mobile (bottom padding)
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `period-detail-sheet.test.ts`

## Phase

Phase: `I-C` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
