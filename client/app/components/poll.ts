import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { DateTime } from 'luxon';
import type RouterService from '@ember/routing/router-service';
import type { PollRouteModel } from '@croodle/client/routes/poll';
import type PollSettingsService from '@croodle/client/services/poll-settings';
import type IntlService from 'ember-intl/services/intl';

export interface PollSignature {
  // The arguments accepted by the component
  Args: {
    poll: PollRouteModel;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class Poll extends Component<PollSignature> {
  @service declare intl: IntlService;
  @service('poll-settings') declare pollSettingsService: PollSettingsService;
  @service declare router: RouterService;

  get pollSettings() {
    const { poll } = this.args;

    return this.pollSettingsService.getSettings(poll);
  }

  get showExpirationWarning() {
    const { poll } = this.args;
    const { expirationDate } = poll;

    if (!expirationDate) {
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    Poll: typeof Poll;
  }
}
