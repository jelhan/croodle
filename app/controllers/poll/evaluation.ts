import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import type { PollEvaluationRouteModel } from 'croodle/routes/poll/evaluation';
import type PollSettingsService from 'croodle/services/poll-settings';

export default class PollEvaluationController extends Controller {
  @service declare intl: IntlService;
  @service('poll-settings') declare pollSettingsService: PollSettingsService;

  declare model: PollEvaluationRouteModel;

  get isEvaluable() {
    const { model: poll } = this;
    const { isFreeText, users } = poll;
    const hasUsers = users.length > 0;

    return hasUsers && !isFreeText;
  }

  get pollSettings() {
    return this.pollSettingsService.getSettings(this.model);
  }
}
