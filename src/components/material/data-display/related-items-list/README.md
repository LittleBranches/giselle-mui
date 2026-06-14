# RelatedItemsList

## Why it exists

Detail pages — for a project, a deal, a property, or a user — commonly need a panel showing related entities grouped into categories, each with a small icon, a name, a sub-label, and a set of key statistics. Without a shared component, developers build a custom tab bar to switch between categories and a custom list beneath it for each category, duplicating tab state management, icon layout, and stats rendering for every "related X" section in an app.

## Why it belongs in giselle-mui

Tabbed related-items panels are a recurring pattern in CRMs, project management tools, real estate platforms, e-commerce admin, and investment dashboards. The `RelatedItemsListProps` API (`tabs`, `itemsByTab`, `RelatedItem.stats`) is fully generic — it carries no assumptions about what the items represent and works for any grouped relationship with key-value statistics.

## Design decisions

TBD — filled in during implementation.

## Related

- [ContactsList](../contacts-list/README.md) — a simpler flat list of named people without tab navigation or stats
- [ActivityFeedList](../activity-feed-list/README.md) — an event-driven list for the same detail-panel context when chronological ordering matters

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `tabs: string[]` — tab label strings; one tab per category, matched by index to `itemsByTab`
- `itemsByTab: RelatedItem[][]` — items grouped by category; `itemsByTab[i]` is the item array for `tabs[i]`
- `RelatedItem.id: string` — React list key
- `RelatedItem.name: string` — primary display name for the item
- `RelatedItem.subLabel?: string` — secondary descriptor line beneath the name (e.g. role, type, location)
- `RelatedItem.icon?: ReactNode` — optional leading icon slot for the item row
- `RelatedItem.stats: RelatedItemStat[]` — array of key-value stat pairs displayed inline with the item
- `RelatedItemStat.label: string` — stat label (e.g. `'Revenue'`, `'Stage'`)
- `RelatedItemStat.value: string | number` — stat value to display beside the label
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A container with a tab bar at the top showing the `tabs` labels. The active tab's `itemsByTab` array is rendered as a vertical list beneath it. Each row shows an optional leading icon, the item name as the primary text, an optional `subLabel` secondary line, and a row of label-value stat chips or inline text pairs. Switching tabs replaces the list with the items for the selected tab.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Tab bar shows all `tabs` labels
- [ ] Switching tabs renders the corresponding `itemsByTab` array
- [ ] `RelatedItem.name` is the primary text in each row
- [ ] `subLabel` renders as a secondary line when provided and is absent when not passed
- [ ] `icon` renders in the leading slot when provided
- [ ] All `stats` label-value pairs render for each item
- [ ] Each item uses `id` as the React key (no console key warnings)
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `H-G3` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
