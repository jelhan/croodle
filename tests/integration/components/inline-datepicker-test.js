import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | inline-datepicker', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test('it renders an ember-power-calendar', async function (assert) {
    this.set('noop', () => {});
    await render(
      hbs`<InlineDatepicker @onCenterChange={{this.noop}} @onSelect={{this.noop}} />`,
    );

    assert.dom('.ember-power-calendar').exists();
  });
});
