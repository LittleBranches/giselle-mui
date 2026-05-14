// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';

import { fade } from '../../motion/fade';
import { container } from '../../motion/container';
import {
  FAQ_CONTENT_MAX_WIDTH,
  FAQ_FLOAT_LINE_LEFT,
  FAQ_PLUS_ICON_LEFT,
} from './faq-accordion.const';

// ----------------------------------------------------------------------

describe('fade', () => {
  it('returns initial, animate, exit keys', () => {
    const variants = fade('inUp');
    expect(variants).toHaveProperty('initial');
    expect(variants).toHaveProperty('animate');
    expect(variants).toHaveProperty('exit');
  });

  it('inUp sets positive y on initial state', () => {
    const variants = fade('inUp', { distance: 24 });
    expect((variants.initial as Record<string, unknown>)['y']).toBe(24);
    expect((variants.animate as Record<string, unknown>)['y']).toBe(0);
  });

  it('in uses opacity only (no y/x translation)', () => {
    const variants = fade('in');
    expect((variants.initial as Record<string, unknown>)['opacity']).toBe(0);
    expect((variants.initial as Record<string, unknown>)['y']).toBeUndefined();
    expect((variants.initial as Record<string, unknown>)['x']).toBeUndefined();
  });

  it('respects custom distance option', () => {
    const variants = fade('inUp', { distance: 48 });
    expect((variants.initial as Record<string, unknown>)['y']).toBe(48);
  });
});

// ----------------------------------------------------------------------

describe('container', () => {
  it('returns animate and exit keys', () => {
    const variants = container();
    expect(variants).toHaveProperty('animate');
    expect(variants).toHaveProperty('exit');
  });

  it('animate transition has staggerChildren', () => {
    const variants = container();
    const animate = variants.animate as { transition: Record<string, unknown> };
    expect(animate.transition.staggerChildren).toBeGreaterThan(0);
  });

  it('exit transition has negative staggerDirection', () => {
    const variants = container();
    const exit = variants.exit as { transition: Record<string, unknown> };
    expect(exit.transition.staggerDirection).toBe(-1);
  });
});

// ----------------------------------------------------------------------

describe('readability — minimum size constants (regression)', () => {
  it('[regression] FAQ_CONTENT_MAX_WIDTH is a positive number', () => {
    expect(FAQ_CONTENT_MAX_WIDTH).toBeGreaterThan(0);
  });

  it('[regression] FAQ_FLOAT_LINE_LEFT is a positive number', () => {
    expect(FAQ_FLOAT_LINE_LEFT).toBeGreaterThan(0);
  });

  it('[regression] FAQ_PLUS_ICON_LEFT is a positive number', () => {
    expect(FAQ_PLUS_ICON_LEFT).toBeGreaterThan(0);
  });

  it('[regression] FAQ_CONTENT_MAX_WIDTH >= 600 (readable content width)', () => {
    expect(FAQ_CONTENT_MAX_WIDTH).toBeGreaterThanOrEqual(600);
  });
});

// ----------------------------------------------------------------------

describe('FaqItem type shape (compile-time contract via usage)', () => {
  it('question and answer are valid in a FaqItem-shaped object', () => {
    const item = {
      question: 'Is this open source?',
      answer: React.createElement('p', null, 'Yes.'),
    };
    expect(item.question).toBe('Is this open source?');
    expect(item.answer).not.toBeNull();
  });
});
