import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | save-button', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, 'en');

  test('it renders a button', async function (assert) {
    await render(hbs`<NextButton />`);

    assert.dom('button').exists();
    assert.dom('button').hasAttribute('type', 'submit');
  });

  test('it renders a loading spinner if `@isPending` is `true`', async function (assert) {
    await render(hbs`<NextButton @isPending={{true}} />`);

    assert.dom('button .spinner-border').exists();
  });
});
