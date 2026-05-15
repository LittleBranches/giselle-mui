import { keyframes } from '@emotion/react';

// ----------------------------------------------------------------------

export const pulseRing = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.6); opacity: 0; }
`;

export const pulseDot = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

/**
 * Spring-bounce pop used for the dot icon swap on done/undone toggle.
 * Scales in from near-zero with a slight overshoot before settling.
 */
export const checkPop = keyframes`
  0%   { transform: scale(0.3); opacity: 0; }
  55%  { transform: scale(1.25); opacity: 1; }
  75%  { transform: scale(0.92); }
  100% { transform: scale(1); opacity: 1; }
`;
