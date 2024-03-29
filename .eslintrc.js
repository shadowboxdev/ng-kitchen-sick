module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      './tsconfig.eslint.json',
      './apps/*/tsconfig.json',
      './libs/*/tsconfig.json'
    ],
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  ignorePatterns: ['**/*'],
  plugins: [
    '@nrwl/nx',
    'eslint-plugin-import',
    '@angular-eslint/eslint-plugin',
    '@typescript-eslint',
    'unused-imports'
  ],
  settings: {
    'import/cache': 'Infinity',
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@nrwl/nx/enforce-module-boundaries': [
          'error',
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              {
                sourceTag: '*',
                onlyDependOnLibsWithTags: ['*']
              }
            ]
          }
        ]
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['plugin:@nrwl/nx/typescript'],
      rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports-ts': 'error',
        '@angular-eslint/component-class-suffix': 'error',
        '@angular-eslint/directive-class-suffix': 'error',
        '@angular-eslint/no-input-rename': 'error',
        '@angular-eslint/no-output-on-prefix': 'error',
        '@angular-eslint/no-output-rename': 'error',
        '@angular-eslint/use-pipe-transform-interface': 'error',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true
          }
        ],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'explicit',
            overrides: {
              constructors: 'no-public'
            }
          }
        ],
        '@typescript-eslint/init-declarations': ['error', 'always'],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/naming-convention': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/quotes': ['error', 'single'],
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-body-style': 'error',
        'constructor-super': 'error',
        eqeqeq: ['error', 'smart'],
        'guard-for-in': 'error',
        'id-blacklist': 'off',
        'id-match': 'off',
        'import/no-deprecated': 'warn',
        'import/order': [
          'warn',
          {
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true },
            groups: ['builtin', 'external', 'internal', ['sibling', 'parent']],
            pathGroups: [
              {
                "pattern": "@angular/*(material|cdk)/*",
                "group": "builtin",
                "position": "after"
              },
              {
                "pattern": "@angular/**/*",
                "group": "builtin",
                "position": "before"
              }
            ],
            pathGroupsExcludedImportTypes: []
          }
        ],
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-console': [
          'error',
          {
            allow: [
              'log',
              'dirxml',
              'warn',
              'error',
              'dir',
              'timeLog',
              'assert',
              'clear',
              'count',
              'countReset',
              'group',
              'groupCollapsed',
              'groupEnd',
              'table',
              'Console',
              'markTimeline',
              'profile',
              'profileEnd',
              'timeline',
              'timelineEnd',
              'timeStamp',
              'context'
            ]
          }
        ],
        'no-debugger': 'error',
        'no-empty': 'off',
        'no-eval': 'error',
        'no-fallthrough': 'error',
        'no-new-wrappers': 'error',
        'no-restricted-imports': [
          'error',
          {
            paths: ['rxjs/Rx'],
            patterns: ['rxjs/(?!operators|testing)']
          }
        ],
        'no-shadow': [
          'error',
          {
            hoist: 'all'
          }
        ],
        'no-throw-literal': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'off',
        'no-unused-labels': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        radix: 'error',
        'spaced-comment': [
          'error',
          'always',
          {
            markers: ['/']
          }
        ],
        indent: 'off'
      }
    },
    {
      files: ['*.js', '*.jsx'],
      extends: ['plugin:@nrwl/nx/javascript'],
      rules: {}
    }
  ]
};
