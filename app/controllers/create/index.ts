import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import type { CreateIndexRouteModel } from 'croodle/routes/create/index';

export default class CreateIndex extends Controller {
  @service declare router: RouterService;

  declare model: CreateIndexRouteModel;

  @action
  submit() {
    this.router.transitionTo('create.meta');
  }

  @action
  handleTransition(transition: Transition) {
    if (transition.from?.name === 'create.index') {
      const { poll, formData } = this.model;

      poll.pollType = formData.pollType;
    }
  }

  constructor() {
    // eslint-disable-next-line prefer-rest-params
    super(...arguments);

    this.router.on('routeWillChange', this.handleTransition);
  }
}
