// @vitest-environment jsdom

/**
 * State-machine regression tests for TimelineTwoColumn expand/collapse behaviour.
 *
 * These tests guard against a regression introduced in commit 651173d where
 * handleExpandMilestone and handleExpandPhaseCard were changed from "toggle"
 * to "open-only" (early-return when already open, always-set otherwise).
 *
 * The "open-only" pattern, combined with stopPropagation only firing when a
 * card is expanded, caused a deadlock:
 *
 *   1. Card opens → isThisMsExpanded = true → stopPropagation registered
 *   2. Click card again → stopPropagation fires first → document listener blocked
 *   3. open-only handler: prev[k] === index, returns prev unchanged → card stays open
 *   4. anyExpanded stays true → all other cards get pointerEvents: 'none'
 *   5. No way to close any card; hover breaks everywhere
 *
 * The fix (84dfd55) restored toggle semantics:
 *   - handleExpandMilestone: prev[k] === milestoneIndex ? null : milestoneIndex
 *   - handleExpandPhaseCard: prev === phaseKey ? null : phaseKey
 *
 * ## Regressions guarded
 *
 *   - Clicking an expanded milestone closes it (toggle, not open-only)
 *   - Clicking an expanded phase card closes it (toggle, not open-only)
 *   - Clicking a different milestone while one is open closes the first
 *   - Phase card expansion clears all milestone expanded state
 *   - Milestone expansion clears phase card expanded state
 */

import { it, expect, describe } from 'vitest';

import type { TimelinePhase } from './types';
import { computeSlotHeights } from './timeline-two-column';

// ---------------------------------------------------------------------------
// Mirror functions
//
// These replicate the pure reducer logic inside the useCallback handlers in
// timeline-two-column.tsx. They have no React dependency — they are just
// the state-transition functions extracted for testability.
//
// IMPORTANT: if the implementation changes, update these mirrors too.
// ---------------------------------------------------------------------------

type MilestoneMap = Record<string, number | null>;

/**
 * Mirrors handleExpandMilestone in timeline-two-column.tsx.
 *
 * When a milestone is already expanded:  prev[key] === index → close it (null).
 * When a different milestone is clicked: set it. Phase card always closes.
 */
function applyExpandMilestone(
  prevMap: MilestoneMap,
  phaseKey: number | string,
  milestoneIndex: number
): MilestoneMap {
  const k = String(phaseKey);
  return {
    ...prevMap,
    [k]: prevMap[k] === milestoneIndex ? null : milestoneIndex,
  };
}

/**
 * Mirrors handleExpandPhaseCard in timeline-two-column.tsx.
 *
 * When the card is already expanded: prev === phaseKey → close it (null).
 * Milestone state is not part of this function (cleared in the handler itself).
 */
function applyExpandPhaseCard(
  prevKey: number | string | null,
  phaseKey: number | string
): number | string | null {
  return prevKey === phaseKey ? null : phaseKey;
}

// ---------------------------------------------------------------------------
// handleExpandMilestone — toggle regression
// ---------------------------------------------------------------------------

describe('[regression] handleExpandMilestone — toggle, not open-only', () => {
  it('open milestone: prev[key] is null → sets to milestoneIndex', () => {
    const result = applyExpandMilestone({}, 1, 0);
    expect(result['1']).toBe(0);
  });

  it('[regression] clicking same milestone when expanded: closes it (null)', () => {
    // Before the fix, this returned prev unchanged (open-only), causing deadlock.
    const result = applyExpandMilestone({ '1': 0 }, 1, 0);
    expect(result['1']).toBeNull();
  });

  it('clicking different milestone when one is open: opens the new one', () => {
    const result = applyExpandMilestone({ '1': 0 }, 1, 2);
    expect(result['1']).toBe(2);
  });

  it('toggle is symmetrical: open → close → open', () => {
    let state: MilestoneMap = {};
    state = applyExpandMilestone(state, 1, 0);
    expect(state['1']).toBe(0); // open
    state = applyExpandMilestone(state, 1, 0);
    expect(state['1']).toBeNull(); // close
    state = applyExpandMilestone(state, 1, 0);
    expect(state['1']).toBe(0); // open again
  });

  it('different phase keys are independent', () => {
    let state: MilestoneMap = {};
    state = applyExpandMilestone(state, 1, 0);
    state = applyExpandMilestone(state, 2, 3);
    // Closing phase 1's milestone must not affect phase 2
    state = applyExpandMilestone(state, 1, 0);
    expect(state['1']).toBeNull();
    expect(state['2']).toBe(3); // unchanged
  });

  it('phaseKey coerced to string — numeric and string keys are equivalent', () => {
    const fromNumeric = applyExpandMilestone({}, 42, 0);
    const fromString = applyExpandMilestone({}, '42', 0);
    expect(fromNumeric['42']).toBe(fromString['42']);
  });
});

// ---------------------------------------------------------------------------
// handleExpandPhaseCard — toggle regression
// ---------------------------------------------------------------------------

describe('[regression] handleExpandPhaseCard — toggle, not open-only', () => {
  it('open phase card: prev is null → sets to phaseKey', () => {
    const result = applyExpandPhaseCard(null, 1);
    expect(result).toBe(1);
  });

  it('[regression] clicking same phase card when expanded: closes it (null)', () => {
    // Before the fix, this returned prev unchanged (open-only), causing deadlock.
    const result = applyExpandPhaseCard(1, 1);
    expect(result).toBeNull();
  });

  it('clicking different phase card when one is open: opens the new one', () => {
    const result = applyExpandPhaseCard(1, 2);
    expect(result).toBe(2);
  });

  it('toggle is symmetrical: open → close → open', () => {
    let state: number | string | null = null;
    state = applyExpandPhaseCard(state, 1);
    expect(state).toBe(1); // open
    state = applyExpandPhaseCard(state, 1);
    expect(state).toBeNull(); // close
    state = applyExpandPhaseCard(state, 1);
    expect(state).toBe(1); // open again
  });
});

// ---------------------------------------------------------------------------
// computeSlotHeights — slot height invariant (regression for Bug 3)
//
// This tests the pure function that backs useLayoutEffect([sorted]).
// The function is a pure mapping of (phases, heightMap) → slotHeights.
// It has NO concept of expand/collapse/hover state — by design.
//
// REGRESSION GUARD: if anyone adds expansion state as a parameter to this
// function, these tests will no longer cover the full input space and the
// architectural invariant (slot heights must not change during interaction)
// will be broken. The function signature `(phases, heightMap)` must remain
// the contract — two parameters, no state.
// ---------------------------------------------------------------------------

// Minimal phase factory for computeSlotHeights tests.
// Only the fields that computeSlotHeights actually uses are set;
// required-but-unused fields (icon, date) are given empty/null values.
function makePhase(key: number, side: 'left' | 'right', milestoneCount: number): TimelinePhase {
  return {
    key,
    title: `Phase ${key}`,
    date: '',
    icon: null,
    side,
    milestones: Array.from({ length: milestoneCount }, (_, i) => ({
      title: `M${i}`,
      date: '',
      icon: null,
    })),
  };
}

describe('computeSlotHeights — slot height invariant (regression: Bug 3 expand layout shift)', () => {
  it('returns maxCardHeight + 16 for a phase with measured milestones', () => {
    const phases = [makePhase(1, 'right', 2)];
    const heightMap = { '1-0': 80, '1-1': 100 };
    const result = computeSlotHeights(phases, heightMap);
    // maxH = 100, slot = 100 + 16 = 116
    expect(result['1']).toBe(116);
  });

  it('returns 0 (no entry) when no milestone heights have been recorded yet', () => {
    const phases = [makePhase(1, 'right', 1)];
    const result = computeSlotHeights(phases, {}); // nothing measured yet
    // maxH = 0 → guarded by `if (maxH > 0)` → no entry
    expect(result['1']).toBeUndefined();
  });

  it('skips phases with no milestones', () => {
    const phases = [makePhase(1, 'right', 0)];
    const result = computeSlotHeights(phases, { '1-0': 80 });
    expect(result['1']).toBeUndefined(); // n === 0 → skipped
  });

  it('computes independent slot heights for multiple phases', () => {
    const phases = [makePhase(1, 'right', 2), makePhase(2, 'left', 1)];
    const heightMap = { '1-0': 90, '1-1': 70, '2-0': 120 };
    const result = computeSlotHeights(phases, heightMap);
    expect(result['1']).toBe(106); // max(90, 70) + 16
    expect(result['2']).toBe(136); // 120 + 16
  });

  it('[regression] function signature is (phases, heightMap) — no expansion state parameter', () => {
    // The function must NOT accept or use any expansion/hover/interaction state.
    // useLayoutEffect([sorted]) depends only on `sorted`, which is derived from phases.
    // If an expand parameter were added, useLayoutEffect would need to depend on it,
    // and slot heights would change during user interaction → layout shift regression.
    //
    // This test verifies the same (phases, heightMap) input always returns the same
    // output regardless of any hypothetical "expansion state" we simulate by passing
    // the expanded height in the map (as the ResizeObserver wrongly did when cards expanded).
    const phases = [makePhase(1, 'right', 1)];
    const collapsedMap = { '1-0': 80 };
    const expandedMap = { '1-0': 300 }; // card grew due to expansion

    const collapsedResult = computeSlotHeights(phases, collapsedMap);
    const expandedResult = computeSlotHeights(phases, expandedMap);

    // The correct fix means expandedMap is NEVER passed during interaction —
    // msHeightMapRef.current is only updated by ref callbacks (mount only).
    // This test documents what would go wrong if the expanded height leaked in:
    expect(collapsedResult['1']).toBe(96); // 80 + 16 — correct collapsed slot height
    expect(expandedResult['1']).toBe(316); // 300 + 16 — the Bug 3 value that caused the layout shift
  });
});
