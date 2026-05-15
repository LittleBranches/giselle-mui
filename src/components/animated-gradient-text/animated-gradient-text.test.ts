// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { AnimatedGradientText } from './animated-gradient-text';

// ----------------------------------------------------------------------

describe('AnimatedGradientText', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(
      React.createElement(AnimatedGradientText, null, 'Hello gradient')
    );
    expect(html).toContain('Hello gradient');
  });

  it('renders as span by default', () => {
    const html = renderToStaticMarkup(React.createElement(AnimatedGradientText, null, 'text'));
    expect(html).toContain('<span');
  });

  it('renders as the given component when overridden', () => {
    const html = renderToStaticMarkup(
      React.createElement(AnimatedGradientText, { component: 'h1' }, 'heading')
    );
    expect(html).toContain('<h1');
  });

  it('passes additional props to the root element', () => {
    const html = renderToStaticMarkup(
      React.createElement(AnimatedGradientText, { id: 'agt' }, 'text')
    );
    expect(html).toContain('id="agt"');
  });
});
