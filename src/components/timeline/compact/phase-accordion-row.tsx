'use client';

import { useCallback, useState, type SyntheticEvent } from 'react';

import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { Accordion } from '../../accordion';
import { CheckIconButton } from '../../accordion/check-icon-button';
import { useNestedChecklist } from '../../../utils/use-nested-checklist';
import { TaskList } from '../task-list';
import { ChevronDownIcon } from './chevron-down-icon';
import { MilestoneModal } from './milestone-modal';
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
import type { TimelineCompactProps } from './types';
import { resolveCompactColor, resolveTaskChildren } from './utils';
import type { TimelineMilestone, TimelinePhase } from '../two-column/types';

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

export interface PhaseAccordionRowProps {
  phase: TimelinePhase;
  /** Milestones already sorted by the parent (`sortMilestones` applied). */
  sortedMilestones: TimelineMilestone[];
  checklist: boolean;
  taskDoneMap: Record<string, boolean>;
  onTaskToggle: (phaseKey: number, milestoneIdx: number | null, taskIdx: number) => void;
  onMarkViewed?: TimelineCompactProps['onMarkViewed'];
  onTogglePhaseDone?: TimelineCompactProps['onTogglePhaseDone'];
  onToggleMilestoneDone?: TimelineCompactProps['onToggleMilestoneDone'];
  /** Which phase key is currently expanded (from parent — exclusive accordion). */
  expandedPhaseKey: number | null;
  /** Notify parent to toggle this phase's expansion. */
  onToggleExpanded: (key: number) => void;
}

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

  const [modalMilestone, setModalMilestone] = useState<TimelineMilestone | null>(null);

  const effectiveColor = resolveCompactColor(phase.color, parentDone);
  const taskChildren = resolveTaskChildren(phase);
  const hasDetails =
    Boolean(phase.description) || taskChildren.length > 0 || sortedMilestones.length > 0;

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

  return (
    <>
      <Accordion
        disableGutters
        elevation={0}
        checklist={checklist}
        checkIcon={checklist ? phaseDot : undefined}
        checkDoneIcon={checklist ? CHECK_DONE_DOT : undefined}
        checkHoverIcon={checklist ? CHECK_HOVER_DOT : undefined}
        leadingAction={!checklist ? phaseDot : undefined}
        done={parentDone}
        indeterminate={indeterminate}
        onDoneButtonClick={handleToggleParent}
        trailingContent={dateLabel}
        expandIcon={hasDetails ? <ChevronDownIcon /> : null}
        title={titleContent}
        expanded={expandedPhaseKey === phase.key}
        onChange={handleAccordionChange}
        sx={[accordionRootSx(parentDone), accordionSummaryOverrideSx]}
      >
        {hasDetails && (
          <Box sx={accordionDetailsSx}>
            {phase.description && (
              <Typography variant="body2" sx={descriptionSx}>
                {phase.description}
              </Typography>
            )}

            {taskChildren.length > 0 && sortedMilestones.length === 0 && (
              <TaskList
                tasks={taskChildren}
                checklist={checklist}
                taskDoneState={taskChildren.map(
                  (task, i) => taskDoneMap[`${phase.key}-t${i}`] ?? task.done ?? false
                )}
                onTaskToggle={(i) => onTaskToggle(phase.key, null, i)}
              />
            )}

            {sortedMilestones.length > 0 && (
              <Box component="ul" sx={milestonesListSx}>
                {sortedMilestones.map((ms, idx) => {
                  const isMsDone = childrenDone[idx] ?? false;
                  // In non-checklist mode: use the original ms.color (never force success).
                  // resolveCompactColor with done=false maps the raw color to HighlightedPaletteKey
                  // without ever returning 'success' — the idle dot keeps the phase's own colour.
                  const idleDotColor = resolveCompactColor(ms.color, false);
                  const isLast = idx === sortedMilestones.length - 1;

                  // Idle milestone dot: original color, original icon, smaller than phase dot.
                  const msDotIdle = (
                    <Box sx={milestoneDotSx(idleDotColor)} aria-hidden="true">
                      {ms.icon}
                    </Box>
                  );

                  return (
                    <Box
                      component="li"
                      key={`${phase.key}-ms-${idx}`}
                      sx={milestoneItemSx}
                      onClick={() => setModalMilestone(ms)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details: ${ms.title}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setModalMilestone(ms);
                        }
                      }}
                    >
                      {/* Dot column: circle (or 3-state CheckIconButton) + vertical connector */}
                      <Box sx={milestoneDotColumnSx}>
                        {checklist ? (
                          <CheckIconButton
                            done={isMsDone}
                            checkIcon={msDotIdle}
                            checkDoneIcon={MS_CHECK_DONE_DOT}
                            checkHoverIcon={MS_CHECK_HOVER_DOT}
                            onDoneButtonClick={(newDone) => {
                              toggleChild(idx);
                              onToggleMilestoneDone?.(phase.key, idx, newDone);
                            }}
                          />
                        ) : (
                          msDotIdle
                        )}
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
          </Box>
        )}
      </Accordion>

      <MilestoneModal
        milestone={modalMilestone}
        open={modalMilestone !== null}
        onClose={() => setModalMilestone(null)}
      />
    </>
  );
}
