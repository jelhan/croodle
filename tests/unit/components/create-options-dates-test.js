import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import moment from 'moment';

moduleForComponent('create-options-dates', 'Unit | Component | create options dates', {
  needs: ['model:option'],
  unit: true
});

test('options get mapped to dates as optionsBootstrapDatepicker (used by ember-cli-bootstrap-datepicker)', function(assert) {
  let controller = this.subject();
  controller.set('options', [
    Ember.Object.create({ title: '1945-05-09' }),
    Ember.Object.create({ title: '1987-05-01' }),
    Ember.Object.create({ title: 'non valid date string' })
  ]);
  assert.ok(
    Ember.isArray(
      controller.get('optionsBootstrapDatepicker')
    ),
    "it's an array"
  );
  assert.equal(
    controller.get('optionsBootstrapDatepicker.length'),
    2,
    'array length is correct'
  );
  assert.ok(
    controller.get('optionsBootstrapDatepicker').every((el) => {
      return moment.isDate(el);
    }),
    'array elements are date objects'
  );
  assert.equal(
    controller.get('optionsBootstrapDatepicker.firstObject').toISOString(),
    moment('1945-05-09').toISOString(),
    'date is correct'
  );
});

test('options get set correctly by optionsBootstrapDatepicker (used by ember-cli-bootstrap-datepicker)', function(assert) {
  let controller = this.subject();
  Ember.run.next(() => {
    controller.set('options', []);
    // dates must be in wrong order to test sorting
    controller.set('optionsBootstrapDatepicker', [
      moment('1918-11-09').toDate(),
      moment('1917-10-25').toDate()
    ]);
    assert.ok(
      Ember.isArray(
        controller.get('options')
      ),
      "options is still an array"
    );
    assert.equal(
      controller.get('options.length'),
      2,
      'array has correct length'
    );
    assert.ok(
      controller.get('options').every((option) => {
        return typeof option.get('title') === 'string';
      }),
      'option.title is a string'
    );
    assert.ok(
      controller.get('options').every((option) => {
        return moment(option.get('title'), 'YYYY-MM-DD', true).isValid();
      }),
      'option.title is an ISO-8601 date string without time'
    );
    assert.ok(
      controller.get('options').findBy('title', '1918-11-09'),
      'date is correct'
    );
    assert.equal(
      controller.get('options.firstObject.title'),
      '1917-10-25',
      'dates are in correct order'
    );
  });
});
