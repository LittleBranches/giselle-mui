import type { ReactNode } from 'react';
import type { SVGMotionProps } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Props for internal decorative SVG elements in `FaqSection`
 * (`FaqFloatLine`, `FaqFloatPlusIcon`, `FaqFloatTriangleDownIcon`).
 *
 * @internal
 */
export type SvgProps = SVGMotionProps<SVGSVGElement> & { sx?: SxProps<Theme> };

// ----------------------------------------------------------------------

/** A single FAQ entry. */
export type FaqItem = {
  /** The question text, also used as the accordion panel key. */
  question: string;
  /** The answer content — any valid React node. */
  answer: ReactNode;
};

/** Props for the {@link FaqSection} component. */
export type FaqSectionProps = Omit<BoxProps, 'children'> & {
  /** Overline caption above the heading. @default 'FAQs' */
  caption?: string;
  /** Main `h2` heading. @default 'Frequently Asked' */
  title?: string;
  /** Gradient-accent word appended after `title`. @default 'Questions' */
  txtGradient?: string;
  /** FAQ items rendered as animated accordions. */
  faqs: FaqItem[];
  /** Heading in the contact footer. @default 'Still have questions?' */
  contactTitle?: string;
  /** Body text below the contact heading. */
  contactDescription?: string;
  /**
   * `href` for the contact button.
   * When omitted, the entire contact footer section is hidden.
   */
  contactHref?: string;
  /** Label for the contact button. @default 'Contact us' */
  contactLabel?: string;
  /**
   * Icon for the contact button.
   * - `string` → rendered via `GiselleIcon` (e.g. `'solar:letter-bold'`).
   * - `ReactNode` → rendered as-is.
   */
  contactIcon?: ReactNode | string;
};

/** @internal Props for the scroll-triggered animation container used by {@link FaqSection}. */
export type FaqMotionViewportProps = {
  children: ReactNode;
  sx?: SxProps<Theme>;
};
