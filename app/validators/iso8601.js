import classic from 'ember-classic-decorator';
import BaseValidator from 'ember-cp-validations/validators/base';
import { DateTime } from 'luxon';

@classic
export default class Iso8601Validator extends BaseValidator {
  validate(value, options = {}) {
    if (
      options.active === false ||
      (typeof options.active === 'function' && options.active() === false)
    ) {
      return true;
    }

    options.value = value;

    const valid = DateTime.fromISO(value).isValid;

    if (valid) {
      return true;
    } else {
      return this.createErrorMessage('iso8601', value, options);
    }
  }
}
