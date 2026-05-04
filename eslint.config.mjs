import globals from 'globals';
import eslintJs from '@eslint/js';
import eslintTs from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

// ----------------------------------------------------------------------

export default eslintTs.config(
  // ── Ignore patterns ───────────────────────────────────────────────────────
  {
    ignores: ['dist/**', 'storybook-static/**', 'node_modules/**'],
  },

  // ── Base rules ────────────────────────────────────────────────────────────
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,

  // ── Main config ───────────────────────────────────────────────────────────
  {
    files: ['src/**/*.{ts,tsx}', 'stories/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      // React hooks
      ...reactHooksPlugin.configs.recommended.rules,

      // React
      'react/jsx-key': 'error',
      'react/self-closing-comp': ['warn', { component: true, html: true }],

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': 'off', // handled by unused-imports below

      // Unused imports / vars
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // General quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'object-shorthand': 'warn',
      'no-useless-rename': 'warn',
      // SonarQube S3358 — no nested ternaries
      'no-nested-ternary': 'error',
      // MUI Store quality bar — ban React.FC / React.FunctionComponent
      // sx extraction rule — inline sx objects with >3 properties must go to *.styles.ts
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'TSTypeReference[typeName.name="FC"], TSTypeReference > TSQualifiedName[left.name="React"][right.name="FC"], TSTypeReference[typeName.name="FunctionComponent"], TSTypeReference > TSQualifiedName[left.name="React"][right.name="FunctionComponent"]',
          message:
            'Avoid React.FC / React.FunctionComponent; type props directly on the function or parameters (MUI Store quality bar).',
        },
        {
          selector:
            'JSXAttribute[name.name="sx"] > JSXExpressionContainer > ObjectExpression[properties.length>3]',
          message:
            'Inline `sx` object has more than 3 properties. Extract to a *.styles.ts file (see copilot-instructions.md).',
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // ── Stories override — exempt inline-sx rule ──────────────────────────────
  // Stories are documentation/demo code; large inline sx is acceptable there.
  // The React.FC ban still applies (enforced via the separate override below).
  {
    files: ['src/**/*.stories.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'TSTypeReference[typeName.name="FC"], TSTypeReference > TSQualifiedName[left.name="React"][right.name="FC"], TSTypeReference[typeName.name="FunctionComponent"], TSTypeReference > TSQualifiedName[left.name="React"][right.name="FunctionComponent"]',
          message:
            'Avoid React.FC / React.FunctionComponent; type props directly on the function or parameters (MUI Store quality bar).',
        },
      ],
    },
  }
);
