import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, click, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | create options text', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
  });

  test('it generates at least two input fields', async function(assert) {
    this.set('options', []);
    await render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

    assert.equal(findAll('input').length, 2);
  });

  test('generates input fields according options', async function(assert) {
    this.set('options', [
      EmberObject.create({ title: 'foo' }),
      EmberObject.create({ title: 'bar' }),
      EmberObject.create({ title: 'baz' })
    ]);
    await render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

    assert.equal(
      findAll('input').length,
      3,
      'correct amount of input fields'
    );
    assert.deepEqual(
      findAll('input').map((el) => el.value),
      ['foo', 'bar', 'baz'],
      'input fields have correct values and order'
    );
  });

  test('observes changes to options', async function(assert) {
    this.set('options', [
      EmberObject.create({ title: 'foo' }),
      EmberObject.create({ title: 'bar' })
    ]);
    await render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

    assert.equal(
      findAll('input').length,
      2,
      'has correct amount of input fields before change'
    );

    run(() => {
      this.options.pushObject(
        EmberObject.create({ title: 'baz' })
      );
    });

    assert.equal(
      findAll('input').length,
      3,
      'has correct amount of input fields after change'
    );
    assert.equal(
      findAll('input')[2].value,
      'baz',
      'input field was added with correct value'
    );
  });

  test('changes to value updates option', async function(assert) {
    this.set('options', [
      EmberObject.create({ title: 'foo' }),
      EmberObject.create({ title: 'bar' })
    ]);
    await render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

    await fillIn(findAll('input')[0], 'baz');
    assert.equal(
      this.options[0].get('title'),
      'baz',
      'option was updated'
    );
  });

  test('allows to add another option', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    let poll;
    run(() => {
      poll = this.store.createRecord('poll', {
        pollType: 'MakeAPoll',
        options: [
          { title: 'foo' },
          { title: 'bar' }
        ]
      });
    });
    this.set('options', poll.get('options'));
    await render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

    assert.equal(
      findAll('.form-group input').length,
      2,
      'there are two input fields before'
    );

    await click(findAll('.form-group .add')[0]);
    assert.equal(
      findAll('.form-group input').length,
      3,
      'another input field is added'
    );
    assert.deepEqual(
      findAll('input').map((el) => el.value),
      ['foo', '', 'bar'],
      'it is added at correct position'
    );

    await fillIn(findAll('.form-group input')[1], 'baz')
    assert.equal(
      this.options.objectAt(1).get('title'),
      'baz',
      'options are observed for new input field'
    );
  });

  test('allows to delete an option', async function(assert) {
    this.set('options', [
      EmberObject.create({ title: 'foo' }),
      EmberObject.create({ title: 'bar' }),
      EmberObject.create({ title: 'baz' })
    ]);
    await render(hbs`{{#bs-form as |form|}}{{create-options-text options=options form=form}}{{/bs-form}}`);

    assert.equal(
      findAll('.form-group input').length,
      3,
      'there are three input fields before'
    );
    assert.ok(
      findAll('.delete').every((el) => el.disabled === false),
      'options are deleteable'
    );

    await click(findAll('.form-group .delete')[1]);
    assert.equal(
      findAll('.form-group input').length,
      2,
      'one input field is deleted'
    );
    assert.deepEqual(
      findAll('input').toArray().map((el) => el.value),
      ['foo', 'baz'],
      'correct input field is deleted'
    );
    assert.deepEqual(
      this.options.map((option) => option.get('title')),
      ['foo', 'baz'],
      'option is updated'
    );
  });
});
