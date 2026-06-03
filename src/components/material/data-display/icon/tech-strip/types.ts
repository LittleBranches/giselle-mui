import type { ReactNode } from 'react';

import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

/** One icon + label pair in a TechIconStrip. */
export interface TechIconItem {
  /** Icon node — any `ReactNode` (GiselleIcon, SVG, `<img>`, etc.). */
  icon: ReactNode;
  /**
   * Display label shown below the icon.
   * Must be unique within the `items` array — used as the React list key.
   */
  label: string;
}

export interface TechIconStripProps extends Omit<BoxProps, 'children' | 'title'> {
  /** Array of icon + label pairs to display. */
  items: TechIconItem[];
  /** Optional section heading rendered above the strip as `overline` text. */
  heading?: string;
  /**
   * When `true`, items wrap around the horizontal centre rather than
   * left-aligning to the container edge.
   * @default false
   */
  centeredWrap?: boolean;
}
