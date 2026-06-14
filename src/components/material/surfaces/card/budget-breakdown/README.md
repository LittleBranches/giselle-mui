# BudgetBreakdownCard

## Why it exists

Any dashboard that tracks spending needs to show how a total budget is divided across categories. Without this component, developers hand-code a Paper with a title, iterate over line items to render a colour indicator, a label, an amount, and an optional percentage bar, then manually position an optional donut chart alongside. The result is duplicated layout logic across every project that touches budget, expense, or cost data.

## Why it belongs in giselle-mui

The breakdown pattern — total figure, categorised line items with colour coding, optional donut chart slot — is equally applicable in personal finance apps, project cost dashboards, HR budget tools, and e-commerce analytics. The component has no domain-specific knowledge baked in; categories are consumer-supplied strings and the colour key maps to standard MUI palette keys, keeping it generic.

## Design decisions

TBD — filled in during implementation.

## Related

- [BalanceSummaryCard](../balance-summary/README.md) — summary-level card that typically sits above a breakdown
- [CostClassificationCard](../cost-classification/README.md) — classifies costs by type (capex/opex) rather than by category amount

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `title: string` — card heading
- `total: number | string` — total budget figure displayed as a summary
- `currency?: string` — currency symbol or code prepended/appended to amounts
- `items: BudgetItem[]` — line items; each has `label`, `amount`, optional `percentage`, and optional `color` (MUI palette key, defaults to `'primary'`)
- `chart?: ReactNode` — optional donut/pie chart slot rendered alongside the line items
- Extends `PaperProps` (minus `children`)

**Visual description:** A Paper card with a title and total at the top, followed by a list of line items. Each item shows a colour-coded indicator dot or bar, a category label, an amount, and an optional percentage. When `chart` is provided it renders in a panel alongside the item list. Layout is two-column when the chart is present, single-column otherwise.

**Reference component substituted:** Likely replaces a bespoke `FinanceWidgetExpensesCategories` or `BudgetOverviewCard` from MUI paid dashboard templates.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`title`, `total`, `items`)
- [ ] Each `BudgetItem` colour indicator uses the MUI palette key specified in `color`, falling back to `'primary'`
- [ ] `percentage` bar or label is omitted when `BudgetItem.percentage` is absent
- [ ] `chart` slot renders any injected ReactNode without distorting the line-item list
- [ ] `currency` is applied consistently to `total` and each item `amount`
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `H-G4` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
