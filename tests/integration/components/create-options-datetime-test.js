import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | create options datetime', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.store = this.owner.lookup('service:store');
  });

  /*
   * watch out:
   * polyfill adds another input[type="text"] for every input[type="time"]
   * if browser doesn't support input[type="time"]
   * that ones could be identifed by class 'ws-inputreplace'
   */

  test('it generates input field for options iso 8601 date string (without time)', async function (assert) {
    this.set('dates', new Set(['2015-01-01']));
    this.set('times', new Map());
    await render(
      hbs`<CreateOptionsDatetime @dates={{this.dates}} @times={{this.times}} />`,
    );

    assert
      .dom('.days .form-group input')
      .exists({ count: 1 }, 'there is one input field');
    assert
      .dom('.days .form-group input')
      .hasNoValue('value is an empty string');
  });

  test('it generates input field for options iso 8601 datetime string (with time)', async function (assert) {
    this.set('dates', new Set(['2015-01-01']));
    this.set('times', new Map([['2015-01-01', new Set(['11:11'])]]));
    await render(
      hbs`<CreateOptionsDatetime @dates={{this.dates}} @times={{this.times}} />`,
    );

    assert
      .dom('.days .form-group input')
      .exists({ count: 1 }, 'there is one input field');
    assert
      .dom('.days .form-group input')
      .hasValue('11:11', 'it has time in option as value');
  });

  test('it hides repeated labels', async function (assert) {
    this.set('dates', new Set(['2015-01-01', '2015-02-02']));
    this.set('times', new Map([['2015-01-01', new Set(['11:11', '22:22'])]]));
    await render(
      hbs`<CreateOptionsDatetime @dates={{this.dates}} @times={{this.times}} />`,
    );

    assert
      .dom('.days label')
      .exists({ count: 3 }, 'every form-group has a label');
    assert
      .dom('.days label:not(.sr-only)')
      .exists(
        { count: 2 },
        'there are two not hidden labels for two different dates',
      );
    assert.notOk(
      findAll('.days .form-group')[0]
        .querySelector('label')
        .classList.contains('sr-only'),
      'the first label is shown',
    );
    assert.ok(
      findAll('.days .form-group')[1]
        .querySelector('label')
        .classList.contains('sr-only'),
      'the repeated label on second form-group is hidden by sr-only class',
    );
    assert.notOk(
      findAll('.days .form-group')[2]
        .querySelector('label')
        .classList.contains('sr-only'),
      'the new label on third form-group is shown',
    );
  });

  test('allows to add another option', async function (assert) {
    this.set('dates', new Set(['2015-01-01', '2015-02-02']));
    this.set('times', new Map());
    await render(
      hbs`<CreateOptionsDatetime @dates={{this.dates}} @times={{this.times}} />`,
    );

    assert
      .dom('.days .form-group input')
      .exists({ count: 2 }, 'there are two input fields before');

    await click(findAll('.days .form-group')[0].querySelector('.add'));
    assert
      .dom('.days .form-group input')
      .exists({ count: 3 }, 'another input field is added');
    assert.strictEqual(
      findAll('.days .form-group')[1].querySelector('label').textContent,
      findAll('.days .form-group')[0].querySelector('label').textContent,
      'new input has correct label',
    );
    assert.ok(
      findAll('.days .form-group')[1]
        .querySelector('label')
        .classList.contains('sr-only'),
      "label ofnew input is hidden cause it's repeated",
    );
  });

  test('allows to delete an option', async function (assert) {
    this.set('dates', new Set(['2015-01-01']));
    this.set('times', new Map([['2015-01-01', new Set(['11:11', '22:22'])]]));
    await render(
      hbs`<CreateOptionsDatetime @dates={{this.dates}} @times={{this.times}} />`,
    );

    assert
      .dom('.days input')
      .exists({ count: 2 }, 'there are two input fields before');
    assert.ok(
      findAll('.delete').every((el) => el.disabled === false),
      'options are deleteable',
    );

    await click(findAll('.days .form-group')[0].querySelector('.delete'));
    assert
      .dom('.days .form-group input')
      .exists({ count: 1 }, 'one input field is removed after deletion');
    assert
      .dom('.days .form-group input')
      .hasValue('22:22', 'correct input field is deleted');
  });
});
