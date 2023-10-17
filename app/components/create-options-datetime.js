import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { TrackedArray } from 'tracked-built-ins';
import { DateTime } from 'luxon';
import IntlMessage from '../utils/intl-message';

class FormDataOption {
  formData;

  // ISO 8601 date string: YYYY-MM-DD
  day;

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
    const { formData, day } = this;
    const optionsForThisDay = formData.optionsGroupedByDay[day];
    const isDuplicate = optionsForThisDay
      .slice(0, optionsForThisDay.indexOf(this))
      .any((option) => option.time == this.time);
    if (isDuplicate) {
      return new IntlMessage('create.options-datetime.error.duplicatedDate');
    }

    return null;
  }

  get datetime() {
    const { day, time } = this;
    const isoString = time === null ? day : `${day}T${time}`;
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

  constructor(formData, { day, time }) {
    this.formData = formData;
    this.day = day;
    this.time = time;
  }
}

class FormData {
  @tracked options;

  get optionsValidation() {
    const { options } = this;
    const allOptionsAreValid = options.every((option) => option.isValid);
    if (!allOptionsAreValid) {
      return IntlMessage('create.options-datetime.error.invalidTime');
    }

    return null;
  }

  get optionsGroupedByDay() {
    const { options } = this;
    const groupedOptions = {};

    for (const option of options) {
      const { day } = option;

      if (!groupedOptions[day]) {
        groupedOptions[day] = [];
      }

      groupedOptions[day].push(option);
    }

    return groupedOptions;
  }

  get hasMultipleDays() {
    return Object.keys(this.optionsGroupedByDay).length > 1;
  }

  @action
  addOption(position, day) {
    this.options.splice(
      position + 1,
      0,
      new FormDataOption(this, { day, time: null }),
    );
  }

  /*
   * removes target option if it's not the only date for this day
   * otherwise it deletes time for this date
   */
  @action
  deleteOption(option) {
    const optionsForThisDay = this.optionsGroupedByDay[option.day];

    if (optionsForThisDay.length > 1) {
      this.options.splice(this.options.indexOf(option), 1);
    } else {
      option.time = null;
    }
  }

  @action
  adoptTimesOfFirstDay() {
    const { optionsGroupedByDay } = this;
    const days = Object.keys(optionsGroupedByDay).sort();
    const firstDay = days[0];
    const optionsForFirstDay = optionsGroupedByDay[firstDay];

    const timesForFirstDayAreValid = optionsForFirstDay.every(
      (option) => option.isValid,
    );
    if (!timesForFirstDayAreValid) {
      return false;
    }

    const timesForFirstDay = optionsForFirstDay.map((option) => option.time);

    this.options = new TrackedArray(
      days
        .map((day) =>
          timesForFirstDay.map(
            (time) => new FormDataOption(this, { day, time }),
          ),
        )
        .flat(),
    );
  }

  constructor(options) {
    this.options = new TrackedArray(
      options.map(({ day, time }) => new FormDataOption(this, { day, time })),
    );
  }
}

export default class CreateOptionsDatetime extends Component {
  @service router;

  formData = new FormData(this.args.dates);

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
      this.args.updateOptions(this.formData.options);
      this.router.off('routeWillChange', this.handleTransition);
    }
  }

  constructor() {
    super(...arguments);

    this.router.on('routeWillChange', this.handleTransition);
  }
}
