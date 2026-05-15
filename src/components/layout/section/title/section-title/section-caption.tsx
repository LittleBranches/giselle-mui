import Box from '@mui/material/Box';

import type { SectionCaptionProps } from './types';

// ----------------------------------------------------------------------

/**
 * `SectionCaption` renders the overline label above the section heading.
 * Exported so consumers can use it standalone when they need just the overline.
 *
 * **Quality status (13 May 2026):** DoD 9/9 · Best practices 13/13
 */
export function SectionCaption({ title, sx, ...other }: SectionCaptionProps) {
  return (
    <Box
      component="span"
      sx={[
        {
          typography: 'overline',
          color: 'text.disabled',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {title}
    </Box>
  );
}
