// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { createElement, act } from 'react';
import ReactDOM from 'react-dom/client';

import { useNestedChecklist } from './use-nested-checklist';

// ---------------------------------------------------------------------------
// Test harness — minimal controlled component that captures hook output
// ---------------------------------------------------------------------------

let capturedState: ReturnType<typeof useNestedChecklist> | null = null;

function Harness({
  initialParent,
  initialChildren,
}: {
  initialParent: boolean;
  initialChildren: boolean[];
}) {
  capturedState = useNestedChecklist(initialParent, initialChildren);
  return null;
}

function setup(initialParent: boolean, initialChildren: boolean[]) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);

  act(() => {
    root.render(createElement(Harness, { initialParent, initialChildren }));
  });

  return {
    cleanup: () => {
      act(() => root.unmount());
      div.remove();
    },
  };
}

// ---------------------------------------------------------------------------

describe('useNestedChecklist — initial state', () => {
  it('reflects initialParentDone and initialChildrenDone', () => {
    const { cleanup } = setup(false, [false, false, true]);
    expect(capturedState!.parentDone).toBe(false);
    expect(capturedState!.childrenDone).toEqual([false, false, true]);
    cleanup();
  });

  it('indeterminate is true when some but not all children are done', () => {
    const { cleanup } = setup(false, [true, false, false]);
    expect(capturedState!.indeterminate).toBe(true);
    cleanup();
  });

  it('indeterminate is false when no children are done', () => {
    const { cleanup } = setup(false, [false, false]);
    expect(capturedState!.indeterminate).toBe(false);
    cleanup();
  });

  it('indeterminate is false when ALL children are done', () => {
    const { cleanup } = setup(true, [true, true]);
    expect(capturedState!.indeterminate).toBe(false);
    cleanup();
  });
});

// ---------------------------------------------------------------------------

describe('useNestedChecklist — toggleParent', () => {
  it('marks ALL children done when parent transitions to done', () => {
    const { cleanup } = setup(false, [false, true, false]);
    act(() => capturedState!.toggleParent());
    expect(capturedState!.parentDone).toBe(true);
    expect(capturedState!.childrenDone).toEqual([true, true, true]);
    expect(capturedState!.indeterminate).toBe(false);
    cleanup();
  });

  it('marks ALL children undone when parent transitions to undone', () => {
    const { cleanup } = setup(true, [true, true, true]);
    act(() => capturedState!.toggleParent());
    expect(capturedState!.parentDone).toBe(false);
    expect(capturedState!.childrenDone).toEqual([false, false, false]);
    expect(capturedState!.indeterminate).toBe(false);
    cleanup();
  });
});

// ---------------------------------------------------------------------------

describe('useNestedChecklist — toggleChild', () => {
  it('marks parent done when toggling the last undone child', () => {
    // [true, true, false] → toggle index 2 → all done → parent done
    const { cleanup } = setup(false, [true, true, false]);
    act(() => capturedState!.toggleChild(2));
    expect(capturedState!.childrenDone).toEqual([true, true, true]);
    expect(capturedState!.parentDone).toBe(true);
    expect(capturedState!.indeterminate).toBe(false);
    cleanup();
  });

  it('[regression] marks parent UNDONE when any child is toggled off', () => {
    // Core cascade regression: parent must go undone when any child is undone.
    // [true, true, true] → toggle index 1 → parent undone
    const { cleanup } = setup(true, [true, true, true]);
    act(() => capturedState!.toggleChild(1));
    expect(capturedState!.childrenDone).toEqual([true, false, true]);
    expect(capturedState!.parentDone).toBe(false);
    cleanup();
  });

  it('sets indeterminate when some but not all children are done', () => {
    const { cleanup } = setup(false, [false, false]);
    act(() => capturedState!.toggleChild(0));
    expect(capturedState!.childrenDone).toEqual([true, false]);
    expect(capturedState!.indeterminate).toBe(true);
    expect(capturedState!.parentDone).toBe(false);
    cleanup();
  });

  it('clears indeterminate when all children become undone', () => {
    // Start: [true, false] — indeterminate
    const { cleanup } = setup(false, [true, false]);
    expect(capturedState!.indeterminate).toBe(true);
    // Toggle index 0 off → [false, false] — no longer indeterminate
    act(() => capturedState!.toggleChild(0));
    expect(capturedState!.childrenDone).toEqual([false, false]);
    expect(capturedState!.indeterminate).toBe(false);
    expect(capturedState!.parentDone).toBe(false);
    cleanup();
  });

  it('handles a single child correctly', () => {
    const { cleanup } = setup(false, [false]);
    act(() => capturedState!.toggleChild(0));
    expect(capturedState!.childrenDone).toEqual([true]);
    expect(capturedState!.parentDone).toBe(true);
    expect(capturedState!.indeterminate).toBe(false);
    cleanup();
  });
});

// ---------------------------------------------------------------------------

describe('useNestedChecklist — empty children', () => {
  it('toggling parent with no children works without throwing', () => {
    const { cleanup } = setup(false, []);
    // No children → every() returns true for empty arrays → parent would become done
    // on toggle. That's correct: "all zero children are done" is vacuously true.
    act(() => capturedState!.toggleParent());
    expect(capturedState!.parentDone).toBe(true);
    expect(capturedState!.childrenDone).toEqual([]);
    expect(capturedState!.indeterminate).toBe(false);
    cleanup();
  });
});
