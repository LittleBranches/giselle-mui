import Box from '@mui/material/Box';

import { checkPop } from '../animations';
import { doneCheckmarkSx } from './timeline-dot.styles';
import type { DotInnerProps } from './types';

// ----------------------------------------------------------------------

export function DotInner({ done, icon, animationKey, iconSize }: DotInnerProps) {
  if (done) {
    return (
      <Box
        key={animationKey}
        component="svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        sx={doneCheckmarkSx(iconSize)}
      >
        <polyline points="20 6 9 17 4 12" />
      </Box>
    );
  }
  return (
    <Box
      key={animationKey}
      sx={[
        {
          display: 'flex',
        },
        animationKey > 0
          ? {
              animation: `${checkPop} 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)`,
            }
          : false,
      ]}
    >
      {icon}
    </Box>
  );
}
