import EmberRouter from '@ember/routing/router';
import config from 'croodle/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('poll', { path: '/poll/:poll_id' }, function () {
    this.route('participation');
    this.route('evaluation');
  });
  this.route('create', function () {
    this.route('meta');
    this.route('options');
    this.route('options-datetime');
    this.route('settings');
  });
  this.route('poll-error');
});
