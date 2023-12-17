import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import type RouterService from '@ember/routing/router-service';
import type { CreateIndexRouteModel } from '../routes/create/index';

export interface CreateIndexSignature {
  Args: {
    formData: CreateIndexRouteModel['formData'];
    poll: CreateIndexRouteModel['poll'];
  };
}

export default class CreateIndexComponent extends Component<CreateIndexSignature> {
  @service declare router: RouterService;

  @action
  submit() {
    this.router.transitionTo('create.meta');
  }

  constructor(owner: unknown, args: CreateIndexSignature['Args']) {
    super(owner, args);

    registerDestructor(this, () => {
      const { poll, formData } = this.args;

      poll.pollType = formData.pollType;
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CreateIndex: typeof CreateIndexComponent;
  }
}
