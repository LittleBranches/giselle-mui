import type { PortraitDirection, PortraitSource } from './types';

// ----------------------------------------------------------------------

/**
 * Returns a single `src` string from either a plain string or an array.
 * When the input is an array, a random element is returned. Returns an
 * empty string for an empty array.
 */
export function getRandomPortraitSrc(src: string | readonly string[]): string {
  if (typeof src === 'string') return src;
  if (src.length === 0) return '';
  return src[Math.floor(Math.random() * src.length)] ?? '';
}

/**
 * Maps a pointer angle (−180…180, measured from the positive x-axis, clockwise)
 * to one of the nine {@link PortraitDirection} values.
 *
 * Boundaries are at every 45° in 22.5° offset from the axes:
 * - `right`:      −22.5° to 22.5°
 * - `down-right`:  22.5° to 67.5°
 * - `down`:        67.5° to 112.5°
 * - `down-left`:  112.5° to 157.5°
 * - `left`:        |angle| >= 157.5°
 * - `up-left`:   −157.5° to −112.5°
 * - `up`:         −112.5° to −67.5°
 * - `up-right`:   −67.5° to −22.5°
 */
export function getPortraitDirectionFromAngle(angle: number): PortraitDirection {
  const abs = Math.abs(angle);

  if (abs >= 157.5) return 'left';
  if (angle >= 112.5) return 'down-left';
  if (angle >= 67.5) return 'down';
  if (angle >= 22.5) return 'down-right';
  if (angle >= -22.5) return 'right';
  if (angle >= -67.5) return 'up-right';
  if (angle >= -112.5) return 'up';
  if (angle >= -157.5) return 'up-left';
  return 'left';
}

/**
 * Builds a `Partial<Record<PortraitDirection, string | readonly string[]>>` map
 * from the convenience props.
 *
 * - `portraitSrc` maps to the `'forward'` direction.
 * - Each entry in `portraitSources` is indexed by its `direction`.
 * - Empty-string `src` values are skipped.
 */
export function buildPortraitSourceMap(
  portraitSrc?: string,
  portraitSources?: readonly PortraitSource[]
): Partial<Record<PortraitDirection, string | readonly string[]>> {
  const map: Partial<Record<PortraitDirection, string | readonly string[]>> = {};

  if (portraitSrc) {
    map['forward'] = portraitSrc;
  }

  portraitSources?.forEach(({ direction, src }) => {
    const isEmpty = typeof src === 'string' ? src === '' : src.length === 0;
    if (!isEmpty) {
      map[direction] = src;
    }
  });

  return map;
}

/**
 * Returns the CSS cursor value for the interactive logo root.
 *
 * Uses `'default'` when `reducedMotion` is `true` to signal that
 * the 3-D interaction is disabled.
 */
export function getCursorStyle(
  reducedMotion: boolean | null,
  isPointerDown: boolean
): 'default' | 'grab' | 'grabbing' {
  if (reducedMotion === true) return 'default';
  return isPointerDown ? 'grabbing' : 'grab';
}
