import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    back() {
      this.transitionTo('create.options');
    }
  },
  model() {
    return this.modelFor('create');
  }
});
