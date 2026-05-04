---
sidebar_position: 2
sidebar_label: 'React / Vite'
---

# Theming in a React app (Vite / CRA)

`@alexrebula/giselle-mui` components use **MUI v7 CSS variables mode**. They resolve
colours through CSS custom properties like `var(--mui-palette-primary-main)`, which are
injected by `CssVarsProvider` at the root of your app.

Without a theme provider these CSS variables don't exist, and components render
without meaningful colours, borders, or typography scale.

---

## 1. Install dependencies

```bash
npm install @mui/material @emotion/react @emotion/styled react react-dom
npm install @alexrebula/giselle-mui

# Optional: only if you use GiselleIcon
npm install @iconify/react
# See docs/iconify-registration.md — icons must be pre-registered or GiselleIcon will flicker
```

---

## 2. Create your theme

Use `extendTheme()` — the CSS-vars-aware version of `createTheme()`.

```ts
// src/theme.ts
import { extendTheme } from '@mui/material/styles';

export const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#1976d2' },
        // add your palette overrides here
      },
    },
    dark: {
      palette: {
        primary: { main: '#90caf9' },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
```

You can skip customisation entirely and call `extendTheme()` with no arguments — MUI's
built-in defaults are a solid starting point.

---

## 3. Wrap your app in `CssVarsProvider`

```tsx
// src/main.tsx  (Vite)  or  src/index.tsx  (CRA)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssVarsProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      {/*
        CssBaseline normalises browser styles and injects the CSS custom
        properties onto :root so they're available everywhere.
      */}
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </StrictMode>
);
```

---

## 4. Use components — they're now fully themed

```tsx
// src/App.tsx
import {
  GiselleIcon,
  MetricCard,
  MetricCardDecoration,
  SelectableCard,
  QuoteCard,
} from '@alexrebula/giselle-mui';

export function App() {
  return (
    <>
      <MetricCard
        value="20+"
        label="Years"
        sublabel="front-end, since 2005"
        color="primary"
        icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />}
        decoration={<MetricCardDecoration color="primary" />}
      />

      <SelectableCard selected onClick={() => {}}>
        Choose this option
      </SelectableCard>

      <QuoteCard
        quote="Leave every file a little better than you found it."
        author="Alex Rebula"
        source="NBN Project"
      />
    </>
  );
}
```

---

## 5. Dark mode (optional)

`CssVarsProvider` supports `defaultMode` and the `useColorScheme()` hook for runtime
mode switching — no page reload needed.

```tsx
// Provide a default mode:
<CssVarsProvider theme={theme} defaultMode="dark">

// Or let the OS decide:
<CssVarsProvider theme={theme} defaultMode="system">
```

Toggle mode from anywhere in the tree:

```tsx
import { useColorScheme } from '@mui/material/styles';

function DarkModeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
      {mode === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
```

---

## Key differences from MUI v5 / v6

| MUI v5/v6 | MUI v7 CSS vars mode |
|---|---|
| `createTheme()` | `extendTheme()` |
| `ThemeProvider` | `CssVarsProvider` |
| `theme.palette.primary.main` | `theme.vars.palette.primary.main` |
| Values are JS strings | Values are CSS `var(--...)` references |
| No built-in dark mode toggle | `useColorScheme()` built in |

---

## Troubleshooting

**"Components look unstyled / colours are transparent"**
→ Check that `CssVarsProvider` wraps the component in the React tree. Open DevTools
and look for `--mui-palette-primary-main` on `:root`. If it's missing, the provider
isn't mounted or isn't above the component.

**"TypeError: Cannot read properties of undefined (reading 'palette')"**
→ You're likely using `theme.palette` instead of `theme.vars.palette` inside an `sx`
callback. In CSS vars mode, `theme.vars` is the correct access path.

**TypeScript errors in `sx` callbacks: `theme.vars` is possibly `undefined`**
→ This is a known MUI v7 strict-mode type quirk. Add `// @ts-expect-error MUI v7 theme.vars`
above the line, or cast: `(theme as CssVarsTheme).vars.palette...`. A cleaner fix is
coming in a future MUI v7 minor release.

---

See also: [Next.js](./nextjs.md)
