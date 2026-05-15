import type React from 'react';
import type { MotionProps } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

export type MotionViewportProps = Omit<BoxProps, 'animate' | 'children'> &
  Omit<MotionProps, 'children'> & {
    /**
     * Disable the scroll-triggered animation on `sm` and below.
     * On small screens the section is often already fully visible on mount,
     * making the stagger animation jarring rather than pleasant.
     * @default true
     */
    disableAnimateOnMobile?: boolean;
    children?: React.ReactNode;
  };
