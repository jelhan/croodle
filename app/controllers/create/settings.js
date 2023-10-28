import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { action } from '@ember/object';
import { DateTime, Duration } from 'luxon';
import Poll from '../../models/poll';
import { generatePassphrase } from '../../utils/encryption';

export default class CreateSettings extends Controller {
  @service flashMessages;
  @service intl;
  @service router;

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
      ? DateTime.local().plus(Duration.fromISO(value)).toISO()
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
    let { pollType } = this.model;

    if (pollType === 'FindADate') {
      this.router.transitionTo('create.options-datetime');
    } else {
      this.router.transitionTo('create.options');
    }
  }

  @action
  async submit() {
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
    let options = [];
    if (pollType === 'FindADate') {
      // merge date with times
      for (const date of dateOptions) {
        if (timesForDateOptions.has(date)) {
          for (const time of timesForDateOptions.get(date)) {
            const [hour, minute] = time.split(':');
            options.push(
              DateTime.fromISO(date)
                .set({
                  hour,
                  minute,
                  second: 0,
                  millisecond: 0,
                })
                .toISO(),
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
          creationDate: new Date().toISOString(),
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
      await this.router.transitionTo('poll', poll.id, {
        queryParams: {
          encryptionKey,
        },
      });
    } catch (err) {
      this.flashMessages.danger('error.poll.savingFailed');

      throw err;
    }
  }
}
