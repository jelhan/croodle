import Helper from '@ember/component/helper';
import { DateTime } from 'luxon';
import { inject as service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';

type Positional = [date: Date | string];

export interface FormatDateRelativeHelperSignature {
  Args: {
    Positional: Positional;
  };
  Return: string;
}

export default class FormatDateRelative extends Helper<FormatDateRelativeHelperSignature> {
  @service declare intl: IntlService;

  compute([dateOrIsoString]: Positional) {
    const isoString =
      dateOrIsoString instanceof Date
        ? dateOrIsoString.toISOString()
        : dateOrIsoString;

    return DateTime.fromISO(isoString).toRelative({
      locale: this.intl.primaryLocale,
      padding: 1000,
    })!;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'format-date-relative': typeof FormatDateRelative;
  }
}
