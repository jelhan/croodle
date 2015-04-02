/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  // do not fingerprint webshim
  fingerprint: {
    exclude: ['assets/shims']
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
  development: 'bower_components/moment/min/moment-with-locales.js',
  production: 'bower_components/moment/min/moment-with-locales.min.js'
});

app.import({
  development: 'bower_components/bootstrap/dist/js/bootstrap.js',
  production: 'bower_components/bootstrap/dist/js/bootstrap.min.js'
});
app.import({
  development: 'bower_components/bootstrap/dist/css/bootstrap.css',
  production: 'bower_components/bootstrap/dist/css/bootstrap.min.css'
});
if (app.env === 'development') {
  app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', {
    destDir: 'assets'
  });
}

app.import('bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js');
app.import('bower_components/bootstrap-datepicker/js/locales/bootstrap-datepicker.de.js');

app.import('bower_components/ember-easyForm/index.js');

app.import('bower_components/ember-i18n/lib/i18n.js');
app.import('bower_components/ember-i18n/lib/i18n-plurals.js');

app.import({
  development: 'bower_components/floatThead/dist/jquery.floatThead.js',
  production: 'bower_components/floatThead/dist/jquery.floatThead.min.js'
});

app.import({
  development: 'bower_components/webshim/js-webshim/dev/polyfiller.js',
  production: 'bower_components/webshim/js-webshim/minified/polyfiller.js'
});

app.import('bower_components/sjcl/sjcl.js');

app.import('bower_components/modernizr/modernizr.js');

var pickFiles = require('broccoli-static-compiler');
// include webshim files into dist
var webshim = pickFiles('bower_components/webshim/js-webshim/minified/shims', {
  srcDir: '/',
  destDir: '/assets/shims'
});

// include dummy data into dist if environment is development or test
if (app.env === 'development' || app.env === 'test') {
  var dummyData = pickFiles('server/dummy', {
    srcDir: '/',
    destDir: '/data'
  });
}

var mergeTrees = require('broccoli-merge-trees');
module.exports = mergeTrees([
  app.toTree(),
  webshim,
  dummyData
]);