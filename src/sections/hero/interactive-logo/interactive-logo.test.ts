// @vitest-environment jsdom
import type { FadeTransition } from './types';

import React from 'react';
import { it, vi, expect, describe } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// ----------------------------------------------------------------------
// Mocks — hoisted before any imports below.

vi.mock('framer-motion', () => ({
  motion: { div: 'div', img: 'img' },
  m: { div: 'div', img: 'img' },
}));

vi.mock('@mui/material/Box', () => ({
  default: (rawProps: unknown) => {
    const props = rawProps as {
      component?: string;
      alt?: string;
      src?: string;
      children?: React.ReactNode;
    };
    const tag: string = props.component ?? 'div';
    return React.createElement(tag, { alt: props.alt, src: props.src }, props.children ?? null);
  },
}));

import { PortraitLayer } from './portrait-layer';
import { ArtisticLogoLayer } from './artistic-logo-layer';
import { OriginalLogoLayer } from './original-logo-layer';
import {
  getCursorStyle,
  getRandomPortraitSrc,
  buildPortraitSourceMap,
  getPortraitDirectionFromAngle,
} from './interactive-logo.utils';

// ----------------------------------------------------------------------

const FADE: FadeTransition = { duration: 0.3 };

// ----------------------------------------------------------------------
// getRandomPortraitSrc

describe('getRandomPortraitSrc', () => {
  it('returns a string value unchanged', () => {
    expect(getRandomPortraitSrc('foo')).toBe('foo');
  });

  it('returns the single element of a one-item array', () => {
    expect(getRandomPortraitSrc(['bar'])).toBe('bar');
  });

  it('returns a member of a multi-element array', () => {
    const variants = ['a', 'b', 'c'] as const;
    expect(variants).toContain(getRandomPortraitSrc(variants));
  });

  it('returns empty string for an empty array', () => {
    expect(getRandomPortraitSrc([])).toBe('');
  });
});

// ----------------------------------------------------------------------
// getPortraitDirectionFromAngle

describe('getPortraitDirectionFromAngle', () => {
  it('returns right for 0°', () => {
    expect(getPortraitDirectionFromAngle(0)).toBe('right');
  });

  it('returns down for 90°', () => {
    expect(getPortraitDirectionFromAngle(90)).toBe('down');
  });

  it('returns left for 180°', () => {
    expect(getPortraitDirectionFromAngle(180)).toBe('left');
  });

  it('returns left for −180°', () => {
    expect(getPortraitDirectionFromAngle(-180)).toBe('left');
  });

  it('returns up for −90°', () => {
    expect(getPortraitDirectionFromAngle(-90)).toBe('up');
  });

  it('returns down-right for 45°', () => {
    expect(getPortraitDirectionFromAngle(45)).toBe('down-right');
  });

  it('returns down-left for 135°', () => {
    expect(getPortraitDirectionFromAngle(135)).toBe('down-left');
  });

  it('returns up-right for −45°', () => {
    expect(getPortraitDirectionFromAngle(-45)).toBe('up-right');
  });

  it('returns up-left for −135°', () => {
    expect(getPortraitDirectionFromAngle(-135)).toBe('up-left');
  });

  it('[boundary] > 157.5 classifies as left', () => {
    expect(getPortraitDirectionFromAngle(158)).toBe('left');
  });

  it('[boundary] > −157.5 classifies as left', () => {
    expect(getPortraitDirectionFromAngle(-158)).toBe('left');
  });

  it('[boundary] exactly −157.5 classifies as left', () => {
    expect(getPortraitDirectionFromAngle(-157.5)).toBe('left');
  });
});

// ----------------------------------------------------------------------
// buildPortraitSourceMap

describe('buildPortraitSourceMap', () => {
  it('maps portraitSrc to the forward direction', () => {
    expect(buildPortraitSourceMap('face.jpg')).toEqual({ forward: 'face.jpg' });
  });

  it('maps portraitSources entries by direction', () => {
    expect(buildPortraitSourceMap(undefined, [{ direction: 'left', src: 'left.jpg' }])).toEqual({
      left: 'left.jpg',
    });
  });

  it('merges portraitSrc and portraitSources', () => {
    expect(buildPortraitSourceMap('face.jpg', [{ direction: 'right', src: 'right.jpg' }])).toEqual({
      forward: 'face.jpg',
      right: 'right.jpg',
    });
  });

  it('returns an empty map when neither argument is provided', () => {
    expect(buildPortraitSourceMap()).toEqual({});
  });

  it('skips portraitSources entries with an empty string src', () => {
    expect(buildPortraitSourceMap(undefined, [{ direction: 'up', src: '' }])).toEqual({});
  });
});

// ----------------------------------------------------------------------
// getCursorStyle

describe('getCursorStyle', () => {
  it('returns default when reducedMotion is true', () => {
    expect(getCursorStyle(true, false)).toBe('default');
  });

  it('returns default when reducedMotion is true even if pointer is down', () => {
    expect(getCursorStyle(true, true)).toBe('default');
  });

  it('returns grabbing when pointer is down and motion is not reduced', () => {
    expect(getCursorStyle(false, true)).toBe('grabbing');
  });

  it('returns grab when motion is not reduced and pointer is not down', () => {
    expect(getCursorStyle(false, false)).toBe('grab');
  });

  it('returns grab when reducedMotion is null (not yet determined)', () => {
    expect(getCursorStyle(null, false)).toBe('grab');
  });

  it('returns grabbing when reducedMotion is null and pointer is down', () => {
    expect(getCursorStyle(null, true)).toBe('grabbing');
  });
});

// ----------------------------------------------------------------------
// ArtisticLogoLayer

describe('ArtisticLogoLayer', () => {
  it('returns null when artisticLogoSrc is not provided', () => {
    expect(ArtisticLogoLayer({ showArtisticLogo: false, logoFadeTransition: FADE })).toBeNull();
  });

  it('uses logoAlt as the alt text when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(ArtisticLogoLayer, {
        artisticLogoSrc: '/artistic.png',
        showArtisticLogo: true,
        logoFadeTransition: FADE,
        logoAlt: 'Custom artistic logo',
      })
    );
    expect(html).toContain('Custom artistic logo');
  });

  it('falls back to Logo as the alt text when logoAlt is not provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(ArtisticLogoLayer, {
        artisticLogoSrc: '/artistic.png',
        showArtisticLogo: true,
        logoFadeTransition: FADE,
      })
    );
    expect(html).toContain('Logo');
  });
});

// ----------------------------------------------------------------------
// PortraitLayer

describe('PortraitLayer', () => {
  it('returns null when portraitSrc is not provided', () => {
    expect(
      PortraitLayer({ portraitAlt: 'portrait', showPortrait: false, portraitFadeTransition: FADE })
    ).toBeNull();
  });

  it('includes the portrait alt text in rendered HTML when a src is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(PortraitLayer, {
        portraitSrc: '/portrait.jpg',
        portraitAlt: 'Person facing left',
        showPortrait: true,
        portraitFadeTransition: FADE,
      })
    );
    expect(html).toContain('Person facing left');
  });
});

// ----------------------------------------------------------------------
// OriginalLogoLayer

describe('OriginalLogoLayer', () => {
  it('renders slotted children when no activeFrame is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        OriginalLogoLayer,
        { hoverPhase: 'idle', logoFadeTransition: FADE },
        React.createElement('span', { 'data-testid': 'slot' }, 'logo-child')
      )
    );
    expect(html).toContain('logo-child');
  });

  it('renders the frame image when activeFrame is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(OriginalLogoLayer, {
        hoverPhase: 'artistic',
        logoFadeTransition: FADE,
        activeFrame: '/frame-01.png',
        logoAlt: 'Frame logo',
      })
    );
    expect(html).toContain('/frame-01.png');
    expect(html).toContain('Frame logo');
  });

  it('uses Logo as alt fallback when no logoAlt provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(OriginalLogoLayer, {
        hoverPhase: 'artistic',
        logoFadeTransition: FADE,
        activeFrame: '/frame-01.png',
      })
    );
    expect(html).toContain('Logo');
  });
});
