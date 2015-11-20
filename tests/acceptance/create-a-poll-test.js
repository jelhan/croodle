import Ember from "ember";
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import serverPostPolls from '../helpers/server-post-polls';
/* global moment */
/* jshint proto: true */

var application, server;

module('Acceptance | create a poll', {
  beforeEach: function() {
    application = startApp();
    application.__container__.lookup('adapter:application').__proto__.namespace = '';

    server = new Pretender();

    var lastCreatedPoll = {};

    server.post('/polls',
      function (request) {
        var ret = serverPostPolls(request.requestBody, 'test');
        lastCreatedPoll = ret[2];
        return ret;
      }
    );

    server.get('/polls/test',
      function () {
        return [
          200,
          {"Content-Type": "application/json"},
          lastCreatedPoll
        ];
      }
    );
  },
  afterEach: function() {
    server.shutdown();

    Ember.run(application, 'destroy');
  }
});

test("create a default poll", function(assert) {
  var dates =
    [
      moment().add(1, 'day'),
      moment().add(1, 'week')
    ];

  var formattedDates =
    dates.map((date) => {
      return date.format(
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
      );
    });

  visit('/create').then(function() {
    click('button[type="submit"]');

    andThen(function(){
      assert.equal(currentPath(), 'create.meta');

      fillIn('.title input', 'default poll');
      click('button[type="submit"]');

      andThen(function(){
        assert.equal(currentPath(), 'create.options');

        selectDates(
          '#datepicker .ember-view',
          dates
        );

        click('button[type="submit"]');

        andThen(function(){
          assert.equal(currentPath(), 'create.settings');

          click('button[type="submit"]');

          andThen(function(){
            assert.equal(currentPath(), 'poll.participation');

            pollTitleEqual(assert, 'default poll');
            pollDescriptionEqual(assert, '');
            pollHasOptions(assert, formattedDates);
            pollHasAnswers(assert, [
              t('answerTypes.yes.label'),
              t('answerTypes.no.label')
            ]);
            pollHasUsersCount(assert, 0);
          });
        });
      });
    });
  });
});

test("create a poll for answering a question", function(assert) {
  visit('/create').then(function() {
    // select poll type answer a question
    fillIn('.poll-type select', 'MakeAPoll');
    click('button[type="submit"]');

    andThen(function(){
      assert.equal(currentPath(), 'create.meta');

      fillIn('.title input', 'default poll');
      click('button[type="submit"]');

      andThen(function(){
        assert.equal(currentPath(), 'create.options');
        assert.equal(
          find('input').length,
          2,
          'there are two input fields as default'
        );

        // fill in default two option input fields
        fillIn(find('input')[0], 'option a');
        fillIn(find('input')[1], 'option c');

        // add another option input field
        click('button.add', find('.form-group')[0]);
        andThen(function(){
          assert.equal(
            find('input').length,
            3,
            'option was added'
          );
          fillIn(find('input')[1], 'option b');

          click('button.add', find('.form-group')[2]);
          andThen(function() {
            assert.equal(
              find('input').length,
              4,
              'option was added'
            );
            fillIn(find('input')[3], 'to be deleted');
            click('button.delete', find('.form-group')[3]);

            andThen(function() {
              assert.equal(
                find('input').length,
                3,
                'option got deleted'
              );

              click('button[type="submit"]');

              andThen(function(){
                assert.equal(currentPath(), 'create.settings');

                click('button[type="submit"]');

                andThen(function(){
                  assert.equal(currentPath(), 'poll.participation');

                  pollTitleEqual(assert, 'default poll');
                  pollDescriptionEqual(assert, '');
                  pollHasOptions(assert, ['option a', 'option b', 'option c']);
                  pollHasUsersCount(assert, 0);
                });
              });
            });
          });
        });
      });
    });
  });
});

test("create a poll with description", function(assert) {
  var dates =
    [
      moment().add(1, 'day'),
      moment().add(1, 'week')
    ];

  var formattedDates =
    dates.map((date) => {
      return date.format(
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
      );
    });

  visit('/create').then(function() {
    click('button[type="submit"]');

    andThen(function(){
      assert.equal(currentPath(), 'create.meta');

      fillIn('.title input', 'default poll');
      fillIn('.description textarea', 'a sample description');
      click('button[type="submit"]');

      andThen(function(){
        assert.equal(currentPath(), 'create.options');

        selectDates('#datepicker .ember-view', dates);

        click('button[type="submit"]');

        andThen(function(){
          assert.equal(currentPath(), 'create.settings');

          click('button[type="submit"]');

          andThen(function(){
            assert.equal(currentPath(), 'poll.participation');

            pollTitleEqual(assert, 'default poll');
            pollDescriptionEqual(assert, 'a sample description');
            pollHasOptions(assert, formattedDates);
            pollHasUsersCount(assert, 0);
          });
        });
      });
    });
  });
});
