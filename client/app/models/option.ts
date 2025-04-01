import { isEmpty } from '@ember/utils';
import { DateTime } from 'luxon';

export default class Option {
  // Title of the option might be either:
  //
  // 1) ISO 8601 date string: `YYYY-MM-DD`
  // 2) ISO 8601 datetime string: `YYYY-MM-DDTHH:mm:ss.0000+01:00`
  // 3) Free text if poll type is MakeAPoll
  title: string;

  get datetime() {
    const { title } = this;

    if (isEmpty(title)) {
      return null;
    }

    const datetime = DateTime.fromISO(title);

    return datetime.isValid ? datetime : null;
  }

  get isDate() {
    const { datetime } = this;
    return datetime !== null;
  }

  get day() {
    if (this.datetime === null) {
      return null;
    }

    return this.datetime.toISODate();
  }

  get jsDate() {
    if (this.datetime === null) {
      return null;
    }

    return this.datetime.toJSDate();
  }

  get hasTime() {
    return this.isDate && this.title.length >= 'YYYY-MM-DDTHH:mm'.length;
  }

  get time() {
    if (!this.datetime || !this.hasTime) {
      return null;
    }

    return this.datetime.toISOTime()?.substring(0, 5);
  }

  constructor({ title }: { title: string }) {
    this.title = title;
  }
}
