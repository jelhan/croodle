self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  throwOnUnhandled: true,
  workflow: [
    {
      handler: 'silence',
      matchId: 'deprecated-run-loop-and-computed-dot-access',
    },
    {
      handler: 'silence',
      matchId: 'ember-cli-mirage-config-routes-only-export',
    },
    { handler: 'silence', matchId: 'ember-modifier.function-based-options' },
    { handler: 'silence', matchId: 'ember-cli-mirage.miragejs.import' },
    { handler: 'silence', matchId: 'ember.link-to.tag-name' },
    { handler: 'silence', matchId: 'ember-cli-page-object.multiple' },
    { handler: 'silence', matchId: 'autotracking.mutation-after-consumption' },
    { handler: 'silence', matchId: 'ember-runtime.deprecate-copy-copyable' },
  ],
};
