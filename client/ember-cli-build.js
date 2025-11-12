'use strict';;
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const SubresourceIntegrityPlugin = require('webpack-subresource-integrity-embroider');
const path = require('path');

const {
  compatBuild
} = require("@embroider/compat");

module.exports = async function(defaults) {
  const {
    buildOnce
  } = await import("@embroider/vite");

  const app = new EmberApp(defaults, {
    buildInfoOptions: {
      metaTemplate: 'version={SEMVER}',
    },
    'ember-bootstrap': {
      importBootstrapCSS: false,
      bootstrapVersion: 4,
      importBootstrapFont: false,
    },
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
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

  return compatBuild(app, buildOnce, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticEmberSource: true,
    staticInvokables: true,

    packagerOptions: {
      webpackConfig: {
        devtool: 'source-map',
        plugins: [new SubresourceIntegrityPlugin()],
        resolve: {
          // Avoid duplicated instances of Luxon in build
          // https://github.com/cibernox/ember-power-calendar-luxon/issues/46
          alias: {
            luxon: path.resolve(
              __dirname,
              'node_modules/luxon/build/node/luxon.js',
            ),
          },
          fallback: {
            // SJCL supports node.js as well using node's crypto module.
            // We don't want it to be included in the bundle.
            crypto: false,
          },
        },
      },
      styleLoaderOptions: {
        attributes: {
          nonce: 'must-not-be-present-in-production-builds',
        },
      },
    },

    staticAppPaths: ['mirage']
  });
};
