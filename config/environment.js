/* jshint node: true */
/* jscs:disable requireEnhancedObjectLiterals */

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'croodle',
    environment: environment,
    locationType: 'hash',
    rootURL: '/',

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self'",
      'font-src': "'self'",
      'connect-src': "'self'",
      'img-src': "'none'",
      'style-src': "'self'",
      'media-src': "'none'",
      'referrer': "no-referrer"
    },

    EmberENV: {
      EXTEND_PROTOTYPES: {
        Array: true,
        Date: false,
        String: false,
        Function: true
      }
    },

    moment: {
      includeLocales: ['de', 'es'],
      includeTimezone: 'subset'
    },

    i18n: {
      defaultLocale: 'en'
    }
  };

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'hash';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  return ENV;
};
