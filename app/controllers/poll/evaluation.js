import Ember from 'ember';

const { $, computed, Controller, inject } = Ember;

export default Controller.extend({
  currentLocale: computed.reads('i18n.locale'),

  dates: computed.reads('pollController.dates'),

  hasTimes: computed.reads('pollController.hasTimes'),

  i18n: inject.service(),

  optionsGroupedByDates: computed.reads('pollController.optionsGroupedByDates'),

  pollController: inject.controller('poll'),

  sortedUsers: computed.sort('pollController.model.users', 'usersSorting'),
  usersSorting: ['creationDate'],

  timezone: computed.reads('pollController.timezone'),

  /*
   * evaluates poll data
   * if free text answers are allowed evaluation is disabled
   */
  evaluation: computed('model.users.[]', function() {
    // disable evaluation if answer type is free text
    if (this.get('model.answerType') === 'FreeText') {
      return [];
    }

    let evaluation = [];
    let options = [];
    let lookup = [];

    // init options array
    this.get('model.options').forEach(function(option, index) {
      options[index] = 0;
    });

    // init array of evalutation objects
    // create object for every possible answer
    this.get('model.answers').forEach(function(answer) {
      evaluation.push({
        id: answer.label,
        label: answer.label,
        options: $.extend([], options)
      });
    });
    // create object for no answer if answers are not forced
    if (!this.get('model.forceAnswer')) {
      evaluation.push({
        id: null,
        label: 'no answer',
        options: $.extend([], options)
      });
    }

    // create lookup array
    evaluation.forEach(function(value, index) {
      lookup[value.id] = index;
    });

    // loop over all users
    this.get('model.users').forEach(function(user) {
      // loop over all selections of the user
      user.get('selections').forEach(function(selection, optionindex) {
        let answerindex;

        // get answer index by lookup array
        if (typeof lookup[selection.get('value.label')] === 'undefined') {
          answerindex = lookup[null];
        } else {
          answerindex = lookup[selection.get('value.label')];
        }

        // increment counter
        try {
          evaluation[answerindex].options[optionindex] = evaluation[answerindex].options[optionindex] + 1;
        } catch (e) {
          // ToDo: Throw an error
        }
      });
    });

    return evaluation;
  }),

  /*
   * calculate colspan for a row which should use all columns in table
   * used by evaluation row
   */
  fullRowColspan: computed('model.options.[]', function() {
    return this.get('model.options.length') + 2;
  }),

  isEvaluable: computed('model.users.[]', 'model.isFreeText', function() {
    if (
      !this.get('model.isFreeText') &&
      this.get('model.users.length') > 0
    ) {
      return true;
    } else {
      return false;
    }
  }),

  optionCount: computed('model.options', function() {
    return this.get('model.options.length');
  })
});
