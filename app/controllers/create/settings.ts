import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { action } from '@ember/object';
import { DateTime, Duration } from 'luxon';
import Poll from '../../models/poll';
import { generatePassphrase } from '../../utils/encryption';
import type RouterService from '@ember/routing/router-service';
import type { CreateSettingsRouteModel } from 'croodle/routes/create/settings';
import type IntlService from 'ember-intl/services/intl';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import { tracked } from '@glimmer/tracking';

export default class CreateSettings extends Controller {
  @service declare flashMessages: FlashMessagesService;
  @service declare intl: IntlService;
  @service declare router: RouterService;

  declare model: CreateSettingsRouteModel;

  @tracked savingPollFailed = false;

  get anonymousUser() {
    return this.model.anonymousUser;
  }
  set anonymousUser(value) {
    this.model.anonymousUser = value;
  }

  get answerType() {
    return this.model.answerType;
  }
  set answerType(value) {
    this.model.answerType = value;
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
    this.model.expirationDate = isPresent(value)
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
    return this.model.forceAnswer;
  }
  set forceAnswer(value) {
    this.model.forceAnswer = value;
  }

  @action
  previousPage() {
    const { pollType } = this.model;

    if (pollType === 'FindADate') {
      this.router.transitionTo('create.options-datetime');
    } else {
      this.router.transitionTo('create.options');
    }
  }

  @action
  async createPoll() {
    const { model } = this;
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
    } = model;

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
