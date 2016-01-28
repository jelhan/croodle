import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'croodle/tests/helpers/start-app';
import Pretender from 'pretender';
import serverGetPolls from '../helpers/server-get-polls';
/* jshint proto: true */
/* global jstz, moment, start, stop */

let application, server;

module('Acceptance | view poll', {
  beforeEach() {
    application = startApp();
    application.__container__.lookup('adapter:application').__proto__.namespace = '';

    server = new Pretender();
  },
  afterEach() {
    server.shutdown();

    Ember.run(application, 'destroy');
  }
});

test('view poll url', function(assert) {
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz012345789';

  server.get(`/polls/${id}`, function() {
    return serverGetPolls({ id }, encryptionKey);
  });

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`);
  andThen(function() {
    assert.equal(
      find('.share-link .link a').text(),
      window.location.href,
      'share link is shown'
    );
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
    pollHasOptions(assert, [
      moment('2015-12-12').format(
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
      ),
      moment('2016-01-01').format(
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
      )
    ]);
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
    pollHasOptions(assert, [
      // full date
      moment.tz('2015-12-12T11:11:00.000Z', timezone).format('LLLL'),
      // only time cause day is repeated
      moment.tz('2015-12-12T13:13:00.000Z', timezone).format('LT'),
      // full date cause day changed
      moment.tz('2016-01-01T11:11:00.000Z', timezone).format('LLLL')
    ]);
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
    stop();
    Ember.run.later(function() {
      start();

      assert.equal(
        find('.modal').css('display'),
        'block',
        'user gets asked which timezone should be used'
      );

      click('.modal button.use-local-timezone');

      andThen(function() {
        pollHasOptions(assert, [
          moment.tz('2015-12-12T11:11:00.000Z', timezoneLocal).format('LLLL'),
          moment.tz('2016-01-01T11:11:00.000Z', timezoneLocal).format('LLLL')
        ]);

        stop();
        Ember.run.later(function() {
          start();

          assert.equal(
            find('.modal').css('display'),
            'none',
            'modal is closed'
          );
        }, 1000);
      });
    }, 1000);
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
    stop();
    Ember.run.later(function() {
      start();

      assert.equal(
        find('.modal').css('display'),
        'block',
        'user gets asked which timezone should be used'
      );

      click('.modal button.use-poll-timezone');

      andThen(function() {
        pollHasOptions(assert, [
          moment.tz('2015-12-12T11:11:00.000Z', timezonePoll).format('LLLL'),
          moment.tz('2016-01-01T11:11:00.000Z', timezonePoll).format('LLLL')
        ]);

        stop();
        Ember.run.later(function() {
          start();

          assert.equal(
            find('.modal').css('display'),
            'none',
            'modal is closed'
          );
        }, 1000);
      });
    }, 1000);
  });
});
