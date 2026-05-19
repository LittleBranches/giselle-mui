import type { Meta, StoryObj } from '@storybook/react';

import Typography from '@mui/material/Typography';

import { FaqSection } from './faq-accordion';

// ----------------------------------------------------------------------

const meta: Meta<typeof FaqSection> = {
  title: 'Section/FAQ/Accordion',
  component: FaqSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full FAQ section with scroll-triggered animated accordions, decorative SVG elements (visible at ≥1440 px), and an optional contact footer. Import from `@littlebranches/giselle-mui/motion`.',
      },
    },
  },
  argTypes: {
    sx: { control: false },
    faqs: { control: false },
    contactIcon: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof FaqSection>;

// ----------------------------------------------------------------------

const SAMPLE_FAQS = [
  {
    question: 'What technologies does this library use?',
    answer: (
      <>
        <Typography sx={{ mb: 1.5 }}>
          The library is built on MUI v7 with CSS Variables mode and framer-motion for
          scroll-triggered animations.
        </Typography>
        <Typography>
          All components are TypeScript-strict and follow the MUI component API conventions.
        </Typography>
      </>
    ),
  },
  {
    question: 'How do I install and configure the library?',
    answer: (
      <Typography>
        Install via npm: <code>npm install @littlebranches/giselle-mui</code>. Wrap your app in a MUI{' '}
        <code>ThemeProvider</code> with <code>cssVariables: true</code> to enable CSS Variables
        mode, which is required for all colour utilities.
      </Typography>
    ),
  },
  {
    question: 'Can I use this with Next.js App Router?',
    answer: (
      <>
        <Typography sx={{ mb: 1.5 }}>
          Yes. Components are marked with <code>&apos;use client&apos;</code> in the build output,
          so you can import them directly in Server Components without extra configuration.
        </Typography>
        <Typography>
          For the motion subpath (<code>@littlebranches/giselle-mui/motion</code>), ensure framer-motion
          is in your project&apos;s dependencies.
        </Typography>
      </>
    ),
  },
  {
    question: 'Is there a dark mode?',
    answer: (
      <Typography>
        Yes — all colours reference MUI CSS variable channels. Toggle between light and dark mode by
        updating the MUI theme mode; the components respond automatically without any extra
        configuration.
      </Typography>
    ),
  },
  {
    question: 'Where do decorative SVG elements appear?',
    answer: (
      <Typography>
        The floating line, plus icons, and triangle decorations are only visible at viewport widths
        ≥1440 px. Below this breakpoint they are hidden via CSS so they never clutter mobile or
        tablet layouts.
      </Typography>
    ),
  },
];

// ----------------------------------------------------------------------

/**
 * Default story: full section with contact footer.
 * The FAQ list animates on scroll into view, with a staggered entrance per item.
 */
export const Default: Story = {
  args: {
    caption: 'Support',
    title: 'Frequently Asked',
    txtGradient: 'Questions',
    faqs: SAMPLE_FAQS,
    contactHref: '/contact',
    contactLabel: 'Send a message',
    contactIcon: 'solar:letter-bold',
    contactTitle: 'Still have questions?',
    contactDescription:
      'Use the contact form or reach out directly — we respond within one business day.',
  },
};

/**
 * Without the contact footer: omit `contactHref` to hide the entire footer section.
 * Useful when the page already has a dedicated contact section elsewhere.
 */
export const NoContactFooter: Story = {
  args: {
    caption: 'FAQ',
    title: 'Common',
    txtGradient: 'Questions',
    faqs: SAMPLE_FAQS.slice(0, 3),
  },
};

/**
 * Custom contact icon via ReactNode instead of a string icon ID.
 * Pass any ReactNode to `contactIcon` when you need an icon not in the Giselle registry.
 */
export const CustomReactNodeIcon: Story = {
  args: {
    ...Default.args,
    contactIcon: <span aria-hidden>✉</span>,
    contactLabel: 'Email us',
  },
};

/**
 * Single FAQ item — edge case: only one accordion in the list.
 */
export const SingleItem: Story = {
  args: {
    caption: 'Help',
    title: 'One',
    txtGradient: 'Question',
    faqs: SAMPLE_FAQS.slice(0, 1),
    contactHref: '/contact',
  },
};

/**
 * Responsive — verifies the section layout at standard MUI breakpoint widths.
 * The decorative SVGs appear only at ≥1440 px (display:none below that threshold).
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  args: {
    caption: 'Support',
    title: 'Frequently Asked',
    txtGradient: 'Questions',
    faqs: SAMPLE_FAQS.slice(0, 2),
    contactHref: '/contact',
    contactLabel: 'Send a message',
  },
};
