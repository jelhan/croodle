import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    error(error) {
      if (error && error.status === 404) {
        return this.transitionTo('404');
      }

      return true;
    }
  },

  encryption: Ember.inject.service(),

  model(params) {
    // get encryption key from query parameter in singleton
    // before it's used by serializer to decrypt payload
    this.set('encryption.key', params.encryptionKey);

    /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
    return this.store.find('poll', params.poll_id);
    /* jscs:enable requireCamelCaseOrUpperCaseIdentifiers */
  },

  redirect(poll) {
    this.transitionTo('poll.participation', poll, {
      queryParams: {
        encryptionKey: this.get('encryption.key')
      }
    });
  }
});
