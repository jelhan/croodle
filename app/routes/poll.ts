import Route from '@ember/routing/route';
import Poll from '../models/poll';
import { inject as service } from '@ember/service';
import type Transition from '@ember/routing/transition';
import RouterService from '@ember/routing/router-service';

export default class PollRoute extends Route {
  @service declare router: RouterService;

  model({
    encryptionKey,
    poll_id: id,
  }: {
    encryptionKey: string;
    poll_id: string;
  }) {
    return Poll.load(id, encryptionKey);
  }

  redirect(poll: Poll, transition: Transition) {
    if (transition.to.name === 'poll.index') {
      const { encryptionKey } = this.paramsFor(this.routeName) as {
        encryptionKey: string;
      };

      this.router.transitionTo('poll.participation', poll, {
        queryParams: {
          encryptionKey,
        },
      });
    }
  }
}

type Resolved<P> = P extends Promise<infer T> ? T : P;
export type PollRouteModel = Resolved<ReturnType<PollRoute['model']>>;
