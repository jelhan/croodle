import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { DateTime } from 'luxon';

module('Unit | Component | create options', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
  });

  test('validation for make a poll', function(assert) {
    let component = this.owner.factoryFor('component:create-options').create();
    component.set('options', []);
    component.set('isFindADate', false);
    component.set('isMakeAPoll', true);

    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    let poll;
    run(() => {
      poll = this.store.createRecord('poll', {
        isFindADate: component.get('isFindADate'),
        isMakeAPoll: component.get('isMakeAPoll')
      });
    });

    assert.notOk(
      component.get('validations.isValid'),
      'invalid without any options'
    );
    run(() => {
      let option = this.store.createFragment('option', {
        title: 'first option'
      });
      poll.get('options').pushObject(option);
      component.get('options').pushObject(option);
    });
    assert.ok(
      component.get('validations.isValid'),
      'valid if there is atleast one valid option'
    );
    run(() => {
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
    run(() => {
      component.set('options.firstObject.title', '');
    });
    assert.notOk(
      component.get('validations.isValid'),
      'invalid if atleast one string is empty'
    );
  });

  test('validation for find a date without times', function(assert) {
    let component = this.owner.factoryFor('component:create-options').create();
    component.set('options', []);
    component.set('isFindADate', true);
    component.set('isMakeAPoll', false);

    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    let poll;
    run(() => {
      poll = this.store.createRecord('poll', {
        isFindADate: component.get('isFindADate'),
        isMakeAPoll: component.get('isMakeAPoll')
      });
    });

    assert.notOk(
      component.get('validations.isValid'),
      'invalid without any options'
    );
    run(() => {
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
    run(() => {
      let option = this.store.createFragment('option', {
        title: '2015-01-02'
      });
      poll.get('options').pushObject(option);
      component.get('options').pushObject(option);
    });
    assert.ok(
      component.get('validations.isValid'),
      'valid for two valid dates'
    );
    run(() => {
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
    run(() => {
      component.set('options.lastObject.title', '2015-01-03');
    });
    assert.ok(
      component.get('validations.isValid'),
      'valid again after title is a valid date again'
    );
    run(() => {
      component.set('options.firstObject.title', '2015-01-01');
      component.set('options.lastObject.title', '2015-01-01');
    });
    assert.ok(
      component.get('validations.isInvalid'),
      'invalid if dates are not unique'
    );
  });

  test('validation for find a date with times', function(assert) {
    let component = this.owner.factoryFor('component:create-options').create();
    component.set('options', []);
    component.set('isMakeAPoll', false);

    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    let poll;
    run(() => {
      poll = this.store.createRecord('poll', {
        isFindADate: component.get('isFindADate'),
        isMakeAPoll: component.get('isMakeAPoll')
      });
    });
    assert.notOk(
      component.get('validations.isValid'),
      'invalid without any options'
    );
    run(() => {
      let option = this.store.createFragment('option', {
        title: DateTime.local().plus({ days: 1 }).toISODate(),
      });
      poll.get('options').pushObject(option);
      component.get('options').pushObject(option);
    });
    assert.ok(
      component.get('validations.isValid'),
      'valid if there is atleast one valid date'
    );
  });
});
