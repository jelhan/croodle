import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { TrackedSet } from 'tracked-built-ins';

export interface CreatePollSignature {
  Element: null;
}

export default class CreatePollComponent extends Component<CreatePollSignature> {
  @service declare router: RouterService;

  dates = new TrackedSet<string>();

  get sortedDates() {
    return Array.from(this.dates).sort();
  }

  @action
  addDate(event: Event) {
    if (!event.target || !(event.target instanceof HTMLInputElement)) {
      return;
    }

    const inputElement = event.target;
    const { value } = inputElement;

    // ignore empty inputs
    if (value === null) {
      return;
    }

    this.dates.add(value);

    inputElement.value = '';
  }

  @action
  removeDate(date: string) {
    this.dates.delete(date);
  }

  @action
  createPoll(event: SubmitEvent) {
    event.preventDefault();

    const pollId = window.crypto.randomUUID();

    this.router.transitionTo('poll', pollId);
  }
}
