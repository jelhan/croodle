/* jshint node: true */
/* jscs:disable requireEnhancedObjectLiterals */

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'croodle',
    environment: environment,
    locationType: 'hash',

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-eval'",
      'font-src': "'self'",
      'connect-src': "'self'",
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline'",
      'media-src': "'self'"
    },

    moment: {
      includeLocales: ['de', 'es'],
      includeTimezone: '2010-2020'
    },

    i18n: {
      defaultLocale: 'en'
    }
  };

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'hash';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  return ENV;
};
