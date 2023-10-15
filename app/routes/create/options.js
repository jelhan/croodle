import Route from '@ember/routing/route';

export default class OptionsRoute extends Route {
  model() {
    return this.modelFor('create');
  }
}
