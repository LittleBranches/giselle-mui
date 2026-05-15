// @alexrebula/giselle-mui — /motion subpath entry point
//
// framer-motion components (optional peer dep: framer-motion).
// Import from '@alexrebula/giselle-mui/motion' — NOT from the root import.
//
// Consumer contract:
//   import { MotionContainer, fade, slide } from '@alexrebula/giselle-mui/motion';
//   // requires: framer-motion in the consumer's own deps
//
// Important: always use motion.div, never m.div.
// m.* requires LazyMotion in the consumer's tree — an invisible requirement that breaks
// apps not using lazy motion (including Storybook). motion.* works without a provider.

// --- Phase I: Transition defaults ---
export { transitionEnter, transitionExit } from './motion/variants/transition';

// --- Phase I: Variant factories ---
export { fade } from './motion/variants/fade';
export { container } from './motion/variants/container';
export { slide } from './motion/variants/slide';
export { scale } from './motion/variants/scale';
export { bounce } from './motion/variants/bounce';
export { rotate } from './motion/variants/rotate';
export { flip } from './motion/variants/flip';
export { zoom } from './motion/variants/zoom';

// --- Phase I: Interaction helpers ---
export { hover, tap, transitionHover, transitionTap } from './motion/variants/actions';

// --- Phase I: Components ---
export { MotionContainer } from './motion/container';
export type { MotionContainerProps } from './motion/container';
export { MotionViewport } from './motion/viewport';
export type { MotionViewportProps } from './motion/viewport';

// --- Phase I: Hooks ---
export { useScrollParallax } from './motion/use-scroll-parallax';
export type { UseScrollParallaxResult } from './motion/use-scroll-parallax';

// --- Hero components (framer-motion) ---
export { InteractiveHeroLogo } from './sections/hero/interactive-logo';
export type {
  InteractiveHeroLogoProps,
  HoverPhase,
  PortraitDirection,
  PortraitSource,
  FadeTransition,
} from './sections/hero/interactive-logo';
export { HeroButtonsRow } from './sections/hero/buttons-row';
export type { HeroButtonsRowProps, HeroButtonItem } from './sections/hero/buttons-row';

// --- Hero: ScrollParallaxHero ---
export {
  ScrollParallaxHero,
  AnimatedHeroHeading,
  useScrollPercent,
  useTransformY,
} from './sections/hero/scroll-parallax';
export type {
  ScrollParallaxHeroProps,
  AnimatedHeroHeadingProps,
  UseScrollPercentResult,
  ParallaxMultipliers,
} from './sections/hero/scroll-parallax';

// --- Phase D: FAQ Section ---
export { FaqSection } from './sections/faq/accordion';
export type { FaqSectionProps, FaqItem } from './sections/faq/accordion';
// @deprecated — FaqAccordion was renamed to FaqSection in 0.1.x.
/** @deprecated Use {@link FaqSection} instead. */
export { FaqSection as FaqAccordion } from './sections/faq/accordion';
/** @deprecated Use {@link FaqSectionProps} instead. */
export type { FaqSectionProps as FaqAccordionProps } from './sections/faq/accordion';
