import { module, test } from 'qunit';
import {
  visit,
  currentURL,
  fillIn,
  click,
  currentRouteName,
  findAll,
  waitUntil,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'croodle/tests/helpers';
import { Poll, polls } from 'croodle/mocks/db';
import { EncryptedValue, decrypt, deriveKey } from 'croodle/utils/crypto';

async function decryptValue(
  poll: Poll,
  passphrase: string,
  encryptedValue: { iv: Array<number>; ciphertext: Array<number> }
): Promise<unknown> {
  const key = await deriveKey(passphrase, new Uint8Array(poll.attributes.salt));
  return await decrypt(new EncryptedValue(encryptedValue), key);
}

module('Acceptance | create', function (hooks) {
  setupApplicationTest(hooks);

  test('user can create a poll', async function (assert) {
    await visit('/create');
    assert.strictEqual(currentURL(), '/create', 'user can open create route');

    await fillIn('form input[name="title"]', 'Cryptoparty');
    await fillIn(
      'form textarea[name="description"]',
      'When do we have our next Cryptoparty?'
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
    await waitUntil(() => currentRouteName() === 'poll');
    assert.strictEqual(
      currentRouteName(),
      'poll',
      'user is transitioned to newly created poll'
    );

    const passphrase = new URL(
      currentURL(),
      'http://examples.com'
    ).searchParams.get('k') as string;
    assert.strictEqual(
      typeof passphrase,
      'string',
      `URL ${currentURL()} contains a passphrase`
    );
    assert.strictEqual(
      passphrase?.length,
      30,
      `Passphrase consists of 30 chars`
    );
    assert.strictEqual(polls.size, 1, 'one poll has been persisted at server');

    const poll = Array.from(polls.values())[0] as Poll;
    assert.strictEqual(
      await decryptValue(poll, passphrase, poll.attributes.encryptedTitle),
      'Cryptoparty',
      'title attribute is persisted at server with exepected encrypted value'
    );
    assert.strictEqual(
      await decryptValue(
        poll,
        passphrase,
        poll.attributes.encryptedDescription
      ),
      'When do we have our next Cryptoparty?',
      'description attribute is persisted at server with exepected encrypted value'
    );

    assert.strictEqual(
      poll.options.length,
      3,
      'persisted poll has three options'
    );
    assert.deepEqual(
      await Promise.all(
        poll.options.map(
          async (option) =>
            await decryptValue(
              poll,
              passphrase,
              option.attributes.encryptedDate
            )
        )
      ),
      ['2021-05-03T18:00', '2021-06-02T11:12', '2021-04-01T07:14'],
      'options are persisted at server with exepected encrypted dates'
    );
  });

  test('user can create a poll without description', async function (assert) {
    await visit('/create');
    assert.strictEqual(currentURL(), '/create', 'user can open create route');

    await fillIn('form input[name="title"]', 'Crypoparty');
    await fillIn('form input[name="add-date"]', '2021-05-03T18:00');
    await click('form button[type="submit"]');
    await waitUntil(() => currentRouteName() === 'poll');
    assert.strictEqual(
      currentRouteName(),
      'poll',
      'user is transitioned to newly created poll'
    );
    assert.strictEqual(polls.size, 1, 'one poll has been persisted at server');
    assert.strictEqual(
      Array.from(polls.values())[0]?.options.length,
      1,
      'persisted poll has one option'
    );
    const passphrase = new URL(
      currentURL(),
      'http://examples.com'
    ).searchParams.get('k') as string;
    const poll = Array.from(polls.values())[0] as Poll;
    assert.strictEqual(
      await decryptValue(
        poll,
        passphrase,
        poll.attributes.encryptedDescription
      ),
      '',
      'description attribute is persisted at server with empty string (encrypted)'
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
