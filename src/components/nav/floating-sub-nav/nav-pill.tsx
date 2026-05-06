import { motion } from 'framer-motion';

import Stack from '@mui/material/Stack';

import { pillSx } from './floating-sub-nav.styles';
import type { NavPillProps } from './types';
import { SubNavButton } from './sub-nav-button';

// ----------------------------------------------------------------------

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
