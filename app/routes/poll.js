import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    error(error) {
      if (error && error.status === 404) {
        return this.transitionTo('404');
      }

      return true;
    }
  },

  encryption: service(),

  model(params) {
    // get encryption key from query parameter in singleton
    // before it's used by serializer to decrypt payload
    this.set('encryption.key', params.encryptionKey);

    return this.store.find('poll', params.poll_id);
  },

  redirect(poll, transition) {
    if (transition.targetName === 'poll.index') {
      this.transitionTo('poll.participation', poll, {
        queryParams: {
          encryptionKey: this.get('encryption.key')
        }
      });
    }
  }
});
