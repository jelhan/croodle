import Ember from 'ember';

export default Ember.Test.registerHelper('pollHasOptions', function(app, assert, expectedOptions) {
  const elBase = find('.participation .selections');

  assert.equal(
    find('.form-group', elBase).length,
    expectedOptions.length,
    'poll has expected count of options'
  );

  expectedOptions.forEach((option, index) => {
    assert.equal(
      find('.form-group:nth-child(' + (index + 1) + ') label.control-label', elBase).text().trim(),
      option,
      'poll option ' + index + ' is as expected'
    );
  });
});
