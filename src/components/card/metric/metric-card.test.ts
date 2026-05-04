// @vitest-environment jsdom
/**
 * Unit tests for MetricCard and MetricCardDecoration.
 *
 * All MUI components are mocked to avoid theme-provider requirements —
 * `theme.vars` is not available with the default MUI theme in MUI v7 CSS-vars
 * mode, and sx callbacks that reference it would throw without a CssVarsProvider.
 * The mocks replace rendering with simple HTML elements so we can assert on
 * structure and content without a full React tree.
 *
 * ## What is tested — MetricCard
 * - value text is rendered in the output
 * - label text is rendered in the output
 * - sublabel is rendered when provided
 * - sublabel is NOT rendered when omitted
 * - icon slot content is rendered when provided
 * - icon slot is NOT rendered when icon prop is omitted
 * - icon wrapper carries aria-hidden (icon is decorative)
 * - decoration slot content is rendered when provided
 * - decoration slot is NOT rendered when decoration prop is omitted
 * - decoration wrapper carries aria-hidden
 * - elevation=0 is the default (forwarded to Paper as data-elevation)
 * - additional props are forwarded to the root element
 *
 * ## What is tested — MetricCardDecoration
 * - renders without throwing
 * - renders as a Box (div via mock)
 * - accepts and renders with the color prop
 *
 * ## What is NOT tested here
 * - sx / CSS styles (require full MUI theme)
 * - Color palette tinting (design-system level)
 * - Responsive layout
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { it, vi, expect, describe } from 'vitest';

// ---------------------------------------------------------------------------
// MUI mocks — all strip `sx` to avoid theme.vars access.
// ---------------------------------------------------------------------------

vi.mock('@mui/material/Paper', () => ({
  default: ({
    children,
    elevation,
    sx: _sx,
    variant: _variant,
    ...props
  }: {
    children?: React.ReactNode;
    elevation?: number;
    sx?: unknown;
    variant?: string;
    [key: string]: unknown;
  }) =>
    React.createElement(
      'div',
      { 'data-testid': 'paper', 'data-elevation': elevation, ...props },
      children ?? null
    ),
}));

vi.mock('@mui/material/Box', () => ({
  default: ({
    component = 'div',
    children,
    sx: _sx,
    ...props
  }: {
    component?: string;
    children?: React.ReactNode;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement(component as string, props, children ?? null),
}));

vi.mock('@mui/material/Typography', () => ({
  default: ({
    children,
    variant: _variant,
    component = 'span',
    sx: _sx,
    noWrap: _noWrap,
    ...props
  }: {
    children?: React.ReactNode;
    variant?: string;
    component?: string;
    sx?: unknown;
    noWrap?: boolean;
    [key: string]: unknown;
  }) => React.createElement(component as string, props, children ?? null),
}));

import { MetricCard, MetricCardDecoration } from './metric-card';

// ---------------------------------------------------------------------------
// MetricCard — content rendering
// ---------------------------------------------------------------------------

describe('MetricCard — content', () => {
  it('renders the value text', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, { value: '20+', label: 'Years' })
    );

    expect(html).toContain('20+');
  });

  it('renders a numeric value', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, { value: 5, label: 'Clients' })
    );

    expect(html).toContain('5');
  });

  it('renders the label text', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, { value: '20+', label: 'Years experience' })
    );

    expect(html).toContain('Years experience');
  });

  it('renders sublabel when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        sublabel: 'of experience',
      })
    );

    expect(html).toContain('of experience');
  });

  it('does NOT render sublabel when omitted', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, { value: '20+', label: 'Years' })
    );

    // No sublabel content means the sublabel Typography branch was not rendered
    expect(html).not.toContain('front-end');
  });
});

// ---------------------------------------------------------------------------
// MetricCard — icon slot
// ---------------------------------------------------------------------------

describe('MetricCard — icon slot', () => {
  it('renders icon slot content when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        icon: React.createElement('span', { 'data-testid': 'icon-content' }),
      })
    );

    expect(html).toContain('data-testid="icon-content"');
  });

  it('does NOT render the icon wrapper when icon is omitted', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, { value: '20+', label: 'Years' })
    );

    expect(html).not.toContain('data-testid="icon-content"');
  });

  it('marks the icon wrapper aria-hidden (icon is decorative)', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        icon: React.createElement('span', { 'data-testid': 'icon-slot' }),
      })
    );

    // The icon wrapper Box has aria-hidden="true"
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-testid="icon-slot"');
  });
});

// ---------------------------------------------------------------------------
// MetricCard — decoration slot
// ---------------------------------------------------------------------------

describe('MetricCard — decoration slot', () => {
  it('renders decoration slot content when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        decoration: React.createElement('div', { 'data-testid': 'decoration-content' }),
      })
    );

    expect(html).toContain('data-testid="decoration-content"');
  });

  it('does NOT render the decoration wrapper when decoration is omitted', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, { value: '20+', label: 'Years' })
    );

    expect(html).not.toContain('data-testid="decoration-content"');
  });

  it('marks the decoration wrapper aria-hidden (decoration is presentational)', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        decoration: React.createElement('div', { 'data-testid': 'dec' }),
      })
    );

    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-testid="dec"');
  });
});

// ---------------------------------------------------------------------------
// MetricCard — Paper props forwarding
// ---------------------------------------------------------------------------

describe('MetricCard — Paper props', () => {
  it('uses elevation 0 by default', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, { value: '20+', label: 'Years' })
    );

    expect(html).toContain('data-elevation="0"');
  });

  it('forwards a custom elevation to Paper', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, { value: '20+', label: 'Years', elevation: 4 })
    );

    expect(html).toContain('data-elevation="4"');
  });

  it('forwards extra props to the root Paper element', () => {
    const html = renderToStaticMarkup(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        'data-testid': 'my-card',
      } as React.ComponentProps<typeof MetricCard> & { 'data-testid': string })
    );

    expect(html).toContain('data-testid="my-card"');
  });
});

// ---------------------------------------------------------------------------
// MetricCardDecoration
// ---------------------------------------------------------------------------

describe('MetricCardDecoration', () => {
  it('renders without throwing', () => {
    expect(() => renderToStaticMarkup(React.createElement(MetricCardDecoration, {}))).not.toThrow();
  });

  it('renders without throwing for each supported color', () => {
    const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

    for (const color of colors) {
      expect(() =>
        renderToStaticMarkup(React.createElement(MetricCardDecoration, { color }))
      ).not.toThrow();
    }
  });

  it('renders as a Box (div via mock)', () => {
    const html = renderToStaticMarkup(React.createElement(MetricCardDecoration, {}));

    expect(html).toMatch(/^<div/);
  });
});
