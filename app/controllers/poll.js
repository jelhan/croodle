import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';
import { isPresent, isEmpty } from '@ember/utils';
import { observer, computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  actions: {
    linkAction(type) {
      let flashMessages = this.flashMessages;
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

  currentLocale: readOnly('i18n.locale'),

  encryption: service(),
  encryptionKey: '',
  queryParams: ['encryptionKey'],

  flashMessages: service(),

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

  i18n: service(),

  momentLongDayFormat: computed('currentLocale', function() {
    let currentLocale = this.currentLocale;
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
      this.encryptionKey !== this.get('encryption.key')
    ) {
      // work-a-round for url not being updated
      window.location.hash = window.location.hash.replace(this.encryptionKey, this.get('encryption.key'));

      this.set('encryptionKey', this.get('encryption.key'));
    }
  }),

  showExpirationWarning: computed('model.expirationDate', function() {
    let expirationDate = this.get('model.expirationDate');
    if (isEmpty(expirationDate)) {
      return false;
    }
    return moment().add(2, 'weeks').isAfter(moment(expirationDate));
  }),

  timezoneChoosen: false,

  /*
   * return true if current timezone differs from timezone poll got created with
   */
  timezoneDiffers: computed('model.timezone', function() {
    const modelTimezone = this.get('model.timezone');
    return isPresent(modelTimezone) && moment.tz.guess() !== modelTimezone;
  }),

  useLocalTimezone: false,

  mustChooseTimezone: computed('timezoneDiffers', 'timezoneChoosen', function() {
    return this.timezoneDiffers && !this.timezoneChoosen;
  }),

  timezone: computed('useLocalTimezone', function() {
    return this.useLocalTimezone ? undefined : this.get('model.timezone');
  })
});
