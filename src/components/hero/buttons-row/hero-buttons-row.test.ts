// @vitest-environment jsdom
import React from 'react';
import { it, vi, expect, describe } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// ----------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
}));

vi.mock('@mui/material/Box', () => ({
  default: (rawProps: unknown) => {
    const { children, ...rest } = rawProps as {
      children?: React.ReactNode;
      [key: string]: unknown;
    };
    return React.createElement(
      'div',
      rest as React.HTMLAttributes<HTMLDivElement>,
      children ?? null
    );
  },
}));

vi.mock('@mui/material/Button', () => ({
  default: (rawProps: unknown) => {
    const { children, href } = rawProps as { children?: React.ReactNode; href?: string };
    return React.createElement('a', { href }, children ?? null);
  },
}));

import { HeroButtonsRow } from './hero-buttons-row';

// ----------------------------------------------------------------------

describe('HeroButtonsRow', () => {
  it('renders all item labels', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroButtonsRow, {
        items: [
          { label: 'View work', href: '#work' },
          { label: 'Contact', href: '#contact' },
        ],
      })
    );
    expect(html).toContain('View work');
    expect(html).toContain('Contact');
  });

  it('renders anchor hrefs', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroButtonsRow, {
        items: [{ label: 'Go', href: '/target' }],
      })
    );
    expect(html).toContain('/target');
  });

  it('renders no buttons for an empty items array', () => {
    const html = renderToStaticMarkup(React.createElement(HeroButtonsRow, { items: [] }));
    expect(html).not.toContain('<a');
  });
});
