import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'croodle/config/environment';
import { registerDateLibrary } from 'ember-power-calendar';
import DateUtils from 'ember-power-calendar-luxon';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);
registerDateLibrary(DateUtils);
