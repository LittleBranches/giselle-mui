// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { MotionViewport } from './motion-viewport';

// ----------------------------------------------------------------------

// MotionViewport calls useMediaQuery which requires a ThemeProvider in the
// component tree. Wrap each render with a minimal theme to satisfy this.
const theme = createTheme({ cssVariables: true });

function withTheme(element: React.ReactElement) {
  return React.createElement(ThemeProvider, { theme }, element);
}

describe('MotionViewport', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(
      withTheme(
        React.createElement(MotionViewport, null, React.createElement('span', null, 'content'))
      )
    );
    expect(html).toContain('content');
  });

  it('passes data-* attributes to the root element', () => {
    const html = renderToStaticMarkup(
      withTheme(React.createElement(MotionViewport, { 'data-testid': 'mvp' } as object, null))
    );
    expect(html).toContain('data-testid="mvp"');
  });
});
