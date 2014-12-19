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

test("create a poll with description", function() {
  expect(8);
  
  visit('/create').then(function() {
    click('.button-next');
    
    andThen(function(){
      equal(currentPath(), 'create.meta');
      
      fillIn('input[name="title"]', 'default poll');
      fillIn('textarea', 'a sample description');
      click('.button-next');
      
      andThen(function(){
        equal(currentPath(), 'create.options');
        
        // select days in calendar
        // today and last day on current calendar page
        click('.datepicker tbody td.today');
        click('.datepicker tbody tr:last-child td:last-child');
        
        click('.button-next');
        
        andThen(function(){
          equal(currentPath(), 'create.settings');
          
          click('.button-next');
          
          andThen(function(){
            equal(currentPath(), 'poll');
            
            equal(find('.meta-data .title').text(), 'default poll');
            equal(find('.meta-data .description').text(), 'a sample description');
            
            // check that there are two options
            // head of user selections table is options + leading column (user names) + last column (buttons)
            equal(find('.user-selections-table thead tr th').length, 4);
            
            // check that current day is first option
            equal(find(
              Ember.$('.user-selections-table thead tr th')[1]).text().trim(),
              moment().format(moment.localeData().longDateFormat( 'LLLL' ).replace('LT' , '')).trim()
            );
          });
        });
      });
    });
  });
});