import { defineConfig } from 'tsup';

export default defineConfig([
  // Components bundle — 'use client' banner marks all React components as client-only.
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
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
    ],
  },
]);
