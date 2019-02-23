import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import { isPresent } from '@ember/utils';
import { computed } from '@ember/object';
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

export default Controller.extend(Validations, {
  actions: {
    previousPage() {
      let { isFindADate } = this.model;

      if (isFindADate) {
        this.transitionToRoute('create.options-datetime');
      } else {
        this.transitionToRoute('create.options');
      }
    },
    submit() {
      if (this.validations.isValid) {
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
        poll.save()
          .then(() => {
            // reload as workaround for bug: duplicated records after save
            poll.reload().then(() => {
              // redirect to new poll
              let { key: encryptionKey } = this.encryption;

              this.transitionToRoute('poll', poll, {
                queryParams: {
                  encryptionKey,
                },
              });
            });
          })
          .catch(() => {
            // ToDo: Show feedback to user
            return;
          });
      }
    },
    updateAnswerType(answerType) {
      this.set('model.answerType', answerType);
      this.set('model.answers', answersForAnswerType(answerType));
    }
  },

  anonymousUser: alias('model.anonymousUser'),
  answerType: alias('model.answerType'),

  answerTypes: computed(function() {
    return [
      { id: 'YesNo', labelTranslation: 'answerTypes.yesNo.label' },
      { id: 'YesNoMaybe', labelTranslation: 'answerTypes.yesNoMaybe.label' },
      { id: 'FreeText', labelTranslation: 'answerTypes.freeText.label' },
    ];
  }),

  encryption: service(),

  expirationDuration: computed('model.expirationDate', {
    get() {
      // TODO: must be calculated based on model.expirationDate
      return 'P3M';
    },
    set(key, value) {
      this.set(
        'model.expirationDate',
        isPresent(value) ? moment().add(moment.duration(value)).toISOString(): ''
      );
      return value;
    }
  }),

  expirationDurations: computed('', function() {
    return [
      { id: 'P7D', labelTranslation: 'create.settings.expirationDurations.P7D' },
      { id: 'P1M', labelTranslation: 'create.settings.expirationDurations.P1M' },
      { id: 'P3M', labelTranslation: 'create.settings.expirationDurations.P3M' },
      { id: 'P6M', labelTranslation: 'create.settings.expirationDurations.P6M' },
      { id: 'P1Y', labelTranslation: 'create.settings.expirationDurations.P1Y' },
      { id: '', labelTranslation: 'create.settings.expirationDurations.never' },
    ];
  }),

  forceAnswer: alias('model.forceAnswer'),

  i18n: service(),

  init() {
    this._super(...arguments);

    this.get('i18n.locale');
  }
});
