/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-cli-page-object.old-collection-api" },
    { handler: "silence", matchId: "ember-name-key-usage" },
    { handler: "silence", matchId: "ember-metal.run.sync" },
    { handler: "silence", matchId: "ember-runtime.deprecate-copy-copyable" }
  ]
};
