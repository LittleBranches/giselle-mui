# AnimatedGradientText

## Why it exists

Hero sections and landing pages commonly use animated gradient text to draw attention to a key phrase — a headline, a tagline, an author name. Getting the CSS right requires knowing three non-obvious constraints:

1. `backgroundClip: 'text'` only works on `display: inline-block` (or `inline-flex`). A bare `display: inline` span shows no gradient in most browsers.
2. `WebkitTextFillColor: 'transparent'` is required alongside `WebkitBackgroundClip` for cross-browser support (Safari, Chrome). `backgroundClip` alone is insufficient.
3. The animation needs `backgroundSize: '200% 200%'` to have room to move — a 100% background with `backgroundPosition` changes produces no visible movement.

This component encodes all three constraints so consumers don't rediscover them.

## Why it belongs here

Any page — portfolio hero, dashboard title, marketing section — can use this pattern. It has no domain-specific logic. It is a general-purpose inline text decorator.

## Design decisions

### CSS Custom Properties instead of a `theme` callback

The `sx` factory uses `var(--mui-palette-${key}-main)` string interpolation rather than a `(theme) => ...` callback. This means:

- **No runtime cost from the callback chain** — the string is computed once at the call site.
- **Light/dark mode works automatically** — `--mui-palette-*` variables are updated by MUI's `ThemeProvider` at the `:root` level.

### `backgroundPosition` animation instead of `hue-rotate`

`hue-rotate` shifts all colours uniformly — the resulting hue cycle is often muddy. `backgroundPosition` on a `linear-gradient` keeps the colours exactly as specified and just slides the gradient under the text, which reads as a smooth wave. The tradeoff: the gradient must be at least 200% wide to give the animation room to travel.

### Six palette keys, not arbitrary hex

The `color1` / `color2` props accept `PaletteColorKey` values only — not arbitrary CSS colours. This keeps the component inside the theme contract so the gradient automatically adapts when the consumer's theme changes.

## File structure

```
animated-gradient-text/
  animated-gradient-text.tsx        — component
  animated-gradient-text.const.ts   — default color keys and duration
  animated-gradient-text.styles.ts  — gradientTextSx factory
  animated-gradient-text.styles.test.ts
  animated-gradient-text.test.ts
  animated-gradient-text.stories.tsx
  types.ts                          — AnimatedGradientTextProps, PaletteColorKey
  index.ts                          — barrel
  README.md                         — this file
```

## Related

- `StatCard` — uses gradient accents in the card header area
- `HeroSection` — natural parent container for this component
