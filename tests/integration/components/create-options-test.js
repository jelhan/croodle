import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import expectComponent from 'croodle/tests/helpers/201-created/raw/expect-component';
import Ember from 'ember';

moduleForComponent('create-options', 'Integration | Component | create options', {
  integration: true
});

test('renders component', function(assert) {
  this.set('options', []);
  this.set('isDateTime', false);
  this.set('isFindADate', true);
  this.set('isMakeAPoll', false);
  this.render(hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`);

  assert.ok(
    expectComponent(this.container, 'create-options-dates', 1).ok
  );
  assert.notOk(
    expectComponent(this.container, 'create-options-text', 0).ok
  );

  this.set('isDateTime', false);
  this.set('isFindADate', false);
  this.set('isMakeAPoll', true);

  assert.notOk(
    expectComponent(this.container, 'create-options-dates', 1).ok
  );
  assert.ok(
    expectComponent(this.container, 'create-options-text', 0).ok
  );
});

test('shows validation errors', function(assert) {
  this.set('options', []);
  this.set('isDateTime', false);
  this.set('isFindADate', false);
  this.set('isMakeAPoll', true);
  this.render(hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`);

  Ember.run(() => {
    this.$('input').val('foo').trigger('change');
  });

  Ember.run(() => {
    this.$('button[type="submit"]').click();
  });

  assert.equal(
    this.$('div.alert').length, 1
  );
});
