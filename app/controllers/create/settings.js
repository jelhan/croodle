import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { isPresent } from '@ember/utils';
import { action, computed } from '@ember/object';
import answersForAnswerType from 'croodle/utils/answers-for-answer-type';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
import moment from 'moment';

const Validations = buildValidations({
  anonymousUser: validator('presence', {
    presence: true,
    dependentKeys: ['model.i18n.locale']
  }),
  answerType: [
    validator('presence', {
      presence: true,
      dependentKeys: ['model.i18n.locale']
    }),
    validator('inclusion', {
      in: ['YesNo', 'YesNoMaybe', 'FreeText'],
      dependentKeys: ['model.i18n.locale']
    })
  ],
  forceAnswer: validator('presence', true)
});

export default class CreateSettings extends Controller.extend(Validations) {
  @service
  encryption;

  @service
  i18n;

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
      isPresent(value) ? moment().add(moment.duration(value)).toISOString(): ''
    );
    return value;
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
      this.transitionToRoute('create.options-datetime');
    } else {
      this.transitionToRoute('create.options');
    }
  }

  @action
  async submit() {
    if (!this.validations.isValid) {
      return;
    }

    let poll = this.model;

    // set timezone if there is atleast one option with time
    if (
      poll.isFindADate &&
      poll.options.any(({ title }) => {
        return !moment(title, 'YYYY-MM-DD', true).isValid();
      })
    ) {
      this.set('model.timezone', moment.tz.guess());
    }

    // save poll
    try {
      await poll.save();
    } catch(err) {
      this.flashMessages.danger('error.poll.savingFailed');

      throw err;
    }

    try {
      // reload as workaround for bug: duplicated records after save
      await poll.reload();

      // redirect to new poll
      await this.transitionToRoute('poll', poll, {
        queryParams: {
          encryptionKey: this.encryption.key,
        },
      });
    } catch(err) {
      // TODO: show feedback to user
      throw err;
    }
  }

  @action
  updateAnswerType(answerType) {
    this.set('model.answerType', answerType);
    this.set('model.answers', answersForAnswerType(answerType));
  }

  init() {
    super.init(...arguments);

    this.i18n.locale;
  }
}
