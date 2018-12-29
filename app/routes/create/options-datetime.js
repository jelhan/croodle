import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    previousPage() {
      this.transitionTo('create.options');
    }
  },
  model() {
    return this.modelFor('create');
  }
});
