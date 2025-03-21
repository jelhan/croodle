import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | back-button', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'en');

  test('it renders a button', async function (assert) {
    await render(hbs`<BackButton />`);

    assert.dom('button').exists();
  });
});
