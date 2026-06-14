# AnimatedTabPanel

## Why it exists

When switching between tab content with MUI `Tabs`, the default behaviour is an instant
content swap with no transition. Without this component, a developer must manually wire
`AnimatePresence` from framer-motion, key each panel on the active index, choose sensible
enter/exit variants, and guard against layout shift during the cross-fade. That boilerplate
is identical every time tabs appear in an interface.

## Why it belongs in giselle-mui

Tab panels with animated transitions appear in any multi-section UI — dashboards, settings
screens, profile pages, onboarding wizards. The component depends only on framer-motion and
MUI's `Box`; it has no opinion about what tab labels look like or how navigation is managed.
Any project that uses `giselle-mui` and reaches for `Tabs` can drop this in without
app-specific wiring.

## Design decisions

TBD — filled in during implementation.

## Related

- [MotionContainer](../container/README.md) — stagger container used by animated children
- [MotionViewport](../viewport/README.md) — scroll-triggered sibling

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `activeIndex: number` — keys the `AnimatePresence` transition; changing it triggers exit on the old panel and enter on the new one
- `children: ReactNode` — the content to render inside the active panel
- `sx?: SxProps<Theme>` — forwarded to the root `Box` (via `BoxProps`)

**Visual description:** A wrapper around a single tab's content area. When `activeIndex`
changes, the outgoing panel fades or slides out while the incoming panel fades or slides in.
The transition is driven by framer-motion `AnimatePresence` with a unique key per index so
React mounts/unmounts correctly. The root is a `Box` with `overflow: hidden` to prevent
content from overflowing during the transition.

**Reference component substituted:** Closed-source animated tab switcher used in portfolio
detail pages.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`activeIndex`, `children`)
- [ ] `activeIndex` change triggers exit animation on outgoing content and enter animation on incoming content
- [ ] No layout jump during the transition (root element constrains overflow)
- [ ] Works correctly when `activeIndex` skips non-adjacent values (e.g. 0 → 3)
- [ ] `sx` prop is forwarded to the root `Box`
- [ ] Passes existing unit test in `animated-tab-panel.test.ts`

## Phase

Phase: `H-G6` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
