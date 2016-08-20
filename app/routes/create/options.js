import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    back() {
      this.transitionTo('create.meta');
    }
  },
  model() {
    return this.modelFor('create');
  }
});
