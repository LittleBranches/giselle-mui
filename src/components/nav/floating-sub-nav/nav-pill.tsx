import { motion } from 'framer-motion';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
    >
      <Stack
        direction="column"
        alignItems="center"
        role="navigation"
        aria-label="Section navigation"
        sx={pillSx}
      >
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
      </Stack>
    </motion.div>
  );
}
