'use strict';

const browsers = [
  'last 2 Chrome versions',
  // Last Edge versions are based on Chrome but not shipped to a significant
  // number of users. Change to `last 2 Edge versions` as soon as Chrome-based
  // Edge is shipped to all users.
  'Edge >= 18',
  'last 2 Firefox versions',
  'Firefox ESR',
  'last 2 Safari versions',
];

module.exports = {
  browsers
};
