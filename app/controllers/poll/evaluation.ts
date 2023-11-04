import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import type PollController from '../poll';
import type { PollEvaluationRouteModel } from 'croodle/routes/poll/evaluation';

export default class PollEvaluationController extends Controller {
  @service declare intl: IntlService;

  @controller('poll') declare pollController: PollController;

  declare model: PollEvaluationRouteModel;

  get isEvaluable() {
    const { model: poll } = this;
    const { isFreeText, users } = poll;
    const hasUsers = users.length > 0;

    return hasUsers && !isFreeText;
  }
}
