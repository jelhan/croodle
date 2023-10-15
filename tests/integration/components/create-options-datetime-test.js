import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find, findAll } from "@ember/test-helpers";
import hbs from 'htmlbars-inline-precompile';
import { DateTime } from 'luxon';

module('Integration | Component | create options datetime', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
  });

  /*
   * watch out:
   * polyfill adds another input[type="text"] for every input[type="time"]
   * if browser doesn't support input[type="time"]
   * that ones could be identifed by class 'ws-inputreplace'
   */

  test('it generates input field for options iso 8601 date string (without time)', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        pollType: 'FindADate',
        options: [
          { title: '2015-01-01' }
        ]
      }));
    });
    await render(hbs`{{create-options-datetime dates=poll.options}}`);

    assert.equal(
      findAll('.days .form-group input').length,
      1,
      'there is one input field'
    );
    assert.equal(
      find('.days .form-group input').value,
      '',
      'value is an empty string'
    );
  });

  test('it generates input field for options iso 8601 datetime string (with time)', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        pollType: 'FindADate',
        options: [
          { title: '2015-01-01T11:11:00.000Z' }
        ]
      }));
    });
    await render(hbs`{{create-options-datetime dates=poll.options}}`);

    assert.equal(
      findAll('.days .form-group input').length,
      1,
      'there is one input field'
    );
    assert.equal(
      find('.days .form-group input').value,
      DateTime.fromISO('2015-01-01T11:11:00.000Z').toFormat('HH:mm'),
      'it has time in option as value'
    );
  });

  test('it hides repeated labels', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        pollType: 'FindADate',
        options: [
          { title: DateTime.fromISO('2015-01-01T10:11').toISO() },
          { title: DateTime.fromISO('2015-01-01T22:22').toISO() },
          { title: '2015-02-02' }
        ]
      }));
    });
    await render(hbs`{{create-options-datetime dates=poll.options}}`);

    assert.equal(
      findAll('.days label').length,
      3,
      'every form-group has a label'
    );
    assert.equal(
      findAll('.days label:not(.sr-only)').length,
      2,
      'there are two not hidden labels for two different dates'
    );
    assert.notOk(
      findAll('.days .form-group')[0].querySelector('label').classList.contains('sr-only'),
      'the first label is shown'
    );
    assert.ok(
      findAll('.days .form-group')[1].querySelector('label').classList.contains('sr-only'),
      'the repeated label on second form-group is hidden by sr-only class'
    );
    assert.notOk(
      findAll('.days .form-group')[2].querySelector('label').classList.contains('sr-only'),
      'the new label on third form-group is shown'
    );
  });

  test('allows to add another option', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        options: [
          { title: '2015-01-01' },
          { title: '2015-02-02' }
        ]
      }));
    });
    await render(hbs`{{create-options-datetime dates=poll.options}}`);

    assert.equal(
      findAll('.days .form-group input').length,
      2,
      'there are two input fields before'
    );

    await click(findAll('.days .form-group')[0].querySelector('.add'));
    assert.equal(
      findAll('.days .form-group input').length,
      3,
      'another input field is added'
    );
    assert.equal(
      findAll('.days .form-group')[1].querySelector('label').textContent,
      findAll('.days .form-group')[0].querySelector('label').textContent,
      'new input has correct label'
    );
    assert.ok(
      findAll('.days .form-group')[1].querySelector('label').classList.contains('sr-only'),
      'label ofnew input is hidden cause it\'s repeated'
    );
  });

  test('allows to delete an option', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        pollType: 'FindADate',
        options: [
          { title: DateTime.fromISO('2015-01-01T11:11').toISO() },
          { title: DateTime.fromISO('2015-01-01T22:22').toISO() }
        ]
      }));
    });
    await render(hbs`<CreateOptionsDatetime @dates={{this.poll.options}} />`);

    assert.equal(
      findAll('.days input').length,
      2,
      'there are two input fields before'
    );
    assert.ok(
      findAll('.delete').every((el) => el.disabled === false),
      'options are deleteable'
    );

    await click(findAll('.days .form-group')[0].querySelector('.delete'));
    assert.equal(
      findAll('.days .form-group input').length,
      1,
      'one input field is removed after deletion'
    );
    assert.equal(
      find('.days .form-group input').value,
      '22:22',
      'correct input field is deleted'
    );
  });
});
