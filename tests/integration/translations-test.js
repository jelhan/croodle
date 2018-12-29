import { getOwner } from '@ember/application';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import config from 'croodle/config/environment';
import LocaleHelper from 'ember-i18n/utils/locale';
import localesMeta from 'croodle/locales/meta';

module('Integration | translations', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('configuration is correct', function(assert) {
    const i18n = this.owner.lookup('service:i18n');
    const locales = i18n.get('locales');
    const { defaultLocale } = config.i18n;

    assert.ok(defaultLocale, 'default locale is set');
    assert.ok(locales, 'there are locales');
    assert.ok(locales.indexOf(defaultLocale) !== -1, 'default locale is part of locales');
  });

  test('all locales have same amount of translation strings as default locale', function(assert) {
    const i18n = this.owner.lookup('service:i18n');
    const locales = i18n.get('locales');
    const { defaultLocale } = config.i18n;
    const { translations: defaultTranslations } = new LocaleHelper(defaultLocale, this.owner);

    assert.expect((locales.length - 1) * 2);

    locales.map((locale) => {
      if (locale === defaultLocale) {
        return;
      }
      const { translations } = new LocaleHelper(locale, getOwner(i18n));
      assert.ok(translations, `could retrive locale ${locale}`);
      assert.equal(
        Object.keys(translations).length,
        Object.keys(defaultTranslations).length,
        `correct amount of translations for locale ${locale}`
      );
    });
  });

  test('all locales have same translation strings as default locale', function(assert) {
    const i18n = this.owner.lookup('service:i18n');
    const locales = i18n.get('locales');
    const { defaultLocale } = config.i18n;
    const { translations: defaultTranslations } = new LocaleHelper(defaultLocale, this.owner);

    assert.expect(
      // count of non default locales * translation strings of default locale
      (locales.length - 1) * Object.keys(defaultTranslations).length
    );

    Object.keys(defaultTranslations).map((translationString) => {
      locales.map((locale) => {
        if (locale === defaultLocale) {
          return;
        }

        i18n.set('locale', locale);
        assert.ok(
          i18n.exists(translationString),
          `translation for ${translationString} exists in locale ${locale}`
        );
      });
    });
  });

  test('all locales have an entry in locales/meta', function(assert) {
    const i18n = this.owner.lookup('service:i18n');
    assert.deepEqual(
      i18n.get('locales'),
      Object.keys(localesMeta)
    );
  });
});
