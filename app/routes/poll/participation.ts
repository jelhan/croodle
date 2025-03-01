import Route from '@ember/routing/route';
import type { PollRouteModel } from '../poll';

export default class PollParticipationRoute extends Route {
  model() {
    const poll = this.modelFor('poll') as PollRouteModel;

    return {
      poll,
    };
  }
}

type Resolved<P> = P extends Promise<infer T> ? T : P;
export type PollParticipationRouteModel = Resolved<
  ReturnType<PollParticipationRoute['model']>
>;
