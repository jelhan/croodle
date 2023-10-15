import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { TrackedSet } from 'tracked-built-ins';

export default class CreateController extends Controller {
  @service
  router;

  get canEnterMetaStep() {
    return this.visitedSteps.has('meta') && this.model.pollType;
  }

  get canEnterOptionsStep() {
    let { title } = this.model;
    return (
      this.visitedSteps.has('options') &&
      typeof title === 'string' &&
      title.length >= 2
    );
  }

  get canEnterOptionsDatetimeStep() {
    return (
      this.visitedSteps.has('options-datetime') &&
      this.model.options.length >= 1
    );
  }

  get canEnterSettingsStep() {
    return this.visitedSteps.has('settings') && this.model.options.length >= 1;
  }

  get isFindADate() {
    return this.model.pollType === 'FindADate';
  }

  @action
  updateVisitedSteps() {
    let { currentRouteName } = this.router;

    // currentRouteName might not be defined in some edge cases
    if (!currentRouteName) {
      return;
    }

    let step = currentRouteName.split('.').pop();
    this.visitedSteps.add(step);
  }

  listenForStepChanges() {
    this.set('visitedSteps', new TrackedSet());

    this.router.on('routeDidChange', this.updateVisitedSteps);
  }

  clearListenerForStepChanges() {
    this.router.off('routeDidChange', this.updateVisitedSteps);
  }
}
