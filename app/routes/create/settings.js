import Route from '@ember/routing/route';

export default class SettingsRoute extends Route {
  model() {
    return this.modelFor('create');
  }
}
