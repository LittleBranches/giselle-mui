# QuoteCard

## Why it exists

A block-quote card is a common pattern for testimonials, cited excerpts, and inspirational
callouts. The details are easy to get wrong: decorative quote marks need `aria-hidden`,
the separator dot between author and source must hide when one part is absent, and the
tinted background must use CSS-variable channels so it adapts to both light and dark mode
without two separate colour sets. `QuoteCard` makes all of those decisions once.

## Why it belongs here

Testimonials, references, and cited quotes appear in portfolio and product pages across
every project. A reusable card that handles author/source attribution, palette tinting,
and dark-mode adaptation belongs in the shared library — not reinvented per consumer.

## Design decisions

- **Decorative quote mark carries `aria-hidden`** — the opening `"` glyph is purely visual.
  Screen readers do not benefit from hearing it read aloud, and they already announce the
  block-quote context from the Typography variant.
- **Separator dot carries `aria-hidden`** — the `·` between author and source is punctuation
  whose only purpose is visual spacing. Rendered as opacity-reduced Typography to stay
  visually lightweight.
- **No built-in max-width** — `QuoteCard` adapts to its container. Consumers control width
  via `sx={{ maxWidth: 440 }}` or by placing the card in a grid.
- **`color` defaults to `'primary'`** — aligns with the MUI palette convention. Accepts all
  six semantic palette keys: `primary | secondary | info | success | warning | error`.
- **`elevation` defaults to `0`** — a flat surface with a border tint is the design baseline.
  Consumers can pass `elevation={4}` for a shadow variant or `variant="outlined"` for a
  pure-border surface (via `PaperProps` inheritance).

## Library safety

- Zero personal data. No proprietary identifier names. No hardcoded hex or rgba literals.
- Uses `theme.vars.palette[color].mainChannel` for tinting — CSS variables mode compatible.
- Decorative elements carry `aria-hidden`.

## File structure

```
card/quote/
  quote-card.tsx            — QuoteCard component
  quote-card.styles.ts      — quoteMarkSx, quoteTextSx, quoteCardPaperSx
  quote-card.styles.test.ts — mock-theme assertions for every exported sx function
  quote-card.test.ts        — Vitest unit tests (structure, ARIA, attribution variants)
  quote-card.stories.tsx    — Default, AllColors, NoAttribution, AuthorOnly, Responsive
  types.ts                  — QuoteCardProps
  index.ts                  — barrel
  README.md                 — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- `SelectableCard` — a card variant with click/keyboard selection behaviour.
- `MetricCard` — a KPI card with numeric metric, delta indicator, and icon slot.
- `StatCard` — compact stat row for a dashboard summary strip.
