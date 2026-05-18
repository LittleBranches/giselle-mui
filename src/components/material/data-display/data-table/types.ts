import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface DataTableColumn<K extends string = string> {
  key: K;
  label: string;
  /** Column width as a CSS value, e.g. '120px' or '20%'. */
  width?: string;
  /** @default 'left' */
  align?: 'left' | 'center' | 'right';
}

export interface DataTableRowAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface DataTableProps<K extends string = string> {
  columns: DataTableColumn<K>[];
  rows: Array<Record<K, ReactNode> & { id: string | number }>;
  /** Per-row action menu factory. Receives the row id. */
  renderActions?: (id: string | number) => DataTableRowAction[];
  sx?: SxProps<Theme>;
}
