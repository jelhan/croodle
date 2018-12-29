import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    previousPage() {
      this.transitionTo('create.index');
    }
  },
  model() {
    return this.modelFor('create');
  }
});
