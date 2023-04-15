import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RouterService from '@ember/routing/router-service';

export default class IndexRoute extends Route {
  @service declare router: RouterService;

  beforeModel(): void {
    this.router.transitionTo('create');
  }
}
