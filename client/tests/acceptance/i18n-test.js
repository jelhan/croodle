import { fillIn, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from '@croodle/client/tests/helpers';

module('Acceptance | i18n', function (hooks) {
  hooks.beforeEach(function () {
    window.localStorage.setItem('locale', 'de');
  });

  setupApplicationTest(hooks);

  test('locale is saved in localStorage', async function (assert) {
    await visit('/');
    assert
      .dom('.language-select')
      .hasValue('de', 'picks up locale in locale storage');

    await fillIn('.language-select', 'en');
    assert.dom('.language-select').hasValue('en', 'shows changed locale');
    assert.strictEqual(
      window.localStorage.getItem('locale'),
      'en',
      'persisted in localeStorage',
    );
  });
});
