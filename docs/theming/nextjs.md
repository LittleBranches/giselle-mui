---
sidebar_position: 1
sidebar_label: 'Next.js'
---

# Theming in Next.js (App Router + Pages Router)

`@alexrebula/giselle-mui` components use **MUI v7 CSS variables mode** and require a
`CssVarsProvider` wrapping your application.

Next.js has two routers with slightly different setup requirements. Both are covered below.

---

## App Router (Next.js 13+)

### 1. Install dependencies

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/material-nextjs react react-dom
npm install @alexrebula/giselle-mui

# Optional: only if you use GiselleIcon
npm install @iconify/react
# See docs/iconify-registration.md — icons must be pre-registered or GiselleIcon will flicker
```

`@mui/material-nextjs` provides `AppRouterCacheProvider`, which prevents style
duplication and flash-of-unstyled-content (FOUC) in RSC/streaming environments.

---

### 2. Create your theme

```ts
// src/theme.ts
import { extendTheme } from '@mui/material/styles';

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#1976d2' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#90caf9' },
      },
    },
  },
});
```

---

### 3. Root layout

```tsx
// app/layout.tsx
import type { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssVarsProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../theme';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/*
          AppRouterCacheProvider collects styles during SSR and flushes them
          into the <head> before the page streams to the client — preventing FOUC.
        */}
        <AppRouterCacheProvider>
          <CssVarsProvider theme={theme} defaultMode="system">
            <CssBaseline />
            {children}
          </CssVarsProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

> **`suppressHydrationWarning` on `<html>`** is required when using `defaultMode="system"` or
> `"dark"` — MUI sets a `data-mui-color-scheme` attribute on `<html>` at runtime, and without
> the suppression React will warn about a hydration mismatch between server and client renders.

---

### 4. Server vs. Client components

`@alexrebula/giselle-mui` components are **client components** — they use MUI's `sx` prop
which relies on React context. You don't need to add `'use client'` to your page files;
Next.js will automatically treat any component that imports from a client-component package
as a client subtree.

If you want to use a component inside a Server Component, wrap it in a thin client boundary:

```tsx
// components/MetricCardClient.tsx
'use client';

export { MetricCard, MetricCardDecoration } from '@alexrebula/giselle-mui';
```

```tsx
// app/page.tsx  (Server Component)
import { MetricCard, MetricCardDecoration } from '../components/MetricCardClient';

export default function Page() {
  return <MetricCard value="20+" label="Years" icon={<MetricCardDecoration color="primary" />} />;
}
```

---

### 5. Dark mode in App Router

```tsx
// components/DarkModeToggle.tsx
'use client';

import { useColorScheme } from '@mui/material/styles';

export function DarkModeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
      {mode === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
```

---

## Pages Router (Next.js 12 / legacy)

### 1. Install dependencies

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/material-nextjs react react-dom
npm install @alexrebula/giselle-mui
```

---

### 2. `_document.tsx` — critical for SSR

```tsx
// pages/_document.tsx
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { documentGetInitialProps } from '@mui/material-nextjs/v15-pagesRouter';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    return documentGetInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

---

### 3. `_app.tsx` — theme provider

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { CssVarsProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../theme';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </CssVarsProvider>
  );
}
```

---

## Theme utilities

`@alexrebula/giselle-mui` exports a set of small helpers for building MUI v7 themes:

### `channelAlpha(channel, alpha)`

Converts a CSS-variable palette channel to an `rgba()` CSS string using CSS Color 4
slash syntax. MUI v7 exposes colours as space-separated RGB channels
(e.g. `theme.vars.palette.primary.mainChannel`). The slash syntax works with both
literal channel strings and CSS `var()` references.

```ts
import { channelAlpha } from '@alexrebula/giselle-mui';

sx={(theme) => ({
  backgroundColor: channelAlpha(theme.vars.palette.primary.mainChannel, 0.08),
  // → "rgba(99 102 241 / 0.08)"
})}
```

### `hexToChannel(hex)`

Converts a hex colour to a space-separated RGB channel string — the format MUI v7
expects for `*Channel` palette slots in `extendTheme()`.

```ts
import { hexToChannel } from '@alexrebula/giselle-mui';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#6366f1',
          mainChannel: hexToChannel('#6366f1'), // "99 102 241"
        },
      },
    },
  },
});
```

### `pxToRem(px)` / `remToPx(rem)`

Typography scale helpers for consistent `rem` definitions.

```ts
import { pxToRem, remToPx } from '@alexrebula/giselle-mui';

pxToRem(14); // "0.875rem"
remToPx(0.875); // 14
```

---

## Giselle brand theme preset

`giselleTheme` is a ready-to-use `extendTheme()` result carrying the full Giselle
brand palette for both light and dark colour schemes. Pass it directly to
`CssVarsProvider` instead of writing your own palette from scratch.

```tsx
import { CssVarsProvider } from '@mui/material/styles';
import { giselleTheme } from '@alexrebula/giselle-mui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider>
          <CssVarsProvider theme={giselleTheme} defaultMode="system">
            {children}
          </CssVarsProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

### Palette decisions

The Giselle palette is named after the Carabao mango tree — the Philippine national
fruit and the ecosystem's brand metaphor:

| Key         | Light mode                 | Dark mode              | Rationale                                           |
| ----------- | -------------------------- | ---------------------- | --------------------------------------------------- |
| `primary`   | Deep grove green `#2E7D32` | Lime green `#76C442`   | Tree foundation; 4.76:1 contrast on white (WCAG AA) |
| `secondary` | Mango gold `#F5A623`       | Mango gold `#F5A623`   | Fruit accent; unchanged in both modes               |
| `info`      | Accessible blue `#0288D1`  | Light blue `#29B6F6`   | Standard MUI default family                         |
| `success`   | Leaf green `#388E3C`       | Leaf green `#66BB6A`   | Distinct from primary to avoid ambiguity            |
| `warning`   | Amber orange `#ED6C02`     | Amber `#FFA726`        | Warm; complements the mango gold family             |
| `error`     | Standard red `#D32F2F`     | Standard red `#F44336` | Conventional danger signal                          |

### Overriding individual palette keys

Spread the preset and override only what you need:

```ts
import { extendTheme } from '@mui/material/styles';
import { giselleTheme } from '@alexrebula/giselle-mui';

const myTheme = extendTheme({
  ...giselleTheme,
  colorSchemes: {
    ...giselleTheme.colorSchemes,
    light: {
      palette: {
        ...giselleTheme.colorSchemes?.light?.palette,
        primary: { main: '#1976d2' }, // override primary only
      },
    },
  },
});
```

### Exported palette constants

The individual hex values are exported so you can reference them in custom tokens or
`channelAlpha` calls without hardcoding strings:

```ts
import {
  GISELLE_PRIMARY_MAIN, // '#2E7D32'
  GISELLE_PRIMARY_DARK_MAIN, // '#76C442'
  GISELLE_SECONDARY_MAIN, // '#F5A623'
} from '@alexrebula/giselle-mui';
```

---

## Roadmap note

The `@alexrebula/giselle-mui` package is in beta. A dedicated Next.js integration example
(or a starter template) is planned after the initial npm release. Until then, the setup
above is the recommended approach.

---

## Troubleshooting

**FOUC on page load in App Router**
→ Make sure `AppRouterCacheProvider` wraps `CssVarsProvider` (not the other way around).
`AppRouterCacheProvider` needs to be the outermost provider so it can collect all styles.

**Hydration mismatch on `<html>` tag**
→ Add `suppressHydrationWarning` to `<html>`. MUI sets `data-mui-color-scheme` on the
element at runtime which doesn't exist in SSR output.

**"useColorScheme must be used inside CssVarsProvider"**
→ The toggle component must be a client component (`'use client'`) and must be inside the
`CssVarsProvider` tree in the layout.

**Server components throwing on import**
→ MUI components use React context internally. Wrap them in a `'use client'` boundary as
shown in step 4 above. You do not need to add `'use client'` to every file — just the
boundary closest to the MUI usage.

---

See also: [React / Vite](./theming-react.md)
