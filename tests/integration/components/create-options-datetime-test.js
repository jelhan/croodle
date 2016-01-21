import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import moment from 'moment';

moduleForComponent('create-options-datetime', 'Integration | Component | create options datetime', {
  integration: true
});

test('it generates inpute field for options iso 8601 date string (without time)', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: '2015-01-01' })
  ]);
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('.form-group input').length,
    1,
    'there is one input field'
  );
  assert.equal(
    this.$('.form-group input').val(),
    '',
    'value is an empty string'
  );
});

test('it generates inpute field for options iso 8601 date string (without time)', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: '2015-01-01T11:11:00.000Z' })
  ]);
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('.form-group input').length,
    1,
    'there is one input field'
  );
  assert.equal(
    this.$('.form-group input').val(),
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
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('.grouped-input').length,
    2,
    'there are two form groups for the two different dates'
  );
  assert.equal(
    this.$('.grouped-input').eq(0).find('input').length,
    2,
    'the first form group has two input fields for two different times'
  );
  assert.equal(
    this.$('.grouped-input').eq(0).find('input').length,
    2,
    'the first form group with two differnt times for one day has two input fields'
  );
  assert.equal(
    this.$('.grouped-input').eq(1).find('input').length,
    1,
    'the second form group without time has only one input field'
  );
});

test('allows to add another option', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: '2015-01-01' }),
    Ember.Object.create({ title: '2015-02-02' })
  ]);
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('input').length,
    2,
    'there are two input fields before'
  );
  this.$('.grouped-input').eq(0).find('.add').click();
  assert.equal(
    this.$('input').length,
    3,
    'another input field is added'
  );
  assert.equal(
    this.$('.grouped-input').eq(0).find('input').length,
    2,
    'it is added in correct date input'
  );
});

test('allows to delete an option', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: moment('2015-01-01T11:11').toISOString() }),
    Ember.Object.create({ title: moment('2015-01-01T22:22').toISOString() })
  ]);
  this.render(hbs`{{create-options-datetime options=options}}`);

  assert.equal(
    this.$('.grouped-input input').length,
    2,
    'there are two input fields before'
  );
  assert.ok(
    this.$('.delete').get().every((el) => {
      return el.disabled === false;
    }),
    'options are deleteable'
  );
  this.$('.form-group').eq(0).find('.delete').click();
  Ember.run(() => {
    assert.equal(
      this.$('input').length,
      1,
      'one input field is removed after deletion'
    );
    assert.equal(
      this.$('.grouped-input input').val(),
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
