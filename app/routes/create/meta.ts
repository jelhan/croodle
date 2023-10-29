import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import IntlMessage from '../../utils/intl-message';
import type { CreateRouteModel } from '../create';

class FormData {
  @tracked title: string;
  @tracked description: string;

  get titleValidation() {
    const { title } = this;

    if (!title) {
      return new IntlMessage(
        'create.meta.input.title.validations.valueMissing',
      );
    }

    if (title.length < 2) {
      return new IntlMessage('create.meta.input.title.validations.tooShort');
    }

    return null;
  }

  constructor({ title, description }: { title: string; description: string }) {
    this.title = title;
    this.description = description;
  }
}

export default class CreateMetaRoute extends Route {
  model() {
    const { title, description } = this.modelFor('create') as CreateRouteModel;

    return {
      formData: new FormData({ title, description }),
      poll: this.modelFor('create') as CreateRouteModel,
    };
  }
}

type Resolved<P> = P extends Promise<infer T> ? T : P;
export type CreateMetaRouteModel = Resolved<
  ReturnType<CreateMetaRoute['model']>
>;
