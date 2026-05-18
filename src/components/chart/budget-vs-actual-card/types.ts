import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface BudgetDataPoint {
  label: string;
  value: number;
}

export interface BudgetVsActualCardProps {
  title: string;
  /** Static budget — values are fixed at period start. */
  plannedSeries: BudgetDataPoint[];
  /** Actual spend — grows as real spend is recorded. */
  actualSeries: BudgetDataPoint[];
  /** X-axis category label, e.g. 'Week' or 'Month'. */
  xAxisLabel?: string;
  /** ISO 4217 currency code, e.g. 'AUD'. */
  currency?: string;
  /** When true renders cumulative totals; when false renders period deltas. @default false */
  cumulativeMode?: boolean;
  sx?: SxProps<Theme>;
}
