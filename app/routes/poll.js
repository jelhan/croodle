import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PollRoute extends Route {
  @service encryption;
  @service router;

  @action
  error(error) {
    if (error && error.status === 404) {
      return this.router.transitionTo('404');
    }

    return true;
  }

  model(params) {
    // get encryption key from query parameter in singleton
    // before it's used by serializer to decrypt payload
    this.set('encryption.key', params.encryptionKey);

    return this.store.find('poll', params.poll_id);
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
