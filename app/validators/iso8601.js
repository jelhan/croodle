import classic from 'ember-classic-decorator';
import { isArray } from '@ember/array';
import { isEmpty } from '@ember/utils';
import { assert } from '@ember/debug';
import BaseValidator from 'ember-cp-validations/validators/base';
import moment from 'moment';

@classic
export default class Iso8601Validator extends BaseValidator {
  validate(value, options = {}) {
    assert(
      'options.validFormats must not be set or an array of momentJS format strings',
      isEmpty(options.validFormats) || isArray(options.validFormats)
    );

    let valid;
    const validFormats = isEmpty(options.validFormats) ? ['YYYY-MM-DDTHH:mm:ss.SSSZ'] : options.validFormats;

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
}
