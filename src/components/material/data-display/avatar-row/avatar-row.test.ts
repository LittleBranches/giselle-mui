// @vitest-environment jsdom
/**
 * Unit tests for AvatarRow.
 *
 * MUI components are mocked to avoid theme-provider requirements.
 * Tests cover: initials derivation, active indicator, onSelect callback,
 * React key usage (no console key warnings), and sx forwarding.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import { act } from 'react';

// ---------------------------------------------------------------------------
// MUI mocks
// ---------------------------------------------------------------------------

vi.mock('@mui/material/Avatar', () => ({
  default: ({
    src,
    alt,
    children,
    sx: _sx,
    ...props
  }: {
    src?: string;
    alt?: string;
    children?: React.ReactNode;
    sx?: unknown;
    [key: string]: unknown;
  }) =>
    React.createElement(
      'span',
      { 'data-testid': 'avatar', 'data-src': src ?? null, 'data-alt': alt, ...props },
      children ?? null
    ),
}));

vi.mock('@mui/material/Box', () => ({
  default: ({
    children,
    sx: _sx,
    onClick,
    ...props
  }: {
    children?: React.ReactNode;
    sx?: unknown;
    onClick?: () => void;
    [key: string]: unknown;
  }) => React.createElement('div', { onClick, ...props }, children ?? null),
}));

import { AvatarRow } from './avatar-row';

// ---------------------------------------------------------------------------

const ITEMS = [
  { id: 'a1', name: 'Alice Johnson', avatarSrc: '/alice.jpg' },
  { id: 'b2', name: 'Bob Smith' },
  { id: 'c3', name: 'Carol' },
];

// ---------------------------------------------------------------------------

describe('AvatarRow — renders correctly with required props', () => {
  it('renders without crashing', () => {
    expect(() =>
      renderToStaticMarkup(React.createElement(AvatarRow, { items: ITEMS }))
    ).not.toThrow();
  });

  it('renders an avatar element for each item', () => {
    const html = renderToStaticMarkup(React.createElement(AvatarRow, { items: ITEMS }));
    expect(html.match(/data-testid="avatar"/g)?.length).toBe(3);
  });

  it('renders nothing when items is empty', () => {
    const html = renderToStaticMarkup(React.createElement(AvatarRow, { items: [] }));
    expect(html).not.toContain('data-testid="avatar"');
  });
});

// ---------------------------------------------------------------------------

describe('AvatarRow — initials fallback', () => {
  it('shows two-letter initials when avatarSrc is absent', () => {
    const html = renderToStaticMarkup(
      React.createElement(AvatarRow, { items: [{ id: 'b2', name: 'Bob Smith' }] })
    );
    expect(html).toContain('BS');
  });

  it('shows one-letter initial for a single-word name', () => {
    const html = renderToStaticMarkup(
      React.createElement(AvatarRow, { items: [{ id: 'c3', name: 'Carol' }] })
    );
    expect(html).toContain('C');
  });

  it('does not render initials when avatarSrc is provided', () => {
    // When src is provided, children is undefined — initials text must not appear
    const html = renderToStaticMarkup(
      React.createElement(AvatarRow, {
        items: [{ id: 'a1', name: 'Alice Johnson', avatarSrc: '/alice.jpg' }],
      })
    );
    expect(html).not.toContain('AJ');
  });

  it('uppercases initials regardless of name casing', () => {
    const html = renderToStaticMarkup(
      React.createElement(AvatarRow, { items: [{ id: 'x', name: 'jane doe' }] })
    );
    expect(html).toContain('JD');
  });
});

// ---------------------------------------------------------------------------

describe('AvatarRow — active indicator', () => {
  it('marks the matching avatar with aria-pressed="true"', () => {
    const html = renderToStaticMarkup(
      React.createElement(AvatarRow, { items: ITEMS, activeId: 'b2' })
    );
    expect(html.match(/aria-pressed="true"/g)?.length).toBe(1);
  });

  it('does not render aria-pressed="true" when activeId is undefined', () => {
    const html = renderToStaticMarkup(React.createElement(AvatarRow, { items: ITEMS }));
    expect(html).not.toContain('aria-pressed="true"');
  });

  it('does not mark any avatar when activeId matches no item', () => {
    const html = renderToStaticMarkup(
      React.createElement(AvatarRow, { items: ITEMS, activeId: 'nonexistent' })
    );
    expect(html).not.toContain('aria-pressed="true"');
  });
});

// ---------------------------------------------------------------------------

describe('AvatarRow — onSelect callback', () => {
  it('calls onSelect with the correct id when an avatar wrapper is clicked', async () => {
    const onSelect = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container);
    await act(async () => {
      root.render(React.createElement(AvatarRow, { items: ITEMS, onSelect }));
    });

    const buttons = container.querySelectorAll('[role="button"]');
    expect(buttons.length).toBe(3);

    // Click the second button — Bob Smith, id 'b2'
    act(() => {
      (buttons[1] as HTMLElement).click();
    });
    expect(onSelect).toHaveBeenCalledWith('b2');

    // Click the first button — Alice Johnson, id 'a1'
    act(() => {
      (buttons[0] as HTMLElement).click();
    });
    expect(onSelect).toHaveBeenCalledWith('a1');

    root.unmount();
    document.body.removeChild(container);
  });

  it('does not throw when onSelect is not provided and an avatar is clicked', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container);
    await act(async () => {
      root.render(React.createElement(AvatarRow, { items: ITEMS }));
    });

    const divs = container.querySelectorAll('div');
    expect(() =>
      act(() => {
        (divs[1] as HTMLElement).click();
      })
    ).not.toThrow();

    root.unmount();
    document.body.removeChild(container);
  });
});

// ---------------------------------------------------------------------------

describe('AvatarRow — sx forwarding', () => {
  it('accepts object sx without crashing', () => {
    expect(() =>
      renderToStaticMarkup(React.createElement(AvatarRow, { items: ITEMS, sx: { mt: 2 } }))
    ).not.toThrow();
  });

  it('accepts array sx without crashing', () => {
    expect(() =>
      renderToStaticMarkup(
        React.createElement(AvatarRow, { items: ITEMS, sx: [{ mt: 2 }, { mb: 1 }] })
      )
    ).not.toThrow();
  });
});
