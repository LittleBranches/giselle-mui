import type { ReactNode } from 'react';

// ----------------------------------------------------------------------

/**
 * Shared slot props accepted by every hero-level component in this library.
 *
 * Establishes a consistent slot vocabulary across `HeroSection` and
 * `ScrollParallaxHero` so consumers can switch between them without renaming props:
 *
 * | Slot      | Purpose                                          |
 * | --------- | ------------------------------------------------ |
 * | `heading` | Primary headline (h1/h2 or `SectionTitle`)       |
 * | `text`    | Supporting subtitle or description               |
 * | `actions` | CTA buttons row (`HeroButtonsRow` or raw buttons)|
 * | `icons`   | Technology/platform icon strip (`TechIconStrip`) |
 *
 * Both hero components extend this interface and may add component-specific slots
 * (`logo`, `background`, `color`, `parallax`).
 */
export type HeroSlotProps = {
  /**
   * Primary headline slot.
   *
   * Render a `<Typography variant="h1">` or `<SectionTitle>` here.
   *
   * Optional here — this base interface allows heading-less hero variants.
   * Subclasses (e.g. `HeroSectionProps`) narrow this to **required** when the
   * component contract demands a heading be supplied by the consumer.
   */
  heading?: ReactNode;
  /**
   * Supporting text slot rendered below the heading.
   *
   * Render a `<Typography variant="body1" color="text.secondary">` here.
   * Omit to render a heading-only hero.
   */
  text?: ReactNode;
  /**
   * CTA buttons slot.
   *
   * Render one or more `Button` elements or a `HeroButtonsRow` here.
   */
  actions?: ReactNode;
  /**
   * Icon strip slot rendered below the actions.
   *
   * Render a `TechIconStrip` with `centeredWrap` here, or any icon/logo row.
   */
  icons?: ReactNode;
};
