import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isArray } from '@ember/array';
import { DateTime } from 'luxon';
import { tracked } from '@glimmer/tracking';

export default class CreateOptionsDates extends Component {
  @tracked calendarCenter =
    this.selectedDays.length >= 1 ? this.selectedDays[0] : DateTime.local();

  get selectedDays() {
    return Array.from(this.args.options).map(({ value }) =>
      DateTime.fromISO(value),
    );
  }

  get calendarCenterNext() {
    return this.calendarCenter.plus({ months: 1 });
  }

  @action
  handleSelectedDaysChange({ datetime: newDatesAsLuxonDateTime }) {
    if (!isArray(newDatesAsLuxonDateTime)) {
      // special case: all options are unselected
      this.args.updateOptions([]);
      return;
    }

    this.args.updateOptions(
      newDatesAsLuxonDateTime.map((datetime) => datetime.toISODate()),
    );
  }

  @action
  updateCalenderCenter(diff) {
    this.calendarCenter = this.calendarCenter.add(diff, 'months');
  }
}
