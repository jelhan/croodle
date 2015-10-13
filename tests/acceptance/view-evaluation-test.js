import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'croodle/tests/helpers/start-app';
import Pretender from 'pretender';
import serverGetPolls from '../helpers/server-get-polls';
import formattedDateHelper from 'croodle/helpers/formatted-date';
/* jshint proto: true */
/* global moment */

var application, server;

module('Acceptance | view evaluation', {
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

test('evaluation is not present for poll without participants', function(assert) {
  var id = 'test',
      encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  server.get('/polls/' + id, function() {
    return serverGetPolls(
      {
        id: id,
        users: []
      }, encryptionKey
    );
  });

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey);

  andThen(function() {
    assert.equal(find('.evaluation').length, 0);
  });
});

test('evaluation is correct', function(assert) {
  var id = 'test',
      encryptionKey = 'abcdefghijklmnopqrstuvwxyz0123456789';
  
  server.get('/polls/' + id, function() {
    return serverGetPolls(
      {
        id: id,
        answers: [
          {
            type: "yes",
            labelTranslation: "answerTypes.yes.label",
            icon: "glyphicon glyphicon-thumbs-up",
            label: "Yes"
          },
          {
            type: "no",
            labelTranslation: "answerTypes.no.label",
            icon: "glyphicon glyphicon-thumbs-down",
            label: "No"
          }
        ],
        options: [
          {title: '2015-12-12'},
          {title: '2016-01-01'}
        ],
        users: [
          {
            id: id + '_0',
            name: 'Maximilian',
            selections: [
              {
                type: "yes",
                labelTranslation: "answerTypes.yes.label",
                icon: "glyphicon glyphicon-thumbs-up",
                label: "Yes"
              },
              {
                type: "yes",
                labelTranslation: "answerTypes.yes.label",
                icon: "glyphicon glyphicon-thumbs-up",
                label: "Yes"
              }
            ],
            creationDate: "2015-01-01T00:00:00.000Z"
          },
          {
            id: id + '_1',
            name: 'Peter',
            selections: [
              {
                type: "yes",
                labelTranslation: "answerTypes.yes.label",
                icon: "glyphicon glyphicon-thumbs-up",
                label: "Yes"
              },
              {
                id: "no",
                labelTranslation: "answerTypes.yes.label",
                icon: "glyphicon glyphicon-thumbs-up",
                label: "Yes"
              }
            ],
            creationDate: "2015-08-01T00:00:00.000Z"
          }
        ]
      }, encryptionKey
    );
  });

  visit('/poll/' + id + '?encryptionKey=' + encryptionKey);

  andThen(function() {
    assert.equal(find('.evaluation').length, 1, 'evaluation is present');
    assert.notEqual(
      find('.participants').text().indexOf(' 2 '),
      -1,
      'participants are counted correctly'
    );
    assert.equal(find('.best-options strong').text().trim(), formattedDateHelper('2015-12-12'), 'options are evaluated correctly');
    assert.notEqual(
      find('.last-participation').text().indexOf(
        moment('2015-08-01T00:00:00.000Z').from()
      ),
      -1,
      'last participation is evaluated correctly'
    );
  });
});
