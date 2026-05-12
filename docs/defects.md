---
sidebar_position: 8
sidebar_label: 'Defects and UX decisions'
---

# Defects and UX decisions

This file tracks active defects and unresolved UX decisions that affect shipped component behavior.

## Timeline family (`TimelineTwoColumn`, `TimelineCompact`)

### DEF-TL-001 — Eye icon toggle does not behave correctly

- Status: Open
- Severity: High
- Scope: Viewed-state controls in timeline items
- Symptom: Eye icon is not consistently toggling viewed state as expected.
- Expected: Eye control must always reflect current state and toggle reliably on click/keyboard activation.
- Notes: Validate `viewedKeys` + `onMarkViewed` behavior in both phase and milestone contexts.

### DEF-TL-002 — Eye icon placement and visual treatment need redesign

- Status: Open
- Severity: Medium
- Scope: Timeline phase cards and milestone badges
- Symptom: Current eye button position/appearance does not read clearly enough as a viewed-state control.
- Decision needed: Keep current placement or move to a clearer, checklist-like viewed affordance (GitHub-style reference discussed).
- Note: If the control remains optional by mode, placement must still preserve consistent scanning.

### DEC-TL-001 — Is viewed control required in all timeline modes?

- Status: Decision pending
- Scope: `TimelineTwoColumn` and `TimelineCompact`
- Question: Should viewed-state controls be shown in all modes, or only when a specific mode/prop enables it?
- Constraint: WCAG does not require an eye icon feature; it requires accessible behavior when an interactive control exists.
- Decision owner: Design + API owner

### DEC-TL-002 — "NEW" label behavior and styling

- Status: Decision pending
- Scope: Timeline item badges/labels
- Question: Keep, remove, or redesign the "NEW" label; define trigger conditions and visual hierarchy relative to done/viewed states.
- Needed output: One rule for display conditions plus one canonical style treatment.

## Workspace-wide API deprecations

### DEF-WS-001 — `inputProps` deprecated on MUI v7 `Checkbox` and form components

- Status: Open — needs workspace-wide sweep
- Severity: Medium (deprecation warning in dev; may break in a future MUI major)
- Scope: All files across `giselle-mui`, `alexrebula`, `first-branch` that pass `inputProps` to any MUI component
- Root cause: MUI v7 replaced `inputProps` with `slotProps.htmlInput` on all input-bearing components (`Checkbox`, `TextField`, `Input`, `Select`, etc.)
- Fix: Replace every occurrence of `inputProps={{ ... }}` with `slotProps={{ htmlInput: { ... } }}`
- First found: `giselle-mui/src/components/timeline/task-list/task-list.tsx` — `<Checkbox inputProps={{ 'aria-label': task.title }}>`
- Action: grep entire workspace for `inputProps=` and fix each site before next MUI major upgrade

```bash
# Find all occurrences across the workspace:
grep -rn "inputProps=" src/ --include="*.tsx" --include="*.ts"
```

## Documentation policy

- If a defect changes behavior expectations, update component README and story docs in the same PR.
- If a decision changes API behavior, update `docs/components/cleanup-workflow.md` checklist language in the same PR.

---

## Process defects

### DEF-PROC-001 — Banned content bypass: docs/ not scanned by the quality gate

- **Opened:** 13 May 2026
- **Status:** Fixed — `scripts/check-banned-content.js` added; wired into `quality-gate.js` as step 0a
- **Severity:** Critical. This is a public MIT-licensed repository. Banned content that reaches `main` is immediately visible to any consumer who clones or browses the repo.

**What happened (PR #34):**

Three classes of banned content reached a pushed commit on a public-facing branch before being caught:

1. **Personal name** (`Žiga`) — in `docs/components/dashboard-components-plan.md`, inside an "Immediate consumer" description.
2. **Internal project codename** (`first-branch`) — same file, multiple occurrences in component consumer bullets.
3. **Private internal path reference** (`case-001`) — in `docs/components/dashboard-components-plan.md`, `docs/standalone-gap-analysis.md`, `docs/components/timeline/two-column/timeline-plan.md`, and `src/components/timeline/two-column/types.ts` JSDoc.
4. **Banned identifier names in docs** (`varFade`, `varContainer` etc.) — in `docs/roadmap.mdx` and `docs/components/home-components-extraction-plan.md`. ESLint bans these in `src/**`; it does not run on `docs/**`.

**Root cause:**

The quality gate only ran ESLint on `src/**`. There was no automated check that scanned `docs/**` or `*.md` / `*.mdx` files for the same banned patterns. A human reviewer (the GitHub Copilot bot) caught all four classes — but only after the commits had already been force-pushed to the remote branch.

**Fix applied:**

- Added `scripts/check-banned-content.js` — a Node.js scanner that checks both `docs/**` and `src/**` for banned identifier names (`varAlpha`, `varFade`, `varBlur`, `varContainer`, `customShadows`, `_mock`, `minimal-shared`) and known private reference patterns (`case-001`).
- Wired as step 0a in `scripts/quality-gate.js` — runs before structure check, Prettier, and ESLint. A violation fails the quality gate with a clear file + line report.
- Renamed all flagged occurrences in docs files: `varFade` → `fadeVariants`, `varScale` → `scaleVariants`, `varZoom` → `zoomVariants`, etc.

**Lesson:**

The pre-push hook and CI run `check:verify`. Adding any new content-correctness rule to `quality-gate.js` automatically propagates it to both. If a rule cannot be expressed as a script step, it must be expressed as an ESLint rule (for source files) — but those two tools together must cover every file type that this repository publishes.

**Personal names are not detectable by automation alone.** No script can know every name that should be excluded. The responsibility is author discipline at write time. The `copilot-instructions.md` rule 0 ("Zero personal data") must be treated as a pre-commit mental checklist item, not a post-push catch. If a name slips through, the check-banned-content script will not catch it — but the GitHub Copilot code reviewer will, as it did here.
