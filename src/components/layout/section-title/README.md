# SectionTitle + SectionCaption

## Why it exists

Every portfolio and product site needs a consistent heading group: an optional overline caption,
a main `h2` heading with an optional gradient accent word, and an optional supporting description.
Getting the gradient-clip technique right (`WebkitBackgroundClip: 'text'`, `WebkitTextFillColor: 'transparent'`)
is non-obvious in MUI v7 CSS-variables mode, where `theme.palette.*` values are unavailable and
`theme.vars.palette.*` must be used for tintable channel references.

## Why it belongs here

Any project built on `giselle-mui` needs this pattern. Building it inline in a section component
means every consumer rediscovers the gradient-clip CSS trick and the correct `theme.vars!` path.
`SectionTitle` encodes both and keeps them tested.

## Design decisions

- **`txtGradient` word fades from `text.primary` to 20% alpha** — gives a soft right-edge
  disappearance that works in both light and dark mode without hardcoded colours.
- **`SectionCaption` is exported separately** — consumers sometimes need just the overline label
  without the full heading group (e.g. alongside a standalone `<Typography variant="h3">`).
- **`slotProps.title/caption/description.sx`** — individual text slots are customisable without
  forking the component. This avoids prop explosion (no `titleSx`, `captionSx`, etc.).
- **No `color` prop** — `SectionTitle` is purely structural/typographic. Consumers use `sx` to
  apply colour overrides at the slot level if needed.

## Library safety

- Zero personal data. All placeholder content in stories is generic.
- Zero proprietary identifier names (`varAlpha`, `varFade`, etc.).
- Theme access uses `theme.vars!.palette.*` (CSS variables mode — required for MUI v7).

## File structure

```
section-title/
  section-title.tsx          — SectionTitle composition + re-exports SectionCaption
  section-caption.tsx        — SectionCaption sub-component
  types.ts                   — SectionTitleProps, SectionCaptionProps
  section-title.styles.ts    — txtGradientSpanSx factory
  section-title.styles.test.ts — mock-theme assertions for txtGradientSpanSx
  section-title.test.ts      — renderToStaticMarkup tests for both components
  section-title.stories.tsx  — Full, TitleOnly, CaptionAndGradient, Centred, CaptionStandalone, Responsive
  index.ts                   — barrel: SectionTitle, SectionCaption, types
  README.md                  — this file
```

## Related

- `SectionContainer` — wraps any section content in a responsive Container with vertical padding;
  accepts an optional `SectionTitle` slot via props.
- `TwoColumnShowcaseRow` — uses `SectionTitle` as its heading group.
