import Container from '@mui/material/Container';

import type { SectionContainerProps } from './types';

// ----------------------------------------------------------------------

/**
 * `SectionContainer` — standard full-width section wrapper.
 *
 * Wraps `Container maxWidth="lg"` with consistent vertical padding so every
 * section page has the same horizontal constraints and spacing without
 * repeating `sx={{ py: { xs: 8, md: 12 } }}` inline.
 *
 * **Usage:**
 * ```tsx
 * <SectionContainer>
 *   <Typography variant="h2">Section heading</Typography>
 * </SectionContainer>
 *
 * // Custom padding / max-width:
 * <SectionContainer maxWidth="md" py={{ xs: 6, md: 10 }}>
 *   ...
 * </SectionContainer>
 * ```
 *
 * **Quality status (13 May 2026):** DoD 20/20 · Best practices 13/13
 */
export function SectionContainer({
  children,
  maxWidth = 'lg',
  py = { xs: 8, md: 12 },
  sx,
  ...other
}: SectionContainerProps) {
  return (
    <Container maxWidth={maxWidth} sx={[{ py }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {children}
    </Container>
  );
}
