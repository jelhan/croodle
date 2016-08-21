import { test } from 'qunit';
import moduleForAcceptance from 'croodle/tests/helpers/module-for-acceptance';
import pageIndex from 'croodle/tests/pages/index';

moduleForAcceptance('Acceptance | i18n', {
  beforeEach() {
    window.localStorage.setItem('locale', 'en');
  }
});

test('locale is saved in localStorage', function(assert) {
  visit('/');

  andThen(() => {
    assert.equal(find('.language-select').val(), 'en');
    pageIndex.locale('de');

    andThen(function() {
      assert.equal(find('.language-select').val(), 'de');
      assert.equal(
        window.localStorage.getItem('locale'), 'de',
        'persisted in localeStorage'
      );
    });
  });
});
