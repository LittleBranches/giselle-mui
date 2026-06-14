# FloatingControlBar

## Why it exists

Detail pages and editors often show a contextual action bar that appears only when there is
something to act on — unsaved changes, a selection, a pending operation — and hides itself
when there is not. Without a shared component, developers wire this with a `Paper` or `Box`
positioned fixed at the bottom of the screen, a Framer Motion `AnimatePresence` exit
animation, manual z-index management, and repeated conditional rendering logic. Every
implementation makes slightly different spacing, animation, and positioning choices.
`FloatingControlBar` provides a single animated container that slides in and out based on a
`visible` prop, so callers only supply the action buttons.

## Why it belongs in giselle-mui

Contextual floating toolbars appear in any application that has an editing or multi-select
surface — form editors, data tables with bulk actions, rich-text editors, canvas tools. The
animation and positioning logic is UI-layer infrastructure, not application logic, making it
an appropriate shared primitive for any MUI project.

## Design decisions

TBD — filled in during implementation.

## Related

- [MUI Paper](https://mui.com/material-ui/react-paper/) — likely root surface element
- [Framer Motion AnimatePresence](https://www.framer.com/motion/animate-presence/) — exit animation primitive referenced in types

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `children?: ReactNode` — action buttons or controls rendered inside the bar
- `visible?: boolean` — when `false`, the bar slides out via `AnimatePresence` exit animation; `@default true`
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element

**Visual description:** A pill-shaped or rectangular `Paper` surface fixed at the bottom
centre of the viewport, slightly elevated. Action buttons are laid out horizontally inside
it. When `visible` transitions from `true` to `false`, the bar animates out (slides down or
fades). When it transitions back to `true`, it animates in.

**Reference component substituted:** Custom bottom-of-screen floating toolbars in editor
and detail-page components (no single closed-source reference).

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] Bar is visible and positioned at the bottom of the viewport when `visible` is `true`
- [ ] Bar animates out when `visible` changes to `false`
- [ ] Bar animates back in when `visible` changes to `true`
- [ ] `children` are rendered inside the bar
- [ ] Renders correctly without `children`
- [ ] `sx` prop is forwarded to the root element

## Phase

Phase: `E` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
