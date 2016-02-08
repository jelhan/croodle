import DS from 'ember-data';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
/* global MF */

const Validations = buildValidations({
  title: [
    validator('iso8601-date', {
      active() {
        return this.get('model.poll.isFindADate') && !this.get('model.poll.isDateTime');
      }
    }),
    validator('iso8601-datetime', {
      active() {
        return this.get('model.poll.isFindADate') && this.get('model.poll.isDateTime');
      }
    }),
    validator('presence', true)
  ]
});

export default MF.Fragment.extend(Validations, {
  poll: MF.fragmentOwner(),
  title: DS.attr('string')
});
