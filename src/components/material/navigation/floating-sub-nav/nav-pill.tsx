import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { pillVariants, pillTransition } from './floating-sub-nav.animations';
import { PILL_BUTTON_ROW_SPACING } from './floating-sub-nav.const';
import { pillSx } from './floating-sub-nav.styles';
import type { NavPillProps } from './types';
import { SubNavButton } from './sub-nav-button';

// ----------------------------------------------------------------------

/**
 * Animated pill container rendered by `FloatingSubNav`.
 * Wraps a row of `SubNavButton` elements inside a `motion.div` that slides
 * in from below on mount and slides out on unmount via `AnimatePresence`.
 *
 * This is an internal sub-component — always rendered by `FloatingSubNav`,
 * never instantiated directly by consumers.
 *
 * **Quality status (13 May 2026):** DoD 9/9 · Best practices 13/13
 */
export function NavPill({ items, activeId, onPress }: NavPillProps) {
  return (
    <motion.div
      variants={pillVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pillTransition}
    >
      <Box component="nav" aria-label="Section navigation" sx={pillSx}>
        <Stack direction="row" spacing={PILL_BUTTON_ROW_SPACING}>
          {items.map((item) => (
            <SubNavButton
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onPress={onPress}
            />
          ))}
        </Stack>
      </Box>
    </motion.div>
  );
}
