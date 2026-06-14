# AppTopBar

## Why it exists

Application top bars follow a consistent three-zone layout: a logo or brand mark on the
left, a page title or breadcrumb in the centre or adjacent to the logo, and action controls
(notifications, user avatar, theme toggle) on the right. On narrow viewports there is
typically a hamburger button on the far left that opens the sidebar. Without a shared
component, every project assembles an MUI `AppBar` with a `Toolbar`, positions the logo
manually, decides where the title goes, aligns action icons to the right with a `Box` flex
spacer, and wires up the sidebar toggle callback. `AppTopBar` encapsulates this layout so
developers supply only their logo, title, and action nodes.

## Why it belongs in giselle-mui

Top navigation bars appear in every application that has a persistent header. The three-zone
structure (logo | title | actions) is a universal UI pattern, and the component extends MUI
`AppBar` so it works with MUI's elevation and positioning system out of the box. It has no
application-specific logic.

## Design decisions

TBD — filled in during implementation.

## Related

- [AppShell](../../layout/app-shell/README.md) — shell layout that hosts the top bar in its `topbar` slot
- [AppSidebar](../app-sidebar/README.md) — companion sidebar component; `onMenuClick` opens it
- [MUI AppBar](https://mui.com/material-ui/react-app-bar/) — root element

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `logo?: ReactNode` — logo or brand element rendered on the left
- `title?: ReactNode` — page title or breadcrumb slot rendered beside the logo
- `actions?: ReactNode` — icon buttons or controls on the right (notifications, avatar, etc.)
- `onMenuClick?: () => void` — when provided, renders a sidebar toggle button that calls this handler
- All `AppBarProps` (except `children` and `title`) — forwarded to the underlying MUI `AppBar`

**Visual description:** A full-width `AppBar` with a `Toolbar` inside. On the left: an
optional hamburger menu button (when `onMenuClick` is set), followed by the logo. In the
middle-left area: the title slot. On the right: the actions slot. All zones are vertically
centred. The bar uses MUI elevation and is sticky/fixed at the top of the viewport.

**Reference component substituted:** Custom `AppBar`/`Toolbar` top navigation components
in application layouts (no single closed-source reference).

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] `logo` slot renders on the left when provided
- [ ] `title` slot renders beside the logo when provided
- [ ] `actions` slot renders on the right edge when provided
- [ ] When `onMenuClick` is provided, a menu/hamburger button is visible and calls the handler when clicked
- [ ] Bar is positioned at the top of the viewport

## Phase

Phase: `J` | Priority tier: `T1`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
