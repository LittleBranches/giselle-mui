import type { ScenarioBadgeProps } from './types';

import Typography from '@mui/material/Typography';

import { scenarioBadgeSx } from './phase-card.styles';

// ----------------------------------------------------------------------

/**
 * Pill label for scenario-variant phase cards.
 * Rendered by `CardStatusBadge` — not used directly in `PhaseCard`.
 */
export function ScenarioBadge({ color, scenarioLabel }: ScenarioBadgeProps) {
  return (
    <Typography variant="overline" sx={scenarioBadgeSx(color)}>
      {scenarioLabel}
    </Typography>
  );
}
