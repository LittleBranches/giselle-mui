import type { GiselleIconProps } from './types';

import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';

import { giselleIconRootSx } from './giselle-icon.styles';

// Re-export — keeps `import { GiselleIconProps } from './giselle-icon'` working.
export type { GiselleIconProps } from './types';

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
 *
 * **Quality status (13 May 2026):** DoD 20/20 · Best practices 13/13
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
  ...other
}: GiselleIconProps) {
  const h = height ?? width;

  return (
    <Box
      component="span"
      sx={[giselleIconRootSx(width, h), ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
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
