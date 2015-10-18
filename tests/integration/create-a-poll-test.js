import Ember from "ember";
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import formattedDateHelper from 'croodle/helpers/formatted-date';
/* global moment */
/* jshint proto: true */

var application, server;

module('Integration', {
  beforeEach: function() {
    application = startApp();
  },
  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test("create a default poll and participate", function(assert) { 
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
            
            pollTitleEqual(assert, 'default poll');
            pollDescriptionEqual(assert, '');
             
            assert.equal(
              find('.user-selections-table thead tr th').length,
              4, // head of user selections table is options + leading column (user names) + last column (buttons)
              'there are two options provided'
            );
            
            assert.equal(
              find(find('.user-selections-table thead tr th')[1]).text().trim(),
              formattedDateHelper(new Date()),
              'today is the first selected option'
            );

            pollHasUsersCount(assert, 0);
            pollParticipate('Max Hoelz', ['no', 'no']);
            andThen(function(){
              pollHasUsersCount(assert, 1);
              pollHasUser(assert, 'Max Hoelz', [Ember.I18n.t('answerTypes.no.label'), Ember.I18n.t('answerTypes.no.label')]);
            });
          });
        });
      });
    });
  });
});
