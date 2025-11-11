import { createServer } from 'miragejs';
import factories from './factories';
import identityManagers from './identity-managers';
import models from './models';
import serializers from './serializers';
import { pluralize, singularize } from 'ember-inflector';

export default function (config) {
  const finalConfig = {
    ...config,

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

      this.get('/polls/:id');
      this.post('/polls');
      this.post('/users');
    },
  };

  return createServer(finalConfig);
}
