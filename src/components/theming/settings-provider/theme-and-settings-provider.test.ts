// @vitest-environment jsdom
import React, { act } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ReactDOM from 'react-dom/client';

// -----------------------------------------------------------------------
// Mock useColorScheme — hoisted by Vitest before all imports.
// Spreads the real module so ThemeProvider, extendTheme, etc. remain intact.
// -----------------------------------------------------------------------
const mockSetMode = vi.fn();
vi.mock('@mui/material/styles', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    useColorScheme: () => ({ setMode: mockSetMode, mode: 'light', colorScheme: 'light' }),
  };
});

import { GiselleThemeAndSettingsProvider } from './theme-and-settings-provider';
import { GiselleSettingsProvider } from './settings-provider';
import { SettingsThemeBridge } from './settings-theme-bridge';
import { useGiselleSettings } from './settings-context';

// ----------------------------------------------------------------------

type TestSettings = { version: string; mode: 'light' | 'dark' | 'system'; fontSize: number };

const DEFAULTS: TestSettings = { version: '1', mode: 'light', fontSize: 14 };

let captured: ReturnType<typeof useGiselleSettings<TestSettings>> | null = null;

function Harness() {
  captured = useGiselleSettings<TestSettings>();
  return null;
}

// ----------------------------------------------------------------------

describe('SettingsThemeBridge', () => {
  beforeEach(() => {
    captured = null;
    mockSetMode.mockClear();
    window.localStorage.clear();
  });

  it('calls setMode with initial mode value', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          GiselleSettingsProvider<TestSettings>,
          { defaultSettings: DEFAULTS },
          React.createElement(SettingsThemeBridge<TestSettings>, {
            getMode: (s) => s.mode,
          })
        )
      );
    });
    expect(mockSetMode).toHaveBeenCalledWith('light');
    document.body.removeChild(container);
  });

  it('does not call setMode when getMode is not provided', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          GiselleSettingsProvider<TestSettings>,
          { defaultSettings: DEFAULTS },
          React.createElement(SettingsThemeBridge<TestSettings>, {})
        )
      );
    });
    expect(mockSetMode).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it('calls setMode with new value when settings mode changes', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          GiselleSettingsProvider<TestSettings>,
          { defaultSettings: DEFAULTS },
          React.createElement(SettingsThemeBridge<TestSettings>, { getMode: (s) => s.mode }),
          React.createElement(Harness)
        )
      );
    });

    expect(mockSetMode).toHaveBeenCalledWith('light');
    mockSetMode.mockClear();

    act(() => {
      captured!.setField('mode', 'dark');
    });

    expect(mockSetMode).toHaveBeenCalledWith('dark');
    document.body.removeChild(container);
  });

  it('does not call setMode when getMode returns undefined', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          GiselleSettingsProvider<TestSettings>,
          { defaultSettings: DEFAULTS },
          React.createElement(SettingsThemeBridge<TestSettings>, {
            getMode: () => undefined,
          })
        )
      );
    });
    expect(mockSetMode).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });
});

// ----------------------------------------------------------------------

describe('GiselleThemeAndSettingsProvider', () => {
  beforeEach(() => {
    captured = null;
    mockSetMode.mockClear();
    window.localStorage.clear();
  });

  it('renders children', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          GiselleThemeAndSettingsProvider<TestSettings>,
          { defaultSettings: DEFAULTS },
          React.createElement('span', { 'data-testid': 'child' }, 'ok')
        )
      );
    });
    expect(container.querySelector('[data-testid="child"]')).not.toBeNull();
    document.body.removeChild(container);
  });

  it('exposes settings state via useGiselleSettings', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          GiselleThemeAndSettingsProvider<TestSettings>,
          { defaultSettings: DEFAULTS },
          React.createElement(Harness)
        )
      );
    });
    expect(captured).not.toBeNull();
    expect(captured!.state).toEqual(DEFAULTS);
    document.body.removeChild(container);
  });

  it('syncs mode to MUI color scheme via getMode', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          GiselleThemeAndSettingsProvider<TestSettings>,
          { defaultSettings: DEFAULTS, getMode: (s) => s.mode },
          React.createElement(Harness)
        )
      );
    });
    expect(mockSetMode).toHaveBeenCalledWith('light');
    document.body.removeChild(container);
  });

  it('does not call setMode when getMode is omitted', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(GiselleThemeAndSettingsProvider<TestSettings>, {
          defaultSettings: DEFAULTS,
        })
      );
    });
    expect(mockSetMode).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it('syncs updated mode after setField call', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          GiselleThemeAndSettingsProvider<TestSettings>,
          { defaultSettings: DEFAULTS, getMode: (s) => s.mode },
          React.createElement(Harness)
        )
      );
    });

    mockSetMode.mockClear();

    act(() => {
      captured!.setField('mode', 'dark');
    });

    expect(mockSetMode).toHaveBeenCalledWith('dark');
    document.body.removeChild(container);
  });
});
