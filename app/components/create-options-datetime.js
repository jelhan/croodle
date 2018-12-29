import { inject as service } from '@ember/service';
import { readOnly, mapBy, filter } from '@ember/object/computed';
import Component from '@ember/component';
import { isArray } from '@ember/array';
import { isPresent, isEmpty } from '@ember/utils';
import { observer, computed, get } from '@ember/object';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
import { raw } from 'ember-awesome-macros';
import { groupBy } from 'ember-awesome-macros/array';
import Form from 'ember-bootstrap/components/bs-form';

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

export default Component.extend(modelValidations, {
  actions: {
    addOption(afterOption) {
      let options = this.get('dates');
      let dayString = afterOption.get('day');
      let fragment = this.get('store').createFragment('option', {
        title: dayString
      });
      let position = options.indexOf(afterOption) + 1;
      options.insertAt(
        position,
        fragment
      );
    },
    adoptTimesOfFirstDay() {
      const dates = this.get('dates');
      const datesForFirstDay = this.get('datesForFirstDay');
      const timesForFirstDay = this.get('timesForFirstDay');
      const datesWithoutFirstDay = this.get('groupedDates').slice(1);

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
              let fragment = this.get('store').createFragment('option', {
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
    },

    /*
     * removes target option if it's not the only date for this day
     * otherwise it deletes time for this date
     */
    deleteOption(target) {
      let position = this.get('dates').indexOf(target);
      let datesForThisDay = this.get('groupedDates').find((group) => {
        return group.value === target.get('day');
      }).items;
      if (datesForThisDay.length > 1) {
        this.get('dates').removeAt(position);
      } else {
        target.set('time', null);
      }
    },

    previousPage() {
      this.onPrevPage();
    },

    submit() {
      if (this.get('validations.isValid')) {
        this.onNextPage();
      } else {
        this.set('shouldShowErrors', true);
      }
    }
  },
  // dates are sorted
  datesForFirstDay: readOnly('groupedDates.firstObject.items'),

  // errorMessage should be reset to null on all user interactions
  errorMesage: null,
  resetErrorMessage: observer('dates.@each.time', function() {
    this.set('errorMessage', null);
  }),

  // can't use multiple computed macros at once
  _timesForFirstDay: mapBy('datesForFirstDay', 'time'),
  timesForFirstDay: filter('_timesForFirstDay', function(time) {
    return isPresent(time);
  }),

  groupedDates: groupBy('dates', raw('day')),

  form: computed(function() {
    return this.childViews.find(function(childView) {
      return childView instanceof Form;
    });
  }),
  formElements: computed('form.childFormElements', function() {
    let formElements = this.get('form.childFormElements');
    return isArray(formElements) ? formElements : [];
  }),
  daysValidationState: computed('formElements.@each.validation', function() {
    return this.get('formElements').reduce(function(daysValidationState, item) {
      const day = item.get('model.day');
      const validation = item.get('validation');
      let currentValidationState;

      // there maybe form elements without model or validation
      if (isEmpty(day) || validation === undefined) {
        return daysValidationState;
      }

      // if it's not existing initialize with current value
      if (!daysValidationState.hasOwnProperty(day)) {
        daysValidationState[day] = validation;
        return daysValidationState;
      }

      currentValidationState = daysValidationState[day];
      switch (currentValidationState) {
        // error overrules all validation states
        case 'error':
          break;

        // null ist overruled by 'error'
        case null:
          if (validation === 'error') {
            daysValidationState[day] = 'error';
          }
          break;

        // success is overruled by anyother validation state
        case 'success':
          daysValidationState[day] = validation;
          break;
      }

      return daysValidationState;
    }, {});
  }),

  store: service()
});
