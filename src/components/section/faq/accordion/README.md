# FaqSection

## Why it exists

Every landing page FAQ section needs the same structure: animated accordions in a centred
column, a heading with gradient accent, and a contact footer. Getting the motion stagger,
the accordion tint-on-hover, and the decorative SVG elements right every time is non-trivial.
`FaqSection` encodes these decisions so consumers don't have to rediscover them.

## Why it belongs here

The pattern — animated section + accordion list + contact CTA — appears verbatim in product
sites, portfolio pages, and marketing pages. Any app that imports `giselle-mui/motion` can
drop this in and receive the full visual treatment from a single component.

## Design decisions

### framer-motion subpath

`FaqSection` is exported from `@littlebranches/giselle-mui/motion` (not the root import) because
it depends on `framer-motion`. Isolating it in a subpath ensures that apps which never use
animation don't pay the bundle cost.

### `motion(Accordion)` not `<Accordion component={motion.div}>`

Wrapping MUI Accordion with `motion(Accordion)` at module level:

- produces a stable component type (not re-created per render)
- is fully TypeScript-safe (no `any` casts needed)
- applies framer-motion directly to the Accordion root DOM node

### `motion.*` not `m.*`

The `m.*` API requires `<LazyMotion>` in the consumer's React tree — an invisible requirement
that silently breaks any app (including Storybook) that doesn't set it up. `motion.*` works
without a provider and is the correct choice for library components.

### Decorative SVGs: ≥1440 px only

`FaqFloatLine`, `FaqFloatPlusIcon`, and `FaqFloatTriangleDownIcon` are hidden via CSS below
1440 px. They are purely decorative and must never affect layout on mobile or tablet.

### Icon: string or ReactNode

`contactIcon` accepts both an Iconify string (rendered via `GiselleIcon`) and an arbitrary
`ReactNode`. This lets consumers use any icon source without requiring giselle-icon
pre-registration for simple emoji or SVG nodes.

### Contact footer: opt-in

The footer section is hidden unless `contactHref` is provided. Omitting `contactHref` is
safer than passing `hideContactFooter: true` — the default state is the simpler use case.

## Library safety

- No banned identifier names (`varAlpha`, `varFade`, `varBlur`)
- `channelAlpha` from `../../utils/theme-utils` replaces `varAlpha`
- No hardcoded hex or rgba literals — all colours use `theme.vars.palette` channels
- No personal content in stories

## File structure

```
faq-accordion.tsx          — JSX composition only
types.ts                   — FaqItem, FaqSectionProps
utils.ts                   — fadeVariants, containerVariants, svgLineTransition (no JSX)
faq-accordion.styles.ts    — sx constants and factories
faq-accordion.const.ts     — named size/spacing constants
faq-accordion-svg.tsx      — internal SVG decoration sub-components
faq-motion-viewport.tsx    — internal scroll-triggered animation wrapper
faq-accordion.stories.tsx  — Storybook stories
faq-accordion.test.ts      — Vitest unit tests
faq-accordion.styles.test.ts — mock-theme assertions for styles
index.ts                   — barrel
README.md                  — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- [`SectionTitle`](../../layout/section-title/README.md) — used for the heading block
- [`GiselleIcon`](../../icon/giselle/README.md) — used for the string contact icon
