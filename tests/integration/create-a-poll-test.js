import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import moment from 'moment';
import pageCreateIndex from 'croodle/tests/pages/create/index';
import pageCreateMeta from 'croodle/tests/pages/create/meta';
import pageCreateOptions from 'croodle/tests/pages/create/options';
import pageCreateOptionsDatetime from 'croodle/tests/pages/create/options-datetime';
import pageCreateSettings from 'croodle/tests/pages/create/settings';
import pagePollParticipation from 'croodle/tests/pages/poll/participation';
/* jshint proto: true */

let application;

module('Integration', {
  beforeEach() {
    application = startApp();
    moment.locale(
      application.__container__.lookup('service:i18n').get('locale')
    );
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('create a default poll and participate', function(assert) {
  const dates =
    [
      moment().add(1, 'day'),
      moment().add(1, 'week'),
      moment().add(1, 'month')
    ];

  const formattedDates =
    dates.map((date) => {
      return date.format(
        moment.localeData().longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
      );
    });

  pageCreateIndex
    .visit();

  andThen(function() {
    pageCreateIndex
      .next();

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      pageCreateMeta
        .title('default poll')
        .next();

      andThen(function() {
        assert.equal(currentPath(), 'create.options');

        assert.notOk(
          pageCreateOptions.dateHasError,
          'no validation error shown before user interaction'
        );

        pageCreateOptions
          .next();

        andThen(function() {
          assert.equal(
            currentPath(),
            'create.options',
            'transition is aborted due to validation error (no day selected)'
          );

          assert.ok(
            pageCreateOptions.dateHasError,
            'validation error is shown if no day is selected (after user interaction)'
          );

          pageCreateOptions
            .dateOptions(dates);
          pageCreateOptions
            .next();

          andThen(function() {
            assert.equal(currentPath(), 'create.options-datetime');

            pageCreateOptionsDatetime
              .next();

            andThen(function() {
              assert.equal(currentPath(), 'create.settings');

              pageCreateSettings
                .next();

              andThen(function() {
                assert.equal(currentPath(), 'poll.participation');
                assert.ok(
                  pagePollParticipation.urlIsValid() === true,
                  'poll url is valid'
                );
                assert.equal(
                  pagePollParticipation.title,
                  'default poll',
                  'title is correct'
                );
                assert.equal(
                  pagePollParticipation.description,
                  '',
                  'description is correct'
                );
                assert.deepEqual(
                  pagePollParticipation.options().labels,
                  formattedDates,
                  'option labels are correct'
                );
                assert.deepEqual(
                  pagePollParticipation.options().answers,
                  [
                    t('answerTypes.yes.label').toString(),
                    t('answerTypes.no.label').toString()
                  ],
                  'option labels are correct'
                );

                pollParticipate('Max Hoelz', ['no', 'no', 'yes']);
                andThen(function() {
                  assert.equal(currentPath(), 'poll.evaluation');
                  pollHasUsersCount(assert, 1);
                  pollHasUser(
                    assert,
                    'Max Hoelz',
                    [
                      t('answerTypes.no.label'),
                      t('answerTypes.no.label'),
                      t('answerTypes.yes.label')
                    ]
                  );
                });
              });
            });
          });
        });
      });
    });
  });
});
