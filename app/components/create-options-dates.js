import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isArray } from '@ember/array';
import { DateTime } from 'luxon';
import { tracked } from '@glimmer/tracking';

export default class CreateOptionsDates extends Component {
  @tracked calendarCenter =
    this.selectedDays.length >= 1 ? this.selectedDays[0] : DateTime.local();

  get selectedDays() {
    // Options may contain the same date multiple times with different ime
    // Must filter out those duplicates as otherwise unselect would only
    // remove one entry but not all duplicates.
    return Array.from(
      // using Set to remove duplicate values
      new Set(
        this.args.options.map(({ value }) =>
          DateTime.fromISO(value).toISODate(),
        ),
      ),
    ).map((isoDate) => DateTime.fromISO(isoDate));
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

    // A date has either been added or removed. If it has been removed, we must
    // remove all options for that date. It may be multiple options with
    // different times at that date.

    // If any date received as an input argument is _not_ yet in the list of
    // dates, it has been added.
    const dateAdded = newDatesAsLuxonDateTime.find((newDateAsLuxonDateTime) => {
      return !this.selectedDays.some(
        (selectedDay) =>
          selectedDay.toISODate() === newDateAsLuxonDateTime.toISODate(),
      );
    });

    if (dateAdded) {
      this.args.updateOptions(
        [
          ...this.args.options.map(({ value }) => value),
          dateAdded.toISODate(),
        ].sort(),
      );
      return;
    }

    // If no date has been added, one date must have been removed. It has been
    // removed if there is one date in current selectedDays but not in the new
    // dates received as input argument to the function.
    const dateRemoved = this.selectedDays.find((selectedDay) => {
      return !newDatesAsLuxonDateTime.some(
        (newDateAsLuxonDateTime) =>
          newDateAsLuxonDateTime.toISODate() === selectedDay.toISODate(),
      );
    });

    if (dateRemoved) {
      this.args.updateOptions(
        this.args.options
          .filter(
            ({ value }) =>
              DateTime.fromISO(value).toISODate() !== dateRemoved.toISODate(),
          )
          .map(({ value }) => value),
      );
      return;
    }

    throw new Error(
      'No date has been added or removed. This cannot be the case. Something spooky is going on.',
    );
  }

  @action
  updateCalenderCenter(diff) {
    this.calendarCenter = this.calendarCenter.add(diff, 'months');
  }
}
