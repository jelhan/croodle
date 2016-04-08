import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('create-options', 'Unit | Component | create options', {
  needs: [
    'model:option',
    'model:poll',
    'model:user',
    'validator:collection',
    'validator:iso8601',
    'validator:length',
    'validator:presence',
    'validator:valid-collection',
    'validator:messages'
  ],
  unit: true,
  beforeEach() {
    this.inject.service('store');
  }
});

test('validation for make a poll', function(assert) {
  let component = this.subject();
  component.set('options', []);
  component.set('isFindADate', false);
  component.set('isDateTime', false);
  component.set('isMakeAPoll', true);

  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      isFindADate: component.get('isFindADate'),
      isDateTime: component.get('isDateTime'),
      isMakeAPoll: component.get('isMakeAPoll')
    });
  });

  assert.notOk(
    component.get('validations.isValid'),
    'invalid without any options'
  );
  Ember.run(() => {
    let option = this.store.createFragment('option', {
      title: 'first option'
    });
    poll.get('options').pushObject(option);
    component.get('options').pushObject(option);
  });
  assert.notOk(
    component.get('validations.isValid'),
    'invalid for only one option'
  );
  Ember.run(() => {
    let option = this.store.createFragment('option', {
      title: 'second option'
    });
    poll.get('options').pushObject(option);
    component.get('options').pushObject(option);
  });
  assert.ok(
    component.get('validations.isValid'),
    'valid for two options which are not empty strings'
  );
  Ember.run(() => {
    component.set('options.firstObject.title', '');
  });
  assert.notOk(
    component.get('validations.isValid'),
    'invalid if atleast one string is empty'
  );
});

test('validation for find a date without times', function(assert) {
  let component = this.subject();
  component.set('options', []);
  component.set('isFindADate', true);
  component.set('isDateTime', false);
  component.set('isMakeAPoll', false);

  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      isFindADate: component.get('isFindADate'),
      isDateTime: component.get('isDateTime'),
      isMakeAPoll: component.get('isMakeAPoll')
    });
  });

  assert.notOk(
    component.get('validations.isValid'),
    'invalid without any options'
  );
  Ember.run(() => {
    let option = this.store.createFragment('option', {
      title: '2015-01-01'
    });
    poll.get('options').pushObject(option);
    component.get('options').pushObject(option);
  });
  assert.notOk(
    component.get('validations.isValid'),
    'invalid if there is only one valid date'
  );
  Ember.run(() => {
    let option = this.store.createFragment('option', {
      title: '2015-01-01'
    });
    poll.get('options').pushObject(option);
    component.get('options').pushObject(option);
  });
  assert.ok(
    component.get('validations.isValid'),
    'valid for two valid dates'
  );
  Ember.run(() => {
    let option = this.store.createFragment('option', {
      title: 'foo'
    });
    poll.get('options').pushObject(option);
    component.get('options').pushObject(option);
  });
  assert.notOk(
    component.get('validations.isValid'),
    'invalid if atleast one option is not a valid date'
  );
  Ember.run(() => {
    component.set('options.lastObject.title', '2015-01-01');
  });
  assert.ok(
    component.get('validations.isValid'),
    'valid again after title is a valid date again'
  );
  Ember.run(() => {
    component.set('options.firstObject.title', '2015-01-01');
    component.set('options.lastObject.title', '2015-01-01');
  });
  assert.ok(
    component.get('validations.isValid'),
    'invalid if dates are not unique'
  );
});

test('validation for find a date with times', function(assert) {
  let component = this.subject();
  component.set('options', []);
  component.set('isFindADate', true);
  component.set('isDateTime', true);
  component.set('isMakeAPoll', false);

  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      isFindADate: component.get('isFindADate'),
      isDateTime: component.get('isDateTime'),
      isMakeAPoll: component.get('isMakeAPoll')
    });
  });
  assert.notOk(
    component.get('validations.isValid'),
    'invalid without any options'
  );
  Ember.run(() => {
    let option = this.store.createFragment('option', {
      title: '2015-01-01'
    });
    poll.get('options').pushObject(option);
    component.get('options').pushObject(option);
  });
  assert.ok(
    component.get('validations.isValid'),
    'valid if there is atleast one valid date'
  );
});
