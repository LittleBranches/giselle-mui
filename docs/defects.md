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

## Documentation policy

- If a defect changes behavior expectations, update component README and story docs in the same PR.
- If a decision changes API behavior, update `docs/components/cleanup-workflow.md` checklist language in the same PR.
