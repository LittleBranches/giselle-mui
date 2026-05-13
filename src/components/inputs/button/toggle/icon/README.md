# `ToggleIconButton`

## Why it exists

A binary toggle button with three CSS-driven icon states and `aria-pressed` semantics.
The pattern is easy to get wrong in two ways:

1. **Hover state managed in JS** — leads to the "stuck hover" bug where the icon
   freezes in the hover state when the pointer moves quickly off the button.
2. **`aria-pressed` omitted** — sighted users see the toggle state visually;
   screen reader users need `aria-pressed` to hear it.

`ToggleIconButton` gets both right, once, for every consumer.

## Why it belongs here

Any component that needs a small binary toggle control — a favourite star, a
done-check, a bookmark, a mute button — would otherwise rebuild this same
pattern from scratch. The component encodes two non-obvious decisions that every
instance would silently get wrong without it.

## Why it lives under `inputs/`

MUI places `IconButton` (and `Button`, `Checkbox`, `TextField`) under the
**Inputs** category in its own docs. Components in this library that wrap MUI
Input-category primitives mirror that taxonomy. `ToggleIconButton` wraps
`IconButton` → it belongs in `inputs/`.

## Design decisions

### CSS-only icon switching (no JS hover state)

All three icon spans (`.ti-idle`, `.ti-pressed`, `.ti-hover`) are always present
in the DOM. CSS selectors (`&:hover`, `&:focus-visible`, `&[aria-pressed="true"]`)
control which one is visible. There is no `useState` for hover.

**Why:** a JS hover state (`onMouseEnter`/`onMouseLeave`) has a race condition.
When the pointer moves quickly off the button, `onMouseLeave` can fire after the
component unmounts or after a parent re-render, leaving the hover state `true`
permanently. CSS hover has no such race condition — the browser resolves it.

### `aria-pressed` set from `pressed` prop (never by consumer)

The consumer cannot accidentally set `aria-pressed` to an inconsistent value.
It is always `pressed === true ? true : false`, in sync with the icon state.
`aria-pressed` is omitted from `ToggleIconButtonProps` to make this invariant
explicit at the type level.

### `aria-label` is the consumer's responsibility

`ToggleIconButton` is intentionally agnostic about what "pressed" means. The
correct label depends on the use case — "Add to favourites" / "Remove from
favourites" for a star; "Mark as done" / "Mark as not done" for a checklist.
No sensible default exists. The consumer must pass `aria-label` explicitly.

### `stopPropagation` in the click handler

`e.stopPropagation()` prevents the click from reaching any root-level `onClick`
a parent component might attach. Without it, a click on `ToggleIconButton` inside
an `Accordion` (or any other `onClick`-bearing parent) would bubble up and trigger
the parent's handler alongside the toggle.

### Default icons are green check circles

The built-in `pressedIcon` and `hoverIcon` are filled/outlined green check circles
— a common "done" metaphor. Consumers replace them with `pressedIcon` and
`hoverIcon` props for any other icon set.

## Library safety

- Zero proprietary dependencies. Only `@mui/material/IconButton`, `@mui/material/SvgIcon`,
  and React standard hooks.
- No hardcoded copy. The `aria-label` comes from the consumer.
- No hardcoded hex or rgba. Default icon colour uses `color: 'success.main'`
  (MUI CSS variables palette token).

## File structure

```
src/components/inputs/button/toggle/icon/
  icon.tsx                — JSX composition only
  icon.const.ts           — TOGGLE_ICON_SIZE, TOGGLE_MIN_TOUCH_TARGET
  icon.defaults.tsx       — DEFAULT_PRESSED_ICON, DEFAULT_HOVER_ICON (JSX constants)
  icon.styles.ts          — rootSx, defaultIconSvgSx
  icon.styles.test.ts     — assertions for every sx constant
  icon.test.ts            — structure, ARIA, interaction, and regression tests
  icon.stories.tsx        — Default, AllCustomIcons, ControlledToggle, Responsive
  types.ts                — ToggleIconButtonProps
  index.ts                — barrel export
  README.md               — this file
```

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- `Accordion` — uses `ToggleIconButton` internally for its icon-button checklist mode
- `TaskList` — flat checklist; uses `Accordion` with checklist mode enabled
