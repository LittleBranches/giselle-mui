# Regression: Timeline hover broken by open-only expand — May 2026

**Introduced:** commit `651173d` (`feat(timeline): implement improvements for tooltips, marker variant, footer slot, and height measurement`)  
**Fixed:** commit `84dfd55` (`fix(timeline): restore toggle behavior for milestone and phase card expansion`)  
**Detected:** visually on Vercel branch preview — NOT by automated tests  
**Symptom:** hovering milestone cards produced no visual feedback; the card background, border accent and shadow did not appear  

---

## What changed

The `handleExpandMilestone` and `handleExpandPhaseCard` callbacks were changed from
**toggle** (click open → click again to close) to **open-only** (click opens; only an
outside click closes):

### Before (toggle — main branch)

```ts
const handleExpandMilestone = useCallback((phaseKey, milestoneIndex) => {
  const k = String(phaseKey);
  setExpandedPhaseKey(null);
  setExpandedMilestoneMap((prev) => ({
    ...prev,
    [k]: prev[k] === milestoneIndex ? null : milestoneIndex,  // toggle
  }));
}, []);

const handleExpandPhaseCard = useCallback((phaseKey) => {
  setExpandedMilestoneMap({});
  setExpandedPhaseKey((prev) => (prev === phaseKey ? null : phaseKey));  // toggle
}, []);
```

### After (open-only — introduced in 651173d, broken)

```ts
const handleExpandMilestone = useCallback((phaseKey, milestoneIndex) => {
  const k = String(phaseKey);
  setExpandedPhaseKey(null);
  setExpandedMilestoneMap((prev) => {
    if (prev[k] === milestoneIndex) return prev;  // early return — card stuck open
    return { ...prev, [k]: milestoneIndex };
  });
}, []);

const handleExpandPhaseCard = useCallback((phaseKey) => {
  setExpandedMilestoneMap({});
  setExpandedPhaseKey(phaseKey);  // always opens, never toggles
}, []);
```

The change was **intentional** — the PR description explicitly listed "open-only expand
behaviour" as a feature. The reasoning was that outside-click dismissal was sufficient.
What wasn't accounted for was the `stopPropagation` interaction described below.

---

## Why "open-only" broke hover

The regression involved a chain of three existing mechanisms interacting:

### Mechanism 1 — `stopPropagation` on the expanded card

```tsx
const stopProp = isThisMsExpanded
  ? (e: React.MouseEvent) => e.stopPropagation()
  : undefined;

<Box onClick={stopProp} sx={{ ...wrapperBase }}>
  <MilestoneBadge ... />
</Box>
```

When a milestone card is expanded (`isThisMsExpanded = true`), its wrapper calls
`e.stopPropagation()` on every click, blocking the event from reaching the document.

### Mechanism 2 — Document click listener closes all cards

```ts
useEffect(() => {
  if (!anyExpanded) return undefined;
  const handler = () => {
    setExpandedMilestoneMap({});
    setExpandedPhaseKey(null);
  };
  document.addEventListener('click', handler);
  return () => document.removeEventListener('click', handler);
}, [anyExpanded]);
```

Clicking outside any card reaches the document, which collapses everything.

### Mechanism 3 — `suppressElevation` applies `pointerEvents: none`

```ts
const suppressElevation = ctx.anyExpanded && !isThisMsExpanded;

const wrapperBase = {
  ...
  ...(suppressElevation && {
    filter: 'blur(1.5px)',
    opacity: 0.38,
    pointerEvents: 'none',  // ← disables hover AND click on all non-expanded cards
  }),
};
```

When any card is expanded, every _other_ card gets `pointerEvents: none`. This disables
both hover CSS pseudo-class events and click events for those cards.

### The collision

With **toggle** behavior:
- User clicks open card → `handleExpandMilestone` sets it to `null` → card closes → `anyExpanded = false` → `pointerEvents` restored → hover works everywhere

With **open-only** behavior:
- User clicks open card → `stopPropagation` blocks the document listener → `handleExpandMilestone` returns `prev` (early return) → card stays open → `anyExpanded` stays `true` → all other cards remain `pointerEvents: none` → **hover is permanently broken** until a click reaches a completely different DOM area

In practice, users naturally try to click the open card to close it first. That click does
nothing, the card stays open, and they are now unable to hover over any other card.

---

## Why the regression tests did not catch it

### 1. The toggle behavior was never explicitly tested

The existing interaction tests (`milestone-badge.interaction.test.ts`) test that clicking
a card calls `onRequestExpand`. They do not test what happens when you click it a second
time, or what the state of adjacent cards is after one card opens.

No test existed for: "after opening milestone card A, clicking card A again should close
it and make card B hoverable."

### 2. JSDOM cannot evaluate CSS `hover` pseudo-class

The `&:hover` styles in `milestone-badge.tsx` are CSS applied via the MUI `sx` prop.
In a JSDOM test environment, `mouseenter` and `mouseleave` events fire, but the CSS
`:hover` pseudo-class state is never entered — the browser's CSS engine is not present.

A test could have used `fireEvent.mouseEnter` + `getComputedStyle` to assert that
`pointerEvents` was not `'none'` — but this would require careful integration setup and
wasn't implemented.

### 3. `pointerEvents: none` is an inline style applied via MUI's sx — harder to assert

The suppression is applied as a conditional spread on the wrapper Box's `sx` prop. To
catch it in a test you would need to assert the rendered element's `style` attribute does
not contain `pointer-events: none` after a card is opened. None of the existing tests do
this.

### 4. Storybook build passes but is not interactive in CI

The pre-push hook builds Storybook with `storybook build` (static). The build succeeds
if stories compile — it doesn't simulate user interaction. The regression was only visible
by opening a browser and hovering.

---

## What regression tests should be added

Add to `milestone-badge.interaction.test.ts` or a new integration test file:

```ts
// After opening a milestone card, clicking it again should collapse it.
it('clicking an expanded card closes it (toggle behavior)', () => {
  // render two cards, open card 0, click card 0 again, assert closed
});

// After opening card 0, card 1's wrapper should not have pointerEvents: none.
it('when one card is expanded, other card wrappers have pointerEvents auto', () => {
  // render two cards, open card 0
  // assert card 1 wrapper style.pointerEvents !== 'none'
});
```

---

## Workflow gap that allowed the regression to reach Vercel

The sequence that let this reach a Vercel preview deploy:

1. Change made in `timeline-two-column.tsx` — intentional, passed author review
2. Pre-push hook in `giselle-mui` ran `check:verify` — all 289 tests passed ✅
3. Storybook built successfully ✅
4. Code pushed to `origin/feature/timeline-improvements` ✅
5. `npm run build && yalc push` — built and propagated to alexrebula ✅
6. alexrebula committed updated `.yalc/` and pushed → Vercel deployed ✅
7. Branch preview opened in browser → hover broken ❌ — **first detection point**

The gap: there was no interactive test that exercised the toggle interaction, and no
visual regression test that would catch CSS behavior like `pointerEvents: none` applied
to non-focused cards.

---

## Bug 2 — Hover feedback loop introduced by an incorrect fix (commit `4d865ea`)

**Symptom:** After Bug 1 was fixed (toggle restored), hovering milestone cards caused
them to flicker — rapidly opening and closing, or snapping in and out of the hover state.

**Root cause:** The `ResizeObserver` added in commit `651173d` fires on **any** size change
to the observed element. This included the title growing from `shortTitle` to the full `m.title`
when `isHovered` became `true`. The chain:

```
mouseenter → setIsHovered(true) → displayTitle = m.title (taller card)
→ ResizeObserver fires → msHeightMapRef updated → setMeasureVersion(v+1)
→ TimelineTwoColumn re-renders → msSlotHeights updated → <li> minHeight grows
→ all milestone dots shift (top: X% of taller <li>)
→ card under cursor has moved → mouseleave
→ setIsHovered(false) → displayTitle = shortTitle (shorter card)
→ ResizeObserver fires → msHeightMapRef updated → setMeasureVersion(v+1)
→ TimelineTwoColumn re-renders → msSlotHeights updated → <li> minHeight shrinks
→ all milestone dots shift back
→ card under cursor → mouseenter again → infinite loop
```

**Incorrect fix applied:** `isHovered` was removed from `displayTitle`. The condition
`isExpanded || isHovered ? m.title : (m.shortTitle ?? m.title)` was changed to
`isExpanded ? m.title : (m.shortTitle ?? m.title)`. This stopped the loop but broke
the three-level title disclosure (full title no longer showed on hover).

---

## Bug 3 — Expand causes enormous layout shift (introduced with ResizeObserver in `651173d`)

**Symptom:** Clicking any milestone card to expand it caused all milestone cards to
shift dramatically. The expanded card moved off-screen in many cases.

**Root cause:** Same ResizeObserver, different trigger. When a `Collapse` component
opens, the card grows from ~80px to ~300px+. The ResizeObserver fires and records the
expanded height as the new slot height. `msSlotHeights` updates. The `<li>` minHeight
becomes `(N+1) * 316` (for N milestones). All cards' `top: X%` positions are recalculated
against this enormous height. The expanded card is now at `(i+1)/(N+1) * 316*(N+1) = (i+1)*316`
pixels from the top — far below its original position, and often off-screen.

---

## Final fix — Remove ResizeObserver entirely (commit `0c82104`)

**Design decision:** The `ResizeObserver` approach is fundamentally incompatible with
absolute-percentage milestone positioning. Any measurement system that updates
`msSlotHeights` in response to user interaction (expand, hover) creates a
measurement → layout → measurement feedback cycle.

**The correct architecture:**

```
mount / sorted change
  ↓
ref callbacks fire (onMeasure)        — synchronously, during React commit phase
  ↓
useLayoutEffect([sorted]) runs        — after all ref callbacks, before browser paint
  ↓
msSlotHeights computed from ref map   — slot heights frozen until sorted changes
  ↓
li minHeight set                      — stable, never updated during interaction
  ↓
cards at top: X%                      — stable, never updated during interaction
```

**Key invariants:**
- `onMeasure` ref callback fires only when an element mounts or unmounts. The wrapper Box
  is never remounted during expand/hover — only its children change. So `onMeasure` is
  never called during user interaction.
- `useLayoutEffect` depends only on `[sorted]`. Expanding a card or hovering a card does
  not change `sorted`, so the effect never re-runs.
- `msSlotHeights` is therefore frozen at the collapsed-card heights. All dot positions
  are stable throughout expand, collapse, hover, and hover-end.

**Hover title restored:** With no ResizeObserver watching, changing `displayTitle` on
hover does not trigger any measurement update or layout shift. The three-level disclosure
is safe: `displayTitle = isExpanded || isHovered ? m.title : (m.shortTitle ?? m.title)`.

---

## Three-bug cascade — timeline

| # | Bug | Introduced | Fixed | Symptoms |
|---|-----|-----------|-------|---------|
| 1 | Toggle → open-only | `651173d` | `84dfd55` | hover permanently blocked after expanding any card |
| 2 | Hover feedback loop | `651173d` (RO) | `4d865ea` (incorrectly) | cards flickered on hover |
| 2b | Hover title regression | `4d865ea` (incorrect fix) | `0c82104` | full title no longer shown on hover |
| 3 | Expand layout shift | `651173d` (RO) | `0c82104` | all milestone cards shift on expand, expanded card goes off-screen |

**Root cause of bugs 2, 2b, 3:** A single architectural error — `ResizeObserver` feeding
back into layout state during user interaction. Corrected by removing ResizeObserver and
using a one-shot measurement approach.

---

## Related

- Fix commit (Bug 1): `84dfd55`  
- Fix commit (Bug 2 — incorrect): `4d865ea`  
- Fix commit (final — Bugs 2b + 3): `0c82104`  
- Original PR description: [`docs/pr-messages/feature-timeline-improvements.md`](../pr-messages/feature-timeline-improvements.md)  
- Blog post: [#43 — I Pushed Broken Code Because I Trusted AI (And the Approve-All Button)](../../rm/presentation/alexrebula/docs/blog-post-ideas/ai/43-ai-regression-approve-all-and-discipline.md)  
