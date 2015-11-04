import languages from '../../lang/translations';
import { module, test } from 'qunit';

module('Unit | languages');

// Replace this with your real tests.
test('translations are correct', function(assert) {
  assert.ok(languages);

  Object.keys(languages).map(function(language) {
    if (language !== 'en') {
      assert.equal(
        Object.keys(languages[language]).length,
        Object.keys(languages.en).length,
        'language ' + language + ' has same amount of translation keys as english language'
      );
    }
  });

  Object.keys(languages.en).map(function(translationKey) {
    Object.keys(languages).map(function(language) {
      if (language !== 'en') {
        assert.ok(
          languages[language][translationKey],
          'translation with key ' + translationKey + ' exist for language ' + language
        );
      }
    });
  });
});
