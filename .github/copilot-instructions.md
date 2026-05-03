# @alexrebula/giselle-mui — Copilot Instructions

This is an open-source React component library built on top of `@mui/material` v7.
It is authored by Alex Rebula and licensed MIT.

## What this library is

A set of small, focused MUI wrapper components that encode non-obvious design and
accessibility decisions so consumers don't have to rediscover them. Every component
in this library exists because it solves a recurring problem that is either:

- easy to get wrong (e.g. `Paper onClick` vs `ButtonBase` for keyboard accessibility), or
- non-trivial to implement correctly with MUI alone (e.g. icon baseline gaps, CSS-var color tinting)

## Stack

- React 18+ with TypeScript — strict mode, no `any`
- `@mui/material` v7 (CSS variables mode — `theme.vars.palette.*` not `theme.palette.*`)
- `@iconify/react` for icons (Apache 2.0 — the only allowed icon peer dependency)
- Vitest + jsdom for unit tests
- Storybook for visual development and autodoc

## Component rules (non-negotiable)

0. **Zero personal data.** Stories, tests, JSDoc examples, and README code snippets must
   never contain real names (people, clients, employers), real project names, or any content
   derived from the `alexrebula` portfolio. Use generic placeholders:
   authors → `'Jane Smith'`, sources/projects → `'Platform Team'`, metrics → `'20+'` / `'of experience'`.
   Violating this rule exposes private career data in a public MIT-licensed repository.

1. **Zero proprietary dependencies.** Only `react`, `react-dom`, `@mui/material`,
   `@emotion/react`, `@emotion/styled`, and `@iconify/react` are allowed as
   peer/direct dependencies.

2. **`sx` array spread on root element.** Always:
   `sx={[baseStyles, ...(Array.isArray(sx) ? sx : [sx])]}`.

3. **`...other` spread on root element.** Enables `data-*`, `aria-*`, `id`,
   `className` without prop drilling.

4. **Only own props get JSDoc.** Never redeclare or document props inherited from
   MUI interfaces. TypeScript inheritance carries MUI's own descriptions into
   Storybook autodoc automatically.

4a. **JSDoc must use Markdown formatting.** Storybook autodoc renders JSDoc descriptions
as Markdown. Use `**bold**`, `- ` bullet lists, and fenced code blocks (` ```tsx `).
Never use bare indented code lines — they do not render as code blocks in Markdown.
`@example` tags are rendered separately as code snippets and remain plain JSX/TSX.

5. **ReactNode slots for icons and decoration.** Components never import an icon
   library internally. Accept `icon?: ReactNode` and let the consumer fill it.

6. **`color` prop follows MUI palette key convention.**
   `'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'`
   with `@default 'primary'`.

7. **Decorative elements carry `aria-hidden`.** Quote marks, separator dots,
   background shapes.

8. **No hardcoded hex or rgba literals.** Use `theme.vars.palette[color].mainChannel`
   for tints.

## File structure per component

```
src/components/<name>/
  <name>.tsx     — component + exported Props interface
  index.ts       — barrel: re-exports component and types
  README.md      — why it exists, why it belongs here, design decisions, library safety
  <name>.test.ts — Vitest unit tests
```

## Test conventions

- File extension must be `.test.ts` (not `.tsx`) — vitest config uses `include: ['src/**/*.test.ts']`
- Add `// @vitest-environment jsdom` at top of every test file
- Use `React.createElement` (not JSX) — avoids JSX transform requirement in `.ts` files
- Use `renderToStaticMarkup` for structure/ARIA tests
- Use `ReactDOM.createRoot` + `act` for interaction/click tests
- Mock all MUI components that have `theme.vars` in sx callbacks (MUI v7 CSS vars
  require `CssVarsProvider` which is not available in tests without the full theme setup)

## What Copilot should help build

- New components following all rules above
- Unit tests using the established Vitest patterns
- Storybook Stories with `argTypes: { control: false }` for `ReactNode` and `SxProps` slots
- README files: Why it exists → Why it belongs here → Design decisions → Library safety → File structure → Related
- Barrel index updates when new components are added

When asked to add a component, always verify: does this encode a non-obvious decision
that saves every consumer from rediscovering it? If not, it should not be in this library.

- `TimelineTwoColumn` visual pages for roadmap docs — see the **Roadmap visual sync rule**
  in the `alexrebula` copilot instructions. `TimelineTwoColumn` is the designated component
  for rendering any `docs/**/roadmap.md` file visually. When a roadmap doc is updated, the
  companion timeline page in `alexrebula` must be updated in the same commit to keep phases,
  milestones, and all expandable sub-information in full parity with the markdown source.

- **Roadmap hierarchy bubble-up rule** — also defined in the `alexrebula` copilot instructions.
  When a phase or milestone in `giselle-mui/docs/theming/roadmap.md` is completed or its date
  changes, the corresponding summary entry in `alexrebula/docs/roadmap.md` (Phase 1.5) and its
  `data.tsx` mirror must be updated in the same commit. The child roadmap is the source of
  truth for its own content; the ancestor holds a summary + link only, never a duplicate task list.

## Tone rule for docs and comments

Do not over-mention Minimals in this package's docs. `giselle-mui` has already credited
Minimals where appropriate. Repeating it in every doc dilutes the identity of this
library as its own thing. When updating or writing docs:

- Do not name-drop Minimals unless directly explaining a credit, a hard constraint,
  or a copyright boundary.
- Do not frame utilities or patterns as "what Minimals does" — describe what the
  utility does, independently.
- The one-liner `varAlpha` helper is a standard MUI v7 pattern; it does not need
  to be attributed to any theme kit every time it appears.

## Session bootstrap: where Copilot should look first

At the start of every new Copilot session in this package, read these files:

| File                                                                      | Purpose                                                                                                        |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [`docs/theming/roadmap.md`](../docs/theming/roadmap.md)                   | Phase A (theme utilities), Phase B (Giselle brand palette), Phase C (GiselleThemeProvider) — next planned work |
| [`docs/components/timeline-plan.md`](../docs/components/timeline-plan.md) | Full plan for `RoadmapTimeline` — next component to build                                                      |
| [`docs/theming/nextjs.md`](../docs/theming/nextjs.md)                     | How to wire this library into a Next.js app                                                                    |

### Current components (shipped)

| Component                             | File                                  | Status              |
| ------------------------------------- | ------------------------------------- | ------------------- |
| `GiselleIcon`                         | `src/components/giselle-icon/`        | ✅ Shipped + tested |
| `MetricCard` + `MetricCardDecoration` | `src/components/metric-card/`         | ✅ Shipped + tested |
| `QuoteCard`                           | `src/components/quote-card/`          | ✅ Shipped + tested |
| `SelectableCard`                      | `src/components/selectable-card/`     | ✅ Shipped + tested |
| `createIconRegistrar`                 | `src/utils/create-icon-registrar.ts`  | ✅ Shipped + tested |
| `TimelineTwoColumn`                   | `src/components/timeline-two-column/` | ✅ Shipped + tested |
| `IconActionBar`                       | `src/components/icon-action-bar/`     | ✅ Shipped + tested |

### Next planned work (priority order)

1. **Phase A theme utilities** — `varAlpha`, `createPaletteChannel`, `pxToRem` / `remToPx` in `src/utils/`. Prerequisite for Phase B and C. See `docs/theming/roadmap.md` Phase A table.
2. **Phase B — Giselle brand theme preset** — define the Giselle green + amber palette as `giselleTheme` using `extendTheme()`. Export from `src/index.ts`. See `docs/theming/roadmap.md` Phase B.
3. **Phase C — `GiselleThemeProvider`** — wraps `CssVarsProvider` with the Giselle default palette. Zero-config usage. Accepts `themeOverrides` for partial overrides and `theme` for full bypass. See `docs/theming/roadmap.md` Phase C.
4. **Storybook story polish** — Remaining: MetricCard notes panel, responsive `sx` demo in GiselleIcon.
5. **RoadmapTimeline component** — requires Phase A first. Full plan in `docs/components/timeline-plan.md`. Uses `@mui/lab` Timeline primitives (acceptable peer dep).

### Additional allowed peer dependencies

- `@mui/lab` — needed for Timeline primitives (`Timeline`, `TimelineItem`, `TimelineSeparator`, etc.). Acceptable under the zero-proprietary-dependencies rule.

### tsup `external` rule — non-negotiable

Every package listed under `peerDependencies` in `package.json` **must also appear in
the `external` array in `tsup.config.ts`**. If a peer dep is missing from `external`,
tsup bundles that package's source into `dist/index.js`. Webpack in the portfolio then
sees two module instances for context-holding singletons (e.g. `@mui/material`
`useMediaQuery`), causing runtime crashes:

```
_mui_material_useMediaQuery__WEBPACK_IMPORTED_MODULE_N__ is not a function
```

The webpack `resolve.alias` fix in `alexrebula/next.config.ts` only works on imports
that go through webpack's resolver — it cannot fix code that was pre-bundled by tsup.

**Enforcement checklist — run whenever `package.json` peerDependencies changes:**

1. Open `tsup.config.ts`.
2. Compare its `external` array against every key in `peerDependencies`.
3. Any missing key → add it to `external` immediately.
4. Run `npm run build` and verify the dist contains `import ... from "pkg"` lines
   (external reference), not inlined source code.

Current required entries (keep in sync with `package.json`):
- `react`, `react-dom`, `react/jsx-runtime`, `react/jsx-dev-runtime`
- `@mui/material`
- `@mui/lab`
- `@emotion/react`, `@emotion/styled`
- `@iconify/react`

---

## Post-component workflow (enforce always — run after every new component is complete)

After every new component is built, tests pass, and `check:verify` is green, run these
steps **in order** before switching to the portfolio:

```sh
# 1. Build the distributable (tsup) — produces dist/index.js and dist/index.d.ts
npm run build

# 2. Push to the portfolio via yalc — no restart or cache clear needed
yalc push
```

`yalc push` updates `node_modules/@alexrebula/giselle-mui` in the portfolio automatically.
Turbopack picks up the new files on the next import.

---

## Quality gate

All six checks must pass before every push:

```sh
npm run check         # auto-fix Prettier + ESLint, then verify all
npm run check:verify  # verify only (same as CI / pre-push hook)
```

Checks (in order): Prettier → ESLint → `tsc --noEmit` → Vitest → tsup build → Storybook build

- **Storybook build** runs in CI (`CI=true`) and is also part of the pre-push hook (`--storybook` flag).
  Broken stories are caught before any code reaches `main`.
- **tsup build** verifies the published package compiles and tree-shakes cleanly — not just types.
- Pre-push hook wired via `.githooks/pre-push` + `scripts/setup-hooks.js` (runs on `postinstall`).
- GitHub Actions CI defined in `.github/workflows/ci.yml`.

### Storybook infrastructure

- Config: `.storybook/main.ts` (react-vite builder) + `.storybook/preview.tsx` (wraps stories in `CssVarsProvider`)
- Stories live co-located with their component: `src/components/<name>/<name>.stories.tsx`
- Every story file must pass `tsc --noEmit`, ESLint, and Prettier — they are in `src/` and covered by all checks
- Named component helpers (e.g. `function ToggleDemo()`) must be used whenever a story render function uses React hooks — anonymous arrow functions inside `render:` violate the `react-hooks/rules-of-hooks` ESLint rule

### TimelineTwoColumn Storybook stories as design-decision documents — MANDATORY

Every non-trivial design decision in `TimelineTwoColumn` **must** be documented as a
dedicated Storybook story. Stories in this component are not just visual demos — they are
the canonical source of truth for architectural decisions that would otherwise only live
in PR descriptions or chat history.

**A new story is mandatory for every:**

- New component variant (`'marker'`, `'life-event'`, `'scenario'`) — document when to use
  it vs. the alternatives, with side-by-side comparison if relevant
- New prop that changes rendering behaviour — show the before/after in one story
- Non-obvious layout rule (column placement invariant, marker side direction, z-index
  stacking, overdue-dot colour) — make the rule visually verifiable in the canvas
- Design decision that was reached through iteration — document what was tried, what was
  wrong with it, and why the current approach was chosen

**Story structure for decision-doc stories:**

1. JSDoc on the export function: `title` → the rule or decision → why it was chosen →
   what the alternative was → the invariant it protects
2. `parameters.docs.description.story`: short markdown paragraph explaining what to observe
3. Canvas: shows the rule in action, verifiable without reading the source code

**Why this matters:**

`TimelineTwoColumn` has accumulated non-obvious architectural decisions through real-world
usage iterations (column inversion, marker `side` semantics, tooltip description previews,
birthday placement as marker not milestone, done-dot colour enforcement, z-index stacking).
A future contributor — or the next Copilot session — must be able to understand these
decisions from the stories alone, without access to the original conversation.

**The stories are the documentation. Write them first.**

---

## Code quality standards (enforce proactively — do not wait to be asked)

### Mandatory post-edit quality checks

After **every** file edit — no exceptions — run all three checks on the modified file before proceeding:

```sh
# 1. Prettier — auto-formats in place (fast, sub-second)
npx prettier --write <path/to/file>

# 2. ESLint with auto-fix — corrects lint violations in place (fast, sub-second)
npx eslint --fix <path/to/file>

# 3. SonarQube — catches cognitive complexity, DOM prop leaks, .dataset vs getAttribute, etc.
#    Use the sonarqube_analyze_file tool (not a terminal command)
```

**What each check catches:**

| Violation | Prettier | ESLint | SonarQube |
|---|---|---|---|
| Formatting (quotes, trailing commas, indent) | ✅ auto-fix | ⚠️ some rules | — |
| Duplicate imports | — | ✅ auto-fix | ✅ |
| Global builtins (`parseFloat` → `Number.parseFloat`) | — | ✅ auto-fix | ✅ |
| Unused variables / imports | — | ✅ | ✅ |
| Cognitive complexity > 15 | — | ❌ not configured | ✅ |
| DOM prop leaks (`shouldForwardProp`) | — | ❌ | ✅ |
| `getAttribute` vs `.dataset` | — | ❌ | ✅ |

Do not run tests, mark a task complete, or move to the next file until all three pass on the file just edited. If any check reports errors, fix them immediately before continuing.

---

### Cognitive complexity

SonarQube enforces a limit of **15** per function. Any callback inside `.map()` or `.forEach()` that has conditional logic, nested branches, or derived values is at risk.

**When to run `sonarqube_analyze_file`:**

- When a session opens on a component file that has open tasks — run it immediately, before any other work.
- After every edit to a component file — run it again to confirm no new violations were introduced.
- Before marking any task complete — must show zero violations.

**How to fix:** Extract per-item logic into a named helper function. The render callback itself should only compose already-computed values into JSX. Regex patterns with long alternation groups (e.g. 12-way month names) count toward complexity — prefer a broad pattern + JS validation instead.

### Memoization

Any value or function inside a component that is:

- derived from props/state, or
- passed as a prop to a child, or
- used as a `useEffect` dependency

...must be wrapped in `useMemo` / `useCallback` unless it is a primitive literal. Inline arrow functions inside `.map()` callbacks that are passed as props to children must be extracted to named `useCallback` handlers defined before the return statement.

### JSDoc

Every exported component function and every exported prop interface must have JSDoc. Storybook autodoc generates prop tables from TypeScript types but will not show a component-level description or usage notes without JSDoc on the function itself.

- JSDoc goes on the exported function, not just the Props type.
- Only document own props — never redeclare props inherited from MUI interfaces (rule 4). TypeScript inheritance carries MUI's own JSDoc into autodoc automatically.

### Component folder structure rule

A component gets its own subfolder (`src/components/<name>/`) **only when it is exported from `src/index.ts`** (independently usable by consumers).

Internal sub-components — helpers, local wrappers, private building blocks that only make sense inside their parent — stay flat in the parent's folder. Creating a subfolder for an internal component implies it is independently usable; that false signal causes confusion during refactors.

### Storybook story decision rule

A Storybook story file is created **only when seeing the component in isolation answers a question a developer would actually ask when deciding to use it**.

**Evaluation checklist before writing a story:**

1. Is the component exported from `src/index.ts` (independently usable)? If no — `.md` only.
2. Does isolation reveal something invisible in a full parent context (variant comparison, state matrix, light/dark mode switch)? If no — `.md` only.
3. Does a developer need to see this to choose how to use it? If no — `.md` only.

Use `argTypes: { control: false }` for `ReactNode` and `SxProps` slots. Every story that demonstrates colour variants must include all six palette keys: `primary`, `secondary`, `info`, `success`, `warning`, `error`.

Every exported component must have a `Responsive` story that renders the component inside labeled containers at each MUI standard breakpoint width: xs (360px), sm (600px), md (900px), lg (1200px). Use `parameters: { layout: 'padded' }` on these stories. For grid-based components (cards in a collection), the column count should increase with width. Named component helpers are required when the story uses React hooks.

### Preferred `.dataset` over `getAttribute` in tests

Use `element.dataset['camelKey']` rather than `element.getAttribute('data-kebab-key')` in test files. Sonar flags `getAttribute` as a code smell when `.dataset` is available.

### Minimum readable sizes (enforce always — not just before submission)

> **Every time you write a `width={...}` or `fontSize` on an icon or label, check this table first.**
> Violations of these minimums have happened repeatedly. Do not guess — look up the constant.

Icons and text in this library are read by real users. The following minimums are **non-negotiable** and enforced by regression tests:

| Element | Minimum | Notes |
|---|---|---|
| Inline icon (status badge, spine, pill) | `width={16}` | Never `width={12}` or `width={14}` |
| Interactive icon (button, clickable control) | `width={20}` | Clickable icons must be larger than decorative ones |
| Corner alert badge circle | `26px` | The circle container; icon inside must be `width={16}` |
| Standalone decorative icon (card corner) | CSS `width: 32, height: 32` | Applied via `'& svg': { width: 32, height: 32 }` |
| Pulsing dot / status indicator | `12px` | Never `width: 10, height: 10` |
| Badge / pill label text | `0.75rem` | Never `0.65rem` or `0.7rem` |
| Item date / supplementary label | `0.875rem` | Match `body2`; never override below default |

**Enforcement pattern — mandatory for every component that has size values:**

1. Export every size value as a named constant from the component file:
   ```ts
   export const PILL_ICON_SIZE = 16;
   export const STATUS_BADGE_FONT_SIZE = '0.75rem';
   ```
2. Use the constant in the component JSX/sx — never inline the literal:
   ```tsx
   <GiselleIcon icon="..." width={PILL_ICON_SIZE} />
   <Typography sx={{ fontSize: STATUS_BADGE_FONT_SIZE }} />
   ```
3. Write a `describe('readability — minimum size constants', ...)` block in the component's `*.test.ts` that imports the constants and asserts each is `>= MIN_ICON_SIZE_PX` or `>= MIN_FONT_SIZE_REM`. If a constant is changed below the minimum, the test fails before production.

### Test coverage — 80% minimum

This package targets ≥80% line/branch/function/statement coverage, enforced in the quality gate. Coverage is measured with `@vitest/coverage-v8`.

**Running coverage locally:**

```sh
npm run test:coverage   # generates text summary + lcov report
```

**Gate status:** The 80% threshold is defined in `vitest.config.ts` under `coverage.thresholds`. Once wired into `scripts/quality-gate.js` (Phase 1.7 T1), `npm run check:verify` will fail if any threshold is not met.

**Rules — non-negotiable:**

- Every new component or utility must ship with tests. A file that adds exported symbols without tests is a blocker for merge.
- When a test is written, it must cover the expected behaviour, not just call the function. Refer to the test conventions section above.
- Do not artificially boost coverage with empty assertions or `it.todo`. Every test must make at least one meaningful assertion.
- Coverage excludes: `*.test.ts`, `*.stories.tsx`, `*/index.ts` barrel files. Do not add test-only helper files to the coverage `include` pattern.

### TimelineTwoColumn — MilestoneBadge column alignment rule

`MilestoneBadge` accepts a `columnSide: 'left' | 'right'` prop (default `'right'`).

**Rule — non-negotiable:**

- Left-column milestones (`columnSide="left"`) right-align their collapsed title and inline elements so text sits flush against the centre spine. There must be no ragged gap between the card text and the spine.
- The alignment resets to left the moment the card is **expanded** (full reading flow requires left-to-right text).
- **On hover, the alignment must not change.** Hover only reveals the card background and border; text stays right-aligned until the card is actually opened.
- Right-column milestones always use left alignment (default). Do not pass `columnSide` at all, or pass `"right"`.

**Implementation — how the prop works:**

| State | `columnSide="left"` | `columnSide="right"` |
|---|---|---|
| Collapsed | `textAlign: 'right'` on Paper root; flex rows use `justifyContent: 'flex-end'` | No override (default left) |
| Expanded | Left alignment (both columns identical) | Left alignment |

**Where it is set:** in `timeline-two-column.tsx`, both `MilestoneBadge` call sites:
- Left-column block (`ctx.phaseSide === 'left'`): `<MilestoneBadge columnSide="left" ...>`
- Right-column block (`ctx.phaseSide === 'right'`): no `columnSide` (default `'right'`)

---

### TimelineTwoColumn — done-dot color enforcement rule

**Rule — non-negotiable:**

Every dot on the timeline — phase dots and milestone dots alike — must be **green with a checkmark** when `done=true`. The green success color is the universal "done" signal and must never be overridden by the data's `color` prop or by a grayscale/opacity filter applied by the parent container.

**Two-part implementation (both are required):**

1. **`resolveEffectiveColor(color, done)`** in `timeline-dot.tsx` forces `color='success'` when `done=true`. This is called inside `TimelineDot` before any sx callbacks reference the color. Exported for regression tests.

2. **No grayscale on the dot container.** The center column Box in `timeline-two-column.tsx` must NOT apply `filter: 'grayscale(1)'` or `opacity` to the dot. Grayscale/opacity belongs on the card Paper only — not on the dot's wrapper Box.

| Element | Done state | Expected |
|---|---|---|
| Phase dot | `done=true` | Green circle with checkmark; never grayed |
| Milestone dot | `done=true` | Green filled circle with checkmark; never grayed |
| Phase dot | `done=false` | Uses data `color` as-is |
| Milestone dot | `done=false` | Uses resolved `msColor` (overdue → error, else data color) |

**Regression test location:** `timeline-dot.test.ts` — `resolveEffectiveColor — done-dot color enforcement (regression)`.

---

### TimelineTwoColumn — corner alert badge column-side positioning rule

`PhaseCard` accepts a `columnSide: 'left' | 'right'` prop (default `'right'`). The corner alert badge uses this to anchor itself on the correct edge.

**Rule — non-negotiable:**

- Right-column cards: badge floats on the **right** top corner — the outer edge, away from the spine (`right: 0, transform: translate(50%, -50%)`).
- Left-column cards: badge floats on the **left** top corner — the outer edge, away from the spine (`left: 0, transform: translate(-50%, -50%)`).

**Why:** the badge must always float on the edge that faces outward (away from the spine). A badge anchored on the spine-facing edge overlaps the spine connector and milestone dots.

**Where it is set:** in `timeline-two-column.tsx`, the `PhaseCard` call site:
```tsx
<PhaseCard phase={phase} columnSide={phase.side === 'left' ? 'right' : 'left'} {...buildPhaseCardTsxProps(...)} />
```

Note: `phase.side` is **inverted** from the actual column (`phase.side='right'` → card in **LEFT** column, outer edge on left). So `columnSide` must use the opposite of `phase.side`.

The logic is encapsulated in `resolveCornerBadgeAlign(columnSide)` in `phase-card.tsx`, which returns `{ left?, right?, transform, tooltipPlacement }`. Exported for regression tests.

**Regression test location:** `phase-card.test.ts` — `resolveCornerBadgeAlign — column-side positioning (regression)`.

---

### TimelineTwoColumn — eye button WCAG accessibility rule

All `isViewed` / `onMarkViewed` eye buttons in this component family must meet WCAG 2.2 AA.

**Rule — non-negotiable:**

| Element | Icon size | Why |
|---|---|---|
| Phase card eye badge | `width={20}` (`PHASE_EYE_ICON_SIZE`) | Interactive icons must be >= 20px — larger than decorative |
| Milestone title-row eye | `width={20}` (`MILESTONE_EYE_ICON_SIZE`) | Same rule |

- **Never use `opacity` alone to communicate state.** Opacity reduces visual contrast below WCAG 1.4.11 (3:1 ratio for UI components). Use icon variant change (`bold` vs `outline`) AND a foreground/background colour change together.
- **Never set `cursor: 'default'` on a toggleable button.** The user must always be able to click to toggle. A viewed item must be un-markable.
- **Always include `aria-pressed={isViewed}` and a descriptive `aria-label`** that reflects the current state and the action that will happen on click (e.g. `'Mark as not viewed'` when `isViewed=true`).
- **Export size constants.** Every eye icon/button size must be a named export (`PHASE_EYE_ICON_SIZE`, `MILESTONE_EYE_ICON_SIZE`, `EYE_BUTTON_MIN_SIZE`, `MILESTONE_EYE_BUTTON_MIN_SIZE`). Write a regression test asserting each icon size is `>= 20` and each button min-size is `>= 24`.

**Where the eye buttons live:**
- Phase card: floats outside `<Paper>` at the bottom outer edge (`position: absolute, bottom: 0`), column-side aware. Constants: `PHASE_EYE_ICON_SIZE = 20`, `EYE_BUTTON_MIN_SIZE = 28`.
- Milestone: inline in the title row (`<Box display="flex" alignItems="center">`), before the title when `columnSide='left'` (right-aligned column), after the title when `columnSide='right'` (left-aligned column). Constant: `MILESTONE_EYE_ICON_SIZE = 20`.

**Regression test locations:** `phase-card.test.ts` — `eye button — WCAG accessibility regression`; `milestone-badge.test.ts` — `eye button — WCAG accessibility regression`.

---

## MUI Store quality bar (enforce always — not just before submission)

These rules come directly from the MUI Store submission requirements
(`https://support.mui.com/hc/en-us/articles/11440613164444`). They are development
standards, not pre-submission checklists. Every component must comply from the moment
it is written. The relevant requirements are summarized in this section so the
instructions remain self-contained for contributors.

### Do not use `React.FC`

Use plain function declarations. `React.FC` is redundant, adds implicit `children` typing
baggage, and is explicitly banned by the MUI Store quality bar.

```tsx
// ❌ wrong
const MyComponent: React.FC<MyProps> = ({ foo }) => { ... }

// ✅ correct
function MyComponent({ foo }: MyProps) { ... }
```

**Enforcement:** Any new component using `React.FC` must be refactored before merge.

### Do not use `<Box>` without using its props

If a JSX element has no props — not even `sx` — use a raw `<div>` (or `<span>`, `<section>`,
etc.) instead. `<Box>` is only justified when you are actively using at least one of its
MUI-specific props (`sx`, `component`, `ref`, or shorthand layout props like `display`).

```tsx
// ❌ wrong — Box adds runtime cost but provides nothing
<Box>
  <Typography>Hello</Typography>
</Box>

// ✅ correct — plain div when no Box props are needed
<div>
  <Typography>Hello</Typography>
</div>

// ✅ correct — Box justified because sx is used
<Box sx={{ display: 'flex', gap: 2 }}>
  <Typography>Hello</Typography>
</Box>
```

**Before every PR:** run the following to catch bare Box usage:

```sh
grep -rn "<Box[^/]*>" src/ | grep -v "sx=\|component=\|className=\|ref=\|aria-\|data-\|display="
```

### Use `shouldForwardProp` on every reusable `styled()` component

If a component uses `styled()`, it **must** declare `shouldForwardProp` to prevent custom
props from leaking into the DOM.

```tsx
// ❌ wrong — custom prop leaks to DOM → React warning + Sonar violation
const StyledDiv = styled('div')<{ active: boolean }>`
  color: ${({ active }) => (active ? 'red' : 'black')};
`;

// ✅ correct
const StyledDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  color: ${({ active }) => (active ? 'red' : 'black')};
`;
```

Currently: zero `styled()` components in this library. This rule fires the moment the
first one is introduced.

### Icon imports: one level deep (not from package root)

Import from `@iconify/react`, not from any `@iconify-json/*` path or the icon package root
without the module specifier. This is already the correct pattern in this library — do not
deviate.

```tsx
// ✅ correct
import { Icon } from '@iconify/react';

// ❌ wrong — root import of full icon set
import allIcons from '@iconify/json';
```

### No source maps in the distributed build

`sourcemap: true` is acceptable in `tsup.config.ts` for the open-source library (developers
debugging against source). But any **premium or production distribution** build must set
`sourcemap: false`. MUI Store ToS §9 explicitly prohibits distributing source maps.

This does **not** require changing the current `tsup.config.ts` today. It is a hard
constraint on the future premium template's separate build config.

### Browser support targets

All components must work in — and must not use APIs or CSS features unavailable in — the
following minimum versions:

| Browser              | Minimum |
| -------------------- | ------- |
| Chrome               | ≥ 121   |
| Firefox              | ≥ 121   |
| Edge                 | ≥ 117   |
| Safari (macOS + iOS) | ≥ 17.0  |

This matches the MUI Core supported browser matrix. Do not use CSS features, JS APIs, or
DOM behaviour that falls outside these targets.

### Images and SVGs

- No low-resolution raster images. Any raster asset must look sharp at >200 PPI.
- SVG files must be optimised — no verbose metadata, no inline raster data.
- If SVGs are added to Storybook or a demo app, run them through `svgo` before committing.
