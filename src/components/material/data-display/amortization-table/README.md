# AmortizationTable

## Why it exists

Financial applications frequently need to display loan or asset cost breakdowns across periods — showing how a total cost is distributed month by month or quarter by quarter. Without a shared component, developers wire together a MUI `Table` with manual number formatting, period column generation, and an optional chart slot every time, producing inconsistent currency rendering and layout across different loan or depreciation screens.

## Why it belongs in giselle-mui

Any app that deals with loans, lease agreements, capital expenditure schedules, or subscription cost projections needs this pattern. The props (`title`, `totalCost`, `periodLabel`, `periods`, `currency`, `chart`) are domain-neutral and map directly to amortization concepts without coupling to any specific financial product.

## Design decisions

TBD — filled in during implementation.

## Related

- [ExpenseCategoryGroup](../expense-category-group/README.md) — groups expense line items with a category total, complementary for cost breakdowns
- [ProgressStatsList](../progress-stats-list/README.md) — period-by-period progress bars as an alternative visual for budget tracking

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `title: string` — heading displayed at the top of the table card
- `totalCost: number` — the total amount being amortized
- `periodLabel: string` — column header for the period axis, e.g. `'Month'` or `'Quarter'`
- `periods: number` — total number of amortization periods; controls how many rows the table generates
- `currency?: string` — currency symbol or code used when formatting amounts; defaults to implementation choice
- `chart?: ReactNode` — optional slot for a bar chart showing the amortization curve above or beside the table
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A card-style container with a title, a summary of total cost, and a data table listing each period (1 to `periods`) with its proportional cost amount formatted in the given currency. An optional chart slot above the table renders whatever node is passed (typically a bar chart of the amortization curve). Rows alternate or use a standard MUI table style.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Table has exactly `periods` rows
- [ ] `periodLabel` appears as the first column header
- [ ] `totalCost` and per-period amounts display using `currency` when provided
- [ ] `chart` slot renders when provided and is absent when not passed
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `H-G7` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
