import EmberRouter from '@ember/routing/router';
import config from 'croodle/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('create');
  this.route('poll', { path: '/p/:poll_id' });
});
