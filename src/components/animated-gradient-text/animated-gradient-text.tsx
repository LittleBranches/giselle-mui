import Box from '@mui/material/Box';

import {
  ANIMATED_GRADIENT_DEFAULT_COLOR1,
  ANIMATED_GRADIENT_DEFAULT_COLOR2,
  ANIMATED_GRADIENT_DEFAULT_DURATION,
} from './animated-gradient-text.const';
import { gradientTextSx } from './animated-gradient-text.styles';
import type { AnimatedGradientTextProps } from './types';

// ----------------------------------------------------------------------

/**
 * Displays children as continuously animated gradient text.
 *
 * The gradient cycles between `color1` and `color2` using CSS
 * `backgroundPosition` animation — no JavaScript animation loop.
 * Uses `var(--mui-palette-*)` CSS custom properties, so it adapts to
 * light/dark mode automatically.
 *
 * Renders as `<span>` by default; override with the `component` prop.
 *
 * @example
 * ```tsx
 * <Typography variant="h2">
 *   <AnimatedGradientText color1="primary" color2="secondary">
 *     Open Source
 *   </AnimatedGradientText>
 * </Typography>
 * ```
 */
export function AnimatedGradientText({
  children,
  color1 = ANIMATED_GRADIENT_DEFAULT_COLOR1,
  color2 = ANIMATED_GRADIENT_DEFAULT_COLOR2,
  duration = ANIMATED_GRADIENT_DEFAULT_DURATION,
  component = 'span',
  sx,
  ...other
}: AnimatedGradientTextProps) {
  return (
    <Box
      component={component}
      sx={[gradientTextSx(color1, color2, duration), ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {children}
    </Box>
  );
}
