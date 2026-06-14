# ExpenseCategoryGroup

## Why it exists

Expense reports and budget breakdowns group line items under named categories — Flights, Accommodation, Software, CAPEX — each with a subtotal and a visual accent colour. Without a shared grouping component, developers manually assemble a header with a coloured chip, a subtotal aligned to the right, and a collapsible or flat list of child rows, duplicating the layout and colour logic for every category type across different financial screens.

## Why it belongs in giselle-mui

Budget tracking, expense reporting, and financial dashboards are common across SaaS, fintech, and internal tooling. The `ExpenseCategoryGroup` props (`label`, `total`, `currency`, `color`, `children`) carry no domain assumptions beyond the concept of a named, coloured group with a total — making it reusable across any product that categorises costs.

## Design decisions

TBD — filled in during implementation.

## Related

- [ExpenseLineItem](../expense-line-item/README.md) — the individual row component designed to be composed as children of this group
- [AmortizationTable](../amortization-table/README.md) — complementary for showing how a total cost distributes over time

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `label: string` — category heading displayed at the top of the group (e.g. `'Flights'`, `'CAPEX'`)
- `total: number | string` — the subtotal for this category; displayed alongside the label
- `currency?: string` — currency symbol or code for formatting the total
- `color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'` — MUI palette key for the category accent colour; defaults to `'primary'`
- `children?: ReactNode` — `ExpenseLineItem` children rendered beneath the group header
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A card or section container with a header row showing the category label in the accent colour on the left and the formatted total on the right. Below the header, the `children` slot renders the individual line items (typically `ExpenseLineItem` components) in a list layout. The accent colour is applied to the label text or a leading colour indicator, using the MUI palette key provided.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] `label` is displayed in the group header
- [ ] `total` is displayed formatted with `currency` when provided
- [ ] `color` applies the correct MUI palette accent to the header indicator
- [ ] `children` render beneath the header when provided
- [ ] No children area renders when `children` is not passed
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `I-A` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
