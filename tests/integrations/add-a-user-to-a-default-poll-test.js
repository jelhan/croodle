import Ember from "ember";
import { test } from 'ember-qunit';
import startApp from '../helpers/start-app';
/* global moment */
var App;

module('Integration - create poll', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, App.destroy);
  }
});

test("add a user to a default poll", function() {
  expect(2);

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
   
    equal(Ember.$('.has-error').length, 0, "there is no validation error");
 
    andThen(function(){
      equal( find('.user').length, userSelecectionsTableLengthBefore + 1, "user is added to user selections table");
    });
  });
});
