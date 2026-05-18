import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ProjectionDataPoint {
  label: string;
  value: number;
}

export interface ProjectionCardProps {
  title: string;
  /** Actual cost series — grows as spend is recorded. */
  actualSeries: ProjectionDataPoint[];
  /** Projected return series — derived from the investment model. */
  projectedSeries: ProjectionDataPoint[];
  xAxisLabel?: string;
  currency?: string;
  /** Renders a vertical annotation at the break-even crossing point. @default true */
  breakEvenAnnotation?: boolean;
  sx?: SxProps<Theme>;
}
