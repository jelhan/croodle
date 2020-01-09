import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isPresent, isEmpty } from '@ember/utils';
import { action, get } from '@ember/object';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
import { raw } from 'ember-awesome-macros';
import { groupBy } from 'ember-awesome-macros/array';
import { next } from '@ember/runloop';

let modelValidations = buildValidations({
  dates: [
    validator('collection', true),
    validator('length', {
      dependentKeys: ['model.datetimes.[]'],
      min: 1
    }),
    validator('valid-collection', {
      dependentKeys: ['model.datetimes.[]', 'model.datetimes.@each.time']
    })
  ]
});

export default class CreateOptionsDatetime extends Component.extend(modelValidations) {
  @service
  store;

  errorMesage = null;

  // group dates by day
  @groupBy('dates', raw('day'))
  groupedDates;

  get datesForFirstDay() {
    // dates are sorted
    let firstDay = this.groupedDates[0];
    return firstDay.items;
  }

  get timesForFirstDay() {
    return this.datesForFirstDay.map((date) => date.time).filter((time) => isPresent(time));
  }

  @action
  addOption(afterOption) {
    let options = this.dates;
    let dayString = afterOption.get('day');
    let fragment = this.store.createFragment('option', {
      title: dayString
    });
    let position = options.indexOf(afterOption) + 1;
    options.insertAt(
      position,
      fragment
    );

    next(() => {
      this.notifyPropertyChange('_nestedChildViews');
    });
  }

  @action
  adoptTimesOfFirstDay() {
    const dates = this.dates;
    const datesForFirstDay = this.datesForFirstDay;
    const timesForFirstDay = this.timesForFirstDay;
    const datesWithoutFirstDay = this.groupedDates.slice(1);

    /* validate if times on firstDay are valid */
    const datesForFirstDayAreValid = datesForFirstDay.every((date) => {
      // ignore dates where time is null
      return isEmpty(date.get('time')) || date.get('validations.isValid');
    });

    if (!datesForFirstDayAreValid) {
      this.set('errorMessage', 'create.options-datetime.fix-validation-errors-first-day');
      return;
    }

    datesWithoutFirstDay.forEach(({ items }) => {
      if (isEmpty(timesForFirstDay)) {
        // there aren't any times on first day
        const remainingOption = items[0];
        // remove all times but the first one
        dates.removeObjects(
          items.slice(1)
        );
        // set title as date without time
        remainingOption.set('title', remainingOption.get('date').format('YYYY-MM-DD'));
      } else {
        // adopt times of first day
        if (timesForFirstDay.get('length') < items.length) {
          // remove excess options
          dates.removeObjects(
            items.slice(timesForFirstDay.get('length'))
          );
        }
        // set times according to first day
        let targetPosition;
        timesForFirstDay.forEach((timeOfFirstDate, index) => {
          const target = items[index];
          if (target === undefined) {
            const basisDate = get(items[0], 'date').clone();
            let [hour, minute] = timeOfFirstDate.split(':');
            let dateString = basisDate.hour(hour).minute(minute).toISOString();
            let fragment = this.store.createFragment('option', {
              title: dateString
            });
            dates.insertAt(
              targetPosition,
              fragment
            );
            targetPosition++;
          } else {
            target.set('time', timeOfFirstDate);
            targetPosition = dates.indexOf(target) + 1;
          }
        });
      }
    });
  }

  /*
    * removes target option if it's not the only date for this day
    * otherwise it deletes time for this date
    */
  @action
  deleteOption(target) {
    let position = this.dates.indexOf(target);
    let datesForThisDay = this.groupedDates.find((group) => {
      return group.value === target.get('day');
    }).items;
    if (datesForThisDay.length > 1) {
      this.dates.removeAt(position);
    } else {
      target.set('time', null);
    }
  }

  @action
  previousPage() {
    this.onPrevPage();
  }

  @action
  submit() {
    if (this.get('validations.isValid')) {
      this.onNextPage();
    } else {
      this.set('shouldShowErrors', true);
    }
  }

  @action
  inputChanged(date, value) {
    // update property, which is normally done by default
    date.set('time', value);

    // reset partially filled state
    date.set('isPartiallyFilled', false);

    // reset error message
    this.set('errorMessage', null);
  }

  // validate input field for being partially filled
  @action
  validateInput(date, event) {
    let element = event.target;

    // update partially filled time validation error
    if (!element.checkValidity()) {
      date.set('isPartiallyFilled', true);
    } else {
      date.set('isPartiallyFilled', false);
    }
  }

  // remove partially filled validation error if user fixed it
  @action
  updateInputValidation(date, event) {
    let element = event.target;

    if (element.checkValidity() && date.isPartiallyFilled) {
      date.set('isPartiallyFilled', false);
    }
  }
}
