import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';

export default class PollEvaluationController extends Controller {
  @service intl;

  @controller('poll') pollController;

  get isEvaluable() {
    const { model: poll } = this;
    const { isFreeText, users } = poll;
    const hasUsers = users.length > 0;

    return hasUsers && !isFreeText;
  }

  /*
   * evaluates poll data
   * if free text answers are allowed evaluation is disabled
   */
  get evaluation() {
    if (!this.isEvaluable) {
      return [];
    }

    const { model: poll } = this;

    let evaluation = [];
    let options = [];
    let lookup = [];

    // init options array
    poll.options.forEach((option, index) => {
      options[index] = 0;
    });

    // init array of evalutation objects
    // create object for every possible answer
    poll.answers.forEach((answer) => {
      evaluation.push({
        id: answer.label,
        label: answer.label,
        options: [...options],
      });
    });
    // create object for no answer if answers are not forced
    if (!poll.forceAnswer) {
      evaluation.push({
        id: null,
        label: 'no answer',
        options: [...options],
      });
    }

    // create lookup array
    evaluation.forEach(function (value, index) {
      lookup[value.id] = index;
    });

    // loop over all users
    poll.users.forEach((user) => {
      // loop over all selections of the user
      user.selections.forEach(function (selection, optionIndex) {
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
}
