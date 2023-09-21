import classic from 'ember-classic-decorator';
import { isEmpty } from '@ember/utils';
import BaseValidator from 'ember-cp-validations/validators/base';
import { DateTime } from 'luxon';

@classic
export default class TimeValidator extends BaseValidator {
  validate(value, options) {
    let valid;

    if (typeof options !== 'object') {
      options = {};
    }

    options.value = value;

    if (isEmpty(value)) {
      return options.allowEmpty === true ? true : this.createErrorMessage('time', value, options);
    }

    if (typeof value.trim === 'function') {
      value = value.trim();
    }

    valid = DateTime.fromFormat(value, 'H:mm').isValid;

    if (valid && value !== '24:00') {
      return true;
    } else {
      return this.createErrorMessage('time', value, options);
    }
  }
}
