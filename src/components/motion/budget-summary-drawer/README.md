# BudgetSummaryDrawer

## Why it exists

Surfacing a budget or financial summary without navigating away from the current screen
is a common requirement in data-rich apps. Without a shared component, developers
implement a MUI `Drawer` with custom animated entry, wire open/close state, manage focus
trapping, style a summary layout inside it, and repeat that work across every screen that
needs a contextual overlay. The boilerplate is substantial and the result is inconsistent
across surfaces.

## Why it belongs in giselle-mui

A slide-in drawer presenting summary data is a general UI pattern. The component manages
the drawer shell — open/close animation, overlay, positioning — while the content is
caller-supplied. It is not specific to any budget data model; it can present financial
summaries, time summaries, or any other contextual detail without code changes.

## Design decisions

TBD — filled in during implementation.

## Related

- [PeriodDetailSheet](../period-detail-sheet/README.md) — bottom-sheet alternative for period-specific detail
- [ExpandingPeriodStrip](../expanding-period-strip/README.md) — inline alternative for period navigation

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sx?: SxProps<Theme>` — forwarded to the root element

Note: open/close state props (e.g. `open: boolean`, `onClose: () => void`) and content
slot props are to be defined during implementation.

**Visual description:** A panel that slides in from the right (or bottom on mobile) over
the current content. It has a semi-transparent backdrop. The panel contains a summary
layout — header, key figures, and a scrollable detail area — all supplied via slots or
children. Closing animates the panel back out before unmounting.

**Reference component substituted:** Closed-source budget summary drawer used in financial
overview and tracking screens.

**Acceptance criteria:**
- [ ] Renders correctly when `open` is true
- [ ] Slides in with a smooth animation on open; slides out on close before unmounting
- [ ] Backdrop is rendered and clicking it triggers `onClose`
- [ ] Content area is scrollable when it overflows the drawer height
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `budget-summary-drawer.test.ts`

## Phase

Phase: `I-C` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
