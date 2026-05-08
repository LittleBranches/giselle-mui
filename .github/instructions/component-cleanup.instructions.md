---
applyTo: "src/components/**"
---

When reviewing or editing any file under `src/components/`, apply the full cleanup workflow defined in `docs/components/cleanup-workflow.md`.

**Minimum checks for every component file touched in this PR/session:**

1. No `type` or `interface` declarations inside `.tsx` — all belong in `types.ts`.
2. No `sx={}` with more than ~3 properties inline — extract to `<name>.styles.ts`.
3. No named constants for sizes, font sizes, or touch targets inline in `.tsx` — extract to `<name>.const.ts`.
4. No capital-letter helper components defined inside `.tsx` — each gets its own flat `.tsx` file.
5. No pure logic functions in `.tsx` — extract to `utils.ts`.
6. No `React.FC`, no `any`, no bare `<Box>` without props.
7. `sx` array spread on root element: `sx={[base, ...(Array.isArray(sx) ? sx : [sx])]}`.
8. `...other` spread on root element.
9. SonarQube: zero violations (cognitive complexity ≤ 15, no DOM prop leaks, `.dataset` over `getAttribute`).
10. `npm run check:verify` exits 0.

**Definition of done — Sub-component (Scenario A):**

- [ ] No `type`/`interface` in `.tsx` — all in parent `types.ts`
- [ ] No sx with more than ~3 properties inline — all in parent `*.styles.ts`
- [ ] No duplicated JSX blocks — extracted to helper or util
- [ ] All inline conditional logic that produces a derived value is in `utils.ts`
- [ ] JSDoc covers all props including behaviour flags
- [ ] At least one test `describe` block exists for this sub-component
- [ ] Exported from parent `index.ts`
- [ ] SonarQube: zero violations
- [ ] `npm run check:verify` exits 0

**Definition of done — Standalone component (Scenario B):**

- [ ] Own subfolder created with all companion files present
- [ ] No `type`/`interface` in `.tsx` — all in `types.ts`
- [ ] No sx with more than ~3 properties inline — all in `<name>.styles.ts`
- [ ] `<name>.styles.test.ts` covers every exported factory
- [ ] No named constants for sizes inline — all in `<name>.const.ts`
- [ ] Regression tests for every size constant with a safety minimum
- [ ] No pure logic functions in `.tsx` — all in `utils.ts`
- [ ] No capital-letter helper components inside `.tsx` — each in its own flat `.tsx`
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
