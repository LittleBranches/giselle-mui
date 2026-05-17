import type { ReactNode } from 'react';
import type { PaperProps } from '@mui/material/Paper';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ChartCardBaseProps extends Omit<PaperProps, 'title' | 'children'> {
  title: string;
  subheader?: string;
  /** Year filter or other header control rendered beside the title. */
  action?: ReactNode;
  /** Chart body — any ReactNode chart element. */
  chart: ReactNode;
  /** Optional footer below the chart area (e.g. legend, totals row). */
  footer?: ReactNode;
  /** When true, renders a centred loading skeleton instead of the chart slot. */
  loading?: boolean;
  sx?: SxProps<Theme>;
}
