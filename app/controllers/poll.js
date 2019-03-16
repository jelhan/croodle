import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';
import { isPresent, isEmpty } from '@ember/utils';
import { observer, computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  encryption: service(),
  flashMessages: service(),
  i18n: service(),
  router: service(),

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

  encryptionKey: '',
  queryParams: ['encryptionKey'],

  momentLongDayFormat: computed('currentLocale', function() {
    let currentLocale = this.currentLocale;
    return moment.localeData(currentLocale)
      .longDateFormat('LLLL')
      .replace(
        moment.localeData(currentLocale).longDateFormat('LT'), '')
      .trim();
  }),

  poll: readOnly('model'),
  pollUrl: computed('router.currentURL', 'encryptionKey', function() {
    return window.location.href;
  }),

  // TODO: Remove this code. It's spooky.
  preventEncryptionKeyChanges: observer('encryptionKey', function() {
    if (
      !isEmpty(this.encryption.key) &&
      this.encryptionKey !== this.encryption.key
    ) {
      // work-a-round for url not being updated
      window.location.hash = window.location.hash.replace(this.encryptionKey, this.encryption.key);

      this.set('encryptionKey', this.encryption.key);
    }
  }),

  showExpirationWarning: computed('poll.expirationDate', function() {
    let expirationDate = this.poll.expirationDate;
    if (isEmpty(expirationDate)) {
      return false;
    }
    return moment().add(2, 'weeks').isAfter(moment(expirationDate));
  }),

  timezoneChoosen: false,

  /*
   * return true if current timezone differs from timezone poll got created with
   */
  timezoneDiffers: computed('poll.timezone', function() {
    let modelTimezone = this.poll.timezone;
    return isPresent(modelTimezone) && moment.tz.guess() !== modelTimezone;
  }),

  useLocalTimezone: false,

  mustChooseTimezone: computed('timezoneDiffers', 'timezoneChoosen', function() {
    return this.timezoneDiffers && !this.timezoneChoosen;
  }),

  timezone: computed('useLocalTimezone', function() {
    return this.useLocalTimezone ? undefined : this.poll.timezone;
  })
});
