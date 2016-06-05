import Ember from 'ember';
import moment from 'moment';
import groupBy from 'ember-group-by';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

let modelValidations = buildValidations({
  datetimes: [
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

let datetimeValidation = buildValidations({
  time: [
    validator('time', {
      allowEmpty: true
    }),
    // use option unique validation
    validator('model-alias', {
      alias: 'title',
      dependentKeys: ['option.validations.attrs.isValid'],
      firstMessageOnly: true,
      model: 'option'
    })
  ]
});

let datetimeObject = Ember.Object.extend(datetimeValidation, {
  date: Ember.computed('option.title', function() {
    return moment(this.get('option.title'));
  }),
  dateString: Ember.computed('date', 'i18n.locale', function() {
    const date = this.get('date');
    const locale = this.get('i18n.locale');

    // moment caches locale so we have to check if it's changed
    if (date.locale() !== locale) {
      date.locale(locale);
    }

    return date.format(
        moment.localeData()
          .longDateFormat('LLLL')
          .replace(
            moment.localeData().longDateFormat('LT'), '')
          .trim()
      );
  }),
  i18n: Ember.inject.service(),
  option: null,
  time: Ember.computed('option.title', {
    get() {
      let dateString = this.get('option.title');
      let dateOnly = moment(dateString, 'YYYY-MM-DD', true).isValid();
      if (dateOnly) {
        return null;
      } else {
        return moment(this.get('option.title')).format('HH:mm');
      }
    },
    set(key, value) {
      // check if it's a valid time
      if (!moment(value, 'HH:mm', true).isValid()) {
        return value;
      }

      let [ hours, minutes ] = value.split(':');
      this.set(
        'option.title',
        moment(this.get('option.title')).hour(hours).minute(minutes).toISOString()
      );
      return value;
    }
  }),
  title: Ember.computed.alias('time')
});

export default Ember.Component.extend(modelValidations, {
  actions: {
    addOption(element) {
      let options = this.get('options');
      let elementOption = element.get('option');
      let dateString = moment(
        elementOption.get('title')
      ).format('YYYY-MM-DD');
      let fragment = this.get('store').createFragment('option', {
        title: dateString
      });
      let position = options.indexOf(elementOption) + 1;
      options.insertAt(
        position,
        fragment
      );
    },
    adoptTimesOfFirstDay() {
      const options = this.get('options');
      const groupedDateTimes = this.get('groupedDatetimes');
      const firstDate = groupedDateTimes.get('firstObject');
      const timesOfFirstDate = firstDate.items.map((datetime) => {
        return datetime.get('time');
      }).filter(Ember.isPresent);
      groupedDateTimes.slice(1).forEach((groupedDateTime) => {
        // remove excess options
        if (timesOfFirstDate.get('length') < groupedDateTime.items.length) {
          options.removeObjects(
            groupedDateTime.items.slice(timesOfFirstDate.get('length')).map((datetime) => {
              return datetime.get('option');
            })
          );
        }
        // set times according to first day
        let targetPosition;
        timesOfFirstDate.forEach((timeOfFirstDate, index) => {
          const target = groupedDateTime.items.objectAt(index);
          if (target === undefined) {
            const basisDate = groupedDateTime.items.get('firstObject.date');
            let [hour, minute] = timeOfFirstDate.split(':');
            let dateString = basisDate.hour(hour).minute(minute).toISOString();
            let fragment = this.get('store').createFragment('option', {
              title: dateString
            });
            options.insertAt(
              targetPosition,
              fragment
            );
            targetPosition++;
          } else {
            target.set('time', timeOfFirstDate);
            targetPosition = options.indexOf(target.get('option')) + 1;
          }
        });
      });
    },
    deleteOption(element) {
      let position = this.get('options').indexOf(element.get('option'));
      this.get('options').removeAt(position);
    },
    submit() {
      if (this.get('validations.isValid')) {
        this.sendAction('nextPage');
      } else {
        this.set('shouldShowErrors', true);
      }
    }
  },
  datetimes: Ember.computed('options.[]', 'options.@each.title', function() {
    let options = this.get('options');
    if (Ember.isEmpty(options)) {
      return [];
    } else {
      // filter out non valid ISO 8601 date / datetime strings
      let validDates = options.filter((option) => {
        return moment(option.get('title')).isValid();
      });

      const container = this.get('container');
      // return an array of datetime object for all valid date strings
      return validDates.map((option) => {
        return datetimeObject.create({
          option,
          // necessary for service injection
          container
        });
      });
    }
  }),
  // datetimes grouped by date
  groupedDatetimes: groupBy('datetimes', 'dateString'),
  store: Ember.inject.service('store')
});
