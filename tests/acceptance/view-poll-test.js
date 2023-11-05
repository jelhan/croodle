import {
  click,
  currentURL,
  currentRouteName,
  findAll,
  visit,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import pageParticipation from 'croodle/tests/pages/poll/participation';
import { DateTime } from 'luxon';
module('Acceptance | view poll', function (hooks) {
  hooks.beforeEach(function () {
    window.localStorage.setItem('locale', 'en');
  });

  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('poll url', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz012345789';
    let poll = this.server.create('poll', { encryptionKey });
    let pollUrl = `/poll/${poll.id}?encryptionKey=${encryptionKey}`;

    await visit(pollUrl);
    assert
      .dom('[data-test-poll-url]')
      .containsText(
        `#/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`,
        'share link is shown',
      );

    await click('.copy-btn');
    assert
      .dom('[data-test-tooltip="copied"]')
      .isVisible('shows success message that URL has been copied');
  });

  test('shows a warning if poll is about to be expired', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      encryptionKey,
      expirationDate: DateTime.local().plus({ weeks: 1 }).toISO(),
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert.ok(pageParticipation.showsExpirationWarning);
  });

  test('view a poll with dates', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', {
      encryptionKey,
      options: [{ title: '2015-12-12' }, { title: '2016-01-01' }],
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      ['Saturday, December 12, 2015', 'Friday, January 1, 2016'],
    );
  });

  test('view a poll with dates and times', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let poll = this.server.create('poll', {
      encryptionKey,
      expirationDate: DateTime.local().plus({ years: 1 }).toISO(),
      isDateTime: true,
      options: [
        // need to parse the date with luxon cause Safari's Date.parse()
        // implementation treats a data-time string without explicit
        // time zone as UTC rather than local time
        { title: DateTime.fromISO('2015-12-12T11:11:00').toISO() },
        { title: DateTime.fromISO('2015-12-12T13:13:00').toISO() },
        { title: DateTime.fromISO('2016-01-01T11:11:00').toISO() },
      ],
      timezone,
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      [
        // full date
        'Saturday, December 12, 2015 at 11:11 AM',
        // only time cause day is repeated
        '1:13 PM',
        // full date cause day changed
        'Friday, January 1, 2016 at 11:11 AM',
      ],
    );
    assert.notOk(
      pageParticipation.showsExpirationWarning,
      'does not show an expiration warning if poll will not expire in next weeks',
    );
  });

  test('view a poll while timezone differs from the one poll got created in and choose local timezone', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let timezoneUser = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let timezonePoll =
      timezoneUser !== 'America/Caracas' ? 'America/Caracas' : 'Europe/Moscow';
    let poll = this.server.create('poll', {
      encryptionKey,
      isDateTime: true,
      options: [
        { title: '2015-12-12T11:11:00.000Z' },
        { title: '2016-01-01T11:11:00.000Z' },
      ],
      timezone: timezonePoll,
      users: [
        this.server.create('user', {
          encryptionKey,
          selections: [
            {
              type: 'yes',
              labelTranslation: 'answerTypes.yes.label',
              icon: 'glyphicon glyphicon-thumbs-up',
              label: 'Yes',
            },
            {
              type: 'no',
              labelTranslation: 'answerTypes.no.label',
              icon: 'glyphicon glyphicon-thumbs-down',
              label: 'No',
            },
          ],
        }),
      ],
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert
      .dom('[data-test-modal="choose-timezone"]')
      .exists('user is asked which timezone should be used');

    await click(
      '[data-test-modal="choose-timezone"] [data-test-button="use-local-timezone"]',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      [
        Intl.DateTimeFormat('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date('2015-12-12T11:11:00.000Z')),
        Intl.DateTimeFormat('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date('2016-01-01T11:11:00.000Z')),
      ],
    );
    assert
      .dom('[data-test-modal="choose-timezone"]')
      .doesNotExist('modal is closed');

    await click('.nav [data-test-link="evaluation"]');
    assert.deepEqual(
      findAll('[data-test-best-option]').map((el) => el.textContent.trim()),
      [
        Intl.DateTimeFormat('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date('2015-12-12T11:11:00.000Z')),
      ],
    );
  });

  test('view a poll while timezone differs from the one poll got created in and choose poll timezone', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let timezoneUser = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let timezonePoll =
      timezoneUser !== 'America/Caracas' ? 'America/Caracas' : 'Europe/Moscow';
    let poll = this.server.create('poll', {
      encryptionKey,
      isDateTime: true,
      options: [
        { title: '2015-12-12T11:11:00.000Z' },
        { title: '2016-01-01T11:11:00.000Z' },
      ],
      timezone: timezonePoll,
      users: [
        this.server.create('user', {
          encryptionKey,
          selections: [
            {
              type: 'yes',
              labelTranslation: 'answerTypes.yes.label',
              icon: 'glyphicon glyphicon-thumbs-up',
              label: 'Yes',
            },
            {
              type: 'no',
              labelTranslation: 'answerTypes.no.label',
              icon: 'glyphicon glyphicon-thumbs-down',
              label: 'No',
            },
          ],
        }),
      ],
    });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert
      .dom('[data-test-modal="choose-timezone"]')
      .exists('user is asked which timezone should be used');

    await click(
      '[data-test-modal="choose-timezone"] [data-test-button="use-poll-timezone"]',
    );
    assert.deepEqual(
      findAll(
        `[data-test-form-element^="option"] label:not(.custom-control-label)`,
      ).map((el) => el.textContent.trim()),
      [
        Intl.DateTimeFormat('en-US', {
          timeZone: timezonePoll,
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date('2015-12-12T11:11:00.000Z')),
        Intl.DateTimeFormat('en-US', {
          timeZone: timezonePoll,
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date('2016-01-01T11:11:00.000Z')),
      ],
    );
    assert
      .dom('[data-test-modal="choose-timezone"]')
      .doesNotExist('modal is closed');

    await click('.nav [data-test-link="evaluation"]');
    assert.deepEqual(
      findAll('[data-test-best-option]').map((el) => el.textContent.trim()),
      [
        Intl.DateTimeFormat('en-US', {
          timeZone: timezonePoll,
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(new Date('2015-12-12T11:11:00.000Z')),
      ],
    );
  });

  test('shows error page if poll does not exist', async function (assert) {
    let pollId = 'not-existing';
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

    await visit(`/poll/${pollId}?encryptionKey=${encryptionKey}`);
    assert.strictEqual(
      currentURL(),
      `/poll/${pollId}?encryptionKey=${encryptionKey}`,
      'shows URL entered by user',
    );
    assert.strictEqual(
      currentRouteName(),
      'poll_error',
      'shows error substate of poll route',
    );
    assert
      .dom('[data-test-error-type]')
      .hasAttribute('data-test-error-type', 'not-found');
  });

  test('shows error page if encryption key is wrong', async function (assert) {
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let poll = this.server.create('poll', { encryptionKey: 'anotherkey' });

    await visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);
    assert.strictEqual(
      currentURL(),
      `/poll/${poll.id}?encryptionKey=${encryptionKey}`,
      'shows URL entered by user',
    );
    assert.strictEqual(
      currentRouteName(),
      'poll_error',
      'shows error substate of poll route',
    );
    assert
      .dom('[data-test-error-type]')
      .hasAttribute('data-test-error-type', 'decryption-failed');
  });

  test('shows error page if server returns a 500', async function (assert) {
    let pollId = 'not-existing';
    let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // mock server returning 500 error
    this.server.get('polls/:id', () => {}, 500);

    await visit(`/poll/${pollId}?encryptionKey=${encryptionKey}`);
    assert.strictEqual(
      currentURL(),
      `/poll/${pollId}?encryptionKey=${encryptionKey}`,
      'shows URL entered by user',
    );
    assert.strictEqual(
      currentRouteName(),
      'poll_error',
      'shows error substate of poll route',
    );
    assert
      .dom('[data-test-error-type]')
      .hasAttribute('data-test-error-type', 'unexpected');
  });
});
