import Ember from 'ember';
import moment from 'moment';

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
    set(key, value) {
      // ember-cli-bootstrap-datepicker returns an array of Date objects
      let newOptions = [];
      if (Ember.isArray(value) && value.length > 0) {
        value.sort(function(a, b) {
          return a.getTime() - b.getTime();
        });

        newOptions = value.map((item) => {
          return this.get('store').createFragment('option', {
            title: moment(item).format('YYYY-MM-DD')
          });
        });
      }
      this.set('options', newOptions);

      return value;
    }
  }),

  store: Ember.inject.service('store')
});
