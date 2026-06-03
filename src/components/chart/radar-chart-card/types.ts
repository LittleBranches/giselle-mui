import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface RadarSeriesItem {
  name: string;
  data: number[];
}

export interface RadarChartCardProps {
  title: string;
  subheader?: string;
  series: RadarSeriesItem[];
  categories: string[];
  sx?: SxProps<Theme>;
}
