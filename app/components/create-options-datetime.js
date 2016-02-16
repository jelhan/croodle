import Ember from 'ember';
import moment from 'moment';
import groupBy from 'ember-group-by';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

let Validations = buildValidations({
  options: [
    validator('collection', true),
    validator('length', {
      dependentKeys: ['options.[]'],
      min: 2
      // message: Ember.I18n.t('create.options.error.notEnoughOptions')
    }),
    validator('unique-collection', {
      dependentKeys: ['options.[]', 'options.@each.title'],
      property: 'title'
    }),
    validator('valid-collection', {
      dependentKeys: ['options.[]', 'options.@each.title']
    })
  ]
});

let datetimeObject = Ember.Object.extend({
  date: Ember.computed('option.title', function() {
    return moment(this.get('option.title'));
  }),
  dateString: Ember.computed('date', function() {
    return this.get('date').format('YYYY-MM-DD');
  }),
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

export default Ember.Component.extend(Validations, {
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
    delOption(element) {
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

      // return an array of datetime object for all valid date strings
      return validDates.map((option) => {
        return datetimeObject.create({
          option
        });
      });
    }
  }),
  // datetimes grouped by date
  groupedDatetimes: groupBy('datetimes', 'dateString'),
  store: Ember.inject.service('store')
});
