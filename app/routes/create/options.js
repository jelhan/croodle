import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    previousPage() {
      this.transitionTo('create.meta');
    }
  },
  model() {
    return this.modelFor('create');
  }
});
