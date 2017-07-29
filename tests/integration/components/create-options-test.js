import { moduleForComponent, test } from 'ember-qunit';
import { blur, fillIn, findAll, focus } from 'ember-native-dom-helpers';
import hbs from 'htmlbars-inline-precompile';
import hasComponent from 'croodle/tests/helpers/201-created/raw/has-component';
import Ember from 'ember';

moduleForComponent('create-options', 'Integration | Component | create options', {
  integration: true,
  beforeEach() {
    this.inject.service('store');
  }
});

test('renders component', function(assert) {
  this.set('options', []);
  this.set('isDateTime', false);
  this.set('isFindADate', true);
  this.set('isMakeAPoll', false);
  this.render(hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`);

  assert.ok(
    hasComponent(this.container, assert, 'create-options-dates').ok
  );
  assert.notOk(
    hasComponent(this.container, assert, 'create-options-text').ok
  );

  this.set('isDateTime', false);
  this.set('isFindADate', false);
  this.set('isMakeAPoll', true);

  assert.notOk(
    hasComponent(this.container, assert, 'create-options-dates').ok
  );
  assert.ok(
    hasComponent(this.container, assert, 'create-options-text').ok
  );
});

test('shows validation errors if options are not unique (makeAPoll)', async function(assert) {
  assert.expect(5);

  this.set('isDateTime', false);
  this.set('isFindADate', false);
  this.set('isMakeAPoll', true);

  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      isFindADate: this.get('isFindADate'),
      isDateTime: this.get('isDateTime'),
      isMakeAPoll: this.get('isMakeAPoll')
    });
  });
  this.set('options', poll.get('options'));

  this.render(hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`);

  assert.ok(
    this.$('input').length === 2,
    'assumptions are correct'
  );

  await fillIn(findAll('input')[0], 'foo');
  await blur(findAll('input')[0]);
  await fillIn(findAll('input')[1], 'foo');
  await blur(findAll('input')[1]);
  assert.ok(
    this.$('.form-group').eq(1).hasClass('has-error'),
    'second input field has validation error'
  );

  assert.ok(
    this.$('.form-group').eq(1).find('.help-block').length === 1,
    'validation error is shown'
  );

  await fillIn(findAll('input')[0], 'bar');
  await blur(findAll('input')[0]);
  assert.ok(
    this.$('.form-group .help-block').length === 0,
    'there is no validation error anymore after a unique value is entered'
  );

  assert.ok(
    this.$('.form-group.has-error').length === 0,
    'has-error classes are removed'
  );
});

test('shows validation errors if option is empty (makeAPoll)', async function(assert) {
  this.set('isDateTime', false);
  this.set('isFindADate', false);
  this.set('isMakeAPoll', true);

  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      isFindADate: this.get('isFindADate'),
      isDateTime: this.get('isDateTime'),
      isMakeAPoll: this.get('isMakeAPoll')
    });
  });
  this.set('options', poll.get('options'));

  this.render(hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`);

  assert.equal(
    this.$('.form-group.has-error').length, 0
  );

  await focus(findAll('input')[0]);
  await blur(findAll('input')[0]);
  await focus(findAll('input')[1]);
  await blur(findAll('input')[1]);
  assert.equal(
    this.$('.form-group.has-error').length, 2
  );

  await fillIn(findAll('input')[0], 'foo');
  await blur(findAll('input')[0]);
  assert.equal(
    this.$('.form-group.has-error').length, 1
  );

  await fillIn(findAll('input')[1], 'bar');
  await blur(findAll('input')[1]);
  assert.equal(
    this.$('.form-group.has-error').length, 0
  );
});

test('label reflects validation state of all inputs (makeAPoll)', async function(assert) {
  this.set('isDateTime', false);
  this.set('isFindADate', false);
  this.set('isMakeAPoll', true);

  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  Ember.run(() => {
    poll = this.store.createRecord('poll', {
      isFindADate: this.get('isFindADate'),
      isDateTime: this.get('isDateTime'),
      isMakeAPoll: this.get('isMakeAPoll')
    });
  });
  this.set('options', poll.get('options'));

  this.render(hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`);

  assert.ok(
    this.$('form').children().hasClass('label-has-no-validation'),
    'does not show validation state if there wasn\'t any user interaction yet'
  );

  await focus(findAll('input')[0]);
  await blur(findAll('input')[0]);
  assert.ok(
    this.$('form').children().hasClass('label-has-error'),
    'shows as having error if atleast on field has an error'
  );

  await fillIn(findAll('input')[0], 'foo');
  await blur(findAll('input')[0]);
  assert.ok(
    this.$('form').children().hasClass('label-has-no-validation'),
    'does not show validation state if no field has error but not all fields are showing error yet'
  );

  await fillIn(findAll('input')[1], 'bar');
  await blur(findAll('input')[1]);
  assert.ok(
    this.$('form').children().hasClass('label-has-success'),
    'shows as having success if all fields are showing success'
  );
});
