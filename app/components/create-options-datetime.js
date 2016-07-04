import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
import { groupBy } from 'ember-array-computed-macros';

const { isEmpty, isPresent } = Ember;
const { filter, mapBy, readOnly } = Ember.computed;

let modelValidations = buildValidations({
  dates: [
    validator('collection', true),
    validator('length', {
      dependentKeys: ['datetimes.[]'],
      min: 1
    }),
    validator('valid-collection', {
      dependentKeys: ['datetimes.[]', 'datetimes.@each.time']
    })
  ]
});

export default Ember.Component.extend(modelValidations, {
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
      const timesForFirstDay = this.get('timesForFirstDay');
      const datesWithoutFirstDay = this.get('groupedDates').slice(1);
      datesWithoutFirstDay.forEach((groupedDate) => {
        if (isEmpty(timesForFirstDay)) {
          // there aren't any times on first day
          const remainingOption = groupedDate.get('firstObject');
          // remove all times but the first one
          dates.removeObjects(
            groupedDate.slice(1)
          );
          // set title as date without time
          remainingOption.set('title', remainingOption.get('date').format('YYYY-MM-DD'));
        } else {
          // adopt times of first day
          if (timesForFirstDay.get('length') < groupedDate.length) {
            // remove excess options
            dates.removeObjects(
              groupedDate.slice(timesForFirstDay.get('length'))
            );
          }
          // set times according to first day
          let targetPosition;
          timesForFirstDay.forEach((timeOfFirstDate, index) => {
            const target = groupedDate.objectAt(index);
            if (target === undefined) {
              const basisDate = groupedDate.get('firstObject.date').clone();
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
      let datesForThisDay = this.get('groupedDates').find((groupedDate) => {
        return groupedDate.get('firstObject.day') === target.get('day');
      });
      if (datesForThisDay.length > 1) {
        this.get('dates').removeAt(position);
      } else {
        target.set('time', null);
      }
    },
    submit() {
      if (this.get('validations.isValid')) {
        this.sendAction('nextPage');
      } else {
        this.set('shouldShowErrors', true);
      }
    }
  },
  // dates are sorted
  datesForFirstDay: readOnly('groupedDates.firstObject'),
  _timesForFirstDay: mapBy('datesForFirstDay', 'time'),
  timesForFirstDay: filter('_timesForFirstDay', function(time) {
    return isPresent(time);
  }),
  groupedDates: groupBy('dates', 'day'),
  store: Ember.inject.service('store')
});
