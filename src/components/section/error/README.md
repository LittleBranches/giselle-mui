# ErrorSection

## Why it exists

Every application needs a consistent full-page error state for HTTP error codes (404, 500, etc.) and custom failure scenarios. Without this component, each app assembles its own error page from scratch — an illustration slot, a code badge, a title, a description, and a CTA button — with no shared baseline for layout or tone.

## Why it belongs in giselle-mui

Error pages share the same layout concerns across every project: centred content, an illustration slot, a readable hierarchy, and a single CTA. Nothing here is app-specific; the props accept any content through slots.

## Design decisions

TBD — filled in during implementation.

## Related

- [SectionPendingLoader](../feedback/section-pending-loader/README.md) — related loading/feedback state

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `code` — HTTP error code or custom string, defaults to `'404'`
- `title` — error heading text
- `description` — supporting explanation text
- `action` — CTA button slot (accepts any ReactNode, typically a MUI `<Button>`)
- `illustration` — illustration slot, defaults to a built-in error illustration

**Visual description:** Full-page centred layout. Illustration above, error code badge, title, description, and a CTA button below. Responsive — stacks vertically on mobile.

**Reference component substituted:** Proprietary `ErrorView` / `Page404` patterns found in closed-source dashboard templates.

**Acceptance criteria:**
- [ ] Renders with default `code='404'` when no code prop is provided
- [ ] Illustration slot renders built-in fallback when no `illustration` prop is passed
- [ ] `action` slot renders any ReactNode without wrapper styling interference
- [ ] All text props are optional — component renders without them
- [ ] `sx` prop forwarded to root `Box`

## Phase

Phase: `J` | Priority tier: `T1`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
