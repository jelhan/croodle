import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import type Option from 'croodle/models/option';
import type User from 'croodle/models/user';
import type { Answer } from 'croodle/utils/answers-for-answer-type';
import type Poll from 'croodle/models/poll';

export interface PollEvaluationSummarySignature {
  Args: {
    poll: Poll;
  };
}

export default class PollEvaluationSummary extends Component<PollEvaluationSummarySignature> {
  @service declare intl: IntlService;

  get bestOptions() {
    const { poll } = this.args;
    const { isFreeText, options, users } = poll;

    // can not evaluate answer type free text
    if (isFreeText) {
      return undefined;
    }

    // can not evaluate a poll without users
    if (users.length < 1) {
      return undefined;
    }

    const answers = poll.answers.reduce(
      (answers: Record<string, number>, answer: Answer) => {
        answers[answer.type] = 0;
        return answers;
      },
      {},
    );
    const evaluation: {
      answers: Record<string, number>;
      option: Option;
      score: number;
    }[] = options.map((option: Option) => {
      return {
        answers: { ...answers },
        option,
        score: 0,
      };
    });
    const bestOptions = [];

    users.forEach((user: User) => {
      user.selections.forEach(({ type }, i) => {
        evaluation[i]!.answers[type]++;

        switch (type) {
          case 'yes':
            evaluation[i]!.score += 2;
            break;

          case 'maybe':
            evaluation[i]!.score += 1;
            break;

          case 'no':
            evaluation[i]!.score -= 2;
            break;
        }
      });
    });

    evaluation.sort((a, b) => b.score - a.score);

    const bestScore = evaluation[0]!.score;
    for (let i = 0; i < evaluation.length; i++) {
      if (bestScore === evaluation[i]!.score) {
        bestOptions.push(evaluation[i]);
      } else {
        break;
      }
    }

    return bestOptions;
  }

  get lastParticipationAt() {
    const { users } = this.args.poll;

    let lastParticipationAt = null;

    for (const { creationDate } of users) {
      if (lastParticipationAt === null || creationDate >= lastParticipationAt) {
        lastParticipationAt = creationDate;
      }
    }

    return lastParticipationAt;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PollEvaluationSummary: typeof PollEvaluationSummary;
  }
}
