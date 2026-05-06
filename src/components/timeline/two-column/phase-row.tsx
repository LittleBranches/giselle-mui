import type { PhaseRowProps } from './types';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { SpineConnector } from './spine-connector';
import { TimelineColumn } from './timeline-column';
import { TimelineDot } from './timeline-dot';
import { resolvePhaseTooltip, buildPhaseDotTsxProps } from './utils';
import {
  phaseRowSx,
  centerColumnSx,
  floatingDatePillSx,
  phaseDotWrapperSx,
} from './two-column.styles';

// ----------------------------------------------------------------------

/**
 * Renders the phase-level row within a phase `<li>`.
 *
 * Contains three columns:
 * - Left card column — `phaseCardNode` when `phase.side === 'left'`
 * - Centre dot column — `TimelineDot` + optional `SpineConnector`
 * - Right card column — `phaseCardNode` when `phase.side === 'right'`
 *
 * `phaseCardNode` is pre-built by the parent (`TimelineTwoColumn`) and passed
 * through as a slot — it carries its own event handlers via closure.
 */
export function PhaseRow({
  phase,
  isSuppressed,
  phaseCardGap,
  phaseCardNode,
  dotColor,
  isDone,
  isLastPhase,
  yearLabelValue,
  yearLabelMarginBottom,
  checklist,
  dotClickAction,
  dotKeyDownHandler,
  dotAriaLabel,
  phaseToggleCounts,
  selectedPhaseKey,
}: PhaseRowProps) {
  return (
    <Box sx={phaseRowSx(isSuppressed)}>
      {/* Left column — shows cards for phases with side === 'left' */}
      <TimelineColumn
        columnSide="left"
        hasContent={phase.side === 'left'}
        bottomPadding={phaseCardGap}
      >
        {phase.side === 'left' && phaseCardNode}
      </TimelineColumn>

      {/* Centre: phase dot + spine */}
      <Box data-col="center" sx={centerColumnSx}>
        {/* Dot wrapper: relative so the date pill can float above without affecting layout */}
        <Box sx={phaseDotWrapperSx}>
          {!phase.hideDate && phase.date && (
            <Typography variant="caption" aria-hidden sx={floatingDatePillSx}>
              {phase.date}
            </Typography>
          )}
          <Tooltip
            title={resolvePhaseTooltip(checklist, dotColor, isDone, phase)}
            placement="top"
            arrow
          >
            <span>
              <TimelineDot
                icon={phase.icon}
                color={dotColor}
                size="phase"
                {...buildPhaseDotTsxProps(
                  phase,
                  checklist,
                  isDone,
                  dotAriaLabel,
                  phaseToggleCounts,
                  selectedPhaseKey
                )}
                onClick={dotClickAction}
                onKeyDown={dotKeyDownHandler}
              />
            </span>
          </Tooltip>
        </Box>
        {/* SpineConnector spans the full li height — milestone dots overlay it at % positions */}
        {!isLastPhase && (
          <SpineConnector
            dotColor={dotColor}
            yearMilestone={yearLabelValue}
            yearLabelMarginBottom={yearLabelMarginBottom}
          />
        )}
      </Box>

      {/* Right column — shows cards for phases with side === 'right' */}
      <TimelineColumn
        columnSide="right"
        hasContent={phase.side === 'right'}
        bottomPadding={phaseCardGap}
      >
        {phase.side === 'right' && phaseCardNode}
      </TimelineColumn>
    </Box>
  );
}
