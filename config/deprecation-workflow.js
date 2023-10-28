/* global self */

self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  throwOnUnhandled: true,
  workflow: [
    {
      handler: 'throw',
      matchId: 'deprecated-run-loop-and-computed-dot-access',
    },
    {
      handler: 'throw',
      matchId: 'ember-cli-mirage-config-routes-only-export',
    },
    { handler: 'throw', matchId: 'ember-modifier.function-based-options' },
    { handler: 'throw', matchId: 'ember-cli-mirage.miragejs.import' },
    { handler: 'throw', matchId: 'ember.link-to.tag-name' },
    { handler: 'throw', matchId: 'ember-cli-page-object.multiple' },
    { handler: 'silence', matchId: 'autotracking.mutation-after-consumption' },
    { handler: 'silence', matchId: 'ember-runtime.deprecate-copy-copyable' },
    // @ember/string deprecation is thrown even if all deprecated behavior is
    // fixed due to a bug in Ember itself. Details can be found in:
    // https://github.com/emberjs/ember.js/issues/20377
    {
      handler: 'silence',
      matchId: 'ember-string.add-package',
    },
  ],
};
