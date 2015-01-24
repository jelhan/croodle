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
  expect(1);

  visit('/poll/defaultpoll?encryptionKey=0123456789abcdefghijklmnopqrstuvwxyzABC').then(function() {
    fillIn('.newUserName input', 'Max Meier');
    
    Ember.$('.newUser td').each(function(i, e) {
      console.log($('input[type=radio]'), $(e));
      if(i % 2 === 0) {
        $('input[type=radio]', $(e))[0].attr("checked","checked");
      }
      else {
        $('input[type=radio]', $(e))[1].attr("checked","checked");
      }
    });
    
    var userSelecectionsTableLengthBefore = Ember.$('.user-selections-table').length;
    click('.newUser button');
    
    andThen(function(){
      equal(Ember.$('.user-selections-table').length, userSelecectionsTableLengthBefore + 1);
    });
  });
});
