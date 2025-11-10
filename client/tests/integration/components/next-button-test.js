import { module, test } from 'qunit';
import { setupRenderingTest } from 'croodle/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | next-button', function (hooks) {
  setupRenderingTest(hooks);

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
