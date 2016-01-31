import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('create');
  },

  // redirect to create/meta if title is not set
  afterModel(create) {
    if (Ember.isEmpty(create.get('title'))) {
      this.transitionTo('create.meta');
    }
  }
});
