import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface DonutChartCardProps {
  title: string;
  subheader?: string;
  series: number[];
  labels: string[];
  /** Total displayed in the chart centre. When omitted, renders the sum of series. */
  total?: number;
  sx?: SxProps<Theme>;
}
