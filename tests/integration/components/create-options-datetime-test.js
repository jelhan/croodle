import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import {
  render,
  click,
  fillIn,
  find,
  findAll,
  triggerEvent
} from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

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

  test('it generates inpute field for options iso 8601 date string (without time)', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        isFindADate: true,
        isMakeAPoll: false,
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

  test('it generates inpute field for options iso 8601 datetime string (with time)', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        isFindADate: true,
        isMakeAPoll: false,
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
      moment('2015-01-01T11:11:00.000Z').format('HH:mm'),
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
        isFindADate: true,
        isMakeAPoll: false,
        options: [
          { title: moment('2015-01-01T10:11').toISOString() },
          { title: moment('2015-01-01T22:22').toISOString() },
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
        isFindADate: true,
        isMakeAPoll: false,
        options: [
          { title: moment('2015-01-01T11:11').toISOString() },
          { title: moment('2015-01-01T22:22').toISOString() }
        ]
      }));
    });
    await render(hbs`{{create-options-datetime dates=poll.options}}`);

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

  test('adopt times of first day - simple', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        options: [
          { title: moment().hour(10).minute(0).toISOString() },
          { title: '2015-02-02' },
          { title: '2015-03-03' }
        ]
      }));
    });
    await render(hbs`{{create-options-datetime dates=poll.options}}`);
    await click('button.adopt-times-of-first-day');
    assert.equal(
      findAll('.days .form-group')[0].querySelector('input').value,
      '10:00',
      'time was not changed for first day'
    );
    assert.equal(
      findAll('.days .form-group')[1].querySelector('input').value,
      '10:00',
      'time was adopted for second day'
    );
    assert.equal(
      findAll('.days .form-group')[2].querySelector('input').value,
      '10:00',
      'time was adopted for third day'
    );
  });

  test('adopt times of first day - more times on first day than on others', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        options: [
          { title: moment().hour(10).minute(0).toISOString() },
          { title: moment().hour(22).minute(0).toISOString() },
          { title: '2015-02-02' },
          { title: '2015-03-03' }
        ]
      }));
    });
    await render(hbs`{{create-options-datetime dates=poll.options}}`);
    await click('button.adopt-times-of-first-day');
    assert.deepEqual(
      findAll('.days .form-group input').map((el) => el.value),
      ['10:00', '22:00', '10:00', '22:00', '10:00', '22:00'],
      'times were adopted correctly'
    );
  });

  test('adopt times of first day - excess times on other days got deleted', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
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
    await render(hbs`{{create-options-datetime dates=poll.options}}`);
    await click('button.adopt-times-of-first-day');
    assert.equal(
      findAll('.days .form-group').length,
      2,
      'one excess time input got deleted'
    );
    assert.deepEqual(
      findAll('.days .form-group input').map((el) => el.value),
      ['10:00', '10:00'],
      'additional time on secondary day got deleted'
    );
  });

  test('validation', async function(assert) {
    // validation is based on validation of every option fragment
    // which validates according to poll model it belongs to
    // therefore each option needs to be pushed to poll model to have it as
    // it's owner
    run(() => {
      this.set('poll', this.store.createRecord('poll', {
        isFindADate: true,
        isMakeAPoll: false
      }));
      this.set('options', alias('poll.options'));
      this.get('options').pushObjects([
        { title: '2015-01-01' },
        { title: '2015-02-02' }
      ]);
    });
    await render(hbs`{{create-options-datetime dates=options}}`);
    assert.ok(
      findAll('.has-error').length === 0 && findAll('.has-success').length === 0,
      'does not show a validation error before user interaction'
    );

    await fillIn('[data-test-day="2015-01-01"] .form-group input', '10:');
    assert.ok(
      find('[data-test-day="2015-01-01"] .form-group').classList.contains('has-error') ||
      // browsers with input type time support prevent non time input
      find('[data-test-day="2015-01-01"] .form-group input').value === '',
      'shows error after invalid input or prevents invalid input'
    );

    // simulate unique violation
    await click('[data-test-day="2015-01-01"] .add');
    await fillIn(findAll('[data-test-day="2015-01-01"]')[0].querySelector('input'), '10:00');
    await fillIn(findAll('[data-test-day="2015-01-01"]')[1].querySelector('input'), '10:00');
    await fillIn('[data-test-day="2015-02-02"] .form-group input', '10:00');
    await triggerEvent('form', 'submit');
    assert.dom(findAll('[data-test-day="2015-01-01"]')[0].querySelector('.form-group')).hasClass('has-success',
      'first time shows validation success'
    );
    assert.dom(findAll('[data-test-day="2015-01-01"]')[1].querySelector('.form-group')).hasClass('has-error',
      'same time for same day shows validation error'
    );
    assert.dom('[data-test-day="2015-02-02"] .form-group').hasClass('has-success',
      'same time for different day shows validation success'
    );

    // label reflects validation state for all times of this day
    assert.dom(find('[data-test-day="2015-01-01"]')).hasClass('label-has-error',
      'label reflects validation state for all times (error)'
    );
    assert.dom('[data-test-day="2015-02-02"]').hasClass('label-has-success',
      'label reflects validation state for all times (success)'
    );
  });
});
