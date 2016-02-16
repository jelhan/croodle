import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('create');
  },

  // redirect to create/meta if title is not set
  afterModel(create) {
    if (
      !Ember.isArray(create.get('options')) ||
      create.get('options.length') < 1
    ) {
      this.transitionTo('create.options');
    }
  }
});
