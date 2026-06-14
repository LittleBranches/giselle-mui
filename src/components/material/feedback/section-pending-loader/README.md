# SectionPendingLoader

## Why it exists

When a page section fetches asynchronous data — a dashboard card, a list panel, a detail
pane — the developer must show some kind of loading state while the request is in flight.
Without a shared component, every callsite rolls its own: an MUI `CircularProgress` centred
with a `Box`, optional helper text positioned below, and ad-hoc spacing that varies from file
to file. `SectionPendingLoader` standardises this into a single drop-in that always centres
a spinner with consistent padding and an optional status message, eliminating the boilerplate
and the visual inconsistency it creates.

## Why it belongs in giselle-mui

Asynchronous loading states appear in every data-driven application regardless of domain —
dashboards, admin panels, content feeds, settings pages. The component is intentionally
minimal: a spinner and an optional message. It carries no application-specific semantics and
is a suitable default for any project that uses MUI.

## Design decisions

TBD — filled in during implementation.

## Related

- [MUI CircularProgress](https://mui.com/material-ui/react-progress/) — spinner primitive

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `message?: string` — optional text rendered below the spinner to describe what is loading
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root `Box`

**Visual description:** A vertically and horizontally centred `CircularProgress` spinner. When
`message` is supplied, a secondary-typography string appears below the spinner with a small
top margin. The root element is a full-width `Box` with enough vertical padding to feel
spacious inside a card or panel.

**Reference component substituted:** Inline ad-hoc spinner patterns (no single closed-source
reference).

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Spinner is centred horizontally and vertically within the root Box
- [ ] `message` prop renders below the spinner when provided
- [ ] Component renders without `message` prop (message is optional)
- [ ] `sx` prop is forwarded to the root element

## Phase

Phase: `E` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
