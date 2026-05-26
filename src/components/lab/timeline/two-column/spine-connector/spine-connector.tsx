import type { SpineConnectorProps } from './types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { yearLabelSx } from './spine-connector.styles';

// Re-export — keeps `import { SpineConnectorProps } from './spine-connector'` working.
export type { SpineConnectorProps } from './types';

/**
 * Vertical connector line drawn between consecutive phase rows.
 *
 * Renders as a thin coloured bar that grows to fill the available height between dots.
 * When a year boundary falls between two phases, a floating year-chip label is
 * overlaid at the bottom of the line.
 */
export function SpineConnector({
  dotColor,
  yearMilestone,
  yearLabelMarginBottom = 50,
  sx,
  ...other
}: SpineConnectorProps) {
  return (
    <Box
      {...other}
      sx={[
        (theme) => ({
          display: 'flex',
          flexGrow: 1,
          minHeight: 24,
          width: 2,
          position: 'relative',
          bgcolor: `rgba(${
            theme.vars!.palette[dotColor]?.mainChannel ??
            (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
          } / 0.3)`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {yearMilestone && (
        <Typography variant="caption" sx={yearLabelSx(yearLabelMarginBottom)}>
          {yearMilestone}
        </Typography>
      )}
    </Box>
  );
}
