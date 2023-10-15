import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { isPresent } from '@ember/utils';
import { action, computed } from '@ember/object';
import answersForAnswerType from 'croodle/utils/answers-for-answer-type';
import { DateTime, Duration } from 'luxon';

export default class CreateSettings extends Controller {
  @service encryption;
  @service intl;
  @service router;

  @alias('model.anonymousUser')
  anonymousUser;

  @alias('model.answerType')
  answerType;

  @computed
  get answerTypes() {
    return [
      { id: 'YesNo', labelTranslation: 'answerTypes.yesNo.label' },
      { id: 'YesNoMaybe', labelTranslation: 'answerTypes.yesNoMaybe.label' },
      { id: 'FreeText', labelTranslation: 'answerTypes.freeText.label' },
    ];
  }

  @computed('model.expirationDate')
  get expirationDuration() {
    // TODO: must be calculated based on model.expirationDate
    return 'P3M';
  }
  set expirationDuration(value) {
    this.set(
      'model.expirationDate',
      isPresent(value) ? DateTime.local().plus(Duration.fromISO(value)).toISO() : ''
    );
  }

  @computed
  get expirationDurations() {
    return [
      { id: 'P7D', labelTranslation: 'create.settings.expirationDurations.P7D' },
      { id: 'P1M', labelTranslation: 'create.settings.expirationDurations.P1M' },
      { id: 'P3M', labelTranslation: 'create.settings.expirationDurations.P3M' },
      { id: 'P6M', labelTranslation: 'create.settings.expirationDurations.P6M' },
      { id: 'P1Y', labelTranslation: 'create.settings.expirationDurations.P1Y' },
      { id: '', labelTranslation: 'create.settings.expirationDurations.never' },
    ];
  }

  @alias('model.forceAnswer')
  forceAnswer;

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
    const { model: poll } = this;

    // set timezone if there is atleast one option with time
    if (
      poll.isFindADate &&
      poll.options.any((option) => {
        return option.hasTime;
      })
    ) {
      this.set('model.timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);
    }

    // save poll
    try {
      await poll.save();
    } catch(err) {
      this.flashMessages.danger('error.poll.savingFailed');

      throw err;
    }

    // reload as workaround for bug: duplicated records after save
    await poll.reload();

    // redirect to new poll
    await this.router.transitionTo('poll', poll, {
      queryParams: {
        encryptionKey: this.encryption.key,
      },
    });
  }

  @action
  updateAnswerType(answerType) {
    this.set('model.answerType', answerType);
    this.set('model.answers', answersForAnswerType(answerType));
  }
}
