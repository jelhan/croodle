import Ember from "ember";
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import getPolls from '../helpers/get-polls';
import postUsers from '../helpers/post-users';
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
    return getPolls(
      {
        id: id
      }, encryptionKey
    );
  });
  server.post('/users',
    function (request) {
      return postUsers(request.requestBody, 1);
    }
  );

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey).then(function() {
    fillIn('.newUserName input', 'Max Meier');
    
    Ember.$('.newUser td').each(function(i, e) {
      $('.newUserSelection').each(function(i, e){
        if(i % 2 === 0) {
          click( $('input[type=radio]', e)[0] );
        }
        else {
          click( $('input[type=radio]', e)[1] );
        }
      });
    });

    var userSelecectionsTableLengthBefore = Ember.$('.user').length;
    click('.newUser button');
   
    assert.equal(Ember.$('.has-error').length, 0, "there is no validation error");
 
    andThen(function(){
      assert.equal( find('.user').length, userSelecectionsTableLengthBefore + 1, "user is added to user selections table");
    });
  });
});

test("participate in a poll using freetext", function(assert) {
  var id = 'test2',
      encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  server.get('/polls/' + id,
    function () {
      return getPolls(
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
      return postUsers(request.requestBody, 1);
    }
  );

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey).then(function() {
    fillIn('.newUserName input', 'Max Manus');
    
    fillIn('.newUserSelection input:eq(0)', 'answer 1');
    fillIn('.newUserSelection input:eq(1)', 'answer 2');
    
    var userSelecectionsTableLengthBefore = Ember.$('.user').length;
    click('.newUser button');
   
    assert.equal(Ember.$('.has-error').length, 0, "there is no validation error");
 
    andThen(function(){
      assert.equal( find('.user').length, userSelecectionsTableLengthBefore + 1, "user is added to user selections table");
      assert.equal( find('.user:last td:nth-child(1)').text(), 'Max Manus', "user name is correct");
      assert.equal( find('.user:last td:nth-child(2)').text().trim(), 'answer 1', "answer 1 is correct");
      assert.equal( find('.user:last td:nth-child(3)').text().trim(), 'answer 2', "answer 2 is correct");
    });
  });
});

test("participate in a poll which doesn't force an answer to all options", function(assert) {
  var id = 'test',
      encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  server.get('/polls/' + id,
    function () {
      return getPolls(
        {
          id: id,
          forceAnswer: false
        }, encryptionKey
      );
    }
  );
  server.post('/users',
    function (request) {
      return postUsers(request.requestBody, 1);
    }
  );

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey).then(function() {
    fillIn('.newUserName input', 'Karl Käfer');
    
    click('.newUserSelection:eq(0) input[type=radio]:eq(0)');
    
    var userSelecectionsTableLengthBefore = Ember.$('.user').length;
    click('.newUser button');
   
    assert.equal(Ember.$('.has-error').length, 0, "there is no validation error");
 
    andThen(function(){
      assert.equal( find('.user').length, userSelecectionsTableLengthBefore + 1, "user is added to user selections table");
      assert.equal( find('.user:last td:nth-child(1)').text(), 'Karl Käfer', "user name is correct");
      assert.notEqual( find('.user:last td:nth-child(2)').text().trim(), '', "option 1 is answered");
      assert.equal( find('.user:last td:nth-child(3)').text().trim(), '', "option 2 is not answered");
    });
  });
});

test("participate in a poll which allows anonymous participation", function(assert) {
  var id = 'test',
      encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  server.get('/polls/' + id,
    function () {
      return getPolls(
        {
          id: id,
          anonymousUser: true
        }, encryptionKey
      );
    }
  );
  server.post('/users',
    function (request) {
      return postUsers(request.requestBody, 1);
    }
  );

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey).then(function() {
    
    Ember.$('.newUser td').each(function(i, e) {
      $('.newUserSelection').each(function(i, e){
        if(i % 2 === 0) {
          click( $('input[type=radio]', e)[0] );
        }
        else {
          click( $('input[type=radio]', e)[1] );
        }
      });
    });

    var userSelecectionsTableLengthBefore = Ember.$('.user').length;
    click('.newUser button');
   
    assert.equal(Ember.$('.has-error').length, 0, "there is no validation error");
 
    andThen(function(){
      assert.equal( find('.user').length, userSelecectionsTableLengthBefore + 1, "user is added to user selections table");
      assert.equal( find('.user:last td:nth-child(1)').text(), '', "user name is empty");
    });
  });
});
