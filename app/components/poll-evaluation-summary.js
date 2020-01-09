import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly, max, mapBy, gt } from '@ember/object/computed';
import Component from '@ember/component';
import { copy } from '@ember/object/internals';
import { isEmpty } from '@ember/utils';

@classic
@classNames('evaluation-summary')
export default class PollEvaluationSummary extends Component {
  @service
  i18n;

  @computed('users.[]')
  get bestOptions() {
    // can not evaluate answer type free text
    if (this.get('poll.isFreeText')) {
      return undefined;
    }

    // can not evaluate a poll without users
    if (isEmpty(this.users)) {
      return undefined;
    }

    let answers = this.poll.answers.reduce((answers, answer) => {
      answers[answer.get('type')] = 0;
      return answers;
    }, {});
    let evaluation = this.poll.options.map((option) => {
      return {
        answers: copy(answers),
        option,
        score: 0
      };
    });
    let bestOptions = [];

    this.users.forEach((user) => {
      user.selections.forEach(({ type }, i) => {
        evaluation[i].answers[type]++;

        switch (type) {
          case 'yes':
            evaluation[i].score += 2;
            break;

          case 'maybe':
            evaluation[i].score += 1;
            break;

          case 'no':
            evaluation[i].score -= 2;
            break;
        }
      });
    });

    evaluation.sort((a, b) => b.score - a.score);

    let bestScore = evaluation[0].score;
    for (let i = 0; i < evaluation.length; i++) {
      if (
        bestScore === evaluation[i].score
      ) {
        bestOptions.push(
          evaluation[i]
        );
      } else {
        break;
      }
    }

    return bestOptions;
  }

  @readOnly('i18n.locale')
  currentLocale;

  @gt('bestOptions.length', 1)
  multipleBestOptions;

  @max('participationDates')
  lastParticipationAt;

  @mapBy('users', 'creationDate')
  participationDates;

  @readOnly('users.length')
  participantsCount;

  @readOnly('poll.users')
  users;
}
