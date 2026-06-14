# AppShell

## Why it exists

Every application that has a sidebar and a top bar needs to stitch those pieces together into
a coherent layout: the sidebar is a persistent (or toggleable) drawer on the left, the top
bar spans the full width at the top, and the main content fills the remaining space without
overflowing or scrolling in unexpected ways. Wiring this by hand requires managing MUI
`Drawer` open/close state, computing the correct content margin offset so the page body does
not slide under the drawer, handling responsive collapse on narrow viewports, and threading
the toggle callback down from the top bar into the sidebar. `AppShell` encapsulates that
wiring so developers only supply the sidebar content, the top-bar node, and the page body.

## Why it belongs in giselle-mui

The three-zone shell (sidebar + top bar + content area) is the dominant layout pattern for
web applications across every domain. The component accepts slots for each zone and manages
the drawer toggle state, making it a domain-agnostic layout primitive suitable for any project
that uses MUI.

## Design decisions

TBD — filled in during implementation.

## Related

- [AppSidebar](../../navigation/app-sidebar/README.md) — sidebar content component designed to slot into `sidebar`
- [AppTopBar](../../navigation/app-top-bar/README.md) — top bar component designed to slot into `topbar`
- [MUI Drawer](https://mui.com/material-ui/react-drawer/) — underlying drawer primitive

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `sidebar?: ReactNode` — drawer content (typically `<AppSidebar />`)
- `topbar?: ReactNode` — top navigation bar (typically `<AppTopBar />`)
- `children?: ReactNode` — main page content
- `sidebarOpen?: boolean` — controlled open state of the sidebar drawer
- `onSidebarToggle?: () => void` — callback fired when the sidebar should open or close
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A full-viewport layout. The top bar is pinned to the top of the
screen. The sidebar is a `Drawer` on the left, either persistent or temporary depending on
viewport width. The main content occupies the remaining space, offset by the drawer width
when the sidebar is open in persistent mode.

**Reference component substituted:** Custom shell layout components found in application
roots (no single closed-source reference).

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Top bar spans the full width at the top of the viewport
- [ ] Sidebar renders as a drawer on the left
- [ ] Main content area does not overlap with the open sidebar
- [ ] `onSidebarToggle` is called when the toggle button is activated
- [ ] `sidebarOpen` prop controls the open/closed state of the drawer

## Phase

Phase: `J` | Priority tier: `T1`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
