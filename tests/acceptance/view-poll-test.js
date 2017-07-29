import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'croodle/tests/helpers/start-app';
import Pretender from 'pretender';
import serverGetPolls from '../helpers/server-get-polls';
import pageParticipation from 'croodle/tests/pages/poll/participation';
/* jshint proto: true */
/* global jstz, moment */

const { run } = Ember;

let application, server;

module('Acceptance | view poll', {
  beforeEach(assert) {
    window.localStorage.setItem('locale', 'en');

    application = startApp({ assert });
    application.__container__.lookup('adapter:application').__proto__.namespace = '';

    server = new Pretender();
  },
  afterEach() {
    server.shutdown();

    run(application, 'destroy');
  }
});

test('poll url', function(assert) {
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz012345789';
  let pollUrl = `/poll/${id}?encryptionKey=${encryptionKey}`;

  server.get(`/polls/${id}`, function() {
    return serverGetPolls({ id }, encryptionKey);
  });

  visit(pollUrl);
  andThen(function() {
    assert.equal(
      find('.poll-link .link a').text(),
      window.location.href,
      'share link is shown'
    );

    find('.poll-link .copy-btn').click();
    /*
     * Can't test if link is actually copied to clipboard due to api
     * restrictions. Due to security it's not allowed to read from clipboard.
     *
     * Can't test if flash message is shown due to
     * https://github.com/poteto/ember-cli-flash/issues/202
    */
  });
});

test('view a poll with dates', function(assert) {
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get(`/polls/${id}`, function() {
    return serverGetPolls(
      {
        id,
        options: [
          { title: '2015-12-12' },
          { title: '2016-01-01' }
        ]
      }, encryptionKey
    );
  });

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`).then(function() {
    assert.deepEqual(
      pageParticipation.options().labels,
      [
        'Saturday, December 12, 2015',
        'Friday, January 1, 2016'
      ]
    );
  });
});

test('view a poll with dates and times', function(assert) {
  const id = 'test';
  const encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const timezone = jstz.determine().name();

  server.get(`/polls/${id}`, function() {
    return serverGetPolls(
      {
        id,
        isDateTime: true,
        options: [
          { title: '2015-12-12T11:11:00.000Z' },
          { title: '2015-12-12T13:13:00.000Z' },
          { title: '2016-01-01T11:11:00.000Z' }
        ],
        timezone
      }, encryptionKey
    );
  });

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`).then(function() {
    assert.deepEqual(
      pageParticipation.options().labels,
      [
        // full date
        moment.tz('2015-12-12T11:11:00.000Z', timezone).locale('en').format('LLLL'),
        // only time cause day is repeated
        moment.tz('2015-12-12T13:13:00.000Z', timezone).locale('en').format('LT'),
        // full date cause day changed
        moment.tz('2016-01-01T11:11:00.000Z', timezone).locale('en').format('LLLL')
      ]
    );
  });
});

test('view a poll while timezone differs from the one poll got created in and choose local timezone', function(assert) {
  const id = 'test';
  const encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const timezoneLocal = jstz.determine().name();
  let timezonePoll;

  if (timezoneLocal !== 'America/Caracas') {
    timezonePoll = 'America/Caracas';
  } else {
    timezonePoll = 'Europe/Moscow';
  }

  server.get(`/polls/${id}`, function() {
    return serverGetPolls(
      {
        id,
        isDateTime: true,
        options: [
          { title: '2015-12-12T11:11:00.000Z' },
          { title: '2016-01-01T11:11:00.000Z' }
        ],
        timezone: timezonePoll
      }, encryptionKey
    );
  });

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`).then(function() {
    run.next(function() {
      assert.ok(
        find('#modal-choose-timezone-modal').is(':visible'),
        'user gets asked which timezone should be used'
      );

      click('#modal-choose-timezone-modal button.use-local-timezone');

      andThen(function() {
        assert.deepEqual(
          pageParticipation.options().labels,
          [
            moment.tz('2015-12-12T11:11:00.000Z', timezoneLocal).locale('en').format('LLLL'),
            moment.tz('2016-01-01T11:11:00.000Z', timezoneLocal).locale('en').format('LLLL')
          ]
        );

        run.next(function() {
          assert.notOk(
            find('#modal-choose-timezone-modal').is(':visible'),
            'modal is closed'
          );
        });
      });
    });
  });
});

test('view a poll while timezone differs from the one poll got created in and choose poll timezone', function(assert) {
  const id = 'test';
  const encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const timezoneLocal = jstz.determine().name();
  let timezonePoll;

  if (timezoneLocal !== 'America/Caracas') {
    timezonePoll = 'America/Caracas';
  } else {
    timezonePoll = 'Europe/Moscow';
  }

  server.get(`/polls/${id}`, function() {
    return serverGetPolls(
      {
        id,
        isDateTime: true,
        options: [
          { title: '2015-12-12T11:11:00.000Z' },
          { title: '2016-01-01T11:11:00.000Z' }
        ],
        timezone: timezonePoll
      }, encryptionKey
    );
  });

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`).then(function() {

    run.next(function() {
      assert.ok(
        find('#modal-choose-timezone-modal').is(':visible'),
        'user gets asked which timezone should be used'
      );

      click('#modal-choose-timezone-modal button.use-poll-timezone');

      andThen(function() {
        assert.deepEqual(
          pageParticipation.options().labels,
          [
            moment.tz('2015-12-12T11:11:00.000Z', timezonePoll).locale('en').format('LLLL'),
            moment.tz('2016-01-01T11:11:00.000Z', timezonePoll).locale('en').format('LLLL')
          ]
        );

        run.next(function() {
          assert.notOk(
            find('#modal-choose-timezone-modal').is(':visible'),
            'modal is closed'
          );
        });
      });
    });
  });
});
