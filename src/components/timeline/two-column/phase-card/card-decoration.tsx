import type { CardDecorationProps } from './types';

import Box from '@mui/material/Box';

import { buildCardDecorationGradientSx, phaseCardIconBoxSx } from './phase-card.styles';

/**
 * Decorative gradient shape + corner icon for a PhaseCard.
 *
 * Renders an absolutely-positioned rotating gradient rectangle and a tinted
 * icon in the top-right corner. Both elements use `aria-hidden` — they are
 * purely decorative and must not be announced by screen readers.
 *
 * Receives pre-computed `isOverduePending` to avoid repeating the `&&` logic
 * in the parent and to keep `PhaseCard`'s own Cognitive Complexity below 15.
 */
export function CardDecoration({ color, isOverduePending, icon }: CardDecorationProps) {
  return (
    <>
      <Box aria-hidden sx={buildCardDecorationGradientSx(color, isOverduePending)} />
      <Box aria-hidden="true" sx={phaseCardIconBoxSx(color, isOverduePending)}>
        {icon}
      </Box>
    </>
  );
}
