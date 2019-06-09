import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | loading-spinner', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders a svg element', async function(assert) {
    await render(hbs`{{loading-spinner}}`);

    assert.dom('svg').exists();
  });
});
