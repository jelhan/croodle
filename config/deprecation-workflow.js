self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  throwOnUnhandled: true,
  workflow: [
    {
      handler: 'silence',
      matchId: 'deprecated-run-loop-and-computed-dot-access',
    },
    { handler: 'silence', matchId: 'implicit-injections' },
    {
      handler: 'silence',
      matchId: 'ember-cli-mirage-config-routes-only-export',
    },
    {
      handler: 'silence',
      matchId: 'argument-less-helper-paren-less-invocation',
    },
    { handler: 'silence', matchId: 'ember-modifier.function-based-options' },
    { handler: 'silence', matchId: 'ember-cli-mirage.miragejs.import' },
    { handler: 'silence', matchId: 'routing.transition-methods' },
    { handler: 'silence', matchId: 'ember.link-to.tag-name' },
    { handler: 'silence', matchId: 'ember-cli-page-object.multiple' },
    { handler: 'silence', matchId: 'autotracking.mutation-after-consumption' },
    { handler: 'silence', matchId: 'ember-runtime.deprecate-copy-copyable' },
    { handler: 'silence', matchId: 'this-property-fallback' },
  ],
};
