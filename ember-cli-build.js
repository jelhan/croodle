'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      forbidEval: true,
      webpack: {
        externals: {
          // sjcl requires node's cryto library, which isn't needed
          // in Browser but causes webpack to bundle a portable version
          // which increases the build size by an inacceptable amount
          crypto: "null",
        },
      },
    },
    'buildInfoOptions': {
      'metaTemplate': 'version={SEMVER}'
    },
    'ember-bootstrap': {
      importBootstrapCSS: false,
      'bootstrapVersion': 4,
      'importBootstrapFont': false,
      whitelist: ['bs-alert', 'bs-button', 'bs-button-group', 'bs-form', 'bs-modal'],
    },
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-composable-helpers': {
      only: ['array', 'object-at'],
    },
    'ember-math-helpers': {
      only: ['lte', 'sub'],
    },
    autoprefixer: {
      browsers: ['last 2 ios version'],
      cascade: false,
      sourcemap: true
    },
    sassOptions: {
      sourceMapEmbed: true,
      includePaths: ['node_modules'],
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

  app.import('node_modules/open-iconic/font/fonts/open-iconic.ttf');
  app.import('node_modules/open-iconic/font/fonts/open-iconic.woff');

  return app.toTree();
};
