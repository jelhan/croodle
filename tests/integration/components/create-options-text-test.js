import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('create-options-text', 'Integration | Component | create options text', {
  integration: true
});

test('it generates at least two input fields', function(assert) {
  this.set('options', []);
  this.render(hbs`{{create-options-text options=options}}`);

  assert.equal(this.$('input').length, 2);
});

test('generates input fields according options', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: 'foo' }),
    Ember.Object.create({ title: 'bar' }),
    Ember.Object.create({ title: 'baz' })
  ]);
  this.render(hbs`{{create-options-text options=options}}`);

  assert.equal(
    this.$('input').length,
    3,
    'correct amount of input fields'
  );
  assert.deepEqual(
    this.$('input').map(function() { return $(this).val(); }).get(),
    ['foo', 'bar', 'baz'],
    'input fields have correct values and order'
  );
});

test('observes changes to options', function(assert) {
  this.set('options', [
    Ember.Object.create({ title: 'foo' }),
    Ember.Object.create({ title: 'bar' })
  ]);
  this.render(hbs`{{create-options-text options=options}}`);

  assert.equal(
    this.$('input').length,
    2,
    'has correct amount of input fields before change'
  );

  Ember.run(() => {
    this.get('options').pushObject(
      Ember.Object.create({ title: 'baz' })
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
    Ember.Object.create({ title: 'foo' }),
    Ember.Object.create({ title: 'bar' })
  ]);
  this.render(hbs`{{create-options-text options=options}}`);

  this.$('input').eq(0).val('baz').trigger('change');
  assert.equal(
    this.get('options')[0].get('title'),
    'baz',
    'option was updated'
  );
});
