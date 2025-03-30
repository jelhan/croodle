import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import type RouterService from '@ember/routing/router-service';
import type { CreateMetaRouteModel } from '../routes/create/meta';

export interface CreateMetaSignature {
  Args: {
    formData: CreateMetaRouteModel['formData'];
    poll: CreateMetaRouteModel['poll'];
  };
}

export default class CreateMetaComponent extends Component<CreateMetaSignature> {
  @service declare router: RouterService;

  @action
  previousPage() {
    this.router.transitionTo('create.index');
  }

  @action
  submit() {
    this.router.transitionTo('create.options');
  }

  constructor(owner: unknown, args: CreateMetaSignature['Args']) {
    super(owner, args);

    registerDestructor(this, () => {
      const { poll, formData } = this.args;

      poll.title = formData.title;
      poll.description = formData.description;
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CreateMeta: typeof CreateMetaComponent;
  }
}
