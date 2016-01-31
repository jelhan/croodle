import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.modelFor('create');
  },

  // redirect to create/index if poll type is not set
  afterModel(create) {
    if (create.get('pollType') === null) {
      this.transitionTo('create.index');
    }
  }
});
