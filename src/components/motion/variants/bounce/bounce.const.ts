/** Default distance in px for directional bounce animations. */
export const BOUNCE_DEFAULT_DISTANCE = 720;

// --- Keyframe arrays (shared across bounce directions) ---

/**
 * Scale keyframes for `bounce('in')`.
 * Starts compressed, overshoots, settles: `[0.3, 1.1, 0.9, 1.03, 0.97, 1]`.
 */
export const BOUNCE_IN_SCALE_KEYFRAMES = [0.3, 1.1, 0.9, 1.03, 0.97, 1] as const;

/**
 * Opacity keyframes for `bounce('in')` — becomes fully visible on second frame.
 */
export const BOUNCE_IN_OPACITY_KEYFRAMES = [0, 1, 1, 1, 1, 1] as const;

/**
 * scaleY keyframes for vertical `bounce('in')` directions.
 * Squash and stretch: `[4, 0.9, 0.95, 0.985, 1]`.
 */
export const BOUNCE_IN_SCALE_Y_KEYFRAMES = [4, 0.9, 0.95, 0.985, 1] as const;

/**
 * scaleX keyframes for horizontal `bounce('in')` directions.
 * Squash and stretch: `[3, 1, 0.98, 0.995, 1]`.
 */
export const BOUNCE_IN_SCALE_X_KEYFRAMES = [3, 1, 0.98, 0.995, 1] as const;

/** Opacity keyframes for directional `bounce('in')` — same as BOUNCE_IN_OPACITY_KEYFRAMES but 5-step. */
export const BOUNCE_IN_DIRECTIONAL_OPACITY_KEYFRAMES = [0, 1, 1, 1, 1] as const;

/** y keyframe array for `bounce('inUp')` — arrives from below, small overshoot, settles. */
export const BOUNCE_IN_UP_Y_KEYFRAMES = (distance: number) =>
  [distance, -24, 12, -4, 0] as [number, number, number, number, number];

/** y keyframe array for `bounce('inDown')` — arrives from above, small overshoot, settles. */
export const BOUNCE_IN_DOWN_Y_KEYFRAMES = (distance: number) =>
  [-distance, 24, -12, 4, 0] as [number, number, number, number, number];

/** x keyframe array for `bounce('inLeft')` — arrives from the left, small overshoot, settles. */
export const BOUNCE_IN_LEFT_X_KEYFRAMES = (distance: number) =>
  [-distance, 24, -12, 4, 0] as [number, number, number, number, number];

/** x keyframe array for `bounce('inRight')` — arrives from the right, small overshoot, settles. */
export const BOUNCE_IN_RIGHT_X_KEYFRAMES = (distance: number) =>
  [distance, -24, 12, -4, 0] as [number, number, number, number, number];

// --- Exit keyframes ---

/** Scale keyframes for `bounce('out')`. */
export const BOUNCE_OUT_SCALE_KEYFRAMES = [0.9, 1.1, 0.3] as const;

/** Opacity keyframes for `bounce('out')`. */
export const BOUNCE_OUT_OPACITY_KEYFRAMES = [1, 1, 0] as const;

/** scaleY keyframes for vertical `bounce('out')` directions. */
export const BOUNCE_OUT_SCALE_Y_KEYFRAMES = [0.985, 0.9, 3] as const;

/** scaleX keyframes for horizontal `bounce('out')` directions. */
export const BOUNCE_OUT_SCALE_X_KEYFRAMES = [1, 0.9, 2] as const;

/** y keyframe array for `bounce('outUp')`. */
export const BOUNCE_OUT_UP_Y_KEYFRAMES = (distance: number) =>
  [-12, 24, -distance] as [number, number, number];

/** y keyframe array for `bounce('outDown')`. */
export const BOUNCE_OUT_DOWN_Y_KEYFRAMES = (distance: number) =>
  [12, -24, distance] as [number, number, number];

/** x keyframe array for `bounce('outLeft')`. */
export const BOUNCE_OUT_LEFT_X_KEYFRAMES = (distance: number) =>
  [0, 24, -distance] as [number, number, number];

/** x keyframe array for `bounce('outRight')`. */
export const BOUNCE_OUT_RIGHT_X_KEYFRAMES = (distance: number) =>
  [0, -24, distance] as [number, number, number];
