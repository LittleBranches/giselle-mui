# ProgressStatsList

## Why it exists

KPI dashboards, budget trackers, and goal-tracking screens frequently show a list of metrics where each item has a label, a formatted value, and a colour-coded progress bar indicating percentage completion. Without a shared component, developers wire a MUI `LinearProgress` alongside typography for each metric, manually map palette keys to progress colours, and align the value text — duplicating the same pattern across every stats widget in an app.

## Why it belongs in giselle-mui

Progress-bar metric lists appear in project tracking tools, fitness apps, sales dashboards, budget monitors, and HR platforms. The `ProgressStatsItem` schema (`label`, `value`, `percentage`, `color`) carries no domain assumptions and maps to any "X% of Y achieved" scenario without modification.

## Design decisions

TBD — filled in during implementation.

## Related

- [AmortizationTable](../amortization-table/README.md) — an alternative for showing financial progression over fixed periods in tabular form
- [ExpenseCategoryGroup](../expense-category-group/README.md) — colour-accented category grouping for cost breakdowns, complementary to budget progress stats

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `items: ProgressStatsItem[]` — the list of statistics to render
- `ProgressStatsItem.label: string` — metric name displayed beside the progress bar
- `ProgressStatsItem.value: string | number` — formatted display value shown alongside the label (e.g. `'$4,200'`, `'42%'`)
- `ProgressStatsItem.percentage: number` — progress value from 0 to 100; drives the `LinearProgress` fill width
- `ProgressStatsItem.color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'` — MUI palette key for the `LinearProgress` colour; defaults to `'primary'`
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A vertical list where each row shows the metric label and formatted value as a text header line, followed immediately by a full-width `LinearProgress` bar filled to the given `percentage` in the specified palette colour. Rows stack vertically with consistent spacing between them. The list renders all items without pagination.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] `label` and `value` are displayed together above the progress bar
- [ ] `LinearProgress` fill matches `percentage` (0–100)
- [ ] `color` applies the correct MUI palette colour to the progress bar
- [ ] Default colour is `'primary'` when `color` is not passed
- [ ] Each item renders independently without shared state between items
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `H-G4` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
