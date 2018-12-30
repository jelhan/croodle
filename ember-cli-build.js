'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'buildInfoOptions': {
      'metaTemplate': 'version={SEMVER}'
    },
    'ember-bootstrap': {
      importBootstrapCSS: false,
      'bootstrapVersion': 3,
      'importBootstrapFont': true
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-composable-helpers': {
      only: ['array', 'object-at'],
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('vendor/bootstrap-datepicker-locales/bootstrap-datepicker.ca.min.js');
  app.import('vendor/bootstrap-datepicker-locales/bootstrap-datepicker.de.min.js');
  app.import('vendor/bootstrap-datepicker-locales/bootstrap-datepicker.en-GB.min.js');
  app.import('vendor/bootstrap-datepicker-locales/bootstrap-datepicker.es.min.js');
  app.import('vendor/bootstrap-datepicker-locales/bootstrap-datepicker.it.min.js');

  app.import({
    development: 'bower_components/floatThead/dist/jquery.floatThead.js',
    production: 'bower_components/floatThead/dist/jquery.floatThead.min.js'
  });

  app.import('bower_components/sjcl/sjcl.js', {
    using: [
      { transformation: 'amd', as: 'sjcl' }
    ]
  });

  return app.toTree();
};
