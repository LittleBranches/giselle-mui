# ContactsList

## Why it exists

People directories, teammate rosters, and CRM contact panels all need the same list: avatar, name, optional email, and a per-row action slot (call, message, view profile). Developers who build this ad hoc each time end up with slightly different avatar sizes, inconsistent initials generation, and action slots that aren't consistently aligned — making a unified contacts pattern valuable even before any design-system consistency requirements apply.

## Why it belongs in giselle-mui

Contact directories are a cross-cutting concern that appears in HR tools, CRMs, project management apps, team dashboards, and scheduling products. The `ContactItem` shape (`id`, `name`, `email`, `avatarSrc`, `action`) is entirely generic and carries no app-specific business logic.

## Design decisions

TBD — filled in during implementation.

## Related

- [AvatarRow](../avatar-row/README.md) — horizontal avatar strip for participant selection rather than directory browsing
- [ActivityFeedList](../activity-feed-list/README.md) — avatar-driven rows with timestamps and status, for event feeds

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `items: ContactItem[]` — the list of contacts to render
- `ContactItem.id: string` — React list key
- `ContactItem.name: string` — contact's display name; also used to derive initials
- `ContactItem.email?: string` — secondary line beneath the name
- `ContactItem.avatarSrc?: string` — avatar image URL; falls back to initials when absent
- `ContactItem.action?: ReactNode` — optional trailing slot per row (e.g. a message icon button or phone icon)
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A vertical list where each row displays a leading circular avatar (image or initials), a text block with the contact's name as the primary line and email as the secondary line, and an optional trailing action node right-aligned in the row. Rows are separated by a thin divider. The list renders all items without pagination.

**Reference component substituted:** Not confirmed.

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Avatar falls back to initials derived from `name` when `avatarSrc` is absent
- [ ] `email` renders as a secondary line when provided and is absent from the DOM when not passed
- [ ] `action` node renders trailing in the row when provided
- [ ] Each row uses `id` as the React key (no console key warnings)
- [ ] `sx` is forwarded to the root container

## Phase

Phase: `H-G4` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
