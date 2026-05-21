// @vitest-environment jsdom
/**
 * Unit tests for SpineConnector.
 *
 * ## Behaviour under test
 *   - Renders without crashing for all dotColor values
 *   - Renders a year-boundary chip when yearMilestone is provided
 *   - Does NOT render a year chip when yearMilestone is undefined or null
 *   - Year chip contains the exact yearMilestone string
 */

import React from 'react';
import { it, expect, describe } from 'vitest';

import { renderWithTheme } from '../../../../../test-utils';
import { SpineConnector } from './spine-connector';

// ---------------------------------------------------------------------------

function render(props: Parameters<typeof SpineConnector>[0]) {
  return renderWithTheme(React.createElement(SpineConnector, props));
}

// ---------------------------------------------------------------------------

describe('SpineConnector — year label', () => {
  it('renders a year chip when yearMilestone is set', () => {
    const html = render({ dotColor: 'primary', yearMilestone: '2022' });
    expect(html).toContain('2022');
  });

  it('does NOT render a year chip when yearMilestone is undefined', () => {
    const html = render({ dotColor: 'primary', yearMilestone: undefined });
    expect(html).not.toMatch(/\d{4}/);
  });

  it('does NOT render a year chip when yearMilestone is null', () => {
    const html = render({ dotColor: 'primary', yearMilestone: null });
    expect(html).not.toMatch(/\d{4}/);
  });

  it('year chip contains the exact year string (not a different year)', () => {
    const html = render({ dotColor: 'primary', yearMilestone: '2019' });
    expect(html).toContain('2019');
    expect(html).not.toContain('2022');
  });
});

// ---------------------------------------------------------------------------

describe('SpineConnector — renders for all supported dotColor values', () => {
  const colors: Array<Parameters<typeof SpineConnector>[0]['dotColor']> = [
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
  ];

  for (const color of colors) {
    it(`dotColor="${color}" renders without crashing`, () => {
      expect(() => render({ dotColor: color })).not.toThrow();
    });
  }
});

// ---------------------------------------------------------------------------

describe('SpineConnector — consumer props forwarded to root', () => {
  it('id prop appears on root element', () => {
    const html = render({ dotColor: 'primary', id: 'spine-test' });
    expect(html).toContain('id="spine-test"');
  });
});
