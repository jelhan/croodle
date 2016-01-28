import Ember from 'ember';

export default Ember.Test.registerHelper('pollHasAnswers', function(app, assert, answers) {
  const elBase = find('.participation .selections .form-group')[0];
  assert.equal(
    find('.radio label', elBase).length,
    answers.length,
    'poll has expected count of answers'
  );
  answers.forEach((answer, index) => {
    assert.equal(
      find('.radio:nth-child(' + (index + 1) + ') label', elBase).text().trim(),
      answer,
      'poll answer ' + index + ' is as expected'
    );
  });
});
