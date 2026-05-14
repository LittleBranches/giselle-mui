// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MotionContainer } from './motion-container';

// ----------------------------------------------------------------------

describe('MotionContainer', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(
      React.createElement(MotionContainer, null, React.createElement('span', null, 'hello'))
    );
    expect(html).toContain('hello');
  });

  it('passes data-* attributes to the root element', () => {
    const html = renderToStaticMarkup(
      React.createElement(MotionContainer, { 'data-testid': 'mc' } as object, null)
    );
    expect(html).toContain('data-testid="mc"');
  });
});
