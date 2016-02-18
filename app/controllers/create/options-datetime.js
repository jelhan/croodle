import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  actions: {
    nextPage() {
      this.normalizeOptions();

      this.transitionToRoute('create.settings');
    }
  },

  normalizeOptions() {
    const options = this.get('options');

    // remove all days from options which haven't a time but there is atleast
    // one option with time for that day
    const daysWithTime = options.map((option) => {
      if (moment(option.get('title'), 'YYYY-MM-DD', true).isValid()) {
        return null;
      } else {
        return moment(option.get('title')).format('YYYY-MM-DD');
      }
    }).uniq().filter((option) => option !== null);
    const removeObjects = options.filter((option) => {
      return daysWithTime.indexOf(option.get('title')) !== -1;
    });
    options.removeObjects(
      removeObjects
    );

    // sort options
    // ToDo: Find a better way without reseting the options
    this.set('options', options.sortBy('title'));
  },
  isDateTime: Ember.computed.alias('model.isDateTime'),
  options: Ember.computed.alias('model.options')
});
