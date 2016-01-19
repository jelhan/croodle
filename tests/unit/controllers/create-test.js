import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import moment from 'moment';

moduleFor('controller:create', {
  needs: ['model:option']
});

test('optionsDateTimes is created correctly according model.options', function(assert) {
  let controller = this.subject();
  controller.set('model', Ember.Object.create({
    options: [
      Ember.Object.create({ title: '1973-11-14' }),
      Ember.Object.create({ title: '1974-04-25' })
    ]
  }));
  assert.ok(
    Ember.isArray(controller.get('optionsDateTimes')),
    "it's an array"
  );
  assert.equal(
    controller.get('optionsDateTimes.length'),
    2,
    'length is correct'
  );
  assert.equal(
    controller.get('optionsDateTimes.firstObject.title').toISOString(),
    moment('1973-11-14').toISOString(),
    'date is correct'
  );
});

/*
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
*/
