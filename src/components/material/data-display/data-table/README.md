# DataTable

## Why it exists

Most admin and dashboard screens need a generic tabular data view: typed columns with configurable alignment and width, rows from any record shape, and a per-row action menu. The MUI `Table` primitive covers the DOM structure but leaves column configuration, typed row mapping, and action menus entirely to the consumer. Every hand-rolled table duplicates that wiring, producing inconsistent column widths, alignment handling, and action menu patterns across an app.

## Why it belongs in giselle-mui

Tabular data views appear in virtually every business application — transaction histories, user management screens, order lists, inventory tables. The generically typed `DataTableColumn<K>` / `rows: Array<Record<K, ReactNode>>` API works for any record shape without coupling to any domain.

## Design decisions

TBD — filled in during implementation.

## Related

- [AmortizationTable](../amortization-table/README.md) — a specialised fixed-schema table for amortization periods
- [ExpenseCategoryGroup](../expense-category-group/README.md) — grouped expense rows as an alternative to a flat table

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `columns: DataTableColumn<K>[]` — ordered column definitions
- `DataTableColumn.key: K` — maps to the corresponding key in each row record
- `DataTableColumn.label: string` — column header text
- `DataTableColumn.width?: string` — CSS width value for the column (e.g. `'120px'`, `'20%'`)
- `DataTableColumn.align?: 'left' | 'center' | 'right'` — cell text alignment; defaults to `'left'`
- `rows: Array<Record<K, ReactNode> & { id: string | number }>` — row data; each key maps to a column; `id` is the React key and is used by `renderActions`
- `renderActions?: (id: string | number) => DataTableRowAction[]` — factory returning action menu items for a given row
- `DataTableRowAction.label: string` — menu item display text
- `DataTableRowAction.icon?: ReactNode` — optional leading icon in the menu item
- `DataTableRowAction.onClick: () => void` — action handler
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A full-width MUI table with a header row showing column labels and an optional trailing "actions" header cell. Each data row maps record values to cells according to the column definitions, with alignment applied per column. When `renderActions` is provided, a trailing cell renders an icon button that opens a dropdown menu of the returned actions. Rows use `id` as the React key.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Column headers match `DataTableColumn.label` values in order
- [ ] Cell content aligns per `DataTableColumn.align` (defaults to left)
- [ ] `DataTableColumn.width` is applied to the correct column
- [ ] Row values render in the correct cells according to column `key`
- [ ] Each row uses `id` as the React key (no console key warnings)
- [ ] `renderActions` trailing cell opens a menu with the returned actions when clicked
- [ ] No actions column renders when `renderActions` is not provided
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `H-G3` | Priority tier: `T1`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
