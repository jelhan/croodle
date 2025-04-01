import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import type { PollType } from 'croodle/models/poll';
import type { CreateRouteModel } from '../create';

class FormData {
  @tracked declare pollType;

  constructor({ pollType }: { pollType: PollType }) {
    this.pollType = pollType;
  }
}

export default class CreateIndexRoute extends Route {
  model() {
    const { pollType } = this.modelFor('create') as CreateRouteModel;

    return {
      formData: new FormData({ pollType }),
      poll: this.modelFor('create') as CreateRouteModel,
    };
  }
}

type Resolved<P> = P extends Promise<infer T> ? T : P;
export type CreateIndexRouteModel = Resolved<
  ReturnType<CreateIndexRoute['model']>
>;
