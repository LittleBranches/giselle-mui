import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface PricingFeature {
  label: string;
  /** When false renders a cross icon instead of a check. @default true */
  included?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  /** Pre-formatted price string, e.g. '$0' or '$29'. */
  price: string;
  /** Billing period label, e.g. 'per month'. */
  period?: string;
  description?: string;
  features: PricingFeature[];
  cta: string;
  ctaHref?: string;
  /** Highlights this plan as recommended with a visual accent. @default false */
  highlighted?: boolean;
}

export interface PricingSectionProps extends Omit<BoxProps, 'children'> {
  caption?: string;
  title?: string;
  txtGradient?: string;
  plans: PricingPlan[];
  /** Billing period toggle slot (e.g. monthly/annual switch). */
  billingToggle?: ReactNode;
  sx?: SxProps<Theme>;
}
