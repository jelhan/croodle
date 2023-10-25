import Route from '@ember/routing/route';
import Poll from '../native-models/poll';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PollRoute extends Route {
  @service encryption;
  @service router;
  @service store;

  @action
  error(error) {
    if (error && error.status === 404) {
      return this.router.transitionTo('404');
    }

    return true;
  }

  model({ encryptionKey, poll_id: id }) {
    // TODO: remote as soon as logic to save a new user is
    //       migrated away from Ember Data as well.
    //
    // get encryption key from query parameter in singleton
    // before it's used by serializer to decrypt payload
    this.set('encryption.key', encryptionKey);

    return Poll.load(id, encryptionKey);
  }

  redirect(poll, transition) {
    if (transition.targetName === 'poll.index') {
      this.router.transitionTo('poll.participation', poll, {
        queryParams: {
          encryptionKey: this.encryption.key,
        },
      });
    }
  }
}
