import Ember from 'ember';

export default Ember.Test.registerHelper('pollHasValidURL', function(app, assert) {
  const pollURL = currentURL();
  const regExp = /^\/poll\/[a-zA-Z0-9]{10}\/participation\?encryptionKey=[a-zA-Z0-9]{40}$/;
  assert.ok(
    regExp.test(pollURL),
    `poll URL ${currentURL()} looks fine`
  );
});
