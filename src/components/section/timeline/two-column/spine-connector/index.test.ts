// @vitest-environment jsdom

/**
 * Unit tests for SpineConnector.
 *
 * ## Strategy
 *
 * SpineConnector uses `theme.vars.palette.*` inside its sx callback, so Box is
 * mocked to render a plain div. The year-label Typography is mocked to render its
 * children in a <span> so renderToStaticMarkup can inspect the output.
 *
 * ## Behaviour under test
 *
 *   - Renders without crashing for all dotColor values
 *   - Renders a year-boundary chip when yearMilestone is provided
 *   - Does NOT render a year chip when yearMilestone is undefined or null
 *   - Year chip contains the exact yearMilestone string
 */

import React from 'react';
import { it, vi, expect, describe } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// ---------------------------------------------------------------------------
// Minimal MUI mocks — render plain HTML so renderToStaticMarkup works
// ---------------------------------------------------------------------------

vi.mock('@mui/material/Box', () => ({
  default: ({
    children,
    sx: _sx,
    ...rest
  }: {
    children?: unknown;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement('div', rest as Record<string, unknown>, children as React.ReactNode),
}));

vi.mock('@mui/material/Typography', () => ({
  default: ({
    children,
    variant: _variant,
    sx: _sx,
    component: _component,
    ...rest
  }: {
    children?: unknown;
    variant?: string;
    sx?: unknown;
    component?: string;
    [key: string]: unknown;
  }) => React.createElement('span', rest as Record<string, unknown>, children as React.ReactNode),
}));

// Import AFTER mocks are registered.
import { SpineConnector } from './spine-connector';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function render(props: Parameters<typeof SpineConnector>[0]) {
  return renderToStaticMarkup(React.createElement(SpineConnector, props));
}

// ---------------------------------------------------------------------------
// Year label rendering
// ---------------------------------------------------------------------------

describe('SpineConnector — year label', () => {
  it('renders a year chip when yearMilestone is set', () => {
    const html = render({ dotColor: 'primary', yearMilestone: '2022' });
    expect(html).toContain('2022');
  });

  it('does NOT render a year chip when yearMilestone is undefined', () => {
    const html = render({ dotColor: 'primary', yearMilestone: undefined });
    // The exact year label text that would appear is not present
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
// Rendering with different dotColors
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
// sx and other props forwarded to root
// ---------------------------------------------------------------------------

describe('SpineConnector — consumer props forwarded to root', () => {
  it('id prop appears on root div', () => {
    const html = render({ dotColor: 'primary', id: 'spine-test' });
    expect(html).toContain('id="spine-test"');
  });
});
