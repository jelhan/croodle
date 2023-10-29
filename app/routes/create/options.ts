import Route from '@ember/routing/route';
import type { CreateRouteModel } from '../create';

export default class CreateOptionsRoute extends Route {
  model() {
    return this.modelFor('create') as CreateRouteModel;
  }
}

type Resolved<P> = P extends Promise<infer T> ? T : P;
export type CreateOptionsRouteModel = Resolved<
  ReturnType<CreateOptionsRoute['model']>
>;
