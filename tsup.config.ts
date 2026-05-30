import { defineConfig } from 'tsup';

export default defineConfig([
  // Components bundle — 'use client' banner marks all React components as client-only.
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    banner: { js: "'use client';" },
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@mui/material',
      '@mui/lab',
      '@emotion/react',
      '@emotion/styled',
      '@iconify/react',
      'framer-motion',
      'apexcharts',
      'react-apexcharts',
    ],
  },
  // Utils bundle — no 'use client' banner. Pure TypeScript only.
  // Safe to import from Next.js Server Components and data files.
  {
    entry: { utils: 'src/utils-index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@mui/material',
      '@mui/lab',
      '@emotion/react',
      '@emotion/styled',
      '@iconify/react',
      'framer-motion',
      'apexcharts',
      'react-apexcharts',
    ],
  },
  // Charts bundle — ApexCharts chart card components.
  // Optional peer deps: apexcharts + react-apexcharts.
  // Consumers import from '@littlebranches/giselle-mui/charts'.
  // apexcharts must NOT appear in the main bundle's src/index.ts.
  {
    entry: { charts: 'src/charts-index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    banner: { js: "'use client';" },
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@mui/material',
      '@mui/lab',
      '@emotion/react',
      '@emotion/styled',
      '@iconify/react',
      'framer-motion',
      'apexcharts',
      'react-apexcharts',
    ],
  },
  // Motion bundle — framer-motion components.
  // Optional peer dep: framer-motion.
  // Consumers import from '@littlebranches/giselle-mui/motion'.
  // framer-motion must NOT appear in the main bundle's src/index.ts.
  // Rule: always use motion.div, never m.div (m.* requires LazyMotion in the consumer tree).
  {
    entry: { motion: 'src/motion-index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    banner: { js: "'use client';" },
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@mui/material',
      '@mui/lab',
      '@emotion/react',
      '@emotion/styled',
      '@iconify/react',
      'framer-motion',
      'apexcharts',
      'react-apexcharts',
    ],
  },
  // Lab bundle — components requiring @mui/lab peer dependency (Timeline etc.).
  // Optional peer dep: @mui/lab.
  // Consumers import from '@littlebranches/giselle-mui/lab'.
  // @mui/lab must NOT appear in the main bundle's src/index.ts.
  {
    entry: { lab: 'src/lab-index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    banner: { js: "'use client';" },
    external: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@mui/material',
      '@mui/lab',
      '@emotion/react',
      '@emotion/styled',
      '@iconify/react',
      'framer-motion',
      'apexcharts',
      'react-apexcharts',
    ],
  },
]);
