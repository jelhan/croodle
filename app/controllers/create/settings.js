import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
/* global moment */

const Validations = buildValidations({
  anonymousUser: validator('presence', true),
  answerType: [
    validator('presence', true),
    validator('inclusion', {
      in: ['YesNo', 'YesNoMaybe', 'FreeText']
    })
  ],
  forceAnswer: validator('presence', true)
});

const TranslateableObject = Ember.Object.extend({
  i18n: Ember.inject.service(),
  label: Ember.computed('labelTranslation', 'i18n.locale', function() {
    return this.get('i18n').t(this.get('labelTranslation'));
  }),
  labelTranslation: undefined
});

export default Ember.Controller.extend(Validations, {
  actions: {
    submit() {
      if (this.get('validations.isValid')) {
        // save poll
        this.get('model').save().then((model) => {
          // reload as workaround for bug: duplicated records after save
          model.reload().then((model) => {
             // redirect to new poll
             this.get('target').send('transitionToPoll', model);
          });
        });
      }
    }
  },

  anonymousUser: Ember.computed.alias('model.anonymousUser'),
  answerType: Ember.computed.alias('model.answerType'),

  answerTypes: Ember.computed('', function() {
    var container = this.get('container');

    return [
      TranslateableObject.create({
          id : 'YesNo',
          labelTranslation : 'answerTypes.yesNo.label',
          answers : [
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
              ],
          container
      }),
      TranslateableObject.create({
          id : 'YesNoMaybe',
          labelTranslation : 'answerTypes.yesNoMaybe.label',
          answers : [
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
              ],
          container
      }),
      TranslateableObject.create({
          id : 'FreeText',
          labelTranslation : 'answerTypes.freeText.label',
          answers : [],
          container
      })
    ];
  }),

  expirationDuration: 'P3M',

  expirationDurations: Ember.computed('', function() {
    var container = this.get('container');

    return [
      TranslateableObject.create({
        id: 'P7D',
        labelTranslation: 'create.settings.expirationDurations.P7D',
        container
      }),
      TranslateableObject.create({
        id: 'P1M',
        labelTranslation: 'create.settings.expirationDurations.P1M',
        container
      }),
      TranslateableObject.create({
        id: 'P3M',
        labelTranslation: 'create.settings.expirationDurations.P3M',
        container
      }),
      TranslateableObject.create({
        id: 'P6M',
        labelTranslation: 'create.settings.expirationDurations.P6M',
        container
      }),
      TranslateableObject.create({
        id: 'P1Y',
        labelTranslation: 'create.settings.expirationDurations.P1Y',
        container
      }),
      TranslateableObject.create({
        id: '',
        labelTranslation: 'create.settings.expirationDurations.never',
        container
      })
    ];
  }),

  forceAnswer: Ember.computed.alias('model.forceAnswer'),

  /*
   * set answers depending on selected answer type
   */
  updateAnswers: Ember.observer('model.answerType', function() {
    var selectedAnswer = this.get('model.answerType'),
        answers = [],
        answerTypes = this.get('answerTypes');

    if (selectedAnswer !== null) {
      for (var i=0; i < answerTypes.length; i++) {
        if (answerTypes[i].id === selectedAnswer) {
            answers = answerTypes[i].answers.map(Ember.copy);
        }
      }

      this.set('model.answers', answers);
    }
  }),

  updateExpirationDate: Ember.observer('expirationDuration', function() {
    var expirationDuration = this.get('expirationDuration');

    if(Ember.isEmpty(expirationDuration)) {
      this.set('model.expirationDate', '');
    }
    else {
      this.set('model.expirationDate',
        moment().add(
          moment.duration(expirationDuration)
        ).toISOString()
      );
    }
  })
});
