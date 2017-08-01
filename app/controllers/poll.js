import Ember from 'ember';
import moment from 'moment';
/* global jstz */

const {
  ArrayProxy,
  computed,
  Controller,
  getOwner,
  inject,
  isEmpty,
  isPresent,
  Object: EmberObject,
  observer
} = Ember;

const dateObject = EmberObject.extend({
  i18n: inject.service(),
  init() {
    // retrive locale on init to setup observers
    this.get('i18n.locale');
  },
  date: computed('dateString', 'i18n.locale', function() {
    let value = this.get('dateString');
    let date;

    if (isEmpty(value)) {
      return null;
    }

    date = moment(value);

    if (
      this.get('hasTime') &&
      !this.get('useLocalTimezone')
    ) {
      date.tz(this.get('timezone'));
    }

    return date;
  }),
  formatted: computed('date', 'hasTime', 'timezone', 'useLocaleTImezone', function() {
    let date = this.get('date');

    if (!moment.isMoment(date)) {
      return '';
    }

    if (
      this.get('hasTime') &&
      !this.get('useLocaleTimezone') &&
      isPresent(this.get('timezone'))
    ) {
      date.tz(this.get('timezone'));
    }

    return this.get('hasTime') ? date.format('LLLL') : date.format(
      moment.localeData()
        .longDateFormat('LLLL')
        .replace(
          moment.localeData().longDateFormat('LT'), '')
        .trim()
    );
  }),
  formattedTime: computed('date', function() {
    let date = this.get('title');

    if (!moment.isMoment(date)) {
      return '';
    }

    return date.format('LT');
  }),
  hasTime: computed('dateString', function() {
    return moment(this.get('dateString'), 'YYYY-MM-DD', true).isValid() === false;
  }),
  title: computed.readOnly('date')
});

export default Controller.extend({
  actions: {
    linkAction(type) {
      let flashMessages = this.get('flashMessages');
      switch (type) {
        case 'copied':
          flashMessages.success(`poll.link.copied`);
          break;

        case 'selected':
          flashMessages.info(`poll.link.selected`);
          break;
      }
    },
    useLocalTimezone() {
      this.set('useLocalTimezone', true);
      this.set('timezoneChoosen', true);
    }
  },

  encryption: inject.service(),
  encryptionKey: '',
  queryParams: ['encryptionKey'],

  /*
   * handles options if they are dates
   */
  dates: computed('model.options', 'model.timezone', 'useLocalTimezone', function() {
    let owner = getOwner(this);
    let timezone = this.get('model.timezone');
    let useLocalTimezone = this.get('useLocalTimezone');

    return ArrayProxy.create({
      content: this.get('model.options'),
      objectAtContent(idx) {
        return dateObject.create(owner.ownerInjection(), {
          dateString: this.get('content').objectAt(idx).get('title'),
          timezone,
          useLocalTimezone
        });
      }
    });
  }),

  flashMessages: inject.service(),

  hasTimes: computed('model.options.[]', function() {
    if (this.get('model.isMakeAPoll')) {
      return false;
    } else {
      return this.get('model.options').any((option) => {
        let dayStringLength = 10; // 'YYYY-MM-DD'.length
        return option.get('title').length > dayStringLength;
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
  }),

  timezone: computed('useLocalTimezone', function() {
    return this.get('useLocalTimezone') ? undefined : this.get('model.timezone');
  })
});
