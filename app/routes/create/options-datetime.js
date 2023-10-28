import Route from '@ember/routing/route';

export default class OptionsDatetimeRoute extends Route {
  model() {
    return this.modelFor('create');
  }
}
