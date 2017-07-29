import Ember from 'ember';
import jQuery from 'jquery';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import serverGetPolls from '../helpers/server-get-polls';
import serverPostUsers from '../helpers/server-post-users';
/* jshint proto: true */

const { run } = Ember;

let application, server;

module('Acceptance | participate in a poll', {
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

test('participate in a default poll', function(assert) {
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let nextUserId = 1;

  server.get(`/polls/${id}`, function() {
    return serverGetPolls(
      {
        id
      }, encryptionKey
    );
  });
  server.post('/users',
    function(request) {
      let userId = nextUserId;
      nextUserId++;
      return serverPostUsers(request.requestBody, userId);
    }
  );

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`).then(function() {
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
  let id = 'test2';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get(`/polls/${id}`,
    function() {
      return serverGetPolls(
        {
          id,
          answerType: 'FreeText',
          answers: []
        }, encryptionKey
      );
    }
  );
  server.post('/users',
    function(request) {
      return serverPostUsers(request.requestBody, 1);
    }
  );

  visit(`/poll/${id}?encryptionKey=${encryptionKey}`).then(function() {
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
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get(`/polls/${id}`,
    function() {
      return serverGetPolls(
        {
          id,
          forceAnswer: false
        }, encryptionKey
      );
    }
  );
  server.post('/users',
    function(request) {
      return serverPostUsers(request.requestBody, 1);
    }
  );

  visit(`/poll/${id}/participation?encryptionKey=${encryptionKey}`).then(function() {
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
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get(`/polls/${id}`,
    function() {
      return serverGetPolls(
        {
          id,
          anonymousUser: true
        }, encryptionKey
      );
    }
  );
  server.post('/users',
    function(request) {
      return serverPostUsers(request.requestBody, 1);
    }
  );

  visit(`/poll/${id}/participation?encryptionKey=${encryptionKey}`).then(function() {
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
  let id = 'test';
  let encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get(`/polls/${id}`,
    function() {
      return serverGetPolls(
        {
          id,
          anonymousUser: true
        }, encryptionKey
      );
    }
  );
  server.post('/users',
    function() {
      return [503]; // server temporary not available
    }
  );

  visit(`/poll/${id}/participation?encryptionKey=${encryptionKey}`).then(function() {
    assert.equal(currentPath(), 'poll.participation');
    pollParticipate('foo bar', ['yes', 'no']);

    andThen(() => {
      assert.ok(
        find('#modal-saving-failed-modal').is(':visible'),
        'user gets notified that saving failed'
      );

      server.post('/users',
        function(request) {
          return serverPostUsers(request.requestBody, 1);
        }
      );
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
