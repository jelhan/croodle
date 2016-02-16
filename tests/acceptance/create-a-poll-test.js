import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import Pretender from 'pretender';
import serverPostPolls from '../helpers/server-post-polls';
import moment from 'moment';
/* jshint proto: true */

let application, server;

module('Acceptance | create a poll', {
  beforeEach() {
    let lastCreatedPoll = {};
    const pollId = Math.random().toString(36).substr(2, 10);

    application = startApp();
    application.__container__.lookup('adapter:application').__proto__.namespace = '';

    server = new Pretender();

    server.post('/polls',
      function(request) {
        let ret = serverPostPolls(request.requestBody, pollId);
        lastCreatedPoll = ret[2];
        return ret;
      }
    );

    server.get(`/polls/${pollId}`,
      function() {
        return [
          200,
          { 'Content-Type': 'application/json' },
          lastCreatedPoll
        ];
      }
    );

    moment.locale(
      application.__container__.lookup('service:i18n').get('locale')
    );
  },
  afterEach() {
    server.shutdown();

    Ember.run(application, 'destroy');
  }
});

test('create a default poll', function(assert) {
  visit('/create').then(function() {
    click('button[type="submit"]');

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      fillIn('.title input', 'default poll');
      click('button[type="submit"]');

      andThen(function() {
        assert.equal(currentPath(), 'create.options');

        let dates =
          [
            moment().add(1, 'day'),
            moment().add(1, 'week')
          ];

        selectDates(
          '#datepicker .ember-view',
          dates
        );

        click('button[type="submit"]');

        andThen(function() {
          assert.equal(currentPath(), 'create.options-datetime');
          click('button[type="submit"]');

          andThen(() => {
            assert.equal(currentPath(), 'create.settings');

            click('button[type="submit"]');

            andThen(function() {
              assert.equal(currentPath(), 'poll.participation');
              pollHasValidURL(assert);

              pollTitleEqual(assert, 'default poll');
              pollDescriptionEqual(assert, '');
              pollHasOptions(
                assert,
                dates.map((date) => {
                  return date.format(
                    moment.localeData().longDateFormat('LLLL')
                      .replace(
                        moment.localeData().longDateFormat('LT'), '')
                      .trim()
                    );
                })
              );
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
});

test('create a poll for answering a question', function(assert) {
  visit('/create').then(function() {
    // select poll type answer a question
    fillIn('.poll-type select', 'MakeAPoll');
    click('button[type="submit"]');

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      fillIn('.title input', 'default poll');
      click('button[type="submit"]');

      andThen(function() {
        assert.equal(currentPath(), 'create.options');
        expectComponent('create-options-text');

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
        andThen(function() {
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

              andThen(function() {
                assert.equal(currentPath(), 'create.settings');

                click('button[type="submit"]');

                andThen(function() {
                  assert.equal(currentPath(), 'poll.participation');
                  pollHasValidURL(assert);

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

test('create a poll with description', function(assert) {
  let dates =
    [
      moment().add(1, 'day'),
      moment().add(1, 'week')
    ];

  let formattedDates =
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

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      fillIn('.title input', 'default poll');
      fillIn('.description textarea', 'a sample description');
      click('button[type="submit"]');

      andThen(function() {
        assert.equal(currentPath(), 'create.options');

        selectDates('#datepicker .ember-view', dates);

        click('button[type="submit"]');

        andThen(function() {
          assert.equal(currentPath(), 'create.options-datetime');
          click('button[type="submit"]');

          andThen(function() {
            assert.equal(currentPath(), 'create.settings');

            click('button[type="submit"]');

            andThen(function() {
              assert.equal(currentPath(), 'poll.participation');
              pollHasValidURL(assert);

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
});
