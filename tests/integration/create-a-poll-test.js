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
  var dates =
    [
      moment().add(1, 'day'),
      moment().add(1, 'week'),
      moment().add(1, 'month')
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

        selectDates('#datepicker .ember-view', dates);

        click('button[type="submit"]');

        andThen(function(){
          assert.equal(currentPath(), 'create.settings');

          click('button[type="submit"]');

          andThen(function(){
            assert.equal(currentPath(), 'poll.participation');

            pollTitleEqual(assert, 'default poll');
            pollDescriptionEqual(assert, '');
            pollHasOptions(assert, formattedDates);
            pollHasUsersCount(assert, 0);
            pollParticipate('Max Hoelz', ['no', 'no', 'yes']);
            andThen(function(){
              assert.equal(currentPath(), 'poll.evaluation');
              pollHasUsersCount(assert, 1);
              pollHasUser(
                assert,
                'Max Hoelz',
                [
                  Ember.I18n.t('answerTypes.no.label'),
                  Ember.I18n.t('answerTypes.no.label'),
                  Ember.I18n.t('answerTypes.yes.label')
                ]
              );
            });
          });
        });
      });
    });
  });
});
