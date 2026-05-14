import type React from 'react';
import type { MotionProps } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

export type MotionContainerProps = Omit<BoxProps, 'animate' | 'children'> &
  Omit<MotionProps, 'children'> & {
    /**
     * When `action` is `false` (default), the container always animates in.
     * When `action` is `true`, use the `animate` prop to toggle between
     * the `'animate'` and `'exit'` states.
     * @default false
     */
    action?: boolean;
    /** Controls playback when `action` is `true`. @default false */
    animate?: boolean;
    children?: React.ReactNode;
  };
