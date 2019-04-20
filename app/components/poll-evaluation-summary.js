import Component from '@ember/component';
import { computed } from '@ember/object';
import { gt, mapBy, max, readOnly } from '@ember/object/computed';
import { copy } from '@ember/object/internals';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  i18n: service(),

  classNames: ['evaluation-summary'],

  bestOptions: computed('users.[]', function() {
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
  }),

  currentLocale: readOnly('i18n.locale'),

  multipleBestOptions: gt('bestOptions.length', 1),

  lastParticipationAt: max('participationDates'),
  participationDates: mapBy('users', 'creationDate'),

  participantsCount: readOnly('users.length'),

  users: readOnly('poll.users'),
});
