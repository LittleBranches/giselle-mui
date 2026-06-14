# NewsFeedList

## Why it exists

Content dashboards, media monitors, and aggregator widgets need a scannable list of news items — each with a headline, an optional snippet, a timestamp, and a thumbnail image. Without a shared component, developers manually lay out an image alongside text in a list row, handle missing thumbnails, and apply consistent type hierarchy, duplicating the same pattern across every "latest news" or "recent articles" widget in an application.

## Why it belongs in giselle-mui

News or content feed widgets appear in media platforms, research tools, investor dashboards, internal communications products, and any app that surfaces external or user-generated articles. The `NewsFeedItem` schema (`id`, `title`, `snippet`, `timestamp`, `imageSrc`) is domain-neutral and covers any card-style content feed without modification.

## Design decisions

TBD — filled in during implementation.

## Related

- [ActivityFeedList](../activity-feed-list/README.md) — similar chronological list but avatar-driven and event-oriented rather than image + headline

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `items: NewsFeedItem[]` — the ordered list of news items to render
- `NewsFeedItem.id: string` — React list key
- `NewsFeedItem.title: string` — headline text rendered as the primary line
- `NewsFeedItem.snippet?: string` — optional short summary or excerpt displayed beneath the title
- `NewsFeedItem.timestamp: string` — relative or absolute timestamp string rendered as-is
- `NewsFeedItem.imageSrc?: string` — thumbnail image URL; the image slot is omitted when absent
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A vertical list where each row displays a leading thumbnail image (when provided) on the left, with a text block on the right containing the headline as the primary line, the snippet as a secondary line in a smaller muted style, and the timestamp below. Rows are separated by a thin divider. When `imageSrc` is absent, the text block spans the full row width. The list renders all items without pagination.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] `title` renders as the primary text in each row
- [ ] `snippet` renders beneath `title` in a secondary style when provided
- [ ] `snippet` is absent from the DOM when not passed
- [ ] `imageSrc` renders a thumbnail image when provided
- [ ] The image slot is absent from the DOM when `imageSrc` is not passed
- [ ] `timestamp` is rendered as-is without transformation
- [ ] Each row uses `id` as the React key (no console key warnings)
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `H-G3` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
