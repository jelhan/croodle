import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import { TrackedSet } from 'tracked-built-ins';
import { Option, Poll } from 'croodle/models';
import { task } from 'ember-concurrency';

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

  createPoll = task({ drop: true }, async (event: SubmitEvent) => {
    event.preventDefault();

    const form = event.target;

    if (!(form instanceof HTMLFormElement)) {
      throw new Error('Event target is not a form');
    }
    const formData = new FormData(form);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const options = Array.from(this.dates).map((date) => new Option({ date }));

    const poll = new Poll({
      description,
      options,
      title,
    });

    try {
      await poll.save();
    } catch (error) {
      reportError(error);

      // TODO: Distinguish different reasons why saving the poll failed and report
      //       most helpful error message to the user.
      window.alert(
        'Saving the poll failed. Please check your network connection and try again.'
      );
    }

    this.router.transitionTo('poll', poll.id, {
      queryParams: { k: poll.passphrase },
    });
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CreatePoll: typeof CreatePollComponent;
  }
}
