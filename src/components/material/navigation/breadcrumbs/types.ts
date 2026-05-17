import type { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material/Breadcrumbs';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface BreadcrumbItem {
  label: string;
  /** When provided, renders the item as a link. */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<MuiBreadcrumbsProps, 'children'> {
  items: BreadcrumbItem[];
  sx?: SxProps<Theme>;
}
