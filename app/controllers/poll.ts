import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { action } from '@ember/object';
import { DateTime } from 'luxon';
import type IntlService from 'ember-intl/services/intl';
import type RouterService from '@ember/routing/router-service';
import type { PollRouteModel } from 'croodle/routes/poll';
import type PollSettingsService from 'croodle/services/poll-settings';

export default class PollController extends Controller {
  @service declare intl: IntlService;
  @service('poll-settings') declare pollSettingsService: PollSettingsService;
  @service declare router: RouterService;

  declare model: PollRouteModel;

  queryParams = ['encryptionKey'];
  encryptionKey = '';

  get pollSettings() {
    return this.pollSettingsService.getSettings(this.model);
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

  @action
  useLocalTimezone() {
    this.pollSettings.shouldUseLocalTimeZone = true;
  }

  @action
  usePollTimezone() {
    this.pollSettings.shouldUseLocalTimeZone = false;
  }
}
