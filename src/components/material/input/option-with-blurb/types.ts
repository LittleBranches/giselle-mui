import type { ReactNode } from 'react';
import type { RadioProps } from '@mui/material/Radio';

// ----------------------------------------------------------------------

/** Radio option card with a label, optional icon, and a descriptive blurb. */
export interface OptionWithBlurbProps extends Omit<RadioProps, 'children'> {
  label: string;
  description?: string;
  /** Optional icon slot shown beside the label. */
  icon?: ReactNode;
}
