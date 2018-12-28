import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
import moment from 'moment';

const {
  computed,
  Controller,
  copy,
  getOwner,
  inject,
  isEmpty,
  Object: EmberObject,
  observer
} = Ember;

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

const TranslateableObject = EmberObject.extend({
  i18n: inject.service(),
  label: computed('labelTranslation', 'i18n.locale', function() {
    return this.get('i18n').t(this.get('labelTranslation'));
  }),
  labelTranslation: undefined
});

export default Controller.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        const model = this.get('model');
        // set timezone if there is atleast one option with time
        if (
          this.get('model.isFindADate') &&
          this.get('model.options').any((option) => {
            return !moment(option.get('title'), 'YYYY-MM-DD', true).isValid();
          })
        ) {
          this.set('model.timezone', moment.tz.guess());
        }

        // save poll
        model.save()
          .then((model) => {
            // reload as workaround for bug: duplicated records after save
            model.reload().then((model) => {
              // redirect to new poll
              this.get('target').send('transitionToPoll', model);
            });
          })
          .catch(() => {
            // ToDo: Show feedback to user
            return;
          });
      }
    }
  },

  anonymousUser: computed.alias('model.anonymousUser'),
  answerType: computed.alias('model.answerType'),

  answerTypes: computed('', function() {
    const owner = getOwner(this);

    return [
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'YesNo',
        labelTranslation: 'answerTypes.yesNo.label',
        answers: [
                this.store.createFragment('answer', {
                  type: 'yes',
                  labelTranslation: 'answerTypes.yes.label',
                  icon: 'glyphicon glyphicon-thumbs-up'
                }),
                this.store.createFragment('answer', {
                  type: 'no',
                  labelTranslation: 'answerTypes.no.label',
                  icon: 'glyphicon glyphicon-thumbs-down'
                })
            ]
      }),
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'YesNoMaybe',
        labelTranslation: 'answerTypes.yesNoMaybe.label',
        answers: [
                this.store.createFragment('answer', {
                  type: 'yes',
                  labelTranslation: 'answerTypes.yes.label',
                  icon: 'glyphicon glyphicon-thumbs-up'
                }),
                this.store.createFragment('answer', {
                  type: 'maybe',
                  labelTranslation: 'answerTypes.maybe.label',
                  icon: 'glyphicon glyphicon-hand-right'
                }),
                this.store.createFragment('answer', {
                  type: 'no',
                  labelTranslation: 'answerTypes.no.label',
                  icon: 'glyphicon glyphicon-thumbs-down'
                })
            ]
      }),
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'FreeText',
        labelTranslation: 'answerTypes.freeText.label',
        answers: []
      })
    ];
  }),

  expirationDuration: 'P3M',

  expirationDurations: computed('', function() {
    const owner = getOwner(this);

    return [
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'P7D',
        labelTranslation: 'create.settings.expirationDurations.P7D'
      }),
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'P1M',
        labelTranslation: 'create.settings.expirationDurations.P1M'
      }),
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'P3M',
        labelTranslation: 'create.settings.expirationDurations.P3M'
      }),
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'P6M',
        labelTranslation: 'create.settings.expirationDurations.P6M'
      }),
      TranslateableObject.create(owner.ownerInjection(), {
        id: 'P1Y',
        labelTranslation: 'create.settings.expirationDurations.P1Y'
      }),
      TranslateableObject.create(owner.ownerInjection(), {
        id: '',
        labelTranslation: 'create.settings.expirationDurations.never'
      })
    ];
  }),

  forceAnswer: computed.alias('model.forceAnswer'),

  i18n: inject.service(),

  init() {
    this.get('i18n.locale');
  },

  /*
   * set answers depending on selected answer type
   */
  updateAnswers: observer('model.answerType', function() {
    const selectedAnswer = this.get('model.answerType');
    const answerTypes = this.get('answerTypes');
    let answers = [];

    if (selectedAnswer !== null) {
      for (let i = 0; i < answerTypes.length; i++) {
        if (answerTypes[i].id === selectedAnswer) {
          answers = answerTypes[i].answers.map(copy);
        }
      }

      this.set('model.answers', answers);
    }
  }),

  updateExpirationDate: observer('expirationDuration', function() {
    const expirationDuration = this.get('expirationDuration');

    if (isEmpty(expirationDuration)) {
      this.set('model.expirationDate', '');
    } else {
      this.set('model.expirationDate',
        moment().add(
          moment.duration(expirationDuration)
        ).toISOString()
      );
    }
  })
});
