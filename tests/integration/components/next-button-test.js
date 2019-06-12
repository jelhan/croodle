import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | next-button', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a button', async function(assert) {
    await render(hbs`<NextButton />`);

    assert.dom('button').exists();
  });

  test('it supports block mode', async function(assert) {
    await render(hbs`
      <NextButton>
        some text
      </NextButton>
    `);

    assert.dom('button').hasText('some text');
  });

  test('it renders a loading spinner if `@isPending` is `true`', async function(assert) {
    await render(hbs`<NextButton @isPending={{true}} />`);

    assert.dom('button .spinner-border').exists();
  });
});
