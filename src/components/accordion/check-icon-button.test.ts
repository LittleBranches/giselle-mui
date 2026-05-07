// @vitest-environment jsdom
/**
 * Tests for CheckIconButton.
 *
 * Icon visibility is driven entirely by CSS (`checkIconButtonSx` selectors).
 * All three icon spans (`.ci-idle`, `.ci-done`, `.ci-hover`) are always present
 * in the DOM — the browser applies the CSS rules. jsdom does not execute CSS,
 * so these tests verify the structural contract and `aria-pressed` semantics;
 * visual switching is covered by the Storybook stories and manual inspection.
 */
import { describe, it, expect, vi } from 'vitest';
import { createElement, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { act } from 'react';

import { CheckIconButton } from './check-icon-button';

// Distinct test icons — identifiable by data-testid.
const IDLE_ICON = createElement('svg', { 'data-testid': 'idle-icon' });
const DONE_ICON = createElement('svg', { 'data-testid': 'done-icon' });
const HOVER_ICON = createElement('svg', { 'data-testid': 'hover-icon' });

function setup() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const root = ReactDOM.createRoot(div);
  return {
    div,
    root,
    cleanup: () => {
      root.unmount();
      div.remove();
    },
  };
}

// ---------------------------------------------------------------------------
// Structure: all three spans always present in the DOM
// ---------------------------------------------------------------------------

describe('CheckIconButton — CSS-only icon structure', () => {
  it('renders all three icon spans in the DOM regardless of done state', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(
        createElement(CheckIconButton, {
          done: false,
          checkIcon: IDLE_ICON,
          checkDoneIcon: DONE_ICON,
          checkHoverIcon: HOVER_ICON,
          onDoneButtonClick: undefined,
        })
      );
    });

    // All three spans present — CSS (not JS) controls which is visible.
    expect(div.querySelector('.ci-idle')).not.toBeNull();
    expect(div.querySelector('.ci-done')).not.toBeNull();
    expect(div.querySelector('.ci-hover')).not.toBeNull();

    // Each span contains the correct icon.
    expect(div.querySelector('.ci-idle [data-testid="idle-icon"]')).not.toBeNull();
    expect(div.querySelector('.ci-done [data-testid="done-icon"]')).not.toBeNull();
    expect(div.querySelector('.ci-hover [data-testid="hover-icon"]')).not.toBeNull();

    cleanup();
  });

  it('renders all three spans when done=true as well', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(
        createElement(CheckIconButton, {
          done: true,
          checkIcon: IDLE_ICON,
          checkDoneIcon: DONE_ICON,
          checkHoverIcon: HOVER_ICON,
          onDoneButtonClick: undefined,
        })
      );
    });

    expect(div.querySelector('.ci-idle')).not.toBeNull();
    expect(div.querySelector('.ci-done')).not.toBeNull();
    expect(div.querySelector('.ci-hover')).not.toBeNull();

    cleanup();
  });
});

// ---------------------------------------------------------------------------
// aria-pressed reflects done state
// ---------------------------------------------------------------------------

describe('CheckIconButton — aria-pressed semantics', () => {
  it('sets aria-pressed=false when done=false', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(
        createElement(CheckIconButton, {
          done: false,
          checkIcon: IDLE_ICON,
          onDoneButtonClick: undefined,
        })
      );
    });

    const button = div.querySelector('button')!;
    expect(button.getAttribute('aria-pressed')).toBe('false');

    cleanup();
  });

  it('sets aria-pressed=true when done=true', async () => {
    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(
        createElement(CheckIconButton, {
          done: true,
          checkIcon: IDLE_ICON,
          onDoneButtonClick: undefined,
        })
      );
    });

    const button = div.querySelector('button')!;
    expect(button.getAttribute('aria-pressed')).toBe('true');

    cleanup();
  });
});

// ---------------------------------------------------------------------------
// Click calls onDoneButtonClick with the toggled value
// ---------------------------------------------------------------------------

describe('CheckIconButton — click interaction', () => {
  it('calls onDoneButtonClick(!done) on click when done=false', async () => {
    const { div, root, cleanup } = setup();
    const handler = vi.fn();

    await act(async () => {
      root.render(
        createElement(CheckIconButton, {
          done: false,
          checkIcon: IDLE_ICON,
          onDoneButtonClick: handler,
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

  it('calls onDoneButtonClick(!done) on click when done=true', async () => {
    const { div, root, cleanup } = setup();
    const handler = vi.fn();

    await act(async () => {
      root.render(
        createElement(CheckIconButton, {
          done: true,
          checkIcon: IDLE_ICON,
          onDoneButtonClick: handler,
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
    function Wrapper() {
      const [done, setDone] = useState(false);
      return createElement(CheckIconButton, {
        done,
        checkIcon: IDLE_ICON,
        onDoneButtonClick: setDone,
      });
    }

    const { div, root, cleanup } = setup();
    await act(async () => {
      root.render(createElement(Wrapper, null));
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
