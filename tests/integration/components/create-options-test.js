import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, blur, fillIn, focus } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { TrackedSet } from 'tracked-built-ins';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | create options', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.store = this.owner.lookup('service:store');
  });

  test('shows validation errors if options are not unique (makeAPoll)', async function (assert) {
    this.set('options', new TrackedSet());

    await render(hbs`
      <CreateOptions
        @options={{this.options}}
        @isDateTime={{false}}
        @isFindADate={{false}}
        @isMakeAPoll={{true}}
      />
    `);

    assert
      .dom('.form-group')
      .exists({ count: 2 }, 'assumption: renders two form groups');

    await fillIn('.form-group:nth-child(1) input', 'foo');
    await blur('.form-group:nth-child(1) input');
    await fillIn('.form-group:nth-child(2) input', 'foo');
    await blur('.form-group:nth-child(2) input');
    assert
      .dom('.form-group:nth-child(2) input')
      .hasClass('is-invalid', 'second input field has validation error');
    assert
      .dom('.form-group:nth-child(2) .invalid-feedback')
      .exists('validation error is shown');

    await fillIn(findAll('input')[0], 'bar');
    await blur(findAll('input')[0]);
    assert
      .dom('.form-group .invalid-feedback')
      .doesNotExist(
        'there is no validation error anymore after a unique value is entered',
      );
    assert
      .dom('.form-group .is-invalid')
      .doesNotExist('.is-invalid classes are removed');
  });

  test('shows validation errors if option is empty (makeAPoll)', async function (assert) {
    this.set('options', new TrackedSet());

    await render(hbs`
      <CreateOptions
        @options={{this.options}}
        @isDateTime={{false}}
        @isFindADate={{false}}
        @isMakeAPoll={{true}}
      />
    `);

    assert.dom('.form-group.has-error').doesNotExist();

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
