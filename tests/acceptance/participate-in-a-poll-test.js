import Ember from "ember";
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import serverGetPolls from '../helpers/server-get-polls';
import serverPostUsers from '../helpers/server-post-users';
/* jshint proto: true */

var application, server;

module('Acceptance | participate in a poll', {
  beforeEach: function() {
    application = startApp();
    application.__container__.lookup('adapter:application').__proto__.namespace = '';

    server = new Pretender();
  },

  afterEach: function() {
    server.shutdown();

    Ember.run(application, 'destroy');
  }
});

test("participate in a default poll", function(assert) {
  var id = 'test',
      encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get('/polls/' + id, function() {
    return serverGetPolls(
      {
        id: id
      }, encryptionKey
    );
  });
  server.post('/users',
    function (request) {
      return serverPostUsers(request.requestBody, 1);
    }
  );

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey).then(function() {
    assert.equal(currentPath(), 'poll.participation');
    pollParticipate('Max Meiner', ['yes', 'no']);

    andThen(function(){
      assert.equal(currentPath(), 'poll.evaluation');
      assert.equal(
        currentURL().split("?")[1],
        'encryptionKey=' + encryptionKey,
        'encryption key is part of query params'
      );
      pollHasUsersCount(assert, 1, "user is added to user selections table");
      pollHasUser(assert, 'Max Meiner', [t('answerTypes.yes.label'), t('answerTypes.no.label')]);
    });
  });
});

test("participate in a poll using freetext", function(assert) {
  var id = 'test2',
      encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get('/polls/' + id,
    function () {
      return serverGetPolls(
        {
          id: id,
          answerType: 'FreeText',
          answers: []
        }, encryptionKey
      );
    }
  );
  server.post('/users',
    function (request) {
      return serverPostUsers(request.requestBody, 1);
    }
  );

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey).then(function() {
    assert.equal(currentPath(), 'poll.participation');
    pollParticipate('Max Manus', ['answer 1', 'answer 2']);

    andThen(function(){
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUsersCount(assert, 1, "user is added to user selections table");
      pollHasUser(assert, 'Max Manus', ['answer 1', 'answer 2']);
    });
  });
});

test("participate in a poll which doesn't force an answer to all options", function(assert) {
  var id = 'test',
      encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get('/polls/' + id,
    function () {
      return serverGetPolls(
        {
          id: id,
          forceAnswer: false
        }, encryptionKey
      );
    }
  );
  server.post('/users',
    function (request) {
      return serverPostUsers(request.requestBody, 1);
    }
  );

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey).then(function() {
    assert.equal(currentPath(), 'poll.participation');
    pollParticipate('Karl Käfer', ['yes', null]);

    andThen(function(){
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUsersCount(assert, 1, "user is added to user selections table");
      pollHasUser(assert, "Karl Käfer", [t("answerTypes.yes.label"), ""]);
    });
  });
});

test("participate in a poll which allows anonymous participation", function(assert) {
  var id = 'test',
      encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';

  server.get('/polls/' + id,
    function () {
      return serverGetPolls(
        {
          id: id,
          anonymousUser: true
        }, encryptionKey
      );
    }
  );
  server.post('/users',
    function (request) {
      return serverPostUsers(request.requestBody, 1);
    }
  );

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey).then(function() {
    assert.equal(currentPath(), 'poll.participation');
    pollParticipate(null, ['yes', 'no']);

    andThen(function(){
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUsersCount(assert, 1, "user is added to user selections table");
      pollHasUser(assert, "", [("answerTypes.yes.label"), ("answerTypes.no.label")]);
    });
  });
});
