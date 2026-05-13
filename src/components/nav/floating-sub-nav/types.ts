import type { ReactNode } from 'react';

// ----------------------------------------------------------------------

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

// Internal sub-component types

export type SubNavButtonProps = {
  item: FloatingSubNavItem;
  isActive: boolean;
  onPress: (id: string) => void;
};

export type NavPillProps = {
  /** Ordered list of items to render as icon buttons. */
  items: FloatingSubNavItem[];
  /**
   * The id of the currently active item.
   * Each `SubNavButton` derives its `aria-pressed` state by comparing `item.id` to this value.
   */
  activeId: string;
  /** Called when the user presses a button. Receives the id of the pressed item. */
  onPress: (id: string) => void;
};
