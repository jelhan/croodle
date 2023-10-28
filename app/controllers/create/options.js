import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { TrackedSet } from 'tracked-built-ins/.';

export default class CreateOptionsController extends Controller {
  @service router;
  @service store;

  @action
  nextPage() {
    const { pollType } = this.model;

    if (pollType === 'FindADate') {
      this.router.transitionTo('create.options-datetime');
    } else {
      this.router.transitionTo('create.settings');
    }
  }

  @action
  previousPage() {
    this.router.transitionTo('create.meta');
  }

  @action
  updateOptions(newOptions) {
    const { pollType } = this.model;
    const options = newOptions.map(({ value }) => value);

    if (pollType === 'FindADate') {
      this.model.dateOptions = new TrackedSet(options.sort());
    } else {
      this.model.freetextOptions = new TrackedSet(options);
    }
  }
}
