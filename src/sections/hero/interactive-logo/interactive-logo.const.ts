import type { PortraitDirection } from './types';

/** Direction used when the pointer has not yet positioned over the portrait. */
export const DEFAULT_PORTRAIT_DIRECTION: PortraitDirection = 'forward';

/**
 * Milliseconds between first hover and portrait-phase activation.
 * Gives the artistic logo time to fade in before revealing the portrait.
 */
export const PORTRAIT_ACTIVATION_DELAY_MS = 500;
