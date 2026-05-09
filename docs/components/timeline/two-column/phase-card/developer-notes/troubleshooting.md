# PhaseCard - Troubleshooting Collapsed-State Overlap

_Analysed 6 May 2026. No code changes - troubleshooting guidance only._

This document is for diagnosing and resolving collapsed `PhaseCard` overlap issues in
`TimelineTwoColumn`.

For the full element-by-element content and height inventory, see
[collapsed-state-content-inventory.md](./collapsed-state-content-inventory.md).

---

## When to use this guide

Use this guide when one or more of the following occurs:

- Milestones visually overlap the lower part of a collapsed phase card.
- Hover appears to "fix" layout, but collapsed state remains unstable.
- Same code path renders different collapsed heights for different phase data.
- Alignment breaks only on cards with `new`, `active`, or `scenario` markers.

---

## Symptom -> likely cause

| Symptom                                 | Likely cause                                                  | First check                                                            |
| --------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Card overlaps first milestone           | Collapsed card height is larger than allocated milestone slot | Compare phase card rendered height vs `milestoneSlotHeight`            |
| Overlap appears only on some phases     | Conditional badge rows are changing collapsed height          | Inspect `new`, `active`, `variant='scenario'`, date, and details count |
| Issue disappears when expanded          | Expanded layout path differs from collapsed layout path       | Confirm bug is isolated to collapsed-only path                         |
| Left/right columns drift inconsistently | Data-dependent height variance accumulates per row            | Compare two phases with same milestone count but different flags       |

---

## Fast diagnosis checklist

1. Reproduce with one problematic phase and one control phase.
2. Confirm both phases have the same milestone count.
3. Record which conditional rows appear in collapsed mode:
   - `NewBadge`
   - `ActiveBadge`
   - `ScenarioBadge`
   - Date line
   - Details count pill
4. Measure rendered collapsed card height for both phases.
5. Verify whether either height exceeds row slot allocation.

If height exceeds slot allocation, the overlap is expected under current constraints.

---

## Canonical root cause

Collapsed phase-card height is variable because multiple conditional rows can appear
together. Milestone vertical placement is computed from slot math (`milestoneSlotHeight`
and milestone count), not from measured rendered card height. When rendered card height
exceeds reserved slot height, milestones intrude into the phase-card visual area.

---

## Resolution paths

Choose one path and apply consistently.

### Path A: Reduce collapsed content variance

- Remove or relocate one or more conditional rows from collapsed view.
- Typical candidates: `ActiveBadge` text row, `NewBadge` row, date line, details pill row.
- Goal: keep collapsed card height under slot limit across common data combinations.

### Path B: Increase slot capacity

- Increase `milestoneSlotHeight` (or equivalent row allocation) to accommodate worst-case
  collapsed card height.
- Goal: preserve current collapsed content while preventing overlap.

### Path C: Hybrid

- Trim the highest-impact rows and moderately increase slot capacity.
- Goal: reduce visual noise while avoiding excessive vertical spacing.

---

## Validation after a fix

Run these checks before closing the issue:

1. A phase with no conditional rows renders without extra whitespace regression.
2. A phase with `new + active + date + details` does not overlap milestones.
3. A `variant='scenario'` phase remains stable in collapsed mode.
4. Left and right column cards keep consistent spacing for equivalent data density.
5. Expanded state behavior remains unchanged.

---

## Related reference

- [collapsed-state-content-inventory.md](./collapsed-state-content-inventory.md):
  authoritative inventory of collapsed-state elements and approximate height impact.
