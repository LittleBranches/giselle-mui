import type { SxProps, Theme } from '@mui/material/styles';
import type { CardProps } from '@mui/material/Card';

import type { StatCardColor } from '../../../material/surfaces/card/stat/types';

// ----------------------------------------------------------------------

export type RadialProgressItem = {
  /** Series segment label displayed in the chart and legend. */
  label: string;
  /** Percentage value (0–100) for this segment. */
  value: number;
  /** MUI palette key used to colour this segment and its legend dot. */
  color: StatCardColor;
};

export type RadialProgressCardProps = Omit<CardProps, 'title' | 'children'> & {
  /**
   * Card title shown in the `CardHeader`.
   * Omit to suppress the header entirely.
   */
  title?: string;
  /**
   * Card subheader shown below `title`.
   * Ignored when `title` is not provided.
   */
  subheader?: string;
  /**
   * Number shown in the radial chart centre — typically an aggregate percentage.
   *
   * **Example:** `35` renders as `"35"` with the `totalLabel` below it.
   */
  total: number;
  /**
   * Short label shown below `total` in the chart centre.
   *
   * @default '%'
   */
  totalLabel?: string;
  /**
   * Chart height in pixels.
   *
   * @default 280
   */
  chartHeight?: number;
  /**
   * Array of series items — one radial segment per item.
   * Segments are rendered from outermost (first) to innermost (last).
   */
  series: RadialProgressItem[];
  sx?: SxProps<Theme>;
};
