import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | form navigation buttons', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders two buttons as default', async function(assert) {
    await render(hbs`{{form-navigation-buttons}}`);
    assert.equal(findAll('button').length, 2);
  });

  test('buttons could be disabled', async function(assert) {
    await render(hbs`{{form-navigation-buttons disableNextButton=true disablePrevButton=true}}`);
    assert.equal(find('button.next').disabled, true, 'next button is disabled');
    assert.equal(find('button.prev').disabled, true, 'prev button is disabled');
  });

  test('could prevent rendering of prev button', async function(assert) {
    await render(hbs`{{form-navigation-buttons renderPrevButton=false}}`);
    assert.ok(findAll('button.prev').length === 0, 'prev button is not rendered');
    assert.ok(findAll('button.next').length === 1, 'next button is rendered');
  });
});
