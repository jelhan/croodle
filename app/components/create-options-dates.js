import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  /*
   * maps optionsDates for bootstrap datepicker as a simple array of date objects
   */
  optionsBootstrapDatepicker: Ember.computed('options', {
    get() {
      return this.get('options')
               .filter(function(option) {
                 return moment(option.get('title')).isValid();
               })
               .map(function(option) {
                 return moment(option.get('title')).toDate();
               });
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
