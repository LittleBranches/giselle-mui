# ExpenseLineItem

## Why it exists

Individual line items in an expense report or budget breakdown all share the same layout: a label on the left, an amount on the right, an optional description beneath the label, and a visual signal when the amount exceeds a budget. Without a shared component, this row is recreated in every financial screen with slightly different spacing, currency formatting, and overrun colour logic — making it impossible to update the pattern consistently across an app.

## Why it belongs in giselle-mui

Individual cost rows are used in invoices, receipts, expense reports, budget trackers, and quote builders across virtually every business domain. The `ExpenseLineItem` props (`label`, `amount`, `description`, `currency`, `overrun`) carry no domain-specific meaning and compose naturally into any financial list.

## Design decisions

TBD — filled in during implementation.

## Related

- [ExpenseCategoryGroup](../expense-category-group/README.md) — the parent grouping component designed to wrap collections of `ExpenseLineItem` children

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `label: string` — the line item name displayed on the left (e.g. `'Flight SYD–LAX'`, `'Contractor hours'`)
- `amount: number | string` — the cost value for this line item; displayed on the right
- `description?: string` — optional supporting detail line beneath the label
- `currency?: string` — currency symbol or code for formatting `amount`
- `overrun?: boolean` — when `true`, renders the amount in the error (red) palette colour to signal a budget overrun
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A single horizontal row with the label left-aligned and the formatted amount right-aligned on the same baseline. When `description` is provided, it renders on a secondary line beneath the label in a smaller, muted style. When `overrun` is `true`, the amount text renders in the MUI error colour (red). The row has no divider of its own — dividers are managed by the parent container.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] `label` is left-aligned and `amount` is right-aligned in the same row
- [ ] `amount` is formatted with `currency` when provided
- [ ] `description` renders beneath `label` in a secondary style when provided
- [ ] `description` is absent from the DOM when not passed
- [ ] `overrun: true` renders the amount in the MUI error colour
- [ ] `overrun: false` or absent renders the amount in the default colour
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `I-A` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
