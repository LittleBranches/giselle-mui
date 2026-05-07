import type { MarkerRowProps } from './types';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { SpineConnector } from './spine-connector';
import { TimelineDot } from './timeline-dot';
import { resolvePhaseTooltip } from './utils';
import {
  markerPhaseLiSx,
  markerRowInnerSx,
  markerLeftLabelSx,
  markerCenterSx,
  markerRightLabelSx,
  markerCaptionSx,
  markerDateSpanSx,
} from './two-column.styles';

// ----------------------------------------------------------------------

/**
 * Renders a single marker-variant phase row.
 *
 * `variant='marker'` entries are spine-only: a dot and a floating label, no card.
 * The label floats to whichever side `phase.side` specifies (direct, not inverted
 * like full phase cards). Used for single point-in-time events that do not warrant
 * a full phase card — e.g. a certification date, a visa grant, a birthday.
 */
export function MarkerRow({
  phase,
  isLastPhase,
  dotColor,
  isDone,
  checklist,
  yearLabelValue,
  isMobile,
}: MarkerRowProps) {
  // Use resolvePhaseTooltip so the marker tooltip is consistent with all other
  // phase dots: description preview → shortTitle + date → title fallback.
  const markerTooltip = resolvePhaseTooltip(checklist, dotColor, isDone, phase);

  return (
    <Box component="li" data-testid="tl-item" sx={markerPhaseLiSx}>
      <Box sx={markerRowInnerSx}>
        {/* Left label — shown when side === 'left' */}
        <Box sx={markerLeftLabelSx}>
          {phase.side === 'left' && (
            <Typography variant="caption" sx={markerCaptionSx}>
              {phase.shortTitle ?? phase.title}
              {phase.date && (
                <Box component="span" sx={markerDateSpanSx}>
                  · {phase.date}
                </Box>
              )}
            </Typography>
          )}
        </Box>

        {/* Spine dot */}
        <Box data-col="center" sx={markerCenterSx}>
          <Tooltip title={markerTooltip} placement="top" arrow>
            <span>
              <TimelineDot icon={phase.icon} color={dotColor} size="milestone" done={isDone} />
            </span>
          </Tooltip>
          {!isLastPhase && <SpineConnector dotColor={dotColor} yearMilestone={yearLabelValue} />}
        </Box>

        {/* Right label — always visible on mobile; receives all labels when isMobile=true */}
        <Box sx={markerRightLabelSx}>
          {(phase.side !== 'left' || isMobile) && (
            <Typography variant="caption" sx={markerCaptionSx}>
              {phase.shortTitle ?? phase.title}
              {phase.date && (
                <Box component="span" sx={markerDateSpanSx}>
                  · {phase.date}
                </Box>
              )}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
