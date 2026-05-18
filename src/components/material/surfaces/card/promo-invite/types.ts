import type { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

export interface PromoInviteCardProps extends Omit<PaperProps, 'children' | 'onSubmit'> {
  title: string;
  description?: string;
  /** Placeholder text for the email input. @default 'Enter your email' */
  inputPlaceholder?: string;
  /** Submit button label. @default 'Invite Now' */
  submitLabel?: string;
  onSubmit?: (email: string) => void;
}
