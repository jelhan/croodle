import Ember from 'ember';

export default Ember.Test.registerHelper('pollTitleEqual', function(app, assert, expected) {
  var actual = find('.title').text();
  assert.equal(actual, expected, 'poll title is correct');
});
