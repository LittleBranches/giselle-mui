// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { TwoColumnShowcaseRow } from './two-column-showcase-row';

// ----------------------------------------------------------------------

const controls = React.createElement('div', { 'data-testid': 'controls' }, 'Controls');

describe('TwoColumnShowcaseRow', () => {
  it('renders controls slot', () => {
    const html = renderToStaticMarkup(React.createElement(TwoColumnShowcaseRow, { controls }));
    expect(html).toContain('data-testid="controls"');
  });

  it('renders text overline, heading, and description when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(TwoColumnShowcaseRow, {
        controls,
        text: {
          overline: 'Step one',
          heading: 'Choose a theme',
          description: 'Pick any colour preset.',
        },
      })
    );
    expect(html).toContain('Step one');
    expect(html).toContain('Choose a theme');
    expect(html).toContain('Pick any colour preset.');
  });

  it('renders nothing for the text column when text is omitted', () => {
    const html = renderToStaticMarkup(React.createElement(TwoColumnShowcaseRow, { controls }));
    // No h4, no overline span
    expect(html).not.toContain('<h4');
  });

  it('renders partial text slots when only heading is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(TwoColumnShowcaseRow, {
        controls,
        text: { heading: 'Heading only' },
      })
    );
    expect(html).toContain('Heading only');
  });

  it('accepts sx, textSx, controlsSx, controlsAlign, orientation without error', () => {
    expect(() =>
      renderToStaticMarkup(
        React.createElement(TwoColumnShowcaseRow, {
          controls,
          text: { heading: 'Test' },
          orientation: 'row-reverse',
          controlsAlign: 'center',
          sx: { mt: 2 },
          textSx: { opacity: 0.8 },
          controlsSx: { border: '1px solid red' },
        })
      )
    ).not.toThrow();
  });
});
