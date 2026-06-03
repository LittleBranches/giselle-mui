// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { SectionContainer } from './section-container';

// ----------------------------------------------------------------------

describe('SectionContainer', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionContainer, null, React.createElement('p', null, 'Section content'))
    );
    expect(html).toContain('Section content');
  });

  it('renders a single root element', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionContainer, null, React.createElement('span', null, 'child'))
    );
    // Rendered as a div (Container default)
    expect(html).toMatch(/^<div/);
  });

  it('forwards className to the root Container', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        SectionContainer,
        { className: 'my-section' },
        React.createElement('span', null, 'child')
      )
    );
    expect(html).toContain('my-section');
  });

  it('forwards data-* attributes', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        SectionContainer,
        { 'data-testid': 'section-root' } as Parameters<typeof SectionContainer>[0],
        React.createElement('span', null, 'child')
      )
    );
    expect(html).toContain('data-testid="section-root"');
  });

  it('accepts sx as a single object without throwing', () => {
    // Exercises the Array.isArray(sx) === false branch in the sx array spread
    expect(() =>
      renderToStaticMarkup(
        React.createElement(
          SectionContainer,
          { sx: { color: 'red' } } as Parameters<typeof SectionContainer>[0],
          React.createElement('span', null, 'child')
        )
      )
    ).not.toThrow();
  });

  it('accepts sx as an array without throwing', () => {
    // Exercises the Array.isArray(sx) === true branch in the sx array spread
    expect(() =>
      renderToStaticMarkup(
        React.createElement(
          SectionContainer,
          { sx: [{ color: 'red' }, { display: 'block' }] } as Parameters<
            typeof SectionContainer
          >[0],
          React.createElement('span', null, 'child')
        )
      )
    ).not.toThrow();
  });
});
