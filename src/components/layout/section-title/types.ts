import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

type TextSlotProps = {
  sx?: SxProps<Theme>;
};

export type SectionTitleProps = Omit<BoxProps, 'title'> & {
  /**
   * Optional gradient accent word appended to `title`.
   * Rendered with reduced opacity and a horizontal gradient that fades from
   * `text.primary` to a 20% alpha of the same channel.
   */
  txtGradient?: string;
  /** Main heading text. Rendered as an `h2`. */
  title: ReactNode;
  /**
   * Short overline label rendered above the heading.
   * Styled as `overline` typography in `text.disabled` colour.
   */
  caption?: ReactNode;
  /**
   * Supporting description text rendered below the heading.
   * Styled as `body1` in `text.secondary` colour.
   */
  description?: ReactNode;
  /**
   * `sx` overrides for individual text slots.
   */
  slotProps?: {
    title?: TextSlotProps;
    caption?: TextSlotProps;
    description?: TextSlotProps;
  };
};

export type SectionCaptionProps = {
  title: ReactNode;
  sx?: SxProps<Theme>;
};
