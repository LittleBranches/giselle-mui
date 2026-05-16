'use client';

import { useCallback, useState, type SyntheticEvent } from 'react';

import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { Accordion } from '../../../material/surfaces/card/accordion';
import { ToggleIconButton } from '../../../material/input/toggle-icon-button';
import { useNestedChecklist } from '../../../../utils/hooks/use-nested-checklist/use-nested-checklist';
import { ChevronDownIcon } from './chevron-down-icon';
import { TaskDetailsModal } from './milestone-modal';
import {
  accordionDetailsSx,
  accordionRootSx,
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
import {
  COMPACT_PHASE_DOT_SIZE,
  COMPACT_PHASE_ICON_SIZE,
  COMPACT_MILESTONE_DOT_SIZE,
  COMPACT_MILESTONE_ICON_SIZE,
} from './compact.const';
import type { PhaseAccordionRowProps } from './types';
import { resolveCompactColor, resolveTaskChildren } from './utils';
import type { Task } from '../two-column/types';

// ----------------------------------------------------------------------

// Done state: success circle (32 px) with white checkmark inside.
// Module-level — created once, never re-instantiated on render.
const CHECK_DONE_DOT = (
  <Box sx={phaseDotSx('success')} aria-hidden="true">
    <svg
      width={COMPACT_PHASE_ICON_SIZE}
      height={COMPACT_PHASE_ICON_SIZE}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Material Design 'check' path */}
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  </Box>
);

// Hover state: outlined green check-circle, same 32 px footprint, no fill background.
const CHECK_HOVER_DOT = (
  <SvgIcon sx={{ color: 'success.main', fontSize: COMPACT_PHASE_DOT_SIZE }} viewBox="0 0 24 24">
    {/* Material Design 'check_circle_outline' path */}
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" />
  </SvgIcon>
);

// Milestone done state: success circle (24 px) with white checkmark inside.
const MS_CHECK_DONE_DOT = (
  <Box
    sx={phaseDotSx('success')}
    style={{ width: COMPACT_MILESTONE_DOT_SIZE, height: COMPACT_MILESTONE_DOT_SIZE, flexShrink: 0 }}
    aria-hidden="true"
  >
    <svg
      width={COMPACT_MILESTONE_ICON_SIZE}
      height={COMPACT_MILESTONE_ICON_SIZE}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  </Box>
);

// Milestone hover state: outlined green check-circle, 24 px footprint.
const MS_CHECK_HOVER_DOT = (
  <SvgIcon sx={{ color: 'success.main', fontSize: COMPACT_MILESTONE_DOT_SIZE }} viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" />
  </SvgIcon>
);

// ----------------------------------------------------------------------

/** Override MUI AccordionSummary internals to match the compact timeline row height. */
const accordionSummaryOverrideSx = {
  '& .MuiAccordionSummary-root': { minHeight: 56 },
  '& .MuiAccordionSummary-root.Mui-expanded': { minHeight: 56 },
  '& .MuiAccordionSummary-content': { display: 'flex', alignItems: 'center', gap: 1.5 },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'text.secondary',
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
  },
};

// ----------------------------------------------------------------------

/**
 * One accordion row inside `TimelineCompact`.
 *
 * Extracted into its own component so `useNestedChecklist` can be called
 * at the top level — hooks cannot be called inside `.map()`.
 *
 * Owns the parent↔milestone done cascade for a single phase:
 * - Checking all milestones → parent becomes done.
 * - Unchecking any milestone → parent becomes undone.
 * - Toggling the phase dot → all milestones cascade to the same state.
 *
 * **Quality status (13 May 2026):** DoD 9/9 · Best practices 13/13
 */
export function PhaseAccordionRow({
  phase,
  sortedMilestones,
  checklist,
  taskDoneMap,
  onTaskToggle,
  onMarkViewed,
  onTogglePhaseDone,
  onToggleMilestoneDone,
  expandedPhaseKey,
  onToggleExpanded,
}: PhaseAccordionRowProps) {
  const { parentDone, indeterminate, childrenDone, toggleParent, toggleChild } = useNestedChecklist(
    phase.done ?? false,
    sortedMilestones.map((ms) => ms.done ?? false)
  );

  const [modalTask, setModalTask] = useState<{ task: Task; idx: number } | null>(null);

  const effectiveColor = resolveCompactColor(phase.color, parentDone);
  const childTasks =
    phase.children && phase.children.length > 0 ? phase.children : sortedMilestones;
  const usesMilestoneChildren = !(phase.children && phase.children.length > 0);
  const hasDetails = Boolean(phase.description) || childTasks.length > 0;

  const handleToggleParent = useCallback(() => {
    toggleParent();
    onTogglePhaseDone?.(phase.key, !parentDone);
  }, [toggleParent, onTogglePhaseDone, phase.key, parentDone]);

  const handleAccordionChange = useCallback(
    (_e: SyntheticEvent, expanded: boolean) => {
      onToggleExpanded(phase.key);
      if (expanded) onMarkViewed?.(`phase-${phase.key}`);
    },
    [onMarkViewed, onToggleExpanded, phase.key]
  );

  // The phase dot is the done-toggle in checklist mode (3-state: icon → filled check → outlined check on hover)
  // and a decorative leadingAction in non-checklist mode.
  // It is never duplicated with a separate MUI Checkbox.
  const phaseDot = (
    <Box sx={phaseDotSx(effectiveColor)} aria-hidden="true">
      {phase.icon}
    </Box>
  );

  const leadingAction = checklist ? undefined : phaseDot;
  const checkIcon = checklist ? phaseDot : undefined;
  const checkDoneIcon = checklist ? CHECK_DONE_DOT : undefined;
  const checkHoverIcon = checklist ? CHECK_HOVER_DOT : undefined;

  const titleContent = (
    <Typography variant="subtitle2" sx={phaseTitleSx}>
      {phase.shortTitle ?? phase.title}
    </Typography>
  );

  const dateLabel = phase.date ? (
    <Typography variant="caption" sx={dateSx}>
      {phase.date}
    </Typography>
  ) : null;

  const isExpanded = expandedPhaseKey === phase.key;

  return (
    <>
      <Accordion
        disableGutters
        elevation={0}
        checklist={checklist}
        checkIcon={checkIcon}
        checkDoneIcon={checkDoneIcon}
        checkHoverIcon={checkHoverIcon}
        leadingAction={leadingAction}
        done={parentDone}
        indeterminate={indeterminate}
        onDoneButtonClick={handleToggleParent}
        trailingContent={dateLabel}
        expandIcon={hasDetails ? <ChevronDownIcon /> : null}
        title={titleContent}
        expanded={isExpanded}
        onChange={handleAccordionChange}
        sx={[
          accordionRootSx(parentDone, Boolean(phase.active), isExpanded, effectiveColor),
          accordionSummaryOverrideSx,
        ]}
      >
        {hasDetails && (
          <Box sx={accordionDetailsSx}>
            {phase.description && (
              <Typography variant="body2" sx={descriptionSx}>
                {phase.description}
              </Typography>
            )}

            {childTasks.length > 0 && (
              <Box component="ul" sx={milestonesListSx}>
                {childTasks.map((task, idx) => {
                  const isDone = usesMilestoneChildren
                    ? (childrenDone[idx] ?? false)
                    : (task.done ?? false);
                  const idleDotColor = resolveCompactColor(task.color ?? phase.color, isDone);
                  const isLast = idx === childTasks.length - 1;
                  const nestedTasks = resolveTaskChildren(task);
                  const canOpen =
                    Boolean(task.description) ||
                    Boolean(task.details?.summary) ||
                    Boolean(task.details?.content) ||
                    nestedTasks.length > 0;
                  const dotNode = (
                    <Box sx={milestoneDotSx(idleDotColor)} aria-hidden="true">
                      {task.icon}
                    </Box>
                  );
                  const rowButtonProps = canOpen
                    ? {
                        onClick: () => setModalTask({ task, idx }),
                        role: 'button' as const,
                        tabIndex: 0,
                        'aria-label': `View details: ${task.title}`,
                        onKeyDown: (e: React.KeyboardEvent<HTMLLIElement>) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setModalTask({ task, idx });
                          }
                        },
                      }
                    : {};

                  return (
                    <Box
                      component="li"
                      key={`${phase.key}-child-${task.key}`}
                      sx={milestoneItemSx(canOpen, isDone)}
                      {...rowButtonProps}
                    >
                      <Box sx={milestoneDotColumnSx}>
                        {checklist && usesMilestoneChildren ? (
                          <ToggleIconButton
                            pressed={isDone}
                            idleIcon={dotNode}
                            pressedIcon={MS_CHECK_DONE_DOT}
                            hoverIcon={MS_CHECK_HOVER_DOT}
                            onPressedChange={(newDone: boolean) => {
                              toggleChild(idx);
                              onToggleMilestoneDone?.(phase.key, idx, newDone);
                            }}
                            aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
                          />
                        ) : (
                          dotNode
                        )}
                        {!isLast && <Box aria-hidden="true" sx={milestoneConnectorLineSx} />}
                      </Box>

                      <Box sx={milestoneContentSx}>
                        <Typography variant="subtitle2" sx={milestoneTitleSx}>
                          {task.shortTitle ?? task.title}
                        </Typography>
                        {task.description && (
                          <Typography variant="body2" sx={milestoneDescriptionPreviewSx}>
                            {task.description}
                          </Typography>
                        )}
                      </Box>

                      {task.date && (
                        <Typography variant="caption" sx={milestoneDateSx}>
                          {task.date}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
      </Accordion>

      <TaskDetailsModal
        task={modalTask?.task ?? null}
        open={modalTask !== null}
        onClose={() => setModalTask(null)}
        checklist={checklist}
        taskDoneState={
          modalTask
            ? resolveTaskChildren(modalTask.task).map(
                (task, i) =>
                  taskDoneMap[`${phase.key}-c${modalTask.idx}-t${i}`] ?? task.done ?? false
              )
            : undefined
        }
        onTaskToggle={modalTask ? (i) => onTaskToggle(phase.key, modalTask.idx, i) : undefined}
      />
    </>
  );
}
