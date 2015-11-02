import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'croodle/tests/helpers/start-app';
/* global moment */

var application;

module('Integration | legacy support', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('show a default poll created with v0.3.0', function(assert) {
  var id = 'JlHpRs0Pzi',
      encryptionKey = '5MKFuNTKILUXw6RuqkAw6ooZw4k3mWWx98ZQw8vH',
      timezone = 'Europe/Berlin';

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey);

  andThen(function() {
    pollTitleEqual(assert, 'default poll created with v0.3.0');
    pollDescriptionEqual(assert, 'used for integration tests');

    pollHasOptionsDates(assert, [
      moment('2015-12-24').format(
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
      ),
      moment('2015-12-31').format(
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
      ),
    ]);

    pollHasOptionsTimes(assert, [
      moment.tz('2015-12-24T17:00:00.000Z', timezone).format('LT'),
      moment.tz('2015-12-24T19:00:00.000Z', timezone).format('LT'),
      moment.tz('2015-12-31T22:59:00.000Z', timezone).format('LT')
    ]);

    pollHasAnswers(assert, [
      Ember.I18n.t('answerTypes.yes.label'),
      Ember.I18n.t('answerTypes.maybe.label'),
      Ember.I18n.t('answerTypes.no.label')
    ]);

    switchTab('evaluation');

    andThen(function() {
      assert.equal(currentPath(), 'poll.evaluation');

      pollHasUser(assert,
        'Fritz Bauer',
        [
          Ember.I18n.t('answerTypes.yes.label'),
          Ember.I18n.t('answerTypes.no.label'),
          Ember.I18n.t('answerTypes.no.label')
        ]
      );
      pollHasUser(assert,
        'Lothar Hermann',
        [
          Ember.I18n.t('answerTypes.maybe.label'),
          Ember.I18n.t('answerTypes.yes.label'),
          Ember.I18n.t('answerTypes.no.label')
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
              Ember.I18n.t('answerTypes.yes.label'),
              Ember.I18n.t('answerTypes.maybe.label'),
              Ember.I18n.t('answerTypes.yes.label')
            ]
          );
        });
      });
    });
  });
});

test('find a poll using free text created with v0.3.0', function(assert) {
  var id = 'PjW3XwbuRc',
      encryptionKey = 'Rre6dAGOYLW9gYKOP4LhX7Qwfhe5Th3je0uKDtyy';

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey);

  andThen(function() {
    pollTitleEqual(assert, 'Which cake for birthday?');
    pollDescriptionEqual(assert, '');

    pollHasOptions(assert, [
      'apple pie',
      'pecan pie',
      'plum pie'
    ]);

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
