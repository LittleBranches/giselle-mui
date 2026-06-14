# PageHeader

## Why it exists

Most application pages need a consistent header zone at the top of the content area: a
title, optional breadcrumbs above it for hierarchical context, and optional action buttons
on the trailing edge (e.g. "New", "Export", "Settings"). Without a shared component,
every page assembles this from raw MUI typography and layout primitives — a `Typography`
variant for the title, a `Box` with `display: flex` and `justifyContent: space-between`
to push actions to the right, and a `Breadcrumbs` above it. The result is repetitive and
inconsistent: spacing shifts, title variants drift, and action-button alignment varies page
to page.

## Why it belongs in giselle-mui

Page headers appear in every content-heavy application regardless of domain. The title +
breadcrumbs + actions pattern is a layout convention, not application logic, making it an
appropriate shared primitive for any project using MUI.

## Design decisions

TBD — filled in during implementation.

## Related

- [Breadcrumbs](../../navigation/breadcrumbs/README.md) — breadcrumb component designed to slot into the `breadcrumbs` prop
- [AppShell](../app-shell/README.md) — shell layout that hosts the page content area

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `title: string` — required page title rendered as a heading
- `breadcrumbs?: ReactNode` — breadcrumb slot rendered above the title (typically `<Breadcrumbs />`)
- `actions?: ReactNode` — action buttons slot rendered at the trailing (right) edge, aligned with the title
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A horizontal header bar. Breadcrumbs (when present) appear above the
title. The title and actions occupy the same row with the title on the left and actions
flush right. Vertical spacing is consistent across pages. The title uses an `h1`-level
typography variant.

**Reference component substituted:** Ad-hoc page header patterns in application page
components (no single closed-source reference).

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] `title` is always visible as a heading
- [ ] `breadcrumbs` slot renders above the title when provided
- [ ] `actions` slot renders at the trailing edge of the title row when provided
- [ ] Layout remains correct when neither `breadcrumbs` nor `actions` are supplied
- [ ] `sx` prop is forwarded to the root element

## Phase

Phase: `J` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
