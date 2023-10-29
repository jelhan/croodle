import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { TrackedSet } from 'tracked-built-ins';
import type RouterService from '@ember/routing/router-service';
import type { CreateRouteModel } from 'croodle/routes/create';

export default class CreateController extends Controller {
  @service declare router: RouterService;

  declare model: CreateRouteModel;

  visitedSteps = new TrackedSet();

  get canEnterMetaStep() {
    return this.visitedSteps.has('meta') && this.model.pollType;
  }

  get canEnterOptionsStep() {
    const { title } = this.model;
    return (
      this.visitedSteps.has('options') &&
      typeof title === 'string' &&
      title.length >= 2
    );
  }

  get canEnterOptionsDatetimeStep() {
    return (
      this.visitedSteps.has('options-datetime') &&
      this.model.dateOptions.size >= 1
    );
  }

  get canEnterSettingsStep() {
    const { model, visitedSteps } = this;
    const { dateOptions, freetextOptions, pollType } = model;
    const options = pollType === 'FindADate' ? dateOptions : freetextOptions;

    return visitedSteps.has('settings') && options.size >= 1;
  }

  get isFindADate() {
    return this.model.pollType === 'FindADate';
  }

  @action
  updateVisitedSteps() {
    const { currentRouteName } = this.router;

    // currentRouteName might not be defined in some edge cases
    if (!currentRouteName) {
      return;
    }

    const step = currentRouteName.split('.').pop();
    this.visitedSteps.add(step);
  }

  @action transitionTo(route: string) {
    this.router.transitionTo(route);
  }

  listenForStepChanges() {
    this.set('visitedSteps', new TrackedSet());

    this.router.on('routeDidChange', this.updateVisitedSteps);
  }

  clearListenerForStepChanges() {
    this.router.off('routeDidChange', this.updateVisitedSteps);
  }
}
