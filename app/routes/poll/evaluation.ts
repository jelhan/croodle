import Route from '@ember/routing/route';

export default class EvaluationRoute extends Route {
  model() {
    return this.modelFor('poll');
  }
}
