'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'buildInfoOptions': {
      'metaTemplate': 'version={SEMVER}'
    },
    'ember-auto-import': {
      forbidEval: true,
    },
    'ember-bootstrap': {
      importBootstrapCSS: false,
      'bootstrapVersion': 3,
      'importBootstrapFont': true,
      whitelist: ['bs-alert', 'bs-button', 'bs-button-group', 'bs-form', 'bs-modal'],
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-composable-helpers': {
      only: ['array', 'object-at'],
    },
    'ember-math-helpers': {
      only: ['gt', 'lte', 'sub'],
    },
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

  app.import({
    development: 'node_modules/floatthead/dist/jquery.floatThead.js',
    production: 'node_modules/floatthead/dist/jquery.floatThead.min.js'
  });

  app.import('node_modules/sjcl/sjcl.js', {
    using: [
      { transformation: 'amd', as: 'sjcl' }
    ]
  });

  return app.toTree();
};
