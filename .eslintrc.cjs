const path = require('path');

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  plugins: ['perfectionist', 'unused-imports', 'prettier'],
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        '@typescript-eslint/no-unused-vars': 0,
        '@typescript-eslint/no-explicit-any': 0,
        'react/jsx-filename-extension': [0, { extensions: ['.jsx', '.tsx'] }],
        'import/extensions': [
          0,
          'ignorePackages',
          { ts: 'never', tsx: 'never', js: 'never', jsx: 'never' },
        ],
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        map: [
          ['src', path.resolve(__dirname, 'src')],
          ['@', path.resolve(__dirname, 'src')],
        ],
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      },
    },
  },
  /**
   * 0 ~ 'off'
   * 1 ~ 'warn'
   * 2 ~ 'error'
   */
  rules: {
    'no-use-before-define': 0,
    'no-alert': 0,
    camelcase: 0,
    'no-console': 0,
    'no-unused-vars': 0,
    'no-nested-ternary': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
    'no-restricted-exports': 0,
    'no-promise-executor-return': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'import/extensions': [
      0,
      'ignorePackages',
      { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
    ],
    'prefer-destructuring': [0, { object: true, array: false }],
    // react
    'react/prop-types': 0,
    'react/no-children-prop': 0,
    'react/react-in-jsx-scope': 0,
    'react/no-array-index-key': 0,
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 0,
    'react/function-component-definition': 0,
    'react/jsx-no-duplicate-props': [0, { ignoreCase: false }],
    'react/jsx-no-useless-fragment': [0, { allowExpressions: true }],
    'react/no-unstable-nested-components': [0, { allowAsProps: true }],
    'react/no-unescaped-entities': 0,
    'consistent-return': 0,
    'import/order': 0,
    'import/no-duplicates': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'prefer-arrow-callback': 0,
    'no-restricted-syntax': 0,
    'no-continue': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-plusplus': 0,
    'no-await-in-loop': 0,
    'arrow-body-style': 0,
    'react/jsx-no-constructed-context-values': 0,
    // jsx-a11y
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/control-has-associated-label': 0,
    // unused imports
    'unused-imports/no-unused-imports': 0,
    'unused-imports/no-unused-vars': [
      0,
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
    // perfectionist
    'perfectionist/sort-exports': [0, { order: 'asc', type: 'line-length' }],
    'perfectionist/sort-named-imports': [0, { order: 'asc', type: 'line-length' }],
    'perfectionist/sort-named-exports': [0, { order: 'asc', type: 'line-length' }],
    'perfectionist/sort-imports': [
      0,
      {
        order: 'asc',
        type: 'line-length',
        'newlines-between': 'ignore',
        groups: [
          'style',
          'type',
          ['builtin', 'external'],
          'custom-mui',
          'custom-routes',
          'custom-hooks',
          'custom-utils',
          'internal',
          'custom-components',
          'custom-sections',
          'custom-auth',
          'custom-types',
          ['parent', 'sibling', 'index'],
          ['parent-type', 'sibling-type', 'index-type'],
          'object',
          'unknown',
        ],
        'custom-groups': {
          value: {
            ['custom-mui']: '@mui/**',
            ['custom-auth']: 'src/auth/**',
            ['custom-hooks']: 'src/hooks/**',
            ['custom-utils']: 'src/utils/**',
            ['custom-types']: 'src/types/**',
            ['custom-routes']: 'src/routes/**',
            ['custom-sections']: 'src/sections/**',
            ['custom-components']: 'src/components/**',
          },
        },
        'internal-pattern': ['src/**'],
      },
    ],
  },
};
