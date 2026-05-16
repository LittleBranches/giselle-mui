# SelectableCard

## Why it exists

A clickable, selectable card is a frequently needed UI primitive — option pickers, plan
selectors, tag toggles. Getting it right without a dedicated component means every consumer
rediscovers the same pitfalls: using a `<div onClick>` instead of a `<button>` (breaks
keyboard navigation), forgetting `aria-pressed` (screen readers can't report selection state),
not handling `Mui-focusVisible` vs hover separately (mouse users see focus rings they shouldn't).
`SelectableCard` makes one correct implementation available everywhere.

## Why it belongs here

Any interface with a selection pattern — option pickers, feature toggles, plan choosers —
needs this card. The pattern appears across at minimum the portfolio and `first-branch`. A
central implementation prevents divergence.

## Design decisions

- **Built on `ButtonBase`** — not `<div onClick>`. `ButtonBase` is a native `<button>`, which
  means keyboard activation (Enter/Space), focus management, `aria-pressed`, and `Mui-disabled`
  all work without custom code.
- **`aria-pressed` communicates selection** — when `true`, screen readers announce "pressed"
  before reading the card content. When `false`, "not pressed". This is the correct ARIA pattern
  for a toggle button.
- **`focusRipple` enabled** — provides a visual ripple specifically on keyboard focus, so
  keyboard-only users can confirm which card is focused before activating it.
- **Selection ring via `box-shadow` not `border`** — a border width change shifts layout; a
  `box-shadow: 0 0 0 2px` outline doesn't affect element dimensions.
- **No color variants** — `SelectableCard` is a structural primitive. The selection ring colour
  uses `text.primary` (darkens in light mode, lightens in dark mode) rather than a semantic
  palette key, because selection is not a semantic state — it's a binary user choice.

## Library safety

- Zero personal data. No proprietary identifier names. No hardcoded hex or rgba literals.
- Uses only `ButtonBase` from MUI — no custom theme extension.

## File structure

```
card/selectable/
  selectable-card.tsx            — SelectableCard component
  selectable-card.styles.ts      — selectableCardSx factory
  selectable-card.styles.test.ts — mock-theme assertions for the sx factory
  selectable-card.test.ts        — Vitest unit tests (ARIA, click, disabled)
  selectable-card.stories.tsx    — Toggle, MultiSelect, Disabled, Responsive
  types.ts                       — SelectableCardProps
  index.ts                       — barrel
  README.md                      — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- `QuoteCard` — a non-interactive display card.
- `MetricCard` — a non-interactive KPI display card with metric, delta, and icon slot.
