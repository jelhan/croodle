'use strict';

module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-prettier/recommended'],
  rules: {
    'declaration-block-no-duplicate-properties': null,
    'no-descending-specificity': null,
    'scss/no-global-function-names': null,
    'selector-class-pattern': null,
  },
};
