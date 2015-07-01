import Ember from "ember";
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
var App;

module('Integration - participate in a poll', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, App.destroy);
  }
});

test("add a user to a default poll", function(assert) {
  assert.expect(2);

  visit('/poll/defaultpoll?encryptionKey=0123456789abcdefghijklmnopqrstuvwxyzABC').then(function() {
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
  assert.expect(6);

  visit('/poll/freetext?encryptionKey=JU8dqNCJivwqfRpP28M5gpcqK0BsfgjUkDoXvTTX').then(function() {
    fillIn('.newUserName input', 'Max Manus');
    
    fillIn('.newUserSelection input:eq(0)', 'answer 1');
    fillIn('.newUserSelection input:eq(1)', 'answer 2');
    fillIn('.newUserSelection input:eq(2)', 'answer 3');
    
    var userSelecectionsTableLengthBefore = Ember.$('.user').length;
    click('.newUser button');
   
    assert.equal(Ember.$('.has-error').length, 0, "there is no validation error");
 
    andThen(function(){
      assert.equal( find('.user').length, userSelecectionsTableLengthBefore + 1, "user is added to user selections table");
      assert.equal( find('.user:last td:nth-child(1)').text(), 'Max Manus', "user name is correct");
      assert.equal( find('.user:last td:nth-child(2)').text().trim(), 'answer 1', "answer 1 is correct");
      assert.equal( find('.user:last td:nth-child(3)').text().trim(), 'answer 2', "answer 2 is correct");
      assert.equal( find('.user:last td:nth-child(4)').text().trim(), 'answer 3', "answer 3 is correct");
    });
  });
});

test("participate in a poll which doesn't force an answer to all options", function(assert) {
  assert.expect(6);

  visit('/poll/donotforceanswer?encryptionKey=Y3avHBG5otzq2hZnMzEkpI6Nh9KI71rEpF3VlbHF').then(function() {
    fillIn('.newUserName input', 'Karl Käfer');
    
    click('.newUserSelection:eq(0) input[type=radio]:eq(0)');
    click('.newUserSelection:eq(2) input[type=radio]:eq(1)');
    
    var userSelecectionsTableLengthBefore = Ember.$('.user').length;
    click('.newUser button');
   
    assert.equal(Ember.$('.has-error').length, 0, "there is no validation error");
 
    andThen(function(){
      assert.equal( find('.user').length, userSelecectionsTableLengthBefore + 1, "user is added to user selections table");
      assert.equal( find('.user:last td:nth-child(1)').text(), 'Karl Käfer', "user name is correct");
      assert.notEqual( find('.user:last td:nth-child(2)').text().trim(), '', "option 1 is answered");
      assert.equal( find('.user:last td:nth-child(3)').text().trim(), '', "option 2 is not answered");
      assert.notEqual( find('.user:last td:nth-child(4)').text().trim(), '', "option 3 is answered");
    });
  });
});

test("add a user to a default poll", function(assert) {
  assert.expect(3);

  visit('/poll/anonymousparticipation?encryptionKey=uuw9A7SAdhl6Ax2E0AeVvsZi9ssGYZUXZo5h9FZo').then(function() {
    
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
