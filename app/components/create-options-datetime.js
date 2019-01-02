import { inject as service } from '@ember/service';
import { readOnly, mapBy, filter } from '@ember/object/computed';
import Component from '@ember/component';
import { isPresent, isEmpty } from '@ember/utils';
import { observer, computed, get } from '@ember/object';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
import { raw } from 'ember-awesome-macros';
import { groupBy } from 'ember-awesome-macros/array';
import { next, scheduleOnce } from '@ember/runloop';
import BsForm from 'ember-bootstrap/components/bs-form';
import BsFormElement from 'ember-bootstrap/components/bs-form/element';

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
    },
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

        next(() => {
          this.notifyPropertyChange('_nestedChildViews');
        });
      });
    },

    /*
     * removes target option if it's not the only date for this day
     * otherwise it deletes time for this date
     */
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

  childFormElements: computed('_nestedChildViews', function() {
    let form = this.childViews.find((childView) => {
      return childView instanceof BsForm;
    });

    if (!form) {
      return [];
    }

    return form.childViews.filter((childView) => {
      return childView instanceof BsFormElement;
    });
  }),

  // Can't use a computed property cause Ember Bootstrap seem to modify validation twice in a single render.
  // Therefor we use the scheduleOnce trick.
  // This is the same for {{create-options-text}} component.
  daysValidationState: null,
  updateDaysValidationState: observer('childFormElements.@each.validation', function() {
    scheduleOnce('sync', () => {
      this.set('daysValidationState',
        this.childFormElements.reduce(function(daysValidationState, item) {
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
        }, {})
      );
    });
  }).on('init'),

  store: service(),

  didInsertElement() {
    // childViews is not observeable by default. Need to notify about a change manually.
    // Lucky enough we know that child views will only be changed on init and if times are added / removed.
    this.notifyPropertyChange('_nestedChildViews');
  }
});
