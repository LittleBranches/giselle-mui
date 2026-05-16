import type { MarkerLabelProps } from './types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { markerCaptionSx, markerDateSpanSx } from './two-column.styles';

// ----------------------------------------------------------------------

/**
 * Floating text label for a `variant='marker'` phase row.
 *
 * Renders a semi-bold caption with an optional inline date, separated by a middle dot.
 * Used in both the left and right label slots of `MarkerRow` — extracted to eliminate
 * duplicated JSX and ensure the label format is always consistent across both slots.
 */
export function MarkerLabel({ title, date }: MarkerLabelProps) {
  return (
    <Typography variant="caption" sx={markerCaptionSx}>
      {title}
      {date && (
        <Box component="span" sx={markerDateSpanSx}>
          · {date}
        </Box>
      )}
    </Typography>
  );
}
