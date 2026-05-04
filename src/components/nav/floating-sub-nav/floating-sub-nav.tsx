'use client';

/**
 * `FloatingSubNav` — a compact floating pill of icon-only navigation buttons.
 *
 * ## Variants
 *
 * ### Fixed (default, `sticky={false}`)
 * Rendered via `position: fixed` at the bottom of the **viewport**. Use this
 * when the nav should always be visible regardless of scroll position.
 *
 * ### Sticky (`sticky={true}`)
 * Rendered via `position: sticky` inside the **parent container**. Follows the
 * viewport bottom while the user scrolls through the parent, then clamps to the
 * container's bottom edge so it never escapes the section.
 *
 * The trick: the outer `Box` has `height: 0; overflow: visible` so it occupies
 * no layout space. The inner `Box` uses `translateY(-100%)` to float the pill
 * above the zero-height anchor. `pointer-events: none` on the wrapper and
 * `pointer-events: auto` on the inner `Box` keeps clicks working.
 *
 * ## Visibility
 * Pass `activeId={null}` to hide (animates out via `AnimatePresence`).
 * The parent is the single source of truth for when the nav is visible.
 *
 * @example Fixed (global nav)
 * ```tsx
 * <FloatingSubNav items={items} activeId={activeId} onSelect={setActiveId} />
 * ```
 *
 * @example Sticky (inside a tall section)
 * ```tsx
 * <FloatingSubNav sticky items={items} activeId={activeId} onSelect={setActiveId} />
 * ```
 */

import type { ReactNode } from 'react';

import { useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';

import { pillSx, stickyWrapperSx, fixedWrapperSx, subNavButtonSx } from './floating-sub-nav.styles';

// ---------------------------------------------------------------------------

export type FloatingSubNavItem = {
  id: string;
  label: string;
  /** Icon to display inside the button. Pass a `<GiselleIcon />` or any `ReactNode`. */
  icon: ReactNode;
};

export type FloatingSubNavProps = {
  /** Ordered list of items to display as icon buttons. */
  items: FloatingSubNavItem[];
  /**
   * The id of the currently active item.
   * When `null` the nav is hidden (slides out via `AnimatePresence` exit).
   */
  activeId: string | null;
  /** Called whenever the user presses a button. Always switches — never toggles. */
  onSelect: (id: string) => void;
  /**
   * When `true` the nav uses `position: sticky` within its parent container
   * instead of `position: fixed` relative to the viewport.
   *
   * @default false
   */
  sticky?: boolean;
};

// ---------------------------------------------------------------------------
// Shared pill — same visuals for both fixed and sticky variants
// ---------------------------------------------------------------------------

function NavPill({
  items,
  activeId,
  onPress,
}: {
  items: FloatingSubNavItem[];
  activeId: string;
  onPress: (id: string) => void;
}) {
  return (
    <m.div
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
    </m.div>
  );
}

// ---------------------------------------------------------------------------

/**
 * `FloatingSubNav` renders a compact pill of icon-only navigation buttons
 * that floats above the page content. Supports a **fixed** (viewport) variant
 * and a **sticky** (parent-contained) variant.
 */
export function FloatingSubNav({ items, activeId, onSelect, sticky = false }: FloatingSubNavProps) {
  const handlePress = useCallback((id: string) => onSelect(id), [onSelect]);

  if (sticky) {
    return (
      <Box sx={stickyWrapperSx}>
        <Box
          sx={{
            transform: 'translateY(-100%)',
            pointerEvents: 'auto',
            pb: { xs: '23px', md: '31px' },
          }}
        >
          <AnimatePresence>
            {activeId !== null && (
              <NavPill items={items} activeId={activeId} onPress={handlePress} />
            )}
          </AnimatePresence>
        </Box>
      </Box>
    );
  }

  return (
    <AnimatePresence>
      {activeId !== null && (
        <Box sx={fixedWrapperSx}>
          <NavPill items={items} activeId={activeId} onPress={handlePress} />
        </Box>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// SubNavButton — compact square icon-only button with Tooltip
// ---------------------------------------------------------------------------

type SubNavButtonProps = {
  item: FloatingSubNavItem;
  isActive: boolean;
  onPress: (id: string) => void;
};

function SubNavButton({ item, isActive, onPress }: SubNavButtonProps) {
  const handleClick = useCallback(() => onPress(item.id), [onPress, item.id]);

  return (
    <Tooltip title={item.label} placement="top" arrow>
      <ButtonBase
        disableRipple
        component="button"
        type="button"
        aria-label={item.label}
        aria-pressed={isActive}
        onClick={handleClick}
        sx={subNavButtonSx(isActive)}
      >
        {item.icon}
      </ButtonBase>
    </Tooltip>
  );
}
