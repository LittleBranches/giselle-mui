'use client';

import { useCallback, useMemo, useState } from 'react';

// ----------------------------------------------------------------------

export interface NestedChecklistState {
  /** Whether the parent item is done (all children done). */
  parentDone: boolean;
  /**
   * Whether the parent checkbox should display indeterminate state.
   * `true` when at least one but not all children are done.
   */
  indeterminate: boolean;
  /** Current done state for each child, indexed by position. */
  childrenDone: boolean[];
  /**
   * Toggle the parent.
   * - Transitioning to `true`: marks ALL children done.
   * - Transitioning to `false`: marks ALL children undone.
   */
  toggleParent: () => void;
  /**
   * Toggle one child by index.
   * - If all children are now done → parent becomes done.
   * - If any child is now undone → parent becomes undone.
   */
  toggleChild: (index: number) => void;
}

// ----------------------------------------------------------------------

/**
 * Manages the cascade done-state relationship between a parent item
 * (an accordion / phase) and its child items (milestones / tasks).
 *
 * ## Cascade rules
 *
 * | Action | Effect |
 * |---|---|
 * | Toggle parent → done | All children → done |
 * | Toggle parent → undone | All children → undone |
 * | Toggle child → all done | Parent → done |
 * | Toggle child → any undone | Parent → undone |
 *
 * ## Usage in TimelineCompact
 *
 * ```tsx
 * const { parentDone, indeterminate, childrenDone, toggleParent, toggleChild } =
 *   useNestedChecklist(phase.done ?? false, milestones.map(ms => ms.done ?? false));
 *
 * <Accordion
 *   checklist
 *   done={parentDone}
 *   indeterminate={indeterminate}
 *   onDoneButtonClick={toggleParent}
 *   title={phase.title}
 * >
 *   {milestones.map((ms, i) => (
 *     <MilestoneRow key={i} done={childrenDone[i]} onToggle={() => toggleChild(i)} />
 *   ))}
 * </Accordion>
 * ```
 *
 * @param initialParentDone - Initial done state for the parent.
 * @param initialChildrenDone - Initial done state for each child, positionally indexed.
 */
export function useNestedChecklist(
  initialParentDone: boolean,
  initialChildrenDone: boolean[]
): NestedChecklistState {
  const [parentDone, setParentDone] = useState(initialParentDone);
  const [childrenDone, setChildrenDone] = useState(initialChildrenDone);

  const indeterminate = useMemo(
    () => childrenDone.some(Boolean) && !childrenDone.every(Boolean),
    [childrenDone]
  );

  const toggleParent = useCallback(() => {
    const next = !parentDone;
    setParentDone(next);
    setChildrenDone((prev) => prev.map(() => next));
  }, [parentDone]);

  const toggleChild = useCallback((index: number) => {
    setChildrenDone((prev) => {
      const next = prev.map((v, i) => (i === index ? !v : v));
      // Cascade: parent done iff every child is done.
      setParentDone(next.every(Boolean));
      return next;
    });
  }, []);

  return { parentDone, indeterminate, childrenDone, toggleParent, toggleChild };
}
