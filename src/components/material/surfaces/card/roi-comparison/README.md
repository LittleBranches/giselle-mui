# ROIComparisonCard

## Why it exists

Investment, consulting, and product-decision dashboards need to present return-on-investment in two distinct columns: quantifiable (material) returns with numeric values and trend indicators, and qualitative (non-material) returns described in text. Without this component, developers build a two-column Paper layout from scratch, manage the column separation logic, handle an optional bar chart slot for the material column, and map over heterogeneous item types — repeating that structure every time an ROI or value-case screen appears in an app.

## Why it belongs in giselle-mui

Distinguishing material from non-material outcomes is a generic analytical pattern that appears in business case tools, procurement dashboards, management consulting apps, project justification flows, and SaaS ROI calculators. The component's two-item-type API (`MaterialROIItem` vs `NonMaterialROIItem`) captures that distinction structurally, and the optional chart slot keeps the visual representation flexible. Nothing in the API is product-specific.

## Design decisions

TBD — filled in during implementation.

## Related

- [CostClassificationCard](../cost-classification/README.md) — classifies costs that often feed into the material-returns column of an ROI comparison
- [ScenarioComparison](../../scenario-comparison/README.md) — interactive scenario modelling surface that may drive the inputs for an ROI comparison

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `title: string` — card heading
- `materialItems: MaterialROIItem[]` — quantifiable returns; each has `label`, `value`, optional `unit`, and optional `trend` (number)
- `nonMaterialItems: NonMaterialROIItem[]` — qualitative returns; each has `label`, a text `value`, and optional `icon: ReactNode`
- `chart?: ReactNode` — optional bar chart slot rendered in the material column
- Extends `PaperProps` (minus `children`)

**Visual description:** A Paper card with a title and a two-column layout. The left column lists material (numeric) items, each with a label, a formatted value and unit, and an optional trend indicator; the optional `chart` slot renders above or below the material items list. The right column lists non-material items, each with an optional icon, a label, and a descriptive text value. A visual divider separates the two columns.

**Reference component substituted:** Bespoke ROI or value-case breakdown cards common in MUI paid business intelligence and consulting dashboard templates.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`title`, `materialItems`, `nonMaterialItems`)
- [ ] Material items display `value`, optional `unit`, and trend indicator when `trend` is provided
- [ ] Non-material items display `icon` when provided; omitted when absent
- [ ] `chart` slot renders any injected ReactNode in the material column without layout overflow
- [ ] Two-column layout is visually distinct with a separator between material and non-material sections
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `H-G7` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
