'use strict';

module.exports = {
  app: {
    javascript: {
      pattern: 'assets/*.js',
      limit: '270KB',
      compression: 'gzip',
    },
    css: {
      // Embroider build includes both the minified and the unminified CSS
      // `assets/` folder. Only the minified CSS is referenced by `index.html`.
      // The unminified version does not increase the bundle size for consumers.
      // We need to exclude it when calculating bundle size.
      // Only the minified version includes a fingerprint. We can exclude the
      // unminified version by using a pattern, which only matches files
      // including a fingerprint hash in their file name.
      pattern: 'assets/croodle.*.css',
      limit: '16.5KB',
      compression: 'gzip',
    },
  },
};
