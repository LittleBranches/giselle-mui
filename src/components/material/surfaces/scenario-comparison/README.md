# ScenarioComparison

## Why it exists

Business decision tools and financial planning apps often need an interactive surface where a user can tweak input variables (toggles, sliders, selects) and immediately see how the computed outcomes change. Without this component, developers hand-roll a form with mixed input types, manage a `values` state object, call a compute function on every change, and wire the formatted output back to display cells — repeating that state management and rendering plumbing for each what-if analysis screen they build.

## Why it belongs in giselle-mui

The scenario-comparison pattern — configurable input variables, pure compute function, formatted outcome display — is a generic modelling primitive that recurs in financial planning tools, pricing calculators, project estimators, sustainability dashboards, and operations tools. The component owns only the input/output wiring and layout; business logic lives entirely in the consumer-supplied `compute` function, keeping the component domain-neutral.

## Design decisions

TBD — filled in during implementation.

## Related

- [ROIComparisonCard](../card/roi-comparison/README.md) — static ROI display surface that often presents the output of a scenario comparison
- [CostClassificationCard](../card/cost-classification/README.md) — cost breakdown card that may surface inputs feeding into a scenario model

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `title?: string` — optional panel heading
- `variables: ScenarioVariable[]` — input definitions; each has `key`, `label`, `type` (`'toggle' | 'range' | 'select'`), `defaultValue`, optional `options` (for select: label/value objects; for range: `[min, max]` tuple), and optional `step` (range step, defaults to `1`)
- `compute: (values: Record<string, unknown>) => ScenarioOutcome[]` — pure function called with current values; must have no side effects
- `outcomes: ScenarioOutcomeDefinition[]` — output display definitions; each has `key`, `label`, `format` (`'currency' | 'days' | 'percent' | 'text'`), and optional `currency`
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A panel with an optional title, a controls section where each variable is rendered as the appropriate input (Switch for `toggle`, Slider for `range`, Select for `select`), and an outcomes section where each `ScenarioOutcomeDefinition` is displayed as a labelled value formatted according to its `format` type. The outcomes update in real time as the user adjusts the controls. The two sections may be laid out side by side on wider viewports or stacked on narrow ones.

**Reference component substituted:** Replaces custom-built what-if calculators and scenario modelling widgets that are typically built one-off per product in consultant-facing and financial planning dashboards.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`variables`, `compute`, `outcomes`)
- [ ] Each variable renders the appropriate MUI input for its `type`
- [ ] `compute` is called with the current values map on every input change and on initial render
- [ ] Outcomes are formatted according to their `format` type (`currency` includes the `currency` symbol, `percent` appends `%`, `days` appends `days`, `text` renders verbatim)
- [ ] `title` is rendered as a heading when provided; omitted when absent
- [ ] Component accepts and applies `sx` to the root element

## Phase

Phase: `H-G7` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
