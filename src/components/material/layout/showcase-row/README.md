# TwoColumnShowcaseRow

## Why it exists

A consistent two-column layout pattern — text description on one side, interactive controls
on the other — is used repeatedly across section pages and portfolio demos. Getting the
responsive breakpoint (stacks vertically at `xs`, side by side at `md+`), column gap, and
text max-width right has non-obvious details. `TwoColumnShowcaseRow` encodes them once.

## Why it belongs here

Any section page that pairs explanatory copy with a demo component will use this pattern.
It is already consumed by the `alexrebula` portfolio and is general enough for any project.

## Design decisions

- **MUI Grid v2** (`size={}` API) — Grid v1 was removed in MUI v7. The import from
  `@mui/material/Grid` gives Grid v2. The comment in the source is intentional.
- **Always stacks at `xs`** — regardless of `orientation`, `xs` forces column flow. Side-by-side
  layout requires at least `md` width for readability.
- **`orientation` controls column order** — `'row'` (text left, controls right) is the default.
  `'row-reverse'` swaps them. `'column'` and `'column-reverse'` force stacking at all widths.
- **Text `maxWidth: 520`** — a readable line length for body copy, consistent with MUI
  `body1`'s comfortable reading width at default font sizes.
- **`text` is optional** — omitting it gives controls the full container width, useful for
  full-bleed demos.

## Library safety

Zero personal data. No proprietary identifier names. No hardcoded hex or rgba literals.

## File structure

```
layout/two-column-showcase-row/
  two-column-showcase-row.tsx    — TwoColumnShowcaseRow component
  two-column-showcase-row.stories.tsx — TextLeft, TextRight, ColumnOnly, Responsive
  two-column-showcase-row.test.ts — Vitest unit tests
  types.ts                       — TwoColumnShowcaseRowProps, TwoColumnShowcaseRowText
  index.ts                       — barrel
  README.md                      — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- `SectionContainer` — page-level width wrapper and vertical spacing; typically wraps this component.
- `SectionTitle` — heading + subtitle above a section; often paired with `TwoColumnShowcaseRow`.
