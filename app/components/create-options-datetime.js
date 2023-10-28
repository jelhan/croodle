import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { TrackedMap, TrackedSet } from 'tracked-built-ins';
import { DateTime } from 'luxon';
import IntlMessage from '../utils/intl-message';

class FormDataTimeOption {
  formData;

  // ISO 8601 date string: YYYY-MM-DD
  date;

  // ISO 8601 time string without seconds: HH:mm
  @tracked time;

  // helper property set by modifiers to track if input element is invalid
  // because user only entered the time partly (e.g. "10:--").
  @tracked isPartiallyFilled = false;

  get timeValidation() {
    const { isPartiallyFilled } = this;
    if (isPartiallyFilled) {
      return new IntlMessage(
        'create.options-datetime.error.partiallyFilledTime',
      );
    }

    // The same time must not be entered twice for a day.
    // It should show a validation error if the same time has been entered for
    // the same day already before. Only the second input field containing the
    // duplicated time should show the validation error.
    const { formData, date } = this;
    const timesForThisDate = Array.from(formData.datetimes.get(date));
    const isDuplicate = timesForThisDate
      .slice(0, timesForThisDate.indexOf(this))
      .some((timeOption) => timeOption.time == this.time);
    if (isDuplicate) {
      return new IntlMessage('create.options-datetime.error.duplicatedDate');
    }

    return null;
  }

  get datetime() {
    const { date, time } = this;
    const isoString = time === null ? date : `${date}T${time}`;
    return DateTime.fromISO(isoString);
  }

  get jsDate() {
    const { datetime } = this;
    return datetime.toJSDate();
  }

  get isValid() {
    const { timeValidation } = this;
    return timeValidation === null;
  }

  get isFirstTimeOnFirstDate() {
    const { formData, date } = this;
    const { datetimes } = formData;
    return (
      Array.from(datetimes.keys())[0] === date &&
      Array.from(datetimes.get(date))[0] === this
    );
  }

  constructor(formData, { date, time }) {
    this.formData = formData;
    this.date = date;
    this.time = time;
  }
}

class FormData {
  @tracked datetimes;

  get optionsValidation() {
    const { datetimes } = this;
    const allTimeOptionsAreValid = Array.from(datetimes.values()).every(
      (timeOptionsForDate) =>
        Array.from(timeOptionsForDate).every(
          (timeOption) => timeOption.isValid,
        ),
    );
    if (!allTimeOptionsAreValid) {
      return IntlMessage('create.options-datetime.error.invalidTime');
    }

    return null;
  }

  get hasMultipleDays() {
    return this.datetimes.size > 1;
  }

  @action
  addOption(date) {
    this.datetimes
      .get(date)
      .add(new FormDataTimeOption(this, { date, time: null }));
  }

  /*
   * removes target option if it's not the only time for this date
   * otherwise it deletes time for this date
   */
  @action
  deleteOption(option) {
    const timeOptionsForDate = this.datetimes.get(option.date);

    if (timeOptionsForDate.size > 1) {
      timeOptionsForDate.delete(option);
    } else {
      option.time = null;
    }
  }

  @action
  adoptTimesOfFirstDay() {
    const timeOptionsForFirstDay = Array.from(
      Array.from(this.datetimes.values())[0],
    );
    const timesForFirstDayAreValid = timeOptionsForFirstDay.every(
      (timeOption) => timeOption.isValid,
    );
    if (!timesForFirstDayAreValid) {
      return false;
    }

    for (const date of Array.from(this.datetimes.keys()).slice(1)) {
      this.datetimes.set(
        date,
        new TrackedSet(
          timeOptionsForFirstDay.map(
            ({ time }) => new FormDataTimeOption(this, { date, time }),
          ),
        ),
      );
    }
  }

  constructor({ dates, times }) {
    const datetimes = new Map();

    for (const date of dates) {
      const timesForDate = times.has(date)
        ? Array.from(times.get(date))
        : [null];
      datetimes.set(
        date,
        new TrackedSet(
          timesForDate.map(
            (time) => new FormDataTimeOption(this, { date, time }),
          ),
        ),
      );
    }

    this.datetimes = new TrackedMap(datetimes);
  }
}

export default class CreateOptionsDatetime extends Component {
  @service router;

  formData = new FormData({ dates: this.args.dates, times: this.args.times });

  @tracked errorMesage = null;

  @action
  adoptTimesOfFirstDay() {
    const { formData } = this;
    const successful = formData.adoptTimesOfFirstDay();

    if (!successful) {
      this.errorMesage =
        'create.options-datetime.fix-validation-errors-first-day';
    }
  }

  @action
  previousPage() {
    this.args.onPrevPage();
  }

  @action
  submit() {
    this.args.onNextPage();
  }

  // validate input field for being partially filled
  @action
  validateInput(option, event) {
    const element = event.target;

    // update partially filled time validation error
    option.isPartiallyFilled = !element.checkValidity();
  }

  // remove partially filled validation error if user fixed it
  @action
  updateInputValidation(option, event) {
    const element = event.target;

    if (element.checkValidity() && option.isPartiallyFilled) {
      option.isPartiallyFilled = false;
    }
  }

  @action
  handleTransition(transition) {
    if (transition.from?.name === 'create.options-datetime') {
      this.args.updateOptions(
        // FormData.datetimes Map has a Set of FormDataTime object as values
        // We need to transform it to a Set of plain time strings
        new Map(
          Array.from(this.formData.datetimes.entries())
            .map(([key, timeOptions]) => [
              key,
              new Set(
                Array.from(timeOptions)
                  .map(({ time }) => time)
                  // There might be FormDataTime objects without a time, which
                  // we need to filter out
                  .filter((time) => time !== null),
              ),
            ])
            // There might be dates without any time, which we need to filter out
            .filter(([, times]) => times.size > 0),
        ),
      );
      this.router.off('routeWillChange', this.handleTransition);
    }
  }

  constructor() {
    super(...arguments);

    this.router.on('routeWillChange', this.handleTransition);
  }
}
