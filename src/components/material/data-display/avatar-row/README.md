# AvatarRow

## Why it exists

Many UIs need a horizontal strip of user avatars where one is highlighted as active — team member selectors, participant pickers, assignee choosers, and profile switchers. Without a shared component, developers re-implement the overlapping avatar layout, initials fallback, active-ring highlight, and selection callback separately in each feature, with small inconsistencies in ring colour, spacing, and keyboard accessibility.

## Why it belongs in giselle-mui

User selection from a small set of named participants is a universal UI pattern found in project tools, scheduling apps, messaging products, and collaborative editors. The `AvatarRow` props — `items`, `activeId`, `onSelect` — are entirely generic and carry no app-domain logic.

## Design decisions

TBD — filled in during implementation.

## Related

- [ContactsList](../contacts-list/README.md) — vertical list of contacts with avatars, for browsing rather than selecting
- [ActivityFeedList](../activity-feed-list/README.md) — avatars in a feed context, without the interactive selection concern

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `items: AvatarItem[]` — the list of people to display
- `AvatarItem.id: string` — unique key and the value passed to `onSelect`
- `AvatarItem.name: string` — used to derive initials when `avatarSrc` is absent
- `AvatarItem.avatarSrc?: string` — avatar image URL; falls back to initials when absent
- `activeId?: string` — the `id` of the currently selected avatar; renders a highlighted ring
- `onSelect?: (id: string) => void` — called when an avatar is clicked, receives the item's `id`
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A horizontal row of circular avatars rendered with slight overlap (or uniform spacing). The avatar matching `activeId` displays a distinct ring or border to indicate selection. Avatars without an image show two-letter initials centered on a coloured background. Clicking any avatar fires `onSelect` with that item's `id`.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Avatar falls back to initials derived from `name` when `avatarSrc` is absent
- [ ] The avatar with `id === activeId` renders a visible active indicator
- [ ] Clicking an avatar calls `onSelect` with the correct `id`
- [ ] No active indicator is shown when `activeId` is undefined
- [ ] Each avatar uses `id` as the React key (no console key warnings)
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `J` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
