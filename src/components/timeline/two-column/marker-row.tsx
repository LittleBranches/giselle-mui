import type { MarkerRowProps } from './types';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { MarkerLabel } from './marker-label';
import { SpineConnector } from './spine-connector';
import { TimelineDot } from './timeline-dot';
import { resolvePhaseTooltip } from './utils';
import {
  markerPhaseLiSx,
  markerRowInnerSx,
  markerLeftLabelSx,
  markerCenterSx,
  markerRightLabelSx,
} from './two-column.styles';

// ----------------------------------------------------------------------

/**
 * Renders a single marker-variant phase row.
 *
 * `variant='marker'` entries are spine-only: a dot and a floating label, no card.
 * The label floats to whichever side `phase.side` specifies — direct, not inverted
 * like full phase cards. Used for single point-in-time events that do not warrant
 * a full phase card — e.g. a certification date, a visa grant, a birthday.
 *
 * **Mobile collapse (`isMobile=true`):** The left label slot is hidden at xs via CSS.
 * When `isMobile` is `true`, the right slot also renders the label for `side='left'`
 * phases so the label is always visible on mobile, mirroring the column-collapse
 * behaviour of full phase cards.
 */
export function MarkerRow({
  phase,
  isLastPhase,
  dotColor,
  isDone,
  checklist,
  yearLabelValue,
  isMobile,
  ...other
}: MarkerRowProps) {
  // Use resolvePhaseTooltip so the marker tooltip is consistent with all other
  // phase dots: description preview → shortTitle + date → title fallback.
  const markerTooltip = resolvePhaseTooltip(checklist, dotColor, isDone, phase);
  // Right slot renders for any non-left phase, or for any phase when on mobile
  // (left slot is hidden via CSS at xs; right slot provides the visible label).
  const shouldShowRightLabel = phase.side !== 'left' || isMobile;

  return (
    <Box component="li" data-testid="tl-item" sx={markerPhaseLiSx} {...other}>
      <Box sx={markerRowInnerSx}>
        {/* Left label — shown when side === 'left'; hidden at xs via CSS */}
        <Box sx={markerLeftLabelSx}>
          {phase.side === 'left' && (
            <MarkerLabel title={phase.shortTitle ?? phase.title} date={phase.date} />
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

        {/* Right label — receives all labels on mobile (shouldShowRightLabel=true when isMobile) */}
        <Box sx={markerRightLabelSx}>
          {shouldShowRightLabel && (
            <MarkerLabel title={phase.shortTitle ?? phase.title} date={phase.date} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
