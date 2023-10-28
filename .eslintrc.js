'use strict';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['ember', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    // Croodle is not compliant with some of the recommended rules yet.
    // We should refactor the code step by step and enable them as soon
    // as the code is compliant.
    'ember/classic-decorator-no-classic-methods': 'warn',
    'ember/no-controller-access-in-routes': 'warn',
    'ember/no-observers': 'warn',
    'no-prototype-builtins': 'warn',
  },
  overrides: [
    // ts files
    {
      files: ['**/*.ts'],
      extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {},
    },
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.stylelintrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './lib/*/index.js',
        './server/**/*.js',
      ],
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
      rules: {
        'qunit/no-assert-equal': 'warn',
        'qunit/no-assert-logical-expression': 'warn',
        'qunit/no-async-module-callbacks': 'warn',
        'qunit/require-expect': 'warn',
      },
    },
  ],
};
