import Ember from "ember";
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
/* global moment */
var App;

module('Integration - create poll', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, App.destroy);
  }
});

test("create a poll with description", function(assert) {
  assert.expect(8);
  
  visit('/create').then(function() {
    click('.button-next');
    
    andThen(function(){
      assert.equal(currentPath(), 'create.meta');
      
      fillIn('input[name="title"]', 'default poll');
      fillIn('textarea', 'a sample description');
      click('.button-next');
      
      andThen(function(){
        assert.equal(currentPath(), 'create.options');
        
        // select days in calendar
        // today and last day on current calendar page
        click('.datepicker tbody td.today');
        click('.datepicker tbody tr:last-child td:last-child');
        
        click('.button-next');
        
        andThen(function(){
          assert.equal(currentPath(), 'create.settings');
          
          click('.button-next');
          
          andThen(function(){
            assert.equal(currentPath(), 'poll');
            
            assert.equal(find('.meta-data .title').text(), 'default poll');
            assert.equal(find('.meta-data .description').text(), 'a sample description');
            
            // check that there are two options
            // head of user selections table is options + leading column (user names) + last column (buttons)
            assert.equal(find('.user-selections-table thead tr th').length, 4);
            
            // check that current day is first option
            assert.equal(find(
              Ember.$('.user-selections-table thead tr th')[1]).text().trim(),
              moment().format(moment.localeData().longDateFormat( 'LLLL' ).replace('LT' , '')).trim()
            );
          });
        });
      });
    });
  });
});
