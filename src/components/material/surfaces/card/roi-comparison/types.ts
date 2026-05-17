import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface MaterialROIItem {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
}

export interface NonMaterialROIItem {
  label: string;
  /** Qualitative description of the non-material return. */
  value: string;
  icon?: ReactNode;
}

export interface ROIComparisonCardProps {
  title: string;
  materialItems: MaterialROIItem[];
  nonMaterialItems: NonMaterialROIItem[];
  /** Optional bar chart slot for the material column. */
  chart?: ReactNode;
  sx?: SxProps<Theme>;
}
