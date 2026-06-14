# TimelineDot

## Why it exists

Two distinct dot circles appear in the two-column timeline: the large phase dot on the spine and
the smaller milestone dot. Without a shared component, both need to duplicate colour derivation
(palette key → CSS-vars tint), the done-state animated checkmark, the pulsing halo ring for the
active phase, and the checklist interaction pattern (click, keyboard, `aria-checked`). Sharing
one component removes that duplication and guarantees visual consistency between the two sizes.

## Why it belongs in giselle-mui

A coloured circle with done/active/icon states is a universal timeline primitive. The component
accepts an MUI palette key for colour, a `size` discriminant (`'phase'` or `'milestone'`), and
optional interaction props — it carries no opinion about what the dot represents. Any vertical
timeline, stepper, or progress indicator in any project can use it directly.

## Design decisions

**Two-box overflow strategy.** The outer `Box` has `overflow: visible` so the `::after` pulsing
halo ring (which extends 5 px outside via `inset: -5`) is not clipped. A separate inner `Box`
with `overflow: hidden` and `border-radius: 50%` clips the icon to the circle shape. These two
concerns cannot share a single element.

**`resolveEffectiveColor` for done state.** Done dots always render in the `success` palette
(green checkmark is the universal done signal), regardless of the phase or milestone colour. This
invariant is encoded in `resolveEffectiveColor` rather than left to the caller.

**`animationKey` for re-triggering the checkmark.** The done-state SVG animation plays once on
mount. Incrementing `animationKey` re-mounts `DotInner`, replaying the animation — useful in
checklist mode where a user can toggle done/undone repeatedly.

**Size discriminant, not numeric prop.** The `size` prop accepts `'phase' | 'milestone'` rather
than arbitrary pixels. Size constants live in `utils.ts` (`getDotSize`, `getIconSize`), making
future size changes a one-place edit.

**Storybook:** `Lab/Timeline/Two Column/Dot`
Stories: `Default`, `Active`, `DonePhase`, `MilestoneDefault`, `MilestoneDone`, `ChecklistPhase`,
`ChecklistMilestone`, `AllColors`, `AllColorsActive`.

## Related

- [SpineConnector](../spine-connector/README.md) — the vertical bar rendered between consecutive
  dots
- [MilestoneBadge](../milestone-badge/README.md) — the badge card anchored beside a milestone dot
- [PhaseCard](../phase-card/README.md) — the phase card anchored beside a phase dot
- [MUI Box](https://mui.com/system/react-box/) — root element

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
