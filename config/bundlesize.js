'use strict';

module.exports = {
  app: {
    javascript: {
      pattern: 'assets/*.js',
      limit: '270KB',
      compression: 'gzip',
    },
    css: {
      pattern: 'assets/*.css',
      limit: '16.5KB',
      compression: 'gzip',
    },
  },
};
