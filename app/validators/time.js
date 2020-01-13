import classic from 'ember-classic-decorator';
import { isEmpty } from '@ember/utils';
import BaseValidator from 'ember-cp-validations/validators/base';
import moment from 'moment';

@classic
export default class TimeValidator extends BaseValidator {
  validate(value, options) {
    let valid;

    if (typeof options !== 'object') {
      options = {};
    }

    options.value = value;

    if (options.allowEmpty && isEmpty(value)) {
      return true;
    }

    if (!isEmpty(value) && typeof value.trim === 'function') {
      value = value.trim();
    }

    valid = moment(value, 'H:mm', true).isValid();

    if (valid && value !== '24:00') {
      return true;
    } else {
      return this.createErrorMessage('time', value, options);
    }
  }
}
