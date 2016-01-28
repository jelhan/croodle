import Ember from 'ember';
import moment from 'moment';
/* global jstz */

export default Ember.Controller.extend({
  encryption: Ember.inject.service(),
  encryptionKey: '',
  queryParams: ['encryptionKey'],

  dateGroups: function() {
    // group dates only for find a date with times
    if (
      this.get('model.isFindADate') !== true ||
      this.get('model.isDateTime') !== true
    ) {
      return [];
    }

    const datetimes = this.get('dates');
    let dateGroups = [];

    let count = 0;
    let lastDate = null;
    datetimes.forEach(function(el) {
      let date = new Date(el.title);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);

      if (lastDate === null) {
        lastDate = date;
      }

      if (date.getTime() === lastDate.getTime()) {
        count++;
      } else {
        // push last values;
        dateGroups.pushObject({
          'value': lastDate,
          'colspan': count
        });

        // set lastDate to current date and reset count
        lastDate = date;
        count = 1;
      }
    });
    dateGroups.pushObject({
      'value': lastDate,
      'colspan': count
    });

    return dateGroups;
  }.property('dates.@each'),

  /*
   * handles options if they are dates
   */
  dates: function() {
    let timezone = false;
    let dates = [];

    // if poll type is find a date
    // we return an empty array
    if (!this.get('model.isFindADate')) {
      return [];
    }

    // if poll has dates with times we have to care about timezone
    // but since user timezone is default we only have to set timezone
    // if timezone poll got created in should be used
    if (
      this.get('model.isDateTime') &&
      !this.get('useLocalTimezone')
    ) {
      timezone = this.get('model.timezone');
    }

    dates = this.get('model.options').map((option) => {
      let date = moment(option.get('title'));
      if (timezone) {
        date.tz(timezone);
      }
      return {
        title: date
      };
    });

    return dates;
  }.property('model.options.@each', 'useLocalTimezone'),

  pollUrl: function() {
    return window.location.href;
  }.property('currentPath', 'encryptionKey'),

  preventEncryptionKeyChanges: function() {
    if (
      !Ember.isEmpty(this.get('encryption.key')) &&
      this.get('encryptionKey') !== this.get('encryption.key')
    ) {
      // work-a-round for url not being updated
      window.location.hash = window.location.hash.replace(this.get('encryptionKey'), this.get('encryption.key'));

      this.set('encryptionKey', this.get('encryption.key'));
    }
  }.observes('encryptionKey'),

  /*
   * return true if current timezone differs from timezone poll got created with
   */
  timezoneDiffers: function() {
    return jstz.determine().name() !== this.get('model.timezone');
  }.property('model.timezone'),

  useLocalTimezone: function() {
    return false;
  }.property()
});
