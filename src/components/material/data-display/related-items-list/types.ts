import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface RelatedItemStat {
  label: string;
  value: string | number;
}

export interface RelatedItem {
  id: string;
  name: string;
  subLabel?: string;
  icon?: ReactNode;
  stats: RelatedItemStat[];
}

export interface RelatedItemsListProps {
  /** Tab labels — one tab per category, matched by index to itemsByTab. */
  tabs: string[];
  /** Items per tab, indexed to match the tabs array. */
  itemsByTab: RelatedItem[][];
  sx?: SxProps<Theme>;
}
