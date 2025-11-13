import { module, test } from 'qunit';
import { setupTest } from '@croodle/client/tests/helpers';
import localesMeta from '@croodle/client/locales/meta';

module('Integration | translations', function (hooks) {
  setupTest(hooks);

  test('all locales have an entry in locales/meta', function (assert) {
    let intl = this.owner.lookup('service:intl');

    intl.locales.forEach((locale) => {
      assert.ok(
        Object.keys(localesMeta).includes(locale),
        `locales meta data is present for ${locale}`,
      );
    });
  });
});
