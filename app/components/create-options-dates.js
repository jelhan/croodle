import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isArray } from '@ember/array';
import { isPresent } from '@ember/utils';
import moment from 'moment';

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
      .toArray();
  }

  @computed('calendarCenter')
  get calendarCenterNext() {
    return moment(this.calendarCenter).add(1, 'months');
  }

  @action
  daysSelected({ moment: newMoments }) {
    let { options } = this;

    if (!isArray(newMoments)) {
      // special case: all options are unselected
      options.clear();
      return;
    }

    // array of options that represent days missing in updated selection
    let removedOptions = options.filter((option) => {
      return !newMoments.find((newMoment) => newMoment.format('YYYY-MM-DD') === option.day);
    });

    // array of moments that aren't represented yet by an option
    let addedMoments = newMoments.filter((moment) => {
      return !options.find((option) => moment.format('YYYY-MM-DD') === option.day);
    });

    // remove options that represent deselected days
    options.removeObjects(removedOptions);

    // add options for newly selected days
    let newOptions = addedMoments.map((moment) => {
      return this.store.createFragment('option', {
        title: moment.format('YYYY-MM-DD'),
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
    this.set('calendarCenter', selectedDays.length >= 1 ? selectedDays[0] : moment());
  }
}
