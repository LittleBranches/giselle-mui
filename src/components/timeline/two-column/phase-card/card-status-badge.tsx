import type { ScenarioBadgeProps, CardStatusBadgeProps } from './types';

import Typography from '@mui/material/Typography';

import { scenarioBadgeSx } from './phase-card.styles';

/**
 * Pill label for scenario-variant phase cards.
 * Rendered by `CardStatusBadge` — not used directly in `PhaseCard`.
 */
function ScenarioBadge({ color, scenarioLabel }: ScenarioBadgeProps) {
  return (
    <Typography variant="overline" sx={scenarioBadgeSx(color)}>
      {scenarioLabel}
    </Typography>
  );
}

/**
 * Status badge rendered at the top of a PhaseCard.
 *
 * Currently only the scenario badge variant is active; active/new badges were
 * removed to stabilise card height and may be reinstated in a future iteration.
 * Returns `null` when the phase has no active status badge.
 */
export function CardStatusBadge({ color, isScenario, scenarioLabel }: CardStatusBadgeProps) {
  if (!isScenario || !scenarioLabel) return null;
  return <ScenarioBadge color={color} scenarioLabel={scenarioLabel} />;
}
