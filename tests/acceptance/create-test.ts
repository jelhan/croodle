import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  fillIn,
  click,
  currentRouteName,
  findAll,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'croodle/tests/helpers';

module('Acceptance | create', function (hooks) {
  setupApplicationTest(hooks);

  test('user can create a poll', async function (assert) {
    await visit('/create');
    assert.strictEqual(currentURL(), '/create', 'user can open create route');

    await fillIn('form input[name="title"]', 'Crypoparty');
    await fillIn(
      'form textarea[name="description"]',
      'When should we have our next Cryptoparty?'
    );
    assert
      .dom('ol li')
      .exists(
        { count: 0 },
        'list of dates for poll is empty until user enters a date'
      );

    await fillIn('form input[name="add-date"]', '2021-05-03T18:00');
    assert.deepEqual(
      Array.from(findAll('ol li')).map((el) =>
        el.textContent?.replace('🗙', '').trim()
      ),
      ['2021-05-03T18:00'],
      'date is listed to the user'
    );

    await fillIn('form input[name="add-date"]', '2021-06-02T11:12');
    assert.deepEqual(
      Array.from(findAll('ol li')).map((el) =>
        el.textContent?.replace('🗙', '').trim()
      ),
      ['2021-05-03T18:00', '2021-06-02T11:12'],
      'additional date is added to the list'
    );

    await fillIn('form input[name="add-date"]', '2021-04-01T07:14');
    assert.deepEqual(
      Array.from(findAll('ol li')).map((el) =>
        el.textContent?.replace('🗙', '').trim()
      ),
      ['2021-04-01T07:14', '2021-05-03T18:00', '2021-06-02T11:12'],
      'listed dates are sorted'
    );

    await click('form button[type="submit"]');
    assert.strictEqual(
      currentRouteName(),
      'poll',
      'user is transitioned to newly created poll'
    );
  });

  test('user can create a poll without description', async function (assert) {
    await visit('/create');
    assert.strictEqual(currentURL(), '/create', 'user can open create route');

    await fillIn('form input[name="title"]', 'Crypoparty');
    await fillIn('form input[name="add-date"]', '2021-05-03T18:00');
    await click('form button[type="submit"]');
    assert.strictEqual(
      currentRouteName(),
      'poll',
      'user is transitioned to newly created poll'
    );
  });

  test('user cannot create an invalid poll', async function (assert) {
    await visit('/create');
    assert.strictEqual(currentURL(), '/create', 'user can open create route');
    assert
      .dom('form')
      .isNotValid('form is invalid if user has not entered a title');
    assert
      .dom('form input[name="title"]')
      .isNotValid('title input is invalid before user enters a value');
    assert
      .dom('form textarea[name="description"]')
      .isValid('description textarea is valid even if being empty');
    assert
      .dom('form input[name="add-date"]')
      .isNotValid(
        'date input is not valid until user entered at least one date'
      );

    await click('form button[type="submit"]');
    assert.strictEqual(
      currentURL(),
      '/create',
      'user stays on create page if trying to create an invalid poll'
    );
  });
});
