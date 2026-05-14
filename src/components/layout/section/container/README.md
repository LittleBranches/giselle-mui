# SectionContainer

## Why it exists

Every section page repeats the same `Container maxWidth="lg"` + `py={{ xs: 8, md: 12 }}` pattern.
Writing it inline means any change to the standard section padding requires updating every page.
`SectionContainer` encodes that decision once so the default is correct everywhere.

## Why it belongs here

Any project built on `giselle-mui` needs a consistent section wrapper. The alternative — leaving
each consumer to define their own spacing — leads to silent drift: different sections on the same
page end up with slightly different horizontal constraints and vertical rhythm.

## Design decisions

- **`py` defaults to `{ xs: 8, md: 12 }`** — 64 px on mobile, 96 px on desktop. This is the
  standard MUI portfolio section rhythm.
- **`maxWidth` defaults to `'lg'`** — 1200 px wide, fitting most content-first layouts. Override
  to `'md'` for text-heavy sections or `'xl'` for full-bleed imagery.
- **`py` is a top-level prop, not buried in `sx`** — the only thing consumers commonly adjust is
  the vertical spacing. Surfacing it as a named prop avoids boilerplate `sx={{ py: {...} }}`.
- **No background colour, no border, no decoration** — `SectionContainer` is a spacing shell.
  Visual treatment belongs in the content slotted inside it.

## Library safety

- Zero personal data. No proprietary imports.
- Uses MUI `Container` directly — no custom theming.

## File structure

```
section-container/
  section-container.tsx        — SectionContainer component
  section-container.stories.tsx — Default, MediumWidth, TightSpacing, Responsive
  section-container.test.ts    — renderToStaticMarkup tests
  types.ts                     — SectionContainerProps
  index.ts                     — barrel
  README.md                    — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- `SectionTitle` — heading group (caption + h2 + gradient + description) typically rendered
  as the first child of a `SectionContainer`.
- `TwoColumnShowcaseRow` — uses `SectionContainer` for its outer wrapper.
