# AuthPageLayout

## Why it exists

Authentication screens — sign in, sign up, password reset — follow a well-established
two-panel convention: the form on one side, a decorative illustration or brand panel on
the other. Without a shared layout, every auth page reinvents the same responsive split:
a `Grid` or `Box` with two columns, a rule that collapses to one column on mobile, and
repeated decisions about which side the form lives on. `AuthPageLayout` encodes this
pattern once so auth pages only supply the form content and, optionally, the illustration
panel.

## Why it belongs in giselle-mui

Two-panel auth layouts appear in virtually every web application that has an authenticated
surface. The split-panel convention is design-system-level, not application-level — the
pattern is identical whether the product is a SaaS dashboard, an internal tool, or a
consumer app. The `reverse` prop handles the rare case where the illustration should
appear on the left.

## Design decisions

TBD — filled in during implementation.

## Related

- [AppShell](../app-shell/README.md) — shell layout for the authenticated section of the app
- [MUI Grid](https://mui.com/material-ui/react-grid/) — underlying layout primitive

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `children: ReactNode` — form content rendered on the primary side (left on desktop by default)
- `illustration?: ReactNode` — decorative or brand content for the secondary panel (right on desktop by default)
- `reverse?: boolean` — when `true`, illustration appears on the left and form on the right; `@default false`
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A full-viewport two-column layout. On desktop, the form panel and
illustration panel share the width (typically 50/50 or weighted). On mobile, the layout
collapses to a single column showing the form; the illustration is hidden or stacked above.
The `reverse` prop swaps the column order.

**Reference component substituted:** Custom two-panel auth wrappers found on login/signup
pages (no single closed-source reference).

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] `children` (form content) is always visible
- [ ] `illustration` panel renders on the right side of `children` by default
- [ ] `reverse={true}` places the illustration on the left and the form on the right
- [ ] Layout collapses to a single column on narrow (mobile) viewports
- [ ] `illustration` is not required — layout renders correctly without it

## Phase

Phase: `J` | Priority tier: `T1`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
