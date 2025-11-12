import { createServer } from 'miragejs';
import factories from './factories';
import identityManagers from './identity-managers';
import models from './models';
import serializers from './serializers';
import { pluralize, singularize } from 'ember-inflector';

export function startServer(config = {}) {
  const { environment } = config;

  const finalConfig = {
    environment,

    models,
    identityManagers,
    serializers,
    factories,

    inflector: {
      pluralize,
      singularize,
    },

    routes() {
      this.logging = true;
      this.namespace = '/api/index.php'; // make this `api`, for example, if your API is namespaced
      this.timing = 400; // delay for each request, automatically set to 0 during testing

      // Ember ESLint rules wrongly consider this as an access of Ember.get but it is not.
      // It's an API provided by Mirage to regiter a GET route handler
      //
      // eslint-disable-next-line ember/no-get
      this.get('/polls/:id');
      this.post('/polls');
      this.post('/users');
    },
  };

  return createServer(finalConfig);
}
