import DS from 'ember-data';
import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
/* global MF */

const Validations = buildValidations({
  title: [
    validator('iso8601', {
      active() {
        return this.get('model.poll.isFindADate');
      },
      validFormats: [
        'YYYY-MM-DD',
        'YYYY-MM-DDTHH:mmZ',
        'YYYY-MM-DDTHH:mm:ssZ',
        'YYYY-MM-DDTHH:mm:ss.SSSZ'
      ],
      dependentKeys: ['i18n.locale']
    }),
    validator('presence', {
      presence: true,
      dependentKeys: ['i18n.locale']
    }),
    validator('unique', {
      parent: 'poll',
      attributeInParent: 'options',
      dependentKeys: ['poll.options.[]', 'poll.options.@each.title', 'i18n.locale']
    })
  ]
});

export default MF.Fragment.extend(Validations, {
  poll: MF.fragmentOwner(),
  title: DS.attr('string'),

  i18n: Ember.inject.service(),
  init() {
    this.get('i18n.locale');
  }
});
