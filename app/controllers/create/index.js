import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const { computed, Controller, getOwner, Object: EmberObject, inject } = Ember;

const Validations = buildValidations({
  pollType: [
    validator('presence', {
      presence: true,
      dependentKeys: ['i18n.locale']
    }),
    validator('inclusion', {
      in: ['FindADate', 'MakeAPoll'],
      dependentKeys: ['i18n.locale']
    })
  ]
});

const TranslateableObject = EmberObject.extend({
  i18n: inject.service(),
  label: computed('labelTranslation', 'i18n.locale', function() {
    return this.get('i18n').t(this.get('labelTranslation'));
  }),
  labelTranslation: undefined
});

export default Controller.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        this.transitionToRoute('create.meta');
      }
    }
  },

  i18n: inject.service(),

  init() {
    this.get('i18n.locale');
  },

  pollType: computed.alias('model.pollType'),

  pollTypes: computed('', function() {
    const owner = getOwner(this);

    return [
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'FindADate',
        labelTranslation: 'pollTypes.findADate.label'
      }),
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'MakeAPoll',
        labelTranslation: 'pollTypes.makeAPoll.label'
      })
    ];
  })
});
