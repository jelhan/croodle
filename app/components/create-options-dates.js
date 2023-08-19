import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import moment from 'moment';
import { DateTime } from "luxon";

@classic
export default class CreateOptionsDates extends Component {
  @service('store')
  store;

  @computed('options.[]')
  get selectedDays() {
    return this.options
      // should be unique
      .uniqBy('day')
      // raw dates
      .map(({ date }) => date)
      // filter out invalid
      .filter(moment.isMoment)
      // convert to DateTime used by Luxon
      .map((dateAsMoment) => DateTime.fromISO(dateAsMoment.toISOString()))
      .toArray();
  }

  @computed('calendarCenter')
  get calendarCenterNext() {
    return this.calendarCenter.plus({ months: 1 });
  }

  @action
  daysSelected({ datetime: newDatesAsLuxonDateTime }) {
    let { options } = this;

    if (!isArray(newDatesAsLuxonDateTime)) {
      // special case: all options are unselected
      options.clear();
      return;
    }

    const newDates = newDatesAsLuxonDateTime.map((dateAsLuxonDateTime) => {
      return dateAsLuxonDateTime.toISODate();
    });

    // array of options that represent days missing in updated selection
    let removedOptions = options.filter((option) => {
      return !newDates.find((newDate) => newDate === option.day);
    });

    // array of moments that aren't represented yet by an option
    let addedDates = newDates.filter((newDate) => {
      return !options.find((option) => newDate === option.day);
    });

    // remove options that represent deselected days
    options.removeObjects(removedOptions);

    // add options for newly selected days
    let newOptions = addedDates.map((newDate) => {
      return this.store.createFragment('option', {
        title: newDate,
      })
    });
    newOptions.forEach((newOption) => {
      // options must be insert into options array at correct position
      let insertBefore = options.find(({ date }) => {
        if (!moment.isMoment(date)) {
          // ignore options that do not represent a valid date
          return false;
        }

        return date.isAfter(newOption.date);
      });
      let position = isPresent(insertBefore) ? options.indexOf(insertBefore) : options.length;
      options.insertAt(position, newOption);
    });
  }

  @action
  updateCalenderCenter(diff) {
    this.calendarCenter.add(diff, 'months');
    this.notifyPropertyChange('calenderCenter');
  }

  init() {
    super.init(arguments);

    let { selectedDays } = this;
    this.set('calendarCenter', selectedDays.length >= 1 ? selectedDays[0] : DateTime.local());
  }
}
