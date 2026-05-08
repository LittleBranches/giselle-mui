'use client';

import { useEffect, useState } from 'react';

import { resolveTaskChildren, sortMilestonesAsc, sortMilestonesDesc } from './two-column/utils';
import type { TimelinePhase } from './two-column/types';

// ----------------------------------------------------------------------
// Pure initialisers — no hooks, fully unit-testable.
// ----------------------------------------------------------------------

function buildPhaseDoneRecord(phases: TimelinePhase[]): Record<string, boolean> {
  return Object.fromEntries(phases.map((p) => [String(p.key), p.done ?? false]));
}

type MilestoneSortFn = (
  ms: NonNullable<TimelinePhase['milestones']>
) => NonNullable<TimelinePhase['milestones']>;

function buildMilestoneDoneRecord(
  phases: TimelinePhase[],
  sortFn: MilestoneSortFn
): Record<string, boolean> {
  const m: Record<string, boolean> = {};
  phases.forEach((p) => {
    const sorted = p.milestones ? sortFn([...p.milestones]) : [];
    sorted.forEach((ms, i) => {
      m[`${p.key}-${i}`] = ms.done ?? false;
    });
  });
  return m;
}

function buildTaskDoneRecord(
  phases: TimelinePhase[],
  sortFn: MilestoneSortFn
): Record<string, boolean> {
  const t: Record<string, boolean> = {};
  phases.forEach((p) => {
    const sortedMilestones = p.milestones ? sortFn([...p.milestones]) : [];
    const childTasks = p.children && p.children.length > 0 ? p.children : sortedMilestones;

    childTasks.forEach((task, childIndex) => {
      resolveTaskChildren(task).forEach((nestedTask, taskIndex) => {
        t[`${p.key}-c${childIndex}-t${taskIndex}`] = nestedTask.done ?? false;
      });
    });
  });
  return t;
}

// ----------------------------------------------------------------------

export interface TimelineDoneState {
  localPhaseDone: Record<string, boolean>;
  setLocalPhaseDone: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  localMilestoneDone: Record<string, boolean>;
  setLocalMilestoneDone: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  localTaskDoneMap: Record<string, boolean>;
  setLocalTaskDoneMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

/**
 * Manages the three done-state records shared by `TimelineTwoColumn` and
 * `TimelineCompact`. Handles initialisation from sorted phase data and
 * re-synchronises whenever `phases` or `sortOrder` changes.
 *
 * Toggle handlers are intentionally NOT included — cascade logic (two-column)
 * and `stopPropagation`/checklist gating (compact) differ too much to share.
 */
export function useTimelineDoneState(
  phases: TimelinePhase[],
  sortOrder: 'asc' | 'desc' | 'key'
): TimelineDoneState {
  const sortFn: MilestoneSortFn = sortOrder === 'asc' ? sortMilestonesAsc : sortMilestonesDesc;

  const [localPhaseDone, setLocalPhaseDone] = useState<Record<string, boolean>>(() =>
    buildPhaseDoneRecord(phases)
  );
  const [localMilestoneDone, setLocalMilestoneDone] = useState<Record<string, boolean>>(() =>
    buildMilestoneDoneRecord(phases, sortFn)
  );
  const [localTaskDoneMap, setLocalTaskDoneMap] = useState<Record<string, boolean>>(() =>
    buildTaskDoneRecord(phases, sortFn)
  );

  useEffect(() => {
    const fn: MilestoneSortFn = sortOrder === 'asc' ? sortMilestonesAsc : sortMilestonesDesc;
    setLocalPhaseDone(buildPhaseDoneRecord(phases));
    setLocalMilestoneDone(buildMilestoneDoneRecord(phases, fn));
    setLocalTaskDoneMap(buildTaskDoneRecord(phases, fn));
  }, [phases, sortOrder]);

  return {
    localPhaseDone,
    setLocalPhaseDone,
    localMilestoneDone,
    setLocalMilestoneDone,
    localTaskDoneMap,
    setLocalTaskDoneMap,
  };
}
