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

test("create a default poll", function(assert) {
  assert.expect(8);
  
  visit('/create').then(function() {
    click('.button-next');
    
    andThen(function(){
      assert.equal(currentPath(), 'create.meta');
      
      fillIn('input[name="model.title"]', 'default poll');
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
            assert.equal(find('.meta-data .description').text(), '');
            
            // check that there are two options
            // head of user selections table is options + leading column (user names) + last column (buttons)
            assert.equal(find('.user-selections-table thead tr th').length, 4);
            
            // check that current day is first option
            assert.equal(
              find(find('.user-selections-table thead tr th')[1]).text().trim(),
              moment().format(moment.localeData().longDateFormat( 'LLLL' ).replace('LT' , '')).trim()
            );
          });
        });
      });
    });
  });
});

test("create a poll for answering a question", function(assert) {
  assert.expect(12);
  
  visit('/create').then(function() {
    // select poll type answer a question
    fillIn('select[name="pollType"]', 'MakeAPoll');
    click('.button-next');
    
    andThen(function(){
      assert.equal(currentPath(), 'create.meta');
      
      fillIn('input[name="model.title"]', 'default poll');
      click('.button-next');
      
      andThen(function(){
        assert.equal(currentPath(), 'create.options');
        
        // fill in default two option input fields
        fillIn(find('input')[0], 'option a');
        fillIn(find('input')[1], 'option b');
        
        // add another option input field
        assert.equal(find('input').length, 2);
        click('.button-more-options');
        andThen(function(){
          assert.equal(find('input').length, 3);
          fillIn(find('input')[2], 'option c');

          click('.button-next');

          andThen(function(){
            assert.equal(currentPath(), 'create.settings');

            click('.button-next');

            andThen(function(){
              assert.equal(currentPath(), 'poll');

              assert.equal(find('.meta-data .title').text(), 'default poll');
              assert.equal(find('.meta-data .description').text(), '');

              // check that all 3 options are there
              // head of user selections table is options + leading column (user names) + last column (buttons)
              assert.equal(find('.user-selections-table thead tr th').length, 5);

              // check options are correct
              assert.equal(find(find('.user-selections-table thead tr th')[1]).text().trim(), 'option a');
              assert.equal(find(find('.user-selections-table thead tr th')[2]).text().trim(), 'option b');
              assert.equal(find(find('.user-selections-table thead tr th')[3]).text().trim(), 'option c');
            });
          });
        });
      });
    });
  });
});

test("create a poll with description", function(assert) {
  assert.expect(8);
  
  visit('/create').then(function() {
    click('.button-next');
    
    andThen(function(){
      assert.equal(currentPath(), 'create.meta');
      
      fillIn('input[name="model.title"]', 'default poll');
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
