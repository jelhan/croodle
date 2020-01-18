'use strict';

module.exports = {
  app: {
    javascript: {
      pattern: 'assets/*.js',
      limit: '420KB',
      compression: 'gzip'
    },
    css: {
      pattern: 'assets/*.css',
      limit: '16KB',
      compression: 'gzip'
    }
  }
};
