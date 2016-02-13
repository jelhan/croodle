import BaseValidator from 'ember-cp-validations/validators/base';
import moment from 'moment';
import Ember from 'ember';

export default BaseValidator.extend({
  validate(value, options = {}) {
    Ember.assert(
      'options.validFormats must not be set or an array of momentJS format strings',
      Ember.isEmpty(options.validFormats) || Ember.isArray(options.validFormats)
    );

    let valid;
    const validFormats = Ember.isEmpty(options.validFormats) ? ['YYYY-MM-DDTHH:mm:ss.SSSZ'] : options.validFormats;

    if (
      options.active === false ||
      (typeof options.active === 'function' && options.active() === false)
    ) {
      return true;
    }

    options.value = value;

    valid = validFormats.any((validFormat) => {
      return moment(value, validFormat, true).isValid();
    });

    if (valid) {
      return true;
    } else {
      return this.createErrorMessage('iso8601', value, options);
    }
  }
});
