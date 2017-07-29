import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'croodle/tests/helpers/start-app';
import pagePollParticipation from 'croodle/tests/pages/poll/participation';
/* global moment */
/* jshint proto: true */

let application;

module('Integration | legacy support', {
  beforeEach(assert) {
    window.localStorage.setItem('locale', 'en');

    application = startApp({ assert });
    moment.locale(
      application.__container__.lookup('service:i18n').get('locale')
    );
  },

  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('show a default poll created with v0.3.0', function(assert) {
  const id = 'JlHpRs0Pzi';
  const encryptionKey = '5MKFuNTKILUXw6RuqkAw6ooZw4k3mWWx98ZQw8vH';
  const timezone = 'Europe/Berlin';

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`);

  andThen(function() {
    assert.equal(currentPath(), 'poll.participation');
    assert.equal(
      pagePollParticipation.title,
      'default poll created with v0.3.0'
    );
    assert.equal(
      pagePollParticipation.description,
      'used for integration tests'
    );
    assert.deepEqual(
      pagePollParticipation.options().labels,
      [
        moment.tz('2015-12-24T17:00:00.000Z', timezone).format('LLLL'),
        moment.tz('2015-12-24T19:00:00.000Z', timezone).format('LT'),
        moment.tz('2015-12-31T22:59:00.000Z', timezone).format('LLLL')
      ]
    );
    assert.deepEqual(
      pagePollParticipation.options().answers,
      [
        t('answerTypes.yes.label').toString(),
        t('answerTypes.maybe.label').toString(),
        t('answerTypes.no.label').toString()
      ]
    );

    switchTab('evaluation');

    andThen(function() {
      assert.equal(currentPath(), 'poll.evaluation');

      pollHasUser(assert,
        'Fritz Bauer',
        [
          t('answerTypes.yes.label'),
          t('answerTypes.no.label'),
          t('answerTypes.no.label')
        ]
      );
      pollHasUser(assert,
        'Lothar Hermann',
        [
          t('answerTypes.maybe.label'),
          t('answerTypes.yes.label'),
          t('answerTypes.no.label')
        ]
      );

      switchTab('participation');

      andThen(function() {
        assert.equal(currentPath(), 'poll.participation');

        pollParticipate('Hermann Langbein', ['yes', 'maybe', 'yes']);

        andThen(function() {
          assert.equal(currentPath(), 'poll.evaluation');
          pollHasUser(assert,
            'Hermann Langbein',
            [
              t('answerTypes.yes.label'),
              t('answerTypes.maybe.label'),
              t('answerTypes.yes.label')
            ]
          );
        });
      });
    });
  });
});

test('find a poll using free text created with v0.3.0', function(assert) {
  const id = 'PjW3XwbuRc';
  const encryptionKey = 'Rre6dAGOYLW9gYKOP4LhX7Qwfhe5Th3je0uKDtyy';

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`);

  andThen(function() {
    assert.equal(
      pagePollParticipation.title,
      'Which cake for birthday?'
    );
    assert.equal(
      pagePollParticipation.description,
      ''
    );
    assert.deepEqual(
      pagePollParticipation.options().labels,
      [
        'apple pie',
        'pecan pie',
        'plum pie'
      ]
    );

    switchTab('evaluation');

    andThen(function() {
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUser(assert,
        'Paul Levi',
        [
          'would be great!',
          'no way',
          'if I had to'
        ]
      );

      switchTab('participation');

      andThen(function() {
        assert.equal(currentPath(), 'poll.participation');
        pollParticipate('Hermann Langbein', ["I don't care", 'would be awesome', "can't imagine anything better"]);

        andThen(function() {
          assert.equal(currentPath(), 'poll.evaluation');
          pollHasUser(assert,
            'Hermann Langbein',
            [
              "I don't care",
              'would be awesome',
              "can't imagine anything better"
            ]
          );
        });
      });
    });
  });
});
