// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { photoImgSx } from './phase-card.styles';

// ---------------------------------------------------------------------------
// photoImgSx — first-photo vs subsequent-photo margin
// ---------------------------------------------------------------------------

describe('photoImgSx — photo image sx factory', () => {
  it('first photo gets mt: 2 (breathing room after description)', () => {
    const styles = photoImgSx(true) as Record<string, unknown>;
    expect(styles['mt']).toBe(2);
  });

  it('subsequent photos get mt: 1 (tighter gap within the strip)', () => {
    const styles = photoImgSx(false) as Record<string, unknown>;
    expect(styles['mt']).toBe(1);
  });

  it('all photos share the same base styles regardless of position', () => {
    const first = photoImgSx(true) as Record<string, unknown>;
    const second = photoImgSx(false) as Record<string, unknown>;

    // Structural styles must be identical between first and subsequent photos.
    expect(first['width']).toBe('100%');
    expect(second['width']).toBe('100%');
    expect(first['maxWidth']).toBe(200);
    expect(second['maxWidth']).toBe(200);
    expect(first['display']).toBe('block');
    expect(second['display']).toBe('block');
  });

  it('[regression] first photo margin is 2, not 1 — prevents missing breathing room', () => {
    // If isFirst logic is reversed or removed, mt would be 1 for every photo and
    // the first photo would sit too close to the description text.
    expect((photoImgSx(true) as Record<string, unknown>)['mt']).toBe(2);
    expect((photoImgSx(false) as Record<string, unknown>)['mt']).toBe(1);
    // Sanity: the two must differ.
    expect((photoImgSx(true) as Record<string, unknown>)['mt']).not.toBe(
      (photoImgSx(false) as Record<string, unknown>)['mt']
    );
  });
});
