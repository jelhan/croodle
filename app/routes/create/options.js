import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class OptionsRoute extends Route {
  model() {
    return this.modelFor('create');
  }
}
