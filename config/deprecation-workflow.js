/* global self */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-cli-page-object.old-collection-api" },
    { handler: "silence", matchId: "deprecate-fetch-ember-data-support" },
    { handler: "silence", matchId: "computed-property.override" },
    { handler: "silence", matchId: "ember-cp-validations.inline-validator" },
    { handler: "silence", matchId: "ember-runtime.deprecate-copy-copyable" }
  ]
};
