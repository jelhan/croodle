import { test } from 'qunit';
import jQuery from 'jquery';
import moduleForAcceptance from 'croodle/tests/helpers/module-for-acceptance';
/* jshint proto: true */

moduleForAcceptance('Acceptance | participate in a poll', {
  beforeEach() {
    window.localStorage.setItem('locale', 'en');
  }
});

test('participate in a default poll', function(assert) {
  server.logging = true;

  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let poll = server.create('poll', {
    encryptionKey
  });

  visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`).then(function() {
    assert.equal(currentPath(), 'poll.participation', 'poll is redirected to poll.participation');
    pollParticipate('Max Meiner', ['yes', 'no']);

    andThen(function() {
      assert.equal(currentPath(), 'poll.evaluation');
      assert.equal(
        currentURL().split('?')[1],
        `encryptionKey=${encryptionKey}`,
        'encryption key is part of query params'
      );
      pollHasUsersCount(assert, 1, 'user is added to user selections table');
      pollHasUser(assert, 'Max Meiner', [t('answerTypes.yes.label'), t('answerTypes.no.label')]);

      click('.nav .participation');

      andThen(() => {
        assert.equal(currentPath(), 'poll.participation');
        assert.equal(find('.name input').val(), '', 'input for name is cleared');
        assert.ok(
          !find('input[type="radio"]').toArray().some((el) => jQuery(el).prop('checked')),
          'radios are cleared'
        );
        pollParticipate('Peter Müller', ['yes', 'yes']);

        andThen(() => {
          assert.equal(currentPath(), 'poll.evaluation');
          pollHasUsersCount(assert, 2, 'user is added to user selections table');
          pollHasUser(assert, 'Peter Müller', [t('answerTypes.yes.label'), t('answerTypes.yes.label')]);
        });
      });
    });
  });
});

test('participate in a poll using freetext', function(assert) {
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let poll = server.create('poll', {
    answerType: 'FreeText',
    answers: [],
    encryptionKey
  });

  visit(`/poll/${poll.id}?encryptionKey=${encryptionKey}`).then(function() {
    assert.equal(currentPath(), 'poll.participation');
    pollParticipate('Max Manus', ['answer 1', 'answer 2']);

    andThen(function() {
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUsersCount(assert, 1, 'user is added to user selections table');
      pollHasUser(assert, 'Max Manus', ['answer 1', 'answer 2']);
    });
  });
});

test('participate in a poll which does not force an answer to all options', function(assert) {
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let poll = server.create('poll', {
    encryptionKey,
    forceAnswer: false
  });

  visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`).then(function() {
    assert.equal(currentPath(), 'poll.participation');
    pollParticipate('Karl Käfer', ['yes', null]);

    andThen(function() {
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUsersCount(assert, 1, 'user is added to user selections table');
      pollHasUser(assert, 'Karl Käfer', [t('answerTypes.yes.label'), '']);
    });
  });
});

test('participate in a poll which allows anonymous participation', function(assert) {
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let poll = server.create('poll', {
    anonymousUser: true,
    encryptionKey
  });

  visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`).then(function() {
    assert.equal(currentPath(), 'poll.participation');
    pollParticipate(null, ['yes', 'no']);

    andThen(function() {
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUsersCount(assert, 1, 'user is added to user selections table');
      pollHasUser(assert, '', [t('answerTypes.yes.label'), t('answerTypes.no.label')]);
    });
  });
});

test('network connectivity errors', function(assert) {
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let poll = server.create('poll', {
    encryptionKey
  });

  server.post('/users', undefined, 503);

  visit(`/poll/${poll.id}/participation?encryptionKey=${encryptionKey}`).then(function() {
    assert.equal(currentPath(), 'poll.participation');
    pollParticipate('foo bar', ['yes', 'no']);

    andThen(() => {
      assert.ok(
        find('#modal-saving-failed-modal').is(':visible'),
        'user gets notified that saving failed'
      );

      server.post('/users');
      click('#modal-saving-failed-modal button');

      andThen(() => {
        assert.notOk(
          find('#modal-saving-failed-modal').is(':visible'),
          'modal is hidden after saving was successful'
        );
        assert.equal(currentPath(), 'poll.evaluation');
        pollHasUsersCount(assert, 1, 'user is added to user selections table');
        pollHasUser(assert, 'foo bar', [t('answerTypes.yes.label'), t('answerTypes.no.label')]);
      });
    });
  });
});
