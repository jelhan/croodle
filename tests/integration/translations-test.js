import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import localesMeta from 'croodle/locales/meta';

const DEFAULT_LOCALE = 'en';

function getTranslationsForLocale(intlService, locale) {
  return intlService._adapter.lookupLocale(locale).translations;
}

module('Integration | translations', function(hooks) {
  setupTest(hooks);

  test('all locales have same amount of translation strings as default locale', function(assert) {
    const intl = this.owner.lookup('service:intl');
    const locales = intl.locales;
    const translationsForDefaultLocale = getTranslationsForLocale(intl, DEFAULT_LOCALE);

    assert.expect((locales.length - 1) * 2);

    locales.map((locale) => {
      if (locale === DEFAULT_LOCALE) {
        return;
      }

      let translations = getTranslationsForLocale(intl, locale);
      assert.ok(translations, `could retrive locale ${locale}`);
      assert.equal(
        Object.keys(translations).length,
        Object.keys(translationsForDefaultLocale).length,
        `correct amount of translations for locale ${locale}`
      );
    });
  });

  test('all locales include same translation strings as default locale', function(assert) {
    const intl = this.owner.lookup('service:intl');
    const locales = intl.locales;
    const translationsForDefaultLocale = getTranslationsForLocale(intl, DEFAULT_LOCALE);

    assert.expect(
      // count of non default locales * translation strings of default locale
      (locales.length - 1) * Object.keys(translationsForDefaultLocale).length
    );

    Object.keys(translationsForDefaultLocale).map((translationString) => {
      locales.map((locale) => {
        if (locale === DEFAULT_LOCALE) {
          return;
        }

        assert.ok(
          intl.exists(translationString, locale),
          `translation for ${translationString} exists in locale ${locale}`
        );
      });
    });
  });

  test('all locales have an entry in locales/meta', function(assert) {
    let intl = this.owner.lookup('service:intl');

    intl.locales.forEach((locale) => {
      assert.ok(Object.keys(localesMeta).includes(locale), `locales meta data is present for ${locale}`);
    });
  });
});
