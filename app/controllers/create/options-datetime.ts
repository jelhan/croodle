import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type { CreateOptionsDatetimeRouteModel } from 'croodle/routes/create/options-datetime';
import type RouterService from '@ember/routing/router-service';

export default class CreateOptionsDatetimeController extends Controller {
  @service declare router: RouterService;

  declare model: CreateOptionsDatetimeRouteModel;

  @action
  nextPage() {
    this.router.transitionTo('create.settings');
  }

  @action
  previousPage() {
    this.router.transitionTo('create.options');
  }

  @action
  updateOptions(datetimes: Map<string, Set<string>>) {
    this.model.timesForDateOptions = new Map(datetimes.entries());
  }
}
