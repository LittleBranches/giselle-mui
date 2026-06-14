# ActivityFeedList

## Why it exists

Dashboards frequently need a chronological stream of user or system events — "Alice commented", "Build passed", "Invoice approved at 14:32". Without a shared component, every team hand-rolls a MUI `List` with avatar fallbacks, timestamp formatting, and optional status badges, producing slightly different spacing, inconsistent initials logic, and duplicated markup across features.

## Why it belongs in giselle-mui

Any product with multi-user activity — project management tools, CRMs, audit dashboards, CI/CD pipelines — needs exactly this feed shape. The data schema (`id`, `avatar`, `primary`, `secondary`, `timestamp`, `status`) is generic enough to represent notifications, audit logs, comments, or build events without modification.

## Design decisions

TBD — filled in during implementation.

## Related

- [NewsFeedList](../news-feed-list/README.md) — similar list structure but image-first and news-oriented rather than avatar-driven
- [ContactsList](../contacts-list/README.md) — avatar + name rows without the timestamp/status concerns

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `items: ActivityFeedItem[]` — the ordered list of feed events to render
- `ActivityFeedItem.id: string` — React list key
- `ActivityFeedItem.avatar?: string` — avatar image URL; falls back to initials derived from `primary` when absent
- `ActivityFeedItem.primary: string` — main event label (e.g. actor name or event title)
- `ActivityFeedItem.secondary?: string` — supporting detail line beneath primary
- `ActivityFeedItem.timestamp: string` — relative or absolute timestamp string rendered as-is
- `ActivityFeedItem.status?: StatusLabelStatus` — optional status badge from the `StatusLabel` component
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A scrollable vertical list where each row shows a leading avatar (circular image or two-letter initials fallback), a text block with a primary label and optional secondary line, a trailing timestamp, and an optional `StatusLabel` badge aligned to the right. Rows are separated by a thin divider. The list renders all items without pagination.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Avatar falls back to initials when `avatar` is absent
- [ ] `timestamp` is rendered as-is without transformation
- [ ] `status` renders a `StatusLabel` badge when provided
- [ ] `secondary` is omitted from the DOM when not passed
- [ ] Each row uses `id` as the React key (no console key warnings)
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `H-G3` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
