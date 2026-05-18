import type { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material/Breadcrumbs';

// ----------------------------------------------------------------------

export interface BreadcrumbItem {
  label: string;
  /** When provided, renders the item as a link. */
  href?: string;
}

export interface BreadcrumbsProps extends Omit<MuiBreadcrumbsProps, 'children'> {
  items: BreadcrumbItem[];
}
