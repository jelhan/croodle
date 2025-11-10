import { module, test } from 'qunit';
import { setupRenderingTest } from 'croodle/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | back-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a button', async function (assert) {
    await render(hbs`<BackButton />`);

    assert.dom('button').exists();
  });
});
