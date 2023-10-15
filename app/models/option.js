import Fragment from 'ember-data-model-fragments/fragment';
import { fragmentOwner } from 'ember-data-model-fragments/attributes';
import { attr } from '@ember-data/model';
import { assert } from '@ember/debug';
import { isEmpty } from '@ember/utils';
import { DateTime } from 'luxon';

export default class Option extends Fragment {
  @fragmentOwner()
  poll;

  @attr('string')
  title;

  get datetime() {
    const { title } = this;

    if (isEmpty(title)) {
      return null;
    }

    return DateTime.fromISO(title);
  }

  get isDate() {
    const { datetime } = this;
    return datetime !== null && datetime.isValid;
  }

  get day() {
    if (!this.isDate) {
      return null;
    }

    return this.datetime.toISODate();
  }

  get jsDate() {
    return this.datetime.toJSDate();
  }

  get hasTime() {
    return this.isDate && this.title.length >= 'YYYY-MM-DDTHH:mm'.length;
  }

  get time() {
    if (!this.isDate || !this.hasTime) {
      return null;
    }

    return this.datetime.toISOTime().substring(0, 5);
  }
  set time(value) {
    assert(
      'can not set a time if current value is not a valid date',
      this.isDate
    );

    // set time to undefined if value is false
    if (isEmpty(value)) {
      this.set('title', this.day);
      return;
    }

    const datetime = DateTime.fromISO(value);
    if (!datetime.isValid) {
      return;
    }
    this.set(
      'title',
      this.datetime
        .set({ hours: datetime.hour, minutes: datetime.minute })
        .toISO()
    );
  }
}
