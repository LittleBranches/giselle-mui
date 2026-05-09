---
sidebar_position: 2
sidebar_label: 'Documentation strategy'
---

# Documentation strategy

This library uses three documentation systems. Each one owns a distinct question.
They do not overlap, and nothing should ever be maintained in two places.

---

## The three tiers

| Tier | Lives in | Audience | Answers |
|---|---|---|---|
| **JSDoc** | `.tsx` / `types.ts` source files | IDE hover tooltips + Storybook prop table | *What does this prop do?* |
| **Story JSDoc** | `.stories.tsx` files | Contributors reading the Storybook Docs tab | *Why does the component work this way?* |
| **Docusaurus** | `docs/` (this site) | npm consumers | *How do I install and use this in my app?* |

---

## Tier 1 — JSDoc: API reference

JSDoc on the component function and prop interface fields is the **API reference layer**.
It answers: *what is this thing and what does each prop do?*

```tsx
/**
 * A two-column chronological timeline for career history or roadmaps.
 * Phases with `side: 'right'` render on the LEFT; their milestones render on the RIGHT.
 */
export function TimelineTwoColumn({ phases, checklist, sx, ...other }: TimelineTwoColumnProps) {
```

```ts
interface TimelineTwoColumnProps {
  /** The ordered list of phases. Sorted internally by date (active first, then newest–oldest). */
  phases: TimelinePhase[];

  /**
   * Enables interactive checklist behaviour.
   * Dot clicks toggle milestone done-state.
   * @default false
   */
  checklist?: boolean;
}
```

**What belongs here:**
- A one-line description of what the component or prop IS
- Constraints, defaults, accepted values, side effects
- `@default`, `@example` tags for props that are non-obvious

**What does NOT belong here:**
- Design decisions ("we tried X first but Y was better because...")
- When-to-use comparisons between variants
- Architectural rationale

That information rots in JSDoc because contributors rarely read source files. It belongs in stories.

---

## Tier 2 — Story JSDoc: design decision records

The JSDoc comment above each `export const MyStory: Story = { ... }` is the
**design decision record layer**. It answers: *why does this work this way?*

This is the highest-value documentation in the codebase. It is the only place a future
contributor — or you six months later — can understand decisions that would otherwise only
exist in PR descriptions or chat history.

```tsx
/**
 * **Column placement invariant** — the most important architectural decision.
 *
 * A phase's `side` controls which column the **card** renders in — milestones
 * render in the **opposite** column. This is intentional:
 * ...
 */
export const ColumnPlacementInvariant: Story = { ... }
```

**What belongs here:**
- The decision the story documents — stated up front as a heading
- Why it works this way (what problem it solves)
- What was tried first and why it was wrong
- The invariant it protects — what breaks if it is ever changed
- When-to-use comparisons between variants (`scenario` vs `life-event` vs `marker`)

**What does NOT belong here:**
- Prop documentation (that's JSDoc on the interface)
- Installation or setup steps (that's Docusaurus)

**Rule:** One story = one design question. If a story tries to document two decisions,
split it into two stories.

### How Storybook renders story JSDoc

Storybook autodoc reads the JSDoc comment directly from the `export const` declaration.
It renders into the **Docs tab** — not the Canvas tab.

Two things that break this:

1. **`parameters.docs.description.story` overrides JSDoc.** If you add this parameter,
   Storybook uses the string instead of the JSDoc. Do not use it — it produces a shorter,
   unformatted version of what JSDoc would render. Use JSDoc only.

2. **JSDoc must be immediately above `export const`.** A blank line or any intervening
   code between the comment and the export breaks the association.

---

## Tier 3 — Docusaurus: consumer guide

These pages (the site you are reading now) are the **consumer-facing installation and usage guide**.
They answer: *how do I add this to my app and use it correctly?*

**What belongs here:**
- Installation steps and peer dependencies
- How to wire `GiselleThemeProvider` in Next.js / Vite
- Usage examples showing the component in context (import + JSX)
- Links to the deployed Storybook for visual reference
- Links to the TypeScript type definitions for API detail

**What does NOT belong here:**
- Prop-by-prop API documentation (that duplicates JSDoc and goes stale)
- Internal design decisions (those belong in stories)

---

## The README in each component folder

Each `src/components/<name>/README.md` is a **contributor orientation** document.
It is internal only (not published to Docusaurus) and answers:

1. Why this component exists in this library
2. Why it belongs here (not in the consumer app)
3. Key design decisions — with links to the relevant Storybook story for the full rationale
4. Related components

It does not duplicate JSDoc or story content. It links to both.

---

## Quick reference: where does this go?

| Content | Goes in |
|---|---|
| What a prop accepts / its default | JSDoc on the interface field |
| What the component IS (one sentence) | JSDoc on the exported function |
| Why `side: 'right'` puts the card on the LEFT | Story JSDoc |
| When to use `scenario` vs `life-event` | Story JSDoc |
| How to install the package | Docusaurus |
| How to wire the theme in Next.js | Docusaurus |
| Why this component exists in this library | Component `README.md` |
