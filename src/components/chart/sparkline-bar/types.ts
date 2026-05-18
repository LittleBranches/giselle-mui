import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type SparklineType = 'bar' | 'area' | 'line';

/** Embeddable mini chart passed as the `chart` slot to `StatCard` or `BalanceSummaryCard`. */
export interface SparklineBarChartProps {
  data: number[];
  /** @default 'bar' */
  type?: SparklineType;
  /** MUI palette key for the chart colour. @default 'primary' */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  /** @default 84 */
  width?: number;
  /** @default 56 */
  height?: number;
  sx?: SxProps<Theme>;
}
