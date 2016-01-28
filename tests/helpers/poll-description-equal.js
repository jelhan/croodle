import Ember from 'ember';

export default Ember.Test.registerHelper('pollDescriptionEqual', function(app, assert, expected) {
  const actual = find('.description').text();
  assert.equal(actual, expected, 'poll description is correct');
});
