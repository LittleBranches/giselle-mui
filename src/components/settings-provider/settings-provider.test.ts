// @vitest-environment jsdom
import React, { act } from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ReactDOM from 'react-dom/client';

import { GiselleSettingsProvider } from './settings-provider';
import { useGiselleSettings } from './settings-context';

// ----------------------------------------------------------------------

type TestSettings = {
  version: string;
  mode: 'light' | 'dark';
  fontSize: number;
};

const DEFAULTS: TestSettings = { version: '1', mode: 'light', fontSize: 14 };
const STORAGE_KEY = 'test-settings';

// Harness captures hook output via module-level variable (same pattern as use-local-storage.test.ts)
let captured: ReturnType<typeof useGiselleSettings<TestSettings>> | null = null;

function Harness() {
  captured = useGiselleSettings<TestSettings>();
  return null;
}

function renderProvider(
  overrides: Partial<{
    defaultSettings: TestSettings;
    initialState: TestSettings;
    storageKey: string;
  }> = {}
): HTMLDivElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  act(() => {
    ReactDOM.createRoot(container).render(
      React.createElement(GiselleSettingsProvider<TestSettings>, {
        defaultSettings: DEFAULTS,
        storageKey: STORAGE_KEY,
        children: React.createElement(Harness),
        ...overrides,
      })
    );
  });
  return container;
}

// ----------------------------------------------------------------------

describe('GiselleSettingsProvider — initial state', () => {
  beforeEach(() => {
    captured = null;
    window.localStorage.clear();
  });

  afterEach(({ task }) => {
    // Remove any containers appended during the test
    document.body.querySelectorAll('div').forEach((el) => el.remove());
    if (task.result?.state !== 'pass') window.localStorage.clear();
  });

  it('provides default state when nothing is stored', () => {
    renderProvider();
    expect(captured?.state).toEqual(DEFAULTS);
  });

  it('reads stored settings when version matches', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: '1', mode: 'dark', fontSize: 20 })
    );
    renderProvider();
    expect(captured?.state.mode).toBe('dark');
    expect(captured?.state.fontSize).toBe(20);
  });

  it('resets to defaults and clears storage on version mismatch', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: '0', mode: 'dark', fontSize: 20 })
    );
    renderProvider();
    expect(captured?.state).toEqual(DEFAULTS);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('initialState prop takes priority over storage', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: '1', mode: 'dark', fontSize: 20 })
    );
    const serverState: TestSettings = { version: '1', mode: 'light', fontSize: 14 };
    renderProvider({ initialState: serverState });
    expect(captured?.state.mode).toBe('light');
  });
});

// ----------------------------------------------------------------------

describe('GiselleSettingsProvider — canReset', () => {
  beforeEach(() => {
    captured = null;
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.querySelectorAll('div').forEach((el) => el.remove());
  });

  it('canReset is false when state equals defaults', () => {
    renderProvider();
    expect(captured?.canReset).toBe(false);
  });

  it('canReset becomes true after setField', () => {
    renderProvider();
    act(() => {
      captured?.setField('mode', 'dark');
    });
    expect(captured?.canReset).toBe(true);
  });

  it('canReset returns false after onReset', () => {
    renderProvider();
    act(() => {
      captured?.setField('mode', 'dark');
    });
    act(() => {
      captured?.onReset();
    });
    expect(captured?.canReset).toBe(false);
  });
});

// ----------------------------------------------------------------------

describe('GiselleSettingsProvider — setField', () => {
  beforeEach(() => {
    captured = null;
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.querySelectorAll('div').forEach((el) => el.remove());
  });

  it('updates a single field', () => {
    renderProvider();
    act(() => {
      captured?.setField('mode', 'dark');
    });
    expect(captured?.state.mode).toBe('dark');
    expect(captured?.state.fontSize).toBe(14); // unchanged
  });

  it('persists the updated field to localStorage', () => {
    renderProvider();
    act(() => {
      captured?.setField('fontSize', 18);
    });
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(stored.fontSize).toBe(18);
  });
});

// ----------------------------------------------------------------------

describe('GiselleSettingsProvider — setState', () => {
  beforeEach(() => {
    captured = null;
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.querySelectorAll('div').forEach((el) => el.remove());
  });

  it('partially merges state', () => {
    renderProvider();
    act(() => {
      captured?.setState({ fontSize: 18 });
    });
    expect(captured?.state.fontSize).toBe(18);
    expect(captured?.state.mode).toBe('light'); // unchanged
  });

  it('persists partial update to localStorage', () => {
    renderProvider();
    act(() => {
      captured?.setState({ mode: 'dark' });
    });
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(stored.mode).toBe('dark');
  });
});

// ----------------------------------------------------------------------

describe('GiselleSettingsProvider — onReset', () => {
  beforeEach(() => {
    captured = null;
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.querySelectorAll('div').forEach((el) => el.remove());
  });

  it('returns state to defaults', () => {
    renderProvider();
    act(() => {
      captured?.setField('mode', 'dark');
    });
    act(() => {
      captured?.onReset();
    });
    expect(captured?.state).toEqual(DEFAULTS);
  });

  it('clears localStorage on reset', () => {
    renderProvider();
    act(() => {
      captured?.setField('mode', 'dark');
    });
    act(() => {
      captured?.onReset();
    });
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

// ----------------------------------------------------------------------

describe('GiselleSettingsProvider — drawer state', () => {
  beforeEach(() => {
    captured = null;
    window.localStorage.clear();
  });

  afterEach(() => {
    document.body.querySelectorAll('div').forEach((el) => el.remove());
  });

  it('drawer is closed by default', () => {
    renderProvider();
    expect(captured?.openDrawer).toBe(false);
  });

  it('onToggleDrawer opens the drawer', () => {
    renderProvider();
    act(() => {
      captured?.onToggleDrawer();
    });
    expect(captured?.openDrawer).toBe(true);
  });

  it('onToggleDrawer called twice closes the drawer', () => {
    renderProvider();
    act(() => {
      captured?.onToggleDrawer();
    });
    act(() => {
      captured?.onToggleDrawer();
    });
    expect(captured?.openDrawer).toBe(false);
  });

  it('onCloseDrawer closes an open drawer', () => {
    renderProvider();
    act(() => {
      captured?.onToggleDrawer();
    });
    act(() => {
      captured?.onCloseDrawer();
    });
    expect(captured?.openDrawer).toBe(false);
  });
});
