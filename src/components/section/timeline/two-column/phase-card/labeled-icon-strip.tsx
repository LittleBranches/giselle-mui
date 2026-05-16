import type { LabeledIconStripProps } from './types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { labeledIconStripLabelSx } from './phase-card.styles';

/**
 * A labelled group: an optional overline label above any icon/logo strip.
 * Handles the repeated pattern across platforms, clients, and projects.
 */
export function LabeledIconStrip({ label, children }: LabeledIconStripProps) {
  return (
    <Box sx={{ mt: 2.5 }}>
      {label && (
        <Typography variant="overline" sx={labeledIconStripLabelSx}>
          {label}
        </Typography>
      )}
      {children}
    </Box>
  );
}
