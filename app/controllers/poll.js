import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';
import { isPresent, isEmpty } from '@ember/utils';
import { action, computed } from '@ember/object';
import { observes } from '@ember-decorators/object';
import moment from 'moment';
import { DateTime } from 'luxon';

export default class PollController extends Controller {
  @service
  encryption;

  @service
  flashMessages;

  @service
  intl;

  @service
  router;

  queryParams = ['encryptionKey'];

  encryptionKey = '';
  timezoneChoosen = false;
  useLocalTimezone = false;

  @readOnly('intl.primaryLocale')
  currentLocale;

  @readOnly('model')
  poll;

  @computed('router.currentURL', 'encryptionKey')
  get pollUrl() {
    return window.location.href;
  }

  @computed('poll.expirationDate')
  get showExpirationWarning() {
    let expirationDate = this.poll.expirationDate;
    if (isEmpty(expirationDate)) {
      return false;
    }
    return DateTime.local().plus({ weeks: 2 }) >= DateTime.fromISO(expirationDate);
  }

  /*
   * return true if current timezone differs from timezone poll got created with
   */
  @computed('poll.timezone')
  get timezoneDiffers() {
    let modelTimezone = this.poll.timezone;
    return isPresent(modelTimezone) && moment.tz.guess() !== modelTimezone;
  }

  @computed('timezoneDiffers', 'timezoneChoosen')
  get mustChooseTimezone() {
    return this.timezoneDiffers && !this.timezoneChoosen;
  }

  @computed('poll.timezone', 'useLocalTimezone')
  get timezone() {
    return this.useLocalTimezone ? undefined : this.poll.timezone;
  }

  @action
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
  }

  @action
  useLocalTimezone() {
    this.set('useLocalTimezone', true);
    this.set('timezoneChoosen', true);
  }

  // TODO: Remove this code. It's spooky.
  @observes('encryptionKey')
  preventEncryptionKeyChanges() {
    if (
      !isEmpty(this.encryption.key) &&
      this.encryptionKey !== this.encryption.key
    ) {
      // work-a-round for url not being updated
      window.location.hash = window.location.hash.replace(this.encryptionKey, this.encryption.key);

      this.set('encryptionKey', this.encryption.key);
    }
  }
}
