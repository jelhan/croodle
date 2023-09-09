import Helper from '@ember/component/helper';
import { DateTime } from 'luxon';
import { inject as service } from '@ember/service';


export default class FormatDateRelativeHelper extends Helper {
  @service intl;

  compute([date]) {
    if (date instanceof Date) {
      date = date.toISOString();
    }

    return DateTime.fromISO(date).toRelative({
      locale: this.intl.primaryLocale,
      padding: 1000,
    });
  }
}
