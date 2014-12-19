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

test("create a poll for answering a question", function() {
  expect(12);
  
  visit('/create').then(function() {
    // select poll type answer a question
    fillIn('select[name="pollType"]', 'MakeAPoll');
    click('.button-next');
    
    andThen(function(){
      equal(currentPath(), 'create.meta');
      
      fillIn('input[name="title"]', 'default poll');
      click('.button-next');
      
      andThen(function(){
        equal(currentPath(), 'create.options');
        
        // fill in default two option input fields
        fillIn(find('input')[0], 'option a');
        fillIn(find('input')[1], 'option b');
        
        // add another option input field
        equal(find('input').length, 2);
        click('.button-more-options');
        andThen(function(){
          equal(find('input').length, 3);
          fillIn(find('input')[2], 'option c');

          click('.button-next');

          andThen(function(){
            equal(currentPath(), 'create.settings');

            click('.button-next');

            andThen(function(){
              equal(currentPath(), 'poll');

              equal(find('.meta-data .title').text(), 'default poll');
              equal(find('.meta-data .description').text(), '');

              // check that all 3 options are there
              // head of user selections table is options + leading column (user names) + last column (buttons)
              equal(find('.user-selections-table thead tr th').length, 5);

              // check options are correct
              equal(find(find('.user-selections-table thead tr th')[1]).text().trim(), 'option a');
              equal(find(find('.user-selections-table thead tr th')[2]).text().trim(), 'option b');
              equal(find(find('.user-selections-table thead tr th')[3]).text().trim(), 'option c');
            });
          });
        });
      });
    });
  });
});