import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { txtGradientSpanSx } from './section-title.styles';

// ----------------------------------------------------------------------

type TextSlotProps = {
  sx?: SxProps<Theme>;
};

export type SectionTitleProps = BoxProps & {
  /**
   * Optional gradient accent word appended to `title`.
   * Rendered with reduced opacity and a horizontal gradient that fades from
   * `text.primary` to a 20% alpha of the same channel.
   */
  txtGradient?: string;
  /** Main heading text. Rendered as an `h2`. */
  title: React.ReactNode;
  /**
   * Short overline label rendered above the heading.
   * Styled as `overline` typography in `text.disabled` colour.
   */
  caption?: React.ReactNode;
  /**
   * Supporting description text rendered below the heading.
   * Styled as `body1` in `text.secondary` colour.
   */
  description?: React.ReactNode;
  /**
   * `sx` overrides for individual text slots.
   */
  slotProps?: {
    title?: TextSlotProps;
    caption?: TextSlotProps;
    description?: TextSlotProps;
  };
};

/**
 * `SectionTitle` renders a stacked heading group: optional overline caption,
 * an `h2` heading with an optional gradient accent word, and an optional
 * description paragraph.
 *
 * ## Usage
 *
 * ```tsx
 * <SectionTitle
 *   caption="What we offer"
 *   title="Build better"
 *   txtGradient="faster"
 *   description="A set of tools that removes boilerplate and encodes best practices."
 * />
 * ```
 *
 * ## Gradient accent
 * The `txtGradient` word is appended after `title` and rendered with a
 * `text.primary → text.primary @20%` left-to-right gradient. In dark mode
 * `text.primary` resolves to near-white, giving a natural fade-out.
 */
export function SectionTitle({
  sx,
  title,
  caption,
  slotProps,
  txtGradient,
  description,
  ...other
}: SectionTitleProps) {
  return (
    <Box
      sx={[
        {
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {caption && <SectionCaption title={caption} sx={slotProps?.caption?.sx} />}

      <Typography component="h2" variant="h2" sx={slotProps?.title?.sx}>
        {`${title} `}
        {txtGradient && (
          <Box component="span" sx={txtGradientSpanSx}>
            {txtGradient}
          </Box>
        )}
      </Typography>

      {description && (
        <Box
          sx={[
            { color: 'text.secondary', typography: 'body1' },
            ...(Array.isArray(slotProps?.description?.sx)
              ? slotProps.description.sx
              : [slotProps?.description?.sx]),
          ]}
        >
          {description}
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

type SectionCaptionProps = {
  title: React.ReactNode;
  sx?: SxProps<Theme>;
};

/**
 * `SectionCaption` renders the overline label above the section heading.
 * Exported so consumers can use it standalone when they need just the overline.
 */
export function SectionCaption({ title, sx, ...other }: SectionCaptionProps) {
  return (
    <Box
      component="span"
      sx={[
        {
          typography: 'overline',
          color: 'text.disabled',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {title}
    </Box>
  );
}
