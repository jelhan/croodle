import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import moment from 'moment';

moduleForComponent('create-options-datetime', 'Integration | Component | create options datetime', {
  integration: true
});

/*
 * watch out:
 * polyfill adds another input[type="text"] for every input[type="time"]
 * if browser doesn't support input[type="time"]
 * that ones could be identifed by class 'ws-inputreplace'
 */

test('time input is toggled by radio switch', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: '2015-01-01' })
  ]);
  this.set('isDateTime', false);
  this.render(hbs`{{create-options-datetime options=options isDateTime=isDateTime}}`);
  assert.ok(this.$('.grouped-input input').length === 0);
  Ember.run(() => {
    this.$('.bootstrap-switch-handle-off').click();
  });
  assert.ok(this.$('.grouped-input input').length > 0);
  Ember.run(() => {
    this.$('.bootstrap-switch-handle-on').click();
  });
  assert.ok(this.$('.grouped-input input').length === 0);
});

test('it generates inpute field for options iso 8601 date string (without time)', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: '2015-01-01' })
  ]);
  this.set('isDateTime', true);
  this.render(hbs`{{create-options-datetime options=options isDateTime=isDateTime}}`);

  assert.equal(
    this.$('.grouped-input .form-group input:not(.ws-inputreplace)').length,
    1,
    'there is one input field'
  );
  assert.equal(
    this.$('.grouped-input .form-group input:not(.ws-inputreplace)').val(),
    '',
    'value is an empty string'
  );
});

test('it generates inpute field for options iso 8601 datetime string (with time)', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: '2015-01-01T11:11:00.000Z' })
  ]);
  this.set('isDateTime', true);
  this.render(hbs`{{create-options-datetime options=options isDateTime=isDateTime}}`);

  assert.equal(
    this.$('.grouped-input .form-group input:not(.ws-inputreplace)').length,
    1,
    'there is one input field'
  );
  assert.equal(
    this.$('.grouped-input .form-group input:not(.ws-inputreplace)').val(),
    moment('2015-01-01T11:11:00.000Z').format('HH:mm'),
    'it has time in option as value'
  );
});

test('it groups input fields per date', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: moment('2015-01-01T10:11').toISOString() }),
    Ember.Object.create({ title: moment('2015-01-01T22:22').toISOString() }),
    Ember.Object.create({ title: '2015-02-02' })
  ]);
  this.set('isDateTime', true);
  this.render(hbs`{{create-options-datetime options=options isDateTime=isDateTime}}`);

  assert.equal(
    this.$('.grouped-input').length,
    2,
    'there are two form groups for the two different dates'
  );
  assert.equal(
    this.$('.grouped-input').eq(0).find('input:not(.ws-inputreplace)').length,
    2,
    'the first form group has two input fields for two different times'
  );
  assert.equal(
    this.$('.grouped-input').eq(0).find('input:not(.ws-inputreplace)').length,
    2,
    'the first form group with two differnt times for one day has two input fields'
  );
  assert.equal(
    this.$('.grouped-input').eq(1).find('input:not(.ws-inputreplace)').length,
    1,
    'the second form group without time has only one input field'
  );
});

test('allows to add another option', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: '2015-01-01' }),
    Ember.Object.create({ title: '2015-02-02' })
  ]);
  this.set('isDateTime', true);
  this.render(hbs`{{create-options-datetime options=options isDateTime=isDateTime}}`);

  assert.equal(
    this.$('.grouped-input .form-group input:not(.ws-inputreplace)').length,
    2,
    'there are two input fields before'
  );
  this.$('.grouped-input').eq(0).find('.add').click();
  assert.equal(
    this.$('.grouped-input .form-group input:not(.ws-inputreplace)').length,
    3,
    'another input field is added'
  );
  assert.equal(
    this.$('.grouped-input').eq(0).find('input:not(.ws-inputreplace)').length,
    2,
    'it is added in correct date input'
  );
});

test('allows to delete an option', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: moment('2015-01-01T11:11').toISOString() }),
    Ember.Object.create({ title: moment('2015-01-01T22:22').toISOString() })
  ]);
  this.set('isDateTime', true);
  this.render(hbs`{{create-options-datetime options=options isDateTime=isDateTime}}`);

  assert.equal(
    this.$('.grouped-input input:not(.ws-inputreplace)').length,
    2,
    'there are two input fields before'
  );
  assert.ok(
    this.$('.delete').get().every((el) => {
      return el.disabled === false;
    }),
    'options are deleteable'
  );
  this.$('.grouped-input .form-group').eq(0).find('.delete').click();
  Ember.run(() => {
    assert.equal(
      this.$('.grouped-input .form-group input:not(.ws-inputreplace)').length,
      1,
      'one input field is removed after deletion'
    );
    assert.equal(
      this.$('.grouped-input .form-group input:not(.ws-inputreplace)').val(),
      '22:22',
      'correct input field is deleted'
    );
    assert.equal(
      this.get('options.length'),
      1,
      'is also delete from option'
    );
    assert.equal(
      this.get('options.firstObject.title'),
      moment('2015-01-01T22:22').toISOString(),
      'correct option is deleted'
    );
  });
});

test('adopt times of first day - simple', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: moment().hour(10).minute(0).toISOString() }),
    Ember.Object.create({ title: '2015-02-02' }),
    Ember.Object.create({ title: '2015-03-03' })
  ]);
  this.set('isDateTime', true);
  this.render(hbs`{{create-options-datetime options=options isDateTime=isDateTime}}`);
  Ember.run(() => {
    this.$('button.adopt-times-of-first-day').click();
  });
  assert.equal(
    this.$('.grouped-input:eq(0) input:not(.ws-inputreplace)').val(),
    '10:00',
    'time was not changed for first day'
  );
  assert.equal(
    this.$('.grouped-input:eq(1) input:not(.ws-inputreplace)').val(),
    '10:00',
    'time was adopted for second day'
  );
  assert.equal(
    this.$('.grouped-input:eq(1) input:not(.ws-inputreplace)').val(),
    '10:00',
    'time was adopted for third day'
  );
});

test('adopt times of first day - more times on first day than on others', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: moment().hour(10).minute(0).toISOString() }),
    Ember.Object.create({ title: moment().hour(22).minute(0).toISOString() }),
    Ember.Object.create({ title: '2015-02-02' }),
    Ember.Object.create({ title: '2015-03-03' })
  ]);
  this.set('isDateTime', true);
  this.render(hbs`{{create-options-datetime options=options isDateTime=isDateTime}}`);
  Ember.run(() => {
    this.$('button.adopt-times-of-first-day').click();
  });
  assert.deepEqual(
    this.$('.grouped-input:eq(0) input:not(.ws-inputreplace)').map((i, el) => $(el).val()).toArray(),
    ['10:00', '22:00'],
    'time was not changed for first day after additionally time was added to first day'
  );
  assert.deepEqual(
    this.$('.grouped-input:eq(1) input:not(.ws-inputreplace)').map((i, el) => $(el).val()).toArray(),
    ['10:00', '22:00'],
    'time was adopted for second day after additionally time was added to first day'
  );
  assert.deepEqual(
    this.$('.grouped-input:eq(2) input:not(.ws-inputreplace)').map((i, el) => $(el).val()).toArray(),
    ['10:00', '22:00'],
    'time was adopted for third day after additionally time was added to first day'
  );
});

test('adopt times of first day - excess times on other days got deleted', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: moment().hour(10).minute(0).toISOString() }),
    Ember.Object.create({ title: moment().add(1, 'day').hour(10).minute(0).toISOString() }),
    Ember.Object.create({ title: moment().add(1, 'day').hour(22).minute(0).toISOString() })
  ]);
  this.set('isDateTime', true);
  this.render(hbs`{{create-options-datetime options=options isDateTime=isDateTime}}`);
  Ember.run(() => {
    this.$('button.adopt-times-of-first-day').click();
  });
  assert.deepEqual(
    this.$('.grouped-input:eq(1) input:not(.ws-inputreplace)').map((i, el) => $(el).val()).toArray(),
    ['10:00'],
    'additional time on secondary day got deleted'
  );
});
