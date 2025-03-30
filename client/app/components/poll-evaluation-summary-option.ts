import templateOnlyComponent from '@ember/component/template-only';
import type { BestOption } from './poll-evaluation-summary';

interface PollEvaluationSummaryOptionSignature {
  Args: {
    Named: {
      evaluationBestOption: BestOption;
      isFindADate: boolean;
      timeZone: string | undefined;
    };
  };
  Element: HTMLButtonElement;
}

const PollEvaluationSummaryOption =
  templateOnlyComponent<PollEvaluationSummaryOptionSignature>();

export default PollEvaluationSummaryOption;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PollEvaluationSummaryOption: typeof PollEvaluationSummaryOption;
  }
}
