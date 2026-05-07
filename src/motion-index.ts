// @alexrebula/giselle-mui — /motion subpath entry point
//
// framer-motion components (optional peer dep: framer-motion).
// Import from '@alexrebula/giselle-mui/motion' — NOT from the root import.
//
// Why a separate entry?
// Importing framer-motion in src/index.ts would impose it on every consumer, including
// server-side contexts where it is unnecessary. The subpath isolates it so only projects
// that explicitly import from '/motion' need framer-motion installed.
//
// Consumer contract:
//   import { FaqAccordion } from '@alexrebula/giselle-mui/motion';
//   // requires: framer-motion in the consumer's own deps
//
// Important: always use motion.div, never m.div.
// m.* requires LazyMotion in the consumer's tree — an invisible requirement that breaks
// apps not using lazy motion (including Storybook). motion.* works without a provider.
//
// Phase H: FloatingSubNav will move here from src/index.ts (breaking change — re-export
// shim or minor version bump required for existing consumers).
// Phase H components will be exported from here.

export { FaqAccordion } from './components/faq/accordion';
export type { FaqAccordionProps, FaqItem } from './components/faq/accordion';
