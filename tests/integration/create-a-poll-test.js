import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import moment from 'moment';
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

  visit('/create').then(function() {
    click('button[type="submit"]');

    andThen(function() {
      assert.equal(currentPath(), 'create.meta');

      fillIn('.title input', 'default poll');
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
              pollDescriptionEqual(assert, '');
              pollHasOptions(assert, formattedDates);
              pollHasUsersCount(assert, 0);
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
