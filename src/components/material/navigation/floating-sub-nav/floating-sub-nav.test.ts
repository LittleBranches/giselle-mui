// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React, { act } from 'react';
import ReactDOM from 'react-dom/client';

import { renderWithTheme } from '../../../../test-utils';
import { GiselleThemeProvider } from '../../../../components/theming/theme-provider/giselle/giselle';
import { FloatingSubNav } from './floating-sub-nav';
import { pillVariants } from './floating-sub-nav.animations';
import { SubNavButton } from './sub-nav-button';

// framer-motion uses browser APIs — mock AnimatePresence and motion to plain wrappers
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  motion: new Proxy(
    {},
    {
      get:
        (_target, prop: string) =>
        ({ children, ...rest }: { children?: React.ReactNode; [key: string]: unknown }) =>
          React.createElement(prop, rest, children),
    }
  ),
}));

// ----------------------------------------------------------------------

const items = [
  {
    id: 'about',
    label: 'About',
    icon: React.createElement('span', { 'data-testid': 'icon-about' }),
  },
  { id: 'work', label: 'Work', icon: React.createElement('span', { 'data-testid': 'icon-work' }) },
];

describe('FloatingSubNav', () => {
  it('renders nav buttons when activeId is set', () => {
    const html = renderWithTheme(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    expect(html).toContain('About');
    expect(html).toContain('Work');
  });

  it('renders nothing when activeId is null', () => {
    const html = renderWithTheme(
      React.createElement(FloatingSubNav, {
        items,
        activeId: null,
        onSelect: vi.fn(),
      })
    );
    expect(html).not.toContain('About');
  });

  it('renders sticky variant without error', () => {
    expect(() =>
      renderWithTheme(
        React.createElement(FloatingSubNav, {
          items,
          activeId: 'about',
          onSelect: vi.fn(),
          sticky: true,
        })
      )
    ).not.toThrow();
  });

  it('renders icon slot content for each item', () => {
    const html = renderWithTheme(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    expect(html).toContain('icon-about');
    expect(html).toContain('icon-work');
  });

  it('sets aria-pressed=true on active item', () => {
    const html = renderWithTheme(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    expect(html).toContain('aria-pressed="true"');
  });
});

// ----------------------------------------------------------------------

describe('NavPill — animation variants', () => {
  it('renders into the DOM via FloatingSubNav without throwing', () => {
    const html = renderWithTheme(
      React.createElement(FloatingSubNav, {
        items,
        activeId: 'about',
        onSelect: vi.fn(),
      })
    );
    expect(html).toContain('aria-label="Section navigation"');
  });

  it('[regression] exit y-offset (10) is smaller than enter y-offset (20)', () => {
    // Intentional design rule: the pill exits with a shorter slide than it enters.
    // Entry feels like the pill is arriving; exit feels like a collapse, not a second entrance.
    const enterY = (pillVariants.initial as { y: number }).y;
    const exitY = (pillVariants.exit as { y: number }).y;
    expect(Math.abs(exitY)).toBeLessThan(Math.abs(enterY));
  });

  it('[regression] animate state has full opacity and zero offset', () => {
    const animate = pillVariants.animate as { opacity: number; y: number };
    expect(animate.opacity).toBe(1);
    expect(animate.y).toBe(0);
  });
});

// ----------------------------------------------------------------------

describe('SubNavButton', () => {
  const item = {
    id: 'about',
    label: 'About',
    icon: React.createElement('span', { 'data-testid': 'icon-about' }),
  };

  it('renders with correct aria-label', () => {
    const html = renderWithTheme(
      React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn() })
    );
    expect(html).toContain('aria-label="About"');
  });

  it('sets aria-pressed=false when inactive', () => {
    const html = renderWithTheme(
      React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn() })
    );
    expect(html).toContain('aria-pressed="false"');
  });

  it('sets aria-pressed=true when active', () => {
    const html = renderWithTheme(
      React.createElement(SubNavButton, { item, isActive: true, onPress: vi.fn() })
    );
    expect(html).toContain('aria-pressed="true"');
  });

  it('renders icon slot content', () => {
    const html = renderWithTheme(
      React.createElement(SubNavButton, { item, isActive: false, onPress: vi.fn() })
    );
    expect(html).toContain('icon-about');
  });

  it('calls onPress with item.id when clicked', () => {
    const handlePress = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);
    act(() => {
      root.render(
        React.createElement(
          GiselleThemeProvider,
          null,
          React.createElement(SubNavButton, { item, isActive: false, onPress: handlePress })
        )
      );
    });
    const button = container.querySelector('button');
    act(() => {
      button?.click();
    });
    expect(handlePress).toHaveBeenCalledWith('about');
    act(() => root.unmount());
    container.remove();
  });
});
