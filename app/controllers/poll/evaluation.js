import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly, not, gt, and } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';

@classic
export default class PollEvaluationController extends Controller {
  @readOnly('intl.primaryLocale')
  currentLocale;

  @readOnly('poll.hasTimes')
  hasTimes;

  @service
  intl;

  @readOnly('pollController.momentLongDayFormat')
  momentLongDayFormat;

  @readOnly('model')
  poll;

  @controller('poll')
  pollController;

  @readOnly('pollController.timezone')
  timezone;

  @readOnly('poll.users')
  users;

  /*
   * evaluates poll data
   * if free text answers are allowed evaluation is disabled
   */
  @computed('users.[]')
  get evaluation() {
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
  }

  @gt('poll.users.length', 0)
  hasUsers;

  @not('poll.isFreeText')
  isNotFreeText;

  @and('hasUsers', 'isNotFreeText')
  isEvaluable;
}
