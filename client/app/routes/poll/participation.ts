import Route from '@ember/routing/route';
import type { PollRouteModel } from '../poll';

export default class PollParticipationRoute extends Route {
  model() {
    return this.modelFor('poll') as PollRouteModel;
  }
}

type Resolved<P> = P extends Promise<infer T> ? T : P;
export type PollParticipationRouteModel = Resolved<
  ReturnType<PollParticipationRoute['model']>
>;
