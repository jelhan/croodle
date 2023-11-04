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
    timeZone: string | undefined;
  };
}

export interface BestOption {
  answers: Record<'yes' | 'no' | 'maybe', number>;
  option: Option;
  score: number;
}

export default class PollEvaluationSummary extends Component<PollEvaluationSummarySignature> {
  @service declare intl: IntlService;

  get bestOptions(): BestOption[] | null {
    const { poll } = this.args;
    const { isFreeText, options, users } = poll;

    // can not evaluate answer type free text
    if (isFreeText) {
      return null;
    }

    // can not evaluate a poll without users
    if (users.length < 1) {
      return null;
    }

    const answers = poll.answers.reduce(
      (answers, answer: Answer) => {
        answers[answer.type] = 0;
        return answers;
      },
      {} as Record<'yes' | 'no' | 'maybe', number>,
    );
    const evaluation: BestOption[] = options.map((option: Option) => {
      return {
        answers: { ...answers },
        option,
        score: 0,
      };
    });

    users.forEach((user: User) => {
      user.selections.forEach(({ type }, i) => {
        if (!type) {
          // type may be undefined if poll does not force an answer to all options
          return;
        }

        const evaluationForOption = evaluation[i];
        if (evaluationForOption === undefined) {
          throw new Error(
            'Mismatch between number of options in poll and selections for user',
          );
        }
        if (type !== 'yes' && type !== 'no' && type !== 'maybe') {
          throw new Error(
            `Encountered not supported type of user selection: ${type}`,
          );
        }
        evaluationForOption.answers[type]++;

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

    const bestOptions = [];
    const bestScore = evaluation[0]!.score;
    for (const evaluationForOption of evaluation) {
      if (evaluationForOption.score === bestScore) {
        bestOptions.push(evaluationForOption);
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
