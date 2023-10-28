/* global self */

self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    // @ember/string deprecation is thrown even if all deprecated behavior is
    // fixed due to a bug in Ember itself. Details can be found in:
    // https://github.com/emberjs/ember.js/issues/20377
    {
      handler: 'silence',
      matchId: 'ember-string.add-package',
    },
  ],
};
