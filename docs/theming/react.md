---
sidebar_position: 2
sidebar_label: 'React / Vite'
---

# Theming in a React app (Vite / CRA)

`@littlebranches/giselle-mui` components use **MUI v7 CSS variables mode**. They resolve
colours through CSS custom properties like `var(--mui-palette-primary-main)`, which are
injected by `ThemeProvider` at the root of your app.

Without a theme provider these CSS variables don't exist, and components render
without meaningful colours, borders, or typography scale.

---

## 1. Install dependencies

```bash
npm install @mui/material @emotion/react @emotion/styled react react-dom
npm install @littlebranches/giselle-mui

# Optional: only if you use GiselleIcon
npm install @iconify/react
# See docs/iconify-registration.md — icons must be pre-registered or GiselleIcon will flicker
```

---

## 2. Create your theme

Use `createTheme()` with `cssVariables: true` to enable CSS variables mode.

```ts
// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: true,
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

You can also use the pre-built Giselle brand theme instead of defining your own:

```ts
import { giselleTheme } from '@littlebranches/giselle-mui';
// Pass giselleTheme directly to ThemeProvider — no extra configuration needed.
```

---

## 3. Wrap your app in `ThemeProvider`

```tsx
// src/main.tsx  (Vite)  or  src/index.tsx  (CRA)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      {/*
        CssBaseline normalises browser styles and injects the CSS custom
        properties onto :root so they're available everywhere.
      */}
      <CssBaseline />
      <App />
    </ThemeProvider>
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
} from '@littlebranches/giselle-mui';

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

`ThemeProvider` supports `defaultMode` and the `useColorScheme()` hook for runtime
mode switching — no page reload needed.

```tsx
// Provide a default mode:
<ThemeProvider theme={theme} defaultMode="dark">

// Or let the OS decide:
<ThemeProvider theme={theme} defaultMode="system">
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

| MUI v5/v6 | MUI v7 CSS variables mode |
|---|---|
| `createTheme()` | `createTheme({ cssVariables: true })` |
| `ThemeProvider` | `ThemeProvider` (same component — unified API in v7) |
| `theme.palette.primary.main` | `theme.vars.palette.primary.main` |
| Values are JS strings | Values are CSS `var(--...)` references |
| No built-in dark mode toggle | `useColorScheme()` built in |

> **Note:** Early MUI v7 documentation shows `extendTheme()` + `CssVarsProvider` — that was the
> experimental CSS vars API. The stable v7 approach is `createTheme({ cssVariables: true })` +
> `ThemeProvider`, which is what this library uses.

---

## Troubleshooting

**"Components look unstyled / colours are transparent"**
→ Check that `ThemeProvider` wraps the component in the React tree. Open DevTools
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
