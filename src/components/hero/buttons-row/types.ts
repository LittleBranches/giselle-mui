import type { BoxProps } from '@mui/material/Box';
import type { MotionProps } from 'framer-motion';

// ----------------------------------------------------------------------

export type HeroButtonItem = {
  /** Button label text. */
  label: string;
  /** Navigation target passed to MUI `Button` as `href`. */
  href: string;
  /**
   * MUI Button variant.
   * @default 'contained'
   */
  variant?: 'contained' | 'outlined' | 'text';
};

export type HeroButtonsRowProps = Omit<BoxProps, 'children'> & {
  /** Ordered list of button items to render. */
  items: HeroButtonItem[];
  /**
   * framer-motion props forwarded to the `motion.div` wrapper around each button.
   * Use variant-based animation (`variants`, `initial`, `animate`) or explicit
   * spring values here.
   */
  motionProps?: MotionProps;
};
