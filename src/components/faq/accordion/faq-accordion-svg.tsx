import type { Theme } from '@mui/material/styles';

import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

import { floatDecorationBase } from './faq-accordion.styles';
import { svgLineTransition } from './utils';

// ----------------------------------------------------------------------
// Internal styled root — applies MUI `sx` to a framer-motion SVG element.
// No custom props are forwarded; `sx` is handled by MUI styled.
// ----------------------------------------------------------------------

const MotionSvg = styled(motion.svg, {
  shouldForwardProp: (prop) => prop !== 'vertical',
})``;

type SvgProps = React.ComponentProps<typeof MotionSvg>;

// ----------------------------------------------------------------------

/**
 * Decorative dashed float line (horizontal or vertical).
 * Only rendered at ≥1440 px via base decoration styles.
 * @internal — used by `FaqAccordion` only.
 */
export function FaqFloatLine({ sx, vertical, ...other }: SvgProps & { vertical?: boolean }) {
  return (
    <MotionSvg
      sx={[
        (theme: Theme) => ({
          ...floatDecorationBase(theme),
          width: 1,
          zIndex: 1,
          height: '1px',
          opacity: 0.24,
          ...(vertical && { width: '1px', height: 1 }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {vertical ? (
        <motion.line
          x1="0.5"
          x2="0.5"
          y1="0"
          y2="100%"
          variants={{
            initial: { y2: '0%' },
            animate: { y2: '100%', transition: svgLineTransition },
          }}
        />
      ) : (
        <motion.line
          x1="0"
          x2="100%"
          y1="0.5"
          y2="0.5"
          variants={{
            initial: { x2: '0%' },
            animate: { x2: '100%', transition: svgLineTransition },
          }}
        />
      )}
    </MotionSvg>
  );
}

// ----------------------------------------------------------------------

/**
 * Decorative animated "+" mark.
 * Only rendered at ≥1440 px.
 * @internal — used by `FaqAccordion` only.
 */
export function FaqFloatPlusIcon({ sx, ...other }: SvgProps) {
  return (
    <MotionSvg
      variants={{
        initial: { scale: 0 },
        animate: { scale: 1, transition: svgLineTransition },
      }}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={[
        (theme: Theme) => ({
          ...floatDecorationBase(theme),
          width: 16,
          height: 16,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <path d="M8 0V16M16 8.08889H0" />
    </MotionSvg>
  );
}

// ----------------------------------------------------------------------

/**
 * Decorative downward-pointing triangle.
 * Only rendered at ≥1440 px.
 * @internal — used by `FaqAccordion` only.
 */
export function FaqFloatTriangleDownIcon({ sx, ...other }: SvgProps) {
  return (
    <MotionSvg
      variants={{
        initial: { scaleX: 0 },
        animate: { scaleX: 1, transition: svgLineTransition },
      }}
      width="20"
      height="10"
      viewBox="0 0 20 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      sx={[
        (theme: Theme) => ({
          ...floatDecorationBase(theme),
          width: 20,
          height: 10,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <path d="M10 10L0 0H20L10 10Z" />
    </MotionSvg>
  );
}
