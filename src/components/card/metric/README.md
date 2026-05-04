# MetricCard & MetricCardDecoration

## Why it exists

Stat cards — a large number, a label beneath it, an icon in the corner — are one of the most
common UI patterns on marketing and portfolio sites. The layout is simple but gets a few things
wrong by default:

- Icon positioning is typically done with negative margins or absolute positioning that breaks
  when the card resizes or the icon changes.
- The icon colour is either hardcoded or requires passing a raw hex string.
- MUI's `Paper` gives you elevation and padding, but no structured slot system for value,
  label, sublabel, and a positioned icon.

`MetricCard` solves all three with a clear, typed API:

```tsx
<MetricCard
  value="20+"
  label="Years of experience"
  sublabel="of experience"
  color="primary"
  icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />}
  decoration={<MetricCardDecoration color="primary" />}
/>
```

---

## Why it belongs here

This component encodes several decisions that are easy to get wrong:

1. **Icon tinting without hardcoding colours** — the `color` prop uses `theme.vars.palette[color].main`,
   so the icon inherits the correct colour token from any MUI theme. Changing the application theme
   automatically updates all card icon colours.

2. **Zero icon-library dependency** — the `icon` slot accepts `ReactNode`. The library never imports
   an icon library. Consumers choose their own icons (`GiselleIcon`, `SvgIcon`, any React element).

3. **Decoration as a separate, composable component** — the visual decoration is opt-in and
   independently styled. See [MetricCardDecoration](#metriccardecoration) below.

---

## MetricCardDecoration

### What it is

`MetricCardDecoration` is a companion component for `MetricCard`. It renders a rotated gradient
rectangle positioned in the top-right corner of the card, behind all content. The card clips it
via `overflow: hidden` — no extra work required.

```tsx
<MetricCard
  value="42"
  label="Projects shipped"
  color="success"
  decoration={<MetricCardDecoration color="success" />}
/>
```

### Design inspiration and credit

The visual concept — a soft, rotated gradient shape in the background of a stat card, tinted to
the card's accent colour — was inspired by the [Minimals MUI kit](https://minimals.cc/).
The implementation is independent and original.

`MetricCardDecoration` is an independent, clean-room implementation of this idea:

- Colour tinting uses `theme.vars.palette[color].main` with a plain `opacity` value — the
  standard MUI v7 CSS variables approach, fully open-source. No proprietary colour utilities.
- The exact dimensions, rotation angle, position offsets, and gradient direction are original
  values arrived at through visual iteration.
- The decoration is a **separate, exported component** — a deliberate architectural choice so
  consumers can swap it, omit it, or provide their own. Many implementations embed it directly
  inside the card, which removes that flexibility.

---

### Customising MetricCardDecoration

The component accepts `sx` and all `BoxProps`, so any visual property can be overridden
per instance:

```tsx
// Default — top-right, 140×140, 40deg rotation, 0.1 opacity
<MetricCardDecoration color="primary" />

// Larger, more visible
<MetricCardDecoration
  color="info"
  sx={{ width: 180, height: 180, opacity: 0.15 }}
/>

// Moved to bottom-left
<MetricCardDecoration
  color="warning"
  sx={{ top: 'auto', bottom: -40, right: 'auto', left: -56 }}
/>

// Less rotation — more of a diamond shape
<MetricCardDecoration
  color="success"
  sx={{ transform: 'rotate(15deg)' }}
/>

// Two decorations — one each side
<MetricCard
  value="99%"
  label="Uptime"
  color="success"
  decoration={
    <>
      <MetricCardDecoration color="success" />
      <MetricCardDecoration
        color="success"
        sx={{ top: 'auto', bottom: -40, right: 'auto', left: -56, transform: 'rotate(-40deg)' }}
      />
    </>
  }
/>

// Fully custom decoration — not MetricCardDecoration at all
<MetricCard
  value="∞"
  label="Possibilities"
  color="secondary"
  decoration={
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 80% 20%, currentColor 0%, transparent 60%)',
        opacity: 0.06,
        color: 'var(--palette-secondary-main)',
      }}
    />
  }
/>
```

The `decoration` slot on `MetricCard` accepts any `ReactNode`. `MetricCardDecoration` is the
default companion, but there is no requirement to use it.

---

## Design decisions

### Why `decoration` is a ReactNode slot, not a boolean

A boolean `showDecoration` prop would hardcode a single visual appearance. A `ReactNode` slot
lets any consumer choose the decoration style, or compose multiple decorations, or provide
something entirely custom — while `MetricCardDecoration` handles the most common case with
minimal boilerplate.

### Why the decoration wrapper carries `aria-hidden`

The decoration has no semantic meaning. Screen readers should ignore it. The wrapper in
`MetricCard` unconditionally applies `aria-hidden="true"` to the decoration container so
consumers don't have to remember to set it on whatever they pass in.

### Why `overflow: hidden` is on the card root

`MetricCardDecoration` uses `position: absolute` with negative offsets to intentionally
bleed outside the card's content box. `overflow: hidden` on the `Paper` root clips it at
the card boundary, creating the soft corner effect without any additional DOM elements.

---

## Library safety

- No proprietary dependencies. Only `@mui/material` Box, Paper, Typography.
- No hardcoded colours — all tinting via `theme.vars.palette[color].main`.
- No icon imports. Icon slot accepts `ReactNode`.
- `MetricCardDecoration` uses only open-source MUI CSS vars — no proprietary colour utilities.
- All animation and decoration code is original. Safe to publish under MIT.

---

## File structure

```
src/components/metric-card/
  metric-card.tsx     — MetricCard + MetricCardDecoration + exported Props interfaces
  index.ts            — barrel: re-exports all
  README.md           — this file
  metric-card.test.ts — Vitest unit tests
```

---

## Related

- [`GiselleIcon`](../giselle-icon/README.md) — icon component for the `icon` slot
- [`QuoteCard`](../quote-card/README.md) — companion testimonial card with similar color-tinting approach
- Storybook: `MetricCard.stories.tsx` — interactive showcase, all color variants, decoration examples
