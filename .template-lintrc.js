'use strict';

module.exports = {
  plugins: ['ember-template-lint-plugin-prettier'],
  extends: ['recommended', 'ember-template-lint-plugin-prettier:recommended'],
  rules: {
    'no-implicit-this': {
      allow: ['scroll-first-invalid-element-into-view-port'],
    },
  },
  overrides: [
    {
      files: ['tests/integration/modifiers/*.js'],
      rules: {
        'require-input-label': false,
      },
    },
  ],
};
