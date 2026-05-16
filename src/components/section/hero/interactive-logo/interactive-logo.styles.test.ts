// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { Theme } from '@mui/material/styles';

import {
  rootBoxSx,
  artisticLogoSx,
  originalLayerSx,
  portraitWrapperSx,
  portraitImageSx,
  innerContainerSx,
  logoStack3dWrapperSx,
} from './interactive-logo.styles';

// ----------------------------------------------------------------------

const mockTheme = {} as unknown as Theme;

/**
 * Helper: call an SxProps factory with the mock theme to get a plain object.
 */
function callSx(sx: unknown): Record<string, unknown> {
  return typeof sx === 'function'
    ? (sx as (t: Theme) => Record<string, unknown>)(mockTheme)
    : (sx as Record<string, unknown>);
}

// ----------------------------------------------------------------------

describe('rootBoxSx', () => {
  it('sets perspective to 1200', () => {
    const styles = callSx(rootBoxSx('grab'));
    expect(styles.perspective).toBe(1200);
  });

  it('forwards the cursor value', () => {
    expect(callSx(rootBoxSx('grab')).cursor).toBe('grab');
    expect(callSx(rootBoxSx('grabbing')).cursor).toBe('grabbing');
    expect(callSx(rootBoxSx('default')).cursor).toBe('default');
  });

  it('sets overflow to visible', () => {
    expect(callSx(rootBoxSx('grab')).overflow).toBe('visible');
  });
});

describe('artisticLogoSx', () => {
  it('is positioned absolute', () => {
    expect(callSx(artisticLogoSx).position).toBe('absolute');
  });

  it('has zIndex 2', () => {
    expect(callSx(artisticLogoSx).zIndex).toBe(2);
  });

  it('has pointerEvents none', () => {
    expect(callSx(artisticLogoSx).pointerEvents).toBe('none');
  });
});

describe('originalLayerSx', () => {
  it('has zIndex 1', () => {
    expect(callSx(originalLayerSx).zIndex).toBe(1);
  });

  it('occupies full width and height', () => {
    expect(callSx(originalLayerSx).width).toBe(1);
    expect(callSx(originalLayerSx).height).toBe(1);
  });
});

describe('portraitWrapperSx', () => {
  it('is positioned absolute', () => {
    expect(callSx(portraitWrapperSx).position).toBe('absolute');
  });

  it('has zIndex 3 (highest layer)', () => {
    expect(callSx(portraitWrapperSx).zIndex).toBe(3);
  });

  it('has pointerEvents none', () => {
    expect(callSx(portraitWrapperSx).pointerEvents).toBe('none');
  });
});

describe('portraitImageSx', () => {
  it('uses objectFit contain', () => {
    expect(callSx(portraitImageSx).objectFit).toBe('contain');
  });
});

describe('innerContainerSx', () => {
  it('has position relative', () => {
    expect(callSx(innerContainerSx).position).toBe('relative');
  });

  it('uses preserve-3d transformStyle', () => {
    expect(callSx(innerContainerSx).transformStyle).toBe('preserve-3d');
  });
});

describe('logoStack3dWrapperSx', () => {
  it('has position relative', () => {
    expect(callSx(logoStack3dWrapperSx).position).toBe('relative');
  });
});
