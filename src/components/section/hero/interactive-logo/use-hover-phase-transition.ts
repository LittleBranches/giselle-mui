import type { UseHoverPhaseTransitionResult, UseHoverPhaseTransitionOptions } from './types';

import { useRef, useState, useEffect } from 'react';

import { DEFAULT_PORTRAIT_DIRECTION, PORTRAIT_ACTIVATION_DELAY_MS } from './interactive-logo.const';

// ----------------------------------------------------------------------

/**
 * Manages the three-phase hover state machine for `InteractiveHeroLogo`.
 *
 * **Phase diagram:**
 * ```
 * idle  ──(hover, no portrait yet)──▶  artistic  ──(500 ms)──▶  portrait
 *   ▲                                                               │
 *   ├─────────────────(pointer leaves)─────────────────────────────┘
 *   │
 * idle  ──(hover, hasActivatedPortrait && hasPortrait)──▶  portrait
 * ```
 *
 * **Phase rules:**
 * - `idle` — logo at rest. Artistic overlay is visible (the default resting appearance);
 *   original logo is hidden (faded out, blurred).
 * - `artistic` — on first hover (when portrait has not yet been activated). Original logo
 *   fades in over the artistic overlay. Transitions to `portrait` after
 *   `PORTRAIT_ACTIVATION_DELAY_MS`.
 * - `portrait` — once `hasActivatedPortrait` is set AND `hasPortrait` remains truthy,
 *   subsequent hovers skip `artistic` and go straight here.
 *   Leaving the logo always returns to `idle` — the portrait is not shown at rest.
 *
 * **Reduced motion:** when `reducedMotion` is `true`, the activation delay is `0` — the
 * portrait shows immediately on hover.
 */
export function useHoverPhaseTransition({
  isHovered,
  hasPortrait,
  reducedMotion,
}: UseHoverPhaseTransitionOptions): UseHoverPhaseTransitionResult {
  const [hoverPhase, setHoverPhase] = useState<UseHoverPhaseTransitionResult['hoverPhase']>('idle');
  const [hasActivatedPortrait, setHasActivatedPortrait] = useState(false);
  const [activePortraitDirection, setActivePortraitDirection] = useState<
    UseHoverPhaseTransitionResult['activePortraitDirection']
  >(DEFAULT_PORTRAIT_DIRECTION);

  const portraitTimeoutRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

  useEffect(() => {
    if (portraitTimeoutRef.current) {
      globalThis.clearTimeout(portraitTimeoutRef.current);
      portraitTimeoutRef.current = null;
    }

    if (!isHovered) {
      setActivePortraitDirection(DEFAULT_PORTRAIT_DIRECTION);
      setHoverPhase('idle');
      return undefined;
    }

    if (hasActivatedPortrait && hasPortrait) {
      setHoverPhase('portrait');
      return undefined;
    }

    setHoverPhase('artistic');

    if (!hasPortrait) {
      return undefined;
    }

    portraitTimeoutRef.current = globalThis.setTimeout(
      () => {
        setHasActivatedPortrait(true);
        setActivePortraitDirection(DEFAULT_PORTRAIT_DIRECTION);
        setHoverPhase('portrait');
      },
      reducedMotion ? 0 : PORTRAIT_ACTIVATION_DELAY_MS
    );

    return () => {
      if (portraitTimeoutRef.current) {
        globalThis.clearTimeout(portraitTimeoutRef.current);
        portraitTimeoutRef.current = null;
      }
    };
  }, [hasActivatedPortrait, hasPortrait, isHovered, reducedMotion]);

  return { hoverPhase, hasActivatedPortrait, activePortraitDirection, setActivePortraitDirection };
}
