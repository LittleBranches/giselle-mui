// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { transitionEnter, transitionExit } from './transition';
import { fade } from './fade';
import { container } from './container';
import { slide } from './slide';
import { scale } from './scale';
import { bounce } from './bounce';
import { rotate } from './rotate';
import { flip } from './flip';
import { zoom } from './zoom';
import { hover, tap, transitionHover, transitionTap } from './actions';

// ----------------------------------------------------------------------

describe('transitionEnter', () => {
  it('returns duration 0.64 by default', () => {
    expect(transitionEnter().duration).toBe(0.64);
  });

  it('merges custom overrides', () => {
    const t = transitionEnter({ duration: 0.3 });
    expect(t.duration).toBe(0.3);
  });
});

describe('transitionExit', () => {
  it('returns duration 0.48 by default', () => {
    expect(transitionExit().duration).toBe(0.48);
  });

  it('merges custom overrides', () => {
    const t = transitionExit({ duration: 0.2 });
    expect(t.duration).toBe(0.2);
  });
});

// ----------------------------------------------------------------------

describe('fade', () => {
  it('fade("in") has no x/y on initial', () => {
    const v = fade('in');
    expect((v.initial as Record<string, unknown>)['x']).toBeUndefined();
    expect((v.initial as Record<string, unknown>)['y']).toBeUndefined();
  });

  it('fade("inUp") initial.y equals default distance (120)', () => {
    const v = fade('inUp');
    expect((v.initial as Record<string, unknown>)['y']).toBe(120);
  });

  it('fade("inUp", { distance: 24 }) initial.y equals 24', () => {
    const v = fade('inUp', { distance: 24 });
    expect((v.initial as Record<string, unknown>)['y']).toBe(24);
  });

  it('fade("inDown") initial.y is negative default distance', () => {
    const v = fade('inDown');
    expect((v.initial as Record<string, unknown>)['y']).toBe(-120);
  });

  it('fade("inLeft") initial.x is negative default distance', () => {
    const v = fade('inLeft');
    expect((v.initial as Record<string, unknown>)['x']).toBe(-120);
  });

  it('fade("inRight") initial.x is positive default distance', () => {
    const v = fade('inRight');
    expect((v.initial as Record<string, unknown>)['x']).toBe(120);
  });

  it('fade("in") has initial, animate, exit keys', () => {
    const v = fade('in');
    expect(v).toHaveProperty('initial');
    expect(v).toHaveProperty('animate');
    expect(v).toHaveProperty('exit');
  });

  it('fade("out") has initial, animate, exit keys', () => {
    const v = fade('out');
    expect(v).toHaveProperty('initial');
    expect(v).toHaveProperty('animate');
    expect(v).toHaveProperty('exit');
  });
});

// ----------------------------------------------------------------------

describe('container', () => {
  it('animate.transition.staggerChildren is 0.05', () => {
    const v = container();
    const tx = (v.animate as { transition: Record<string, unknown> }).transition;
    expect(tx['staggerChildren']).toBe(0.05);
  });

  it('animate.transition.delayChildren is 0.05', () => {
    const v = container();
    const tx = (v.animate as { transition: Record<string, unknown> }).transition;
    expect(tx['delayChildren']).toBe(0.05);
  });

  it('exit.transition.staggerDirection is -1', () => {
    const v = container();
    const tx = (v.exit as { transition: Record<string, unknown> }).transition;
    expect(tx['staggerDirection']).toBe(-1);
  });
});

// ----------------------------------------------------------------------

describe('slide', () => {
  it('slide("inUp") initial.y equals default distance (160)', () => {
    const v = slide('inUp');
    expect((v.initial as Record<string, unknown>)['y']).toBe(160);
  });

  it('slide("inLeft") initial.x is negative default distance', () => {
    const v = slide('inLeft');
    expect((v.initial as Record<string, unknown>)['x']).toBe(-160);
  });

  it('slide has no opacity (pure positional)', () => {
    const v = slide('inUp');
    expect((v.initial as Record<string, unknown>)['opacity']).toBeUndefined();
  });
});

// ----------------------------------------------------------------------

describe('scale', () => {
  it('scale("in") initial.scale is 0', () => {
    const v = scale('in');
    expect((v.initial as Record<string, unknown>)['scale']).toBe(0);
  });

  it('scale("in") animate.scale is 1', () => {
    const v = scale('in');
    expect((v.animate as Record<string, unknown>)['scale']).toBe(1);
  });

  it('scale("inX") only scales on X axis (initial.scaleX = 0)', () => {
    const v = scale('inX');
    expect((v.initial as Record<string, unknown>)['scaleX']).toBe(0);
    expect((v.initial as Record<string, unknown>)['scaleY']).toBeUndefined();
  });
});

// ----------------------------------------------------------------------

describe('bounce', () => {
  it('bounce("in") animate.opacity starts at 0 (keyframe array)', () => {
    const v = bounce('in');
    const opacityFrames = (v.animate as Record<string, unknown>)['opacity'] as number[];
    expect(Array.isArray(opacityFrames)).toBe(true);
    expect(opacityFrames[0]).toBe(0);
  });

  it('bounce("inUp") initial.y is an array (keyframes)', () => {
    const v = bounce('inUp');
    expect(Array.isArray((v.animate as Record<string, unknown>)['y'])).toBe(true);
  });
});

// ----------------------------------------------------------------------

describe('rotate', () => {
  it('rotate("in") initial.rotate equals negative default degrees', () => {
    const v = rotate('in');
    expect((v.initial as Record<string, unknown>)['rotate']).toBe(-360);
  });

  it('rotate("in") animate.rotate is 0', () => {
    const v = rotate('in');
    expect((v.animate as Record<string, unknown>)['rotate']).toBe(0);
  });
});

// ----------------------------------------------------------------------

describe('flip', () => {
  it('flip("inX") initial.rotateX is -180', () => {
    const v = flip('inX');
    expect((v.initial as Record<string, unknown>)['rotateX']).toBe(-180);
  });

  it('flip("inY") initial.rotateY is -180', () => {
    const v = flip('inY');
    expect((v.initial as Record<string, unknown>)['rotateY']).toBe(-180);
  });

  it('flip("inX") animate.rotateX is 0', () => {
    const v = flip('inX');
    expect((v.animate as Record<string, unknown>)['rotateX']).toBe(0);
  });

  it('flip("outX") has no exit key', () => {
    const v = flip('outX');
    expect(v).not.toHaveProperty('exit');
  });
});

// ----------------------------------------------------------------------

describe('zoom', () => {
  it('zoom("in") initial.scale is 0', () => {
    const v = zoom('in');
    expect((v.initial as Record<string, unknown>)['scale']).toBe(0);
  });

  it('zoom("inUp") initial.translateY equals default distance (720)', () => {
    const v = zoom('inUp');
    expect((v.initial as Record<string, unknown>)['translateY']).toBe(720);
  });

  it('zoom("inUp", { distance: 100 }) initial.translateY equals 100', () => {
    const v = zoom('inUp', { distance: 100 });
    expect((v.initial as Record<string, unknown>)['translateY']).toBe(100);
  });

  it('zoom("out") has no exit key', () => {
    const v = zoom('out');
    expect(v).not.toHaveProperty('exit');
  });
});

// ----------------------------------------------------------------------

describe('hover', () => {
  it('returns { scale: 1.09 } by default', () => {
    expect(hover()).toEqual({ scale: 1.09 });
  });

  it('accepts a custom scale value', () => {
    expect(hover(1.05)).toEqual({ scale: 1.05 });
  });
});

describe('tap', () => {
  it('returns { scale: 0.9 } by default', () => {
    expect(tap()).toEqual({ scale: 0.9 });
  });

  it('accepts a custom scale value', () => {
    expect(tap(0.95)).toEqual({ scale: 0.95 });
  });
});

describe('transitionHover', () => {
  it('returns duration 0.32 by default', () => {
    expect(transitionHover().duration).toBe(0.32);
  });

  it('merges overrides', () => {
    expect(transitionHover({ duration: 0.1 }).duration).toBe(0.1);
  });
});

describe('transitionTap', () => {
  it('returns type spring by default', () => {
    expect(transitionTap().type).toBe('spring');
  });

  it('returns stiffness 400 by default', () => {
    expect(transitionTap().stiffness).toBe(400);
  });
});
