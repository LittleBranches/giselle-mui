'use client';

import type { PointerEventHandler } from 'react';
import type { InteractiveHeroLogoProps } from './types';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
  useMotionTemplate,
} from 'framer-motion';

import Box from '@mui/material/Box';

import { useImagePreloader } from '../../../utils/use-image-preloader';
import { PortraitLayer } from './portrait-layer';
import { OriginalLogoLayer } from './original-logo-layer';
import { ArtisticLogoLayer } from './artistic-logo-layer';
import { useHoverPhaseTransition } from './use-hover-phase-transition';
import { DEFAULT_PORTRAIT_DIRECTION } from './interactive-logo.const';
import { rootBoxSx, innerContainerSx, logoStack3dWrapperSx } from './interactive-logo.styles';
import {
  getCursorStyle,
  getRandomPortraitSrc,
  buildPortraitSourceMap,
  getPortraitDirectionFromAngle,
} from './interactive-logo.utils';

// ----------------------------------------------------------------------

/**
 * An interactive logo component with three hover phases:
 *
 * - **idle** — logo at rest; artistic overlay is visible
 * - **artistic** — on first hover; original logo animation plays
 * - **portrait** — after the activation delay, a directional portrait fills
 *   the space and tracks pointer position around the logo
 *
 * Supports frame-scrub animation via `frameSources`, directional portraits via
 * `portraitSources`, and respects `prefers-reduced-motion` throughout.
 */
export function InteractiveHeroLogo({
  sx,
  rootSx,
  frameSources,
  artisticLogoSrc,
  logoAlt,
  portraitSrc,
  portraitSources,
  portraitAlt = 'Portrait',
  children,
  ...other
}: InteractiveHeroLogoProps) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  const scrub = useMotionValue(0);
  const scrubSpring = useSpring(scrub, { stiffness: 240, damping: 28, mass: 0.25 });

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  const rotateX = useSpring(tiltX, { stiffness: 220, damping: 13, mass: 0.24 });
  const rotateY = useSpring(tiltY, { stiffness: 220, damping: 13, mass: 0.24 });
  const x = useSpring(panX, { stiffness: 230, damping: 13, mass: 0.2 });
  const y = useSpring(panY, { stiffness: 230, damping: 13, mass: 0.2 });

  const validFrames = useMemo(() => (frameSources ?? []).filter(Boolean), [frameSources]);
  const portraitSourceMap = useMemo(
    () => buildPortraitSourceMap(portraitSrc, portraitSources),
    [portraitSrc, portraitSources]
  );
  const hasPortrait = Object.values(portraitSourceMap).some(Boolean);

  // Preload every portrait image so direction changes render without flicker.
  const allPortraitSrcs = useMemo(
    () =>
      Object.values(portraitSourceMap).flatMap((src) =>
        typeof src === 'string' ? [src] : [...(src ?? [])]
      ),
    [portraitSourceMap]
  );
  useImagePreloader(allPortraitSrcs);

  const [activePortraitSrcResolved, setActivePortraitSrcResolved] = useState<string>('');
  const frameCount = validFrames.length;
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { hoverPhase, hasActivatedPortrait, activePortraitDirection, setActivePortraitDirection } =
    useHoverPhaseTransition({ isHovered, hasPortrait, reducedMotion });

  useEffect(() => {
    if (hoverPhase !== 'portrait') {
      return;
    }

    tiltX.set(0);
    tiltY.set(0);
    panX.set(0);
    panY.set(0);
  }, [hoverPhase, panX, panY, tiltX, tiltY]);

  useEffect(() => {
    if (frameCount <= 1 || reducedMotion) {
      setFrameIndex(0);
      return;
    }

    const unsubscribe = scrubSpring.on('change', (value) => {
      const normalized = Math.min(1, Math.max(0, value));
      const nextIndex = Math.round(normalized * (frameCount - 1));
      setFrameIndex(nextIndex);
    });

    return unsubscribe;
  }, [frameCount, reducedMotion, scrubSpring]);

  const handlePointerDown = useCallback(() => setIsPointerDown(true), []);
  const handlePointerUp = useCallback(() => setIsPointerDown(false), []);
  const handlePointerEnter = useCallback(() => setIsHovered(true), []);
  const handleInnerPointerLeave = useCallback(() => setIsHovered(false), []);

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (reducedMotion) return;

      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;

      const pointerX = (event.clientX - rect.left) / rect.width;
      const pointerY = (event.clientY - rect.top) / rect.height;

      const normalizedX = Math.min(1, Math.max(0, pointerX));
      const normalizedY = Math.min(1, Math.max(0, pointerY));

      if (hasActivatedPortrait) {
        const deltaX = event.clientX - (rect.left + rect.width / 2);
        const deltaY = event.clientY - (rect.top + rect.height / 2);
        const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

        const nextDirection = getPortraitDirectionFromAngle(angle);
        setActivePortraitDirection(nextDirection);
        tiltX.set(0);
        tiltY.set(0);
        panX.set(0);
        panY.set(0);
        return;
      }

      scrub.set(normalizedX);
      tiltX.set((0.5 - normalizedY) * 40);
      tiltY.set((normalizedX - 0.5) * 48);
      panX.set((normalizedX - 0.5) * 44);
      panY.set((normalizedY - 0.5) * 32);
    },
    [
      hasActivatedPortrait,
      panX,
      panY,
      reducedMotion,
      scrub,
      setActivePortraitDirection,
      tiltX,
      tiltY,
    ]
  );

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    setIsPointerDown(false);
    setActivePortraitDirection(DEFAULT_PORTRAIT_DIRECTION);
    scrub.set(0.5);
    tiltX.set(0);
    tiltY.set(0);
    panX.set(0);
    panY.set(0);
  }, [panX, panY, scrub, setActivePortraitDirection, tiltX, tiltY]);

  useEffect(() => {
    const rawSrc =
      portraitSourceMap[activePortraitDirection] ?? portraitSourceMap[DEFAULT_PORTRAIT_DIRECTION];
    if (rawSrc) {
      setActivePortraitSrcResolved(getRandomPortraitSrc(rawSrc));
    }
  }, [activePortraitDirection, portraitSourceMap]);

  const activeFrame = validFrames[Math.min(frameIndex, Math.max(0, frameCount - 1))];
  const showArtisticLogo = artisticLogoSrc && hoverPhase === 'idle';
  const showPortrait = activePortraitSrcResolved && hoverPhase === 'portrait';
  const shadowX = useTransform(panX, (value) => value * -0.3);
  const shadowY = useTransform(panY, (value) => 10 + value * 0.45);
  const shadowBlur = isHovered ? 24 : 16;
  const shadowAlpha = isHovered ? 0.34 : 0.22;
  const logoStackFilter = useMotionTemplate`brightness(0.9) drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgb(var(--mui-palette-grey-900Channel) / ${shadowAlpha}))`;
  const logoFadeTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };
  const portraitFadeTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };
  const cursorStyle = getCursorStyle(reducedMotion, isPointerDown);

  return (
    <Box
      {...other}
      ref={rootRef}
      component={motion.div}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      sx={[rootBoxSx(cursorStyle), ...(Array.isArray(rootSx) ? rootSx : [rootSx])]}
    >
      <Box
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handleInnerPointerLeave}
        sx={[innerContainerSx, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        <Box
          component={motion.div}
          style={
            reducedMotion
              ? undefined
              : {
                  rotateX,
                  rotateY,
                  x,
                  y,
                  filter: logoStackFilter,
                }
          }
          sx={logoStack3dWrapperSx}
        >
          <OriginalLogoLayer
            hoverPhase={hoverPhase}
            logoFadeTransition={logoFadeTransition}
            activeFrame={activeFrame}
            logoAlt={logoAlt}
          >
            {children}
          </OriginalLogoLayer>

          <ArtisticLogoLayer
            artisticLogoSrc={artisticLogoSrc}
            showArtisticLogo={Boolean(showArtisticLogo)}
            logoFadeTransition={logoFadeTransition}
            logoAlt={logoAlt}
          />
        </Box>

        <PortraitLayer
          portraitSrc={activePortraitSrcResolved}
          portraitAlt={portraitAlt}
          showPortrait={Boolean(showPortrait)}
          portraitFadeTransition={portraitFadeTransition}
        />
      </Box>
    </Box>
  );
}
