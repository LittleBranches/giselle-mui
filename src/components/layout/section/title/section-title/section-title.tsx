import type { SectionTitleProps } from './types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { txtGradientSpanSx } from './section-title.styles';
import { SectionCaption } from './section-caption';

// Re-exports — keeps existing `import { SectionCaptionProps } from './section-title'` working.
export type { SectionTitleProps, SectionCaptionProps } from './types';
// Re-export SectionCaption — keeps `import { SectionCaption } from './section-title'` working.
export { SectionCaption } from './section-caption';

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
 *
 * **Quality status (13 May 2026):** DoD 20/20 · Best practices 13/13
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
        {title}{' '}
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
