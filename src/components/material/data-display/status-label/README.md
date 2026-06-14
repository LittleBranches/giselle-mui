# StatusLabel

## Why it exists

Workflow status values — active, pending, overdue, cancelled, and so on — appear throughout
data-display UIs: tables, cards, list items, detail panels. Without a shared component, every
rendering site must independently resolve which MUI palette key maps to which status, compute
the soft-tint chip style (16% opacity of the palette colour's main channel), and hard-code the
canonical display label. This duplication produces inconsistent tinting, mismatched colours
between screens, and label text that drifts out of sync when the status vocabulary changes.

## Why it belongs in giselle-mui

Status indicators are domain-agnostic — a "pending" chip looks identical whether it describes
a task, a payment, a review request, or a deployment. The component accepts a `status` string
from a fixed set, derives colour and label from `STATUS_CONFIG`, and forwards all standard MUI
`Chip` props. Any project that displays workflow state can adopt it without coupling to
application-specific logic.

## Design decisions

**Soft-tint via palette channel.** The chip background is `rgba(<color>.mainChannel / 0.16)`,
matching the soft variant pattern used across the Giselle design system. This is computed in
`statusChipSx` using MUI CSS variables so the tint responds to theme and dark-mode switches
automatically.

**`STATUS_CONFIG` as the single source of truth.** Both the display label and the palette key
live in one record in `status-label.const.ts`. Adding or renaming a status is a one-line change
there; no other file needs to be updated.

**`'default'` colour special-case.** The `inactive` status uses `'default'`, which is not a
real MUI palette key. `statusChipSx` detects this and falls back to the grey 500 channel.
This keeps the API clean — callers pass a `status`, not a colour.

**Label override.** The `label` prop lets the caller supply a contextual string (e.g.
`"Awaiting approval"` instead of `"Pending"`) while preserving the colour mapping. Useful when
the display copy must differ from the canonical status vocabulary.

**`forwardRef`.** The component forwards a `ref` to the root `<div>` so it can be used as an
MUI Tooltip anchor or as a test handle without a wrapper element.

**Storybook:** `Material/Data Display/Status Label`
Stories: `Default`, `CustomLabel`, `AllStatuses`, `Responsive`.

## Related

- [MUI Chip](https://mui.com/material-ui/react-chip/) — root element
- [GiselleIcon](../../icon/giselle/README.md) — icon primitive used elsewhere in the
  data-display layer

---

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
