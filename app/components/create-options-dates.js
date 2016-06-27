import Ember from 'ember';
import moment from 'moment';

const { isArray, isEmpty } = Ember;

export default Ember.Component.extend({
  i18n: Ember.inject.service(),

  /*
   * maps optionsDates for bootstrap datepicker as a simple array of date objects
   */
  optionsBootstrapDatepicker: Ember.computed('options', {
    get() {
      const options = this.get('options');
      const validDates = options.filter(function(option) {
        return moment(option.get('title')).isValid();
      });
      const normalizedDates = validDates.map(function(option) {
        return moment(option.get('title'))
                 .hour(0)
                 .minute(0)
                 .millisecond(0);
      });
      // convert to primitive to allow support Ember.Array.uniq()
      const uniqueDateStrings = normalizedDates
                                  .map((moment) => {
                                    return moment.toISOString();
                                  })
                                  .uniq();
      const dateObjects = uniqueDateStrings.map(function(dateString) {
        return moment(dateString).toDate();
      });
      return dateObjects;
    },
    /*
     * value is an of Date objects set by ember-cli-bootstrap-datepicker
     */
    set(key, days) {
      // remove all days if value isn't an array of if it's empty
      if (!isArray(days) || isEmpty(days)) {
        this.set('options', []);
        return [];
      }

      // get days in correct order
      days.sort(function(a, b) {
        return a.getTime() - b.getTime();
      });

      const options = this.get('options');
      // array of date objects
      const newDays = days.filter((day) => {
        return options.every((option) => {
          return moment(day).format('YYYY-MM-DD') !== option.get('day');
        });
      });
      // array of options fragments
      const optionsForRemovedDays = options.filter((option) => {
        return days.every((day) => {
          return moment(day).format('YYYY-MM-DD') !== option.get('day');
        });
      });

      options.removeObjects(optionsForRemovedDays);
      newDays.forEach((newDay) => {
        // new days must be entered at correct position
        const insertBefore = options.find((option) => {
          // options are sorted
          // so we search for first option which value is greater than newDay
          return option.get('date').valueOf() > newDay.valueOf();
        });
        let position;
        if (isEmpty(insertBefore)) {
          // newDay is after all existing days
          position = options.get('length');
        } else {
          position = options.indexOf(insertBefore);
        }
        options.insertAt(
          position,
          this.get('store').createFragment('option', {
            title: moment(newDay).format('YYYY-MM-DD')
          })
        );
      });

      return days;
    }
  }),

  store: Ember.inject.service('store')
});
