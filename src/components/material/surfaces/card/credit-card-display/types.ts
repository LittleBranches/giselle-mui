import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface CreditCardDisplayProps {
  /** Full card number — only the last 4 digits are displayed; the rest are masked. */
  cardNumber: string;
  cardHolder: string;
  /** Expiry date string, e.g. '08/26'. */
  expiry: string;
  /** Card network logo slot — pass an `<img>` or SVG ReactNode (Visa, Mastercard, etc.). */
  networkLogo?: ReactNode;
  sx?: SxProps<Theme>;
}
