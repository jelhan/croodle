import Route from '@ember/routing/route';
import Poll from '../models/poll';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PollRoute extends Route {
  @service router;

  @action
  error(error) {
    if (error && error.status === 404) {
      return this.router.transitionTo('404');
    }

    return true;
  }

  model({ encryptionKey, poll_id: id }) {
    return Poll.load(id, encryptionKey);
  }

  redirect(poll, transition) {
    if (transition.targetName === 'poll.index') {
      const { encryptionKey } = this.paramsFor(this.routeName);

      this.router.transitionTo('poll.participation', poll, {
        queryParams: {
          encryptionKey,
        },
      });
    }
  }
}
