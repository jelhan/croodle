import DS from 'ember-data';
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
      ]
    }),
    validator('presence', true),
    validator('unique', {
      parent: 'poll',
      attributeInParent: 'options',
      dependentKeys: ['poll.options.[]', 'poll.options.@each.title']
    })
  ]
});

export default MF.Fragment.extend(Validations, {
  poll: MF.fragmentOwner(),
  title: DS.attr('string')
});
