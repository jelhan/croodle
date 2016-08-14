import Ember from 'ember';

const { computed, Controller, getOwner, inject } = Ember;

const formStepObject = Ember.Object.extend({
  active: computed('routing.currentRouteName', function() {
    const currentRouteName = this.get('routing.currentRouteName');
    const active = currentRouteName === this.get('route');

    if (active) {
      this.set('disabled', false);
    }

    return active;
  }),
  disabled: true,
  hidden: false,
  label: null,
  route: null,
  routing: inject.service('-routing')
});

export default Controller.extend({
  formSteps: computed('model', function() {
    const owner = getOwner(this);
    return [
      formStepObject.create(owner.ownerInjection(), {
        label: 'create.formStep.type',
        route: 'create.index'
      }),
      formStepObject.create(owner.ownerInjection(), {
        label: 'create.formStep.meta',
        route: 'create.meta'
      }),
      formStepObject.extend({
        label: computed('pollType', function() {
          const pollType = this.get('pollType');
          if (pollType === 'FindADate') {
            return 'create.formStep.options.days';
          } else {
            return 'create.formStep.options.text';
          }
        }),
        pollType: computed.readOnly('model.pollType')
      }).create(owner.ownerInjection(), {
        model: this.get('model'),
        route: 'create.options'
      }),
      formStepObject.extend({
        hidden: computed('pollType', function() {
          const pollType = this.get('pollType');
          return pollType !== 'FindADate';
        }),
        pollType: computed.readOnly('model.pollType')
      }).create(owner.ownerInjection(), {
        label: 'create.formStep.options-datetime',
        model: this.get('model'),
        route: 'create.options-datetime'
      }),
      formStepObject.create(owner.ownerInjection(), {
        label: 'create.formStep.settings',
        route: 'create.settings'
      })
    ];
  })
});
