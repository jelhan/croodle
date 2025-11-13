import { module, test } from 'qunit';
import { setupRenderingTest } from '@croodle/client/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Modifier | autofocus', function (hooks) {
  setupRenderingTest(hooks);

  test('it focuses the element', async function (assert) {
    await render(hbs`<input {{autofocus}} />`);

    assert.dom('input').isFocused();
  });

  test('it focuses the element if `enabled` is `true`', async function (assert) {
    this.set('enabled', true);
    await render(hbs`<input {{autofocus enabled=this.enabled}} />`);

    assert.dom('input').isFocused();
  });

  test('it does not focus the element if `enabled` is `false`', async function (assert) {
    this.set('enabled', false);
    await render(hbs`<input {{autofocus enabled=this.enabled}} />`);

    assert.dom('input').isNotFocused();
  });

  test('it does not focus the element if `enabled` changes', async function (assert) {
    this.set('enabled', false);

    await render(hbs`<input {{autofocus enabled=this.enabled}} />`);
    this.set('enabled', true);
    assert.dom('input').isNotFocused();
  });
});
