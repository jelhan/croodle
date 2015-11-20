/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var pickFiles = require('broccoli-static-compiler');
  var unwatchedTree    = require('broccoli-unwatched-tree');
  var trees = [];

  var app = new EmberApp({
    'buildInfoOptions': {
      'metaTemplate': 'version={SEMVER}'
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

  app.import({
    development: 'bower_components/bootstrap/dist/js/bootstrap.js',
    production: 'bower_components/bootstrap/dist/js/bootstrap.min.js'
  });
  app.import({
    development: 'bower_components/bootstrap/dist/css/bootstrap.css',
    production: 'bower_components/bootstrap/dist/css/bootstrap.min.css'
  });
  if (app.env === 'development' || app.env === 'test') {
    app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', {
      destDir: 'assets'
    });
  }
  // include bootstrap fonts in dist
  trees.push(
    pickFiles('bower_components/bootstrap/dist/fonts', {
      srcDir: '/',
      destDir: '/fonts'
    })
  );

  app.import('bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js');
  app.import('bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.de.js');

  app.import({
    development: 'bower_components/floatThead/dist/jquery.floatThead.js',
    production: 'bower_components/floatThead/dist/jquery.floatThead.min.js'
  });

  app.import('bower_components/sjcl/sjcl.js');

  app.import('bower_components/modernizr/modernizr.js');

  app.import('bower_components/jstimezonedetect/jstz.js');

  // include api files into dist
  trees.push(
    pickFiles(unwatchedTree('api'), {
      srcDir: '/',
      destDir: '/api',
      files: ['index.php', 'cron.php', 'classes/*', 'vendor/*']
    })
  );

  if (app.env === 'development' || app.env === 'test') {
    trees.push(
      pickFiles('tests/dummyData', {
        srcDir: '/',
        destDir: '/data'
      })
    );
  }

  trees.push(app.toTree());
  var mergeTrees = require('broccoli-merge-trees');
  return mergeTrees(trees);
};
