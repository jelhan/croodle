import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class OptionsDatetimeRoute extends Route {
  model() {
    return this.modelFor('create');
  }
}
