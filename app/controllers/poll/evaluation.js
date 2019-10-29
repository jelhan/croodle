import { inject as service } from '@ember/service';
import { and, gt, not, readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import Controller, { inject as controller } from '@ember/controller';

export default Controller.extend({
  currentLocale: readOnly('i18n.locale'),

  hasTimes: readOnly('poll.hasTimes'),

  i18n: service(),

  momentLongDayFormat: readOnly('pollController.momentLongDayFormat'),

  poll: readOnly('model'),
  pollController: controller('poll'),

  timezone: readOnly('pollController.timezone'),

  users: readOnly('poll.users'),

  /*
   * evaluates poll data
   * if free text answers are allowed evaluation is disabled
   */
  evaluation: computed('users.[]', function() {
    if (!this.isEvaluable) {
      return [];
    }

    let evaluation = [];
    let options = [];
    let lookup = [];

    // init options array
    this.poll.options.forEach((option, index) => {
      options[index] = 0;
    });

    // init array of evalutation objects
    // create object for every possible answer
    this.poll.answers.forEach((answer) => {
      evaluation.push({
        id: answer.label,
        label: answer.label,
        options: [...options],
      });
    });
    // create object for no answer if answers are not forced
    if (!this.poll.forceAnswer) {
      evaluation.push({
        id: null,
        label: 'no answer',
        options: [...options],
      });
    }

    // create lookup array
    evaluation.forEach(function(value, index) {
      lookup[value.id] = index;
    });

    // loop over all users
    this.poll.users.forEach((user) => {
      // loop over all selections of the user
      user.selections.forEach(function(selection, optionIndex) {
        let answerIndex;

        // get answer index by lookup array
        if (typeof lookup[selection.value.label] === 'undefined') {
          answerIndex = lookup[null];
        } else {
          answerIndex = lookup[selection.get('value.label')];
        }

        // increment counter
        try {
          evaluation[answerIndex].options[optionIndex]++;
        } catch (e) {
          // ToDo: Throw an error
        }
      });
    });

    return evaluation;
  }),

  hasUsers: gt('poll.users.length', 0),
  isNotFreeText: not('poll.isFreeText'),
  isEvaluable: and('hasUsers', 'isNotFreeText'),
});
