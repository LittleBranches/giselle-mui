// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { decorationOverlaySx } from './metric-card.styles';

// ----------------------------------------------------------------------

describe('decorationOverlaySx', () => {
  it('fills parent absolutely with no pointer events', () => {
    expect(decorationOverlaySx).toMatchObject({
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
    });
  });
});
