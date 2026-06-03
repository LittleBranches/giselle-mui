// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { iconActionBarRootSx } from './icon-action-bar.styles';

// ----------------------------------------------------------------------

describe('iconActionBarRootSx', () => {
  it('is a static SxProps object (not a function)', () => {
    expect(typeof iconActionBarRootSx).toBe('object');
  });

  it('sets display flex', () => {
    expect((iconActionBarRootSx as Record<string, unknown>)['display']).toBe('flex');
  });

  it('sets full width via width: 1', () => {
    expect((iconActionBarRootSx as Record<string, unknown>)['width']).toBe(1);
  });

  it('sets flexGrow: 1 so it fills available space', () => {
    expect((iconActionBarRootSx as Record<string, unknown>)['flexGrow']).toBe(1);
  });

  it('has gap: 1 between action items', () => {
    expect((iconActionBarRootSx as Record<string, unknown>)['gap']).toBe(1);
  });
});
