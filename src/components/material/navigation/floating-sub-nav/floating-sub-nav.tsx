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

import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';

import { stickyWrapperSx, stickyInnerSx, fixedWrapperSx } from './floating-sub-nav.styles';
import type { FloatingSubNavProps } from './types';
import { NavPill } from './nav-pill';

// Re-export for consumers that import types from the component directly.
export type { FloatingSubNavItem, FloatingSubNavProps } from './types';

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
        <Box sx={stickyInnerSx}>
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
