import Box from '@mui/material/Box';

import type { TimelinePhase } from '../types';
import { ganttTrackSx, ganttBarSx } from './phase-warning-popover.styles';
import type { MiniGanttRulerProps } from './types';

// ----------------------------------------------------------------------

/** Resolve phase color to a valid MUI Slider color prop value. */
export function resolveSliderColor(
  color: TimelinePhase['color']
): 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  if (!color || color === 'inherit' || color === 'grey') return 'primary';
  return color as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

// ----------------------------------------------------------------------

/** Mini read-only Gantt ruler showing all conflicting phases on a shared time axis. */
export function MiniGanttRuler({ axis, conflictingPhases, overrides }: MiniGanttRulerProps) {
  const span = axis.max - axis.min;
  if (span <= 0) return null;

  const rangeList = Array.from(overrides.entries());

  return (
    <Box aria-hidden sx={ganttTrackSx}>
      {conflictingPhases.map((phase) => {
        const override = overrides.get(phase.key);
        if (!override) return null;
        const leftPct = ((override.startIdx - axis.min) / span) * 100;
        const widthPct = Math.max(1, ((override.endIdx - override.startIdx) / span) * 100);
        const sliderColor = resolveSliderColor(phase.color);

        const isOverlapping = rangeList.some(
          ([otherKey, other]) =>
            otherKey !== phase.key &&
            override.startIdx <= other.endIdx &&
            other.startIdx <= override.endIdx
        );

        return (
          <Box key={phase.key} sx={ganttBarSx(leftPct, widthPct, isOverlapping, sliderColor)} />
        );
      })}
    </Box>
  );
}
