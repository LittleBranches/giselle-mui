# ErrorSection

## Why it exists

Applications inevitably need to display error states — 404 not found, 403 forbidden, 500 server errors, and custom application errors. Without a shared component, each project builds its own one-off layout: a centred container, an illustration slot, a heading, a description, and a CTA button. The markup is repetitive and the visual language diverges across projects. `ErrorSection` encapsulates the full-page error layout so developers drop in one component and configure it with props rather than reassembling the same structure by hand each time.

## Why it belongs in giselle-mui

Error pages are a universal concern — every consumer-facing application renders at least one. The component is entirely configuration-driven (`code`, `title`, `description`, `action`, `illustration`) with no business logic, making it safely reusable across any project. No project-specific routing, data-fetching, or domain language is embedded in the component.

## Design decisions

TBD — filled in during implementation.

## Related

- [section/faq](../faq/README.md) — another full-page section component in the same family

## Build spec

> Remove this section once the component ships.

**Props / types:**

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `code` | `string` | `'404'` | HTTP error code or custom string displayed prominently as the error identifier |
| `title` | `string` | — | Primary headline below the code |
| `description` | `string` | — | Supporting explanation shown beneath the title |
| `action` | `ReactNode` | — | CTA button slot — consumer passes a MUI `<Button>` or link element |
| `illustration` | `ReactNode` | — | Illustration slot — defaults to a built-in error illustration when omitted |
| `...BoxProps` | — | — | All MUI `BoxProps` (except `children` and `title`) forwarded to the root element |

**Visual description:** A vertically centred, full-width section with a large error code rendered in a visually prominent style (large, muted or accent typography). Below the code: a title, a description paragraph, and a CTA slot. Above or alongside the text an illustration is displayed — either the consumer-supplied node or a built-in fallback SVG. The layout stacks vertically on mobile and may expand to a two-column arrangement (illustration | text) on larger breakpoints. All spacing uses the MUI theme spacing scale.

**Reference component substituted:** App-specific error page layouts that manually compose a Box > Stack > Typography (code) > Typography (title) > Typography (description) > Button pattern — often duplicated per-project with inconsistent spacing and illustration handling.

**Acceptance criteria:**
- [ ] Renders `code`, `title`, `description`, and `action` when all props are provided
- [ ] Renders a built-in fallback illustration when `illustration` prop is omitted
- [ ] Renders the consumer-supplied `illustration` node when provided, replacing the fallback
- [ ] `code` defaults to `'404'` when not provided
- [ ] Root element forwards all `BoxProps` (excluding `children` and `title`) via spread
- [ ] Layout is responsive: stacks vertically on mobile, adjusts on larger breakpoints
- [ ] Passes TypeScript strict-mode checks with no `any` casts
- [ ] Exported from the section barrel `index.ts`
- [ ] `error-section.test.ts` passes

## Phase

Phase: `J` | Priority tier: `T1`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
