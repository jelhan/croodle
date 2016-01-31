import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';

moduleForModel('option', 'Unit | Model | option', {
  needs: [
    'validator:iso8601-date',
    'validator:iso8601-datetime',
    'validator:presence',
    'validator:messages',
    'model:poll',
    'model:user'
  ]
});

test('validation for MakeAPoll', function(assert) {
  Ember.run(() => {
    let store = this.store();
    let poll = store.createRecord('poll', {
      pollType: 'MakeAPoll'
    });
    let option = store.createFragment('option');
    poll.get('options').pushObject(option);
    option.validate();
    assert.notOk(
      option.get('validations.isValid'),
      'default value is not valid'
    );
    Ember.run(() => {
      option.set('title', 'Spasibo!');
    });
    assert.ok(
      option.get('validations.isValid'),
      'is valid for a non empty string'
    );
  });
});

test('validation for FindADate', function(assert) {
  Ember.run(() => {
    let store = this.store();
    let poll = store.createRecord('poll', {
      isDateTime: false,
      pollType: 'FindADate'
    });
    let option = store.createFragment('option');
    poll.get('options').pushObject(option);
    option.validate();
    assert.notOk(
      option.get('validations.isValid'),
      'default value is not valid'
    );
    Ember.run(() => {
      option.set('title', '1945-05-08');
    });
    assert.ok(
      option.get('validations.isValid'),
      'iso 8601 date string is valid'
    );
    Ember.run(() => {
      option.set('title', 'Spasibo!');
    });
    assert.notOk(
      option.get('validations.isValid'),
      'random string is not valid'
    );
  });
});

test('validation for FindADate and isDateTime', function(assert) {
  Ember.run(() => {
    let store = this.store();
    let poll = store.createRecord('poll', {
      isDateTime: true,
      pollType: 'FindADate'
    });
    let option = store.createFragment('option');
    poll.get('options').pushObject(option);
    option.validate();
    assert.notOk(
      option.get('validations.isValid'),
      'default value is not valid'
    );
    Ember.run(() => {
      option.set('title', '1945-05-08T00:00:00.000Z');
    });
    assert.ok(
      option.get('validations.isValid'),
      'iso 8601 datetime string is valid'
    );
    Ember.run(() => {
      option.set('title', 'Spasibo!');
    });
    assert.notOk(
      option.get('validations.isValid'),
      'random string is not valid'
    );
  });
});
