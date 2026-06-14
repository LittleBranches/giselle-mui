# DetailsDrawer

## Why it exists

Dashboards and data-heavy UIs often reveal contextual detail for a selected item in a side drawer rather than navigating to a new page. Without this component, developers individually wire a MUI `Drawer` with a consistent title header, close button, and inner content area for each detail panel in their app — duplicating the same anchor, title, and padding structure across every drawer in the product.

## Why it belongs in giselle-mui

A titled side drawer with a standard header and content slot is a layout primitive that recurs in any detail-on-select pattern: clicking a table row, selecting a list item, or expanding a map pin. The component owns only the shell (Drawer + title header + content area); all rendered content is passed via `children`, making it applicable across any domain without modification.

## Design decisions

TBD — filled in during implementation.

## Related

- [ScenarioComparison](../scenario-comparison/README.md) — an interactive analysis surface that may be presented inside a details drawer
- [ProfileSummaryCard](../card/profile-summary/README.md) — a compact profile card that could be rendered as the content of a user details drawer

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `title?: string` — header text rendered at the top of the drawer; omitted when not provided
- `children?: ReactNode` — the drawer body content
- Extends `DrawerProps` (minus `children` to avoid type conflict; the component re-exposes `children` as its own prop)

**Visual description:** A MUI Drawer (defaulting to `anchor="right"`) with a fixed header row containing the optional title text and a close/dismiss affordance. Below the header is a scrollable content area that renders `children`. The header is sticky so it remains visible when the content overflows.

**Reference component substituted:** Replaces hand-rolled `Drawer` + header patterns that are duplicated per detail panel in dashboard codebases.

**Acceptance criteria:**
- [ ] Renders correctly with no props (acts as a bare drawer shell)
- [ ] `title` is rendered in the header when provided; header still renders without a title
- [ ] `children` renders in the scrollable body area below the header
- [ ] Drawer open/close behaviour is controlled by the inherited `open` and `onClose` props from `DrawerProps`
- [ ] Component forwards all remaining `DrawerProps` to the underlying MUI Drawer

## Phase

Phase: `F` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
