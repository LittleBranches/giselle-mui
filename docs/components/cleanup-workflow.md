# Component cleanup workflow

> **Keep in sync (required):** The Scenario A/B Definition of Done checklists in this file are the source of truth for folder DoD. When you add/remove/rename a checklist item, update [`../component-inventory.md`](../component-inventory.md) the same day (DoD scale line and any n/N scores). Do not leave inventory on an old count.
>
> **Private migration tracking:** Inventory ticks and migration DoD rollup for the giselle port live in the **private wiki** (not linked from this public repo). Search the wiki for the inventory equivalence table / migration matrix. See also **Inventory / migration DoD** below.


Use this as the step-by-step playbook whenever creating or cleaning up a component in `giselle-mui`.

---

## Phase 0 — Determine component role (do this before anything else)

Before reading a single line of implementation, answer this one question:

> Is this component **independently usable by a consumer**, or does it only make sense inside one specific parent?

| Signal                                                            | Role                                          |
| ----------------------------------------------------------------- | --------------------------------------------- |
| Exported from `src/index.ts` (or `charts-`/`motion-`/`lab-index.ts`) | Standalone — needs its own subfolder       |
| Marked `Shipped · <entry point>` in `docs/component-inventory.md` | Standalone                                    |
| Marked `Shipped · internal` in `docs/component-inventory.md`      | Sub-component                                 |
| File lives inside a parent component's own subfolder              | Sub-component — needs its own named subfolder |
| Only imported by one sibling `.tsx` in the same folder            | Sub-component                                 |
| Has its own `Props` type but is never consumed outside its folder | Sub-component                                 |

The answer determines which scenario applies for every step in Phase 2. Do not skip this — confusing the two scenarios leads to the wrong folder structure and the wrong barrel exports.

→ If **Scenario A** (sub-component): proceed to Phase 1 with the sub-component rules active.
→ If **Scenario B** (standalone): proceed to Phase 1, then follow the migration checklist at the end of this document before Phase 2.

### Phase 0b — Should this component be exported from `src/index.ts`?

This is a separate question from the folder structure. A standalone component in its own subfolder is not automatically exported from the package barrel — it must earn that.

Answer these in order. Stop at the first yes.

1. **Could a second project use this exactly as-is?** If another private consuming app, a future app, or any other giselle-mui consumer would want to import this component directly, it belongs in the barrel.
2. **Is it used in more than one place in the consuming app?** Multiple independent usages in a consuming app signal it encodes something reusable, not something app-specific.
3. **Is it already marked `Shipped · <entry point>` in `docs/component-inventory.md`?** If yes, the decision was already made — add it to the barrel. (A `Shipped · internal` row means the opposite: it was deliberately kept private.)
4. **Does it encode an accessibility or design rule that is non-trivial to get right?** Correct `aria-*` wiring, `sx` array spread, minimum icon sizes, column-alignment invariants — things a developer would silently get wrong without this component.

**If any answer is yes** → the component is exported from `src/index.ts`. Add it to the barrel in Phase 2 Step 9.

**If all answers are no** → the component stays private. It is exported from its own folder's `index.ts` (so the parent can import it cleanly) but does **not** appear in `src/index.ts`. Do not add it to the package barrel — a false export implies it is independently useful when it is not.

> **Note for sub-components (Scenario A):** a sub-component should almost never be in `src/index.ts`. The only exception is if it answers yes to all four questions above AND a consumer would realistically import it standalone. When in doubt, keep it private.

---

## Phase 1 — Context gathering (read-only, parallelise freely)

1. **Read session bootstrap files** — `docs/roadmap.md`, any component-specific plan under `docs/components/`, repo memory (`/memories/repo/notes.md`).
2. **Read every file in the component folder** — `.tsx`, `types.ts`, `*.utils.ts`, `*.styles.ts`, `*.const.ts`, `*.test.ts`, `*.stories.tsx`, `index.ts`, `README.md`.
3. **Read the package barrel** — `src/index.ts` to see what is currently exported and what is missing.
4. **Run SonarQube** on the component file — catch cognitive complexity violations, DOM prop leaks, `.dataset` vs `getAttribute` issues before touching anything.
5. **Run `get_errors`** — see the current TypeScript and ESLint state across all component files.
6. **Check test coverage** — `npm run test:coverage` scoped to the component folder.

---

## Phase 2 — Implementation (sequential, complete each step before moving on)

### Step 1 — Types

- Move every `type` alias and `interface` declaration out of `.tsx` files and into `types.ts`.
- This includes exported and internal types without exception: `Props`, `Item`, `Config`, helper union types.

### Step 2 — Constants

- Move every exported `const` that represents a **size, font size, badge size, minimum touch target, or spacing value** out of `.tsx` files and into `<component-name>.const.ts`.
- **Scope:** primitive values only — numbers, strings, booleans. If the constant contains JSX (e.g. a default actions array with `<GiselleIcon />` elements), it belongs in `<component-name>.defaults.tsx` instead — never `.const.ts`. Never contort JSX into `createElement` calls to satisfy the `.ts` extension.
- Add a `describe('readability — minimum size constants', ...)` block to the component's `*.test.ts` that imports each constant and asserts it meets its minimum value (e.g. `toBeGreaterThanOrEqual(20)` for interactive icons).
- Add the const file to the folder's `index.ts` barrel.

### Step 3 — Styles

- Move every `sx={}` object out of `.tsx` files and into `<component-name>.styles.ts`, regardless of property count. (Zero-tolerance, extended from story files to component files 2026-08-31 — see the policy note at the end of Step 3.)
- **`style={{}}` on `motion.*` elements: no inline object literals, ever.** Every `style` prop on a `motion.*` component must reference a named export from `<component-name>.styles.ts`, regardless of property count.
  - Static `style` objects → module-level `const` in styles.ts.
  - `MotionValue`-based `style` objects → factory function in styles.ts that accepts the `MotionValue` args and returns the style object. The factory is defined in styles.ts; the _call_ happens in JSX (identical pattern to dynamic `sx` factories):
    ```ts
    // scroll-parallax-hero.styles.ts
    export const parallaxYStyle = (y: MotionValue<number>) => ({ y });
    ```
    ```tsx
    // in component JSX
    <motion.div style={parallaxYStyle(y1)}>
    ```
    This keeps every `style` object creation in one place, auditable and grepped easily.
- Static sx → module-level `const` (created once at load time).
- Dynamic sx that depends on props → factory function `(prop: T): SxProps<Theme> => (theme) => ({...})`.
- Create or update `<component-name>.styles.test.ts`: call each exported factory with a minimal mock theme, assert the returned object values.

**Naming precision rule — name by structural role, not by current child content.**
A Box that wraps a label is a _slot_ — it positions whatever child is placed inside it. A Box that _is_ a label has its own distinct role. Name accordingly:

- Container/layout Boxes → `*SlotSx`, `*WrapperSx`, `*ColumnSx` (structural role)
- The rendered content inside → `*CaptionSx`, `*TitleSx`, `*LabelSx` (content role)

Conflating the two makes names misleading the moment the child content changes. `markerLeftLabelSx` implied the Box _was_ the label; renaming to `markerLabelSlotSx` makes the structural role explicit.

**Factory unification rule — merge parallel left/right (or similar) constants into a single factory.**
When two style constants are structurally identical except for one varying argument (e.g. `side: 'left' | 'right'`, `blurred: boolean`), they should be a single factory, not two separate exports. Two static constants will diverge silently during refactors — one gets updated, the other doesn't. A factory makes the relationship explicit in the type signature and keeps the structure in one place.

Check every `*.styles.ts` file for sibling pairs. If they share the same shape and differ only by one dimension, merge them. See `timelineColumnSx`, `msColumnBoxSx`, and `markerLabelSlotSx` in `two-column.styles.ts` as canonical examples.

**Policy: zero-tolerance inline `sx`, component files included (2026-08-31).** Component `.tsx` files previously used a "~3 properties" threshold — anything smaller could stay inline — while only `.stories.tsx` files (Step 8) were zero-tolerance. That split is retired: every `sx={}` object in a component `.tsx` file must now be extracted to `<component-name>.styles.ts`, regardless of property count, including single-property objects (`sx={{ color: 'primary.main' }}`) and layout one-liners (`sx={{ flex: 1, minWidth: 0 }}`). Reasoning mirrors the story-file rule: consistent discoverability (all styles grep-findable in one file per component), no per-render object allocations for static styles, and uniform enforcement avoids "is 2 properties ok?" debates. There are no exceptions for sub-components, internal/unexported components, or components with only one or two callers of `sx`. A shared style used by more than one sub-component still belongs in the _parent's_ `*.styles.ts` (see "Where a shared style constant lives" in `docs/component-api-contract.md`); a style used only by one component belongs in that component's own `*.styles.ts`.

### Step 3b — Animations (motion subpath components only)

Applies to any component exported from `src/motion-index.ts` (compiled to `dist/motion.js`).

Follow the motion-configuration-extraction rule canonicalized in [`oss-quality-standards` `AGENTS.md` §16.2](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/AGENTS.md#162--motion-configuration-extraction) (full guide, the `variants`/`animate`/`transition` thresholds, and the `MotionValue`-factory example for `style`: [`component-configuration-conventions.md`](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/component-configuration-conventions.md#motion-configuration-extraction)). In this repo that means: every `Variants` and `Transition` object, and every `animate`/`transition` config past the one-trivially-obvious-key threshold, moves out of `.tsx` and into `<component-name>.animations.ts`; `style` objects on `motion.*` elements follow the same zero-tolerance rule but live in `<component-name>.styles.ts` per Step 3 (a static object as a module-level constant, a `MotionValue`-based one as a factory function). Export primitive curve/duration values as named constants (e.g. `MY_EASING`, `MY_DURATION`) so they're referenceable from tests and shared across related components.

No mock-theme test file is required (animations have no theme dependency), but add at least one smoke assertion in the component's `*.test.ts` if any variant value encodes a non-obvious design decision (e.g. `y` offsets for enter vs. exit differ intentionally).

### Step 4 — Utils

- Move every pure logic function (nothing that returns JSX) out of `.tsx` files and into `<component-name>.utils.ts`.
- Each function must be independently unit-testable with no React or MUI dependency.

### Step 5 — Sub-components

Apply the unconditional own-folder rule canonicalized in [`oss-quality-standards` `AGENTS.md` §5.6](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/AGENTS.md#56--standalone-vs-sub-component-test) (full rationale: [`component-structure.md`](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/component-structure.md#deciding-whether-a-component-is-standalone-or-a-sub-component)): every sub-component extracted out of a parent `.tsx` must live in its own further-nested subfolder, unconditionally, regardless of size. There is no flat-file fallback, no matter how small or trivial the sub-component looks.

In this repo, apply it as follows:

- Any function that starts with a capital letter and returns JSX must not be defined inline in the parent `.tsx` file — extract it to its own named subfolder (mirror `TimelineTwoColumn`'s `milestone-badge/`, `phase-card/`, `phase-warning-popover/`, `spine-connector/`, `timeline-dot/`).
- Each sub-component folder gets its own `index.ts` barrel, its own `types.ts` if it has a props type (importing shared types from the parent's `types.ts` where needed), and its own co-located test file. Constants and shared logic that are genuinely parent-scoped stay in the parent's `*.const.ts` / `*.utils.ts`; anything specific to the sub-component moves with it.
- Give every sub-component `displayName` and, where it wraps a DOM element or MUI component, `React.forwardRef` — see the Scenario A checklist below.
- Add the sub-component to the parent folder's `index.ts` barrel (re-exporting from the sub-component's own folder).
- Add at least one test for each sub-component, co-located in its own folder.

### Step 6 — Main `.tsx` cleanup

The `.tsx` file is the **composition layer only** after the above steps. Verify:

- [ ] No `type` or `interface` declarations
- [ ] No named constants for sizes or spacing
- [ ] No inline `sx={}` — every sx object, regardless of property count, lives in `<component-name>.styles.ts`
- [ ] No pure logic functions (no JSX return)
- [ ] No capital-letter helper components defined inside the file
- [ ] No `React.FC` — plain function declarations only
- [ ] No bare `<Box>` without at least one MUI-specific prop (`sx`, `component`, `ref`, shorthand layout)
- [ ] No `any` — use `unknown` + type guards, or `as` only when verifiable by inspection
- [ ] `sx` array spread on root: `sx={[baseStyles, ...(Array.isArray(sx) ? sx : [sx])]}`
- [ ] `...other` spread on root element
- [ ] No `dangerouslySetInnerHTML` — ever, in any component, no exceptions (`oss-quality-standards` §6.11; see `AGENTS.md` §6 for the full org standard)
- [ ] **If this component lives in the `inputs/` layer, or accepts user-typed content**, it also satisfies `oss-quality-standards` §6.12 (input-component security rules) — load the full org standard before writing the component, not at review time

### Step 6b — API surface consistency (required)

For any standalone component exported from `src/index.ts`, verify its public prop surface is intentionally consistent with the API contract canonicalized in [`oss-quality-standards` `component-api-contract.md`](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/component-api-contract.md) — specifically [§ "Props interface shape"](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/component-api-contract.md#props-interface-shape), [§ "`sx` array-safety rule"](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/component-api-contract.md#sx-array-safety-rule), and [§ "`...other` passthrough"](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/component-api-contract.md#other-passthrough).

In this repo, verify:

- [ ] If the component is a MUI-root wrapper, its props type extends/omits from the matching MUI root props (`BoxProps`, `PaperProps`, `CardProps`, etc.)
- [ ] If the component exposes `sx`, root merge is array-safe: `sx={[base, ...(Array.isArray(sx) ? sx : [sx])]}`
- [ ] Root passthrough props are forwarded with `...other`
- [ ] Any intentional exception (opinionated/non-wrapper API) is documented in both `types.ts` JSDoc and component `README.md`
- [ ] Existing README claims about API behavior are accurate for this component (no global claims copied without verification)

### Step 7 — Tests

Review the full `*.test.ts` file against [`oss-quality-standards` `testing.md`](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/testing.md) — specifically [§ "Test environment"](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/testing.md#test-environment) (jsdom directive, why it's needed per-file), [§ "Testing without a full DOM renderer"](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/testing.md#testing-without-a-full-dom-renderer) (`React.createElement` in `.ts` test files, `renderToStaticMarkup` for structure/ARIA), [§ "Testing interactions"](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/testing.md#testing-interactions) (mounted, `act`-flushed renders for anything stateful), and [§ "Meaningful assertions"](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/testing.md#meaningful-assertions) (no empty/placeholder assertions, no coverage-padding `it.todo`, regex for category-level negative assertions).

In this repo, verify:

- [ ] `// @vitest-environment jsdom` at the top
- [ ] Uses `React.createElement` (not JSX) — avoids the JSX transform requirement in `.ts` files
- [ ] Uses `renderToStaticMarkup` for structure/ARIA tests
- [ ] Uses `ReactDOM.createRoot` + `act` for interaction/click tests
- [ ] Every assertion is meaningful — no empty assertions, no `it.todo` to pad coverage
- [ ] Negative assertions use regex when the constraint is a category of values, not one specific value
- [ ] `describe('readability — minimum size constants', ...)` block present if constants exist
- [ ] Styles test file covers every exported factory

### Step 8 — Stories

Review or create `<component-name>.stories.tsx`:

- [ ] Storybook group matches the canonical map in `copilot-instructions.md` (never `'Components'`)
- [ ] `argTypes: { control: false }` on all `ReactNode` and `SxProps` slots
- [ ] Story controls prioritize decision props. Use Storybook-level excludes for inherited noise props and per-story `argTypes` for any additional pruning.
- [ ] All six palette keys shown where colour variants exist: `primary`, `secondary`, `info`, `success`, `warning`, `error`
- [ ] A `Responsive` story rendering the component at xs/sm/md/lg breakpoint widths
- [ ] Decision-doc stories added for every non-obvious design or accessibility rule in this component
- [ ] Named component helpers used for any story render function that uses React hooks
- [ ] **No hardcoded hex, rgb, or rgba literals in any story file.** Story scaffold chrome (breakpoint labels, dashed borders, dividers) must use MUI theme tokens via `sx` on MUI components (`<Typography>`, `<Box>`). Never use `style={{ color: '#666' }}` or `style={{ border: '1px dashed #ccc' }}`; use `sx={{ color: 'text.secondary' }}` and `sx={{ border: '1px dashed', borderColor: 'divider' }}` instead. This ensures story chrome respects dark mode automatically. **Use the shared constants from `src/stories-defaults.ts`** — never re-define equivalent patterns inline:
- [ ] **Zero inline `sx={{}}` in story files.** Every `sx` object in a story file — regardless of property count — must be extracted to a module-level named constant before the first story export. Reasoning: (1) consistent discoverability — all styles grep-findable at file top, (2) no per-render object allocations for static styles, (3) uniform enforcement avoids "is 2 properties ok?" debates. This same zero-tolerance rule now also applies to component `.tsx` files (see Step 3's policy note) — there is no longer a threshold split between story files and component files. There are **no exceptions** — not even single-property objects or `{ width }` loop variables.

  | Constant                          | Usage                                                                                      |
  | --------------------------------- | ------------------------------------------------------------------------------------------ |
  | `BREAKPOINTS`                     | Standard xs/sm/md/lg breakpoint array `{ label, width }` — use in every `Responsive` story |
  | `BREAKPOINTS_GRID`                | Same array with `cols` added — use in grid-layout `Responsive` stories                     |
  | `responsiveWrapperSx`             | Outer `<Box>` in `Responsive` stories (flex column, gap 4)                                 |
  | `breakpointLabelSx`               | `<Typography>` caption label above each breakpoint container                               |
  | `buildBreakpointWidthSx(w)`       | Standard dashed-border container at pixel width `w` — use in all Responsive stories        |
  | `buildBreakpointPaddedWidthSx(w)` | Like above with `p: 1` inner padding                                                       |
  | `buildBreakpointMaxWidthSx(w)`    | Like above with `maxWidth: '100%'` for responsive-capped stories                           |
  | `variantGridSx`                   | Flex-wrap row for colour-variant tile grids                                                |
  | `dotColumnSx`                     | Vertical centre-aligned column for dot/icon stacks                                         |
  | `timelineStoryWrapperSx`          | Max-width centred wrapper for timeline stories                                             |
  | `MANGO_*` / `GISELLE_*`           | Giselle brand palette tokens — use instead of hardcoded hex                                |

  `BREAKPOINTS` and `BREAKPOINTS_GRID` are also exported from `@littlebranches/giselle-mui/utils` for use in component utilities and tests.

### Step 9 — Barrel (`index.ts`)

- [ ] Component exported
- [ ] All sub-components exported
- [ ] `types.ts` re-exported (`export * from './types'`)
- [ ] `*.const.ts` re-exported (`export * from './<name>.const'`)
- [ ] `*.utils.ts` re-exported (`export * from './<name>.utils'`) if any utility is intended for consumers

### Step 10 — README

Update `README.md` with:

1. **Why it exists** — the non-obvious decision it encodes
2. **Why it belongs here** — what makes it library-worthy vs. app-specific
3. **Design decisions** — anything non-obvious about layout, accessibility, colour, or interaction
4. **Library safety** — zero proprietary deps, no personal content, no banned identifier names
5. **File structure** — list every file in the folder and its purpose
6. **Related** — links to related components or docs

### Step 10b — Component roadmap

The `roadmap.md` template and its rules are canonicalized in [`oss-quality-standards` `documentation-strategy.md` § "Component folder roadmap"](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/documentation-strategy.md#component-folder-roadmap) — use that template shape exactly (`Status` / `Open improvements` / `Known gaps` / `Completed`, the `⬜`/`🔄`/`✅` status vocabulary, the `> Last updated:` maintenance rule, the zero-personal-data rule).

This repo's own deviation from the generic doc: the OSS QS version makes `roadmap.md` optional, created once a component has enough open work to track. In `giselle-mui`, it is **mandatory** — every standalone component folder must contain a `roadmap.md` file, always (create it if it does not exist; update it if it does). Naming is always `roadmap.md`, identical across every component. This repo's own maturity vocabulary for the `Status` line is the four Giselle-ecosystem ripeness labels: `alpha`, `beta`, `stable`, `lts` (the generic doc leaves this vocabulary to each project).

This file is the single source of truth for planned work on this specific component. It is distinct from `docs/roadmap.md` (the library-level roadmap) — the library roadmap summarises phases and milestones; the component roadmap tracks granular per-component improvements.

---

### Step 11 — Quality gate

```sh
npm run check         # auto-fix Prettier + ESLint, then verify all
npm run check:verify  # verify only — must exit 0
```

All six checks must pass: Prettier → ESLint → `tsc --noEmit` → Vitest → tsup build → Storybook build.

Do not move to Step 12 if any check is red.

### Step 12 — Build

```sh
npm run build
```

Verify `dist/` contains the correct external references (not inlined source) for every peer dependency.

### Step 13 — Publish locally and validate

This is this repo's local instantiation of the generalized "validate in a real consumer before done" practice canonicalized in [`oss-quality-standards` `quality-gate.md` § "Validate in a real consumer before done"](https://github.com/LittleBranches/oss-quality-standards/blob/main/docs/quality-gate.md#validate-in-a-real-consumer-before-done): an automated gate passing is not sufficient — a library change must be linked into a real consumer app and rebuilt there before it's considered done, because only that step catches a wrong `exports` path, a peer-dependency mismatch, or a runtime error that only surfaces once real app code imports and renders the change. The generic doc leaves the linking mechanism to each repo; this repo's mechanism is `yalc`:

```sh
yalc push
```

Then in `<consumer-app>` (the private consuming app you're validating against):

```sh
rm -rf .next
npm run dev
```

Confirm the component renders correctly in the consuming app before closing the task.

### Step 14 — Record quality status

After all other DoD items are checked, record the final score in two places.

**1. Component `.tsx` file** — add one line inside the existing JSDoc block, just above the closing `*/`:

```tsx
/**
 * Existing description...
 *
 * **Quality status (DD Mon YYYY):** DoD n/22 · Best practices n/13
 */
export function MyComponent(...) {}
```

- `n/22` = number of Scenario B DoD checklist items met (use `n/12` for Scenario A sub-components)
- `n/13` = number of best-practices items met
- The date is the date the cleanup was completed — update it when the component is significantly changed

Keep the label **generic** — "best practices" is the correct public-facing term. The private mapping to specific compliance targets lives only in private planning docs, never in this library's source files.

**2. Component `README.md`** — add a `## Quality status` section above `## Related`:

```md
## Quality status — DD Mon YYYY

| Dimension        | Score | Open items                           |
| ---------------- | ----- | ------------------------------------ |
| DoD (Scenario B) | n/22  | SonarQube not yet run · …            |
| Best practices   | n/13  | JSDoc prop coverage not verified · … |
```

Use `DoD (Scenario A)` and `n/12` for sub-components.

> Scores reflect the state at the cleanup date. Update the date and re-run SonarQube
> whenever the component is significantly changed.

### Step 14b — Update the repo-wide compliance table (required, added 2026-08-31)

Step 14 records quality status _inside_ the component's own files. It does not, by
itself, keep `docs/component-compliance.md` (the repo-wide README/JSDoc/Story JSDoc/
Roadmap compliance table, linked from `docs/README.md` and `AGENTS.md` §2) in sync —
that required a separate manual step which had never been written down, so the table
went unmaintained: it was last regenerated 2026-06-14 and had no row at all for
`FeatureFlowSection` or any of its sub-components, despite them shipping weeks later.

Whenever a component is created, or an existing component's README/roadmap/stories/
`ref`-forwarding compliance changes:

- [ ] Add or update that component's row in `docs/component-compliance.md` (same layer
      grouping as its folder; sub-components get their own row, noted as a sub-component
      of their parent in the Notes column).
- [ ] If the component doesn't yet have README/roadmap/stories at all (a known,
      deliberately-deferred gap — e.g. a sub-component scoped out of the current PR),
      record that honestly with ❌ in the relevant columns and a Notes entry explaining
      why, rather than omitting the row. A missing row reads as "doesn't exist yet," not
      "exists and is non-compliant" — the two need different follow-up.

---

## Quick reference — files per component folder

```
src/components/<name>/
  <name>.tsx              — pure JSX composition only
  types.ts                — all TypeScript types and interfaces
  <name>.utils.ts         — pure logic functions (no JSX)
  <name>.styles.ts        — sx constants (static) and sx factories (dynamic)
  <name>.styles.test.ts   — mock-theme assertions for every exported sx function
  <name>.animations.ts    — framer-motion variants and transition configs (motion subpath components only)
  <name>.const.ts         — named constants (sizes, font sizes, spacing) — primitive values only, no JSX
  <name>.defaults.tsx     — default value arrays/objects that contain JSX (optional, only when needed)
  <name>.test.ts          — Vitest unit tests
  <name>.stories.tsx      — Storybook stories
  index.ts                — barrel: re-exports everything
  README.md               — why it exists, design decisions, file structure
  roadmap.md              — per-component planned improvements, known gaps, completed work
  <sub-component>/        — internal sub-components, each in its own named subfolder (own index.ts,
                            types.ts if it has props, co-located tests) — never a flat file
```

---

## Inventory / migration DoD (private inventory matrix)

**Sources of truth:** public library hygiene = [`../component-compliance.md`](../component-compliance.md); private migration matrix = the private wiki's inventory equivalence table (see wiki `component-tables-consolidation-plan.md`).

Folder **Scenario A / Scenario B** checklists in this document are the hygiene / folder half of done (Scenario B includes an explicit JSDoc props item — same idea as Scenario A). Scenario B DoD count is **22** (not 21).

For an **inventory port into giselle-mui** (a row in the wiki action matrix), the port is **done** when matrix **G · C · P · N · DoD** are all ✅.

1. **G · C · P · N** — migration gates.
2. **DoD** — matching Scenario folder checklist in this file (Scenario A or B). The matrix keeps **one DoD column** only.

There is **no** separate rollup column — all checkboxes green means done.

Matrix + legend: the private wiki's inventory equivalence table (not linked here — see the private wiki directly).

Do **not** add G/C/P/N (or other matrix letters) into the Scenario A/B numbered checklists below — keep those as folder hygiene only.

## Scenario A — Sub-component (own named subfolder inside a parent folder)

Use this checklist when Phase 0 confirms the component belongs to a parent and needs its own named subfolder.

### Reconnaissance checks (run before touching any file)

1. **Read `types.ts`** — verify the component's `Props` type is fully defined there. Flag any `type` or `interface` declared inside the `.tsx` itself.
2. **Read the parent `*.styles.ts`** — verify every sx constant imported by this file actually exists in that styles file. Flag any that are missing, misnamed, or have a wrong shape.
3. **Read `*.utils.ts`** — verify every utility imported by this file has the correct signature at the call site. A mismatched argument count is a silent runtime bug.
4. **Run SonarQube** on the `.tsx` file — note any cognitive complexity violations before making changes.
5. **Search the parent's `*.test.ts`** — check whether this sub-component has a dedicated `describe` block. If not, add one in Phase 2 Step 7.
6. **Search the parent's `*.stories.tsx`** — check whether this sub-component is exercised in any story, even indirectly. If it has a non-obvious variant or state, it needs a story.
7. **Flag duplicated JSX — and determine the right tree level for extraction.** Scan the `.tsx` for any render block that appears twice or more with only minor prop differences (e.g. a left and right slot rendering the same `<Typography>` tree). Every duplicate is an extraction candidate.

   Before creating the extracted component, look **up the component tree**:
   - Does the same pattern (or its semantic abstraction) appear in any sibling sub-components in this folder?
   - Does it appear in the parent component?
   - Could any other component in the library plausibly use this exact structure?

   The **name** of the extracted component must reflect the level at which it lives:
   - Pattern unique to this sub-component → name it after this sub-component (e.g. `MarkerLabel` — the floating caption is exclusive to `marker-row.tsx`)
   - Pattern shared across this sub-component's siblings → name it after the parent scope (e.g. `TimelineLabel` — if milestone rows and marker rows used the same label pattern)
   - Pattern generic enough for the whole library → name it after the concept (e.g. `SpineLabel`, `CaptionWithDate`)

   The higher up the tree you can place it while remaining semantically correct, the more reuse you get. **Always read all sibling components in the folder before naming the extracted component** — the reconnaissance step must confirm the pattern is unique before choosing a narrow name.

   **Promotion trigger — non-negotiable:** Do not promote an extracted component speculatively. Keep it at the narrow level until a **second concrete caller** appears in the codebase. Two signals make premature promotion tempting but wrong:
   - The styles are specific to the current use case (a second caller would need `sx` overrides to undo them — net zero benefit).
   - The logic it encodes is simple enough any developer would write it correctly without help (the core library rule: a component earns its place by saving others from rediscovering something non-obvious).

   When a second caller does appear, that is the correct trigger to rename, generalise the sx props, promote up the tree, and re-export. Not before.

8. **Flag inline conditional logic** — any `isMobile`-style boolean that changes rendering behaviour should be evaluated: does this logic belong in `*.utils.ts`? If the condition produces a derived value (not just a ternary in JSX), extract it.
9. **Check JSDoc** — verify the component JSDoc covers all props, including behaviour flags like `isMobile`, `isLastPhase`, `isDone`. Missing param documentation is a gap.
10. **Check barrel** — verify the component is exported from the parent folder's `index.ts`. Sub-components are not exported from `src/index.ts` (the package barrel) unless they are independently useful.

### Rules that differ from a standalone component

- **Own named subfolder — mandatory, unconditional.** `<parent-folder>/<sub-component-name>/`. There is no size or complexity threshold — every sub-component gets its own folder, always, because components grow and need to be portable. Drop the parent's name/scope from the sub-component's folder name (e.g. `milestone-badge/`, not `two-column-milestone-badge/`); the exported component name and internal file basename keep the sub-component's full descriptive name (e.g. `milestone-badge/milestone-badge.tsx` exporting `MilestoneBadge`). See the folder-naming convention in `docs/naming-conventions.md` for the general rule this follows.
- **Own `types.ts`.** The sub-component's `Props` type lives here. Import any shared types the parent or siblings also use from the parent's `../types.ts` — do not duplicate them.
- **Own `*.styles.ts` / `*.const.ts` / `*.utils.ts`** for anything genuinely specific to this sub-component. Only what is truly shared across siblings or the parent stays in the parent folder's files.
- **Own `index.ts` barrel.** Re-exports the component (and its types) from this subfolder; the parent folder's `index.ts` re-exports from the sub-component's folder in turn.
- **Own `README.md`** is optional for a sub-component (unlike a standalone component, where it's mandatory) — a short doc comment on the component is sufficient unless the sub-component encodes a non-obvious design decision worth writing up on its own.
- **Own `*.stories.tsx`** unless it is independently useful to evaluate in isolation (apply the story decision rule: would a developer open this story to decide how to use it?).
- **Tests** are co-located inside the sub-component's own subfolder — never flat in the parent folder and never mixed into the parent's `*.test.ts`.
- **`displayName` and `forwardRef`** — every sub-component gets a `displayName`. If it wraps a DOM element or an MUI component (i.e. it accepts and forwards a `ref`), it must use `React.forwardRef`.

### Definition of done for a sub-component

- [ ] Own named subfolder created, nested inside the parent folder
- [ ] No `type` or `interface` declarations in the `.tsx` — all in this sub-component's own `types.ts` (shared types imported from parent `../types`)
- [ ] No inline sx — all extracted to a styles file, regardless of property count (own or parent's, whichever is genuinely shared)
- [ ] No duplicated JSX blocks — extracted to a helper or util
- [ ] All inline conditional logic that produces a derived value is in `*.utils.ts`
- [ ] JSDoc covers all props including behaviour flags
- [ ] `displayName` set; `React.forwardRef` used if the sub-component wraps a DOM element or MUI component
- [ ] At least one test file exists, co-located in this sub-component's own subfolder
- [ ] Own `index.ts` barrel exists and is re-exported from the parent's `index.ts`
- [ ] SonarQube: zero violations
- [ ] `npm run check:verify` exits 0
- [ ] Quality status added to JSDoc (one line) — Step 14

---

## Scenario B — Standalone component (needs its own subfolder)

Use this checklist when Phase 0 confirms the component is independently usable but is currently living as a flat file or in the wrong location.

### Reconnaissance checks (run before touching any file)

1. **Read the current `.tsx` file** — note every import. After the move, every relative import path will break. List them.
2. **Search `src/index.ts`** — check whether the component is already exported from the package barrel. If it is, the export path must be updated after the move.
3. **Search the whole `src/` tree** for any file that imports this component by path\*\* — `grep_search` for the filename. Every import path will need to be updated after the move.
4. **Run SonarQube** on the `.tsx` file — note all violations before moving anything.
5. **Run `get_errors`** — baseline TypeScript and ESLint state before any structural change.
6. **Check test coverage** — does a `*.test.ts` already exist for this component? If it does, it moves with the component. If not, it must be created in Phase 2 Step 7.
7. **Check for a `*.stories.tsx`** — same as above.
8. **Flag duplicated JSX** — same as Scenario A.
9. **Flag inline conditional logic** — same as Scenario A.
10. **Check JSDoc** — same as Scenario A.

### Migration checklist (run once, before Phase 2)

Complete this before starting any implementation steps. The goal is a clean move with zero broken imports.

1. **Create the subfolder**: `src/components/<layer>/<category>/<name>/`
   where `<layer>` is `material`, `motion`, `section`, `giselle`, or `theming`;
   `<category>` follows MUI's own naming for `material` components (e.g. `surfaces/card/`,
   `data-display/icon/`, `layout/`, `navigation/`, `input/`, `feedback/`).
   See the **Domain/feature grouping** section in `copilot-instructions.md` for the full tree.
   **Why this structure:** the folder tree deliberately mirrors the "Components" navigation
   that consumers see in the docs site — the same convention every MUI Store competitor uses.
2. **Move the `.tsx` file** into the subfolder and rename if needed to match the folder name.
3. **Create all companion files** as empty stubs (fill them in during Phase 2):
   - `types.ts`
   - `<name>.utils.ts`
   - `<name>.styles.ts`
   - `<name>.styles.test.ts`
   - `<name>.const.ts`
   - `<name>.test.ts`
   - `<name>.stories.tsx`
   - `index.ts` (barrel — export the component immediately so import paths can be updated)
   - `README.md`
4. **Update every import path** found in the reconnaissance step — all consumers of this component need their import updated to the new path or to the package barrel.
5. **Update `src/index.ts`** to export from the new path if the component was already exported.
6. **Run `get_errors`** again — confirm zero broken imports before proceeding to Phase 2.

### Rules that apply to a standalone component

- **Own subfolder — mandatory.** `src/components/<layer>/<category>/<name>/` (see Domain/feature grouping in copilot-instructions.md)
- **Own `types.ts`** — all TypeScript types and interfaces for this component and all its internal sub-components.
- **Own `<name>.utils.ts`** — all pure logic functions.
- **Own `<name>.styles.ts` + `<name>.styles.test.ts`** — all sx constants and factories, with mock-theme assertions.
- **Own `<name>.const.ts`** — all size, font size, spacing, and touch-target constants, with regression tests.
- **Own `<name>.test.ts`** — Vitest unit tests for component, sub-components, utils, and constants.
- **Own `<name>.stories.tsx`** — mandatory. Standalone components are independently evaluable by definition.
- **Own `index.ts` barrel** — exports the component, all sub-components, types, constants, and any utils intended for consumers.
- **Own `README.md`** — why it exists, why it belongs here, design decisions, library safety, file structure, related.
- **Internal sub-components** each live in their own named subfolder inside this component's folder — Scenario A rules apply to them.
- **Exported from `src/index.ts`** — the package barrel must export this component.

### Definition of done for a standalone component

- [ ] Own subfolder created with all companion files present
- [ ] No `type` or `interface` declarations in `.tsx` — all in `types.ts`
- [ ] No inline sx — all in `<name>.styles.ts`, regardless of property count
- [ ] `<name>.styles.test.ts` covers every exported factory
- [ ] No named constants for sizes inline — all in `<name>.const.ts`
- [ ] Regression tests for every size constant with a safety minimum
- [ ] No pure logic functions in `.tsx` — all in `<name>.utils.ts`
- [ ] No capital-letter helper components defined inside `.tsx` — each extracted to its own named subfolder (Scenario A)
- [ ] No `React.FC`, no `any`, no bare `<Box>` without props
- [ ] `sx` array spread on root element
- [ ] `...other` spread on root element
- [ ] All internal sub-components exported from `index.ts`
- [ ] `src/index.ts` exports the component
- [ ] `README.md` complete
- [ ] JSDoc covers all props including behaviour flags
- [ ] SonarQube: zero violations
- [ ] All six palette keys shown in stories where colour variants exist
- [ ] `Responsive` story present
- [ ] `npm run check:verify` exits 0
- [ ] `npm run build` exits 0
- [ ] `yalc push` + consuming app validated
- [ ] Quality status added to component JSDoc and `README.md` — Step 14
