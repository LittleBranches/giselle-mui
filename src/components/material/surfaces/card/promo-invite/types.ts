import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface PromoInviteCardProps {
  title: string;
  description?: string;
  /** Placeholder text for the email input. @default 'Enter your email' */
  inputPlaceholder?: string;
  /** Submit button label. @default 'Invite Now' */
  submitLabel?: string;
  onSubmit?: (email: string) => void;
  sx?: SxProps<Theme>;
}
