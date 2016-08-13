import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import moment from 'moment';

const { Object: EmberObject, run } = Ember;

moduleForComponent('create-options-dates', 'Unit | Component | create options dates', {
  needs: ['model:option'],
  unit: true,
  beforeEach() {
    this.inject.service('store');
  }
});

test('options get mapped to dates as optionsBootstrapDatepicker (used by ember-cli-bootstrap-datepicker)', function(assert) {
  let controller = this.subject();
  controller.set('options', [
    EmberObject.create({ title: '1945-05-09' }),
    EmberObject.create({ title: '1987-05-01' }),
    EmberObject.create({ title: 'non valid date string' })
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

test('options having times get mapped to dates as optionsBootstrapDatepicker (used by ember-cli-bootstrap-datepicker)', function(assert) {
  let controller = this.subject();
  controller.set('options', [
    EmberObject.create({ title: '2014-01-01T12:00:00.00Z' }),
    EmberObject.create({ title: '2015-02-02T15:00:00.00Z' }),
    EmberObject.create({ title: '2015-02-02T15:00:00.00Z' }),
    EmberObject.create({ title: '2016-03-03' })
  ]);
  assert.ok(
    Ember.isArray(
      controller.get('optionsBootstrapDatepicker')
    ),
    "it's an array"
  );
  assert.equal(
    controller.get('optionsBootstrapDatepicker.length'),
    3,
    'array length is correct'
  );
  assert.ok(
    controller.get('optionsBootstrapDatepicker').every((el) => {
      return moment.isDate(el);
    }),
    'array elements are date objects'
  );
  assert.deepEqual(
    controller.get('optionsBootstrapDatepicker').map((option) => {
      return option.toISOString();
    }),
    [
      moment('2014-01-01').toISOString(),
      moment('2015-02-02').toISOString(),
      moment('2016-03-03').toISOString()
    ],
    'date is correct'
  );
});

test('options get set correctly by optionsBootstrapDatepicker (used by ember-cli-bootstrap-datepicker)', function(assert) {
  let controller = this.subject();
  run.next(() => {
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
      'options is still an array'
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

test('existing times are preserved if new days get selected', function(assert) {
  let component;
  run(() => {
    component = this.subject({
      options: [
        this.store.createFragment('option', {
          title: moment('2015-01-01T11:11').toISOString()
        }),
        this.store.createFragment('option', {
          title: moment('2015-01-01T22:22').toISOString()
        }),
        this.store.createFragment('option', {
          title: moment('2015-06-06T08:08').toISOString()
        }),
        this.store.createFragment('option', {
          title: '2016-01-01'
        })
      ]
    });
  });
  // add another day
  run(() => {
    component.set('optionsBootstrapDatepicker', [
      moment('2015-01-01').toDate(),
      moment('2015-06-06').toDate(),
      moment('2016-01-01').toDate(),
      moment('2016-06-06').toDate() // new day
    ]);
  });
  assert.deepEqual(
    component.get('options').map((option) => option.get('title')),
    [
      moment('2015-01-01T11:11').toISOString(),
      moment('2015-01-01T22:22').toISOString(),
      moment('2015-06-06T08:08').toISOString(),
      '2016-01-01',
      '2016-06-06'
    ],
    'preseve existing times if another day is added'
  );
  // delete a day
  run(() => {
    component.set('optionsBootstrapDatepicker', [
      moment('2015-06-06').toDate(),
      moment('2016-01-01').toDate(),
      moment('2016-06-06').toDate()
    ]);
  });
  assert.deepEqual(
    component.get('options').map((option) => option.get('title')),
    [
      moment('2015-06-06T08:08').toISOString(),
      '2016-01-01',
      '2016-06-06'
    ],
    'preseve existing times if a day is deleted'
  );
  // order if multiple days are added
  run(() => {
    component.set('optionsBootstrapDatepicker', [
      moment('2015-06-06').toDate(),
      moment('2016-01-01').toDate(),
      moment('2016-06-06').toDate(),
      moment('2016-12-12').toDate(),
      moment('2015-01-01').toDate(),
      moment('2016-03-03').toDate()
    ]);
  });
  assert.deepEqual(
    component.get('options').map((option) => option.get('title')),
    [
      '2015-01-01',
      moment('2015-06-06T08:08').toISOString(),
      '2016-01-01',
      '2016-03-03',
      '2016-06-06',
      '2016-12-12'
    ],
    'options are in correct order after multiple days are added'
  );
});
