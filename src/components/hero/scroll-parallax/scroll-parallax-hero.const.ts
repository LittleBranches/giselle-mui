import type { ParallaxMultipliers } from './types';

// ----------------------------------------------------------------------

/**
 * Default parallax depth multipliers for each content layer.
 *
 * Negative values move the layer upward as the user scrolls down, creating depth.
 * The logo layer moves furthest (−7) — it appears to float in front of the background.
 * Actions and icons move least (−4) — they stay closest to the reading plane.
 *
 * Override per-layer via the `parallax` prop on `ScrollParallaxHero`.
 */
export const DEFAULT_PARALLAX_MULTIPLIERS: Required<ParallaxMultipliers> = {
  logo: -7,
  heading: -6,
  text: -5,
  actions: -4,
  icons: -4,
};
