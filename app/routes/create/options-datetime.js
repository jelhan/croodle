import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    previousPage() {
      this.transitionTo('create.options');
    }
  },
  model() {
    return this.modelFor('create');
  }
});
