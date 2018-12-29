import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { getOwner } from '@ember/application';
import EmberObject, { computed } from '@ember/object';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
  pollType: [
    validator('presence', {
      presence: true,
      dependentKeys: ['model.i18n.locale']
    }),
    validator('inclusion', {
      in: ['FindADate', 'MakeAPoll'],
      dependentKeys: ['model.i18n.locale']
    })
  ]
});

const TranslateableObject = EmberObject.extend({
  i18n: service(),
  label: computed('labelTranslation', 'i18n.locale', function() {
    return this.i18n.t(this.labelTranslation);
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

  i18n: service(),

  init() {
    this._super(...arguments);

    this.get('i18n.locale');
  },

  pollType: alias('model.pollType'),

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
