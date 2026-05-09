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
    [k]: prev[k] === milestoneIndex ? null : milestoneIndex, // toggle
  }));
}, []);

const handleExpandPhaseCard = useCallback((phaseKey) => {
  setExpandedMilestoneMap({});
  setExpandedPhaseKey((prev) => (prev === phaseKey ? null : phaseKey)); // toggle
}, []);
```

### After (open-only — introduced in 651173d, broken)

```ts
const handleExpandMilestone = useCallback((phaseKey, milestoneIndex) => {
  const k = String(phaseKey);
  setExpandedPhaseKey(null);
  setExpandedMilestoneMap((prev) => {
    if (prev[k] === milestoneIndex) return prev; // early return — card stuck open
    return { ...prev, [k]: milestoneIndex };
  });
}, []);

const handleExpandPhaseCard = useCallback((phaseKey) => {
  setExpandedMilestoneMap({});
  setExpandedPhaseKey(phaseKey); // always opens, never toggles
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

## Regression tests added

### `milestone-badge.logic.test.ts` — three-level `displayTitle` disclosure (8 tests)

Added in the same commit as the final fix (`0c82104`). The `computeDisplayTitle` helper is
extracted as a pure function in the test file and covers the full state matrix:

| State                                                  | Input                                 | Expected output                |
| ------------------------------------------------------ | ------------------------------------- | ------------------------------ |
| At rest, shortTitle defined                            | `isExpanded=false`, `isHovered=false` | `shortTitle`                   |
| At rest, no shortTitle                                 | `isExpanded=false`, `isHovered=false` | `title`                        |
| Hovered (not expanded)                                 | `isExpanded=false`, `isHovered=true`  | `title`                        |
| Expanded (not hovered)                                 | `isExpanded=true`, `isHovered=false`  | `title`                        |
| Expanded + hovered                                     | `isExpanded=true`, `isHovered=true`   | `title`                        |
| `[regression]` shortTitle absent → falls back to title | —                                     | `title`                        |
| `[regression]` hover restores title (Bug 2b guard)     | `isHovered=true`                      | full `title`, not `shortTitle` |
| `[regression]` hovered + shortTitle defined            | `isHovered=true`                      | full `title`, not `shortTitle` |

These are pure-logic tests (`renderToStaticMarkup` not needed). They guard against a repeat
of Bug 2b (hover title accidentally removed from the disclosure model).

### `timeline-two-column.interaction.test.ts` — `computeSlotHeights` invariant (5 tests)

Added after extracting `computeSlotHeights` as an exported pure function. The tests cover:

1. **Max + padding**: phase with two milestones of heights 80 and 100 → slot = 116 (max + 16)
2. **No-op when unmeasured**: empty height map → no slot entry (guarded by `if (maxH > 0)`)
3. **Skips empty phases**: phase with zero milestones → no slot entry
4. **Multi-phase independence**: two phases compute separate slot heights without interference
5. **`[regression]` Bug 3 signature guard**: verifies the function is `(phases, heightMap)` — no
   expansion/interaction state parameter. Documents that if a `300px` expanded height were
   erroneously passed in the height map, the result would be `316` (the Bug 3 layout-shift value),
   proving the fix works by ensuring that height is _never_ in the map during interaction.

### Why the ref-callback mount-only invariant is not unit-tested

The key architectural guarantee — that `onMeasure` never fires during expand/hover/collapse —
is enforced structurally, not by a unit test:

- `onMeasure` is a React ref callback attached to a Box wrapper that is always mounted.
  React only calls ref callbacks when an element **mounts or unmounts**. The wrapper is never
  remounted during user interaction; only its children (via `Collapse`) change.
- `useLayoutEffect` has `[sorted]` in its dependency array. `sorted` is derived from the
  `phases` prop, which does not change during interaction. Expanding or hovering a card does
  not touch `phases`, so the effect never re-runs.

These are React semantics guarantees, not application logic. A unit test for "does this effect
run on expand?" would be testing React itself. The `computeSlotHeights` pure-function tests
(above) document the correct input contract; the architectural tests document what inputs can
never occur.

### Remaining gap (not yet closed)

The toggle behavior (click-to-expand, click-again-to-collapse) was tested via state-machine
pure-logic tests added in commit `84dfd55`. The full render-path interaction test originally
described as future work below has not been added. It would require rendering `TimelineTwoColumn`
in JSDOM with real phase data, firing click events, and asserting `pointerEvents` style — which
requires `ThemeProvider` setup not yet in the test harness.

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

---

## Bug 4 — Hovered phase card covered by next collapsed phase (OPEN — not yet fixed)

**Detected:** May 5, 2026 — visually in the browser after phase cards were made absolutely
positioned  
**Status:** ⚠️ OPEN — not yet fixed. Documented here to preserve context for the fix.

### Symptom

When hovering a `PhaseCard`, the card's visual expansion overflows vertically into the
space occupied by the next `<li>`. The next `<li>` has its own stacking context (z-index 1
or 2 from `phaseLiSx`) and paints over the hovered card. The hovered card appears clipped
or hidden behind the content of the phase below it.

### Why this happens — stacking context architecture

Each phase is rendered as a `<Box component="li">` with `phaseLiSx`, which sets
`position: 'relative'` and `overflow: 'visible'`. The `overflow: 'visible'` allows card
expansion to visually exceed the `<li>` boundary, but the default `zIndex: 1` means the
**next** `<li>` (also `zIndex: 1`) paints over anything that overflows from the previous one.

This was already a known issue for **milestone cards**, and it was fixed. The existing fix
has two parts:

**Part 1 — `msCardWrapperSx` raises the individual wrapper on hover:**

```ts
// two-column.styles.ts
'&:hover': { zIndex: 999 },
```

**Part 2 — `phaseLiSx` raises the entire `<li>` when a milestone inside it is hovered:**

```ts
// two-column.styles.ts
'&:has([data-ms-card]:hover)': { zIndex: 3 },
```

Part 2 is the critical one: raising the milestone card wrapper alone (Part 1) is not enough
because the `<li>` itself is a stacking context. If the `<li>` is at `zIndex: 1` and the
next `<li>` is also at `zIndex: 1`, the next one wins in source order (paints on top). The
`:has()` rule brings the hovering `<li>` to `zIndex: 3`, above any neighbouring `<li>`.

**The gap:** The `:has()` selector targets `[data-ms-card]` — a data attribute set on
milestone card wrappers. **There is no equivalent rule for phase cards.** Phase cards do
not carry a `data-phase-card` attribute, and `phaseLiSx` has no `:has([data-phase-card]:hover)`
rule. So when a phase card overflows and is hovered, its parent `<li>` stays at `zIndex: 1`
and the next `<li>` (also `zIndex: 1`, later in source order) occludes it.

### What the fix must do

1. **Add `data-phase-card` attribute** to the hover-sensitive root element of `PhaseCard`
   (the Paper or its outermost container that receives `:hover`).

2. **Add `:has([data-phase-card]:hover)` to `phaseLiSx`:**

   ```ts
   // two-column.styles.ts — phaseLiSx
   '&:has([data-ms-card]:hover)': { zIndex: 3 },    // existing — milestone cards
   '&:has([data-phase-card]:hover)': { zIndex: 3 }, // NEW — phase cards
   ```

3. **Do not change** the base `zIndex: 1 | 2` values in `phaseLiSx` — these are pinned by
   existing regression tests in `two-column.styles.test.ts`. Change only the `:has()` rules.

4. **Do not change** `msCardWrapperSx` z-index values — they are also pinned by the styles
   test.

### Existing regression tests that must not break

These tests in `two-column.styles.test.ts` pin the current z-index values. Any fix must
leave them passing:

| Test                                                              | Assertion                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------- |
| `phaseLiSx — uses zIndex=1 when no milestone expanded`            | `styles['zIndex'] === 1`                                |
| `phaseLiSx — uses zIndex=2 when a milestone is expanded`          | `styles['zIndex'] === 2`                                |
| `phaseLiSx — has :has() pseudo-class for hovered milestone cards` | `styles['&:has([data-ms-card]:hover)']['zIndex'] === 3` |
| `floatingDatePillSx — has z-index 2 so it renders above dot`      | `sx['zIndex'] === 2`                                    |
| `markerPhaseLiSx — is relatively positioned`                      | `sx['zIndex'] === 1`                                    |

### Regression tests that must be added alongside the fix

The following tests must be written **before or alongside** the fix, not after. They are the
automated guard against re-introducing this occlusion in the future.

**In `two-column.styles.test.ts` — `phaseLiSx` describe block:**

```ts
it('[regression] has :has() pseudo-class that raises <li> when a phase card inside is hovered', () => {
  const styles = phaseLiSx({ zIndex: 1 }) as Record<string, unknown>;
  const hasRule = styles['&:has([data-phase-card]:hover)'] as Record<string, number>;
  expect(hasRule['zIndex']).toBe(3);
});
```

**In `phase-card/index.test.ts` — rendering assertions:**

```ts
it('[regression] root Paper element carries data-phase-card attribute so phaseLiSx :has() rule can fire', () => {
  // renderToStaticMarkup(createElement(PhaseCard, minimalProps))
  // expect(html).toContain('data-phase-card');
});
```

### CSS `:has()` browser support note

The `:has()` selector is already used in this component (`'&:has([data-ms-card]:hover)'`).
Browser support is Chrome ≥ 121, Firefox ≥ 121, Safari ≥ 17 — matching the project's
minimum browser target matrix. No polyfill needed; the pattern is already established.

### Why the test for CSS hover state can only go so far

JSDOM cannot evaluate `:hover` pseudo-class state (the browser CSS engine is absent). The
unit tests above guard the **structural contract** — that the attribute exists and the `:has()`
rule is present in the sx object. They cannot simulate a mouse hover and assert visual
occlusion is prevented. The only verification for the actual visual fix is manual
browser testing after the fix is applied.

---

## Three-bug cascade — timeline

| #   | Bug                                    | Introduced                | Fixed                   | Symptoms                                                             |
| --- | -------------------------------------- | ------------------------- | ----------------------- | -------------------------------------------------------------------- |
| 1   | Toggle → open-only                     | `651173d`                 | `84dfd55`               | hover permanently blocked after expanding any card                   |
| 2   | Hover feedback loop                    | `651173d` (RO)            | `4d865ea` (incorrectly) | cards flickered on hover                                             |
| 2b  | Hover title regression                 | `4d865ea` (incorrect fix) | `0c82104`               | full title no longer shown on hover                                  |
| 3   | Expand layout shift                    | `651173d` (RO)            | `0c82104`               | all milestone cards shift on expand, expanded card goes off-screen   |
| 4   | Phase card covered by next `<li>` item | phase cards made absolute | ⚠️ OPEN                 | hovered phase card hidden behind content of the next collapsed phase |

**Root cause of bugs 2, 2b, 3:** A single architectural error — `ResizeObserver` feeding
back into layout state during user interaction. Corrected by removing ResizeObserver and
using a one-shot measurement approach.

**Root cause of bug 4:** The `:has([data-ms-card]:hover)` stacking fix was applied only
for milestone cards. Phase cards were not given the equivalent `data-phase-card` attribute
or `:has()` rule when they were moved to absolute positioning.

---

## Related

- Fix commit (Bug 1): `84dfd55`
- Fix commit (Bug 2 — incorrect): `4d865ea`
- Fix commit (final — Bugs 2b + 3): `0c82104`
- Original PR description: [`docs/pr-messages/feature-timeline-improvements.md`](../pr-messages/feature-timeline-improvements.md)
- Blog post: [#43 — I Pushed Broken Code Because I Trusted AI (And the Approve-All Button)](../../rm/presentation/alexrebula/docs/blog-post-ideas/ai/43-ai-regression-approve-all-and-discipline.md)
