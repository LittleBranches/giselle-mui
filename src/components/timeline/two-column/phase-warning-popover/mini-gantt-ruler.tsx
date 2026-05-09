import Box from '@mui/material/Box';

import { ganttTrackSx, ganttBarSx } from './phase-warning-popover.styles';
import type { MiniGanttRulerProps } from './types';
import { resolveSliderColor } from './utils';

// Re-export — keeps `import { resolveSliderColor } from './mini-gantt-ruler'` working.
export { resolveSliderColor } from './utils';

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
