import Route from '@ember/routing/route';
import type { CreateRouteModel } from '../create';

export default class CreateOptionsDatetimeRoute extends Route {
  model() {
    return this.modelFor('create') as CreateRouteModel;
  }
}

type Resolved<P> = P extends Promise<infer T> ? T : P;
export type CreateOptionsDatetimeRouteModel = Resolved<
  ReturnType<CreateOptionsDatetimeRoute['model']>
>;
