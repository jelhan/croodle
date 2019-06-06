import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, blur, fillIn, focus } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import hasComponent from 'croodle/tests/helpers/201-created/raw/has-component';

module('Integration | Component | create options', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.store = this.owner.lookup('service:store');
  });

  test('renders component', async function(assert) {
    this.set('options', []);
    this.set('isDateTime', false);
    this.set('isFindADate', true);
    this.set('isMakeAPoll', false);
    await render(
      hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`
    );

    assert.ok(
      hasComponent(this.owner, assert, 'create-options-dates').ok
    );
    assert.notOk(
      hasComponent(this.owner, assert, 'create-options-text').ok
    );

    this.set('isDateTime', false);
    this.set('isFindADate', false);
    this.set('isMakeAPoll', true);

    assert.notOk(
      hasComponent(this.owner, assert, 'create-options-dates').ok
    );
    assert.ok(
      hasComponent(this.owner, assert, 'create-options-text').ok
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
    run(() => {
      poll = this.store.createRecord('poll', {
        isFindADate: this.get('isFindADate'),
        isDateTime: this.get('isDateTime'),
        isMakeAPoll: this.get('isMakeAPoll')
      });
    });
    this.set('options', poll.get('options'));

    await render(
      hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`
    );

    assert.dom('.form-group').exists({ count: 2 }, 'assumption: renders two form groups');

    await fillIn('.form-group:nth-child(1) input', 'foo');
    await blur('.form-group:nth-child(1) input');
    await fillIn('.form-group:nth-child(2) input', 'foo');
    await blur('.form-group:nth-child(2) input');
    assert.dom('.form-group:nth-child(2) input')
      .hasClass('is-invalid', 'second input field has validation error');
    assert.dom('.form-group:nth-child(2) .invalid-feedback')
      .exists('validation error is shown');

    await fillIn(findAll('input')[0], 'bar');
    await blur(findAll('input')[0]);
    assert.dom('.form-group .invalid-feedback')
      .doesNotExist('there is no validation error anymore after a unique value is entered');
    assert.dom('.form-group .is-invalid')
      .doesNotExist('.is-invalid classes are removed');
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
    run(() => {
      poll = this.store.createRecord('poll', {
        isFindADate: this.get('isFindADate'),
        isDateTime: this.get('isDateTime'),
        isMakeAPoll: this.get('isMakeAPoll')
      });
    });
    this.set('options', poll.get('options'));

    await render(
      hbs`{{create-options options=options isDateTime=isDateTime isFindADate=isFindADate isMakeAPoll=isMakeAPoll}}`
    );

    assert.equal(
      findAll('.form-group.has-error').length, 0
    );

    await focus(findAll('input')[0]);
    await blur(findAll('input')[0]);
    await focus(findAll('input')[1]);
    await blur(findAll('input')[1]);
    assert.dom('.form-group .invalid-feedback').exists({ count: 2 });

    await fillIn(findAll('input')[0], 'foo');
    await blur(findAll('input')[0]);
    assert.dom('.form-group .invalid-feedback').exists({ count: 1 });

    await fillIn(findAll('input')[1], 'bar');
    await blur(findAll('input')[1]);
    assert.dom('.form-group .invalid-feedback').doesNotExist();
  });
});
