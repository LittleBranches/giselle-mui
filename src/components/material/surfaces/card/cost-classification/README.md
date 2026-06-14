# CostClassificationCard

## Why it exists

Business and investment dashboards often need to distinguish between different cost accounting categories — capital expenditure versus operating expenditure, or investment versus opportunity cost — rather than just listing amounts. Without this component, developers hand-roll a Paper with a custom chip-per-category layout, implement amortisation note rendering, calculate totals manually, and repeat that structure on every screen that surfaces classified cost data. The amortisation note pattern (`Amortized over N months`) is especially easy to get wrong or forget to display consistently.

## Why it belongs in giselle-mui

Cost classification is a generic accounting concern that appears in project management tools, SaaS pricing calculators, procurement dashboards, and financial planning apps. The `CostCategory` union type ships with common values but is intentionally open via `CostCategory | (string & {})`, meaning it does not prescribe a domain. Any app that groups costs by type can use this component without modification.

## Design decisions

TBD — filled in during implementation.

## Related

- [BudgetBreakdownCard](../budget-breakdown/README.md) — breaks down a budget by spend category rather than by accounting classification
- [RoiComparisonCard](../roi-comparison/README.md) — presents material and non-material returns that are often driven by the same classified cost data

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `title: string` — card heading
- `items: CostClassificationItem[]` — each item has `label`, `amount`, `category` (`'capex' | 'opex' | 'investment' | 'opportunity'` or custom string), optional `amortizedMonths` (renders an amortisation note when set), and optional `color` (MUI palette key)
- `totalLabel?: string` — label beside the summed total, e.g. `'Total investment'`
- `currency?: string` — currency symbol or code
- Extends `PaperProps` (minus `children`)

**Visual description:** A Paper card with a title, a list of cost items each decorated with a coloured category chip and a label/amount row. Items with `amortizedMonths` display a secondary line (`Amortized over N months`). The footer row shows the optional `totalLabel` alongside the summed total.

**Reference component substituted:** Custom bespoke cost breakdown cards common in fintech and procurement dashboard projects.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`title`, `items`)
- [ ] Each item displays a chip using the specified `color` palette key, defaulting to `'primary'`
- [ ] When `amortizedMonths` is set on an item, renders an `Amortized over N months` note below the item label
- [ ] Footer total is only rendered when `totalLabel` is provided
- [ ] `currency` is applied to all `amount` values and the total
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `H-G7` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
