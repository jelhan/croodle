import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import jQuery from 'jquery';

moduleForComponent('create-options-text', 'Integration | Component | create options text', {
  integration: true,
  beforeEach() {
    this.inject.service('store');
  }
});

test('it generates at least two input fields', function(assert) {
  this.set('options', []);
  this.render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

  assert.equal(this.$('input').length, 2);
});

test('generates input fields according options', function(assert) {
  this.set('options', [
    EmberObject.create({ title: 'foo' }),
    EmberObject.create({ title: 'bar' }),
    EmberObject.create({ title: 'baz' })
  ]);
  this.render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

  assert.equal(
    this.$('input').length,
    3,
    'correct amount of input fields'
  );
  assert.deepEqual(
    this.$('input').map(function() {
      return jQuery(this).val();
    }).get(),
    ['foo', 'bar', 'baz'],
    'input fields have correct values and order'
  );
});

test('observes changes to options', function(assert) {
  this.set('options', [
    EmberObject.create({ title: 'foo' }),
    EmberObject.create({ title: 'bar' })
  ]);
  this.render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

  assert.equal(
    this.$('input').length,
    2,
    'has correct amount of input fields before change'
  );

  run(() => {
    this.get('options').pushObject(
      EmberObject.create({ title: 'baz' })
    );
  });

  assert.equal(
    this.$('input').length,
    3,
    'has correct amount of input fields after change'
  );
  assert.equal(
    this.$('input').eq(2).val(),
    'baz',
    'input field was added with correct value'
  );
});

test('changes to value updates option', function(assert) {
  this.set('options', [
    EmberObject.create({ title: 'foo' }),
    EmberObject.create({ title: 'bar' })
  ]);
  this.render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

  this.$('input').eq(0).val('baz').trigger('change');
  assert.equal(
    this.get('options')[0].get('title'),
    'baz',
    'option was updated'
  );
});

test('allows to add another option', function(assert) {
  // validation is based on validation of every option fragment
  // which validates according to poll model it belongs to
  // therefore each option needs to be pushed to poll model to have it as
  // it's owner
  let poll;
  run(() => {
    poll = this.store.createRecord('poll', {
      isFindADate: this.get('isFindADate'),
      isDateTime: this.get('isDateTime'),
      isMakeAPoll: this.get('isMakeAPoll'),
      options: [
        { title: 'foo' },
        { title: 'bar' }
      ]
    });
  });
  this.set('options', poll.get('options'));
  this.render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

  assert.equal(
    this.$('.form-group input').length,
    2,
    'there are two input fields before'
  );

  run(() => {
    this.$('.form-group .add').eq(0).click();
  });
  assert.equal(
    this.$('.form-group input').length,
    3,
    'another input field is added'
  );
  assert.deepEqual(
    this.$('input').map(function() {
      return jQuery(this).val();
    }).get(),
    ['foo', '', 'bar'],
    'it is added at correct position'
  );

  run(() => {
    this.$('.form-group input').eq(1).val('baz').trigger('change');
  });
  assert.equal(
    this.get('options').objectAt(1).get('title'),
    'baz',
    'options are observed for new input field'
  );
});

test('allows to delete an option', function(assert) {
  this.set('options', [
    EmberObject.create({ title: 'foo' }),
    EmberObject.create({ title: 'bar' }),
    EmberObject.create({ title: 'baz' })
  ]);
  this.render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

  assert.equal(
    this.$('.form-group input').length,
    3,
    'there are three input fields before'
  );
  assert.ok(
    this.$('.delete').get().every((el) => {
      return el.disabled === false;
    }),
    'options are deleteable'
  );
  this.$('.form-group .delete').eq(1).click();
  run(() => {
    assert.equal(
      this.$('.form-group input').length,
      2,
      'one input field is deleted'
    );
    assert.deepEqual(
      this.$('input').map(function() {
        return jQuery(this).val();
      }).get(),
      ['foo', 'baz'],
      'correct input field is deleted'
    );
    assert.deepEqual(
      this.get('options').map((option) => option.get('title')),
      ['foo', 'baz'],
      'option is updated'
    );
  });
});
