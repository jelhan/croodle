import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isPresent, isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { DateTime } from 'luxon';
import { tracked } from '@glimmer/tracking';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import type IntlService from 'ember-intl/services/intl';
import type RouterService from '@ember/routing/router-service';
import type { PollRouteModel } from 'croodle/routes/poll';

export default class PollController extends Controller {
  @service declare flashMessages: FlashMessagesService;
  @service declare intl: IntlService;
  @service declare router: RouterService;

  declare model: PollRouteModel;

  queryParams = ['encryptionKey'];
  encryptionKey = '';

  @tracked timezoneChoosen = false;
  @tracked shouldUseLocalTimezone = false;

  get pollUrl() {
    // consume information, which may cause a change to the URL to ensure
    // getter is invalided if needed
    this.router.currentURL;
    this.encryptionKey;

    return window.location.href;
  }

  get showExpirationWarning() {
    const { model: poll } = this;
    const { expirationDate } = poll;

    if (isEmpty(expirationDate)) {
      return false;
    }
    return (
      DateTime.local().plus({ weeks: 2 }) >= DateTime.fromISO(expirationDate)
    );
  }

  /*
   * return true if current timezone differs from timezone poll got created with
   */
  get timezoneDiffers() {
    const { model: poll } = this;
    const { timezone: pollTimezone } = poll;

    return (
      isPresent(pollTimezone) &&
      Intl.DateTimeFormat().resolvedOptions().timeZone !== pollTimezone
    );
  }

  get mustChooseTimezone() {
    return this.timezoneDiffers && !this.timezoneChoosen;
  }

  get timezone() {
    const { model: poll, shouldUseLocalTimezone } = this;

    return shouldUseLocalTimezone ? undefined : poll.timezone;
  }

  @action
  linkAction(type: 'copied' | 'selected') {
    const flashMessages = this.flashMessages;
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
    this.shouldUseLocalTimezone = true;
    this.timezoneChoosen = true;
  }

  @action
  usePollTimezone() {
    this.timezoneChoosen = true;
  }
}
