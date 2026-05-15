# Component cleanup workflow

Use this as the step-by-step playbook whenever creating or cleaning up a component in `giselle-mui`.

---

## Phase 0 — Determine component role (do this before anything else)

Before reading a single line of implementation, answer this one question:

> Is this component **independently usable by a consumer**, or does it only make sense inside one specific parent?

| Signal                                                            | Role                                 |
| ----------------------------------------------------------------- | ------------------------------------ |
| Exported from `src/index.ts`                                      | Standalone — needs its own subfolder |
| Listed in `docs/component-inventory.md`                           | Standalone                           |
| File lives flat inside a parent component folder                  | Sub-component — correctly flat       |
| Only imported by one sibling `.tsx` in the same folder            | Sub-component                        |
| Has its own `Props` type but is never consumed outside its folder | Sub-component                        |

The answer determines which scenario applies for every step in Phase 2. Do not skip this — confusing the two scenarios leads to the wrong folder structure and the wrong barrel exports.

→ If **Scenario A** (sub-component): proceed to Phase 1 with the sub-component rules active.
→ If **Scenario B** (standalone): proceed to Phase 1, then follow the migration checklist at the end of this document before Phase 2.

### Phase 0b — Should this component be exported from `src/index.ts`?

This is a separate question from the folder structure. A standalone component in its own subfolder is not automatically exported from the package barrel — it must earn that.

Answer these in order. Stop at the first yes.

1. **Could a second project use this exactly as-is?** If `first-branch`, a future app, or any other giselle-mui consumer would want to import this component directly, it belongs in the barrel.
2. **Is it used in more than one place in the consuming app?** Multiple independent usages in `alexrebula` (or any consumer) signal it encodes something reusable, not something app-specific.
3. **Is it listed in `docs/component-inventory.md`?** If yes, the decision was already made — add it to the barrel.
4. **Does it encode an accessibility or design rule that is non-trivial to get right?** Correct `aria-*` wiring, `sx` array spread, minimum icon sizes, column-alignment invariants — things a developer would silently get wrong without this component.

**If any answer is yes** → the component is exported from `src/index.ts`. Add it to the barrel in Phase 2 Step 9.

**If all answers are no** → the component stays private. It is exported from its own folder's `index.ts` (so the parent can import it cleanly) but does **not** appear in `src/index.ts`. Do not add it to the package barrel — a false export implies it is independently useful when it is not.

> **Note for sub-components (Scenario A):** a sub-component should almost never be in `src/index.ts`. The only exception is if it answers yes to all four questions above AND a consumer would realistically import it standalone. When in doubt, keep it private.

---

## Phase 1 — Context gathering (read-only, parallelise freely)

1. **Read session bootstrap files** — `docs/roadmap.md`, any component-specific plan under `docs/components/`, repo memory (`/memories/repo/notes.md`).
2. **Read every file in the component folder** — `.tsx`, `types.ts`, `utils.ts`, `*.styles.ts`, `*.const.ts`, `*.test.ts`, `*.stories.tsx`, `index.ts`, `README.md`.
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

- Move every `sx={}` object with more than ~3 properties out of `.tsx` files and into `<component-name>.styles.ts`.
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

### Step 3b — Animations (motion subpath components only)

Applies to any component exported from `src/motion-index.ts` (compiled to `dist/motion.js`).

- Move every framer-motion `Variants` object and `Transition` config out of `.tsx` files and into `<component-name>.animations.ts`.
- Named `Variants` → `export const <name>Variants: Variants = { initial: {...}, animate: {...}, exit: {...} }`.
- Named `Transition` → `export const <name>Transition: Transition = { duration: X, ease: [...] }`.
- Export primitive curve/duration values as named constants so they can be referenced in tests and shared across related components:
  ```ts
  export const MY_EASING: [number, number, number, number] = [0.4, 0, 0.2, 1];
  export const MY_DURATION = 0.28;
  ```
- Use the named variants API in JSX: `variants={myVariants} initial="initial" animate="animate" exit="exit"` — never inline objects.
- No mock-theme test file is required (animations have no theme dependency), but add at least one smoke assertion in the component's `*.test.ts` if any variant value encodes a non-obvious design decision (e.g. `y` offsets for enter vs. exit differ intentionally).

### Step 4 — Utils

- Move every pure logic function (nothing that returns JSX) out of `.tsx` files and into `utils.ts`.
- Each function must be independently unit-testable with no React or MUI dependency.

### Step 5 — Sub-components

- Any function that starts with a capital letter and returns JSX must not be defined inline in the parent `.tsx` file.
- Extract each to its own flat `.tsx` file in the same folder (no nested subfolders).
- Types for sub-components stay in the folder's `types.ts`. Constants stay in `*.const.ts`. Logic stays in `utils.ts`.
- Add the sub-component to the folder's `index.ts` barrel.
- Add at least one test for each sub-component (new `describe` block in the main `*.test.ts` or a dedicated `<sub-component>.test.ts`).

### Step 6 — Main `.tsx` cleanup

The `.tsx` file is the **composition layer only** after the above steps. Verify:

- [ ] No `type` or `interface` declarations
- [ ] No named constants for sizes or spacing
- [ ] No `sx={}` with more than ~3 properties inline
- [ ] No pure logic functions (no JSX return)
- [ ] No capital-letter helper components defined inside the file
- [ ] No `React.FC` — plain function declarations only
- [ ] No bare `<Box>` without at least one MUI-specific prop (`sx`, `component`, `ref`, shorthand layout)
- [ ] No `any` — use `unknown` + type guards, or `as` only when verifiable by inspection
- [ ] `sx` array spread on root: `sx={[baseStyles, ...(Array.isArray(sx) ? sx : [sx])]}`
- [ ] `...other` spread on root element

### Step 6b — API surface consistency (required)

For any standalone component exported from `src/index.ts`, verify its public prop surface is intentionally consistent.

- [ ] If the component is a MUI-root wrapper, its props type extends/omits from the matching MUI root props (`BoxProps`, `PaperProps`, `CardProps`, etc.)
- [ ] If the component exposes `sx`, root merge is array-safe: `sx={[base, ...(Array.isArray(sx) ? sx : [sx])]}`
- [ ] Root passthrough props are forwarded with `...other`
- [ ] Any intentional exception (opinionated/non-wrapper API) is documented in both `types.ts` JSDoc and component `README.md`
- [ ] Existing README claims about API behavior are accurate for this component (no global claims copied without verification)

### Step 7 — Tests

Review the full `*.test.ts` file:

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
- [ ] **No hardcoded hex, rgb, or rgba literals in any story file.** Story scaffold chrome (breakpoint labels, dashed borders, dividers) must use MUI theme tokens via `sx` on MUI components (`<Typography>`, `<Box>`). Never use `style={{ color: '#666' }}` or `style={{ border: '1px dashed #ccc' }}`; use `sx={{ color: 'text.secondary' }}` and `sx={{ border: '1px dashed', borderColor: 'divider' }}` instead. This ensures story chrome respects dark mode automatically. **Use the shared constants from `src/stories-defaults.ts`** (`responsiveWrapperSx`, `breakpointLabelSx`, `breakpointContainerSx`, `variantGridSx`, `dotColumnSx`, `timelineStoryWrapperSx`) rather than re-defining equivalent patterns inline.

### Step 9 — Barrel (`index.ts`)

- [ ] Component exported
- [ ] All sub-components exported
- [ ] `types.ts` re-exported (`export * from './types'`)
- [ ] `*.const.ts` re-exported (`export * from './<name>.const'`)
- [ ] `utils.ts` re-exported if any utility is intended for consumers

### Step 10 — README

Update `README.md` with:

1. **Why it exists** — the non-obvious decision it encodes
2. **Why it belongs here** — what makes it library-worthy vs. app-specific
3. **Design decisions** — anything non-obvious about layout, accessibility, colour, or interaction
4. **Library safety** — zero proprietary deps, no personal content, no banned identifier names
5. **File structure** — list every file in the folder and its purpose
6. **Related** — links to related components or docs

### Step 10b — Component roadmap

Every standalone component folder must contain a `roadmap.md` file. Create it if it does not exist; update it if it does.

**Naming:** always `roadmap.md` — identical across every component.

**Format — non-negotiable (use this template exactly):**

```md
# <ComponentName> — Roadmap

> Last updated: DD Mon YYYY

## Status

`alpha` _(replace with your status: `alpha` · `beta` · `stable` · `lts`)_

One sentence on the current state of the component.

## Open improvements

| Task                               | Priority | Status |
| ---------------------------------- | -------- | ------ |
| Description of planned improvement | Medium   | ⬜     |

## Known gaps

Bullet list of anything missing from the current implementation that is not yet in the table above
(e.g. missing story variants, untested edge cases, accessibility gaps).
Write "None" if there are no known gaps.

## Completed

| Task                                 | Completed   |
| ------------------------------------ | ----------- |
| Description of completed improvement | DD Mon YYYY |
```

**Rules:**

- Status values: `⬜` not started · `🔄` in progress · `✅` done
- When a task from "Open improvements" is completed, move it to the "Completed" table with the date — do not delete it.
- The "Status" line must be one of the four ripeness labels used across the Giselle ecosystem: `alpha`, `beta`, `stable`, `lts`.
- Update `> Last updated:` every time the file is edited.
- Do not add personal names, client names, or any content that could not safely appear in a public MIT-licensed repository.

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

```sh
yalc push
```

Then in `alexrebula` (or `first-branch`):

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
 * **Quality status (DD Mon YYYY):** DoD n/21 · Best practices n/13
 */
export function MyComponent(...) {}
```

- `n/21` = number of Scenario B DoD checklist items met (use `n/10` for Scenario A sub-components)
- `n/13` = number of best-practices items met
- The date is the date the cleanup was completed — update it when the component is significantly changed

Keep the label **generic** — "best practices" is the correct public-facing term. The private mapping to specific compliance targets lives only in private planning docs, never in this library's source files.

**2. Component `README.md`** — add a `## Quality status` section above `## Related`:

```md
## Quality status — DD Mon YYYY

| Dimension        | Score | Open items                           |
| ---------------- | ----- | ------------------------------------ |
| DoD (Scenario B) | n/20  | SonarQube not yet run · …            |
| Best practices   | n/13  | JSDoc prop coverage not verified · … |
```

Use `DoD (Scenario A)` and `n/9` for sub-components.

> Scores reflect the state at the cleanup date. Update the date and re-run SonarQube
> whenever the component is significantly changed.

---

## Quick reference — files per component folder

```
src/components/<name>/
  <name>.tsx              — pure JSX composition only
  types.ts                — all TypeScript types and interfaces
  utils.ts                — pure logic functions (no JSX)
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
  <sub-component>.tsx     — internal sub-components (flat, not in subfolders)
```

---

## Scenario A — Sub-component (correctly flat inside a parent folder)

Use this checklist when Phase 0 confirms the component lives flat and belongs to a parent.

### Reconnaissance checks (run before touching any file)

1. **Read `types.ts`** — verify the component's `Props` type is fully defined there. Flag any `type` or `interface` declared inside the `.tsx` itself.
2. **Read the parent `*.styles.ts`** — verify every sx constant imported by this file actually exists in that styles file. Flag any that are missing, misnamed, or have a wrong shape.
3. **Read `utils.ts`** — verify every utility imported by this file has the correct signature at the call site. A mismatched argument count is a silent runtime bug.
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

8. **Flag inline conditional logic** — any `isMobile`-style boolean that changes rendering behaviour should be evaluated: does this logic belong in `utils.ts`? If the condition produces a derived value (not just a ternary in JSX), extract it.
9. **Check JSDoc** — verify the component JSDoc covers all props, including behaviour flags like `isMobile`, `isLastPhase`, `isDone`. Missing param documentation is a gap.
10. **Check barrel** — verify the component is exported from the parent folder's `index.ts`. Sub-components are not exported from `src/index.ts` (the package barrel) unless they are independently useful.

### Rules that differ from a standalone component

- **No own subfolder.** The file stays flat in the parent folder.
- **No own `types.ts`, `utils.ts`, `*.styles.ts`, `*.const.ts`.** All of these belong to the parent folder's shared files.
- **No own `index.ts` barrel.** Exported via the parent folder's `index.ts` only.
- **No own `README.md`.** Document the sub-component in the parent folder's `README.md` under a "Sub-components" section.
- **No own `*.stories.tsx`** unless it is independently useful to evaluate in isolation (apply the story decision rule: would a developer open this story to decide how to use it?).
- **Tests** go in the parent's `*.test.ts` as a new `describe` block, or in a dedicated `<sub-component>.test.ts` flat in the same folder — never in a subfolder.

### Definition of done for a sub-component

- [ ] No `type` or `interface` declarations in the `.tsx` — all in parent `types.ts`
- [ ] No sx with more than ~3 properties inline — all in parent `*.styles.ts`
- [ ] No duplicated JSX blocks — extracted to a helper or util
- [ ] All inline conditional logic that produces a derived value is in `utils.ts`
- [ ] JSDoc covers all props including behaviour flags
- [ ] At least one test `describe` block exists for this sub-component
- [ ] Exported from parent `index.ts`
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

1. **Create the subfolder**: `src/components/<domain>/<name>/`
2. **Move the `.tsx` file** into the subfolder and rename if needed to match the folder name.
3. **Create all companion files** as empty stubs (fill them in during Phase 2):
   - `types.ts`
   - `utils.ts`
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

- **Own subfolder — mandatory.** `src/components/<domain>/<name>/`
- **Own `types.ts`** — all TypeScript types and interfaces for this component and all its internal sub-components.
- **Own `utils.ts`** — all pure logic functions.
- **Own `<name>.styles.ts` + `<name>.styles.test.ts`** — all sx constants and factories, with mock-theme assertions.
- **Own `<name>.const.ts`** — all size, font size, spacing, and touch-target constants, with regression tests.
- **Own `<name>.test.ts`** — Vitest unit tests for component, sub-components, utils, and constants.
- **Own `<name>.stories.tsx`** — mandatory. Standalone components are independently evaluable by definition.
- **Own `index.ts` barrel** — exports the component, all sub-components, types, constants, and any utils intended for consumers.
- **Own `README.md`** — why it exists, why it belongs here, design decisions, library safety, file structure, related.
- **Internal sub-components** live flat in the same folder (no nested subfolders) — Scenario A rules apply to them.
- **Exported from `src/index.ts`** — the package barrel must export this component.

### Definition of done for a standalone component

- [ ] Own subfolder created with all companion files present
- [ ] No `type` or `interface` declarations in `.tsx` — all in `types.ts`
- [ ] No sx with more than ~3 properties inline — all in `<name>.styles.ts`
- [ ] `<name>.styles.test.ts` covers every exported factory
- [ ] No named constants for sizes inline — all in `<name>.const.ts`
- [ ] Regression tests for every size constant with a safety minimum
- [ ] No pure logic functions in `.tsx` — all in `utils.ts`
- [ ] No capital-letter helper components defined inside `.tsx` — each in its own flat `.tsx`
- [ ] No `React.FC`, no `any`, no bare `<Box>` without props
- [ ] `sx` array spread on root element
- [ ] `...other` spread on root element
- [ ] All internal sub-components exported from `index.ts`
- [ ] `src/index.ts` exports the component
- [ ] `README.md` complete
- [ ] SonarQube: zero violations
- [ ] All six palette keys shown in stories where colour variants exist
- [ ] `Responsive` story present
- [ ] `npm run check:verify` exits 0
- [ ] `npm run build` exits 0
- [ ] `yalc push` + consuming app validated
- [ ] Quality status added to component JSDoc and `README.md` — Step 14
