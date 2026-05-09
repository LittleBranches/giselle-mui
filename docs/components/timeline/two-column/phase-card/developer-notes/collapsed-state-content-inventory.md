# PhaseCard — Collapsed State Content Inventory

_Analysed 6 May 2026. No code changes — analysis only._

This document captures every element that can appear in the collapsed (first-view) state of
`PhaseCard`, the height each contributes, and the structural problem that causes milestone
overlap. It is the prerequisite for standardising the collapsed card height.

---

## Unconditional content (always present)

| Slot | Element | Approx height | Notes |
|---|---|---|---|
| Title | `Typography variant="subtitle1"` | ~22px | Shows `shortTitle` when collapsed; full title on hover. `mb: 0.5` when `hasDetails`, `mb: 1` otherwise |
| Card padding | `Paper p: 2.5` | 20px top + 20px bottom = 40px | Always |

---

## Conditional content — the variable-height culprits

These appear or disappear based on data flags. Each one shifts everything below it.

| Slot | Element | Condition | Height impact |
|---|---|---|---|
| **"New" badge** | Pulsing green dot + `"New"` overline label (`NewBadge`) | `phase.new === true` | ~19px row + `mb: 1` (8px) = **27px** |
| **"Now" badge** | Pulsing colour dot + `"Now"` overline label (`ActiveBadge`) | `phase.active && !isDone` | ~19px row + `mb: 1` (8px) = **27px** |
| **Scenario badge** | Soft-tint pill with `phase.scenarioLabel` (`ScenarioBadge`) | `variant='scenario' && !active` | ~22px pill + `mb: 1` (8px) = **30px** |
| **Date line** | `Typography variant="subtitle2"` | `!phase.hideDate && phase.date` | ~16px text + `mb: 1.5` (12px) = **28px** |
| **Details count pill** | Subtask icon + count number | `hasDetails` (phase has `details` or `children`) | ~22px pill + `mb: 1` (8px) = **30px** |

### Stacking rules (from `CardStatusBadge`)

- `"New"` and `"Now"` can **both appear simultaneously** on the same card → +54px combined.
- `"Scenario"` is mutually exclusive with `"Now"` — only shows when `!showActive`.
- `"Now"` and `"Scenario"` never stack.

---

## Content outside the Paper (does not affect card height)

These are `position: absolute` elements that float outside the `<Paper>`. They do not push
card height.

| Slot | Element | Condition |
|---|---|---|
| Corner alert badge | Overdue ⚠ or date-overlap ⚠ circle | `isOverdue && !isDone` **or** `dateConflict` |
| Eye viewed button | Floating below the card bottom | `onMarkViewed` prop provided |

---

## Expanded-only content (not visible in collapsed state)

The following are gated on `expanded` (or `expanded || isHovered`) and contribute zero height
in the collapsed first-view:

- Description (`isHovered || expanded`)
- Platform strip / tech stack (`expanded`)
- Client logos (`expanded`)
- Project logos (`expanded`)
- Photos (`expanded`)
- Footer slot (`expanded`)
- `CardDetailBullets` (inside `<Collapse in={expanded}>`)

---

## Height range summary

| Scenario | Approx total height |
|---|---|
| No badges, no date, no details pill | ~22px + 40px padding = **62px** |
| Date only, no badges, no pill | ~50px + 40px = **90px** |
| Date + details pill, no badges | ~80px + 40px = **120px** |
| "Now" + date + details pill | ~107px + 40px = **147px** |
| "New" + "Now" + date + details pill | ~134px + 40px = **174px** |

That is a **~3× height range** across normal data variations.

---

## The structural problem

Milestone rows are positioned at `top: X%` **inside the phase `<li>`**. The `<li>` has a
`minHeight` computed from `milestoneSlotHeight × (numMilestones + 1)`. The phase card column
is a flex child inside that same `<li>`. If the phase card grows taller than
`milestoneSlotHeight`, the card bleeds into the next milestone's slot — milestone cards
overlap the lower portion of the phase card.

The phase card height is entirely **variable** because three independent badge rows
(`NewBadge`, `ActiveBadge`, `ScenarioBadge`) can appear or disappear independently. There is
no fixed anchor to measure from.

---

## Questions to settle before any fix

1. **"Now" removal** — remove the `ActiveBadge` component entirely from the collapsed view,
   or just the text label (keep the pulsing dot somewhere — e.g. on the spine dot or inline
   in the title row)?

2. **"New" badge** — keep, remove, or move the dot to a less height-consuming location
   (e.g. a small dot in the title row alongside the title, similar to `MilestoneBadge`)?

3. **Scenario badge** — do any real data phases use `variant='scenario'`? If not, it is not
   a concern for the views where fixed height is needed.

4. **Date line** — keep in the collapsed card, or remove (the date is already visible on the
   spine dot floating pill for milestones)? Removing it frees ~28px.

5. **Details pill** — the count pill (`⊙ 7`) has `mb: 1` that contributes to the bottom of
   the card. Would it work inline after the title (no own row) to reduce height?

The answers determine whether a fixed height is achievable through content reduction alone,
or whether the spine slot-height measurement logic also needs to change.
