import { module, test } from 'qunit';
import { setupRenderingTest } from '@croodle/client/tests/helpers';
import { fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | pick', function (hooks) {
  setupRenderingTest(hooks);

  test('can be used with on helper', async function (assert) {
    this.set('onChange', (value) => {
      assert.strictEqual(value, 'some input');
    });

    await render(hbs`
      {{!-- template-lint-disable require-input-label --}}
      <input {{on "change" (pick "target.value" this.onChange)}}>
    `);
    await fillIn('input', 'some input');
  });
});
