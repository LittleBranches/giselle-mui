'use client';

import type { HeroButtonsRowProps } from './types';

import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { rowSx, buttonSx } from './hero-buttons-row.styles';

// ----------------------------------------------------------------------

/**
 * An animated row of CTA buttons for hero sections.
 *
 * Each button is wrapped in a `motion.div` so entrance animations can be
 * applied via `motionProps`. Pass variant-based animation values via
 * `motionProps` to stagger or fade in each button independently.
 *
 * ```tsx
 * import { fade } from '@littlebranches/giselle-mui/motion';
 *
 * <HeroButtonsRow
 *   items={[
 *     { label: 'View work', href: '#work' },
 *     { label: 'Contact', href: '#contact', variant: 'outlined' },
 *   ]}
 *   motionProps={{ variants: fade('inUp', { distance: 24 }) }}
 * />
 * ```
 */
export function HeroButtonsRow({ items, motionProps, sx, ...other }: HeroButtonsRowProps) {
  return (
    <Box sx={[rowSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {items.map((item) => (
        <motion.div key={item.label} {...motionProps}>
          <Button
            href={item.href}
            color="inherit"
            size="large"
            variant={item.variant ?? 'contained'}
            sx={buttonSx}
          >
            {item.label}
          </Button>
        </motion.div>
      ))}
    </Box>
  );
}
