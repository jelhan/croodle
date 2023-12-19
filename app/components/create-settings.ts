import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { DateTime, Duration } from 'luxon';
import { generatePassphrase } from '../utils/encryption';
import Poll from '../models/poll';
import type IntlService from 'ember-intl/services/intl';
import type RouterService from '@ember/routing/router-service';
import type { CreateSettingsRouteModel } from 'croodle/routes/create/settings';

export interface CreateSettingsSignature {
  Args: {
    poll: CreateSettingsRouteModel;
  };
}

export default class CreateSettingsComponent extends Component<CreateSettingsSignature> {
  @service declare intl: IntlService;
  @service declare router: RouterService;

  @tracked savingPollFailed = false;

  get anonymousUser() {
    return this.args.poll.anonymousUser;
  }
  set anonymousUser(value) {
    this.args.poll.anonymousUser = value;
  }

  get answerType() {
    return this.args.poll.answerType;
  }
  set answerType(value) {
    this.args.poll.answerType = value;
  }

  get answerTypes() {
    return [
      { id: 'YesNo', labelTranslation: 'answerTypes.yesNo.label' },
      { id: 'YesNoMaybe', labelTranslation: 'answerTypes.yesNoMaybe.label' },
      { id: 'FreeText', labelTranslation: 'answerTypes.freeText.label' },
    ];
  }

  get expirationDuration() {
    // TODO: must be calculated based on model.expirationDate
    return 'P3M';
  }
  set expirationDuration(value) {
    this.args.poll.expirationDate = isPresent(value)
      ? (DateTime.local().plus(Duration.fromISO(value)).toISO() as string)
      : '';
  }

  get expirationDurations() {
    return [
      {
        id: 'P7D',
        labelTranslation: 'create.settings.expirationDurations.P7D',
      },
      {
        id: 'P1M',
        labelTranslation: 'create.settings.expirationDurations.P1M',
      },
      {
        id: 'P3M',
        labelTranslation: 'create.settings.expirationDurations.P3M',
      },
      {
        id: 'P6M',
        labelTranslation: 'create.settings.expirationDurations.P6M',
      },
      {
        id: 'P1Y',
        labelTranslation: 'create.settings.expirationDurations.P1Y',
      },
      { id: '', labelTranslation: 'create.settings.expirationDurations.never' },
    ];
  }

  get forceAnswer() {
    return this.args.poll.forceAnswer;
  }
  set forceAnswer(value) {
    this.args.poll.forceAnswer = value;
  }

  @action
  previousPage() {
    const { pollType } = this.args.poll;

    if (pollType === 'FindADate') {
      this.router.transitionTo('create.options-datetime');
    } else {
      this.router.transitionTo('create.options');
    }
  }

  @action
  async createPoll() {
    const { poll } = this.args;
    const {
      anonymousUser,
      answerType,
      description,
      expirationDate,
      forceAnswer,
      freetextOptions,
      dateOptions,
      timesForDateOptions,
      pollType,
      title,
    } = poll;

    // calculate options
    const options: string[] = [];
    if (pollType === 'FindADate') {
      // merge date with times
      for (const date of dateOptions) {
        if (timesForDateOptions.has(date)) {
          for (const time of timesForDateOptions.get(date)!) {
            const [hour, minute] = time.split(':') as [string, string];
            options.push(
              DateTime.fromISO(date)
                .set({
                  hour: parseInt(hour),
                  minute: parseInt(minute),
                  second: 0,
                  millisecond: 0,
                })
                .toISO() as string,
            );
          }
        } else {
          options.push(date);
        }
      }
    } else {
      options.push(...freetextOptions);
    }

    // save poll
    try {
      const encryptionKey = generatePassphrase();

      // save poll
      const poll = await Poll.create(
        {
          anonymousUser,
          answerType,
          description,
          expirationDate,
          forceAnswer,
          options: options.map((option) => {
            return { title: option };
          }),
          pollType,
          title,
        },
        encryptionKey,
      );

      // redirect to new poll
      await this.router.transitionTo('poll.participation', poll.id, {
        queryParams: {
          encryptionKey,
        },
      });
    } catch (err) {
      this.savingPollFailed = true;

      reportError(err);
    }
  }

  @action
  resetSavingPollFailedState() {
    this.savingPollFailed = false;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CreateSettings: typeof CreateSettingsComponent;
  }
}
