import Ember from 'ember';
import moment from 'moment';
/* global jstz */

const {
  computed,
  Controller,
  inject,
  isEmpty,
  isPresent,
  observer
} = Ember;

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

  currentLocale: computed.readOnly('i18n.locale'),

  encryption: inject.service(),
  encryptionKey: '',
  queryParams: ['encryptionKey'],

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

  i18n: inject.service(),

  momentLongDayFormat: computed('currentLocale', function() {
    let currentLocale = this.get('currentLocale');
    return moment.localeData(currentLocale)
      .longDateFormat('LLLL')
      .replace(
        moment.localeData(currentLocale).longDateFormat('LT'), '')
      .trim();
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
