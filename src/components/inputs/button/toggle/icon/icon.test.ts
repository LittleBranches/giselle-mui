// @vitest-environment jsdom
/**
 * Tests for ToggleIconButton.
 *
 * Icon visibility is driven entirely by CSS (`rootSx` selectors).
 * All three icon spans (`.ti-idle`, `.ti-pressed`, `.ti-hover`) are always present
 * in the DOM — the browser applies the CSS rules. jsdom does not execute CSS,
 * so these tests verify the structural contract and `aria-pressed` semantics;
 * visual switching is covered by the Storybook stories and manual inspection.
 */
import { describe, it, expect, vi } from 'vitest';
import { createElement, useState, act } from 'react';
import ReactDOM from 'react-dom/client';

import { TOGGLE_ICON_SIZE, TOGGLE_MIN_TOUCH_TARGET } from './icon.const';
import { ToggleIconButton } from './icon';

// Distinct test icons — identifiable by data-testid.
const IDLE_ICON = createElement('svg', { 'data-testid': 'idle-icon' });
const PRESSED_ICON = createElement('svg', { 'data-testid': 'pressed-icon' });
const HOVER_ICON = createElement('svg', { 'data-testid': 'hover-icon' });

// Controlled wrapper used in the two-click toggle test.
function ToggleWrapper() {
  const [pressed, setPressed] = useState(false);
  return createElement(ToggleIconButton, {
    pressed,
    idleIcon: IDLE_ICON,
    onPressedChange: setPressed,
  });
}

function setup() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);
  return {
    div,
    root,
    cleanup: () => {
      act(() => root.unmount());
      div.remove();
    },
  };
}

// ---------------------------------------------------------------------------
// Structure: all three spans always present in the DOM
// ---------------------------------------------------------------------------

describe('ToggleIconButton — CSS-only icon structure', () => {
  it('renders all three icon spans in the DOM regardless of pressed state', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(
        createElement(ToggleIconButton, {
          pressed: false,
          idleIcon: IDLE_ICON,
          pressedIcon: PRESSED_ICON,
          hoverIcon: HOVER_ICON,
          onPressedChange: undefined,
        })
      );
    });

    // All three spans present — CSS (not JS) controls which is visible.
    expect(div.querySelector('.ti-idle')).not.toBeNull();
    expect(div.querySelector('.ti-pressed')).not.toBeNull();
    expect(div.querySelector('.ti-hover')).not.toBeNull();

    // Each span contains the correct icon.
    expect(div.querySelector('.ti-idle [data-testid="idle-icon"]')).not.toBeNull();
    expect(div.querySelector('.ti-pressed [data-testid="pressed-icon"]')).not.toBeNull();
    expect(div.querySelector('.ti-hover [data-testid="hover-icon"]')).not.toBeNull();

    cleanup();
  });

  it('renders all three spans when pressed=true as well', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(
        createElement(ToggleIconButton, {
          pressed: true,
          idleIcon: IDLE_ICON,
          pressedIcon: PRESSED_ICON,
          hoverIcon: HOVER_ICON,
          onPressedChange: undefined,
        })
      );
    });

    expect(div.querySelector('.ti-idle')).not.toBeNull();
    expect(div.querySelector('.ti-pressed')).not.toBeNull();
    expect(div.querySelector('.ti-hover')).not.toBeNull();

    cleanup();
  });
});

// ---------------------------------------------------------------------------
// aria-pressed reflects pressed state
// ---------------------------------------------------------------------------

describe('ToggleIconButton — aria-pressed semantics', () => {
  it('sets aria-pressed=false when pressed=false', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(
        createElement(ToggleIconButton, {
          pressed: false,
          idleIcon: IDLE_ICON,
          onPressedChange: undefined,
        })
      );
    });

    const button = div.querySelector('button')!;
    expect(button.getAttribute('aria-pressed')).toBe('false');

    cleanup();
  });

  it('sets aria-pressed=true when pressed=true', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(
        createElement(ToggleIconButton, {
          pressed: true,
          idleIcon: IDLE_ICON,
          onPressedChange: undefined,
        })
      );
    });

    const button = div.querySelector('button')!;
    expect(button.getAttribute('aria-pressed')).toBe('true');

    cleanup();
  });
});

// ---------------------------------------------------------------------------
// Click calls onPressedChange with the toggled value
// ---------------------------------------------------------------------------

describe('ToggleIconButton — click interaction', () => {
  it('calls onPressedChange(!pressed) on click when pressed=false', async () => {
    const { div, root, cleanup } = setup();
    const handler = vi.fn();

    await act(async () => {
      root.render(
        createElement(ToggleIconButton, {
          pressed: false,
          idleIcon: IDLE_ICON,
          onPressedChange: handler,
        })
      );
    });

    const button = div.querySelector('button')!;
    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(true);

    cleanup();
  });

  it('calls onPressedChange(!pressed) on click when pressed=true', async () => {
    const { div, root, cleanup } = setup();
    const handler = vi.fn();

    await act(async () => {
      root.render(
        createElement(ToggleIconButton, {
          pressed: true,
          idleIcon: IDLE_ICON,
          onPressedChange: handler,
        })
      );
    });

    const button = div.querySelector('button')!;
    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith(false);

    cleanup();
  });

  it('toggles aria-pressed through a controlled wrapper on two clicks', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(createElement(ToggleWrapper, null));
    });

    const button = div.querySelector('button')!;
    expect(button.getAttribute('aria-pressed')).toBe('false');

    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(button.getAttribute('aria-pressed')).toBe('true');

    await act(async () => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(button.getAttribute('aria-pressed')).toBe('false');

    cleanup();
  });
});

// ---------------------------------------------------------------------------
// Readability — minimum size constants
// ---------------------------------------------------------------------------

describe('readability — minimum size constants', () => {
  it('[regression] TOGGLE_ICON_SIZE >= 20px (WCAG 1.4.11 interactive icons)', () => {
    expect(TOGGLE_ICON_SIZE).toBeGreaterThanOrEqual(20);
  });

  it('[regression] TOGGLE_MIN_TOUCH_TARGET >= 24px (WCAG 2.5.8 touch target)', () => {
    expect(TOGGLE_MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(24);
  });
});
