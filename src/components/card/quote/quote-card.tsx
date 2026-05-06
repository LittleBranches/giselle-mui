import type { QuoteCardProps } from './types';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { quoteMarkSx, quoteTextSx } from './quote-card.styles';

// Re-exports — keeps `import { QuoteCardProps } from './quote-card'` working.
export type { QuoteCardProps } from './types';

/**
 * A warm, readable block-quote card built on MUI Paper.
 *
 * Extends `PaperProps` — callers can pass `elevation` for shadow depth and
 * `variant="outlined"` to switch to a border-only surface.
 * Colors are driven by MUI CSS variables so it adapts to light/dark mode and
 * any custom theme without additional configuration.
 *
 * **Theming via sx:**
 * ```tsx
 * <QuoteCard sx={{ borderRadius: 4, p: 4 }} ... />
 * ```
 *
 * **Theming via elevation:**
 * ```tsx
 * <QuoteCard elevation={4} ... />
 * ```
 *
 * **Theming via color:**
 * ```tsx
 * <QuoteCard color="info" ... />
 * ```
 *
 * @example
 * <QuoteCard
 *   quote="Leave every file a little better than you found it."
 *   author="Jane Smith"
 *   source="Platform Team"
 *   elevation={0}
 * />
 */
export function QuoteCard({
  quote,
  author,
  source,
  color = 'primary',
  elevation = 0,
  sx,
  ...other
}: QuoteCardProps) {
  return (
    <Paper
      elevation={elevation}
      sx={[
        (theme) => ({
          p: 3,
          borderRadius: 2,
          bgcolor: `rgba(${theme.vars!.palette[color].mainChannel} / 0.06)`,
          border: `1px solid rgba(${theme.vars!.palette[color].mainChannel} / 0.12)`,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left column — decorative opening quote mark */}
        <Typography aria-hidden sx={quoteMarkSx(color)}>
          {'\u201C'}
        </Typography>

        {/* Right column — quote text + attribution */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" sx={quoteTextSx}>
            {quote}
          </Typography>

          {(author || source) && (
            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              sx={{ mt: 2, color: 'text.disabled' }}
            >
              {author && (
                <Typography variant="caption" sx={{ fontWeight: 'fontWeightMedium' }}>
                  {author}
                </Typography>
              )}

              {author && source && (
                <Typography variant="caption" aria-hidden sx={{ opacity: 0.6 }}>
                  {'·'}
                </Typography>
              )}

              {source && (
                <Typography variant="caption" sx={{ opacity: 0.72 }}>
                  {source}
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
