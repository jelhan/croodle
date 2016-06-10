import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import moment from 'moment';

moduleForComponent('create-options-datetime', 'Integration | Component | create options datetime', {
  integration: true,
  beforeEach() {
    this.inject.service('store');
  }
});

/*
 * watch out:
 * polyfill adds another input[type="text"] for every input[type="time"]
 * if browser doesn't support input[type="time"]
 * that ones could be identifed by class 'ws-inputreplace'
 */

test('it generates inpute field for options iso 8601 date string (without time)', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false,
      options: [
        { title: '2015-01-01' }
      ]
    }));
  });
  this.render(hbs`{{create-options-datetime dates=poll.options}}`);

  assert.equal(
    this.$('.days .form-group input').length,
    1,
    'there is one input field'
  );
  assert.equal(
    this.$('.days .form-group input').val(),
    '',
    'value is an empty string'
  );
});

test('it generates inpute field for options iso 8601 datetime string (with time)', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false,
      options: [
        { title: '2015-01-01T11:11:00.000Z' }
      ]
    }));
  });
  this.render(hbs`{{create-options-datetime dates=poll.options}}`);

  assert.equal(
    this.$('.days .form-group input').length,
    1,
    'there is one input field'
  );
  assert.equal(
    this.$('.days .form-group input').val(),
    moment('2015-01-01T11:11:00.000Z').format('HH:mm'),
    'it has time in option as value'
  );
});

test('it hides repeated labels', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false,
      options: [
        { title: moment('2015-01-01T10:11').toISOString() },
        { title: moment('2015-01-01T22:22').toISOString() },
        { title: '2015-02-02' }
      ]
    }));
  });
  this.render(hbs`{{create-options-datetime dates=poll.options}}`);

  assert.equal(
    this.$('.days label').length,
    3,
    'every form-group has a label'
  );
  assert.equal(
    this.$('.days label:not(.sr-only)').length,
    2,
    'there are two not hidden labels for two different dates'
  );
  assert.notOk(
    this.$('.days .form-group').eq(0).find('label').hasClass('sr-only'),
    'the first label is shown'
  );
  assert.ok(
    this.$('.days .form-group').eq(1).find('label').hasClass('sr-only'),
    'the repeated label on second form-group is hidden by sr-only class'
  );
  assert.notOk(
    this.$('.days .form-group').eq(2).find('label').hasClass('sr-only'),
    'the new label on third form-group is shown'
  );
});

test('allows to add another option', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      options: [
        { title: '2015-01-01' },
        { title: '2015-02-02' }
      ]
    }));
  });
  this.render(hbs`{{create-options-datetime dates=poll.options}}`);

  assert.equal(
    this.$('.days .form-group input').length,
    2,
    'there are two input fields before'
  );
  this.$('.days .form-group').eq(0).find('.add').click();
  assert.equal(
    this.$('.days .form-group input').length,
    3,
    'another input field is added'
  );
  assert.equal(
    this.$('.days .form-group').eq(1).find('label').text(),
    this.$('.days .form-group').eq(0).find('label').text(),
    'new input has correct label'
  );
  assert.ok(
    this.$('.days .form-group').eq(1).find('label').hasClass('sr-only'),
    'label ofnew input is hidden cause it\'s repeated'
  );
});

test('allows to delete an option', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false,
      options: [
        { title: moment('2015-01-01T11:11').toISOString() },
        { title: moment('2015-01-01T22:22').toISOString() }
      ]
    }));
  });
  this.render(hbs`{{create-options-datetime dates=poll.options}}`);

  assert.equal(
    this.$('.days input').length,
    2,
    'there are two input fields before'
  );
  assert.ok(
    this.$('.delete').get().every((el) => {
      return el.disabled === false;
    }),
    'options are deleteable'
  );
  this.$('.days .form-group').eq(0).find('.delete').click();
  Ember.run(() => {
    assert.equal(
      this.$('.days .form-group input').length,
      1,
      'one input field is removed after deletion'
    );
    assert.equal(
      this.$('.days .form-group input').val(),
      '22:22',
      'correct input field is deleted'
    );
    assert.equal(
      this.get('poll.options.length'),
      1,
      'is also delete from option'
    );
    assert.equal(
      this.get('poll.options.firstObject.title'),
      moment('2015-01-01T22:22').toISOString(),
      'correct option is deleted'
    );
  });
});

test('adopt times of first day - simple', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      options: [
        { title: moment().hour(10).minute(0).toISOString() },
        { title: '2015-02-02' },
        { title: '2015-03-03' }
      ]
    }));
  });
  this.render(hbs`{{create-options-datetime dates=poll.options}}`);
  Ember.run(() => {
    this.$('button.adopt-times-of-first-day').click();
  });
  assert.equal(
    this.$('.days .form-group').eq(0).find('input').val(),
    '10:00',
    'time was not changed for first day'
  );
  assert.equal(
    this.$('.days .form-group').eq(1).find('input').val(),
    '10:00',
    'time was adopted for second day'
  );
  assert.equal(
    this.$('.days .form-group').eq(2).find('input').val(),
    '10:00',
    'time was adopted for third day'
  );
});

test('adopt times of first day - more times on first day than on others', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      options: [
        { title: moment().hour(10).minute(0).toISOString() },
        { title: moment().hour(22).minute(0).toISOString() },
        { title: '2015-02-02' },
        { title: '2015-03-03' }
      ]
    }));
  });
  this.render(hbs`{{create-options-datetime dates=poll.options}}`);
  Ember.run(() => {
    this.$('button.adopt-times-of-first-day').click();
  });
  assert.deepEqual(
    this.$('.days .form-group input').map((i, el) => $(el).val()).toArray(),
    ['10:00', '22:00', '10:00', '22:00', '10:00', '22:00'],
    'times were adopted correctly'
  );
});

test('adopt times of first day - excess times on other days got deleted', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false,
      options: [
        { title: moment().hour(10).minute(0).toISOString() },
        { title: moment().add(1, 'day').hour(10).minute(0).toISOString() },
        { title: moment().add(1, 'day').hour(22).minute(0).toISOString() }
      ]
    }));
  });
  this.render(hbs`{{create-options-datetime dates=poll.options}}`);
  Ember.run(() => {
    this.$('button.adopt-times-of-first-day').click();
  });
  assert.equal(
    this.$('.days .form-group').length,
    2,
    'one excess time input got deleted'
  );
  assert.deepEqual(
    this.$('.days .form-group input').map((i, el) => $(el).val()).toArray(),
    ['10:00', '10:00'],
    'additional time on secondary day got deleted'
  );
});

test('validation', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  Ember.run(() => {
    this.set('poll', this.store.createRecord('poll', {
      isFindADate: true,
      isMakeAPoll: false
    }));
    this.set('options', Ember.computed.alias('poll.options'));
    this.get('options').pushObjects([
      { title: '2015-01-01' },
      { title: '2015-02-02' }
    ]);
  });
  this.render(hbs`{{create-options-datetime dates=options}}`);
  assert.ok(
    this.$('.has-error').length === 0,
    'does not show a validation error before user interaction'
  );
  this.$('.form-group').eq(1).find('input').trigger('focusout');
  assert.ok(
    this.$('.form-group').eq(1).hasClass('has-success'),
    'does show validation errors after user interaction'
  );
  this.$('.form-group').eq(1).find('input').val('10:').trigger('change');
  assert.ok(
    this.$('.form-group').eq(1).hasClass('has-error') ||
    // browsers with input type time support prevent non time input
    this.$('.form-group').eq(1).find('input').val() === '',
    'shows error after invalid input or prevents invalid input'
  );
  // simulate unique violation
  this.$('.form-group').eq(0).find('.add').click();
  this.$('.form-group input').eq(0).val('10:00').trigger('change');
  this.$('.form-group input').eq(1).val('10:00').trigger('change');
  this.$('.form-group input').eq(2).val('10:00').trigger('change');
  this.$('form').submit();
  assert.ok(
    this.$('.form-group').eq(0).hasClass('has-success'),
    'first time shows validation success'
  );
  assert.ok(
    this.$('.form-group').eq(1).hasClass('has-error'),
    'same time for same day shows validation error'
  );
  assert.ok(
    this.$('.form-group').eq(2).hasClass('has-success'),
    'same time for different day shows validation success'
  );
});
