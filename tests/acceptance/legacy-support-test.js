import { test } from 'qunit';
import moduleForAcceptance from 'croodle/tests/helpers/module-for-acceptance';
import moment from 'moment';
import pagePollParticipation from 'croodle/tests/pages/poll/participation';
/* jshint proto: true */

moduleForAcceptance('Acceptance | legacy support', {
  beforeEach() {
    window.localStorage.setItem('locale', 'en');
    moment.locale('en');
  }
});

test('show a default poll created with v0.3.0', function(assert) {
  const encryptionKey = '5MKFuNTKILUXw6RuqkAw6ooZw4k3mWWx98ZQw8vH';

  let poll = server.create('poll', {
    encryptionKey,
    // property 'id' of answers has been renamed to 'type' in v0.4.0
    answers: [{ 'id': 'yes','labelTranslation': 'answerTypes.yes.label','icon': 'glyphicon glyphicon-thumbs-up','label': 'Ja' },{ 'id': 'maybe','labelTranslation': 'answerTypes.maybe.label','icon': 'glyphicon glyphicon-hand-right','label': 'Vielleicht' },{ 'id': 'no','labelTranslation': 'answerTypes.no.label','icon': 'glyphicon glyphicon-thumbs-down','label': 'Nein' }],
    options: [{ 'title': '2015-12-24T17:00:00.000Z' },{ 'title': '2015-12-24T19:00:00.000Z' },{ 'title': '2015-12-31T22:59:00.000Z' }],
    users: [
      server.create('user', {
        encryptionKey,
        name: 'Fritz Bauer',
        // selections.value was renamed to selections.label
        // selections.id was renamed to selections.type
        selections: [{ 'value': { 'id': 'yes','labelTranslation': 'answerTypes.yes.label','icon': 'glyphicon glyphicon-thumbs-up','label': 'Ja' } },{ 'value': { 'id': 'no','labelTranslation': 'answerTypes.no.label','icon': 'glyphicon glyphicon-thumbs-down','label': 'Nein' } },{ 'value': { 'id': 'no','labelTranslation': 'answerTypes.no.label','icon': 'glyphicon glyphicon-thumbs-down','label': 'Nein' } }],
        // version tag had have wrong format
        version: 'v0.3-0'
      })
    ],
    // version tag had have wrong format
    version: 'v0.3-0'
  });

  visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);

  andThen(function() {
    assert.equal(currentPath(), 'poll.participation');
    assert.deepEqual(
      pagePollParticipation.options().labels,
      [
        moment('2015-12-24T17:00:00.000Z').format('LLLL'),
        moment('2015-12-24T19:00:00.000Z').format('LT'),
        moment('2015-12-31T22:59:00.000Z').format('LLLL')
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

test('show a poll using free text created with v0.3.0', function(assert) {
  let encryptionKey = 'Rre6dAGOYLW9gYKOP4LhX7Qwfhe5Th3je0uKDtyy';
  let poll = server.create('poll', {
    encryptionKey,
    answerType: 'FreeText',
    answers: [],
    options: [{ 'title': 'apple pie' }, { 'title': 'pecan pie' }, { 'title': 'plum pie' }],
    pollType: 'MakeAPoll',
    users: [
      server.create('user', {
        encryptionKey,
        name: 'Paul Levi',
        // selections.value was renamed to selections.label
        // selections.id was renamed to selections.type
        selections: [{ 'value': 'would be great!' }, { 'value': 'no way' }, { 'value': 'if I had to' }],
        // version tag had have wrong format
        version: 'v0.3-0'
      })
    ],
    // version tag had have wrong format
    version: 'v0.3-0'
  });

  visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`);

  andThen(function() {
    assert.equal(currentPath(), 'poll.participation');
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
