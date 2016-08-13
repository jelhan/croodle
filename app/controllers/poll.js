import Ember from 'ember';
import moment from 'moment';
/* global jstz */

const {
  computed,
  Controller,
  getOwner,
  inject,
  isEmpty,
  isPresent,
  Object: EmberObject,
  observer
} = Ember;

export default Controller.extend({
  actions: {
    useLocalTimezone() {
      this.set('useLocalTimezone', true);
      this.set('timezoneChoosen', true);
    }
  },

  encryption: inject.service(),
  encryptionKey: '',
  queryParams: ['encryptionKey'],

  dateGroups: computed('dates.[]', function() {
    // group dates only for find a date
    // and if there is atleast one time
    if (
      this.get('model.isFindADate') !== true &&
      this.get('hasTimes')
    ) {
      return [];
    }

    const datetimes = this.get('dates');
    const dateGroupObject = EmberObject.extend({
      colspan: null,
      formatted: computed('value', 'i18n.locale', function() {
        const date = this.get('value');
        const locale = this.get('i18n.locale');
        const longDateFormat = moment.localeData().longDateFormat('LLLL')
                                      .replace(
                                        moment.localeData().longDateFormat('LT'), '')
                                      .trim();

        // moment caches locale so we have to check if it's changed
        if (date.locale() !== locale) {
          date.locale(locale);
        }

        return date.format(longDateFormat);
      }),
      i18n: inject.service(),
      value: null
    });
    // need to inject owner into dateGroupObject to support service injection
    const owner = getOwner(this);
    let dateGroups = [];

    let count = 0;
    let lastDate = null;
    datetimes.forEach(function(el) {
      let date = moment(el.title)
                   .hour(0)
                   .minute(0)
                   .seconds(0)
                   .milliseconds(0);

      if (lastDate === null) {
        lastDate = date;
      }

      if (date.valueOf() === lastDate.valueOf()) {
        count++;
      } else {
        // push last values;
        dateGroups.pushObject(
          dateGroupObject.create(owner.ownerInjection(), {
            'value': lastDate,
            'colspan': count
          })
        );

        // set lastDate to current date and reset count
        lastDate = date;
        count = 1;
      }
    });
    dateGroups.pushObject(
      dateGroupObject.create(owner.ownerInjection(), {
        'value': lastDate,
        'colspan': count
      })
    );

    return dateGroups;
  }),

  /*
   * handles options if they are dates
   */
  dates: computed('model.options.[]', 'useLocalTimezone', function() {
    let timezone = false;
    let dates = [];
    const dateObject = EmberObject.extend({
      i18n: inject.service(),
      init() {
        // retrive locale to setup observers
        this.get('i18n.locale');
      },
      formatted: computed('title', 'i18n.locale', function() {
        const date = this.get('title');
        const locale = this.get('i18n.locale');

        // locale is stored on date, we have to override it if it has changed since creation
        if (date.locale() !== locale) {
          date.locale(this.get('i18n.locale'));
        }

        return this.get('hasTime') ? date.format('LLLL') : date.format(
          moment.localeData()
            .longDateFormat('LLLL')
            .replace(
              moment.localeData().longDateFormat('LT'), '')
            .trim()
        );
      }),
      formattedTime: computed('title', 'i18n.locale', function() {
        const date = this.get('title');
        const locale = this.get('i18n.locale');

        // locale is stored on date, we have to override it if it has changed since creation
        if (date.locale() !== locale) {
          date.locale(this.get('i18n.locale'));
        }

        return date.format('LT');
      })
    });

    // if poll type is find a date
    // we return an empty array
    if (!this.get('model.isFindADate')) {
      return [];
    }

    // if poll has dates with times we have to care about timezone
    // but since user timezone is default we only have to set timezone
    // if timezone poll got created in should be used
    if (
      this.get('hasTimes') &&
      !this.get('useLocalTimezone')
    ) {
      timezone = this.get('model.timezone');
    }

    const owner = getOwner(this);
    dates = this.get('model.options').map((option) => {
      const date = moment(option.get('title'));
      const hasTime = moment(option.get('title'), 'YYYY-MM-DD', true).isValid() === false;
      if (timezone && hasTime) {
        date.tz(timezone);
      }
      return dateObject.create(owner.ownerInjection(), {
        title: date,
        hasTime
      });
    });

    return dates;
  }),

  hasTimes: computed('model.options.[]', function() {
    if (this.get('model.isMakeAPoll')) {
      return false;
    } else {
      return this.get('model.options').any((option) => {
        return moment(option.get('title'), 'YYYY-MM-DD', true).isValid() === false;
      });
    }
  }),

  pollUrl: computed('currentPath', 'encryptionKey', function() {
    return window.location.href;
  }),

  preventEncryptionKeyChanges: observer('encryptionKey', function() {
    if (
      !isEmpty(this.get('encryption.key')) &&
      this.get('encryptionKey') !== this.get('encryption.key')
    ) {
      // work-a-round for url not being updated
      window.location.hash = window.location.hash.replace(this.get('encryptionKey'), this.get('encryption.key'));

      this.set('encryptionKey', this.get('encryption.key'));
    }
  }),

  timezoneChoosen: false,

  /*
   * return true if current timezone differs from timezone poll got created with
   */
  timezoneDiffers: computed('model.timezone', function() {
    const modelTimezone = this.get('model.timezone');
    return isPresent(modelTimezone) && jstz.determine().name() !== modelTimezone;
  }),

  useLocalTimezone: false,

  mustChooseTimezone: computed('timezoneDiffers', 'timezoneChoosen', function() {
    return this.get('timezoneDiffers') && !this.get('timezoneChoosen');
  })
});
