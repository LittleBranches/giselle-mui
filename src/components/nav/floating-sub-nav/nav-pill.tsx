import { motion } from 'framer-motion';

import Stack from '@mui/material/Stack';

import { pillVariants, pillTransition } from './floating-sub-nav.animations';
import { pillSx } from './floating-sub-nav.styles';
import type { NavPillProps } from './types';
import { SubNavButton } from './sub-nav-button';

// ----------------------------------------------------------------------

export function NavPill({ items, activeId, onPress }: NavPillProps) {
  return (
    <motion.div
      variants={pillVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pillTransition}
    >
      <Stack
        component="nav"
        direction="column"
        alignItems="center"
        aria-label="Section navigation"
        sx={pillSx}
      >
        <Stack direction="row" spacing={0.5}>
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
