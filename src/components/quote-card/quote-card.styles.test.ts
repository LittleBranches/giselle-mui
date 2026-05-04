// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { quoteMarkSx, quoteTextSx } from './quote-card.styles';

// ----------------------------------------------------------------------

describe('quoteMarkSx', () => {
  it('uses the passed color for the text color token', () => {
    const sx = quoteMarkSx('primary');
    expect(sx).toMatchObject({ color: 'primary.main' });
  });

  it('is visually reduced to not overpower the quote text', () => {
    const sx = quoteMarkSx('info');
    expect(sx).toMatchObject({ opacity: 0.4, flexShrink: 0 });
  });

  it('uses serif font for the decorative glyph', () => {
    const sx = quoteMarkSx('success');
    expect((sx as Record<string, unknown>).fontFamily).toContain('Georgia');
  });
});

describe('quoteTextSx', () => {
  it('uses italic light-weight styling for readability', () => {
    expect(quoteTextSx).toMatchObject({
      fontStyle: 'italic',
      fontWeight: 'fontWeightLight',
      color: 'text.secondary',
      lineHeight: 1.85,
    });
  });
});
