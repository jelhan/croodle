import Ember from 'ember';
import moment from 'moment';
import groupBy from 'ember-group-by';

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

export default Ember.Component.extend({
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
  groupedDatetimes: groupBy('datetimes', 'dateString')
});
