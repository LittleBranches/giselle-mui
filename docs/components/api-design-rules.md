# API Design Rules — `@littlebranches/giselle-mui`

> These rules govern every component API, prop interface, and JSDoc in this library.
> They apply to every PR that adds or modifies a component — no exceptions.
>
> _Last updated: 17 May 2026_

---

## The core principle

> **Create a component only when it encodes a non-trivial decision that would otherwise
> be re-discovered by every consumer.**
>
> If wrapping an MUI component adds nothing beyond a style constant, ship the style
> constant — not a wrapper component.

---

## Tier system for component types

Every component in this library falls into one of three tiers. Identify the tier
before designing the props — it determines how much is new vs inherited.

---

### Tier 1 — Pure extension (no new props)

**Use when:** the only value-add is enforcing a convention — always using CSS variables,
always applying the `sx` array spread, always forwarding `...other`.

**Props:** inherit everything from the MUI base. Add zero new props.

**JSDoc:** none needed on the Props interface. The MUI props speak for themselves.
Add a single JSDoc comment on the component function explaining the convention it enforces.

```ts
// ✅ Correct — extends MUI fully, adds nothing new
export interface SectionContainerProps extends ContainerProps {}
```

**When NOT to use Tier 1:** if extending adds no enforcement either (i.e. the component
is identical to the MUI original in every way), do not create the component at all.

---

### Tier 2 — Selective extension (a few opinionated props)

**Use when:** you are narrowing or pre-configuring MUI's API — restricting `color` to
the six palette keys, adding a `ReactNode` slot MUI doesn't have, or pre-wiring a
non-obvious prop combination.

**Props:** extend the MUI base interface. Add only the props that represent the
new decision. Never re-declare props that already exist on the MUI interface.

**JSDoc:** only on **own props** — never on inherited ones. MUI's JSDoc flows through
TypeScript inheritance into Storybook autodoc automatically.

```ts
// ✅ Correct — extends PaperProps, adds only what's new
export interface StatCardProps extends PaperProps {
  /** Card label — rendered as a secondary caption above the value. */
  label: string;
  /** Primary numeric or text value. */
  value: string | number;
  /** Palette colour key. @default 'primary' */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  /** Optional sparkline or chart — passed as a ReactNode slot. */
  chart?: ReactNode;
  /** Signed percentage trend. Positive = up arrow. Negative = down arrow. */
  trend?: number;
}
```

---

### Tier 3 — Composition props (data-driven components)

**Use when:** the component assembles multiple MUI primitives from a **data array**
— e.g. `ActivityFeedList` takes `ActivityFeedItem[]` and renders `List` + `ListItem`
+ `Avatar` internally. The data shape is what's new; the container is a thin shell.

**Props:** do not extend a specific MUI base — the component is a composition, not a
wrapper. Accept `items: ItemType[]`, `sx?: SxProps<Theme>`, and any configuration props
that control the composition behaviour.

**JSDoc:** document the **item shape** — that is where the consumer contract lives.
Keep the container props minimal.

```ts
// ✅ Correct — item type is the real API; container props are minimal
export interface ActivityFeedItem {
  /** Unique identifier. */
  id: string;
  /** Avatar image URL. Falls back to initials when absent. */
  avatar?: string;
  /** Primary line text. */
  primary: string;
  /** Secondary line text. */
  secondary?: string;
  /** Relative or absolute timestamp string — rendered as-is. */
  timestamp: string;
  /** Optional status chip. */
  status?: StatusLabelStatus;
}

export interface ActivityFeedListProps {
  items: ActivityFeedItem[];
  sx?: SxProps<Theme>;
}
```

---

## Shared style vs shared component

The most common mistake is creating a base component when a style constant is enough.

| Shared thing | Correct form | Wrong form |
|---|---|---|
| Card elevation, border-radius, padding | `cardBaseSx` constant in `*.styles.ts` | `BaseCard` component |
| Chart card shell (title + chart area) | `ChartCardBase` component (non-trivial structure) | Inline in every chart card |
| Typography scale | MUI `Typography` with `variant` prop | `Heading`, `Caption` wrappers |

**Rule:** if the shared thing is only visual (colours, spacing, shadows), use a style
constant. If the shared thing is structural (a recurring DOM shape with multiple named
slots), use a thin wrapper component.

### The `Paper` → card pattern

All card components use MUI `Paper` as their root — but they do **not** share a
`BaseCard` wrapper component. Instead, each card extends `PaperProps` directly and
imports a shared `cardBaseSx` style constant:

```ts
// card-base.styles.ts — shared by all card components
export const cardBaseSx: SxProps<Theme> = {
  borderRadius: 2,
  p: 3,
  // ... shared card styles
};

// stat-card.tsx — extends Paper directly, no BaseCard wrapper
function StatCard({ sx, ...other }: StatCardProps) {
  return (
    <Paper sx={[cardBaseSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      ...
    </Paper>
  );
}
```

**Exception — `ChartCardBase`:** chart cards share a non-trivial structural shell
(card header with title + year-selector slot, chart area, optional legend). That
structure justifies a thin wrapper. All chart cards compose `ChartCardBase` rather
than `Paper` directly.

---

## JSDoc rules

| Situation | Rule |
|---|---|
| Prop inherited from MUI | No JSDoc — never redeclare |
| Own prop, purpose obvious from name | No JSDoc |
| Own prop, non-obvious behaviour | One-line JSDoc max |
| Own prop with a default value | Add `@default value` tag |
| Own prop with a safety constraint | Add the constraint in the JSDoc |
| Component function | One-sentence JSDoc explaining what problem it solves |

**Never write multi-line JSDoc blocks.** One line is almost always enough.
If the explanation takes more than one sentence, the component API is probably wrong.

---

## Prop design rules

1. **Inherit first.** Before adding a prop, check if the MUI base already has it.
2. **`ReactNode` for all slots.** Never accept a specific icon component type or image
   component type. Accept `ReactNode` and let the consumer fill the slot.
3. **`sx` always last.** The `sx` prop is always the last prop in the interface,
   forwarded to the root element.
4. **`color` follows MUI convention.** Always `'primary' | 'secondary' | 'info' |
   'success' | 'warning' | 'error'` with `@default 'primary'`.
5. **No boolean props that duplicate MUI.** If MUI already has `disabled`, `fullWidth`,
   `variant`, do not re-declare them — they come through the extended interface.
6. **Data props use plain types.** `items: Item[]` not `items: React.ComponentProps<...>`.
   Data and presentation are always separated.
7. **No callback duplication.** If MUI already fires `onChange`, do not add `onValueChange`.
   Only add callbacks for events MUI does not expose.

---

## Implementation rules

### `forwardRef` + `displayName`

Every exported component that renders a DOM element must use `React.forwardRef` and set
`displayName` on the result.

```ts
const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  function StatCard({ label, value, sx, ...other }, ref) {
    return <Paper ref={ref} sx={[cardBaseSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other} />;
  }
);
StatCard.displayName = 'StatCard';
```

### Decorative icons

Icons that illustrate a point already conveyed by adjacent text: `aria-hidden="true"`.
Icon-only interactive elements: `aria-label` on the button, not the icon.

---

## Component naming rules

### Prohibited prefixes

Never use: `Base*`, `Custom*`, `Common*`, `Generic*`, `My*`, `New*`, `Advanced*`

These prefixes describe nothing. Find the specific noun — `CardShell` not `BaseCard`.

### Suffix vocabulary

See [`docs/naming-conventions.md`](../naming-conventions.md) for the full suffix reference.

---

## When NOT to create a component

Do not create a wrapper component if:

- The only change is a default prop value (use a style constant instead)
- The component is identical to the MUI original in every observable way
- The component is only used in one place and has no reuse potential
- The abstraction saves fewer lines than it adds

Ask before building: *"Would a second project want this exact component?"*
If the answer is no, it does not belong in `giselle-mui`.

---

## Related

- [`cleanup-workflow.md`](./cleanup-workflow.md) — step-by-step DoD checklist per component
- [`component-inventory.md`](../component-inventory.md) — what exists, what is planned
- [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) — condensed version of these rules for AI models
