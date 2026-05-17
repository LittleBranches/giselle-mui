import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type CostCategory = 'capex' | 'opex' | 'investment' | 'opportunity';

export interface CostClassificationItem {
  label: string;
  amount: number;
  /** Consumer-defined category. Common values: capex / opex / investment / opportunity. */
  category: CostCategory | string;
  /** When set, renders an 'Amortized over N months' note below the label. */
  amortizedMonths?: number;
  /** MUI palette key for the category chip colour. @default 'primary' */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

export interface CostClassificationCardProps {
  title: string;
  items: CostClassificationItem[];
  /** Label beside the total, e.g. 'Total investment'. */
  totalLabel?: string;
  currency?: string;
  sx?: SxProps<Theme>;
}
