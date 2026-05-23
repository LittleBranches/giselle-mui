// @vitest-environment jsdom
/**
 * Unit tests for StatusLabel.
 *
 * All MUI components are mocked to avoid theme-provider requirements.
 * Rendering assertions verify label text, status prop wiring, and prop forwarding.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// ---------------------------------------------------------------------------
// MUI mocks — strip sx to avoid theme.vars access
// ---------------------------------------------------------------------------

vi.mock('@mui/material/Chip', () => ({
  default: ({
    label,
    size,
    sx: _sx,
    ...props
  }: {
    label?: React.ReactNode;
    size?: string;
    sx?: unknown;
    [key: string]: unknown;
  }) =>
    React.createElement(
      'span',
      { 'data-testid': 'chip', 'data-size': size, ...props },
      label ?? null
    ),
}));

import { StatusLabel } from './status-label';
import { STATUS_CONFIG } from './status-label.const';

// ----------------------------------------------------------------------

describe('StatusLabel — default labels', () => {
  it.each([
    ['active', 'Active'],
    ['inactive', 'Inactive'],
    ['pending', 'Pending'],
    ['review', 'Review'],
    ['done', 'Done'],
    ['cancelled', 'Cancelled'],
    ['overdue', 'Overdue'],
  ] as const)('status %s renders label "%s"', (status, expectedLabel) => {
    const html = renderToStaticMarkup(React.createElement(StatusLabel, { status }));
    expect(html).toContain(expectedLabel);
  });
});

describe('StatusLabel — label prop override', () => {
  it('renders the custom label instead of the default', () => {
    const html = renderToStaticMarkup(
      React.createElement(StatusLabel, { status: 'active', label: 'Live' })
    );
    expect(html).toContain('Live');
    expect(html).not.toContain('Active');
  });

  it('renders the custom label for pending status', () => {
    const html = renderToStaticMarkup(
      React.createElement(StatusLabel, { status: 'pending', label: 'Awaiting approval' })
    );
    expect(html).toContain('Awaiting approval');
  });
});

describe('StatusLabel — rendering', () => {
  it('renders without crashing for all statuses', () => {
    const statuses = [
      'active',
      'inactive',
      'pending',
      'review',
      'done',
      'cancelled',
      'overdue',
    ] as const;
    for (const status of statuses) {
      expect(() =>
        renderToStaticMarkup(React.createElement(StatusLabel, { status }))
      ).not.toThrow();
    }
  });

  it('defaults to small size', () => {
    const html = renderToStaticMarkup(React.createElement(StatusLabel, { status: 'active' }));
    expect(html).toContain('data-size="small"');
  });

  it('forwards additional props to the chip', () => {
    const html = renderToStaticMarkup(
      React.createElement(StatusLabel, {
        status: 'pending',
        'data-testid': 'my-label',
      } as Parameters<typeof StatusLabel>[0])
    );
    expect(html).toContain('data-testid="my-label"');
  });
});

describe('StatusLabel — STATUS_CONFIG integrity', () => {
  it('all seven statuses have a config entry', () => {
    const statuses = ['active', 'inactive', 'pending', 'review', 'done', 'cancelled', 'overdue'];
    for (const s of statuses) {
      expect(STATUS_CONFIG).toHaveProperty(s);
    }
  });

  it('all config entries have non-empty labels', () => {
    for (const [, { label }] of Object.entries(STATUS_CONFIG)) {
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it('all config entries have a valid color key', () => {
    const validColors = ['success', 'warning', 'info', 'error', 'default'];
    for (const [, { color }] of Object.entries(STATUS_CONFIG)) {
      expect(validColors).toContain(color);
    }
  });

  it('inactive maps to default color key', () => {
    expect(STATUS_CONFIG.inactive.color).toBe('default');
  });

  it('active maps to success color key', () => {
    expect(STATUS_CONFIG.active.color).toBe('success');
  });

  it('done maps to success color key', () => {
    expect(STATUS_CONFIG.done.color).toBe('success');
  });

  it('cancelled maps to error color key', () => {
    expect(STATUS_CONFIG.cancelled.color).toBe('error');
  });

  it('overdue maps to error color key', () => {
    expect(STATUS_CONFIG.overdue.color).toBe('error');
  });
});
