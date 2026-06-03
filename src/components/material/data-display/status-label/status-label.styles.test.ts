// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { Theme } from '@mui/material/styles';

import { statusChipSx } from './status-label.styles';
import { STATUS_LABEL_HEIGHT, STATUS_LABEL_FONT_SIZE } from './status-label.const';

// ---------------------------------------------------------------------------
// Minimal mock theme — only the channels needed by statusChipSx
// ---------------------------------------------------------------------------

const mockTheme = {
  vars: {
    palette: {
      success: { mainChannel: 'var(--mui-palette-success-mainChannel)' },
      warning: { mainChannel: 'var(--mui-palette-warning-mainChannel)' },
      info: { mainChannel: 'var(--mui-palette-info-mainChannel)' },
      error: { mainChannel: 'var(--mui-palette-error-mainChannel)' },
      grey: { '500Channel': 'var(--mui-palette-grey-500Channel)' },
    },
  },
} as unknown as Theme;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type ThemeFn = (theme: Theme) => Record<string, unknown>;
type SxObject = Record<string, unknown>;

function resolveThemeFn(color: Exclude<Parameters<typeof statusChipSx>[0], 'default'>) {
  return (statusChipSx(color) as ThemeFn)(mockTheme);
}

function resolveStatic(color: 'default') {
  return statusChipSx(color) as SxObject;
}

// ---------------------------------------------------------------------------
// statusChipSx — semantic palette keys (theme function)
// ---------------------------------------------------------------------------

describe('statusChipSx — semantic colors', () => {
  it.each(['success', 'warning', 'info', 'error'] as const)(
    '%s: backgroundColor uses mainChannel at 0.16 alpha',
    (color) => {
      expect(resolveThemeFn(color).backgroundColor).toBe(
        `rgba(var(--mui-palette-${color}-mainChannel) / 0.16)`
      );
    }
  );

  it.each(['success', 'warning', 'info', 'error'] as const)(
    '%s: text color is <color>.dark',
    (color) => {
      expect(resolveThemeFn(color).color).toBe(`${color}.dark`);
    }
  );
});

// ---------------------------------------------------------------------------
// statusChipSx — default (inactive) — plain object, no theme needed
// ---------------------------------------------------------------------------

describe('statusChipSx — default color', () => {
  it('backgroundColor uses grey 500Channel CSS var at 0.16 alpha', () => {
    expect(resolveStatic('default').backgroundColor).toBe(
      'rgba(var(--mui-palette-grey-500Channel) / 0.16)'
    );
  });

  it('text color is text.secondary', () => {
    expect(resolveStatic('default').color).toBe('text.secondary');
  });
});

// ---------------------------------------------------------------------------
// statusChipSx — shared base tokens
// ---------------------------------------------------------------------------

describe('statusChipSx — base tokens', () => {
  it('height matches STATUS_LABEL_HEIGHT', () => {
    expect(resolveThemeFn('success').height).toBe(STATUS_LABEL_HEIGHT);
  });

  it('fontSize matches STATUS_LABEL_FONT_SIZE', () => {
    expect(resolveThemeFn('success').fontSize).toBe(STATUS_LABEL_FONT_SIZE);
  });

  it('fontWeight is 700 (bold at small sizes)', () => {
    expect(resolveThemeFn('success').fontWeight).toBe(700);
  });

  it('label padding enforced via MuiChip-label selector', () => {
    const label = resolveThemeFn('success')['& .MuiChip-label'] as Record<string, unknown>;
    expect(label.px).toBe(1);
  });

  it('default color also applies height', () => {
    expect(resolveStatic('default').height).toBe(STATUS_LABEL_HEIGHT);
  });
});
