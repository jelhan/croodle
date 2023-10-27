import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { DateTime } from 'luxon';
import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';

class FormData {
  @tracked anonymousUser = false;
  @tracked answerType = 'YesNo';
  @tracked description = '';
  @tracked expirationDate = DateTime.local().plus({ months: 3 }).toISO();
  @tracked forceAnswer = true;
  @tracked options = new TrackedArray();
  @tracked pollType = 'FindADate';
  @tracked title = '';
}

export default class CreateRoute extends Route {
  @service router;
  @service store;

  beforeModel(transition) {
    // enforce that wizzard is started at create.index
    if (transition.targetName !== 'create.index') {
      this.router.transitionTo('create.index');
    }
  }

  model() {
    return new FormData();
  }

  activate() {
    let controller = this.controllerFor(this.routeName);
    controller.listenForStepChanges();
  }

  deactivate() {
    let controller = this.controllerFor(this.routeName);
    controller.clearListenerForStepChanges();
  }
}
