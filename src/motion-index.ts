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
export { transitionEnter, transitionExit } from './components/motion/variants/transition';

// --- Phase I: Variant factories ---
export { fade } from './components/motion/variants/fade';
export { container } from './components/motion/variants/container';
export { slide } from './components/motion/variants/slide';
export { scale } from './components/motion/variants/scale';
export { bounce } from './components/motion/variants/bounce';
export { rotate } from './components/motion/variants/rotate';
export { flip } from './components/motion/variants/flip';
export { zoom } from './components/motion/variants/zoom';

// --- Phase I: Interaction helpers ---
export { hover, tap, transitionHover, transitionTap } from './components/motion/variants/actions';

// --- Phase I: Components ---
export { MotionContainer } from './components/motion/container';
export type { MotionContainerProps } from './components/motion/container';
export { MotionViewport } from './components/motion/viewport';
export type { MotionViewportProps } from './components/motion/viewport';

// --- Phase I: Hooks ---
export { useScrollParallax } from './components/motion/use-scroll-parallax';
export type { UseScrollParallaxResult } from './components/motion/use-scroll-parallax';

// --- Hero components (framer-motion) ---
export { InteractiveHeroLogo } from './components/hero/interactive-logo';
export type {
  InteractiveHeroLogoProps,
  HoverPhase,
  PortraitDirection,
  PortraitSource,
  FadeTransition,
} from './components/hero/interactive-logo';
export { HeroButtonsRow } from './components/hero/buttons-row';
export type { HeroButtonsRowProps, HeroButtonItem } from './components/hero/buttons-row';

// --- Phase D: FAQ Section ---
export { FaqSection } from './components/faq/accordion';
export type { FaqSectionProps, FaqItem } from './components/faq/accordion';
// @deprecated — FaqAccordion was renamed to FaqSection in 0.1.x.
/** @deprecated Use {@link FaqSection} instead. */
export { FaqSection as FaqAccordion } from './components/faq/accordion';
/** @deprecated Use {@link FaqSectionProps} instead. */
export type { FaqSectionProps as FaqAccordionProps } from './components/faq/accordion';
