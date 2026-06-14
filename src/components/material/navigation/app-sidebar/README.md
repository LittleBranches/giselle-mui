# AppSidebar

## Why it exists

Application sidebars must render a structured navigation tree: top-level items with icons
and labels, optional nested child items, an active-state highlight on the current route, and
slots for a logo at the top and a footer element (user avatar, sign-out link) at the bottom.
Without a shared component, this is built from scratch per project: a MUI `Drawer` with a
hand-rolled list, recursive item rendering for nested nav, active-state logic tied to the
router, and bespoke logo/footer positioning. `AppSidebar` encapsulates this structural
boilerplate so developers supply only their nav items and slot content.

## Why it belongs in giselle-mui

Sidebar navigation appears in every multi-page application regardless of domain. The
recursive `AppSidebarNavItem` model (id, label, icon, href, active, children) is generic
enough to represent any navigation hierarchy, and the component extends MUI `Drawer` so it
slots directly into `AppShell` or any custom layout.

## Design decisions

TBD — filled in during implementation.

## Related

- [AppShell](../../layout/app-shell/README.md) — shell layout that hosts the sidebar in its `sidebar` slot
- [AppTopBar](../app-top-bar/README.md) — companion top bar component
- [MUI Drawer](https://mui.com/material-ui/react-drawer/) — root element

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `items: AppSidebarNavItem[]` — navigation tree; each item has `id`, `label`, `icon?`, `href?`, `active?`, `children?`
- `logo?: ReactNode` — slot rendered at the top of the sidebar (brand/logo)
- `footer?: ReactNode` — slot rendered at the bottom of the sidebar (user info, sign-out)
- All `DrawerProps` (except `children`) — forwarded to the underlying MUI `Drawer`

**Visual description:** A vertical navigation panel. The logo slot appears at the top. Below
it, nav items are rendered as a list — each item shows an optional icon and its label;
active items receive a highlighted background. Items with children can expand to reveal
nested items. The footer slot is pinned to the bottom of the panel.

**Reference component substituted:** Custom application sidebar/drawer navigation
components (no single closed-source reference).

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] All items in `items` are rendered as navigation entries
- [ ] Item with `active: true` receives a visual active highlight
- [ ] Items with `icon` render the icon beside the label
- [ ] Items with `children` support nested navigation
- [ ] `logo` slot renders at the top of the panel when provided
- [ ] `footer` slot renders at the bottom of the panel when provided

## Phase

Phase: `J` | Priority tier: `T1`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
