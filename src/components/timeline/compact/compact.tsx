'use client';

import { useCallback, useMemo, useState, type MouseEvent, type SyntheticEvent } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { sortPhasesByDate, sortMilestonesAsc, sortMilestonesDesc } from '../two-column/utils';
import { useTimelineDoneState } from '../use-timeline-done-state';
import { TaskList } from '../task-list';
import type { TimelineMilestone } from '../two-column/types';
import { ChevronDownIcon } from './chevron-down-icon';
import { MilestoneModal } from './milestone-modal';
import {
  accordionDetailsSx,
  accordionRootSx,
  accordionSummarySx,
  dateSx,
  descriptionSx,
  milestoneDateSx,
  milestoneDotColumnSx,
  milestoneDotSx,
  milestoneContentSx,
  milestoneConnectorLineSx,
  milestoneDescriptionPreviewSx,
  milestoneItemSx,
  milestonesListSx,
  milestoneTitleSx,
  phaseDotSx,
  phaseTitleSx,
} from './compact.styles';
import type { TimelineCompactProps } from './types';
import { resolveCompactColor, resolveTaskChildren } from './utils';

// ----------------------------------------------------------------------

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

  const sorted = useMemo(
    () =>
      sortPhasesByDate(phases, sortOrder).map((phase) => ({
        ...phase,
        milestones: phase.milestones ? sortMilestones([...phase.milestones]) : phase.milestones,
      })),
    [phases, sortOrder, sortMilestones]
  );

  const {
    localPhaseDone,
    setLocalPhaseDone,
    localMilestoneDone,
    setLocalMilestoneDone,
    localTaskDoneMap,
    setLocalTaskDoneMap,
  } = useTimelineDoneState(phases, sortOrder);

  // Modal state
  const [modalMilestone, setModalMilestone] = useState<TimelineMilestone | null>(null);
  const handleOpenModal = useCallback((ms: TimelineMilestone) => setModalMilestone(ms), []);
  const handleCloseModal = useCallback(() => setModalMilestone(null), []);

  const handlePhaseDotClick = useCallback(
    (e: MouseEvent<HTMLElement>, phaseKey: number) => {
      if (!checklist) return;
      e.stopPropagation();
      const next = !(localPhaseDone[String(phaseKey)] ?? false);
      setLocalPhaseDone((prev) => ({ ...prev, [String(phaseKey)]: next }));
      onTogglePhaseDone?.(phaseKey, next);
    },
    [checklist, localPhaseDone, onTogglePhaseDone, setLocalPhaseDone]
  );

  const handleMilestoneDotClick = useCallback(
    (e: MouseEvent<HTMLElement>, phaseKey: number, milestoneIdx: number) => {
      if (!checklist) return;
      e.stopPropagation();
      const k = `${phaseKey}-${milestoneIdx}`;
      const next = !(localMilestoneDone[k] ?? false);
      setLocalMilestoneDone((prev) => ({ ...prev, [k]: next }));
      onToggleMilestoneDone?.(phaseKey, milestoneIdx, next);
    },
    [checklist, localMilestoneDone, onToggleMilestoneDone, setLocalMilestoneDone]
  );

  const handleTaskToggle = useCallback(
    (phaseKey: number, milestoneIdx: number | null, taskIdx: number) => {
      const k =
        milestoneIdx === null
          ? `${phaseKey}-t${taskIdx}`
          : `${phaseKey}-m${milestoneIdx}-t${taskIdx}`;
      const next = !(localTaskDoneMap[k] ?? false);
      setLocalTaskDoneMap((prev) => ({ ...prev, [k]: next }));
      onToggleTaskDone?.(phaseKey, milestoneIdx, taskIdx, next);
    },
    [localTaskDoneMap, onToggleTaskDone, setLocalTaskDoneMap]
  );

  return (
    <>
      <Box sx={[{ width: '100%' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
        {sorted.map((phase) => {
          const isDone = localPhaseDone[String(phase.key)] ?? false;
          const effectiveColor = resolveCompactColor(phase.color, isDone);
          const hasMilestones = (phase.milestones?.length ?? 0) > 0;
          const taskChildren = resolveTaskChildren(phase);
          const hasDetails = Boolean(phase.description) || taskChildren.length > 0 || hasMilestones;

          return (
            <Accordion
              key={phase.key}
              disableGutters
              elevation={0}
              sx={accordionRootSx(isDone)}
              onChange={
                onMarkViewed
                  ? (_e: SyntheticEvent, expanded: boolean) => {
                      if (expanded) onMarkViewed(`phase-${phase.key}`);
                    }
                  : undefined
              }
            >
              <AccordionSummary
                expandIcon={hasDetails ? <ChevronDownIcon /> : null}
                sx={accordionSummarySx}
                aria-label={phase.shortTitle ?? phase.title}
              >
                <Box
                  sx={phaseDotSx(effectiveColor)}
                  aria-hidden="true"
                  onClick={checklist ? (e) => handlePhaseDotClick(e, phase.key) : undefined}
                >
                  {phase.icon}
                </Box>
                <Typography variant="subtitle2" sx={phaseTitleSx}>
                  {phase.shortTitle ?? phase.title}
                </Typography>
                <Typography variant="caption" sx={dateSx}>
                  {phase.date}
                </Typography>
              </AccordionSummary>

              {hasDetails && (
                <AccordionDetails sx={accordionDetailsSx}>
                  {phase.description && (
                    <Typography variant="body2" sx={descriptionSx}>
                      {phase.description}
                    </Typography>
                  )}

                  {taskChildren.length > 0 && (
                    <TaskList
                      tasks={taskChildren}
                      checklist={checklist}
                      taskDoneState={taskChildren.map(
                        (task, i) => localTaskDoneMap[`${phase.key}-t${i}`] ?? task.done ?? false
                      )}
                      onTaskToggle={(i) => handleTaskToggle(phase.key, null, i)}
                    />
                  )}

                  {hasMilestones && (
                    <Box component="ul" sx={milestonesListSx}>
                      {phase.milestones!.map((ms, idx) => {
                        const isMsDone = localMilestoneDone[`${phase.key}-${idx}`] ?? false;
                        const msColor = resolveCompactColor(ms.color, isMsDone);
                        const isLast = idx === phase.milestones!.length - 1;

                        return (
                          <Box
                            component="li"
                            key={`${phase.key}-ms-${idx}`}
                            sx={milestoneItemSx}
                            onClick={() => handleOpenModal(ms)}
                            role="button"
                            tabIndex={0}
                            aria-label={`View details: ${ms.title}`}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleOpenModal(ms);
                              }
                            }}
                          >
                            {/* Dot column: circle + connector */}
                            <Box sx={milestoneDotColumnSx}>
                              <Box
                                sx={milestoneDotSx(msColor)}
                                aria-hidden="true"
                                onClick={
                                  checklist
                                    ? (e) => {
                                        e.stopPropagation();
                                        handleMilestoneDotClick(e, phase.key, idx);
                                      }
                                    : undefined
                                }
                              >
                                {ms.icon}
                              </Box>
                              {!isLast && <Box aria-hidden="true" sx={milestoneConnectorLineSx} />}
                            </Box>

                            {/* Text content */}
                            <Box sx={milestoneContentSx}>
                              <Typography variant="subtitle2" sx={milestoneTitleSx}>
                                {ms.shortTitle ?? ms.title}
                              </Typography>
                              {ms.description && (
                                <Typography variant="caption" sx={milestoneDescriptionPreviewSx}>
                                  {ms.description}
                                </Typography>
                              )}
                            </Box>

                            {/* Date */}
                            {ms.date && (
                              <Typography variant="caption" sx={milestoneDateSx}>
                                {ms.date}
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </AccordionDetails>
              )}
            </Accordion>
          );
        })}
      </Box>

      <MilestoneModal
        milestone={modalMilestone}
        open={modalMilestone !== null}
        onClose={handleCloseModal}
      />
    </>
  );
}
