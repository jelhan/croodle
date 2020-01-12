import { inject as service } from '@ember/service';
import { action, computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  router: service(),

  canEnterMetaStep: computed('model.pollType', 'visitedSteps', function() {
    return this.visitedSteps.has('meta') && this.model.pollType;
  }),

  canEnterOptionsStep: computed('model.title', 'visitedSteps', function() {
    let { title } = this.model;
    return this.visitedSteps.has('options') &&
      typeof title === 'string' && title.length >= 2;
  }),

  canEnterOptionsDatetimeStep: computed('model.options.[]', 'visitedSteps', function() {
    return this.visitedSteps.has('options-datetime') && this.model.options.length >= 1;
  }),

  canEnterSettingsStep: computed('model.options.[]', 'visitedSteps', function() {
    return this.visitedSteps.has('settings') && this.model.options.length >= 1;
  }),

  isFindADate: computed('model.pollType', function() {
    return this.model.pollType === 'FindADate';
  }),

  updateVisitedSteps: action(function() {
    let { currentRouteName } = this.router;

    // currentRouteName might not be defined in some edge cases
    if (!currentRouteName) {
      return;
    }

    let step = currentRouteName.split('.').pop();
    this.visitedSteps.add(step);

    // as visitedSteps is a Set must notify about changes manually
    this.notifyPropertyChange('visitedSteps');
  }),

  listenForStepChanges() {
    this.set('visitedSteps', new Set());

    this.router.on('routeDidChange', this.updateVisitedSteps);
  },

  clearListenerForStepChanges() {
    this.router.off('routeDidChange', this.updateVisitedSteps);
  },
});
