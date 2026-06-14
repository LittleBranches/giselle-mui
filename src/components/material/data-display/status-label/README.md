# StatusLabel

## Why it exists

Workflow status values — active, pending, overdue, cancelled, done, review, inactive — appear throughout dashboards, data tables, and list views. Without a shared component, developers repeatedly hand-roll a chip or badge, choose arbitrary colours, pick inconsistent labels, and forget to forward `ref` for tooltip anchoring. `StatusLabel` maps a `status` string to an MUI palette key and canonical label, renders it as a soft-tinted `Chip`, and forwards `ref` so consumers can anchor tooltips or popovers to it.

## Why it belongs in giselle-mui

Status labels are a cross-cutting concern in any application with workflow data. The seven-status vocabulary (`active`, `pending`, `review`, `done`, `overdue`, `cancelled`, `inactive`), the 16% palette tint formula, and the consistent chip sizing are design-system-level decisions that belong in the shared component library rather than in individual project codebases.

## Design decisions

- **Soft-variant tint formula.** The chip background is `rgba(<color.mainChannel> / 0.16)` — matching the soft variant pattern used throughout the design system — rather than a MUI built-in variant, which would produce a heavier fill.
- **`'default'` status handled separately.** `'default'` is not a real MUI palette key. `statusChipSx` detects it and falls back to the grey 500 channel so the component does not throw a missing-palette-key error.
- **`label` prop override.** Consumers can pass a custom `label` to override the canonical default (e.g. `"Awaiting approval"` instead of `"Pending"`). The status-to-colour mapping still applies; only the display text changes.
- **`React.forwardRef`.** `ref` is forwarded to the root `<div>` of the MUI Chip so the component can be used as a tooltip anchor or popover target without an extra wrapper.
- **`size` defaults to `'small'`.** The canonical use case is a compact status indicator in a table cell or list item. Consumers can override to `'medium'` when the label needs to be more prominent.

Stories: [Material/Data Display/Status Label](./status-label.stories.tsx)

## Related

- [DataTable](../data-table/README.md) — common host for `StatusLabel` in a table cell
- [ActivityFeedList](../activity-feed-list/README.md) — uses status-like indicators in feed items
- [MUI Chip](https://mui.com/material-ui/react-chip/) — underlying primitive

---

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
