'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    autoImport: {
      forbidEval: true,
      webpack: {
        externals: {
          // sjcl requires node's cryto library, which isn't needed
          // in Browser but causes webpack to bundle a portable version
          // which increases the build size by an inacceptable amount
          crypto: 'null',
        },
      },
    },
    buildInfoOptions: {
      metaTemplate: 'version={SEMVER}',
    },
    'ember-bootstrap': {
      importBootstrapCSS: false,
      bootstrapVersion: 4,
      importBootstrapFont: false,
      include: [
        'bs-alert',
        'bs-button',
        'bs-button-group',
        'bs-form',
        'bs-modal',
        'bs-tooltip',
      ],
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
    'ember-composable-helpers': {
      only: ['array', 'pick'],
    },
    'ember-math-helpers': {
      only: ['lte', 'sub'],
    },
    autoprefixer: {
      browsers: ['last 2 ios version'],
      cascade: false,
      sourcemap: true,
    },
    sassOptions: {
      sourceMapEmbed: true,
      includePaths: ['node_modules'],
    },
  });

  app.import('node_modules/open-iconic/font/fonts/open-iconic.ttf');
  app.import('node_modules/open-iconic/font/fonts/open-iconic.woff');

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    // `ember-cli-deprecation-workflow` does not support `staticEmberSource = true`
    // yet. See https://github.com/mixonic/ember-cli-deprecation-workflow/issues/156
    // for details.
    staticEmberSource: false,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packagerOptions: {
      webpackConfig: {
        devtool: 'source-map',
      },
    },
  });
};
