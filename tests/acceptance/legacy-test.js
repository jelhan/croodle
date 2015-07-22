import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'croodle/tests/helpers/start-app';
import Pretender from 'pretender';
import getPoll from 'croodle/tests/helpers/get-poll';
import moment from 'moment';
/* global Croodle */
/* jshint proto: true */

var application, server;

module('Acceptance | legacy', {
  beforeEach: function() {
    application = startApp();

    server = new Pretender();
    Croodle.__container__.lookup('adapter:application').__proto__.namespace = '';
  },

  afterEach: function() {
    server.shutdown();
    
    Ember.run(application, 'destroy');
  }
});

test('a poll created in v0.2.4 still works and shows correct date', function(assert) {
  var id = 'legacy-v0-2-4-date',
      encryptionKey = "abcdefghijklmnopqrstuvwxyz0123456789";

  server.get('/polls/' + id,
    function () {
      return [
        200,
        {"Content-Type": "application/json"},
        getPoll(
          {
            id: id,
            options: [
              {
                title: '2015-01-01T23:00:00Z'
              }, {
                title: '2015-01-02T23:00:00Z'
              }
            ]
          }, encryptionKey
        )
      ];
    }
  );
  
  visit('/poll/' + id + '?encryptionKey=' + encryptionKey);

  andThen(function() {
    assert.equal(currentPath(), 'poll', 'should be able to open test in old format');
    assert.equal(
      find('.user-selections-table thead th:nth-child(2)').text().trim(),
      moment('2015-01-02').format(
        moment.localeData().longDateFormat( 'LLLL' ).replace('LT' , '')
      ).trim(),
      'correct day is shown'
    );
    assert.equal(
      find('.user-selections-table thead th:nth-child(3)').text().trim(),
      moment('2015-01-03').format(
        moment.localeData().longDateFormat( 'LLLL' ).replace('LT' , '')
      ).trim(),
      'correct day is shown'
    );
  });
});
