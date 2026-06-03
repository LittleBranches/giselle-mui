// @vitest-environment jsdom
import React from 'react';
import { it, vi, expect, describe } from 'vitest';

import { renderWithTheme } from '../../../../test-utils';

// ----------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: { div: 'div' },
}));

import { HeroButtonsRow } from './hero-buttons-row';

// ----------------------------------------------------------------------

describe('HeroButtonsRow', () => {
  it('renders all item labels', () => {
    const html = renderWithTheme(
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
    const html = renderWithTheme(
      React.createElement(HeroButtonsRow, {
        items: [{ label: 'Go', href: '/target' }],
      })
    );
    expect(html).toContain('/target');
  });

  it('renders no buttons for an empty items array', () => {
    const html = renderWithTheme(React.createElement(HeroButtonsRow, { items: [] }));
    expect(html).not.toContain('<a');
  });
});
