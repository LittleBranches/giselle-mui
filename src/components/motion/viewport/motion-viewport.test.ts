// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MotionViewport } from './motion-viewport';

// ----------------------------------------------------------------------

describe('MotionViewport', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(
      React.createElement(MotionViewport, null, React.createElement('span', null, 'content')),
    );
    expect(html).toContain('content');
  });

  it('passes data-* attributes to the root element', () => {
    const html = renderToStaticMarkup(
      React.createElement(MotionViewport, { 'data-testid': 'mvp' } as object, null),
    );
    expect(html).toContain('data-testid="mvp"');
  });
});
