import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { action } from '@ember/object';
import { DateTime, Duration } from 'luxon';
import Poll from '../../native-models/poll';
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
    let { isFindADate } = this.model;

    if (isFindADate) {
      this.router.transitionTo('create.options-datetime');
    } else {
      this.router.transitionTo('create.options');
    }
  }

  @action
  async submit() {
    const { model } = this;

    try {
      const encryptionKey = generatePassphrase();

      // save poll
      const poll = await Poll.create(model, encryptionKey);

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
