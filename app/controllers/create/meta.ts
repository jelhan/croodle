import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import type { CreateMetaRouteModel } from 'croodle/routes/create/meta';

export default class CreateMetaController extends Controller {
  @service declare router: RouterService;

  declare model: CreateMetaRouteModel;

  @action
  previousPage() {
    this.router.transitionTo('create.index');
  }

  @action
  submit() {
    this.router.transitionTo('create.options');
  }

  @action
  handleTransition(transition: Transition) {
    if (transition.from?.name === 'create.meta') {
      const { poll, formData } = this.model;

      poll.title = formData.title;
      poll.description = formData.description;
    }
  }

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);

    this.router.on('routeWillChange', this.handleTransition);
  }
}
