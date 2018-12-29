import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    previousPage() {
      let model = this.modelFor(this.routeName);
      let isFindADate = model.get('isFindADate');
      if (isFindADate) {
        this.transitionTo('create.options-datetime');
      } else {
        this.transitionTo('create.options');
      }
    }
  },
  model() {
    return this.modelFor('create');
  }
});
