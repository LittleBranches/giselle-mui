// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { resolveMaturityColor, resolveMaturityLabel } from './maturity-utils';

// ----------------------------------------------------------------------

describe('resolveMaturityColor', () => {
  it('returns error for 0%', () => {
    expect(resolveMaturityColor(0)).toBe('error');
  });

  it('returns error for 19%', () => {
    expect(resolveMaturityColor(19)).toBe('error');
  });

  it('returns warning for 20%', () => {
    expect(resolveMaturityColor(20)).toBe('warning');
  });

  it('returns warning for 39%', () => {
    expect(resolveMaturityColor(39)).toBe('warning');
  });

  it('returns info for 40%', () => {
    expect(resolveMaturityColor(40)).toBe('info');
  });

  it('returns info for 59%', () => {
    expect(resolveMaturityColor(59)).toBe('info');
  });

  it('returns primary for 60%', () => {
    expect(resolveMaturityColor(60)).toBe('primary');
  });

  it('returns primary for 79%', () => {
    expect(resolveMaturityColor(79)).toBe('primary');
  });

  it('returns success for 80%', () => {
    expect(resolveMaturityColor(80)).toBe('success');
  });

  it('returns success for 100%', () => {
    expect(resolveMaturityColor(100)).toBe('success');
  });

  it('[regression] clamps below 0 to error', () => {
    expect(resolveMaturityColor(-10)).toBe('error');
  });

  it('[regression] clamps above 100 to success', () => {
    expect(resolveMaturityColor(120)).toBe('success');
  });
});

// ----------------------------------------------------------------------

describe('resolveMaturityLabel', () => {
  it('returns Not started for 0%', () => {
    expect(resolveMaturityLabel(0)).toBe('Not started');
  });

  it('returns Early stage for 25%', () => {
    expect(resolveMaturityLabel(25)).toBe('Early stage');
  });

  it('returns In progress for 50%', () => {
    expect(resolveMaturityLabel(50)).toBe('In progress');
  });

  it('returns Nearly ready for 70%', () => {
    expect(resolveMaturityLabel(70)).toBe('Nearly ready');
  });

  it('returns Stable for 85%', () => {
    expect(resolveMaturityLabel(85)).toBe('Stable');
  });
});
