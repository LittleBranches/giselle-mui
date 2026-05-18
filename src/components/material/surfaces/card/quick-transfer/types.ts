import type { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

export interface QuickTransferContact {
  id: string;
  name: string;
  avatarSrc?: string;
}

export interface QuickTransferCardProps extends Omit<PaperProps, 'children'> {
  contacts: QuickTransferContact[];
  /** Formatted balance to display, e.g. '$5,000'. */
  balance?: string;
  /** @default 'Transfer now' */
  submitLabel?: string;
  onTransfer?: (contactId: string, amount: string) => void;
}
