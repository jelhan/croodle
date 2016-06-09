import Ember from 'ember';
import groupBy from 'ember-group-by';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const { isEmpty } = Ember;

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
      const groupedDates = this.get('groupedDates');
      const firstDate = groupedDates.get('firstObject');
      const timesOfFirstDate = firstDate.items.map((dates) => {
        return dates.get('time');
      }).filter(Ember.isPresent);
      groupedDates.slice(1).forEach((groupedDate) => {
        if (isEmpty(timesOfFirstDate)) {
          // there aren't any times on first day
          const remainingOption = groupedDate.items.get('firstObject');
          // remove all times but the first one
          dates.removeObjects(
            groupedDate.items.slice(1)
          );
          // set title as date without time
          remainingOption.set('title', remainingOption.get('date').format('YYYY-MM-DD'));
        } else {
          // adopt times of first day
          if (timesOfFirstDate.get('length') < groupedDate.items.length) {
            // remove excess options
            dates.removeObjects(
              groupedDate.items.slice(timesOfFirstDate.get('length'))
            );
          }
          // set times according to first day
          let targetPosition;
          timesOfFirstDate.forEach((timeOfFirstDate, index) => {
            const target = groupedDate.items.objectAt(index);
            if (target === undefined) {
              const basisDate = groupedDate.items.get('firstObject.date').clone();
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
    deleteOption(target) {
      let position = this.get('dates').indexOf(target);
      this.get('dates').removeAt(position);
    },
    submit() {
      if (this.get('validations.isValid')) {
        this.sendAction('nextPage');
      } else {
        this.set('shouldShowErrors', true);
      }
    }
  },
  groupedDates: groupBy('dates', 'day'),
  store: Ember.inject.service('store')
});
