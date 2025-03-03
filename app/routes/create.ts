import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import { DateTime } from 'luxon';
import { tracked } from '@glimmer/tracking';
import { TrackedSet } from 'tracked-built-ins';
import type { AnswerType, PollType } from 'croodle/models/poll';

class PollData {
  @tracked anonymousUser: boolean = false;
  @tracked answerType: AnswerType = 'YesNo';
  @tracked description: string = '';
  @tracked expirationDate: string = DateTime.local()
    .plus({ months: 3 })
    .toISO();
  @tracked forceAnswer: boolean = true;
  @tracked freetextOptions: TrackedSet<string> = new TrackedSet();
  @tracked dateOptions: TrackedSet<string> = new TrackedSet();
  @tracked timesForDateOptions: Map<string, Set<string>> = new Map();
  @tracked pollType: PollType = 'FindADate';
  @tracked title: string = '';
}

export default class CreateRoute extends Route {
  @service declare router: RouterService;

  beforeModel(transition: Transition) {
    // enforce that wizzard is started at create.index
    if (transition.to?.name !== 'create.index') {
      this.router.transitionTo('create.index');
    }
  }

  model() {
    return new PollData();
  }
}

type Resolved<P> = P extends Promise<infer T> ? T : P;
export type CreateRouteModel = Resolved<ReturnType<CreateRoute['model']>>;
