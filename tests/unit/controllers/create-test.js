import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('controller:create', {
  needs: ['model:option']
});

test('dates get mapped to options correctly', function(assert) {
  var controller = this.subject();
  Ember.run.next(() => {
    controller.set('model', Ember.Object.create({
      isFindADate: true,
      isDateTime: false,
      options: []
    }));
    controller.set('optionsDates', [
      { 'title': new Date(2015, 0, 1) },
      { 'title': new Date(2015, 1, 1) },
      { 'title': new Date(2014, 11, 1) }
    ]);
    assert.equal(
      controller.get('model.options.0.title'),
      "2014-12-01",
      "Date objects are converted to ISO 8601 date strings and sorted (1)"
    );
    assert.equal(
      controller.get('model.options.1.title'),
      "2015-01-01",
      "Date objects are converted to ISO 8601 date strings and sorted (2)"
    );
    assert.equal(
      controller.get('model.options.2.title'),
      "2015-02-01",
      "Date objects are converted to ISO 8601 date strings and sorted (3)"
    );
  });
});

test('dates with times get mapped to options correctly', function(assert) {
  var controller = this.subject();
  Ember.run.next(() => {
    controller.set('model', Ember.Object.create({
      isFindADate: true,
      isDateTime: true,
      options: []
    }));
    controller.set('optionsDateTimes', [
      controller.get('optionsDateTimesObject').create({
        'title': new Date(2015, 1, 1),
        'times': [{value: '10:00'}, {value: '12:00'}, {value: '08:00'}]
      }),
      controller.get('optionsDateTimesObject').create({
        'title': new Date(2015, 0, 1),
        'times': [{value: '09:15'}, {value: '09:00'}]
      })
    ]);
    assert.equal(
      controller.get('model.options.length'),
      5,
      "correct number of dates are produced from day + time combination"
    );
    assert.equal(
      controller.get('model.options.0.title'),
      new Date(2015, 0, 1, 9, 0, 0).toISOString(),
      "Date objects are converted to ISO 8601 date strings and sorted (1)"
    );
    assert.equal(
      controller.get('model.options.1.title'),
      new Date(2015, 0, 1, 9, 15, 0).toISOString(),
      "Date objects are converted to ISO 8601 date strings and sorted (1)"
    );
    assert.equal(
      controller.get('model.options.2.title'),
      new Date(2015, 1, 1, 8, 0 ,0).toISOString(),
      "Date objects are converted to ISO 8601 date strings and sorted (2)"
    );
    assert.equal(
      controller.get('model.options.3.title'),
      new Date(2015, 1, 1, 10, 0 ,0).toISOString(),
      "Date objects are converted to ISO 8601 date strings and sorted (3)"
    );
    assert.equal(
      controller.get('model.options.4.title'),
      new Date(2015, 1, 1, 12, 0 ,0).toISOString(),
      "Date objects are converted to ISO 8601 date strings and sorted (4)"
    );
  });
});
