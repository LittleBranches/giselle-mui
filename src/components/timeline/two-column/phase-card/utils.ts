// Pure helpers for PhaseCard.
// No JSX. No MUI imports. Fully unit-testable in isolation.

import type { Dispatch, KeyboardEventHandler, ReactNode, SetStateAction } from 'react';
import type { TimelinePhase, Task, TimelinePlatformItem } from '../types';

// ----------------------------------------------------------------------

/**
 * Resolves the horizontal position of the corner alert badge depending on which
 * column the card sits in.
 *
 * - Right column (default): badge floats on the **right** top corner so it sits
 *   on the outer edge (away from the centre spine).
 * - Left column: badge floats on the **left** top corner so it sits on the
 *   outer edge (away from the centre spine), mirrored.
 *
 * Exported so tests can assert the positioning rule independently.
 */
export function resolveCornerBadgeAlign(columnSide: 'left' | 'right'): {
  left?: number;
  right?: number;
  transform: string;
  tooltipPlacement: 'top-start' | 'top-end';
} {
  if (columnSide === 'left') {
    return { left: 0, transform: 'translate(-50%, -50%)', tooltipPlacement: 'top-start' };
  }
  return { right: 0, transform: 'translate(50%, -50%)', tooltipPlacement: 'top-end' };
}

/**
 * Resolves the list of photo entries to render for a phase card.
 *
 * - `photos` wins when both fields are present.
 * - `photo` (singular) is normalised to a single-element array.
 * - Neither present → `null` (no images rendered).
 *
 * @internal Exported for unit tests — not part of the public API.
 */
export function resolvePhotoSources(phase: {
  photo?: { src: string; alt: string };
  photos?: Array<{ src: string; alt: string }>;
}): Array<{ src: string; alt: string }> | null {
  return phase.photos ?? (phase.photo ? [phase.photo] : null);
}

/** True when the phase uses a variant that gets the highlighted card treatment. */
export function isHighlightedVariant(variant?: string): boolean {
  return variant === 'scenario' || variant === 'life-event';
}

/**
 * Normalises phase expandable content to `Task[]`.
 *
 * Resolution order:
 *   1. `phase.children` — new structured form (Task tree).
 *   2. `phase.details` — legacy flat string array, mapped to `{ title }` shims.
 *   3. Empty array — phase has no expandable content.
 */
export function resolveTaskChildren(phase: TimelinePhase): Task[] {
  if (phase.children?.length) return phase.children;
  if (phase.details?.length) {
    return phase.details.map((title, index) => ({ key: `detail-${index}`, title }));
  }
  return [];
}

/** Returns an onClick handler that calls `toggle` only when the card has details. */
export function buildCardClickHandler(hasDetails: boolean, toggle: () => void): () => void {
  return () => {
    if (hasDetails) toggle();
  };
}

/**
 * Returns an onKeyDown handler that calls `toggle` on Enter or Space
 * when the card has details.
 */
export function buildCardKeyDownHandler(
  hasDetails: boolean,
  toggle: () => void
): KeyboardEventHandler<HTMLDivElement> {
  return (e) => {
    if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggle();
    }
  };
}

/** Resolves expand/toggle for controlled vs uncontrolled card mode. */
export function resolveCardExpansion(
  onRequestExpand: (() => void) | undefined,
  isExpanded: boolean | undefined,
  internalExpanded: boolean,
  setInternalExpanded: Dispatch<SetStateAction<boolean>>
): { expanded: boolean; toggle: () => void } {
  if (onRequestExpand === undefined) {
    return { expanded: internalExpanded, toggle: () => setInternalExpanded((v) => !v) };
  }
  return { expanded: isExpanded ?? false, toggle: onRequestExpand };
}

/**
 * Derives the display `label`, `icon`, and `hasTextFallback` from a single
 * {@link TimelinePlatformItem}.
 *
 * A pure helper — rendering concerns (Tooltip wrapping, Box fallback) live in
 * `buildPlatformStripItems`. Exported so tests can exercise the real production
 * derivation logic without re-implementing it as a mirror.
 *
 * @internal — not part of the public component API; exported for testing only.
 *
 * - `label`           — the Tooltip title and text fallback content.
 * - `icon`            — `null` for string platforms; the ReactNode for object platforms.
 * - `hasTextFallback` — `true` when `icon` is `null` (a `<Box component="span">` is rendered).
 */
export function derivePlatformEntry(p: TimelinePlatformItem): {
  label: string;
  icon: ReactNode;
  hasTextFallback: boolean;
} {
  const isString = typeof p === 'string';
  const label = isString ? p : p.label;
  const icon = isString ? null : p.icon;
  return { label, icon, hasTextFallback: isString };
}
