import { service } from '@ember/service';
import Component from '@glimmer/component';
import type IntlService from 'ember-intl/services/intl';
import type { PollEvaluationRouteModel } from '@croodle/client/routes/poll/evaluation';
import type PollSettingsService from '@croodle/client/services/poll-settings';

export interface PollEvaluationSignature {
  // The arguments accepted by the component
  Args: {
    poll: PollEvaluationRouteModel;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class PollEvaluation extends Component<PollEvaluationSignature> {
  @service declare intl: IntlService;
  @service('poll-settings') declare pollSettingsService: PollSettingsService;

  get isEvaluable() {
    const { poll } = this.args;
    const { isFreeText, users } = poll;
    const hasUsers = users.length > 0;

    return hasUsers && !isFreeText;
  }

  get pollSettings() {
    const { poll } = this.args;

    return this.pollSettingsService.getSettings(poll);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PollEvaluation: typeof PollEvaluation;
  }
}
