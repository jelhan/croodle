import Component from '@ember/component';
import { classNames } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import { copy } from '@ember/object/internals';

@classNames('evaluation-summary')
export default class PollEvaluationSummary extends Component {
  @service
  intl;

  get bestOptions() {
    const { poll } = this;
    const { isFreeText, options, users } = poll;

    // can not evaluate answer type free text
    if (isFreeText) {
      return undefined;
    }

    // can not evaluate a poll without users
    if (users.length < 1) {
      return undefined;
    }

    let answers = poll.answers.reduce((answers, answer) => {
      answers[answer.get('type')] = 0;
      return answers;
    }, {});
    let evaluation = options.map((option) => {
      return {
        answers: copy(answers),
        option,
        score: 0
      };
    });
    let bestOptions = [];

    users.forEach((user) => {
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

  get lastParticipationAt() {
    const { users } = this.poll;

    let lastParticipationAt = null;

    for (const { creationDate } of users.toArray()) {
      if (creationDate >= lastParticipationAt) {
        lastParticipationAt = creationDate;
      }
    }

    return lastParticipationAt;
  }
}
