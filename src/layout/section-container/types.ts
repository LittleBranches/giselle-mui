import type { ContainerProps } from '@mui/material/Container';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface SectionContainerProps extends Omit<ContainerProps, 'maxWidth'> {
  /**
   * MUI `Container` maxWidth. Controls the max-width breakpoint of the section content.
   * @default 'lg'
   */
  maxWidth?: ContainerProps['maxWidth'];
  /**
   * Vertical padding applied to the section via `py` shorthand.
   * Accepts a single value or a responsive object keyed by MUI breakpoints.
   * @default { xs: 8, md: 12 }
   */
  py?: number | Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', number>>;
  /** MUI `sx` override on the root `Container`. */
  sx?: SxProps<Theme>;
}
