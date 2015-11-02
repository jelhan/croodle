import Ember from "ember";

export default Ember.Route.extend({
  actions: {
    error: function(error) {
      if (error && error.status === 404) {
        return this.transitionTo('404');
      }

      return true;
    }
  },

  afterModel(poll) {
    this.transitionTo('poll.participation', poll, {queryParams: {encryptionKey: this.get('encryption.key')}});
  },

  encryption: Ember.inject.service(),

  model: function(params) {
    // get encryption key from query parameter in singleton
    // before it's used by serializer to decrypt payload
    this.set('encryption.key', params.encryptionKey);

    return this.store.find('poll', params.poll_id);
  }
});
