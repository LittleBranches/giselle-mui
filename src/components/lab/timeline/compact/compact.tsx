'use client';

import { useCallback, useMemo, useState } from 'react';

import Box from '@mui/material/Box';

import { sortPhasesByDate, sortMilestonesAsc, sortMilestonesDesc } from '../two-column/utils';
import { useTimelineDoneState } from '../use-timeline-done-state';
import { accordionRootSx } from './compact.styles';
import type { TimelineCompactProps } from './types';
import { PhaseAccordionRow } from './phase-accordion-row';

// ----------------------------------------------------------------------

/**
 * Collapsible accordion view of timeline phases and milestones,
 * optimised for mobile and narrow-viewport contexts.
 *
 * One phase = one accordion row. Expanding a row reveals its milestones in
 * the order controlled by `sortOrder`. In checklist mode each phase and
 * milestone row shows a completion toggle.
 *
 * Shares the same `TimelinePhase` data model as `TimelineTwoColumn` — the
 * same dataset can render both views from a single source.
 *
 * **Quality status (13 May 2026):** DoD 20/20 · Best practices 13/13
 */
export function TimelineCompact({
  phases,
  checklist = false,
  sortOrder = 'desc',
  viewedKeys: _viewedKeys,
  onMarkViewed,
  onTogglePhaseDone,
  onToggleMilestoneDone,
  onToggleTaskDone,
  sx,
  ...other
}: TimelineCompactProps) {
  const sortMilestones = sortOrder === 'asc' ? sortMilestonesAsc : sortMilestonesDesc;

  const sorted = useMemo(() => sortPhasesByDate(phases, sortOrder), [phases, sortOrder]);

  // Phase and milestone done state is owned by PhaseAccordionRow (via useNestedChecklist).
  // Only task done state is managed here.
  const { localTaskDoneMap, setLocalTaskDoneMap } = useTimelineDoneState(phases, sortOrder);

  const handleTaskToggle = useCallback(
    (phaseKey: number, childIdx: number | null, taskIdx: number) => {
      const k =
        childIdx === null ? `${phaseKey}-t${taskIdx}` : `${phaseKey}-c${childIdx}-t${taskIdx}`;
      const next = !(localTaskDoneMap[k] ?? false);
      setLocalTaskDoneMap((prev) => ({ ...prev, [k]: next }));
      onToggleTaskDone?.(phaseKey, childIdx, taskIdx, next);
    },
    [localTaskDoneMap, onToggleTaskDone, setLocalTaskDoneMap]
  );

  // Track which phase (by key) is currently expanded.
  // null = all collapsed. Only one row can be expanded at a time.
  const [expandedPhaseKey, setExpandedPhaseKey] = useState<number | null>(null);

  const handleToggleExpanded = useCallback((key: number) => {
    setExpandedPhaseKey((prev) => (prev === key ? null : key));
  }, []);

  return (
    <Box sx={[accordionRootSx(false), ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {sorted.map((phase) => {
        const sortedMilestones = phase.milestones ? sortMilestones([...phase.milestones]) : [];
        return (
          <PhaseAccordionRow
            key={phase.key}
            phase={phase}
            sortedMilestones={sortedMilestones}
            checklist={checklist}
            taskDoneMap={localTaskDoneMap}
            onTaskToggle={handleTaskToggle}
            onMarkViewed={onMarkViewed}
            onTogglePhaseDone={onTogglePhaseDone}
            onToggleMilestoneDone={onToggleMilestoneDone}
            expandedPhaseKey={expandedPhaseKey}
            onToggleExpanded={handleToggleExpanded}
          />
        );
      })}
    </Box>
  );
}
