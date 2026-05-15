// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { TechIconStrip } from './tech-icon-strip';
import type { TechIconItem } from './types';

// ----------------------------------------------------------------------

const items: TechIconItem[] = [
  { icon: React.createElement('span', { 'aria-hidden': true }, '⚙'), label: 'Tool A' },
  { icon: React.createElement('span', { 'aria-hidden': true }, '⚡'), label: 'Tool B' },
  { icon: React.createElement('span', { 'aria-hidden': true }, '🔷'), label: 'Tool C' },
];

describe('TechIconStrip', () => {
  it('renders all item labels', () => {
    const html = renderToStaticMarkup(React.createElement(TechIconStrip, { items }));
    expect(html).toContain('Tool A');
    expect(html).toContain('Tool B');
    expect(html).toContain('Tool C');
  });

  it('renders the title when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(TechIconStrip, { items, heading: 'Technologies' })
    );
    expect(html).toContain('Technologies');
  });

  it('does not render a title element when title is omitted', () => {
    const html = renderToStaticMarkup(React.createElement(TechIconStrip, { items }));
    // No overline span should be present
    expect(html).not.toContain('Technologies');
  });

  it('renders icon content for each item', () => {
    const html = renderToStaticMarkup(React.createElement(TechIconStrip, { items }));
    expect(html).toContain('⚙');
    expect(html).toContain('⚡');
  });

  it('passes additional props to the root element', () => {
    const html = renderToStaticMarkup(React.createElement(TechIconStrip, { items, id: 'strip' }));
    expect(html).toContain('id="strip"');
  });
});
