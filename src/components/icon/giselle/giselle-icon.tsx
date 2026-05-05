import type { IconProps } from '@iconify/react';
import type { Theme, SxProps } from '@mui/material/styles';

import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';

import { giselleIconRootSx } from './giselle-icon.styles';

// ----------------------------------------------------------------------
//
// WHY THIS COMPONENT EXISTS
//
// Many MUI projects use Iconify for icons. Adding MUI `sx` support to
// `@iconify/react`'s `Icon` component is non-trivial:
//
//   `Box component={Icon}` fails TypeScript. `@iconify/react` types its
//   `display` prop as `string | number`, which is incompatible with MUI Box's
//   `display: ResponsiveStyleValue<Display | ...>`. TypeScript rejects the
//   call with a "no overload matches" error across both Box overloads.
//
// The fix: a `Box component="span"` owns the MUI `sx` layer, and the inner
// `Icon` renders the SVG. The span uses `display: inline-flex; line-height: 0`
// to remove the default inline baseline gap that otherwise shifts icon
// alignment inside flex/grid containers.
//
// SLOT PATTERN
//
// Library components accept icons as `ReactNode` slots — they do not import
// any icon library directly. GiselleIcon is the recommended slot filler.
//
//   MetricCard.icon       → ReactNode → fill with <GiselleIcon ... />
//   MetricCard.decoration → ReactNode → fill with <MetricCardDecoration ... />
//
// ----------------------------------------------------------------------

/**
 * Props for {@link GiselleIcon}.
 *
 * Not extending `IconProps` directly — `@iconify/react` types `display` as
 * `string | number`, which conflicts with MUI Box's `ResponsiveStyleValue<Display>`
 * and causes a TypeScript overload resolution failure when used with `Box component`.
 * Only the safe subset of `IconProps` is exposed here.
 */
export interface GiselleIconProps {
  /**
   * Iconify icon identifier in the format `"prefix:name"`,
   * e.g. `"solar:rocket-bold-duotone"` or `"logos:react"`.
   */
  icon: string;
  /**
   * MUI `sx` prop for theming, spacing, color, and responsive styles.
   * Applied to the outer `Box component="span"` wrapper.
   */
  sx?: SxProps<Theme>;
  /**
   * Icon width in pixels (or any valid CSS length string).
   * @default 20
   */
  width?: number | string;
  /**
   * Icon height in pixels (or any valid CSS length string).
   * Defaults to `width` when omitted, keeping icons square by default.
   */
  height?: number | string;
  /** HTML `class` attribute forwarded to the inner `Icon` SVG element. */
  className?: string;
  /** Inline style forwarded to the inner `Icon` SVG element. */
  style?: React.CSSProperties;
  /**
   * Flip the icon horizontally, vertically, or both.
   * @example `"horizontal"` | `"vertical"` | `"horizontal,vertical"`
   */
  flip?: IconProps['flip'];
  /**
   * Rotate the icon.
   * Accepts 0–3 (quarter-turn increments) or a CSS angle string like `"90deg"`.
   */
  rotate?: IconProps['rotate'];
}

// ----------------------------------------------------------------------

/**
 * GiselleIcon — zero-dependency icon component with MUI `sx` support.
 *
 * A thin wrapper around `@iconify/react`'s `Icon` that adds the full MUI `sx`
 * API for theming, spacing, and responsive styles.
 *
 * @example
 * // Default size (20px square)
 * import { GiselleIcon } from '@alexrebula/giselle-mui';
 * <GiselleIcon icon="solar:rocket-bold-duotone" />
 *
 * @example
 * // Custom size with sx theming
 * <GiselleIcon icon="logos:typescript-icon" width={36} sx={{ color: 'primary.main' }} />
 *
 * @example
 * // As a ReactNode slot inside MetricCard
 * import { MetricCard, MetricCardDecoration, GiselleIcon } from '@alexrebula/giselle-mui';
 * <MetricCard
 *   value="20+"
 *   label="Years"
 *   icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />}
 *   decoration={<MetricCardDecoration color="primary" />}
 * />
 */
export function GiselleIcon({
  icon,
  width = 20,
  height,
  sx,
  className,
  style,
  flip,
  rotate,
}: GiselleIconProps) {
  const h = height ?? width;

  return (
    <Box component="span" sx={[giselleIconRootSx(width, h), ...(Array.isArray(sx) ? sx : [sx])]}>
      <Icon
        icon={icon}
        width="100%"
        height="100%"
        flip={flip}
        rotate={rotate}
        className={className}
        style={style}
      />
    </Box>
  );
}
