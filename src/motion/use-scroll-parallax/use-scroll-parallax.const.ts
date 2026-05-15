/**
 * Layer multipliers (px). Layer 0 is the slowest; layer 4 is the fastest.
 * Consumers pick the layers relevant to their depth composition.
 */
export const LAYER_MULTIPLIERS = [40, 80, 120, 160, 200] as const;

/** Spring mass for parallax smoothing. Lower = lighter feel, faster settle. */
export const USE_SCROLL_PARALLAX_SPRING_MASS = 0.1;

/** Spring damping for parallax smoothing. Higher = less oscillation. */
export const USE_SCROLL_PARALLAX_SPRING_DAMPING = 20;

/** Spring stiffness for parallax smoothing. Higher = faster response. */
export const USE_SCROLL_PARALLAX_SPRING_STIFFNESS = 300;
