'use strict';

module.exports = {
  app: {
    javascript: {
      pattern: 'assets/*.js',
      limit: '382KB',
      compression: 'gzip'
    },
    css: {
      pattern: 'assets/*.css',
      limit: '15.3KB',
      compression: 'gzip'
    }
  }
};
