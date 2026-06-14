# TimelineDot

## Why it exists

Every phase and milestone row in the two-column timeline needs a dot on the centre spine. That dot has two mutually exclusive inner states (animated checkmark when done; icon otherwise), an active pulsing ring halo, two sizes (phase vs milestone), and optional checklist-mode interaction (click to toggle done). Before this component, the dot circle was duplicated between `timeline-two-column.tsx` and `MilestoneBadge`, diverging on overflow handling, focus styles, and animation keys.

## Why it belongs in giselle-mui

The dot + halo + done-checkmark pattern is a direct building block of any `TimelineTwoColumn` layout. The overflow strategy (outer `overflow: visible` for the `::after` halo ring; inner clip box with `overflow: hidden` and `border-radius: 50%`) is non-obvious and worth encapsulating once for all consumers.

## Design decisions

- **Two-box overflow strategy.** The outer Box uses `overflow: visible` so the `::after` pulsing ring (`inset: -5px`) is not clipped. A separate inner Box with `overflow: hidden` and `border-radius: 50%` keeps the icon clipped to the circle shape. Combining both requirements in a single element is not possible.
- **Done dots always use `success` colour.** `resolveEffectiveColor` overrides the `color` prop with `'success'` when `done = true`. Green is the universal "done" signal in the design system; allowing other colours for done dots would break visual consistency.
- **Pulsing ring only for active phase dots.** The `pulseRingAfterSx` halo is applied only when `active && !isMilestone && !done`. Milestone dots and done dots do not pulse.
- **`animationKey` prop.** Incrementing this key re-triggers the checkmark SVG animation after a task is toggled done, without unmounting the entire dot.
- **Checklist mode via ARIA props.** Pass `onClick`, `role="checkbox"`, `aria-checked`, `aria-label`, and `tabIndex` to turn the dot into an accessible toggle. The component does not manage its own checked state.

Stories: [Lab/Timeline/Two Column/Dot](./timeline-dot.stories.tsx)

## Related

- [SpineConnector](../spine-connector/README.md) — the vertical bar connecting consecutive dots
- [MilestoneBadge](../milestone-badge/README.md) — uses `TimelineDot` for the milestone spine marker
- [PhaseCard](../phase-card/README.md) — uses `TimelineDot` for the phase spine marker
- [TimelineTwoColumn](../README.md) — parent layout that positions dots in the centre column

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
