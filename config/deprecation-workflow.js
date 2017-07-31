window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-getowner-polyfill.import' },
    { handler: 'silence', matchId: 'container-lookupFactory' },
    { handler: 'silence', matchId: 'ember-metal.ember-k' }
  ]
};
