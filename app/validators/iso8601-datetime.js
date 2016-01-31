import BaseValidator from 'ember-cp-validations/validators/base';
import moment from 'moment';

export default BaseValidator.extend({
  validate(value, options) {
    let valid;
    const validFormats = [
      // ISO 8601 date time string
      'YYYY-MM-DDTHH:mmZ',
      // ISO 8601 date time string include seconds
      'YYYY-MM-DDTHH:mm:ssZ',
      // ISO 8601 date time string include seconds and milliseconds
      'YYYY-MM-DDTHH:mm:ss.SSSZ'
    ];

    if (typeof options !== 'object') {
      options = {};
    }

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
      return this.createErrorMessage('iso8601-date', value, options);
    }
  }
});
