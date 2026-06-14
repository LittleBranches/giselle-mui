# Breadcrumbs

## Why it exists

Breadcrumb trails appear on detail pages and nested routes to let users understand and
navigate the hierarchy above the current page. MUI's base `Breadcrumbs` component handles
the separator and collapse behaviour but expects callers to render each crumb as a raw `Link`
or `Typography` node. Without a shared wrapper, every usage must map its route array to
these nodes manually: check whether each item has an `href`, render a `Link` if so or a
`Typography` if it is the terminal crumb, and repeat this logic at each callsite.
`Breadcrumbs` encodes this mapping once — callers supply a flat `BreadcrumbItem[]` array
and the component handles the conditional link/text rendering.

## Why it belongs in giselle-mui

Breadcrumb navigation is a domain-agnostic UI primitive. The `BreadcrumbItem` model
(`label` + optional `href`) covers the only meaningful distinction — linked vs. terminal
crumb — across any application. The component extends MUI `Breadcrumbs` so its `maxItems`,
`separator`, and other props remain accessible.

## Design decisions

TBD — filled in during implementation.

## Related

- [PageHeader](../../layout/page-header/README.md) — page header component that hosts breadcrumbs in its `breadcrumbs` slot
- [MUI Breadcrumbs](https://mui.com/material-ui/react-breadcrumbs/) — root element

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `items: BreadcrumbItem[]` — ordered array of crumbs; each item has `label: string` and optional `href?: string`
- All `MuiBreadcrumbsProps` (except `children`) — forwarded to the underlying MUI `Breadcrumbs`

**Visual description:** A horizontal sequence of crumb labels separated by a `/` (or MUI
default separator). Items with `href` render as clickable links. The last item (terminal
crumb) renders as plain text with no link, indicating the current location. MUI's
`maxItems` collapse behaviour is preserved.

**Reference component substituted:** Inline MUI `Breadcrumbs` + manual `Link`/`Typography`
mapping at individual callsites (no single closed-source reference).

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Items with `href` render as links
- [ ] Items without `href` render as plain text
- [ ] Items are rendered in the order provided
- [ ] MUI `Breadcrumbs` separator is visible between items
- [ ] MUI `maxItems` prop collapses items when the array is long

## Phase

Phase: `J` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
