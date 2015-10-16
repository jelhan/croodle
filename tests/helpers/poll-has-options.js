import Ember from 'ember';

export default function(){
  Ember.Test.registerHelper('pollHasOptions', function(app, assert, expectedOptions, dateGroups) {
    var elBase = find('.user-selections-table thead tr');

    assert.equal(
      find('th', elBase).length - 2,
      expectedOptions.length,
      'poll has expected count of options'
    );
    expectedOptions.forEach((option, index) => {
      assert.equal(
        find('th:nth-child(' + (index + 2) + ')', elBase).text().trim(),
        option,
        'poll option ' + index + ' is as expected'
      );
    });
  });
  
  Ember.Test.registerHelper('pollHasOptionsDates', function(app, assert, expectedOptions) {
    var elBase = find('.user-selections-table thead tr.dateGroups');
    
    assert.equal(
      find('th', elBase).length - 2,
      expectedOptions.length,
      'poll has expected count of different dates in options'
    );
    expectedOptions.forEach((option, index) => {
      assert.equal(
        find('th:nth-child(' + (index + 2) + ')', elBase).text().trim(),
        option,
        'poll date group ' + index + ' is as expected'
      );
    });
  });

  Ember.Test.registerHelper('pollHasOptionsTimes', function(app, assert, expectedOptions) {
    var elBase = find('.user-selections-table thead tr:not(.dateGroups)');

    assert.equal(
      find('th', elBase).length - 2,
      expectedOptions.length,
      'poll has expected count of options (times)'
    );
    expectedOptions.forEach((option, index) => {
      assert.equal(
        find('th:nth-child(' + (index + 2) + ')', elBase).text().trim(),
        option,
        'poll time ' + index + ' is as expected'
      );
    });
  });
}()
