# Component Cleanup Day — 8 May 2026

**Type:** Quality improvement + convention correction  
**Status:** ✅ Complete — check:verify green, yalc pushed to all 3 consumers

---

## What was done

Three components brought to full Definition of Done in a single session.

### Accordion — Scenario B, DoD 20/20

`src/components/accordion/`

Full standalone cleanup. Types, styles, const, utils, tests, Storybook stories, README — all companion files present and correct. Coverage 100%. SonarQube: zero violations. Best practices 13/13.

Notable decisions locked in:

- CSS-only icon switching via `.ci-idle`, `.ci-done`, `.ci-hover` span classes (no JS hover state)
- `useNestedChecklist` hook extracted to `src/utils/` — reusable, fully unit-tested
- TaskList sub-component extracted for its own test suite

### CheckIconButton — Scenario A, DoD 9/9

`src/components/accordion/check-icon-button.tsx`

Sub-component living flat inside the Accordion folder. Scenario A checklist completed. `aria-pressed`, `aria-label`, `useCallback` for click handler. Best practices 13/13.

### IconActionBar — Scenario B, DoD 20/20

`src/components/action-bar/icon/`

Full standalone cleanup. The interesting part: the `DEFAULT_ICON_ACTIONS` constant (an array of JSX-containing `IconActionItem` objects) exposed a gap in the `.const.ts` naming convention — see the **Convention correction** section below.

---

## Convention correction — `.const.ts` vs `.defaults.tsx`

**The problem:**  
`DEFAULT_ICON_ACTIONS` was living in `icon-action-bar.const.tsx` with a `.tsx` extension, which violated the `.const.ts = plain .ts` rule. The first attempted fix converted JSX to `createElement` calls and renamed to `.ts`. This was wrong — `createElement` is compiler output, not hand-written source.

**The root cause:**  
The `.const.ts` rule was always scoped to _primitive constants_ (sizes, font sizes, spacings, touch targets). `DEFAULT_ICON_ACTIONS` is a configuration array — it is not a size or spacing value. The rule never intended to apply to it. But the rule's written form did not say this clearly enough.

**The correct fix:**  
Rename to `icon-action-bar.defaults.tsx`. Restore clean JSX. This is a new file category: `*.defaults.tsx` — default value arrays/objects that contain JSX. Primitive constants still go in `*.const.ts`.

**Files updated to document the distinction:**

- `.github/copilot-instructions.md` — `.const.ts` section now has a `> Scope of this rule` callout box; `*.defaults.tsx` added to the file structure table and enforcement checklist
- `docs/components/cleanup-workflow.md` — Step 2 updated with the same scope clarification; file structure quick-reference updated

**The two-file contract going forward:**

| File                  | Contains                                                           | Extension            |
| --------------------- | ------------------------------------------------------------------ | -------------------- |
| `<name>.const.ts`     | Sizes, font sizes, spacings, touch targets — primitive values only | `.ts` — no JSX       |
| `<name>.defaults.tsx` | Default arrays/objects containing JSX (optional, only when needed) | `.tsx` — JSX allowed |

---

## Numbers

| Metric                 | Value                                  |
| ---------------------- | -------------------------------------- |
| Tests passing          | 831 / 831                              |
| check:verify exit code | 0                                      |
| tsup build             | ✅ all 4 entry points                  |
| yalc consumers updated | alexrebula, giselle-docs, first-branch |
| SonarQube violations   | 0 across all three components          |
