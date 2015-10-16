import Ember from 'ember';

export default Ember.Test.registerHelper('pollHasAnswers', function(app, assert, answers) {
  var elBase = find('.newUserSelection')[0];
  assert.equal(
    find('.radio label>span', elBase).length,
    answers.length,
    'poll has expected count of answers'
  );
  answers.forEach((answer, index) => {
    assert.equal(
      find('.radio:nth-child(' + (index + 1) + ') label>span', elBase).text().trim(),
      answer,
      'poll answer ' + index + ' is as expected'
    );
  });
});
