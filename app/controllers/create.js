import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import Controller from '@ember/controller';

export default class CreateController extends Controller {
  @service
  router;

  @computed('model.pollType', 'visitedSteps')
  get canEnterMetaStep() {
    return this.visitedSteps.has('meta') && this.model.pollType;
  }

  @computed('model.title', 'visitedSteps')
  get canEnterOptionsStep() {
    let { title } = this.model;
    return this.visitedSteps.has('options') &&
      typeof title === 'string' && title.length >= 2;
  }

  @computed('model.options.[]', 'visitedSteps')
  get canEnterOptionsDatetimeStep() {
    return this.visitedSteps.has('options-datetime') && this.model.options.length >= 1;
  }

  @computed('model.options.[]', 'visitedSteps')
  get canEnterSettingsStep() {
    return this.visitedSteps.has('settings') && this.model.options.length >= 1;
  }

  @computed('model.pollType')
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

    // as visitedSteps is a Set must notify about changes manually
    this.notifyPropertyChange('visitedSteps');
  }

  listenForStepChanges() {
    this.set('visitedSteps', new Set());

    this.router.on('routeDidChange', this.updateVisitedSteps);
  }

  clearListenerForStepChanges() {
    this.router.off('routeDidChange', this.updateVisitedSteps);
  }
}
