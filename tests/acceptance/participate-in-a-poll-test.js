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
    assert.equal(Ember.$('.has-error').length, 0, "there is no validation error");

    andThen(function(){
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUsersCount(assert, 1, "user is added to user selections table");
      pollHasUser(assert, 'Max Meiner', [Ember.I18n.t('answerTypes.yes.label'), Ember.I18n.t('answerTypes.no.label')]);
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
    assert.equal(find('.has-error').length, 0, "there is no validation error");

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
    assert.equal(Ember.$('.has-error').length, 0, "there is no validation error");

    andThen(function(){
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUsersCount(assert, 1, "user is added to user selections table");
      pollHasUser(assert, "Karl Käfer", [Ember.I18n.t("answerTypes.yes.label"), ""]);
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
    assert.equal(Ember.$('.has-error').length, 0, "there is no validation error");

    andThen(function(){
      assert.equal(currentPath(), 'poll.evaluation');
      pollHasUsersCount(assert, 1, "user is added to user selections table");
      pollHasUser(assert, "", [Ember.I18n.t("answerTypes.yes.label"), Ember.I18n.t("answerTypes.no.label")]);
    });
  });
});
