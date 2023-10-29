import Helper from '@ember/component/helper';
import { DateTime } from 'luxon';
import { inject as service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';

type Positional = [date: Date | string];

export interface FormatDateRelativeHelperSignature {
  Args: {
    Positional: Positional;
  };
}

export default class FormatDateRelativeHelper extends Helper {
  @service declare intl: IntlService;

  compute([date]: Positional) {
    if (date instanceof Date) {
      date = date.toISOString();
    }

    return DateTime.fromISO(date).toRelative({
      locale: this.intl.primaryLocale,
      padding: 1000,
    });
  }
}
