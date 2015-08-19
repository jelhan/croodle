import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
/* global webshim */

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

import formattedDateHelper from 'croodle/helpers/formatted-date';
Ember.Handlebars.registerBoundHelper('formattedDate', formattedDateHelper);

loadInitializers(App, config.modulePrefix);

webshim.polyfill('forms forms-ext');

export default App;
