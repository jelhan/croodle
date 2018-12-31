import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | autofocusable-element', function(hooks) {
  setupRenderingTest(hooks);

  test('it supports block mode', async function(assert) {
    await render(hbs`
      {{#autofocusable-element}}
        template block text
      {{/autofocusable-element}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });

  test('it focus element', async function(assert) {
    await render(hbs`
      {{#autofocusable-element tagName='input' autofocus=true}}
        template block text
      {{/autofocusable-element}}
    `);

    assert.ok(this.element.querySelector('input') === document.activeElement);
  });
});
