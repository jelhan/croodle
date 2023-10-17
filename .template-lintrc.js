'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-action': false,
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
