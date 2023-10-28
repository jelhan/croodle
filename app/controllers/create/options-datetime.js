import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CreateOptionsDatetimeController extends Controller {
  @service router;
  @service store;

  @action
  nextPage() {
    this.router.transitionTo('create.settings');
  }

  @action
  previousPage() {
    this.router.transitionTo('create.options');
  }

  @action
  updateOptions(datetimes) {
    this.model.timesForDateOptions = new Map(datetimes.entries());
  }
}
