'use strict';

module.exports = {
  app: {
    javascript: {
      pattern: 'assets/*.js',
      limit: '400KB',
      compression: 'gzip'
    },
    css: {
      pattern: 'assets/*.css',
      limit: '22KB',
      compression: 'gzip'
    }
  }
};
