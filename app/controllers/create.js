import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import EmberObject, { computed, observer } from '@ember/object';
import Controller from '@ember/controller';
import { getOwner } from '@ember/application';

const formStepObject = EmberObject.extend({
  active: computed('routing.currentRouteName', function() {
    const currentRouteName = this.get('routing.currentRouteName');
    return currentRouteName === this.route;
  }),
  disabled: true,
  hidden: false,
  label: null,
  route: null,
  routing: service('-routing'),
  updateDisabledState: observer('active', function() {
    if (this.active) {
      this.set('disabled', false);
    }
  }).on('init'),
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
          const pollType = this.pollType;
          if (pollType === 'FindADate') {
            return 'create.formStep.options.days';
          } else {
            return 'create.formStep.options.text';
          }
        }),
        pollType: readOnly('model.pollType')
      }).create(owner.ownerInjection(), {
        model: this.model,
        route: 'create.options'
      }),
      formStepObject.extend({
        hidden: computed('pollType', function() {
          const pollType = this.pollType;
          return pollType !== 'FindADate';
        }),
        pollType: readOnly('model.pollType')
      }).create(owner.ownerInjection(), {
        label: 'create.formStep.options-datetime',
        model: this.model,
        route: 'create.options-datetime'
      }),
      formStepObject.create(owner.ownerInjection(), {
        label: 'create.formStep.settings',
        route: 'create.settings'
      })
    ];
  })
});
